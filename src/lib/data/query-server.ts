import { prisma } from "@/lib/prisma";
import { QueryStatus, QueryPriority, QueryChannel } from "@/generated/prisma/client";

export interface Query {
  id: string;
  channel: string;
  sourceId?: string;
  authorName: string;
  authorEmail?: string;
  authorHandle?: string;
  subject?: string;
  body: string;
  priority: string;
  status: string;
  sourceUrl?: string;
  receivedAt: string;
  firstResponseAt?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  tags: Array<{
    id: number;
    label: string;
    type: string;
  }>;
  assignee?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  assignmentNotes?: string | null;
  history: Array<{
    id: string;
    action: string;
    oldValue: string | null;
    newValue: string | null;
    notes: string | null;
    createdAt: string;
    user: {
      id: string;
      name: string | null;
      email: string;
    } | null;
  }>;
}

export interface QueryStats {
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  byChannel: Record<string, number>;
  new: number;
  assigned: number;
  inProgress: number;
  resolved: number;
  urgent: number;
  high: number;
}

export async function getQueries(
  filters?: {
    status?: QueryStatus;
    priority?: QueryPriority;
    channel?: QueryChannel;
    assigneeId?: string;
  },
  limit = 50
): Promise<Query[]> {
  try {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.priority) {
      where.priority = filters.priority;
    }

    if (filters?.channel) {
      where.channel = filters.channel;
    }

    if (filters?.assigneeId) {
      where.assignments = {
        some: {
          assigneeId: filters.assigneeId,
        },
      };
    }

    const queries = await (prisma as any).query.findMany({
      where,
      take: limit,
      orderBy: [
        { priority: "desc" },
        { receivedAt: "desc" },
      ],
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        assignments: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            assignedAt: "desc",
          },
          take: 1,
        },
        history: {
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return queries.map((query: any) => ({
      id: query.id,
      channel: query.channel,
      sourceId: query.sourceId,
      authorName: query.authorName,
      authorEmail: query.authorEmail,
      authorHandle: query.authorHandle,
      subject: query.subject,
      body: query.body,
      priority: query.priority,
      status: query.status,
      sourceUrl: query.sourceUrl,
      receivedAt: query.receivedAt.toISOString(),
      firstResponseAt: query.firstResponseAt?.toISOString(),
      resolvedAt: query.resolvedAt?.toISOString(),
      createdAt: query.createdAt.toISOString(),
      updatedAt: query.updatedAt.toISOString(),
      tags: query.tags.map((qt: any) => ({
        id: qt.tag.id,
        label: qt.tag.label,
        type: qt.tag.type,
      })),
      assignee: query.assignments[0]?.assignee || null,
      assignmentNotes: query.assignments[0]?.notes || null,
      history: query.history.map((h: any) => ({
        id: h.id,
        action: h.action,
        oldValue: h.oldValue,
        newValue: h.newValue,
        notes: h.notes,
        createdAt: h.createdAt.toISOString(),
        user: h.user ? {
          id: h.user.id,
          name: h.user.name,
          email: h.user.email,
        } : null,
      })),
    }));
  } catch (error) {
    console.error("Error fetching queries:", error);
    return [];
  }
}

export async function getQueryStats(): Promise<QueryStats> {
  try {
    const [total, byStatus, byPriority, byChannel] = await Promise.all([
      (prisma as any).query.count(),
      (prisma as any).query.groupBy({
        by: ["status"],
        _count: true,
      }),
      (prisma as any).query.groupBy({
        by: ["priority"],
        _count: true,
      }),
      (prisma as any).query.groupBy({
        by: ["channel"],
        _count: true,
      }),
    ]);

    const statusMap: Record<string, number> = {};
    byStatus.forEach((item: any) => {
      statusMap[item.status] = item._count;
    });

    const priorityMap: Record<string, number> = {};
    byPriority.forEach((item: any) => {
      priorityMap[item.priority] = item._count;
    });

    const channelMap: Record<string, number> = {};
    byChannel.forEach((item: any) => {
      channelMap[item.channel] = item._count;
    });

    return {
      total,
      byStatus: statusMap,
      byPriority: priorityMap,
      byChannel: channelMap,
      new: statusMap["NEW"] || 0,
      assigned: statusMap["ASSIGNED"] || 0,
      inProgress: statusMap["IN_PROGRESS"] || 0,
      resolved: statusMap["RESOLVED"] || 0,
      urgent: priorityMap["URGENT"] || 0,
      high: priorityMap["HIGH"] || 0,
    };
  } catch (error) {
    console.error("Error fetching query stats:", error);
    return {
      total: 0,
      byStatus: {},
      byPriority: {},
      byChannel: {},
      new: 0,
      assigned: 0,
      inProgress: 0,
      resolved: 0,
      urgent: 0,
      high: 0,
    };
  }
}

