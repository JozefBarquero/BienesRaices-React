import { Link } from 'react-router-dom';

export default function LiquidGlassButton({
  children,
  variant = 'default',
  to,
  href,
  className = '',
  ...rest
}) {
  const classes = [
    'lg-btn',
    variant !== 'default' && `lg-btn--${variant}`,
    className,
  ].filter(Boolean).join(' ');

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        <span>{children}</span>
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        <span>{children}</span>
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      <span>{children}</span>
    </button>
  );
}
