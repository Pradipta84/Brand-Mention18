import { prisma } from "@/lib/prisma";
import { QueryChannel, QueryPriority, QueryStatus, QueryTagType } from "@/generated/prisma/client";
import { autoTagQuery, detectPriority } from "./classifier";

export interface RawQuery {
  channel: string;
  sourceId?: string;
  authorName: string;
  authorEmail?: string;
  authorHandle?: string;
  subject?: string;
  body: string;
  sourceUrl?: string;
  receivedAt?: Date;
  priority?: QueryPriority;
  status?: QueryStatus;
  tags?: QueryTagType[];
}

/**
 * Process and store a query in the database
 */
export async function processQuery(raw: RawQuery): Promise<string> {
  try {
    // Map channel string to enum
    const channelMap: Record<string, QueryChannel> = {
      email: QueryChannel.EMAIL,
      twitter: QueryChannel.TWITTER,
      reddit: QueryChannel.REDDIT,
      chat: QueryChannel.CHAT,
      forum: QueryChannel.FORUM,
      support_ticket: QueryChannel.SUPPORT_TICKET,
      other: QueryChannel.OTHER,
    };

    const channel = channelMap[raw.channel?.toLowerCase()] || QueryChannel.OTHER;

    // Auto-detect priority if not provided
    const priority = raw.priority || detectPriority(raw.subject || null, raw.body, channel);

    // Check if query already exists (by sourceId if provided)
    if (raw.sourceId) {
      const existing = await (prisma as any).query.findFirst({
        where: {
          sourceId: raw.sourceId,
          channel,
        },
      });

      if (existing) {
        // Update existing query
        await (prisma as any).query.update({
          where: { id: existing.id },
          data: {
            body: raw.body,
            subject: raw.subject,
            updatedAt: new Date(),
          },
        });
        return existing.id;
      }
    }

    // Determine status and resolvedAt
    const status = raw.status || QueryStatus.NEW;
    const receivedAt = raw.receivedAt || new Date();
    const updateData: any = {
      channel,
      sourceId: raw.sourceId,
      authorName: raw.authorName,
      authorEmail: raw.authorEmail,
      authorHandle: raw.authorHandle,
      subject: raw.subject,
      body: raw.body,
      sourceUrl: raw.sourceUrl,
      priority,
      status,
      receivedAt,
    };

    // Set resolvedAt if status is RESOLVED or CLOSED
    if (status === QueryStatus.RESOLVED || status === QueryStatus.CLOSED) {
      updateData.resolvedAt = receivedAt;
    }

    // Create new query
    const query = await (prisma as any).query.create({
      data: updateData,
    });

    // Auto-tag the query
    const tagTypes = raw.tags || autoTagQuery(raw.subject || null, raw.body);

    // Get or create tags
    for (const tagType of tagTypes) {
      // Find or create tag
      let tag = await (prisma as any).queryTag.findFirst({
        where: { type: tagType },
      });

      if (!tag) {
        // Create tag with label based on type
        const tagLabels: Record<QueryTagType, string> = {
          [QueryTagType.QUESTION]: "Question",
          [QueryTagType.REQUEST]: "Request",
          [QueryTagType.COMPLAINT]: "Complaint",
          [QueryTagType.FEEDBACK]: "Feedback",
          [QueryTagType.BUG_REPORT]: "Bug Report",
          [QueryTagType.FEATURE_REQUEST]: "Feature Request",
          [QueryTagType.BILLING]: "Billing",
          [QueryTagType.TECHNICAL]: "Technical",
          [QueryTagType.GENERAL]: "General",
        };

        tag = await (prisma as any).queryTag.create({
          data: {
            label: tagLabels[tagType],
            type: tagType,
          },
        });
      }

      // Link query to tag
      await (prisma as any).queryTagRelation.upsert({
        where: {
          queryId_tagId: {
            queryId: query.id,
            tagId: tag.id,
          },
        },
        create: {
          queryId: query.id,
          tagId: tag.id,
        },
        update: {},
      });
    }

    // Create initial history entry
    await (prisma as any).queryHistory.create({
      data: {
        queryId: query.id,
        action: "created",
        newValue: status,
        notes: status === QueryStatus.RESOLVED || status === QueryStatus.CLOSED
          ? "Query received and auto-tagged (already resolved)"
          : "Query received and auto-tagged",
      },
    });

    return query.id;
  } catch (error) {
    console.error("Error processing query:", error);
    throw error;
  }
}

