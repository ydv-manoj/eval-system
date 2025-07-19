import { useCallback } from 'react';
import { analytics } from '../services/analytics';

export const useAnalytics = () => {
  const trackButtonClick = useCallback((buttonName: string, location: string) => {
    analytics.trackButtonClick(buttonName, location);
  }, []);

  const trackModalOpen = useCallback((modalName: string) => {
    analytics.trackModalOpen(modalName);
  }, []);

  const trackModalClose = useCallback((modalName: string) => {
    analytics.trackModalClose(modalName);
  }, []);

  const trackPageView = useCallback((pageName: string) => {
    analytics.trackPageView(pageName);
  }, []);

  return {
    trackButtonClick,
    trackModalOpen,
    trackModalClose,
    trackPageView,
    analytics,
  };
};

