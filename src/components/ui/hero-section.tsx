import { motion } from 'framer-motion';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React from 'react';
import { Sparkles } from 'lucide-react';

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
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.9, rotate: -2 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

const HeroSection = ({ title, subtitle, actions, stats, images, className }: HeroSectionProps) => {
  return (
    <section className={cn('relative overflow-hidden bg-background pt-8 pb-12 sm:pt-12 sm:pb-16 md:pt-16 md:pb-24 lg:pt-20 lg:pb-32', className)}>
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -right-24 w-80 h-80 bg-accent/15 rounded-full blur-[80px]" 
        />
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-10 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[60px]" 
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left Column: Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 sm:space-y-8"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary border border-primary/20">
               <Sparkles className="h-3 w-3" />
               <span>AI-Powered Crisis Coordination</span>
            </motion.div>
            
            <motion.h1
              variants={itemVariants}
              className="text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl"
            >
              {title}
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="max-w-xl text-base text-muted-foreground leading-relaxed sm:text-lg md:text-xl"
            >
              {subtitle}
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'default'}
                  size="lg"
                  onClick={action.onClick}
                  className={cn(
                    'h-11 sm:h-12 px-6 sm:px-8 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-primary/10 w-full sm:w-auto', 
                    action.variant === 'outline' ? 'bg-background/50 backdrop-blur-sm' : 'hover:shadow-primary/20',
                    action.className
                  )}
                >
                  {action.text}
                </Button>
              ))}
            </motion.div>
            
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-4 sm:gap-8 pt-6 sm:pt-8 border-t border-border/50"
            >
              {stats.map((stat, index) => (
                <div key={index} className="space-y-1 text-center sm:text-left">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm mx-auto sm:mx-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    {stat.icon}
                  </div>
                  <div className="pt-2">
                    <p className="text-lg sm:text-xl font-bold text-foreground tracking-tight">{stat.value}</p>
                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column: Image Collage */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="relative h-[300px] sm:h-[400px] lg:h-[560px] mt-8 lg:mt-0"
          >
            {/* Mobile/Tablet: Single Image */}
            <motion.div
              variants={imageVariants}
              className="lg:hidden h-full w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-border shadow-primary/10"
            >
              <img src={images[0]} alt="" className="h-full w-full object-cover transition-transform duration-700 hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </motion.div>

            {/* Desktop: Collage Container */}
            <div className="relative h-full w-full hidden lg:block">
              {/* Main Image */}
              <motion.div
                variants={imageVariants}
                className="absolute right-0 top-12 z-10 h-72 w-[400px] overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-border shadow-primary/10"
              >
                <img src={images[0]} alt="" className="h-full w-full object-cover transition-transform duration-700 hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </motion.div>

              {/* Secondary Image - Floating */}
              <motion.div
                variants={imageVariants}
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [2, 1, 2]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute left-0 top-0 z-20 h-64 w-52 overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-border shadow-primary/20"
              >
                <img src={images[1]} alt="" className="h-full w-full object-cover transition-transform duration-700 hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent" />
              </motion.div>

              {/* Bottom Image */}
              <motion.div
                variants={imageVariants}
                animate={{ 
                  y: [0, 15, 0],
                  rotate: [-3, -1, -3]
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="absolute bottom-8 left-12 z-30 h-56 w-80 overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-border shadow-primary/15"
              >
                <img src={images[2]} alt="" className="h-full w-full object-cover transition-transform duration-700 hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-transparent" />
              </motion.div>

              {/* Decorative Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute -right-4 bottom-24 z-40 rounded-2xl bg-card/80 p-4 shadow-xl backdrop-blur-xl border border-white/20"
              >
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center text-success">
                      <Sparkles className="h-5 w-5" />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-foreground">AI Verified</p>
                      <p className="text-[10px] text-muted-foreground">98% Accuracy Score</p>
                   </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

