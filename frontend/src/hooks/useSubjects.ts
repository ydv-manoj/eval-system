import { useState, useEffect, useCallback } from 'react';
import { Subject, CreateSubjectRequest, UpdateSubjectRequest } from '../types/Subject';
import { SubjectService } from '../services/subjectService';
import { useAnalytics } from './useAnalytics';
import toast from 'react-hot-toast';
import { MESSAGES } from '../utils/constants';
import { CompetencyService } from '../services/competencyService';


export const useSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { analytics } = useAnalytics();
  const [competencyCounts, setCompetencyCounts] = useState<Record<number, number>>({});

  const fetchCompetencyCounts = useCallback(async () => {
    const counts: Record<number, number> = {};
      for (const subject of subjects) {
        if (subject.id) {
          try {
            const competencies = await CompetencyService.getBySubjectId(subject.id);
            counts[subject.id] = competencies.length;
          } catch (error) {
            counts[subject.id] = 0;
          }
        }
      }
      setCompetencyCounts(counts);
  }, [subjects]);

  useEffect(() => {
    if (subjects && subjects.length > 0) {
      fetchCompetencyCounts();
    }
  }, [subjects, fetchCompetencyCounts]);  

  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await SubjectService.getAll();
      setSubjects(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : MESSAGES.ERROR.GENERIC;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSubject = useCallback(async (data: CreateSubjectRequest) => {
    try {
      const newSubject = await SubjectService.create(data);
      setSubjects(prev => [newSubject, ...prev]);
      analytics.trackSubjectCreated(data.name);
      toast.success(MESSAGES.SUCCESS.SUBJECT_CREATED);
      return newSubject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : MESSAGES.ERROR.GENERIC;
      toast.error(errorMessage);
      throw err;
    }
  }, [analytics]);

  const updateSubject = useCallback(async (id: number, data: UpdateSubjectRequest) => {
    try {
      const updatedSubject = await SubjectService.update(id, data);
      setSubjects(prev => 
        prev.map(subject => subject.id === id ? updatedSubject : subject)
      );
      analytics.trackSubjectUpdated(id);
      toast.success(MESSAGES.SUCCESS.SUBJECT_UPDATED);
      return updatedSubject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : MESSAGES.ERROR.GENERIC;
      toast.error(errorMessage);
      throw err;
    }
  }, [analytics]);

  const deleteSubject = useCallback(async (id: number) => {
    try {
      await SubjectService.delete(id);
      setSubjects(prev => prev.filter(subject => subject.id !== id));
      analytics.trackSubjectDeleted(id);
      toast.success(MESSAGES.SUCCESS.SUBJECT_DELETED);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : MESSAGES.ERROR.GENERIC;
      toast.error(errorMessage);
      throw err;
    }
  }, [analytics]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  return {
    subjects,
    loading,
    error,
    fetchSubjects,
    competencyCounts,
    createSubject,
    updateSubject,
    deleteSubject,
  };
};