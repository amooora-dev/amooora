interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className = '', variant = 'rectangular' }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-label="Carregando..."
    />
  );
}

// Componentes pré-configurados
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-border/50 p-4 mb-3">
      <div className="flex gap-3">
        <Skeleton className="w-20 h-20" variant="rectangular" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" variant="text" />
          <Skeleton className="h-3 w-1/2" variant="text" />
          <Skeleton className="h-3 w-2/3" variant="text" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonCardExpanded() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-border/50 mb-4">
      <Skeleton className="w-full h-56" variant="rectangular" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" variant="text" />
        <Skeleton className="h-4 w-full" variant="text" />
        <Skeleton className="h-4 w-5/6" variant="text" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" variant="rectangular" />
          <Skeleton className="h-6 w-20" variant="rectangular" />
        </div>
        <Skeleton className="h-10 w-full" variant="rectangular" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </>
  );
}

export function SkeletonListExpanded({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCardExpanded key={index} />
      ))}
    </>
  );
}
