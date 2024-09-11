import { useEffect } from 'react';

// Custom hook that fetches data when the input value changes
export default function useFetchOnPeopleInputChange (inputValue, offset, fetchOlem, prevInputValue, setPrevInputValue, peopleOptions, page) {
  useEffect(() => {
    // Only fetch if the input value has changed
    if (prevInputValue !== inputValue) {
      fetchOlem(inputValue, offset, page, peopleOptions);
      // Update the ref to the current inputValue
      setPrevInputValue(inputValue);
    }
  }, [inputValue]); // Dependencies array includes all external dependencies used inside the hook
};