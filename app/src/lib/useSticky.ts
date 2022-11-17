import { useEffect, useRef, useState } from 'react';

const useSticky = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setHeight(ref.current?.offsetHeight ?? 0);
  }, [ref]);

  return {
    ref,
    height,
  };
};

export default useSticky;
