import React, { useState } from 'react';
import { CurrencyDollarIcon, PlusIcon, PencilIcon, TrashIcon, FlagIcon } from '../../constants';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface FundraisingCode {
  id: string;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  usageCount: number;
  totalAmount: number;
  createdDate: string;
}

interface FundraisingCodesManagerProps {
  type: 'fund-codes' | 'source-codes';
}

const FundraisingCodesManager: React.FC<FundraisingCodesManagerProps> = ({ type }) => {
  const [codes, setCodes] = useState<FundraisingCode[]>([
    {
      id: '1',
      code: type === 'fund-codes' ? 'GEN' : 'WEB',
      name: type === 'fund-codes' ? 'General Fund' : 'Website',
      description: type === 'fund-codes' ? 'General operating expenses' : 'Online donations through website',
      isActive: true,
      usageCount: 1247,
      totalAmount: 125000,
      createdDate: '2024-01-15'
    },
    {
      id: '2',
      code: type === 'fund-codes' ? 'GOTV' : 'EMAIL',
      name: type === 'fund-codes' ? 'Get Out The Vote' : 'Email Campaign',
      description: type === 'fund-codes' ? 'Voter outreach and mobilization' : 'Email marketing campaigns',
      isActive: true,
      usageCount: 892,
      totalAmount: 89200,
      createdDate: '2024-01-20'
    },
    {
      id: '3',
      code: type === 'fund-codes' ? 'ADV' : 'PHONE',
      name: type === 'fund-codes' ? 'Advertising' : 'Phone Banking',
      description: type === 'fund-codes' ? 'Media and advertising expenses' : 'Telephone fundraising calls',
      isActive: false,
      usageCount: 456,
      totalAmount: 45600,
      createdDate: '2024-02-01'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCode, setEditingCode] = useState<FundraisingCode | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: ''
  });

  const getTypeInfo = () => {
    switch (type) {
      case 'fund-codes':
        return {
          title: 'Fund Codes',
          description: 'Categorize donations by purpose or fund designation',
          placeholder: 'e.g., GEN, GOTV, ADV',
          namePlaceholder: 'e.g., General Fund, Get Out The Vote'
        };
      case 'source-codes':
        return {
          title: 'Source Codes',
          description: 'Track donation sources and acquisition channels',
          placeholder: 'e.g., WEB, EMAIL, PHONE',
          namePlaceholder: 'e.g., Website, Email Campaign, Phone Banking'
        };
      default:
        return { title: '', description: '', placeholder: '', namePlaceholder: '' };
    }
  };

  const typeInfo = getTypeInfo();

  const handleSave = () => {
    if (!formData.code.trim() || !formData.name.trim()) {
      alert('Please enter both code and name');
      return;
    }

    const newCode: FundraisingCode = {
      id: editingCode?.id || Date.now().toString(),
      code: formData.code.toUpperCase(),
      name: formData.name,
      description: formData.description,
      isActive: true,
      usageCount: editingCode?.usageCount || 0,
      totalAmount: editingCode?.totalAmount || 0,
      createdDate: editingCode?.createdDate || new Date().toISOString()
    };

    if (editingCode) {
      setCodes(codes => codes.map(code => code.id === editingCode.id ? newCode : code));
    } else {
      setCodes(codes => [...codes, newCode]);
    }

    setShowAddForm(false);
    setEditingCode(null);
    setFormData({ code: '', name: '', description: '' });
  };

  const handleEdit = (code: FundraisingCode) => {
    setEditingCode(code);
    setFormData({
      code: code.code,
      name: code.name,
      description: code.description
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-crimson-blue bg-opacity-10 p-2 rounded-lg">
            <CurrencyDollarIcon className="w-6 h-6 text-crimson-blue" />
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                placeholder={typeInfo.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue uppercase"
                maxLength={10}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder={typeInfo.namePlaceholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
              />
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
                setFormData({ code: '', name: '', description: '' });
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
          <p className="text-sm text-gray-600">Manage your {typeInfo.title.toLowerCase()} for donation tracking</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {codes.map((code) => (
            <div key={code.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-crimson-blue bg-opacity-10 px-3 py-1 rounded-lg">
                    <span className="font-mono font-semibold text-crimson-blue text-sm">{code.code}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h5 className="font-semibold text-gray-900">{code.name}</h5>
                      <Badge 
                        className={`text-xs ${code.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {code.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{code.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{code.usageCount} donations</span>
                      <span>{formatCurrency(code.totalAmount)} raised</span>
                      <span>Created {new Date(code.createdDate).toLocaleDateString()}</span>
                    </div>
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

export default FundraisingCodesManager;
