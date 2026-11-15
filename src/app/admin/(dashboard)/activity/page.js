import connectToDatabase from "@/lib/db";
import SecurityAuditLog from "@/models/SecurityAuditLog";
import ActivityLogsClient from "./ActivityLogsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Activity Audit Logs | Kiln Admin | Dhanda Bhatta Company",
  description: "Chronological security and administrative action audit trail for regulatory compliance.",
};

async function getInitialLogs() {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const limit = 20;

      const [logs, total] = await Promise.all([
        SecurityAuditLog.find({})
          .sort({ createdAt: -1 })
          .limit(limit)
          .lean(),
        SecurityAuditLog.countDocuments({}),
      ]);

      return {
        logs: JSON.parse(JSON.stringify(logs)),
        pagination: {
          total,
          page: 1,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      };
    }
  } catch (err) {
    console.error("[ActivityLogsPage] Error loading logs:", err);
  }

  return { logs: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 1 } };
}

export default async function ActivityLogsPage() {
  const { logs, pagination } = await getInitialLogs();
  return <ActivityLogsClient initialLogs={logs} initialPagination={pagination} />;
}
