import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useCallback } from 'react';
import Button from './Button';
import type { IconProp } from './Icons/types';

type Action = {
  label: string;
  icon?: IconProp;
};

type ConfirmationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirm: Action;
  cancel: Action;
};

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirm,
  cancel,
}: ConfirmationDialogProps) => {
  const handleConfirm = useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-[600px] transform overflow-hidden rounded-md bg-zinc-50 border border-violet-600 p-8 shadow-xl text-left align-middle transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-semibold text-zinc-900"
                >
                  {title}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-base text-zinc-900">{description}</p>
                </div>

                <div className="mt-11 flex justify-end items-center gap-4">
                  <Button
                    color="secondary"
                    variant="solid"
                    endIcon={cancel.icon}
                    onClick={onClose}
                  >
                    {cancel.label}
                  </Button>
                  <Button
                    color="danger"
                    endIcon={confirm.icon}
                    onClick={handleConfirm}
                  >
                    {confirm.label}
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmationDialog;
