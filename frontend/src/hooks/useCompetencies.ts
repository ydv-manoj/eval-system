import { useState, useEffect, useCallback } from 'react';
import { Competency, CreateCompetencyRequest, UpdateCompetencyRequest } from '../types/Competency';
import { CompetencyService } from '../services/competencyService';
import { useAnalytics } from './useAnalytics';
import toast from 'react-hot-toast';
import { MESSAGES } from '../utils/constants';

export const useCompetencies = (subjectId?: number) => {
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { analytics } = useAnalytics();

  const fetchCompetencies = useCallback(async () => {
    if (!subjectId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await CompetencyService.getBySubjectId(subjectId);
      setCompetencies(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : MESSAGES.ERROR.GENERIC;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [subjectId]);

  const createCompetency = useCallback(async (data: CreateCompetencyRequest) => {
    try {
      const newCompetency = await CompetencyService.create(data);
      setCompetencies(prev => [...prev, newCompetency]);
      analytics.trackCompetencyCreated(data.name, data.marks);
      toast.success(MESSAGES.SUCCESS.COMPETENCY_CREATED);
      return newCompetency;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : MESSAGES.ERROR.GENERIC;
      toast.error(errorMessage);
      throw err;
    }
  }, [analytics]);

  const updateCompetency = useCallback(async (id: number, data: UpdateCompetencyRequest) => {
    try {
      const updatedCompetency = await CompetencyService.update(id, data);
      setCompetencies(prev => 
        prev.map(competency => competency.id === id ? updatedCompetency : competency)
      );
      analytics.trackCompetencyUpdated(id);
      toast.success(MESSAGES.SUCCESS.COMPETENCY_UPDATED);
      return updatedCompetency;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : MESSAGES.ERROR.GENERIC;
      toast.error(errorMessage);
      throw err;
    }
  }, [analytics]);

  const deleteCompetency = useCallback(async (id: number) => {
    try {
      await CompetencyService.delete(id);
      setCompetencies(prev => prev.filter(competency => competency.id !== id));
      analytics.trackCompetencyDeleted(id);
      toast.success(MESSAGES.SUCCESS.COMPETENCY_DELETED);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : MESSAGES.ERROR.GENERIC;
      toast.error(errorMessage);
      throw err;
    }
  }, [analytics]);

  useEffect(() => {
    fetchCompetencies();
  }, [fetchCompetencies]);

  return {
    competencies,
    loading,
    error,
    fetchCompetencies,
    createCompetency,
    updateCompetency,
    deleteCompetency,
  };
};