import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

// Suit la préférence système "Réduire les animations". Les écrans
// désactivent les transitions Reanimated si true (accessibilité).
export function useReduceMotion(): boolean {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (mounted) setReduce(value);
    });
    const sub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduce,
    );
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  return reduce;
}
