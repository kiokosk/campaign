import { useState, useEffect } from 'react';

/**
 * A custom hook that delays updating a value for a specified duration.
 * Useful for preventing excessive API calls during user input.
 * 
 * @param value  
 * @param delay 
 * @returns 
 */
export function useDebounce<T>(value: T, delay: number): T {
  
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
   
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

   
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); 

  return debouncedValue;
}
