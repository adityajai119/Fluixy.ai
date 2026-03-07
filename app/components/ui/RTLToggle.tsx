import { useState, useEffect } from 'react';
import { IconButton } from './IconButton';

export const RTLToggle = ({ className }: { className?: string }) => {
    const [isRTL, setIsRTL] = useState(false);
    const [domLoaded, setDomLoaded] = useState(false);

    useEffect(() => {
        setDomLoaded(true);
        const savedDir = localStorage.getItem('fluixy_rtl');
        if (savedDir === 'rtl') {
            setIsRTL(true);
            document.documentElement.setAttribute('dir', 'rtl');
        }
    }, []);

    const toggleRTL = () => {
        const newDir = isRTL ? 'ltr' : 'rtl';
        setIsRTL(!isRTL);
        document.documentElement.setAttribute('dir', newDir);
        localStorage.setItem('fluixy_rtl', newDir);
    };

    if (!domLoaded) return null;

    return (
        <IconButton
            className={className}
            icon={isRTL ? 'i-ph-text-align-right-duotone' : 'i-ph-text-align-left-duotone'}
            size="xl"
            title={isRTL ? "Switch to LTR" : "Switch to RTL (Urdu/Arabic)"}
            onClick={toggleRTL}
        />
    );
};
