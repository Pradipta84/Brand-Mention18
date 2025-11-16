import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { QueryStatus, QueryPriority, QueryChannel } from "@/generated/prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const channel = searchParams.get("channel");
    const assigneeId = searchParams.get("assigneeId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {};

    if (status) {
      where.status = status.toUpperCase() as QueryStatus;
    }

    if (priority) {
      where.priority = priority.toUpperCase() as QueryPriority;
    }

    if (channel) {
      where.channel = channel.toUpperCase() as QueryChannel;
    }

    if (assigneeId) {
      where.assignments = {
        some: {
          assigneeId,
        },
      };
    }

    const [queries, total] = await Promise.all([
      (prisma as any).query.findMany({
        where,
        take: limit,
        skip: offset,
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
            take: 5,
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
      }),
      (prisma as any).query.count({ where }),
    ]);

    const formattedQueries = queries.map((query: any) => ({
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

    return NextResponse.json({
      queries: formattedQueries,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching queries:", error);
    return NextResponse.json(
      { error: "Failed to fetch queries" },
      { status: 500 }
    );
  }
}

