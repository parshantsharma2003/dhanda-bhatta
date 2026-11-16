import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/server/requireAdmin";
import connectToDatabase from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { logSecurityEvent } from "@/lib/security/auditLogger";

export const dynamic = "force-dynamic";

const SettingsUpdateSchema = z.object({
  business: z
    .object({
      name: z.string().trim().min(2).optional(),
      description: z.string().trim().optional(),
      address: z.string().trim().optional(),
      phone: z.string().trim().optional(),
      phoneDisplay: z.string().trim().optional(),
      whatsappNumber: z.string().trim().optional(),
      email: z.string().trim().email().optional(),
      googleMapsUrl: z.string().trim().url().optional().or(z.literal("")),
      embeddedMapUrl: z.string().trim().optional().or(z.literal("")),
      logoUrl: z.string().trim().optional().or(z.literal("")),
      openingHours: z.string().trim().optional(),
      deliveryAvailabilityMessage: z.string().trim().optional(),
      serviceableLocations: z.array(z.string().trim()).optional(),
    })
    .optional(),
  social: z
    .object({
      facebook: z.string().trim().url().optional().or(z.literal("")),
      instagram: z.string().trim().url().optional().or(z.literal("")),
      youtube: z.string().trim().url().optional().or(z.literal("")),
    })
    .optional(),
  delivery: z
    .object({
      zones: z
        .array(
          z.object({
            name: z.string().trim(),
            district: z.string().trim(),
            maxDistanceKm: z.coerce.number(),
            minOrderQuantity: z.coerce.number(),
            estimatedDays: z.string().trim(),
          })
        )
        .optional(),
      vehicleTypes: z.array(z.string().trim()).optional(),
      unloadingNotice: z.string().trim().optional(),
    })
    .optional(),
  seo: z
    .object({
      defaultTitle: z.string().trim().optional(),
      defaultDescription: z.string().trim().optional(),
      defaultOgImage: z.string().trim().optional(),
      robotsIndexing: z.boolean().optional(),
    })
    .optional(),
});

export async function GET(request) {
  try {
    await requireAdmin({ isApi: true, headers: request.headers });

    await connectToDatabase();
    let settings = await SiteSettings.findOne({ key: "general" }).lean();

    if (!settings) {
      settings = await SiteSettings.create({ key: "general" });
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (err) {
    const status = err.status || 500;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch settings" },
      { status }
    );
  }
}

export async function PUT(request) {
  try {
    const { user } = await requireAdmin({ isApi: true, headers: request.headers });

    const raw = await request.json().catch(() => ({}));
    const parseRes = SettingsUpdateSchema.safeParse(raw);

    if (!parseRes.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: parseRes.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parseRes.data;
    await connectToDatabase();

    let settings = await SiteSettings.findOne({ key: "general" });
    if (!settings) {
      settings = new SiteSettings({ key: "general" });
    }

    if (data.business) Object.assign(settings.business, data.business);
    if (data.social) Object.assign(settings.social, data.social);
    if (data.delivery) Object.assign(settings.delivery, data.delivery);
    if (data.seo) Object.assign(settings.seo, data.seo);

    settings.updatedBy = user.email || user.name || "Administrator";
    await settings.save();

    await logSecurityEvent({
      eventType: "ADMIN_LOGIN_SUCCESS",
      adminId: user.id,
      adminEmail: user.email,
      outcome: "SUCCESS",
      headers: request.headers,
      details: { action: "SETTINGS_UPDATED" },
    });

    try {
      revalidatePath("/", "layout");
    } catch (e) {
      console.warn("[revalidatePath] Error invalidating settings cache:", e.message);
    }

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (err) {
    const status = err.status || 500;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update settings" },
      { status }
    );
  }
}
