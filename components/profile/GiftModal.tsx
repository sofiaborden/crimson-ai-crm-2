import React, { useState } from 'react';
import { XMarkIcon, CalendarIcon, CurrencyDollarIcon, ArrowDownTrayIcon, DocumentTextIcon, TrashIcon } from '../../constants';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  gift?: any;
  mode: 'view' | 'add' | 'edit';
}

export const GiftModal: React.FC<GiftModalProps> = ({ isOpen, onClose, gift, mode }) => {
  const [formData, setFormData] = useState({
    // Gift section
    transactionId: gift?.transactionId || '',
    batchId: gift?.batchId || '',
    receiptDate: gift?.receiptDate || '',
    giftType: gift?.giftType || 'RG - Regular',
    amount: gift?.amount || '',
    channel: gift?.channel || '',
    fund: gift?.fund || 'C-PAC - PAC',
    revenue: gift?.revenue || 'N/A - N/A',
    projectEvent: gift?.projectEvent || '',
    
    // Payment section
    paymentType: gift?.paymentType || 'CH - Check',
    checkCardNumber: gift?.checkCardNumber || '',
    cardExpDate: gift?.cardExpDate || '',
    approvalCode: gift?.approvalCode || '',
    ccTransactionId: gift?.ccTransactionId || '',
    receivedDate: gift?.receivedDate || '',
    comment: gift?.comment || '',
    referenceId: gift?.referenceId || '',
    
    // Other sections
    adjustmentType: gift?.adjustmentType || '',
    adjustmentDate: gift?.adjustmentDate || '',
    adjustmentAmount: gift?.adjustmentAmount || '',
    trackId: gift?.trackId || '2011 - Alison D. Monsef',
    amount2: gift?.amount2 || '500',
    conduit: gift?.conduit || '',
    thankYou: gift?.thankYou || 'S - "Thank You" is sent',
    fecMemoText: gift?.fecMemoText || '',
    move: gift?.move || '',
    moveLifeCycleStage: gift?.moveLifeCycleStage || '',
    exceptionCode: gift?.exceptionCode || '- - n/a',
    exceptionDate: gift?.exceptionDate || '',
    sourceCode: gift?.sourceCode || 'MISC1 - MISC (VOL, BIZ, IND, OTHER)'
  });

  const [attachments, setAttachments] = useState<File[]>(gift?.attachments || []);
  const [dragActive, setDragActive] = useState(false);
  const [showAdjustmentForm, setShowAdjustmentForm] = useState(false);
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);
  const [refundDate, setRefundDate] = useState('');

  const isViewMode = mode === 'view';
  const isAddMode = mode === 'add';

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Saving gift:', formData);
    console.log('Attachments:', attachments);
    onClose();
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const adjustmentTypes = [
    'CB - Chargeback - Full',
    'PC - Chargeback - Partial',
    'DB - Debit',
    'DP - Dispute',
    'DA - Donor Advised Fund',
    'EM - Earmark Attribution',
    'AB - JFC Attribution',
    'MF - Merchant Credit - Full',
    'MP - Merchant Credit - Partial',
    'PT - Partnership Attribution',
    'RA - Reattribution - Presumptive',
    'RD - Redesignation - Full',
    'ST - Redesignation - Partial',
    'FR - Refund - Full',
    'PR - Refund - Partial',
    'SF - Split - Full',
    'SP - Split - Partial',
    'SU - Support',
    'EG - Third Party Employee Giving',
    'TR - Transfer',
    'TA - Trust Attribution',
    'TE - Trustee'
  ];

  const handleAdjustmentClick = () => {
    setShowAdjustmentForm(true);
    setShowRefundForm(false);
  };

  const handleRefundClick = () => {
    setShowRefundForm(true);
    setShowAdjustmentForm(false);
  };

  const handleRefundSave = () => {
    if (!refundDate) {
      alert('Please select a refund date');
      return;
    }
    setShowRefundConfirm(true);
  };

  const handleRefundConfirm = () => {
    setShowRefundConfirm(false);
    console.log('Refund confirmed for date:', refundDate);
    setShowRefundForm(false);
    setRefundDate('');
  };

  const handleRefundCancel = () => {
    setShowRefundConfirm(false);
  };

  const handleApplyAdjustment = () => {
    console.log('Applying adjustment:', formData.adjustmentType, formData.adjustmentAmount);
    setShowAdjustmentForm(false);
  };

  const handleApplyRefund = () => {
    console.log('Applying refund:', formData.adjustmentAmount);
    setShowRefundForm(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-crimson-blue to-crimson-dark-blue text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <CurrencyDollarIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {isAddMode ? 'Add New Gift' : isViewMode ? 'Gift Details' : 'Edit Gift'}
                </h2>
                {gift && (
                  <p className="text-blue-100 text-sm">MID: {gift.mid}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors p-1 rounded-lg hover:bg-white hover:bg-opacity-10"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 bg-gray-50">
          {/* Main sections in a cleaner 2-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

            {/* Gift Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">Gift Details</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Id#</label>
                  <input
                    type="text"
                    value={formData.transactionId}
                    onChange={(e) => handleInputChange('transactionId', e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    placeholder="461646"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch Id#</label>
                  <input
                    type="text"
                    value={formData.batchId}
                    onChange={(e) => handleInputChange('batchId', e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    placeholder="1255"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.receiptDate}
                      onChange={(e) => handleInputChange('receiptDate', e.target.value)}
                      disabled={isViewMode}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    />
                    <CalendarIcon className="absolute right-3 top-2.5 w-4 h-4 text-crimson-blue pointer-events-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gift Type</label>
                  <select
                    value={formData.giftType}
                    onChange={(e) => handleInputChange('giftType', e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  >
                    <option value="RG - Regular">RG - Regular</option>
                    <option value="PL - Pledge">PL - Pledge</option>
                    <option value="MG - Major Gift">MG - Major Gift</option>
                    <option value="EV - Event">EV - Event</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      disabled={isViewMode}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                      placeholder="500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Channel</label>
                  <select
                    value={formData.channel}
                    onChange={(e) => handleInputChange('channel', e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  >
                    <option value="">Select Channel</option>
                    <option value="Online">Online</option>
                    <option value="Mail">Mail</option>
                    <option value="Phone">Phone</option>
                    <option value="Event">Event</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fund</label>
                  <select
                    value={formData.fund}
                    onChange={(e) => handleInputChange('fund', e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  >
                    <option value="C-PAC - PAC">C-PAC - PAC</option>
                    <option value="General">General</option>
                    <option value="Building">Building</option>
                    <option value="Special Events">Special Events</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Revenue</label>
                  <select
                    value={formData.revenue}
                    onChange={(e) => handleInputChange('revenue', e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  >
                    <option value="N/A - N/A">N/A - N/A</option>
                    <option value="Primary">Primary</option>
                    <option value="Secondary">Secondary</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project/Event</label>
                  <select
                    value={formData.projectEvent}
                    onChange={(e) => handleInputChange('projectEvent', e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  >
                    <option value="">Select Project/Event</option>
                    <option value="Annual Gala">Annual Gala</option>
                    <option value="Capital Campaign">Capital Campaign</option>
                    <option value="General Fund">General Fund</option>
                  </select>
                </div>

                {/* Source Code - moved up for importance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.sourceCode}
                      onChange={(e) => handleInputChange('sourceCode', e.target.value)}
                      disabled={isViewMode}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    />
                    {!isViewMode && (
                      <Button size="sm" variant="secondary">
                        <XMarkIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                    <div className="text-sm text-blue-800">
                      <div className="font-medium mb-1">FC01 - MISC RESPONSES</div>
                      <div className="text-blue-600">Program</div>
                      <div className="font-medium">HOU5 - Housefile</div>
                      <div className="text-xs text-blue-500 mt-2">
                        Entered on Wed Apr 17 2019 by Rachel Gibson
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                <div className="w-2 h-6 bg-green-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">Payment & Attachments</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                  <select
                    value={formData.paymentType}
                    onChange={(e) => handleInputChange('paymentType', e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  >
                    <option value="CH - Check">CH - Check</option>
                    <option value="CC - Credit Card">CC - Credit Card</option>
                    <option value="CA - Cash">CA - Cash</option>
                    <option value="EFT - Electronic Transfer">EFT - Electronic Transfer</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check/Card Number</label>
                  <input
                    type="text"
                    value={formData.checkCardNumber}
                    onChange={(e) => handleInputChange('checkCardNumber', e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Exp Date (mm/yy)</label>
                  <input
                    type="text"
                    value={formData.cardExpDate}
                    onChange={(e) => handleInputChange('cardExpDate', e.target.value)}
                    disabled={isViewMode}
                    placeholder="12/25"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Approval Code</label>
                  <input
                    type="text"
                    value={formData.approvalCode}
                    onChange={(e) => handleInputChange('approvalCode', e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CC Transaction Id</label>
                  <input
                    type="text"
                    value={formData.ccTransactionId}
                    onChange={(e) => handleInputChange('ccTransactionId', e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Received Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.receivedDate}
                      onChange={(e) => handleInputChange('receivedDate', e.target.value)}
                      disabled={isViewMode}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    />
                    <CalendarIcon className="absolute right-3 top-2.5 w-4 h-4 text-crimson-blue pointer-events-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => handleInputChange('comment', e.target.value)}
                    disabled={isViewMode}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reference Id#</label>
                  <input
                    type="text"
                    value={formData.referenceId}
                    onChange={(e) => handleInputChange('referenceId', e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>

                {/* Attachments Section */}
                {!isViewMode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>

                    {/* File Upload Drop Zone */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        dragActive
                          ? 'border-blue-400 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                    >
                      <ArrowDownTrayIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Drag and drop files here, or{' '}
                        <label className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
                          browse
                          <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFileUpload(e.target.files)}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.csv,.xlsx"
                          />
                        </label>
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, images, and other common formats
                      </p>
                    </div>

                    {/* Uploaded Files List */}
                    {attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                            <div className="flex items-center gap-2">
                              <DocumentTextIcon className="w-4 h-4 text-gray-500" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{file.name}</div>
                                <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                              </div>
                            </div>
                            <button
                              onClick={() => removeAttachment(index)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Remove attachment"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* View Mode - Show Existing Attachments */}
                {isViewMode && attachments.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                    <div className="space-y-2">
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                          <DocumentTextIcon className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{file.name}</div>
                            <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Secondary sections in a 3-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

            {/* Adjustment & Refund Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">Adjustment & Refund</h3>
              </div>

              {/* Action Buttons */}
              {!showAdjustmentForm && !showRefundForm && !isViewMode && (
                <div className="flex gap-3 mb-4">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleAdjustmentClick}
                    className="flex-1"
                  >
                    Adjust
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleRefundClick}
                    className="flex-1"
                  >
                    Request Refund
                  </Button>
                </div>
              )}

              {/* Adjustment Form */}
              {showAdjustmentForm && (
                <div className="bg-crimson-accent-blue bg-opacity-10 border border-crimson-accent-blue border-opacity-30 rounded-lg p-4 mb-4">
                  <div className="bg-crimson-blue text-white px-4 py-2 rounded-t-lg -mx-4 -mt-4 mb-4">
                    <h4 className="font-medium">Adjust</h4>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adjustment</label>
                      <select
                        value={formData.adjustmentType}
                        onChange={(e) => handleInputChange('adjustmentType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                      >
                        <option value="">Select Adjustment Type</option>
                        {adjustmentTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adjustment Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formData.adjustmentDate}
                          onChange={(e) => handleInputChange('adjustmentDate', e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                        />
                        <CalendarIcon className="absolute right-3 top-2.5 w-4 h-4 text-crimson-blue pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Miscellaneous</label>
                      <textarea
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                        placeholder="Additional notes..."
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" onClick={handleApplyAdjustment} className="bg-crimson-blue hover:bg-crimson-dark-blue text-white">
                        Apply
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setShowAdjustmentForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Refund Form */}
              {showRefundForm && (
                <div className="bg-crimson-accent-blue bg-opacity-10 border border-crimson-accent-blue border-opacity-30 rounded-lg p-4 mb-4">
                  <div className="bg-crimson-blue text-white px-4 py-2 rounded-t-lg -mx-4 -mt-4 mb-4">
                    <h4 className="font-medium">Request a Refund</h4>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Refund Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={refundDate}
                          onChange={(e) => setRefundDate(e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-crimson-blue focus:border-crimson-blue"
                        />
                        <CalendarIcon className="absolute right-3 top-2.5 w-4 h-4 text-crimson-blue pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={handleRefundSave}
                        className="bg-crimson-blue hover:bg-crimson-dark-blue text-white"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setShowRefundForm(false);
                          setRefundDate('');
                        }}
                        className="bg-crimson-red hover:bg-red-700 text-white"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fundraiser Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">Fundraiser</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Track Id</label>
                  <input
                    type="text"
                    value={formData.trackId}
                    onChange={(e) => handleInputChange('trackId', e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      value={formData.amount2}
                      onChange={(e) => handleInputChange('amount2', e.target.value)}
                      disabled={isViewMode}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button size="sm" variant="secondary" disabled={isViewMode}>
                    Add Fundraiser
                  </Button>
                </div>
              </div>
            </div>

            {/* Conduit Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                <div className="w-2 h-6 bg-teal-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">Conduit</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Conduit</label>
                  <input
                    type="text"
                    value={formData.conduit}
                    onChange={(e) => handleInputChange('conduit', e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>

                <div className="pt-4">
                  <Button size="sm" variant="secondary" disabled={isViewMode}>
                    Add Conduit
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Additional sections in a 2-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

            {/* Miscellaneous Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">Miscellaneous</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thank You</label>
                  <select
                    value={formData.thankYou}
                    onChange={(e) => handleInputChange('thankYou', e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  >
                    <option value='S - "Thank You" is sent'>S - "Thank You" is sent</option>
                    <option value='N - No "Thank You"'>N - No "Thank You"</option>
                    <option value='P - "Thank You" pending'>P - "Thank You" pending</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">FEC Memo Text</label>
                  <textarea
                    value={formData.fecMemoText}
                    onChange={(e) => handleInputChange('fecMemoText', e.target.value)}
                    disabled={isViewMode}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Move Management Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                <div className="w-2 h-6 bg-pink-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">Move Management</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Move</label>
                  <select
                    value={formData.move}
                    onChange={(e) => handleInputChange('move', e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  >
                    <option value="">Select Move</option>
                    <option value="Cultivation">Cultivation</option>
                    <option value="Solicitation">Solicitation</option>
                    <option value="Stewardship">Stewardship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Move Life Cycle Stage</label>
                  <select
                    value={formData.moveLifeCycleStage}
                    onChange={(e) => handleInputChange('moveLifeCycleStage', e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  >
                    <option value="">Select Stage</option>
                    <option value="Identification">Identification</option>
                    <option value="Qualification">Qualification</option>
                    <option value="Cultivation">Cultivation</option>
                    <option value="Solicitation">Solicitation</option>
                    <option value="Stewardship">Stewardship</option>
                  </select>
                </div>


              </div>
            </div>
          </div>

          {/* Exception section - now standalone */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Exception Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                <div className="w-2 h-6 bg-red-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">Exception</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exception Code</label>
                  <select
                    value={formData.exceptionCode}
                    onChange={(e) => handleInputChange('exceptionCode', e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  >
                    <option value="- - n/a">- - n/a</option>
                    <option value="EX1 - Exception 1">EX1 - Exception 1</option>
                    <option value="EX2 - Exception 2">EX2 - Exception 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exception Date</label>
                  <input
                    type="date"
                    value={formData.exceptionDate}
                    onChange={(e) => handleInputChange('exceptionDate', e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-white rounded-b-xl">
          <Button
            variant="secondary"
            onClick={onClose}
            className="px-6 py-2.5 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          {!isViewMode && (
            <Button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-crimson-blue hover:bg-crimson-dark-blue text-white shadow-sm"
            >
              {isAddMode ? 'Add Gift' : 'Save Changes'}
            </Button>
          )}
          {isViewMode && (
            <Button
              onClick={() => console.log('Edit mode')}
              className="px-6 py-2.5 bg-crimson-blue hover:bg-crimson-dark-blue text-white shadow-sm"
            >
              Edit Gift
            </Button>
          )}
        </div>
      </div>

      {/* Refund Confirmation Modal */}
      {showRefundConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="bg-crimson-blue text-white px-6 py-4 rounded-t-lg">
              <h3 className="text-lg font-semibold text-center">Are you sure to create Payment Request for a Refund?</h3>
            </div>
            <div className="p-6 bg-gray-50">
              <div className="mb-4 text-center text-gray-700">
                <p className="text-sm">Refund Date: <span className="font-medium">{refundDate}</span></p>
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={handleRefundConfirm}
                  className="bg-white text-crimson-blue border-2 border-crimson-blue hover:bg-crimson-blue hover:text-white px-8 transition-colors"
                >
                  Yes
                </Button>
                <Button
                  onClick={handleRefundCancel}
                  className="bg-crimson-red hover:bg-red-700 text-white px-8"
                >
                  No
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
