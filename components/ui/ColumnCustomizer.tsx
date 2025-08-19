import React, { useState, useEffect } from 'react';
import { SettingsIcon, XMarkIcon, CheckCircleIcon } from '../../constants';
import Button from './Button';

interface ColumnOption {
  id: string;
  label: string;
  enabled: boolean;
  category?: string;
}

interface ColumnCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnOption[];
  onColumnsChange: (columns: ColumnOption[]) => void;
  title?: string;
}

const ColumnCustomizer: React.FC<ColumnCustomizerProps> = ({
  isOpen,
  onClose,
  columns,
  onColumnsChange,
  title = "Customize Columns"
}) => {
  const [localColumns, setLocalColumns] = useState<ColumnOption[]>(columns);

  useEffect(() => {
    setLocalColumns(columns);
  }, [columns]);

  if (!isOpen) return null;

  const handleToggle = (columnId: string) => {
    setLocalColumns(prev => 
      prev.map(col => 
        col.id === columnId ? { ...col, enabled: !col.enabled } : col
      )
    );
  };

  const handleSave = () => {
    onColumnsChange(localColumns);
    onClose();
  };

  const handleReset = () => {
    // Reset to default columns (first 6 typically)
    const resetColumns = localColumns.map((col, index) => ({
      ...col,
      enabled: index < 6
    }));
    setLocalColumns(resetColumns);
  };

  const handleDefault = () => {
    // Set to original defaults
    onColumnsChange(columns);
    setLocalColumns(columns);
    onClose();
  };

  // Group columns by category
  const groupedColumns = localColumns.reduce((acc, col) => {
    const category = col.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(col);
    return acc;
  }, {} as Record<string, ColumnOption[]>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-crimson-blue" />
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-96">
          <p className="text-sm text-gray-600 mb-4">
            Select which columns to display in the list view. Changes will be saved automatically.
          </p>

          <div className="space-y-4">
            {Object.entries(groupedColumns).map(([category, categoryColumns]) => (
              <div key={category}>
                {Object.keys(groupedColumns).length > 1 && (
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">{category}</h4>
                )}
                <div className="space-y-2">
                  {categoryColumns.map((column) => (
                    <label
                      key={column.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={column.enabled}
                          onChange={() => handleToggle(column.id)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                          column.enabled 
                            ? 'bg-crimson-blue border-crimson-blue' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}>
                          {column.enabled && (
                            <CheckCircleIcon className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-900 flex-1">{column.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleDefault}
              className="text-xs"
            >
              Default
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleReset}
              className="text-xs"
            >
              Reset
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-crimson-blue hover:bg-crimson-dark-blue"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColumnCustomizer;
