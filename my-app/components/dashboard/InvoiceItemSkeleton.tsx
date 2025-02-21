import { Skeleton } from "@/components/ui/skeleton"
import { TableCell, TableRow } from "@/components/ui/table"

export function InvoiceItemSkeleton() {
  return (
    <TableRow className="hover:bg-primary-foreground">
      <TableCell>
        <Skeleton className="h-4 w-24" /> {/* Date */}
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-20" /> {/* Payee address */}
          <Skeleton className="h-6 w-6 rounded-full" /> {/* Copy button */}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-20" /> {/* Payer address */}
          <Skeleton className="h-6 w-6 rounded-full" /> {/* Copy button */}
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" /> {/* Total Amount */}
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" /> {/* Status */}
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-24" /> {/* View Invoice button */}
      </TableCell>
    </TableRow>
  )
}