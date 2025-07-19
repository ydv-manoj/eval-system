'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Award, Hash } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Competency, CreateCompetencyRequest, UpdateCompetencyRequest } from '../../types/Competency';
import { VALIDATION_RULES } from '../../utils/constants';
import { useAnalytics } from '../../hooks/useAnalytics';

const competencySchema = z.object({
  name: z
    .string()
    .min(VALIDATION_RULES.COMPETENCY_NAME_MIN_LENGTH, `Name must be at least ${VALIDATION_RULES.COMPETENCY_NAME_MIN_LENGTH} characters`)
    .max(VALIDATION_RULES.COMPETENCY_NAME_MAX_LENGTH, `Name cannot exceed ${VALIDATION_RULES.COMPETENCY_NAME_MAX_LENGTH} characters`)
    .trim(),
  marks: z
    .number()
    .min(VALIDATION_RULES.MARKS_MIN, `Marks must be at least ${VALIDATION_RULES.MARKS_MIN}`)
    .max(VALIDATION_RULES.MARKS_MAX, `Marks cannot exceed ${VALIDATION_RULES.MARKS_MAX}`)
    .multipleOf(0.1, 'Marks must be in increments of 0.1'),
});

type CompetencyFormData = z.infer<typeof competencySchema>;

interface CompetencyFormProps {
  competency?: Competency;
  subjectId: number;
  onSubmit: (data: CreateCompetencyRequest | UpdateCompetencyRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const CompetencyForm: React.FC<CompetencyFormProps> = ({
  competency,
  subjectId,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const { trackButtonClick } = useAnalytics();
  const isEditing = !!competency;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CompetencyFormData>({
    resolver: zodResolver(competencySchema),
    defaultValues: {
      name: competency?.name || '',
      marks: competency?.marks || 0,
    },
  });

  const currentMarks = watch('marks');

  const handleFormSubmit = async (data: CompetencyFormData) => {
    trackButtonClick(isEditing ? 'save-competency-edit' : 'save-competency-create', 'competency-form');
    
    if (isEditing) {
      await onSubmit(data);
    } else {
      await onSubmit({ ...data, subjectId });
    }
  };

  const getMarksPreview = (marks: number) => {
    if (marks >= 8) return { color: 'text-green-600', label: 'Excellent', bg: 'bg-green-50 border-green-200' };
    if (marks >= 6) return { color: 'text-amber-600', label: 'Good', bg: 'bg-amber-50 border-amber-200' };
    if (marks >= 4) return { color: 'text-blue-600', label: 'Average', bg: 'bg-blue-50 border-blue-200' };
    return { color: 'text-red-600', label: 'Needs Improvement', bg: 'bg-red-50 border-red-200' };
  };

  const marksPreview = getMarksPreview(currentMarks || 0);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
          <Award className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          {isEditing ? 'Edit Competency' : 'Add New Competency'}
        </h3>
        <p className="text-gray-600 text-sm">
          {isEditing ? 'Update the competency details' : 'Define a new evaluation criteria'}
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Competency Name *
          </label>
          <div className="relative">
            <Input
              placeholder="e.g., Arrays, Linked Lists, Object-Oriented Programming"
              className={`pl-4 pr-4 py-3 w-full border rounded-lg transition-all duration-200 ${
                errors.name 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
              }`}
              {...register('name')}
            />
          </div>
          {errors.name && (
            <p className="text-red-600 text-xs font-medium">{errors.name.message}</p>
          )}
        </div>

        {/* Marks Field */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Marks *
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Hash className="w-4 h-4" />
            </div>
            <Input
              type="number"
              step="0.1"
              min={VALIDATION_RULES.MARKS_MIN}
              max={VALIDATION_RULES.MARKS_MAX}
              placeholder="8.5"
              className={`pl-10 pr-4 py-3 w-full border rounded-lg transition-all duration-200 ${
                errors.marks 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
              }`}
              {...register('marks', { valueAsNumber: true })}
            />
          </div>
          
          {/* Marks Preview */}
          {currentMarks > 0 && (
            <div className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold border ${marksPreview.bg}`}>
              <Award className="w-4 h-4 mr-2" />
              <span className={marksPreview.color}>
                {currentMarks.toFixed(1)} / 10 - {marksPreview.label}
              </span>
            </div>
          )}
          
          <p className="text-xs text-gray-500">
            Enter marks between {VALIDATION_RULES.MARKS_MIN} and {VALIDATION_RULES.MARKS_MAX} (in increments of 0.1)
          </p>
          
          {errors.marks && (
            <p className="text-red-600 text-xs font-medium">{errors.marks.message}</p>
          )}
        </div>

        {/* Progress Visualization */}
        {currentMarks > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span>Performance Level</span>
              <span className="font-semibold">{Math.round((currentMarks / 10) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  currentMarks >= 8 ? 'bg-green-500' :
                  currentMarks >= 6 ? 'bg-amber-500' :
                  currentMarks >= 4 ? 'bg-blue-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min((currentMarks / 10) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              trackButtonClick('cancel-competency-form', 'competency-form');
              onCancel();
            }}
            disabled={isSubmitting || loading}
            className="px-4 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {(isSubmitting || loading) && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            )}
            {isEditing ? 'Update Competency' : 'Add Competency'}
          </Button>
        </div>
      </form>
    </div>
  );
};