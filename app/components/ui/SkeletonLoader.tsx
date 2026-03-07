import React from 'react';
import { motion } from 'framer-motion';
import { classNames } from '~/utils/classNames';

interface SkeletonProps {
    className?: string;
    count?: number;
    type?: 'text' | 'card' | 'avatar' | 'title';
}

export function SkeletonLoader({ className, count = 1, type = 'text' }: SkeletonProps) {
    const renderSkeleton = () => {
        switch (type) {
            case 'avatar':
                return <div className="w-12 h-12 rounded-full bg-fluixy-elements-item-backgroundActive/50" />;
            case 'title':
                return <div className="h-8 w-3/4 rounded-md bg-fluixy-elements-item-backgroundActive/50" />;
            case 'card':
                return (
                    <div className="flex flex-col gap-3 p-4 rounded-xl bg-fluixy-elements-background-depth-2/50 border border-fluixy-elements-borderColor">
                        <div className="w-10 h-10 rounded-full bg-fluixy-elements-item-backgroundActive/50" />
                        <div className="h-4 w-5/6 rounded-md bg-fluixy-elements-item-backgroundActive/50 mt-2" />
                        <div className="h-4 w-4/6 rounded-md bg-fluixy-elements-item-backgroundActive/50" />
                    </div>
                );
            case 'text':
            default:
                return <div className="h-4 w-full rounded-md bg-fluixy-elements-item-backgroundActive/50" />;
        }
    };

    return (
        <div className={classNames('flex flex-col gap-3', className)}>
            {Array.from({ length: count }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-full flex-shrink-0"
                >
                    {renderSkeleton()}
                </motion.div>
            ))}
        </div>
    );
}
