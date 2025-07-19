'use client';

import { useState } from 'react';
import { Plus, Search, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { SubjectCard } from './SubjectCard';
import { SubjectForm } from './SubjectForm';
import { Subject, CreateSubjectRequest, UpdateSubjectRequest } from '../../types/Subject';
import { useSubjects } from '../../hooks/useSubjects';
import { useAnalytics } from '../../hooks/useAnalytics';
import { debounce } from '../../utils/helpers';
import { analytics } from '@/services/analytics';
import { useRouter } from 'next/navigation';

export const SubjectList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);
  const router = useRouter();
  const { 
    subjects, 
    loading, 
    createSubject, 
    updateSubject, 
    deleteSubject,
    competencyCounts 
  } = useSubjects();

  const { trackButtonClick, trackModalOpen, trackModalClose } = useAnalytics();

  // Filter subjects based on search term
  const filteredSubjects = (subjects || []).filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSubject = async (data: CreateSubjectRequest | UpdateSubjectRequest) => {
    const createData: CreateSubjectRequest = {
      name: data.name!,
      description: data.description
    };
    await createSubject(createData);
    setShowCreateModal(false);
  };

  const handleUpdateSubject = async (data: CreateSubjectRequest | UpdateSubjectRequest) => {
    if (editingSubject?.id) {
      const updateData = data as UpdateSubjectRequest;
      await updateSubject(editingSubject.id, updateData);
      setEditingSubject(null);
    }
  };

  const handleDeleteSubject = async () => {
    if (deletingSubject?.id) {
      await deleteSubject(deletingSubject.id);
      setDeletingSubject(null);
    }
  };

  const debouncedSearch = debounce((term: string) => {
    setSearchTerm(term);
  }, 300);

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

  return (
    <div className="min-h-screen w-full ">
      <div className="w-full px-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">
              Subjects
            </h1>
            <p className="text-gray-600 text-lg">
              Manage evaluation subjects and their competencies
            </p>
          </div>
          <Button
            onClick={() => {
              trackButtonClick('create-subject', 'subject-list');
              trackModalOpen('create-subject');
              setShowCreateModal(true);
            }}
            className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Subject
          </Button>
        </div>

        {/* Search */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-lg">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <Input
              placeholder="Search subjects..."
              className="pl-12 pr-6 py-4 w-full bg-white border-gray-200 shadow-sm rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              onChange={(e) => debouncedSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Subject Grid */}
        {filteredSubjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {searchTerm ? 'No subjects found' : 'No subjects yet'}
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {searchTerm 
                  ? 'Try adjusting your search terms to find what you\'re looking for'
                  : 'Get started by creating your first subject to begin organizing your competencies'
                }
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => {
                    trackButtonClick('create-first-subject', 'empty-state');
                    trackModalOpen('create-subject');
                    setShowCreateModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Subject
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
            <AnimatePresence>
              {filteredSubjects.map((subject, index) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                  className="h-full"
                >
                  <SubjectCard
                    subject={subject}
                    competencyCount={competencyCounts[subject.id!] || 0}
                    onEdit={setEditingSubject}
                    onDelete={setDeletingSubject}
                    onView={(subject) => {
                      analytics.trackSubjectViewed(subject.id!);
                      router.push(`/subjects/${subject.id}`);
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Create Subject Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => {
            trackModalClose('create-subject');
            setShowCreateModal(false);
          }}
          title="Create New Subject"
          size="md"
        >
          <div className="bg-white rounded-lg">
            <SubjectForm
              onSubmit={handleCreateSubject}
              onCancel={() => {
                trackModalClose('create-subject');
                setShowCreateModal(false);
              }}
            />
          </div>
        </Modal>

        {/* Edit Subject Modal */}
        <Modal
          isOpen={!!editingSubject}
          onClose={() => {
            trackModalClose('edit-subject');
            setEditingSubject(null);
          }}
          title="Edit Subject"
          size="md"
        >
          {editingSubject && (
            <div className="bg-white rounded-lg">
              <SubjectForm
                subject={editingSubject}
                onSubmit={handleUpdateSubject}
                onCancel={() => {
                  trackModalClose('edit-subject');
                  setEditingSubject(null);
                }}
              />
            </div>
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={!!deletingSubject}
          onClose={() => {
            trackModalClose('delete-subject-confirmation');
            setDeletingSubject(null);
          }}
          title="Delete Subject"
          size="sm"
        >
          {deletingSubject && (
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
                  Are you sure you want to delete "{deletingSubject.name}"?
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
                    setDeletingSubject(null);
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
          )}
        </Modal>
      </div>
    </div>
  );
};