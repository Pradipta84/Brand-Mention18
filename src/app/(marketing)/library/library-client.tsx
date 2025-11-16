"use client";

import { useState, useEffect } from "react";
import { SearchBar } from "@/components/documents/search-bar";
import { DocumentCard } from "@/components/documents/document-card";
import { DocumentDetail } from "@/components/documents/document-detail";

export function LibraryClient() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<{
    fileType?: string;
    team?: string;
    project?: string;
    category?: string;
  }>({});
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);

  const performSearch = async (query: string, currentFilters = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (currentFilters.fileType) params.set("fileType", currentFilters.fileType);
      if (currentFilters.team) params.set("team", currentFilters.team);
      if (currentFilters.project) params.set("project", currentFilters.project);
      if (currentFilters.category) params.set("category", currentFilters.category);

      const response = await fetch(`/api/documents/search?${params.toString()}`);
      const data = await response.json();
      setDocuments(data.results || []);
    } catch (error) {
      console.error("Error searching documents:", error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performSearch(searchQuery, filters);
  }, [filters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    performSearch(query, filters);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="w-full max-w-full space-y-4 sm:space-y-6">
      <SearchBar
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        initialQuery={searchQuery}
      />

      {loading ? (
        <div className="w-full max-w-full rounded-xl sm:rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 sm:p-8 md:p-12 text-center">
          <p className="text-xs sm:text-sm text-slate-500">Searching documents...</p>
        </div>
      ) : documents.length > 0 ? (
        <div className="grid gap-3 sm:gap-4 w-full max-w-full">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onSelect={setSelectedDocument}
            />
          ))}
        </div>
      ) : (
        <div className="w-full max-w-full rounded-xl sm:rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 sm:p-8 md:p-12 text-center">
          <p className="text-xs sm:text-sm text-slate-500 px-2">
            {searchQuery || Object.keys(filters).length > 0
              ? "No documents found matching your search."
              : "No documents indexed yet. Start by indexing some documents."}
          </p>
        </div>
      )}

      {selectedDocument && (
        <DocumentDetail
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
}

