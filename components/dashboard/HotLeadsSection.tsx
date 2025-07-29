import React, { useState } from 'react';
import { PhoneIcon, MailIcon, FireIcon, ClockIcon, TrendingUpIcon, DocumentTextIcon, XMarkIcon } from '../../constants';
import DonorProfileModal from '../ui/DonorProfileModal';
import { getDonorProfileByName } from '../../utils/mockDonorProfiles';
import { Donor } from '../../types';

interface HotLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  confidenceScore: number;
  suggestedAsk: number;
  lastContact: string;
  reason: string;
  bestTimeToCall: string;
  callScript: string;
  notes: string;
  priority: 'urgent' | 'high' | 'medium';
  avatar: string;
}

interface CallScriptModalProps {
  lead: HotLead | null;
  isOpen: boolean;
  onClose: () => void;
  onCall: (lead: HotLead) => void;
}

const CallScriptModal: React.FC<CallScriptModalProps> = ({ lead, isOpen, onClose, onCall }) => {
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Call Script - {lead.name}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Contact Information</h4>
              <div className="text-sm text-blue-800">
                <p><strong>Phone:</strong> {lead.phone}</p>
                <p><strong>Best Time:</strong> {lead.bestTimeToCall}</p>
                <p><strong>Suggested Ask:</strong> ${lead.suggestedAsk.toLocaleString()}</p>
                <p><strong>Confidence:</strong> {lead.confidenceScore}%</p>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">Call Script</h4>
              <div className="text-sm text-green-800 whitespace-pre-line">
                {lead.callScript}
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">Key Notes</h4>
              <div className="text-sm text-yellow-800">
                {lead.notes}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => onCall(lead)}
                className="flex-1 bg-green-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <PhoneIcon className="w-5 h-5" />
                Call Now
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HotLeadsSection: React.FC = () => {
  const [selectedLead, setSelectedLead] = useState<HotLead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showDonorProfile, setShowDonorProfile] = useState(false);

  const handleDonorClick = (donorName: string) => {
    const donor = getDonorProfileByName(donorName);
    if (donor) {
      setSelectedDonor(donor);
      setShowDonorProfile(true);
    }
  };

  const [hotLeads] = useState<HotLead[]>([
    {
      id: '1',
      name: 'Joseph M. Banks',
      phone: '(202) 555-0182',
      email: 'j.banks.sr@example.com',
      confidenceScore: 92,
      suggestedAsk: 500,
      lastContact: '2 weeks ago',
      reason: 'Consistent major donor, ready for upgrade ask',
      bestTimeToCall: '10:30 AM - 12:00 PM',
      callScript: `Hi Joseph, this is Sofia from the campaign. I hope you're doing well!

I wanted to personally thank you for your incredible support over the years. Your contributions have made such a difference in our efforts.

I'm reaching out because we have an exciting opportunity coming up - our major donor dinner on August 15th. Given your commitment to our cause, I'd love to discuss how you might consider a special contribution of $500 to help us reach our quarterly goal.

Would you be interested in learning more about the impact this could make?`,
      notes: 'Prefers phone calls over email. Interested in policy details. Lives in Phoenix, AZ. Republican donor, mid-50s.',
      priority: 'urgent',
      avatar: 'https://i.pravatar.cc/150?u=joseph-banks'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      phone: '(555) 123-4567',
      email: 'sarah.j@example.com',
      confidenceScore: 87,
      suggestedAsk: 250,
      lastContact: '1 week ago',
      reason: 'Attended recent event, showed high engagement',
      bestTimeToCall: '2:00 PM - 4:00 PM',
      callScript: `Hi Sarah, this is Sofia from the campaign.

I wanted to follow up on our conversation at last week's event. It was wonderful meeting you and hearing about your passion for our cause.

Based on our discussion about education policy, I think you'd be interested in our upcoming initiative. We're looking for committed supporters like yourself to help us with a contribution of $250.

This would directly support our outreach efforts in your district. Would you be open to discussing this further?`,
      notes: 'Very interested in education policy. Teacher background. Attended recent town hall.',
      priority: 'high',
      avatar: 'https://i.pravatar.cc/150?u=sarah-johnson'
    },
    {
      id: '3',
      name: 'Michael Rodriguez',
      phone: '(555) 987-6543',
      email: 'm.rodriguez@example.com',
      confidenceScore: 78,
      suggestedAsk: 150,
      lastContact: '3 days ago',
      reason: 'First-time donor showing repeat interest',
      bestTimeToCall: '6:00 PM - 8:00 PM',
      callScript: `Hi Michael, this is Sofia from the campaign.

Thank you so much for your recent contribution! It means the world to have new supporters like you join our movement.

I'm calling because we have some exciting momentum building, and I wanted to see if you'd be interested in making an additional contribution of $150 to help us capitalize on this opportunity.

Your support would help us reach more voters in the final push. What do you think?`,
      notes: 'New donor, works evenings. Interested in economic issues. Lives in suburban district.',
      priority: 'medium',
      avatar: 'https://i.pravatar.cc/150?u=michael-rodriguez'
    }
  ]);

  const handleViewScript = (lead: HotLead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleCall = (lead: HotLead) => {
    setIsModalOpen(false);
    // Simulate making a call
    alert(`📞 Calling ${lead.name} at ${lead.phone}\n\nCall connected! Remember to:\n• Use the provided script\n• Ask for $${lead.suggestedAsk.toLocaleString()}\n• Log the outcome\n• Schedule follow-up if needed`);
  };

  const handleQuickCall = (lead: HotLead) => {
    alert(`📞 Quick calling ${lead.name}\n\nDialing ${lead.phone}...\nConfidence: ${lead.confidenceScore}%\nSuggested ask: $${lead.suggestedAsk.toLocaleString()}`);
  };

  const handleEmail = (lead: HotLead) => {
    alert(`✉️ Sending personalized email to ${lead.name}\n\nTo: ${lead.email}\nSubject: Following up on our conversation\nTemplate: Personalized based on ${lead.reason.toLowerCase()}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    return 'text-yellow-600';
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-red-500/10 p-3 rounded-xl shadow-sm">
              <FireIcon className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Hot Leads</h2>
              <p className="text-sm text-gray-600 mt-1">High conversion prospects</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-red-600">{hotLeads.length}</div>
            <div className="text-sm text-gray-600 font-medium">prospects ready</div>
          </div>
        </div>

        <div className="space-y-4">
          {hotLeads.map((lead) => (
            <div key={lead.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition-all duration-300">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img
                    src={lead.avatar}
                    alt={lead.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0 shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => handleDonorClick(lead.name)}
                        className="font-bold text-blue-600 hover:text-blue-800 truncate underline-offset-2 hover:underline transition-colors text-sm"
                      >
                        {lead.name}
                      </button>
                      <span className={`text-xs px-2 py-1 rounded-full border font-semibold ${getPriorityColor(lead.priority)}`}>
                        {lead.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2 line-clamp-1 leading-relaxed">{lead.reason}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        <span className="truncate">{lead.bestTimeToCall}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">
                      ${lead.suggestedAsk.toLocaleString()}
                    </div>
                    <div className={`text-xs font-medium ${getConfidenceColor(lead.confidenceScore)}`}>
                      {lead.confidenceScore}%
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => handleQuickCall(lead)}
                      className="bg-green-500 text-white p-1.5 rounded hover:bg-green-600 transition-colors"
                      title="Quick call"
                    >
                      <PhoneIcon className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleViewScript(lead)}
                      className="bg-purple-500 text-white p-1.5 rounded hover:bg-purple-600 transition-colors"
                      title="View call script"
                    >
                      <DocumentTextIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Total potential revenue: <span className="font-semibold text-green-600">$900</span>
            </div>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All Prospects →
            </button>
          </div>
        </div>
      </div>

      <CallScriptModal
        lead={selectedLead}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCall={handleCall}
      />

      {/* Donor Profile Modal */}
      <DonorProfileModal
        donor={selectedDonor}
        isOpen={showDonorProfile}
        onClose={() => setShowDonorProfile(false)}
      />
    </>
  );
};

export default HotLeadsSection;
