import React, { useRef, useState, useEffect } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  placeholder?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, placeholder, errorFallback, ...rest }) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={className} style={{ minHeight: 120, minWidth: 120, position: 'relative' }}>
      {!isVisible && (placeholder || <div className="bg-gray-200 animate-pulse w-full h-full rounded" />)}
      {isVisible && !isLoaded && !isError && (placeholder || <div className="bg-gray-200 animate-pulse w-full h-full rounded" />)}
      {isVisible && (
        <img
          src={src}
          alt={alt}
          style={isLoaded ? {} : { display: 'none' }}
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsError(true)}
          {...rest}
        />
      )}
      {isError && (errorFallback || <div className="bg-red-100 text-red-500 p-2 rounded">Image failed to load</div>)}
    </div>
  );
};

export default LazyImage; 