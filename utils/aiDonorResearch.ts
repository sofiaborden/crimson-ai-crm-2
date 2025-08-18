import { Donor } from '../types';

// Perplexity AI configuration
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const PERPLEXITY_API_KEY = process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY || '';

interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface DonorResearchResult {
  summary: string;
  confidence: number;
  sources: string[];
  lastUpdated: string;
}

/**
 * Generate AI-powered donor research using Perplexity AI
 * Cost: ~$3 per million tokens (very cost-effective)
 */
export const generateDonorResearch = async (donor: Donor): Promise<DonorResearchResult> => {
  try {
    // Construct research prompt based on available donor information
    const prompt = buildResearchPrompt(donor);
    
    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online', // Cost-effective model with web access
        messages: [
          {
            role: 'system',
            content: 'You are a professional political donor researcher. Provide accurate, factual information only. Do not hallucinate or make up information. Cite all sources. Keep responses to 5 sentences maximum.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.1, // Low temperature for factual accuracy
        top_p: 0.9,
        return_citations: true,
        search_domain_filter: ['opensecrets.org', 'fec.gov', 'ballotpedia.org', 'linkedin.com', 'crunchbase.com']
      })
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data: PerplexityResponse = await response.json();
    const summary = data.choices[0]?.message?.content || 'No research data available.';

    return {
      summary,
      confidence: calculateConfidence(summary),
      sources: extractSources(summary),
      lastUpdated: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error generating donor research:', error);
    
    // Fallback to existing aiSnapshot or generate basic summary
    return {
      summary: donor.aiSnapshot || generateFallbackSummary(donor),
      confidence: 75,
      sources: ['Internal Data'],
      lastUpdated: new Date().toISOString()
    };
  }
};

/**
 * Build research prompt optimized for political donor research
 */
const buildResearchPrompt = (donor: Donor): string => {
  const location = donor.address ? `${donor.address}` : 'Unknown location';
  const employer = donor.contactInfo?.work || 'Unknown employer';
  
  return `Research and summarize information about political donor: ${donor.name} from ${location}. 
  
Key details to research:
- Name: ${donor.name}
- Location: ${location}
- Employer: ${employer}
- Email: ${donor.email}

Please provide a 5-sentence summary including:
1. Professional background and current role
2. Political giving history and patterns
3. Wealth indicators and capacity assessment
4. Community involvement and interests
5. Any notable affiliations or activities

Focus on publicly available information from FEC records, OpenSecrets, LinkedIn, and other reliable sources. 
Do not hallucinate information. Cite all sources used.`;
};

/**
 * Calculate confidence score based on content quality
 */
const calculateConfidence = (summary: string): number => {
  let confidence = 50; // Base confidence
  
  // Increase confidence based on content indicators
  if (summary.includes('$') || summary.includes('donation')) confidence += 15;
  if (summary.includes('FEC') || summary.includes('OpenSecrets')) confidence += 20;
  if (summary.includes('LinkedIn') || summary.includes('company')) confidence += 10;
  if (summary.length > 200) confidence += 10;
  if (summary.includes('Source:') || summary.includes('according to')) confidence += 15;
  
  // Decrease confidence for uncertainty indicators
  if (summary.includes('No information') || summary.includes('not found')) confidence -= 30;
  if (summary.includes('unclear') || summary.includes('unknown')) confidence -= 15;
  
  return Math.min(Math.max(confidence, 10), 95); // Clamp between 10-95%
};

/**
 * Extract source citations from the summary
 */
const extractSources = (summary: string): string[] => {
  const sources: string[] = [];
  
  // Common source patterns
  const sourcePatterns = [
    /opensecrets\.org/gi,
    /fec\.gov/gi,
    /ballotpedia\.org/gi,
    /linkedin\.com/gi,
    /crunchbase\.com/gi,
    /according to ([^,\.]+)/gi,
    /source: ([^,\.]+)/gi
  ];
  
  sourcePatterns.forEach(pattern => {
    const matches = summary.match(pattern);
    if (matches) {
      sources.push(...matches);
    }
  });
  
  return sources.length > 0 ? [...new Set(sources)] : ['Public Records'];
};

/**
 * Generate fallback summary when API is unavailable
 */
const generateFallbackSummary = (donor: Donor): string => {
  const totalGiving = donor.givingOverview?.totalRaised || donor.totalLifetimeGiving || 0;
  const giftCount = donor.givingOverview?.consecutiveGifts || donor.giftCount || 0;
  const avgGift = giftCount > 0 ? totalGiving / giftCount : 0;
  
  let summary = `${donor.name} is a political donor with ${giftCount} recorded contributions totaling $${totalGiving.toLocaleString()}.`;
  
  if (avgGift > 500) {
    summary += ` With an average gift of $${Math.round(avgGift).toLocaleString()}, they demonstrate significant giving capacity.`;
  }
  
  if (donor.contactInfo?.work) {
    summary += ` Professional background includes work experience that may indicate higher disposable income.`;
  }
  
  summary += ` Contact preferences and engagement patterns suggest ${donor.engagementScore > 70 ? 'high' : 'moderate'} responsiveness to outreach.`;
  summary += ` Recommended for continued cultivation based on giving history and engagement metrics.`;
  
  return summary;
};

/**
 * Mock function for development/testing
 */
export const generateMockDonorResearch = (donor: Donor): DonorResearchResult => {
  const mockSummaries = [
    `${donor.name} is a technology executive based in ${donor.address?.split(',')[1] || 'California'} with a strong track record of political engagement. According to FEC records, they have contributed over $${(donor.totalLifetimeGiving || 1000).toLocaleString()} to various campaigns since 2020. Their LinkedIn profile indicates leadership roles in the tech industry, suggesting significant giving capacity. They have shown particular interest in education and healthcare policy initiatives. Community involvement includes board positions with local nonprofits focused on civic engagement.`,
    
    `${donor.name} is a healthcare professional and consistent political donor with ${donor.giftCount || 5} recorded contributions totaling $${(donor.totalLifetimeGiving || 2500).toLocaleString()}. OpenSecrets data shows regular giving patterns aligned with healthcare policy advocacy. Their professional background in medicine indicates both passion for policy issues and financial capacity for continued support. Recent giving has focused on candidates supporting healthcare reform initiatives. Strong email engagement rates suggest high responsiveness to policy-focused communications.`,
    
    `${donor.name} is a small business owner and emerging political donor showing increasing engagement over the past two years. FEC filings show contributions totaling $${(donor.totalLifetimeGiving || 800).toLocaleString()} with growing gift sizes indicating rising capacity. Their business background in ${donor.contactInfo?.work || 'professional services'} suggests entrepreneurial mindset and community involvement. Local chamber of commerce membership indicates strong local network connections. Recommended for personal outreach given their growing political engagement and business success.`
  ];
  
  const randomSummary = mockSummaries[Math.floor(Math.random() * mockSummaries.length)];
  
  return {
    summary: randomSummary,
    confidence: Math.floor(Math.random() * 20) + 80, // 80-99% confidence
    sources: ['FEC.gov', 'OpenSecrets.org', 'LinkedIn', 'Public Records'],
    lastUpdated: new Date().toISOString()
  };
};
