"use client";

export type StatusFilter = "ALL" | "DRAFT" | "PUBLISHED" | "ARCHIVED";

interface QuizFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (status: StatusFilter) => void;
  counts: {
    all: number;
    draft: number;
    published: number;
    archived: number;
  };
}

export function QuizFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  counts,
}: QuizFiltersProps) {
  const tabs: { id: StatusFilter; label: string; count: number }[] = [
    { id: "ALL", label: "All Quizzes", count: counts.all },
    { id: "DRAFT", label: "Drafts", count: counts.draft },
    { id: "PUBLISHED", label: "Published", count: counts.published },
    { id: "ARCHIVED", label: "Archived", count: counts.archived },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onStatusFilterChange(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? "bg-[#0969da] text-white dark:bg-[#1f6beb] dark:text-white font-semibold shadow-xs"
                  : "text-[#636c76] dark:text-[#8b949e] hover:text-[#1f2328] dark:hover:text-[#f0f6fc] hover:bg-[#eaeef2] dark:hover:bg-[#21262d] border border-transparent"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                  isActive
                    ? "bg-[#0860ca] text-white dark:bg-[#033877] dark:text-[#58a6ff]"
                    : "bg-[#f6f8fa] dark:bg-[#010409] text-[#636c76] dark:text-[#8b949e] border border-[#d0d7de] dark:border-[#30363d]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative w-full sm:w-64">
        <svg
          className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8c959f] dark:text-[#6e7681] pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search quizzes..."
          className="w-full pl-9 pr-8 py-1.5 rounded-md bg-white dark:bg-[#010409] border border-[#d0d7de] dark:border-[#30363d] text-[#1f2328] dark:text-[#f0f6fc] text-xs placeholder-[#8c959f] dark:placeholder-[#6e7681] focus:outline-none focus:border-[#0969da] dark:focus:border-[#2f81f7] focus:ring-1 focus:ring-[#0969da] dark:focus:ring-[#2f81f7] transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8c959f] hover:text-[#1f2328] dark:text-[#6e7681] dark:hover:text-[#f0f6fc]"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}


