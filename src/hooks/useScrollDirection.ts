import { useState, useEffect } from 'react';

export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Si estamos en la parte superior, siempre mostrar
      if (currentScrollY < 10) {
        setIsVisible(true);
        setPrevScrollY(currentScrollY);
        return;
      }

      // Determinar dirección del scroll
      if (currentScrollY > prevScrollY) {
        // Scroll hacia abajo - ocultar header
        if (scrollDirection !== 'down') {
          setScrollDirection('down');
          setIsVisible(false);
        }
      } else if (currentScrollY < prevScrollY) {
        // Scroll hacia arriba - mostrar header
        if (scrollDirection !== 'up') {
          setScrollDirection('up');
          setIsVisible(true);
        }
      }

      setPrevScrollY(currentScrollY);
    };

    // Agregar throttling para mejor performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll);
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [prevScrollY, scrollDirection]);

  return { isVisible, scrollDirection };
};
