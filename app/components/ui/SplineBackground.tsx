import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';

// Lazy load the Spline component to prevent blocking the main thread
const Spline = lazy(() => import('@splinetool/react-spline'));

export function SplineBackground() {
    return (
        <div className="fixed inset-0 w-full h-full z-[1] pointer-events-none overflow-hidden opacity-40 dark:opacity-60 transition-opacity duration-1000">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fluixy-elements-background-depth-1/50 to-fluixy-elements-background-depth-1 z-[2]" />

            <Suspense
                fallback={
                    <div className="w-full h-full flex items-center justify-center">
                        {/* Fallback skeleton for 3D load */}
                        <motion.div
                            animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="w-1/2 h-1/2 rounded-full bg-accent-500/10 blur-[100px]"
                        />
                    </div>
                }
            >
                {/* Using a high quality, tech-focused abstract spline scene (glassmorphism/holographic styling) */}
                <Spline
                    scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
                    className="w-full h-full block"
                />
            </Suspense>
        </div>
    );
}
