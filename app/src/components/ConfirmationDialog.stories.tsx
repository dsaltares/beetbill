import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import useDisclosure from '@lib/useDisclosure';
import ConfirmationDialog from './ConfirmationDialog';
import Button from './Button';

export default {
  title: 'ConfirmationDialog',
  component: ConfirmationDialog,
  argTypes: {
    onConfirm: { action: 'clicked' },
  },
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof ConfirmationDialog>;

const Template: ComponentStory<typeof ConfirmationDialog> = (args) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Open confirmation dialog</Button>
      <ConfirmationDialog {...args} isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  title: 'Are you sure you want to delete the client?',
  description:
    "This action can not be undone. You will have to add the client's details again if you want to collaborate with them in the future",
  confirm: {
    label: 'Delete',
    icon: faTrash,
  },
  cancel: {
    label: 'Cancel',
  },
};
