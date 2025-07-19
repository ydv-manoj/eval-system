'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BookText } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Subject, CreateSubjectRequest, UpdateSubjectRequest } from '../../types/Subject';
import { VALIDATION_RULES } from '../../utils/constants';
import { useAnalytics } from '../../hooks/useAnalytics';

const subjectSchema = z.object({
  name: z
    .string()
    .min(VALIDATION_RULES.SUBJECT_NAME_MIN_LENGTH, `Name must be at least ${VALIDATION_RULES.SUBJECT_NAME_MIN_LENGTH} characters`)
    .max(VALIDATION_RULES.SUBJECT_NAME_MAX_LENGTH, `Name cannot exceed ${VALIDATION_RULES.SUBJECT_NAME_MAX_LENGTH} characters`)
    .trim(),
  description: z
    .string()
    .max(VALIDATION_RULES.DESCRIPTION_MAX_LENGTH, `Description cannot exceed ${VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} characters`)
    .optional()
    .or(z.literal('')),
});

type SubjectFormData = z.infer<typeof subjectSchema>;

interface SubjectFormProps {
  subject?: Subject;
  onSubmit: (data: CreateSubjectRequest | UpdateSubjectRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const SubjectForm: React.FC<SubjectFormProps> = ({
  subject,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const { trackButtonClick } = useAnalytics();
  const isEditing = !!subject;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: subject?.name || '',
      description: subject?.description || '',
    },
  });

  const handleFormSubmit = async (data: SubjectFormData) => {
    trackButtonClick(isEditing ? 'save-subject-edit' : 'save-subject-create', 'subject-form');
    await onSubmit(data);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
          <BookText className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          {isEditing ? 'Edit Subject' : 'Add New Subject'}
        </h3>
        <p className="text-gray-600 text-sm">
          {isEditing ? 'Update the subject details' : 'Define a new subject to associate competencies with'}
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Subject Name *
          </label>
          <Input
            placeholder="e.g., Data Structures, Cloud Computing"
            className={`pl-4 pr-4 py-3 w-full border rounded-lg transition-all duration-200 ${
              errors.name 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
            }`}
            {...register('name')}
          />
          {errors.name && (
            <p className="text-red-600 text-xs font-medium">{errors.name.message}</p>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Description
          </label>
          <textarea
            placeholder="Brief description of the subject (optional)"
            className={`block w-full rounded-lg px-4 py-3 border text-sm transition-all duration-200 resize-none ${
              errors.description
                ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
            }`}
            rows={4}
            {...register('description')}
          />
          {errors.description && (
            <p className="text-red-600 text-xs font-medium">{errors.description.message}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              trackButtonClick('cancel-subject-form', 'subject-form');
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
            {isEditing ? 'Update Subject' : 'Add Subject'}
          </Button>
        </div>
      </form>
    </div>
  );
};
