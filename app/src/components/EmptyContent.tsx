import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Button from './Button';

type EmptyContentProps = {
  message: string;
  actionLabel: string;
  onClick: () => void;
};

const EmptyContent = ({ message, actionLabel, onClick }: EmptyContentProps) => (
  <div className="h-full w-full flex flex-col items-center justify-center gap-10">
    <h2 className="text-3xl text-center">{message}</h2>
    <Button onClick={onClick} endIcon={faArrowRight}>
      {actionLabel}
    </Button>
  </div>
);

export default EmptyContent;
