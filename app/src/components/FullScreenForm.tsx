import type { DOMAttributes, PropsWithChildren } from 'react';
import Button from './Button';
import FullScreenCard from './FullscreenCard';
import type { IconProp } from './Icons/types';

type FullScreenFormProps = PropsWithChildren<{
  title: string;
  description: string;
  submitButton: {
    label: string;
    icon: IconProp;
    loading?: boolean;
  };
  onSubmit: DOMAttributes<HTMLFormElement>['onSubmit'];
}>;

const FullScreenForm = ({
  title,
  description,
  submitButton,
  onSubmit,
  children,
}: FullScreenFormProps) => (
  <FullScreenCard>
    <form className="flex flex-col w-full gap-16" onSubmit={onSubmit}>
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold text-zinc-900">{title}</h1>
          <p className="text-base text-zinc-900">{description}</p>
        </div>
        <div>
          <Button
            type="submit"
            endIcon={submitButton.icon}
            loading={submitButton.loading}
          >
            {submitButton.label}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{children}</div>
    </form>
  </FullScreenCard>
);

export default FullScreenForm;
