import cn from 'classnames';

type LogoProps = {
  variant?: 'primary' | 'secondary';
};

const Logo = ({ variant = 'primary' }: LogoProps) => (
  <h1
    className={cn('text-[40px] pl-4', {
      'text-violet-700': variant === 'primary',
      'text-white': variant === 'secondary',
    })}
  >
    Logo
  </h1>
);

export default Logo;
