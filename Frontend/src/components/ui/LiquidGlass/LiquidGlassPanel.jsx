export default function LiquidGlassPanel({
  children,
  className = '',
  liquid = false,
  strength = 'default',
  radius,
  style,
  ...rest
}) {
  const classes = [
    'lg',
    liquid && 'lg--liquid',
    strength === 'soft' && 'lg--soft',
    strength === 'strong' && 'lg--strong',
    strength === 'flat' && 'lg--flat',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      style={radius ? { borderRadius: radius, ...style } : style}
      {...rest}
    >
      {children}
    </div>
  );
}
