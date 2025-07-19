'use client';

import { useState } from 'react';
import { MoreVertical, Edit, Trash2, Award, Calendar, Trophy, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Competency } from '../../types/Competency';
import { formatDate, formatMarks } from '../../utils/helpers';
import { useAnalytics } from '../../hooks/useAnalytics';

interface CompetencyCardProps {
  competency: Competency;
  onEdit: (competency: Competency) => void;
  onDelete: (competency: Competency) => void;
}

export const CompetencyCard: React.FC<CompetencyCardProps> = ({
  competency,
  onEdit,
  onDelete,
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { trackButtonClick } = useAnalytics();

  const getMarksColor = (marks: number) => {
    if (marks >= 8) return 'bg-green-50 text-green-700 border-green-200';
    if (marks >= 6) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  const getMarksIcon = (marks: number) => {
    if (marks >= 8) return Trophy;
    if (marks >= 6) return Award;
    return Target;
  };

  const MarksIcon = getMarksIcon(competency.marks);

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 truncate">
                {competency.name}
              </h4>
            </div>
            
            <div className="relative ml-3">
              <Button
                variant="ghost"
                size="sm"
                className={`w-8 h-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={() => {
                  setShowActions(!showActions);
                  trackButtonClick('competency-actions', 'competency-card');
                }}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
              
              <AnimatePresence>
                {showActions && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-10 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 overflow-hidden"
                    onMouseLeave={() => setShowActions(false)}
                  >
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-150"
                      onClick={() => {
                        onEdit(competency);
                        setShowActions(false);
                        trackButtonClick('edit-competency', 'competency-card');
                      }}
                    >
                      <Edit className="w-4 h-4 text-gray-400" />
                      <span>Edit Competency</span>
                    </button>
                    <hr className="border-gray-100" />
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors duration-150"
                      onClick={() => {
                        onDelete(competency);
                        setShowActions(false);
                        trackButtonClick('delete-competency', 'competency-card');
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                      <span>Delete Competency</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Marks Display */}
          <div className="flex items-center justify-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold border ${getMarksColor(competency.marks)}`}>
              <MarksIcon className="w-4 h-4 mr-2" />
              {formatMarks(competency.marks)} / 10
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Score</span>
              <span className="font-semibold">{Math.round((competency.marks / 10) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <motion.div 
                className={`h-full rounded-full ${
                  competency.marks >= 8 ? 'bg-green-500' :
                  competency.marks >= 6 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${(competency.marks / 10) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <Calendar className="w-3 h-3" />
              <span>Created {formatDate(competency.createdAt!)}</span>
            </div>
            
            <motion.div 
              className="text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              initial={{ x: -10 }}
              animate={{ x: isHovered ? 0 : -10 }}
            >
              Edit →
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};