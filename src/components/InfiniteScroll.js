import { useState, useEffect, useRef } from 'react';

const InfiniteScroll = ({ fetchMoreData, hasMore, loader }) => {
  const [isFetching, setIsFetching] = useState(false);
  const observer = useRef();

  useEffect(() => {
    if (isFetching) return;

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore) {
        setIsFetching(true);
        fetchMoreData().finally(() => setIsFetching(false));
      }
    }, options);

    if (loader.current) observer.current.observe(loader.current);

    return () => {
      if (observer.current && loader.current) {
        observer.current.unobserve(loader.current);
      }
    };
  }, [isFetching, hasMore, fetchMoreData, loader]);

  return null;
};

export default InfiniteScroll;
