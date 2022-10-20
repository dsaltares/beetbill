import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export type IconProps = {
  className: string;
};

export type CustomIcon = (props: IconProps) => JSX.Element;

export type IconProp = IconDefinition | CustomIcon;
