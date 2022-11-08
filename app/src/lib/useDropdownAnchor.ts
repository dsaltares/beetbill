import { useCallback, useEffect, useRef, useState } from 'react';

const useDropdownAnchor = () => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect>(() => new DOMRect());
  const handleUpdateRect = useCallback(() => {
    if (anchorRef.current) {
      setRect(anchorRef.current.getBoundingClientRect());
    }
  }, [anchorRef, setRect]);
  useEffect(() => {
    handleUpdateRect();
    window.addEventListener('scroll', handleUpdateRect);
    return () => window.removeEventListener('scroll', handleUpdateRect);
  }, [handleUpdateRect]);

  return {
    anchorRef,
    top: rect.top + rect.height,
    width: rect.width,
  };
};

export default useDropdownAnchor;
