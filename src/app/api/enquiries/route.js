import { NextResponse } from "next/server";
import { createEnquiry } from "@/services/enquiryService";
import { checkRateLimit, getClientIdentifier } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 64 * 1024; // 64 KB limit

export async function POST(request) {
  try {
    // 1. Rate Limiting Check
    const rateLimit = await checkRateLimit(request, {
      prefix: "enquiry",
      limit: 5,
      windowMs: 60 * 1000,
    });

    const rateLimitHeaders = {
      "X-RateLimit-Limit": String(rateLimit.limit),
      "X-RateLimit-Remaining": String(rateLimit.remaining),
      "X-RateLimit-Reset": String(rateLimit.reset),
    };

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many submission attempts. Please wait a minute before sending another enquiry.",
        },
        { status: 429, headers: rateLimitHeaders }
      );
    }

    // 2. Content-Type Validation
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { success: false, message: "Invalid Content-Type. Expected application/json." },
        { status: 415, headers: rateLimitHeaders }
      );
    }

    // 3. Payload Size Guard
    const rawText = await request.text();
    if (Buffer.byteLength(rawText, "utf8") > MAX_BODY_BYTES) {
      return NextResponse.json(
        { success: false, message: "Payload too large. Maximum size is 64KB." },
        { status: 413, headers: rateLimitHeaders }
      );
    }

    let body;
    try {
      body = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { success: false, message: "Malformed JSON payload in request." },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    // 4. Derive Client Metadata for Security
    const clientInfo = getClientIdentifier(request);

    // 5. Service Processing & Storage
    const result = await createEnquiry(body, clientInfo);

    return NextResponse.json(
      {
        success: true,
        reference: result.reference,
        message: result.message,
        submittedAt: result.submittedAt,
        isPersisted: result.isPersisted,
      },
      { status: 201, headers: rateLimitHeaders }
    );
  } catch (error) {
    if (error.status === 400) {
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Invalid enquiry submission data",
          details: error.details || null,
        },
        { status: 400 }
      );
    }

    console.error("[api/enquiries] Unhandled error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An internal error occurred while processing your enquiry. Please try again.",
      },
      { status: 500 }
    );
  }
}

// STRICT SECURITY: Public read/update/delete operations are forbidden.
export async function GET() {
  return new NextResponse(
    JSON.stringify({ error: "Method Not Allowed. Enquiries cannot be read through public endpoints." }),
    { status: 405, headers: { Allow: "POST", "Content-Type": "application/json" } }
  );
}

export async function PUT() {
  return new NextResponse(
    JSON.stringify({ error: "Method Not Allowed" }),
    { status: 405, headers: { Allow: "POST", "Content-Type": "application/json" } }
  );
}

export async function PATCH() {
  return new NextResponse(
    JSON.stringify({ error: "Method Not Allowed" }),
    { status: 405, headers: { Allow: "POST", "Content-Type": "application/json" } }
  );
}

export async function DELETE() {
  return new NextResponse(
    JSON.stringify({ error: "Method Not Allowed" }),
    { status: 405, headers: { Allow: "POST", "Content-Type": "application/json" } }
  );
}
