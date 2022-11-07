import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import type { DOMAttributes, PropsWithChildren } from 'react';
import Button from './Button';
import FullScreenCard from './FullscreenCard';
import type { IconProp } from './Icons/types';
import LinkButton from './LinkButton';

type FormCard = PropsWithChildren<{
  title: string;
  description: string;
  submitButton: {
    label: string;
    icon: IconProp;
    loading?: boolean;
    disabled?: boolean;
  };
  onSubmit: DOMAttributes<HTMLFormElement>['onSubmit'];
  backHref?: string;
}>;

const FormCard = ({
  title,
  description,
  submitButton,
  onSubmit,
  backHref,
  children,
}: FormCard) => (
  <FullScreenCard>
    <form className="flex flex-col w-full" onSubmit={onSubmit}>
      {backHref && (
        <div className="flex w-full justify-start mb-10">
          <LinkButton
            href={backHref}
            color="secondary"
            variant="borderless"
            startIcon={faArrowLeft}
          >
            Back
          </LinkButton>
        </div>
      )}
      <div className="flex justify-between gap-8 mb-16">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold text-zinc-900">{title}</h1>
          <p className="text-base text-zinc-900">{description}</p>
        </div>
        <div>
          <Button
            type="submit"
            endIcon={submitButton.icon}
            loading={submitButton.loading}
            disabled={submitButton.disabled}
          >
            {submitButton.label}
          </Button>
        </div>
      </div>
      {children}
    </form>
  </FullScreenCard>
);

export default FormCard;
