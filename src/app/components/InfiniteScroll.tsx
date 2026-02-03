import { useEffect, useRef, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  children: ReactNode;
  threshold?: number; // Distância do final em pixels para triggerar load
}

export function InfiniteScroll({
  onLoadMore,
  hasMore,
  loading,
  children,
  threshold = 200,
}: InfiniteScrollProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: `${threshold}px` }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, onLoadMore, threshold]);

  return (
    <>
      {children}
      {hasMore && (
        <div ref={observerTarget} className="flex justify-center py-4">
          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Carregando mais...</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
