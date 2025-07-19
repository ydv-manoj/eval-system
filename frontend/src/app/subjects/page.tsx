'use client';

import { useEffect } from 'react';
import { SubjectList } from '../../components/subjects/SubjectList';
import { useAnalytics } from '../../hooks/useAnalytics';

export default function SubjectsPage() {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('Subjects');
  }, [trackPageView]);

  return <SubjectList />;
}