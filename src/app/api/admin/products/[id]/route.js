import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/server/requireAdmin";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import OrderRequest from "@/models/OrderRequest";
import { logSecurityEvent } from "@/lib/security/auditLogger";

export const dynamic = "force-dynamic";

const ProductUpdateSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  category: z.string().trim().optional(),
  grade: z.string().trim().optional(),
  shortDescription: z.string().trim().min(10).max(300).optional(),
  description: z.string().trim().min(20).optional(),
  images: z
    .array(
      z.object({
        url: z.string().trim().min(1),
        alt: z.string().trim().min(1),
        caption: z.string().trim().optional(),
        isPrimary: z.boolean().optional(),
      })
    )
    .optional(),
  specifications: z
    .array(
      z.object({
        label: z.string().trim().min(1),
        value: z.string().trim().min(1),
      })
    )
    .optional(),
  applications: z.array(z.string().trim()).optional(),
  availability: z.string().trim().optional(),
  availabilityStatus: z
    .enum(["available", "low_stock", "out_of_stock", "made_to_order"])
    .optional(),
  featured: z.boolean().optional(),
  displayOrder: z.coerce.number().optional(),
  status: z.enum(["published", "draft", "archived"]).optional(),
  seo: z
    .object({
      title: z.string().trim().optional(),
      description: z.string().trim().optional(),
    })
    .optional(),
});

export async function GET(request, context) {
  try {
    await requireAdmin({ isApi: true, headers: request.headers });
    const { id } = await context.params;

    await connectToDatabase();
    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (err) {
    const status = err.status || 500;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch product" },
      { status }
    );
  }
}

export async function PUT(request, context) {
  try {
    const { user } = await requireAdmin({ isApi: true, headers: request.headers });
    const { id } = await context.params;

    const raw = await request.json().catch(() => ({}));
    const parseRes = ProductUpdateSchema.safeParse(raw);

    if (!parseRes.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: parseRes.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parseRes.data;
    await connectToDatabase();

    const existing = await Product.findById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Check slug uniqueness if changed
    if (data.slug && data.slug !== existing.slug) {
      const duplicateSlug = await Product.findOne({
        slug: data.slug,
        _id: { $ne: id },
      });
      if (duplicateSlug) {
        return NextResponse.json(
          { success: false, message: `Slug "${data.slug}" is already in use by another product.` },
          { status: 409 }
        );
      }
    }

    Object.assign(existing, data);
    await existing.save();

    await logSecurityEvent({
      eventType: "ADMIN_LOGIN_SUCCESS",
      adminId: user.id,
      adminEmail: user.email,
      outcome: "SUCCESS",
      headers: request.headers,
      details: { action: "PRODUCT_UPDATED", productId: id, slug: existing.slug },
    });

    try {
      revalidatePath("/products");
      revalidatePath("/");
      if (existing.slug) {
        revalidatePath(`/products/${existing.slug}`);
      }
    } catch (e) {
      console.warn("[revalidatePath] Error invalidating product cache:", e.message);
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: existing,
    });
  } catch (err) {
    const status = err.status || 500;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update product" },
      { status }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const { user } = await requireAdmin({ isApi: true, headers: request.headers });
    const { id } = await context.params;

    await connectToDatabase();
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Referential integrity check: check if product is referenced in historical orders
    const historicalOrderCount = await OrderRequest.countDocuments({
      $or: [
        { selectedProduct: product.name },
        { "productSnapshot.name": product.name },
      ],
    });

    // Soft delete / archive to protect historical integrity
    product.isArchived = true;
    product.status = "archived";
    await product.save();

    await logSecurityEvent({
      eventType: "ADMIN_LOGIN_SUCCESS",
      adminId: user.id,
      adminEmail: user.email,
      outcome: "SUCCESS",
      headers: request.headers,
      details: {
        action: "PRODUCT_ARCHIVED",
        productId: id,
        historicalOrderReferences: historicalOrderCount,
      },
    });

    try {
      revalidatePath("/products");
      revalidatePath("/");
      if (product.slug) {
        revalidatePath(`/products/${product.slug}`);
      }
    } catch (e) {
      console.warn("[revalidatePath] Error invalidating product cache:", e.message);
    }

    return NextResponse.json({
      success: true,
      message: `Product "${product.name}" was successfully archived.`,
      preservedHistoricalReferences: historicalOrderCount,
    });
  } catch (err) {
    const status = err.status || 500;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to archive product" },
      { status }
    );
  }
}
