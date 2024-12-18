"use client";

import { useState } from "react";
import { Input } from "@/src/components/ui/input";
import URLsGrid from "./url-grid";
import NewURLDialog from "./url-dialog";
import type { ExtendedUrl } from "@/src/lib/types";

interface FilteredURLsProps {
  initialUrls: ExtendedUrl[];
}

export default function FilteredURLs({ initialUrls }: FilteredURLsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUrls = initialUrls.filter((url) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      url.shortCode.toLowerCase().includes(searchLower) ||
      url.originalUrl.toLowerCase().includes(searchLower) ||
      url.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="min-h-screen flex flex-col pt-28 max-w-[1500px] mx-auto z-50 px-4 md:px-10 lg:px-0 ">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
        <div className="flex-1 sm:max-w-md max-w-sm  ">
          <Input
            type="search"
            placeholder="Search URLs, tags..."
            className="max-w-40 sm:max-w-80-  lg:max-w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div >
          <NewURLDialog mode="create" />
        </div>
      </div>

      <URLsGrid urls={filteredUrls} />
    </div>
  );
}
