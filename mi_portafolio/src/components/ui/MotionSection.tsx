import { motion } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'
import { useInView } from '../../hooks/useInView'

interface MotionSectionProps extends HTMLMotionProps<'section'> {
  delay?: number
}

export function MotionSection({ children, delay = 0, className, ...props }: MotionSectionProps) {
  const { ref, inView } = useInView<HTMLElement>()

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  )
}
