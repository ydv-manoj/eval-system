'use client';

import { useState } from 'react';
import { Plus, Search, Award, TrendingUp, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Card, CardHeader } from '../ui/Card';
import { CompetencyCard } from './CompetencyCard';
import { CompetencyForm } from './CompetencyForm';
import { Competency, CreateCompetencyRequest, UpdateCompetencyRequest } from '../../types/Competency';
import { useCompetencies } from '../../hooks/useCompetencies';
import { useAnalytics } from '../../hooks/useAnalytics';
import { debounce, formatMarks } from '../../utils/helpers';

interface CompetencyListProps {
  subjectId: number;
  subjectName: string;
}

export const CompetencyList: React.FC<CompetencyListProps> = ({
  subjectId,
  subjectName,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCompetency, setEditingCompetency] = useState<Competency | null>(null);
  const [deletingCompetency, setDeletingCompetency] = useState<Competency | null>(null);

  const {
    competencies,
    loading,
    createCompetency,
    updateCompetency,
    deleteCompetency,
  } = useCompetencies(subjectId);

  const { trackButtonClick, trackModalOpen, trackModalClose } = useAnalytics();

  // Filter competencies based on search term
  const filteredCompetencies = competencies.filter(competency =>
    competency.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const totalCompetencies = competencies.length;
  const averageMarks = competencies.length > 0 
    ? competencies.reduce((sum, comp) => sum + comp.marks, 0) / competencies.length
    : 0;
  const highestMarks = competencies.length > 0 
    ? Math.max(...competencies.map(comp => comp.marks))
    : 0;

  const handleCreateCompetency = async (data: CreateCompetencyRequest | UpdateCompetencyRequest) => {
    const { name, marks } = data as CreateCompetencyRequest;
    if (typeof name !== 'string' || typeof marks !== 'number') {
      return;
    }
    const createData: CreateCompetencyRequest = {
      name,
      marks,
      subjectId: (data as CreateCompetencyRequest).subjectId || subjectId
    };
    await createCompetency(createData);
    setShowCreateModal(false);
  };

  const handleUpdateCompetency = async (data: CreateCompetencyRequest | UpdateCompetencyRequest) => {
    if (editingCompetency?.id) {
      const updateData = data as UpdateCompetencyRequest;
      await updateCompetency(editingCompetency.id, updateData);
      setEditingCompetency(null);
    }
  };

  const handleDeleteCompetency = async () => {
    if (deletingCompetency?.id) {
      await deleteCompetency(deletingCompetency.id);
      setDeletingCompetency(null);
    }
  };

  const debouncedSearch = debounce((term: string) => {
    setSearchTerm(term);
  }, 300);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-center py-16">
          <div className="relative">
            <div className="w-12 h-12 border-3 border-gray-200 rounded-full animate-spin border-t-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Competencies</h2>
            <p className="text-blue-100 text-sm">Manage evaluation criteria for {subjectName}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Total Competencies</p>
                <p className="text-2xl font-bold text-gray-900">{totalCompetencies}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Average Marks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatMarks(averageMarks)} / 10
                </p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600">Highest Marks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatMarks(highestMarks)} / 10
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex justify-center sm:justify-start">
            <div className="relative w-full max-w-md">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <Input
                placeholder="Search competencies..."
                className="pl-11 pr-4 py-3 w-full bg-white border-gray-200 shadow-sm rounded-lg text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            </div>
          </div>
          
          <Button
            onClick={() => {
              trackButtonClick('create-competency', 'competency-list');
              trackModalOpen('create-competency');
              setShowCreateModal(true);
            }}
            className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Competency
          </Button>
        </div>

        {/* Competency Grid */}
        {filteredCompetencies.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Award className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {searchTerm ? 'No competencies found' : 'No competencies yet'}
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {searchTerm 
                ? 'Try adjusting your search terms to find what you\'re looking for'
                : 'Add your first competency to start defining evaluation criteria'
              }
            </p>
            {!searchTerm && (
              <Button
                onClick={() => {
                  trackButtonClick('create-first-competency', 'empty-state');
                  trackModalOpen('create-competency');
                  setShowCreateModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Competency
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredCompetencies.map((competency, index) => (
                <motion.div
                  key={competency.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.3
                  }}
                >
                  <CompetencyCard
                    competency={competency}
                    onEdit={setEditingCompetency}
                    onDelete={setDeletingCompetency}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Create Competency Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          trackModalClose('create-competency');
          setShowCreateModal(false);
        }}
        title="Add New Competency"
        size="md"
      >
        <div className="bg-white rounded-lg">
          <CompetencyForm
            subjectId={subjectId}
            onSubmit={handleCreateCompetency}
            onCancel={() => {
              trackModalClose('create-competency');
              setShowCreateModal(false);
            }}
          />
        </div>
      </Modal>

      {/* Edit Competency Modal */}
      <Modal
        isOpen={!!editingCompetency}
        onClose={() => {
          trackModalClose('edit-competency');
          setEditingCompetency(null);
        }}
        title="Edit Competency"
        size="md"
      >
        {editingCompetency && (
          <div className="bg-white rounded-lg">
            <CompetencyForm
              competency={editingCompetency}
              subjectId={subjectId}
              onSubmit={handleUpdateCompetency}
              onCancel={() => {
                trackModalClose('edit-competency');
                setEditingCompetency(null);
              }}
            />
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingCompetency}
        onClose={() => {
          trackModalClose('delete-competency-confirmation');
          setDeletingCompetency(null);
        }}
        title="Delete Competency"
        size="sm"
      >
        {deletingCompetency && (
          <div className="bg-white rounded-lg p-6 space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Delete Competency</h3>
                <p className="text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">
                Are you sure you want to delete "{deletingCompetency.name}"?
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  trackButtonClick('cancel-delete-competency', 'delete-confirmation');
                  setDeletingCompetency(null);
                }}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  trackButtonClick('confirm-delete-competency', 'delete-confirmation');
                  handleDeleteCompetency();
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                Delete Competency
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};