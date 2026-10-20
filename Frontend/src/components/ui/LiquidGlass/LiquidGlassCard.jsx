import { motion } from 'framer-motion';

export default function LiquidGlassCard({
  children,
  className = '',
  liquid = true,
  glow = true,
  interactive = true,
  radius,
  ...rest
}) {
  const classes = [
    'lg',
    liquid && 'lg--liquid',
    interactive && 'lg--interactive',
    className,
  ].filter(Boolean).join(' ');

  const style = radius ? { borderRadius: radius, ...rest.style } : rest.style;

  const card = (
    <motion.div
      className={classes}
      style={style}
      whileHover={interactive ? { y: -4 } : undefined}
      whileTap={interactive ? { scale: 0.99 } : undefined}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      {...rest}
    >
      {children}
    </motion.div>
  );

  if (!glow) return card;

  return (
    <div className="lg-glow-wrap">
      <span className="lg-glow" aria-hidden="true" />
      {card}
    </div>
  );
}