/**
 * Assign a query to a user
 */
export async function assignQuery(
  queryId: string,
  assigneeId: string,
  notes?: string
): Promise<void> {
  try {
    // Check if assignment already exists
    const existing = await (prisma as any).queryAssignment.findFirst({
      where: { queryId },
    });

    if (existing) {
      // Update existing assignment
      await (prisma as any).queryAssignment.update({
        where: { id: existing.id },
        data: {
          assigneeId,
          notes,
        },
      });
    } else {
      // Create new assignment
      await (prisma as any).queryAssignment.create({
        data: {
          queryId,
          assigneeId,
          notes,
        },
      });
    }

    // Update query status
    const query = await (prisma as any).query.findUnique({
      where: { id: queryId },
    });

    if (query && query.status === QueryStatus.NEW) {
      await (prisma as any).query.update({
        where: { id: queryId },
        data: { status: QueryStatus.ASSIGNED },
      });

      // Record history
      await (prisma as any).queryHistory.create({
        data: {
          queryId,
          userId: assigneeId,
          action: "assigned",
          newValue: assigneeId,
          notes: notes || "Query assigned",
        },
      });
    }
  } catch (error) {
    console.error("Error assigning query:", error);
    throw error;
  }
}

/**
 * Update query status
 */
export async function updateQueryStatus(
  queryId: string,
  newStatus: QueryStatus,
  userId?: string,
  notes?: string
): Promise<void> {
  try {
    const query = await (prisma as any).query.findUnique({
      where: { id: queryId },
    });

    if (!query) {
      throw new Error("Query not found");
    }

    const oldStatus = query.status;

    // Update status
    const updateData: any = { status: newStatus };

    // Set firstResponseAt if moving from NEW/ASSIGNED to IN_PROGRESS
    if (
      (oldStatus === QueryStatus.NEW || oldStatus === QueryStatus.ASSIGNED) &&
      newStatus === QueryStatus.IN_PROGRESS &&
      !query.firstResponseAt
    ) {
      updateData.firstResponseAt = new Date();
    }

    // Set resolvedAt if resolving
    if (newStatus === QueryStatus.RESOLVED || newStatus === QueryStatus.CLOSED) {
      updateData.resolvedAt = new Date();
    }

    await (prisma as any).query.update({
      where: { id: queryId },
      data: updateData,
    });

    // Record history
    await (prisma as any).queryHistory.create({
      data: {
        queryId,
        userId: userId || null,
        action: "status_changed",
        oldValue: oldStatus,
        newValue: newStatus,
        notes: notes || `Status changed from ${oldStatus} to ${newStatus}`,
      },
    });
  } catch (error) {
    console.error("Error updating query status:", error);
    throw error;
  }
}

/**
 * Update query priority
 */
export async function updateQueryPriority(
  queryId: string,
  newPriority: QueryPriority,
  userId?: string,
  notes?: string
): Promise<void> {
  try {
    const query = await (prisma as any).query.findUnique({
      where: { id: queryId },
    });

    if (!query) {
      throw new Error("Query not found");
    }

    const oldPriority = query.priority;

    await (prisma as any).query.update({
      where: { id: queryId },
      data: { priority: newPriority },
    });

    // Record history
    await (prisma as any).queryHistory.create({
      data: {
        queryId,
        userId: userId || null,
        action: "priority_updated",
        oldValue: oldPriority,
        newValue: newPriority,
        notes: notes || `Priority updated from ${oldPriority} to ${newPriority}`,
      },
    });
  } catch (error) {
    console.error("Error updating query priority:", error);
    throw error;
  }
}

