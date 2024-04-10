import { useEffect } from 'react';

// Custom hook that fetches data when the input value changes
export default function useFetchOnPeopleInputChange (inputValue, offset, fetchOlem, prevInputValue, setPrevInputValue) {
  useEffect(() => {
    // Only fetch if the input value has changed
    if (prevInputValue !== inputValue) {
      fetchOlem(inputValue, offset);
      // Update the ref to the current inputValue
      setPrevInputValue(inputValue);
    }
  }, [inputValue]); // Dependencies array includes all external dependencies used inside the hook
};