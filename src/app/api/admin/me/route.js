import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/requireAdmin";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { user, session } = await requireAdmin({
      isApi: true,
      headers: request.headers,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          twoFactorEnabled: Boolean(user.twoFactorEnabled),
          sessionId: session.id,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const status = error.status || 401;
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Unauthorized admin access",
        code: error.code || "UNAUTHORIZED",
      },
      { status }
    );
  }
}
