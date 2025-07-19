'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, BookOpen, Calendar, User, Info } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import { SubjectForm } from '../../../components/subjects/SubjectForm';
import { CompetencyList } from '../../../components/competencies/CompetencyList';
import { Subject, UpdateSubjectRequest } from '../../../types/Subject';
import { SubjectService } from '../../../services/subjectService';
import { useAnalytics } from '../../../hooks/useAnalytics';
import { formatDate } from '../../../utils/helpers';
import toast from 'react-hot-toast';

export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = parseInt(params.id as string);
  
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingSubject, setEditingSubject] = useState(false);
  const [deletingSubject, setDeletingSubject] = useState(false);
  
  const { trackPageView, trackButtonClick, trackModalOpen, trackModalClose, analytics } = useAnalytics();

  useEffect(() => {
    trackPageView('Subject Detail');
    analytics.trackSubjectViewed(subjectId);
  }, [trackPageView, analytics, subjectId]);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        setLoading(true);
        const data = await SubjectService.getById(subjectId);
        setSubject(data);
      } catch (error) {
        console.error('Error fetching subject:', error);
        toast.error('Failed to load subject details');
        router.push('/subjects');
      } finally {
        setLoading(false);
      }
    };

    if (subjectId) {
      fetchSubject();
    }
  }, [subjectId, router]);

  const handleUpdateSubject = async (data: UpdateSubjectRequest) => {
    try {
      const updatedSubject = await SubjectService.update(subjectId, data);
      setSubject(updatedSubject);
      setEditingSubject(false);
      analytics.trackSubjectUpdated(subjectId);
      toast.success('Subject updated successfully');
    } catch (error) {
      console.error('Error updating subject:', error);
      toast.error('Failed to update subject');
    }
  };

  const handleDeleteSubject = async () => {
    try {
      await SubjectService.delete(subjectId);
      analytics.trackSubjectDeleted(subjectId);
      toast.success('Subject deleted successfully');
      router.push('/subjects');
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast.error('Failed to delete subject');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-24">
          <div className="relative">
            <div className="w-12 h-12 border-3 border-gray-200 rounded-full animate-spin border-t-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="w-full px-6 py-8">
          <div className="text-center py-16">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Subject not found</h3>
              <p className="text-gray-600 mb-8">The subject you're looking for doesn't exist or may have been deleted.</p>
              <Button 
                onClick={() => router.push('/subjects')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Subjects
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 rounded-2xl">
      <div className="w-full px-6 py-8 space-y-8 r">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-start space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                trackButtonClick('back-to-subjects', 'subject-detail');
                router.push('/subjects');
              }}
              className="mt-1 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{subject.name}</h1>
              <p className="text-lg text-gray-600 font-medium">Subject details and competencies</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                trackButtonClick('edit-subject', 'subject-detail');
                trackModalOpen('edit-subject');
                setEditingSubject(true);
              }}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Subject
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                trackButtonClick('delete-subject', 'subject-detail');
                trackModalOpen('delete-subject-confirmation');
                setDeletingSubject(true);
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Subject Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="bg-blue-600 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Info className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Subject Information</h2>
                <p className="text-blue-100 text-sm">Overview and details</p>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject Name
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-900 font-medium">{subject.name}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Created Date
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center text-gray-900">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <Calendar className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="font-medium">{formatDate(subject.createdAt!)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject ID
                </label>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-gray-900 font-mono text-sm">#{subjectId}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {subject.description && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-900 leading-relaxed">{subject.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Competencies Section */}
        <CompetencyList subjectId={subjectId} subjectName={subject.name} />

        {/* Edit Subject Modal */}
        <Modal
          isOpen={editingSubject}
          onClose={() => {
            trackModalClose('edit-subject');
            setEditingSubject(false);
          }}
          title="Edit Subject"
          size="md"
        >
          <div className="bg-white rounded-lg">
            <SubjectForm
              subject={subject}
              onSubmit={handleUpdateSubject}
              onCancel={() => {
                trackModalClose('edit-subject');
                setEditingSubject(false);
              }}
            />
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deletingSubject}
          onClose={() => {
            trackModalClose('delete-subject-confirmation');
            setDeletingSubject(false);
          }}
          title="Delete Subject"
          size="sm"
        >
          <div className="bg-white rounded-lg p-6 space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Delete Subject</h3>
                <p className="text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium mb-1">
                Are you sure you want to delete "{subject.name}"?
              </p>
              <p className="text-red-700 text-sm">
                This will also permanently delete all associated competencies.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  trackButtonClick('cancel-delete-subject', 'delete-confirmation');
                  setDeletingSubject(false);
                }}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  trackButtonClick('confirm-delete-subject', 'delete-confirmation');
                  handleDeleteSubject();
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                Delete Subject
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}