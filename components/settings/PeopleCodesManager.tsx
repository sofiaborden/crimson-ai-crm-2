import React, { useState } from 'react';
import { FlagIcon, PlusIcon, PencilIcon, TrashIcon } from '../../constants';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface PeopleCode {
  id: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  usageCount: number;
  createdDate: string;
}

interface PeopleCodesManagerProps {
  type: 'flags' | 'keywords' | 'attributes';
}

const PeopleCodesManager: React.FC<PeopleCodesManagerProps> = ({ type }) => {
  const [codes, setCodes] = useState<PeopleCode[]>([
    {
      id: '1',
      name: type === 'flags' ? 'VIP Donor' : type === 'keywords' ? 'Healthcare' : 'High Net Worth',
      description: type === 'flags' ? 'Major donor requiring special attention' : type === 'keywords' ? 'Works in healthcare industry' : 'Estimated net worth over $1M',
      color: '#10B981',
      isActive: true,
      usageCount: 45,
      createdDate: '2024-01-15'
    },
    {
      id: '2',
      name: type === 'flags' ? 'Board Member' : type === 'keywords' ? 'Education' : 'Business Owner',
      description: type === 'flags' ? 'Current or former board member' : type === 'keywords' ? 'Works in education sector' : 'Owns or operates a business',
      color: '#3B82F6',
      isActive: true,
      usageCount: 23,
      createdDate: '2024-01-20'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCode, setEditingCode] = useState<PeopleCode | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  });

  const colorOptions = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];

  const getTypeInfo = () => {
    switch (type) {
      case 'flags':
        return {
          title: 'Flags',
          description: 'Visual indicators for special donor status or characteristics',
          placeholder: 'e.g., VIP Donor, Board Member, Volunteer'
        };
      case 'keywords':
        return {
          title: 'Keywords',
          description: 'Searchable tags for categorizing contacts by interests or attributes',
          placeholder: 'e.g., Healthcare, Education, Technology'
        };
      case 'attributes':
        return {
          title: 'Attributes',
          description: 'Custom properties for detailed contact classification',
          placeholder: 'e.g., High Net Worth, Business Owner, Retiree'
        };
      default:
        return { title: '', description: '', placeholder: '' };
    }
  };

  const typeInfo = getTypeInfo();

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Please enter a name');
      return;
    }

    const newCode: PeopleCode = {
      id: editingCode?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      color: formData.color,
      isActive: true,
      usageCount: editingCode?.usageCount || 0,
      createdDate: editingCode?.createdDate || new Date().toISOString()
    };

    if (editingCode) {
      setCodes(codes => codes.map(code => code.id === editingCode.id ? newCode : code));
    } else {
      setCodes(codes => [...codes, newCode]);
    }

    setShowAddForm(false);
    setEditingCode(null);
    setFormData({ name: '', description: '', color: '#3B82F6' });
  };

  const handleEdit = (code: PeopleCode) => {
    setEditingCode(code);
    setFormData({
      name: code.name,
      description: code.description,
      color: code.color
    });
    setShowAddForm(true);
  };

  const handleDelete = (codeId: string) => {
    if (confirm('Are you sure you want to delete this code?')) {
      setCodes(codes => codes.filter(code => code.id !== codeId));
    }
  };

  const toggleStatus = (codeId: string) => {
    setCodes(codes => 
      codes.map(code => 
        code.id === codeId ? { ...code, isActive: !code.isActive } : code
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-crimson-blue bg-opacity-10 p-2 rounded-lg">
            <FlagIcon className="w-6 h-6 text-crimson-blue" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{typeInfo.title}</h3>
            <p className="text-sm text-gray-600">{typeInfo.description}</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)} 
          className="bg-crimson-blue hover:bg-crimson-dark-blue"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add {typeInfo.title.slice(0, -1)}
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">
            {editingCode ? 'Edit' : 'Add'} {typeInfo.title.slice(0, -1)}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder={typeInfo.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <div className="flex gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      formData.color === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this code"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} className="bg-crimson-blue hover:bg-crimson-dark-blue">
              {editingCode ? 'Update' : 'Add'} {typeInfo.title.slice(0, -1)}
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowAddForm(false);
                setEditingCode(null);
                setFormData({ name: '', description: '', color: '#3B82F6' });
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Codes List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h4 className="font-medium text-gray-900">Active {typeInfo.title}</h4>
          <p className="text-sm text-gray-600">Manage your {typeInfo.title.toLowerCase()} for contact organization</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {codes.map((code) => (
            <div key={code.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: code.color }}
                  />
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h5 className="font-semibold text-gray-900">{code.name}</h5>
                      <Badge 
                        className={`text-xs ${code.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {code.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {code.usageCount} contacts
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{code.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created on {new Date(code.createdDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => toggleStatus(code.id)}
                    className="text-xs"
                  >
                    {code.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEdit(code)}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleDelete(code.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PeopleCodesManager;
