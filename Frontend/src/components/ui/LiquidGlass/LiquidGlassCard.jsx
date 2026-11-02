import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return isMobile;
};

export default function LiquidGlassCard({
  children,
  className = '',
  liquid = true,
  glow = true,
  interactive = true,
  radius,
  ...rest
}) {
  const isMobile = useIsMobile();

  const classes = [
    'lg',
    liquid && 'lg--liquid',
    interactive && !isMobile && 'lg--interactive',
    className,
  ].filter(Boolean).join(' ');

  const style = radius ? { borderRadius: radius, ...rest.style } : rest.style;

  const motionProps = !isMobile && interactive
    ? {
        whileHover: { y: -4 },
        whileTap: { scale: 0.99 },
        transition: { type: 'spring', stiffness: 320, damping: 26 },
      }
    : {};

  const card = (
    <motion.div
      className={classes}
      style={style}
      {...motionProps}
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