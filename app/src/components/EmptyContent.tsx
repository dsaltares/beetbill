import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import LinkButton from './LinkButton';

type EmptyContentProps = {
  message: string;
  createLabel: string;
  createHref: string;
};

const EmptyContent = ({
  message,
  createLabel,
  createHref,
}: EmptyContentProps) => (
  <div className="h-full w-full flex flex-col items-center justify-center gap-10">
    <h2 className="text-3xl text-center">{message}</h2>
    <LinkButton href={createHref} endIcon={faArrowRight}>
      {createLabel}
    </LinkButton>
  </div>
);

export default EmptyContent;
