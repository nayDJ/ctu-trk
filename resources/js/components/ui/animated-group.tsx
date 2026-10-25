'use client';

import { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import React from 'react';

type AnimatedGroupProps = {
    children: ReactNode;
    className?: string;
    mode?: 'load' | 'scroll';
    variants?: {
        container?: Variants;
        item?: Variants;
    };
};

const defaultContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const defaultItemVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const scrollItemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

function AnimatedGroup({
    children,
    className,
    mode = 'load',
    variants,
}: AnimatedGroupProps) {
    const containerVariants = variants?.container || defaultContainerVariants;
    const itemVariants = variants?.item || (mode === 'scroll' ? scrollItemVariants : defaultItemVariants);

    if (mode === 'scroll') {
        return (
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                variants={containerVariants}
                className={cn(className)}
            >
                {React.Children.map(children, (child, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        {child}
                    </motion.div>
                ))}
            </motion.div>
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className={cn(className)}
        >
            {React.Children.map(children, (child, index) => (
                <motion.div key={index} variants={itemVariants}>
                    {child}
                </motion.div>
            ))}
        </motion.div>
    );
}

export { AnimatedGroup };
