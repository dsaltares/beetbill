import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import type { DOMAttributes, PropsWithChildren } from 'react';
import FullScreenCard from './FullscreenCard';
import LinkButton from './LinkButton';

type FormCard = PropsWithChildren<{
  title: string;
  description: string;
  onSubmit: DOMAttributes<HTMLFormElement>['onSubmit'];
  buttons?: React.ReactNode;
  backHref?: string;
}>;

const FormCard = ({
  title,
  description,
  onSubmit,
  backHref,
  children,
  buttons = null,
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
      <div className="flex justify-between gap-8 mb-16 items-start">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold text-zinc-900">{title}</h1>
          <p className="text-base text-zinc-900">{description}</p>
        </div>
        <div className="flex items-center gap-4">{buttons}</div>
      </div>
      {children}
    </form>
  </FullScreenCard>
);

export default FormCard;
