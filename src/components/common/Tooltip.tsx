import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 300,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const [isMobile, setIsMobile] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const showTooltip = () => {
    // En mobile, mostrar inmediatamente sin delay
    const delayTime = isMobile ? 0 : delay;
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
    }, delayTime);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const handleTouch = () => {
    if (isMobile) {
      if (isVisible) {
        hideTooltip();
      } else {
        showTooltip();
      }
    }
  };

  // Cerrar tooltip al tocar fuera en mobile
  useEffect(() => {
    if (isMobile && isVisible) {
      const handleClickOutside = (event: TouchEvent | MouseEvent) => {
        if (
          triggerRef.current && 
          !triggerRef.current.contains(event.target as Node) &&
          tooltipRef.current &&
          !tooltipRef.current.contains(event.target as Node)
        ) {
          hideTooltip();
        }
      };

      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('touchstart', handleClickOutside);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isMobile, isVisible]);

  useEffect(() => {
    if (isVisible && tooltipRef.current && triggerRef.current) {
      const tooltip = tooltipRef.current;
      const trigger = triggerRef.current;
      const rect = trigger.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      let newPosition = position;

      // Verificar si el tooltip se sale del viewport y ajustar posición
      if (position === 'top' && rect.top - tooltipRect.height < 20) {
        newPosition = 'bottom';
      } else if (position === 'bottom' && rect.bottom + tooltipRect.height > viewport.height - 20) {
        newPosition = 'top';
      } else if (position === 'left' && rect.left - tooltipRect.width < 20) {
        newPosition = 'right';
      } else if (position === 'right' && rect.right + tooltipRect.width > viewport.width - 20) {
        newPosition = 'left';
      }

      // Si aún no cabe, usar la posición que más espacio tenga
      if (newPosition === 'top' && rect.top - tooltipRect.height < 20) {
        newPosition = rect.bottom + tooltipRect.height < viewport.height - 20 ? 'bottom' : 'top';
      } else if (newPosition === 'bottom' && rect.bottom + tooltipRect.height > viewport.height - 20) {
        newPosition = rect.top - tooltipRect.height > 20 ? 'top' : 'bottom';
      }

      setActualPosition(newPosition);
    }
  }, [isVisible, position]);

  const getTooltipClasses = () => {
    const baseClasses = `
      absolute z-50 px-4 py-3 text-sm text-gray-800 bg-white rounded-lg shadow-xl border border-gray-200
      w-max max-w-xs sm:max-w-sm md:max-w-md text-left pointer-events-none leading-relaxed
      transition-all duration-200 backdrop-blur-sm
    `;

    const positionClasses = {
      top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-3',
      bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-3',
      left: 'right-full top-1/2 transform -translate-y-1/2 mr-3',
      right: 'left-full top-1/2 transform -translate-y-1/2 ml-3'
    };

    return `${baseClasses} ${positionClasses[actualPosition]} ${className}`;
  };

  const getArrowClasses = () => {
    const arrowClasses = {
      top: 'top-full left-1/2 transform -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-transparent border-t-white z-10',
      bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-transparent border-b-white z-10',
      left: 'left-full top-1/2 transform -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-transparent border-l-white z-10',
      right: 'right-full top-1/2 transform -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-transparent border-r-white z-10'
    };

    return `absolute w-0 h-0 ${arrowClasses[actualPosition]}`;
  };

  const getArrowBorderClasses = () => {
    const arrowBorderClasses = {
      top: 'top-full left-1/2 transform -translate-x-1/2 translate-y-px border-l-[9px] border-r-[9px] border-t-[9px] border-transparent border-t-gray-200',
      bottom: 'bottom-full left-1/2 transform -translate-x-1/2 -translate-y-px border-l-[9px] border-r-[9px] border-b-[9px] border-transparent border-b-gray-200',
      left: 'left-full top-1/2 transform -translate-y-1/2 translate-x-px border-t-[9px] border-b-[9px] border-l-[9px] border-transparent border-l-gray-200',
      right: 'right-full top-1/2 transform -translate-y-1/2 -translate-x-px border-t-[9px] border-b-[9px] border-r-[9px] border-transparent border-r-gray-200'
    };

    return `absolute w-0 h-0 ${arrowBorderClasses[actualPosition]}`;
  };

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={isMobile ? undefined : showTooltip}
      onMouseLeave={isMobile ? undefined : hideTooltip}
      onFocus={isMobile ? undefined : showTooltip}
      onBlur={isMobile ? undefined : hideTooltip}
      onClick={isMobile ? handleTouch : undefined}
      onTouchStart={isMobile ? handleTouch : undefined}
    >
      {children}
      {isVisible && content && (
        <div
          ref={tooltipRef}
          className={getTooltipClasses()}
          role="tooltip"
          aria-label={content}
        >
          {content}
          {/* Flecha con borde */}
          <div className={getArrowClasses()} />
          <div className={getArrowBorderClasses()} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
