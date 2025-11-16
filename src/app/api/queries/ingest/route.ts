import { NextResponse } from "next/server";
import { processQuery } from "@/lib/query/processor";
import { QueryPriority, QueryStatus, QueryTagType } from "@/generated/prisma/client";

interface IngestRequest {
  channel: string;
  sourceId?: string;
  authorName: string;
  authorEmail?: string;
  authorHandle?: string;
  subject?: string;
  body: string;
  sourceUrl?: string;
  receivedAt?: string;
  priority?: string;
  status?: string;
  tags?: string[];
}

export async function POST(request: Request) {
  try {
    const body: IngestRequest = await request.json();

    // Validate required fields
    if (!body.channel || !body.authorName || !body.body) {
      return NextResponse.json(
        { error: "Missing required fields: channel, authorName, body" },
        { status: 400 }
      );
    }

    // Map priority string to enum
    let priority: QueryPriority | undefined;
    if (body.priority) {
      const priorityMap: Record<string, QueryPriority> = {
        low: QueryPriority.LOW,
        medium: QueryPriority.MEDIUM,
        high: QueryPriority.HIGH,
        urgent: QueryPriority.URGENT,
      };
      priority = priorityMap[body.priority.toLowerCase()];
    }

    // Map status string to enum
    let status: QueryStatus | undefined;
    if (body.status) {
      const statusMap: Record<string, QueryStatus> = {
        new: QueryStatus.NEW,
        assigned: QueryStatus.ASSIGNED,
        in_progress: QueryStatus.IN_PROGRESS,
        waiting_customer: QueryStatus.WAITING_CUSTOMER,
        resolved: QueryStatus.RESOLVED,
        closed: QueryStatus.CLOSED,
      };
      status = statusMap[body.status.toLowerCase()];
    }

    // Map tags string to enum
    let tags: QueryTagType[] | undefined;
    if (body.tags && body.tags.length > 0) {
      const tagMap: Record<string, QueryTagType> = {
        question: QueryTagType.QUESTION,
        request: QueryTagType.REQUEST,
        complaint: QueryTagType.COMPLAINT,
        feedback: QueryTagType.FEEDBACK,
        bug_report: QueryTagType.BUG_REPORT,
        feature_request: QueryTagType.FEATURE_REQUEST,
        billing: QueryTagType.BILLING,
        technical: QueryTagType.TECHNICAL,
        general: QueryTagType.GENERAL,
      };
      tags = body.tags
        .map((t) => tagMap[t.toLowerCase()])
        .filter((t) => t !== undefined) as QueryTagType[];
    }

    // Process the query
    const queryId = await processQuery({
      channel: body.channel,
      sourceId: body.sourceId,
      authorName: body.authorName,
      authorEmail: body.authorEmail,
      authorHandle: body.authorHandle,
      subject: body.subject,
      body: body.body,
      sourceUrl: body.sourceUrl,
      receivedAt: body.receivedAt ? new Date(body.receivedAt) : undefined,
      priority,
      status,
      tags,
    });

    return NextResponse.json({ success: true, queryId });
  } catch (error) {
    console.error("Error ingesting query:", error);
    return NextResponse.json(
      { error: "Failed to ingest query" },
      { status: 500 }
    );
  }
}

