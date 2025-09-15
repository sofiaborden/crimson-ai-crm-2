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
  // Process structured JSON response (improved approach based on ChatGPT suggestions)
  const processStructuredResponse = (content: string, donor: any): BioResponse => {
    try {
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      console.log('Parsed structured response:', parsed);

      // Handle different status types
      if (parsed.status !== 'ok') {
        if (parsed.status === 'no_match') {
          return {
            bio: 'No confident public match found. Try adding employer or city.',
            givingSummary: 'No public giving data available',
            confidence: 'Low',
            sources: []
          };
        }
        if (parsed.status === 'disambiguation') {
          return {
            bio: 'Multiple people found. Please provide more specific information.',
            givingSummary: 'No public giving data available',
            confidence: 'Low',
            sources: []
          };
        }
        throw new Error(`API returned status: ${parsed.status}`);
      }

      // Process successful response
      const bio = Array.isArray(parsed.bio_sentences)
        ? parsed.bio_sentences.filter(s => s.trim()).slice(0, 3).join(' ')
        : `${donor.name} is a political donor with available public records.`;

      const givingSummary = parsed.giving_summary || 'No public giving data available';

      // Map confidence levels
      const confidenceMap = {
        'high': 'High',
        'medium': 'Medium',
        'low': 'Low'
      };
      const confidence = confidenceMap[parsed.confidence?.toLowerCase()] || 'Medium';

      // Extract source URLs from citations
      const sources = Array.isArray(parsed.citations)
        ? parsed.citations.map(c => c.url).filter(Boolean)
        : ['Public Records'];

      return {
        bio: bio.length > 280 ? bio.substring(0, 277) + '...' : bio,
        givingSummary: givingSummary.length > 100 ? givingSummary.substring(0, 97) + '...' : givingSummary,
        confidence,
        sources
      };

    } catch (error) {
      console.error('Error processing structured response:', error);
      console.error('Raw content:', content);

      // Fallback to basic processing
      return {
        bio: `${donor.name} is a political donor. Research data temporarily unavailable.`,
        givingSummary: 'No public giving data available',
        confidence: 'Low',
        sources: ['Public Records']
      };
    }
  };

  const generateDonorBio = async () => {
    setIsGeneratingBio(true);
    setError('');

    try {
      // Use the existing Perplexity API configuration
      const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
      const PERPLEXITY_API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY || process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY || '';

      if (!PERPLEXITY_API_KEY) {
        throw new Error('Perplexity API key not configured. Please set VITE_PERPLEXITY_API_KEY in your environment.');
      }

      const response = await fetch(PERPLEXITY_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'sonar-pro', // Current valid advanced search model
          temperature: 0.1, // Keep deterministic
          max_tokens: 800,
          top_p: 0.9,
          return_citations: true,
          messages: [
            {
              role: 'system',
              content: 'You are a research assistant that writes short, factual, citation-backed donor bios for U.S. political fundraising CRMs. You must only state facts you can cite with reputable URLs. If uncertain, omit. Output JSON exactly in the requested schema. Do not include commentary.'
            },
            {
              role: 'user',
              content: `Task: Produce a concise factual bio for a U.S. donor and a one-line giving summary if confidently found in FEC or equivalent sources.

Donor query:
- Name: ${donor.name}
- City/State: ${donor.location || 'Unknown location'}
- Employer (opt): ${donor.contactInfo?.work || 'Unknown'}
- Occupation (opt): ${donor.occupation || 'Unknown'}

Rules:
- Bio = 2–3 sentences, neutral tone, no opinions.
- Include current role/employer (if citable), industry/field, and one notable public fact (e.g., board role, published piece, award) only if citable.
- Add 0–2 brief recent-news bullets **only if** clearly about this person and reputable (major news, employer press, .gov, .edu).
- Giving summary one-liner from FEC or OpenSecrets (federal) if confident; otherwise leave empty.
- No speculation. If multiple people match, return disambiguation state.
- Use only reputable sources: FEC, major news outlets, employer/official sites, .gov/.edu. Exclude low-credibility sites.
- Output JSON strictly in this schema:

{
  "status": "ok",
  "bio_sentences": ["", "", ""],
  "giving_summary": "Federal contributions since YYYY: $X across Y committees.",
  "news_bullets": ["", ""],
  "citations": [
    {"id": 1, "title": "", "publisher": "", "url": "", "date": "YYYY-MM-DD"}
  ],
  "attribution": [
    {"claim": "exact phrase from bio or bullet", "citation_ids": [1]}
  ],
  "confidence": "high",
  "matching_notes": "brief string",
  "candidates": []
}`
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        throw new Error(`API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content || '';

      console.log('Structured API Response:', rawContent);

      // Process structured JSON response (improved approach)
      const bioData = processStructuredResponse(rawContent, donor);
      console.log('Processed bio data:', bioData);
      setBioData(bioData);

    } catch (error) {
      console.error('Failed to generate bio:', error);

      // If it's a CORS error, provide helpful guidance
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        setError('CORS error: Direct API calls are blocked by the browser. This feature requires a backend proxy server to work properly.');
      } else {
        setError(error instanceof Error ? error.message : 'Failed to generate bio. Please try again.');
      }
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
