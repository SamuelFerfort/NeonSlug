"use client";

import { URLsGridProps } from "@/src/lib/types";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

export default function URLsGrid({ urls }: URLsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 z-100 mt-10 lg:mx-28">
      {urls.map((url, index) => (
        <Card
          key={index}
          className="bg-gray-900 border-gray-800 hover:border-neon-pink hover:contrast- transition-colors"
        >
          <CardContent className="p-6 flex flex-col items-center text-center">
            <p className="text-neon-pink text-lg break-all">
              {url.originalUrl}
            </p>
            <Button
              onClick={() =>
                url.originalUrl &&
                navigator.clipboard.writeText(url.originalUrl)
              }
              variant="outline"
              className="ml-4 text-neon-pink border-neon-pink hover:bg-neon-pink hover:text-white"
            >
              Copy
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
