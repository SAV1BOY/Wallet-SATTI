import React, { ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';

interface LazyLoadProps {
  children: ReactNode;
  placeholderHeight?: string;
}

const LazyLoad: React.FC<LazyLoadProps> = ({ children, placeholderHeight = '360px' }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px', // Start loading when it's 200px away from viewport
  });

  return (
    <div ref={ref} style={{ minHeight: !inView ? placeholderHeight : 'auto' }}>
      {inView ? children : null}
    </div>
  );
};

export default LazyLoad;