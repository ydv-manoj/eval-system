'use client';

import { useState } from 'react';
import { MoreVertical, Edit, Trash2, Users, Calendar, BookOpen, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Subject } from '../../types/Subject';
import { formatDate, truncateText } from '../../utils/helpers';
import { useAnalytics } from '../../hooks/useAnalytics';

interface SubjectCardProps {
  subject: Subject;
  competencyCount: number;
  onEdit: (subject: Subject) => void;
  onDelete: (subject: Subject) => void;
  onView: (subject: Subject) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  competencyCount,
  onEdit,
  onDelete,
  onView,
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { trackButtonClick } = useAnalytics();

  const getCompetencyBadgeColor = (count: number) => {
    if (count >= 10) return 'bg-green-50 text-green-700 border-green-200';
    if (count >= 5) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (count >= 1) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    return 'bg-gray-50 text-gray-500 border-gray-200';
  };

  const getStatusText = (count: number) => {
    if (count >= 10) return 'Excellent';
    if (count >= 5) return 'Active';
    if (count >= 1) return 'Started';
    return 'Empty';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full group"
    >
      <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-4 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div className="text-white/90 text-xs font-semibold px-2 py-1 bg-white/20 rounded-md">
                SUBJECT
              </div>
            </div>
            
            {/* Action Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className={`w-8 h-8 p-0 bg-white/20 text-white hover:bg-white/30 rounded-lg transition-all duration-200 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions(!showActions);
                  trackButtonClick('subject-actions', 'subject-card');
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
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(subject);
                        setShowActions(false);
                        trackButtonClick('edit-subject', 'subject-card');
                      }}
                    >
                      <Edit className="w-4 h-4 text-gray-400" />
                      <span>Edit Subject</span>
                    </button>
                    <hr className="border-gray-100" />
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors duration-150"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(subject);
                        setShowActions(false);
                        trackButtonClick('delete-subject', 'subject-card');
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                      <span>Delete Subject</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Content */}
        <div 
          className="flex-1 flex flex-col p-5 cursor-pointer"
          onClick={() => {
            trackButtonClick('view-subject', 'subject-card');
            onView(subject);
          }}
        >
          {/* Title and Description */}
          <div className="flex-1 mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
              {subject.name}
            </h3>
            {subject.description && (
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                {truncateText(subject.description, 120)}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${getCompetencyBadgeColor(competencyCount)}`}>
                <Users className="w-3 h-3 mr-1.5" />
                {competencyCount} {competencyCount === 1 ? 'Competency' : 'Competencies'}
              </div>
              
              {competencyCount > 0 && (
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-500 font-medium">{getStatusText(competencyCount)}</span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {competencyCount > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Progress</span>
                  <span className="font-semibold">{Math.min(competencyCount * 10, 100)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <motion.div 
                    className="h-full bg-blue-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(competencyCount * 10, 100)}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <Calendar className="w-3 h-3" />
              <span>Created {formatDate(subject.createdAt!)}</span>
            </div>
            
            <motion.div 
              className="text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              initial={{ x: -10 }}
              animate={{ x: isHovered ? 0 : -10 }}
            >
              View Details →
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};