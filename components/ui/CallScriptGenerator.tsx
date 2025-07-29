import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import { SparklesIcon, ClipboardDocumentIcon } from '../../constants';

interface CallScript {
  segmentType: string;
  donorName: string;
  lastGift: string;
  avgGift: string;
  suggestedAsk: string;
  script: {
    opening: string;
    connection: string;
    ask: string;
    objectionHandling: string[];
    closing: string;
  };
}

interface CallScriptGeneratorProps {
  segmentId: string;
  segmentName: string;
  isOpen: boolean;
  onClose: () => void;
}

const CallScriptGenerator: React.FC<CallScriptGeneratorProps> = ({
  segmentId,
  segmentName,
  isOpen,
  onClose
}) => {
  const [selectedDonor, setSelectedDonor] = useState('');
  const [generatedScript, setGeneratedScript] = useState<CallScript | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const mockDonors = {
    'comeback-crew': [
      { name: 'Sarah Johnson', lastGift: '$250', avgGift: '$180', phone: '(555) 123-4567' },
      { name: 'Michael Chen', lastGift: '$500', avgGift: '$350', phone: '(555) 234-5678' },
      { name: 'Lisa Rodriguez', lastGift: '$150', avgGift: '$120', phone: '(555) 345-6789' }
    ],
    'neighborhood-mvps': [
      { name: 'Joseph Banks', lastGift: '$1,200', avgGift: '$800', phone: '(555) 456-7890' },
      { name: 'Patricia Williams', lastGift: '$2,500', avgGift: '$1,500', phone: '(555) 567-8901' },
      { name: 'Robert Davis', lastGift: '$900', avgGift: '$650', phone: '(555) 678-9012' }
    ]
  };

  const generateScript = async (donorName: string) => {
    setIsGenerating(true);
    
    // Simulate AI script generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const scripts = {
      'comeback-crew': {
        opening: `Hi ${donorName}, this is [Your Name] from [Campaign Name]. I hope you're doing well! I'm calling because you've been such an important supporter of our cause in the past.`,
        connection: `I was looking at your giving history and saw that your last gift of $250 in [Date] really made a difference in [specific impact]. We're so grateful for supporters like you who believe in our mission.`,
        ask: `We're launching a critical initiative this month, and I'd love to invite you back as a supporter. Based on your previous generosity, would you consider a gift of $300 to help us reach our goal?`,
        objectionHandling: [
          "If 'Not right now': I completely understand timing can be challenging. Would a smaller amount of $150 work better for you right now?",
          "If 'Need to think about it': Of course! Can I send you some information about the specific impact your gift would have? When would be a good time to follow up?",
          "If 'Financial concerns': I appreciate your honesty. Even a gift of $50 would make a meaningful difference. Every contribution helps us move forward."
        ],
        closing: `Thank you so much for your time today, ${donorName}. Your past support has meant the world to us, and we hope to have you back on our team soon. Have a wonderful day!`
      },
      'neighborhood-mvps': {
        opening: `Hi ${donorName}, this is [Your Name] from [Campaign Name]. I hope you're having a great day! I'm calling because you're one of our most valued supporters.`,
        connection: `Your generous gift of $1,200 last year helped us [specific achievement]. You're clearly someone who understands the importance of making a real impact in our community.`,
        ask: `We have an exciting opportunity to expand our impact this year, and I'd love to discuss a leadership gift with you. Would you consider a contribution of $1,500 to help us reach our ambitious goals?`,
        objectionHandling: [
          "If 'That's a lot': I understand it's a significant investment. Your leadership at this level would put you in our Chairman's Circle and include [specific benefits]. Would $1,000 feel more comfortable?",
          "If 'Need more information': Absolutely! I'd love to set up a brief meeting to show you exactly how your investment would be used. Are you available for coffee this week?",
          "If 'Already gave this year': You're absolutely right, and we're so grateful! This would be for our special expansion fund. Even $750 would make you a founding member of this initiative."
        ],
        closing: `${donorName}, thank you for being such a thoughtful supporter. Whether or not you're able to participate in this particular initiative, we're grateful for your ongoing commitment to our cause. I'll follow up with some additional information.`
      }
    };

    const script = scripts[segmentId as keyof typeof scripts] || scripts['comeback-crew'];
    
    setGeneratedScript({
      segmentType: segmentName,
      donorName,
      lastGift: '$250',
      avgGift: '$180',
      suggestedAsk: '$300',
      script
    });
    
    setIsGenerating(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show success message (in real app)
    console.log('Copied to clipboard');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <SparklesIcon className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold">AI Call Script Generator</h2>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                {segmentName}
              </span>
            </div>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>

          {!generatedScript ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Donor to Call:</label>
                <select
                  value={selectedDonor}
                  onChange={(e) => setSelectedDonor(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Choose a donor...</option>
                  {(mockDonors[segmentId as keyof typeof mockDonors] || []).map((donor, index) => (
                    <option key={index} value={donor.name}>
                      {donor.name} - Last: {donor.lastGift} - Avg: {donor.avgGift}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={() => generateScript(selectedDonor)}
                disabled={!selectedDonor || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating Personalized Script...
                  </div>
                ) : (
                  <>
                    <SparklesIcon className="w-4 h-4 mr-2" />
                    Generate AI Call Script
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-800 mb-2">Call Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600 font-medium">Donor:</span>
                    <p className="text-blue-800">{generatedScript.donorName}</p>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Last Gift:</span>
                    <p className="text-blue-800">{generatedScript.lastGift}</p>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Avg Gift:</span>
                    <p className="text-blue-800">{generatedScript.avgGift}</p>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Suggested Ask:</span>
                    <p className="text-blue-800 font-bold">{generatedScript.suggestedAsk}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { title: '1. Opening', content: generatedScript.script.opening },
                  { title: '2. Connection', content: generatedScript.script.connection },
                  { title: '3. The Ask', content: generatedScript.script.ask },
                  { title: '4. Closing', content: generatedScript.script.closing }
                ].map((section, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{section.title}</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(section.content)}
                      >
                        <ClipboardDocumentIcon className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{section.content}</p>
                  </div>
                ))}

                <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                  <h4 className="font-semibold text-orange-800 mb-2">Objection Handling</h4>
                  <div className="space-y-2">
                    {generatedScript.script.objectionHandling.map((objection, index) => (
                      <div key={index} className="text-sm text-orange-700">
                        <strong>•</strong> {objection}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setGeneratedScript(null)}
                  variant="secondary"
                  className="flex-1"
                >
                  Generate Another Script
                </Button>
                <Button
                  onClick={() => copyToClipboard(JSON.stringify(generatedScript.script, null, 2))}
                  className="flex-1"
                >
                  <ClipboardDocumentIcon className="w-4 h-4 mr-2" />
                  Copy Full Script
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CallScriptGenerator;
