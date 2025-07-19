'use client';

import { BookOpen, Settings, Bell } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAnalytics } from '../../hooks/useAnalytics';

export const Header = () => {
  const { trackButtonClick } = useAnalytics();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="w-full px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl shadow-sm">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">EvalSystem</h1>
              <p className="text-sm text-gray-500">Evaluation Management</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => trackButtonClick('notifications', 'header')}
              className="p-3 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Bell className="w-5 h-5 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => trackButtonClick('settings', 'header')}
              className="p-3 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};