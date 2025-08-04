import { useState, useEffect, useCallback, useRef } from 'react';

export const useInfiniteScroll = (fetchMore, hasMore = true) => {
  const [isFetching, setIsFetching] = useState(false);
  const observerRef = useRef(null);
  const targetRef = useRef(null);
  const fetchMoreRef = useRef(fetchMore);
  const hasMoreRef = useRef(hasMore);

  // Keep refs up to date
  useEffect(() => {
    fetchMoreRef.current = fetchMore;
    hasMoreRef.current = hasMore;
  }, [fetchMore, hasMore]);

  const handleObserver = useCallback((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMoreRef.current && !isFetching) {
      setIsFetching(true);
    }
  }, [isFetching]);

  // Set up intersection observer
  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '200px',
      threshold: 0.5
    });

    observer.observe(element);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  // Handle fetching
  useEffect(() => {
    if (!isFetching) return;

    const loadMore = async () => {
      try {
        await fetchMoreRef.current();
      } catch (error) {
        console.error('Error fetching more data:', error);
      } finally {
        setIsFetching(false);
      }
    };

    loadMore();
  }, [isFetching]);

  return { 
    isFetching, 
    targetRef,
    setIsFetching 
  };
};