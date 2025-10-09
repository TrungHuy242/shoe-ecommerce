import { useMemo } from 'react';

const useMemoizedValue = (value, dependencies) => {
  return useMemo(() => value, dependencies);
};

export default useMemoizedValue;
