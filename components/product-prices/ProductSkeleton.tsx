"use client";

import ContentLoader from "react-content-loader";

export function ProductSkeleton() {
  return (
    <div className="flex items-center justify-between space-x-4 border-t border-slate-700 py-4 px-8">
      <ContentLoader
        speed={3}
        width={220}
        height={44}
        viewBox="0 0 220 44"
        backgroundColor="#64748b"
        foregroundColor="#334155"
      >
        <rect x="0" y="8" rx="0" ry="0" width="90" height="8" />
        <rect x="0" y="34" rx="0" ry="0" width="150" height="6" />
      </ContentLoader>

      <ContentLoader
        speed={3}
        width={60}
        height={30}
        viewBox="0 0 60 30"
        backgroundColor="#64748b"
        foregroundColor="#334155"
      >
        <rect x="0" y="6" rx="0" ry="0" width="80" height="12" />
      </ContentLoader>
    </div>
  );
}
