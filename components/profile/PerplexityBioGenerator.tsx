import React, { useState } from 'react';
import { BrainIcon, SparklesIcon } from '../../constants';
import Badge from '../ui/Badge';

interface PerplexityBioGeneratorProps {
  donor: {
    id: string;
    name: string;
    location?: string;
    totalLifetimeGiving?: number;
  };
}

interface BioResponse {
  bio: string;
  givingSummary: string;
  confidence: 'High' | 'Medium' | 'Low';
  sources: string[];
}

const PerplexityBioGenerator: React.FC<PerplexityBioGeneratorProps> = ({ donor }) => {
  const [showBioConfirmModal, setShowBioConfirmModal] = useState(false);
  const [showSourcesModal, setShowSourcesModal] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [bioData, setBioData] = useState<BioResponse | null>(null);
  const [error, setError] = useState<string>('');

  // Perplexity API integration with structured output
  const generateDonorBio = async () => {
    setIsGeneratingBio(true);
    setError('');

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY || 'your-api-key-here'}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'sonar',
          messages: [
            {
              role: 'system',
              content: `You are a professional fundraising researcher. Return ONLY valid JSON with no additional text, explanations, or formatting.

Required JSON format:
{
  "bio": "Brief professional background (MAX 200 chars)",
  "givingSummary": "Giving capacity or FEC data (MAX 100 chars)",
  "confidence": "High",
  "sources": ["url1", "url2"]
}

CRITICAL RULES:
- Bio: MAXIMUM 200 characters, professional background only
- GivingSummary: MAXIMUM 100 characters, use "No public giving data available" if none found
- Confidence: Must be exactly "High", "Medium", or "Low"
- Sources: Array of 1-3 actual URLs you used for research
- Return ONLY the JSON object, no other text`
            },
            {
              role: 'user',
              content: `Research ${donor.name}${donor.location ? ` in ${donor.location}` : ''}. Find: 1) Professional background/career 2) FEC giving records. Return JSON only.`
            }
          ],
          max_tokens: 400,
          temperature: 0.1
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content || '';

      console.log('Raw API Response:', rawContent);

      // Parse and validate JSON response
      try {
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.error('No JSON found in response. Raw content:', rawContent);
          throw new Error('No JSON found in response');
        }

        console.log('Extracted JSON:', jsonMatch[0]);
        const parsedData = JSON.parse(jsonMatch[0]) as BioResponse;
        console.log('Parsed data:', parsedData);

        // Server-side enforcement with better logging
        if (!parsedData.bio) {
          console.error('Bio is missing from response');
          throw new Error('Bio is missing from response');
        }

        if (parsedData.bio.length > 280) {
          console.error(`Bio too long: ${parsedData.bio.length} characters. Bio:`, parsedData.bio);
          // Instead of rejecting, let's truncate and warn
          parsedData.bio = parsedData.bio.substring(0, 277) + '...';
          console.warn('Bio truncated to 280 characters');
        }

        if (!parsedData.givingSummary) {
          parsedData.givingSummary = 'No public giving data available';
        }

        if (!['High', 'Medium', 'Low'].includes(parsedData.confidence)) {
          parsedData.confidence = 'Low';
        }

        if (!Array.isArray(parsedData.sources)) {
          parsedData.sources = [];
        }

        console.log('Final validated data:', parsedData);
        setBioData(parsedData);

      } catch (parseError) {
        console.error('Failed to parse bio response:', parseError);
        console.error('Raw content that failed to parse:', rawContent);
        throw new Error(`Invalid response format from API: ${parseError.message}`);
      }

    } catch (error) {
      console.error('Failed to generate bio:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate bio. Please try again.');
    } finally {
      setIsGeneratingBio(false);
      setShowBioConfirmModal(false);
    }
  };

  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {bioData ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* Header Inside Panel */}
          <div className="flex items-center gap-2 p-4 pb-3 border-b border-gray-100">
            <BrainIcon className="w-4 h-4 text-purple-600" />
            <h3 className="text-base font-semibold text-text-primary">AI Research</h3>
            <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">Perplexity</Badge>
          </div>

          {/* Bio Content */}
          <div className="p-4 pb-3">
            <div className="mb-3">
              <p className="text-gray-900 leading-relaxed text-sm font-medium mb-2">
                {bioData.bio}
              </p>
              <p className="text-gray-700 text-sm">
                <span className="font-medium">Giving Summary:</span> {bioData.givingSummary}
              </p>
            </div>
          </div>

          {/* Citations and Confidence */}
          <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSourcesModal(true)}
                className="text-blue-600 hover:text-blue-800 text-xs font-medium underline"
              >
                View Sources ({bioData.sources.length})
              </button>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">Confidence:</span>
                <Badge
                  className={`text-xs ${
                    bioData.confidence === 'High' ? 'bg-green-100 text-green-800 border-green-200' :
                    bioData.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                    'bg-gray-100 text-gray-800 border-gray-200'
                  }`}
                >
                  {bioData.confidence}
                </Badge>
              </div>
            </div>
            <span className="text-xs text-gray-500">{new Date().toLocaleDateString()}</span>
          </div>

          {/* Footer Disclaimer */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs text-gray-500 leading-relaxed">
              Public data only. Not for solicitation targeting. See FEC usage rules.
            </p>
          </div>

          {/* Actions Menu */}
          <div className="flex items-center gap-3 text-xs px-4 py-3">
            <button
              onClick={() => setShowBioConfirmModal(true)}
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              Refresh
            </button>
            <span className="text-gray-300">•</span>
            <button
              onClick={() => {
                const bioText = `${bioData.bio}\n\nGiving Summary: ${bioData.givingSummary}`;
                navigator.clipboard.writeText(bioText);
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              Copy bio
            </button>
            <span className="text-gray-300">•</span>
            <button className="text-gray-600 hover:text-gray-800">
              Report Issue
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-50 to-purple-50 border border-gray-200 rounded-lg shadow-sm">
          {/* Header Inside Panel */}
          <div className="flex items-center gap-2 p-4 pb-3 border-b border-gray-100">
            <BrainIcon className="w-4 h-4 text-purple-600" />
            <h3 className="text-base font-semibold text-text-primary">AI Research</h3>
            <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">Perplexity</Badge>
          </div>

          <div className="p-4 text-center">
            <div className="mb-4">
              <p className="text-gray-700 text-sm leading-relaxed mb-1">
                Generate an AI-researched donor bio
              </p>
              <p className="text-gray-500 text-xs">
                (2–3 sentences + giving summary)
              </p>
            </div>
            <button
              onClick={() => setShowBioConfirmModal(true)}
              disabled={isGeneratingBio}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 mx-auto"
            >
              {isGeneratingBio ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  Generating...
                </>
              ) : (
                <>
                  <BrainIcon className="w-4 h-4" />
                  Create Bio
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Bio Generation Confirmation Modal */}
      {showBioConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-2 rounded-full">
                <BrainIcon className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Bio Generation</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-3">
                This action will run a live Perplexity query to create a donor bio using real-time web research.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-yellow-800 font-medium text-sm">Estimated cost:</span>
                  <span className="text-yellow-900 font-semibold text-sm">~$0.02 per bio</span>
                </div>
                <p className="text-yellow-700 text-xs">
                  Charges will be applied to your CMDI Perplexity account
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBioConfirmModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={generateDonorBio}
                disabled={isGeneratingBio}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isGeneratingBio ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  'Run Bio Search'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sources Modal */}
      {showSourcesModal && bioData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Sources</h3>
              <button
                onClick={() => setShowSourcesModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              {bioData.sources.length > 0 ? (
                bioData.sources.map((source, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <a
                      href={source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm break-all"
                    >
                      {source}
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No sources available</p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowSourcesModal(false)}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PerplexityBioGenerator;
