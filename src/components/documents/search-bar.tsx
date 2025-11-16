"use client";

import { Search, Filter, X } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange?: (filters: {
    fileType?: string;
    team?: string;
    project?: string;
    category?: string;
  }) => void;
  initialQuery?: string;
}

export function SearchBar({ onSearch, onFilterChange, initialQuery = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{
    fileType?: string;
    team?: string;
    project?: string;
    category?: string;
  }>({});

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange?.({});
  };

  return (
    <div className="w-full max-w-full space-y-3 sm:space-y-4">
      <div className="relative w-full max-w-full">
        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
        <input
          type="text"
          placeholder="Search documents, content..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full max-w-full rounded-xl border border-slate-200 bg-white py-2.5 sm:py-3 pl-10 sm:pl-12 pr-3 sm:pr-4 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-slate-200 bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 touch-manipulation"
        >
          <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>
        {(filters.fileType || filters.team || filters.project || filters.category) && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 touch-manipulation"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Clear
          </button>
        )}
      </div>

      {showFilters && (
        <div className="w-full max-w-full rounded-xl border border-slate-200 bg-white p-3 sm:p-4 overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            <div className="min-w-0">
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                File Type
              </label>
              <select
                value={filters.fileType || ""}
                onChange={(e) => handleFilterChange("fileType", e.target.value)}
                className="w-full max-w-full rounded-lg border border-slate-200 bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value="" className="text-slate-900">All Types</option>
                <option value="pdf" className="text-slate-900">PDF</option>
                <option value="docx" className="text-slate-900">Word</option>
                <option value="txt" className="text-slate-900">Text</option>
                <option value="markdown" className="text-slate-900">Markdown</option>
                <option value="image" className="text-slate-900">Image</option>
                <option value="spreadsheet" className="text-slate-900">Spreadsheet</option>
                <option value="presentation" className="text-slate-900">Presentation</option>
              </select>
            </div>
            <div className="min-w-0">
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Team
              </label>
              <input
                type="text"
                placeholder="Filter by team"
                value={filters.team || ""}
                onChange={(e) => handleFilterChange("team", e.target.value)}
                className="w-full max-w-full rounded-lg border border-slate-200 bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <div className="min-w-0">
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Project
              </label>
              <input
                type="text"
                placeholder="Filter by project"
                value={filters.project || ""}
                onChange={(e) => handleFilterChange("project", e.target.value)}
                className="w-full max-w-full rounded-lg border border-slate-200 bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <div className="min-w-0">
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Category
              </label>
              <input
                type="text"
                placeholder="Filter by category"
                value={filters.category || ""}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full max-w-full rounded-lg border border-slate-200 bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

