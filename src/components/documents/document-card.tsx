"use client";

import { FileText, Image, File, Video, Music, FileSpreadsheet, Presentation, ExternalLink, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { LiveTimestamp } from "@/components/shared/live-timestamp";

interface DocumentCardProps {
  document: {
    id: string;
    title: string;
    description?: string;
    fileType: string;
    fileUrl?: string;
    fileSize?: number;
    author?: string;
    team?: string;
    project?: string;
    tags: string[];
    categories: Array<{ id: number; name: string; type: string }>;
    indexedAt: string;
  };
  onSelect?: (document: any) => void;
}

const fileTypeIcons: Record<string, any> = {
  PDF: FileText,
  DOCX: FileText,
  DOC: FileText,
  TXT: FileText,
  MARKDOWN: FileText,
  HTML: FileText,
  IMAGE: Image,
  SPREADSHEET: FileSpreadsheet,
  PRESENTATION: Presentation,
  VIDEO: Video,
  AUDIO: Music,
  OTHER: File,
};

const categoryColors: Record<string, string> = {
  TOPIC: "bg-blue-100 text-blue-700",
  PROJECT: "bg-purple-100 text-purple-700",
  TEAM: "bg-green-100 text-green-700",
  DEPARTMENT: "bg-orange-100 text-orange-700",
  GENERAL: "bg-slate-100 text-slate-700",
};

export function DocumentCard({ document, onSelect }: DocumentCardProps) {
  const FileIcon = fileTypeIcons[document.fileType] || File;

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className="card-border-glow w-full max-w-full rounded-xl bg-white p-3 sm:p-4 transition-all duration-300 hover:shadow-md hover:shadow-slate-300/50 cursor-pointer"
      onClick={() => onSelect?.(document)}
    >
      <div className="flex items-start gap-2 sm:gap-3 md:gap-4 min-w-0">
        <div className="flex-shrink-0 rounded-lg bg-slate-100 p-2 sm:p-3">
          <FileIcon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
        </div>

        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-start justify-between gap-2 mb-1.5 sm:mb-2 min-w-0">
            <h3 className="font-semibold text-sm sm:text-base text-slate-900 line-clamp-2 min-w-0 flex-1">
              {document.title}
            </h3>
            {document.fileUrl && (
              <a
                href={document.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-shrink-0 text-slate-400 hover:text-slate-900 p-1"
              >
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            )}
          </div>

          {document.description && (
            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-2 sm:mb-3">
              {document.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            {document.categories.map((cat) => (
              <span
                key={cat.id}
                className={`inline-flex items-center rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium whitespace-nowrap ${categoryColors[cat.type] || categoryColors.GENERAL}`}
              >
                {cat.name}
              </span>
            ))}
            {document.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-0.5 sm:gap-1 rounded-full bg-slate-100 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs text-slate-600 whitespace-nowrap"
              >
                <Tag className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-xs text-slate-500">
            <LiveTimestamp iso={document.indexedAt} />
            {document.team && (
              <>
                <span>•</span>
                <span>{document.team}</span>
              </>
            )}
            {document.project && (
              <>
                <span>•</span>
                <span>{document.project}</span>
              </>
            )}
            {document.fileSize && (
              <>
                <span>•</span>
                <span>{formatFileSize(document.fileSize)}</span>
              </>
            )}
            {document.author && (
              <>
                <span>•</span>
                <span>{document.author}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

