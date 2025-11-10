import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const useDebouncedSearch = (paramKey, delay = 1000) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get(paramKey) || ""
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      if (searchTerm.trim()) {
        newParams.set(paramKey, searchTerm);
      } else {
        newParams.delete(paramKey);
      }
      setSearchParams(newParams);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, paramKey, delay, setSearchParams, searchParams]);

  return [searchTerm, setSearchTerm];
};
