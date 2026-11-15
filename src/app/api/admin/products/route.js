import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/server/requireAdmin";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { logSecurityEvent } from "@/lib/security/auditLogger";

export const dynamic = "force-dynamic";

const ProductInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must contain only lowercase letters, numbers, and hyphens.",
    }),
  category: z.string().trim().default("Structural Masonry"),
  grade: z.string().trim().optional().default(""),
  shortDescription: z.string().trim().min(10).max(300),
  description: z.string().trim().min(20),
  images: z
    .array(
      z.object({
        url: z.string().trim().min(1),
        alt: z.string().trim().min(1),
        caption: z.string().trim().optional().default(""),
        isPrimary: z.boolean().optional().default(false),
      })
    )
    .default([]),
  specifications: z
    .array(
      z.object({
        label: z.string().trim().min(1),
        value: z.string().trim().min(1),
      })
    )
    .default([]),
  applications: z.array(z.string().trim()).default([]),
  availability: z.string().trim().default("Available for Batch Orders"),
  availabilityStatus: z
    .enum(["available", "low_stock", "out_of_stock", "made_to_order"])
    .default("available"),
  featured: z.boolean().default(false),
  displayOrder: z.coerce.number().default(0),
  status: z.enum(["published", "draft", "archived"]).default("published"),
  seo: z
    .object({
      title: z.string().trim().optional().default(""),
      description: z.string().trim().optional().default(""),
    })
    .default({}),
});

export async function GET(request) {
  try {
    await requireAdmin({ isApi: true, headers: request.headers });

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "";
    const featured = searchParams.get("featured");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const sort = searchParams.get("sort") || "displayOrder";

    const filter = { isArchived: { $ne: true } };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    if (featured === "true") filter.featured = true;
    if (featured === "false") filter.featured = false;

    let sortObj = { displayOrder: 1, createdAt: -1 };
    if (sort === "newest") sortObj = { createdAt: -1 };
    if (sort === "oldest") sortObj = { createdAt: 1 };
    if (sort === "name") sortObj = { name: 1 };

    let total = 0;
    let products = [];

    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      total = await Product.countDocuments(filter);
      products = await Product.find(filter)
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
    }

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err) {
    const status = err.status || 500;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch products" },
      { status }
    );
  }
}

export async function POST(request) {
  try {
    const { user } = await requireAdmin({ isApi: true, headers: request.headers });

    const raw = await request.json().catch(() => ({}));
    const parseRes = ProductInputSchema.safeParse(raw);

    if (!parseRes.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed for product",
          errors: parseRes.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parseRes.data;

    await connectToDatabase();

    // Enforce unique slug
    const existing = await Product.findOne({ slug: data.slug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: `Product slug "${data.slug}" already exists. Slugs must be unique.` },
        { status: 409 }
      );
    }

    const newProduct = await Product.create({
      ...data,
      isArchived: false,
    });

    await logSecurityEvent({
      eventType: "ADMIN_LOGIN_SUCCESS", // Reuse security audit format or custom mutation
      adminId: user.id,
      adminEmail: user.email,
      outcome: "SUCCESS",
      headers: request.headers,
      details: { action: "PRODUCT_CREATED", productId: newProduct._id.toString(), slug: newProduct.slug },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: newProduct,
      },
      { status: 201 }
    );
  } catch (err) {
    const status = err.status || 500;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to create product" },
      { status }
    );
  }
}
