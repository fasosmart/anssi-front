import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  )
}

/**
 * SkeletonText - Version inline du Skeleton pour usage dans les éléments de texte (<p>, <span>, etc.)
 * Utilise un <span> au lieu d'un <div> pour être valide dans les éléments inline
 */
function SkeletonText({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("inline-block animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  )
}

export { Skeleton, SkeletonText }
