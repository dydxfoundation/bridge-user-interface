import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { initializeLocalization } from '@/state/app';

export const useInitializePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeLocalization());
  }, []);
};
