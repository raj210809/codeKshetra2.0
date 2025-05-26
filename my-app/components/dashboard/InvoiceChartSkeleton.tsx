// components/InvoiceChartSkeleton.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function InvoiceChartSkeleton() {
  return (
    <Card className="my-4 mb-8">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Summary</CardTitle>
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <div className="flex">
          {[1, 2].map((key) => (
            <div key={key} className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 even:border-l sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-6 w-[80px]" />
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <div className="aspect-auto h-[250px] w-full">
          <Skeleton className="h-full w-full" />
        </div>
      </CardContent>
    </Card>
  )
}