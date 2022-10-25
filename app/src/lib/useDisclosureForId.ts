import { useCallback, useState } from 'react';

const useDisclosureForId = () => {
  const [openFor, setOpenFor] = useState<string | undefined>();
  const onOpen = useCallback((id: string) => setOpenFor(id), [setOpenFor]);
  const onClose = useCallback(() => setOpenFor(undefined), [setOpenFor]);
  return {
    isOpen: !!openFor,
    openFor,
    onOpen,
    onClose,
  };
};

export default useDisclosureForId;
