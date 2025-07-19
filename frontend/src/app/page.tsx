'use client';

import { useEffect } from 'react';
import { SubjectList } from '../components/subjects/SubjectList';
import { useAnalytics } from '../hooks/useAnalytics';

export default function HomePage() {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('Home');
  }, [trackPageView]);

  return <SubjectList />;
}