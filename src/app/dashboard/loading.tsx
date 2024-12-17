import { Card, CardContent } from "@/src/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex flex-col pt-28 px-4 md:px-8 lg:px-0 max-w-7xl mx-auto">
      {/* Search and New URL button skeleton */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
        <div className="flex-1 max-w-md">
          <div className="h-10 bg-gray-800 rounded-md animate-pulse" />
        </div>
        <div className="w-40 h-10 bg-gray-800 rounded-md animate-pulse ml-4" />
      </div>

      {/* URL grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="bg-gray-900 border border-gray-800">
            <CardContent className="p-4">
              <div className="flex flex-col space-y-4">
                {/* Top row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:justify-between">
                  <div className="h-6 w-32 bg-gray-800 rounded animate-pulse" />
                  <div className="flex items-center space-x-4 order-3 sm:order-2 w-full sm:w-auto justify-start sm:justify-center mt-2 sm:mt-0">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="h-6 w-16 bg-gray-800 rounded animate-pulse"
                      />
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-8 w-8 bg-gray-800 rounded animate-pulse"
                      />
                    ))}
                  </div>
                </div>

                {/* URL line */}
                <div className="h-4 bg-gray-800 rounded w-full animate-pulse" />

                {/* Bottom row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="h-4 w-40 bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-gray-800 rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
