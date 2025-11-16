"use client";

import { X, ExternalLink, FileText, Tag, Calendar } from "lucide-react";
import { LiveTimestamp } from "@/components/shared/live-timestamp";

interface DocumentDetailProps {
  document: {
    id: string;
    title: string;
    description?: string;
    content?: string;
    fileType: string;
    fileUrl?: string;
    fileSize?: number;
    author?: string;
    team?: string;
    project?: string;
    tags: string[];
    categories: Array<{ id: number; name: string; type: string }>;
    indexedAt: string;
    createdAt: string;
  };
  onClose: () => void;
}

const categoryColors: Record<string, string> = {
  TOPIC: "bg-blue-100 text-blue-700",
  PROJECT: "bg-purple-100 text-purple-700",
  TEAM: "bg-green-100 text-green-700",
  DEPARTMENT: "bg-orange-100 text-orange-700",
  GENERAL: "bg-slate-100 text-slate-700",
};

export function DocumentDetail({ document, onClose }: DocumentDetailProps) {
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <FileText size={24} className="text-slate-600" />
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {document.title}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {document.fileType} • {formatFileSize(document.fileSize)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            {document.team && (
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">
                  Team
                </label>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {document.team}
                </p>
              </div>
            )}
            {document.project && (
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">
                  Project
                </label>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {document.project}
                </p>
              </div>
            )}
            {document.author && (
              <div>
                <label className="text-xs font-semibold uppercase text-slate-500">
                  Author
                </label>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {document.author}
                </p>
              </div>
            )}
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">
                Indexed
              </label>
              <p className="mt-1 text-sm font-medium text-slate-900">
                <LiveTimestamp iso={document.indexedAt} />
              </p>
            </div>
          </div>

          {/* Categories */}
          {document.categories.length > 0 && (
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500 mb-2 block">
                Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {document.categories.map((cat) => (
                  <span
                    key={cat.id}
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${categoryColors[cat.type] || categoryColors.GENERAL}`}
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {document.tags.length > 0 && (
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500 mb-2 block">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {document.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {document.description && (
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500 mb-2 block">
                Description
              </label>
              <p className="text-sm text-slate-700">{document.description}</p>
            </div>
          )}

          {/* Content Preview */}
          {document.content && (
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500 mb-2 block">
                Content Preview
              </label>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 max-h-96 overflow-y-auto">
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {document.content}
                </p>
              </div>
            </div>
          )}

          {/* File Link */}
          <div className="pt-4 border-t border-slate-200">
            {document.fileUrl ? (
              <a
                href={document.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
                onClick={(e) => {
                  // Validate URL before opening
                  if (!document.fileUrl) {
                    e.preventDefault();
                    return;
                  }
                  // Validate URL format
                  try {
                    new URL(document.fileUrl);
                  } catch (error) {
                    e.preventDefault();
                    alert("Invalid file URL. Please check the file URL in the document data.");
                    return;
                  }
                }}
              >
                <ExternalLink size={16} />
                Open File
              </a>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed">
                <ExternalLink size={16} />
                File URL not available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

