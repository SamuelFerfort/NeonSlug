"use client";

import { useState } from "react";
import { Input } from "@/src/components/ui/input";
import URLsGrid from "./url-grid";
import NewURLDialog from "./url-dialog";
import type { ExtendedUrl } from "@/src/lib/types";
import { Search } from "lucide-react";

interface FilteredURLsProps {
  initialUrls: ExtendedUrl[];
}

export default function FilteredURLs({ initialUrls }: FilteredURLsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUrls = initialUrls.filter((url) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      url.shortCode.toLowerCase().includes(searchLower) ||
      url.originalUrl.toLowerCase().includes(searchLower)
    );
  });



  return (
    <main className="min-h-screen flex flex-col pt-28 max-w-[1575px] mx-auto z-50  px-1 sm:px-10 ">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
        <div className="relative flex items-center">
          <div className="absolute left-3 text-gray-400 pointer-events-none">
            <Search size={18} />
          </div>
          <Input
            type="search"
            placeholder="Search by domain or slug"
            className="max-w-40 sm:max-w-80-  lg:max-w-full pl-8 border-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <NewURLDialog mode="create" />
        </div>
      </div>
      <URLsGrid urls={filteredUrls} />
    </main>
  );
}
