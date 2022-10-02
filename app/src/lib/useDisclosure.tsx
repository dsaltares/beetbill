import { useCallback, useState } from 'react';

const useDisclosure = () => {
  const [isOpen, setOpen] = useState(false);
  const onOpen = useCallback(() => setOpen(true), [setOpen]);
  const onClose = useCallback(() => setOpen(false), [setOpen]);
  return {
    isOpen,
    onOpen,
    onClose,
  };
};

export default useDisclosure;
