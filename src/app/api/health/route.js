import { NextResponse } from "next/server";
import { getDatabaseStatus } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbStatus = getDatabaseStatus();

  return NextResponse.json(
    {
      status: "healthy",
      service: "dhanda-bhatta-company-backend",
      timestamp: new Date().toISOString(),
      database: {
        configured: dbStatus.hasUriConfigured,
        connected: dbStatus.isConnected,
        targetDatabase: dbStatus.targetDatabaseName,
        activeDatabase: dbStatus.databaseName,
        connectionState: dbStatus.state,
      },
    },
    { status: 200 }
  );
}
