import { motion } from 'framer-motion';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React from 'react';

interface StatProps {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface ActionProps {
  text: string;
  onClick: () => void;
  variant?: ButtonProps['variant'];
  className?: string;
}

interface HeroSectionProps {
  title: React.ReactNode;
  subtitle: string;
  actions: ActionProps[];
  stats: StatProps[];
  images: string[];
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const floatingAnimation = {
  y: [0, -8, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

const HeroSection = ({ title, subtitle, actions, stats, images, className }: HeroSectionProps) => {
  return (
    <section className={cn('relative overflow-hidden bg-background py-16 md:py-24', className)}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Column: Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.h1
              variants={itemVariants}
              className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            >
              {title}
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="max-w-lg text-base text-muted-foreground sm:text-lg"
            >
              {subtitle}
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'default'}
                  size="lg"
                  onClick={action.onClick}
                  className={cn('active:scale-95 transition-transform', action.className)}
                >
                  {action.text}
                </Button>
              ))}
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-6 pt-4"
            >
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column: Image Collage */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="relative hidden h-[480px] lg:block"
          >
            {/* Decorative Shapes */}
            <div className="absolute -right-8 -top-8 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-48 w-48 rounded-full bg-primary/10 blur-2xl" />
            <div className="absolute right-12 top-12 h-32 w-32 rounded-full bg-accent/20 blur-2xl" />

            {/* Images */}
            <motion.div
              variants={imageVariants}
              className="absolute left-0 top-8 h-56 w-72 overflow-hidden rounded-2xl shadow-xl ring-1 ring-border"
            >
              <img src={images[0]} alt="" className="h-full w-full object-cover" loading="lazy" />
            </motion.div>
            <motion.div
              variants={imageVariants}
              animate={{ ...floatingVariants.animate }}
              className="absolute right-0 top-0 h-48 w-64 overflow-hidden rounded-2xl shadow-xl ring-1 ring-border"
            >
              <img src={images[1]} alt="" className="h-full w-full object-cover" loading="lazy" />
            </motion.div>
            <motion.div
              variants={imageVariants}
              className="absolute bottom-0 left-16 h-52 w-72 overflow-hidden rounded-2xl shadow-xl ring-1 ring-border"
            >
              <img src={images[2]} alt="" className="h-full w-full object-cover" loading="lazy" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
