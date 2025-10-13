import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// CORS middleware - allow requests from both dev and production
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'https://crimson-ai-crm-2.onrender.com'
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// API endpoint for generating bio
app.post('/api/generate-bio', async (req, res) => {
  try {
    const { name, occupation, employer, location, email, industry, useSearchResults, testingMode } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }

    const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
    const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

    console.log('🔍 Server-side API call for:', name);
    console.log('🔍 API Key available:', !!PERPLEXITY_API_KEY);

    // Check if we're using a placeholder/invalid API key
    const isPlaceholderKey = !PERPLEXITY_API_KEY ||
                            PERPLEXITY_API_KEY.includes('your_perplexity_api_key_here') ||
                            PERPLEXITY_API_KEY.startsWith('pplx-b8c1c2e8c9d4f5a6');

    if (isPlaceholderKey) {
      console.log('⚠️ Using placeholder API key, returning mock data');

      // Return realistic mock data for testing
      const mockHeadlines = [];
      if (name.includes('Jeff') || name.includes('Wernsing')) {
        mockHeadlines.push(
          'Jeff Wernsing is Senior Vice President of Compliance Services at CMDI, overseeing regulatory compliance for political data management.',
          'Experienced compliance professional with expertise in campaign finance regulations and data privacy laws.',
          'Based in Arlington, Virginia with over 15 years in political consulting and compliance services.'
        );
      } else if (name.includes('Sofia') || name.includes('Borden')) {
        mockHeadlines.push(
          'Sofia Borden serves as VP & Chief Experience Officer at CMDI, leading customer experience and digital transformation initiatives.',
          'Technology executive with background in user experience design and customer success strategies.',
          'Based in Groveland with expertise in CRM systems and political technology solutions.'
        );
      } else if (occupation && employer) {
        mockHeadlines.push(
          `${name} serves as ${occupation} at ${employer}, contributing to the organization's strategic initiatives.`,
          `Professional with established expertise in ${industry || 'their field'} and proven track record of success.`,
          `Based in ${location || 'their location'} with strong community connections and professional network.`
        );
      } else {
        mockHeadlines.push(
          `${name} is a professional with established community connections and civic engagement.`,
          'Active in their local area with potential for meaningful political and community involvement.',
          'Profile demonstrates strong background suitable for outreach and relationship building.'
        );
      }

      // Include mock citations for testing
      const mockCitations = [
        { title: "LinkedIn Profile", url: "https://linkedin.com/in/example" },
        { title: "Company Website", url: "https://cmdi.com/team" },
        { title: "Professional Directory", url: "https://example.com/directory" }
      ];

      return res.json({ success: true, headlines: mockHeadlines, citations: mockCitations });
    }

    // Create timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('API timeout after 15 seconds')), 15000);
    });

    const fetchPromise = fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        temperature: 0.2,
        max_tokens: 1000, // Enhanced: Increased from 500 to 1000 for richer content (Original: 500 - 2025-01-06)
        top_p: 0.9,
        return_citations: true,
        search_recency_filter: "month", // Focus on recent results
        search_depth: "deep", // More thorough search
        search_domain_filter: ["linkedin.com", "bloomberg.com", "forbes.com", "crunchbase.com", "sec.gov", "theorg.com", "about.me", "reuters.com", "wsj.com"],
        response_format: {
          type: "json_schema",
          json_schema: {
            schema: {
              type: "object",
              properties: {
                bio: {
                  type: "string",
                  description: "A comprehensive professional bio with 2-5 factual sentences covering: current role and employer, tenure/years of service, notable projects or achievements, educational background when available, and professional specializations. Do NOT include any URLs or citation markers in this text."
                },
                sources: {
                  type: "array",
                  description: "Array of sources used to create the bio",
                  items: {
                    type: "object",
                    properties: {
                      title: {
                        type: "string",
                        description: "Title or name of the source"
                      },
                      url: {
                        type: "string",
                        description: "Full URL of the source"
                      }
                    },
                    required: ["title", "url"]
                  }
                }
              },
              required: ["bio", "sources"]
            }
          }
        },
        messages: [
          {
            role: 'system',
            content: 'You are a research assistant that creates comprehensive factual bios about people for political fundraising outreach. You must return a JSON object with a detailed bio and separate sources array. Focus on profession, title, company affiliations, years of service, notable projects, educational background, recognitions, and achievements. Use ONLY verifiable public data from reputable sources.'
          },
          {
            role: 'user',
            content: `Generate a comprehensive, fact-based professional bio for ${name} using ONLY verifiable public data from reputable sources (LinkedIn, company websites, news outlets, professional profiles, university records). Do NOT include any URLs, citation markers, or sources in the main bio text.

REQUIREMENTS:
- 2-5 sentence narrative bio covering: current role and employer, tenure/years of service (e.g., "since 2018"), notable projects or achievements, educational background when available, professional specializations
- Use specific dates, years, project names, and quantifiable details when available
- NO speculation or inference - only verified facts
- Multiple citation sources preferred

Person Details:
Name: ${name}
${occupation ? `Title: ${occupation}` : ''}
${employer ? `Company: ${employer}` : ''}
${location ? `Location: ${location}` : ''}
${email ? `Email: ${email}` : ''}

Return a JSON object containing:
- 'bio': A 2-5 sentence comprehensive professional bio (no URLs in text)
- 'sources': An array of objects with 'title' and 'url' for each public source used

Example format:
{
  "bio": "John Smith serves as Chief Technology Officer at TechCorp since 2018, where he leads digital transformation initiatives across the organization and oversees a team of 50+ engineers. He previously held senior engineering roles at Microsoft and Amazon, specializing in cloud infrastructure and enterprise software development. Smith holds a Master's degree in Computer Science from Stanford University and has been recognized as a Top 40 Under 40 technology leader by TechWeek Magazine. He has led the development of TechCorp's flagship cloud platform, which serves over 10,000 enterprise clients globally.",
  "sources": [
    {"title": "LinkedIn Profile", "url": "https://linkedin.com/in/johnsmith"},
    {"title": "TechCorp Leadership Page", "url": "https://techcorp.com/leadership/john-smith"},
    {"title": "Stanford Alumni Directory", "url": "https://alumni.stanford.edu/directory/john-smith"},
    {"title": "TechWeek 40 Under 40 List", "url": "https://techweek.com/40-under-40-2023"}
  ]
}`
          }
        ]
      })
    });

    const response = await Promise.race([fetchPromise, timeoutPromise]);

    console.log('🔍 Perplexity API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔍 Perplexity API Error:', errorText);
      return res.status(response.status).json({
        success: false,
        error: `Perplexity API error: ${response.status} - ${errorText}`
      });
    }

    const data = await response.json();
    console.log('🔍 Perplexity API Success:', data);
    console.log('🔍 Full API Response Structure:');
    console.log(JSON.stringify(data, null, 2));
    console.log('🔍 Available top-level fields:', Object.keys(data));

    const content = data.choices?.[0]?.message?.content || '';
    console.log('🔍 Raw content:', content);

    // ENHANCED INVESTIGATION: Check all possible citation fields
    const searchResults = data.search_results || [];
    const perplexityCitations = data.citations || [];
    const webResults = data.web_results || [];
    const sources = data.sources || [];

    console.log('\n🔍 ===== CITATION FIELDS INVESTIGATION =====');
    console.log('🔍 search_results field exists:', !!data.search_results);
    console.log('🔍 search_results length:', searchResults.length);
    console.log('🔍 search_results content:', JSON.stringify(searchResults, null, 2));

    console.log('🔍 citations field exists:', !!data.citations);
    console.log('🔍 citations length:', perplexityCitations.length);
    console.log('🔍 citations content:', JSON.stringify(perplexityCitations, null, 2));

    console.log('🔍 web_results field exists:', !!data.web_results);
    console.log('🔍 web_results length:', webResults.length);
    console.log('🔍 web_results content:', JSON.stringify(webResults, null, 2));

    console.log('🔍 sources field exists:', !!data.sources);
    console.log('🔍 sources length:', sources.length);
    console.log('🔍 sources content:', JSON.stringify(sources, null, 2));
    console.log('🔍 ============================================\n');

    let headlines = [];
    let citations = [];
    let citationSource = 'unknown';
    let parsedContent = null;

    console.log('🔍 Attempting to parse content as JSON...');
    try {
      // Try to parse the content as JSON (structured response)
      parsedContent = JSON.parse(content);
      console.log('✅ JSON parsing successful!');
      console.log('🔍 Parsed JSON content:', JSON.stringify(parsedContent, null, 2));
      console.log('🔍 JSON has bio field:', !!parsedContent.bio);
      console.log('🔍 JSON has sources field:', !!parsedContent.sources);
      console.log('🔍 Sources array length:', parsedContent.sources ? parsedContent.sources.length : 0);

      if (parsedContent.bio && parsedContent.sources) {
        // Split the bio into sentences for headlines
        headlines = parsedContent.bio
          .split(/[.!?]+/)
          .map(sentence => sentence.trim())
          .filter(sentence => sentence.length > 10)
          .slice(0, 3)
          .map(sentence => sentence.endsWith('.') ? sentence : sentence + '.');

        // HYBRID CITATION APPROACH: Prioritize search_results, fallback to JSON sources

        if (useSearchResults && testingMode === 'localhost') {
          console.log('🧪 LOCALHOST TESTING MODE: Implementing hybrid citation approach');

          // Try multiple potential search result fields
          const allSearchResults = searchResults.length > 0 ? searchResults :
                                  (perplexityCitations.length > 0 ? perplexityCitations :
                                  (webResults.length > 0 ? webResults : []));

          if (allSearchResults.length > 0) {
            citations = allSearchResults.map(result => ({
              title: result.title || result.name || 'Source',
              url: result.url || '#',
              sourceType: 'search_result'
            }));
            citationSource = 'search_results';
            console.log('✅ Using search results for citations:', citations.length);
          } else {
            // Fallback to JSON sources with source type indicator
            citations = (parsedContent.sources || []).map(source => ({
              ...source,
              sourceType: 'ai_generated'
            }));
            citationSource = 'json_fallback';
            console.log('🔄 Fallback to JSON sources for citations:', citations.length);
          }

          console.log('🧪 Citation source used:', citationSource);
          console.log('🧪 Final citations:', JSON.stringify(citations, null, 2));
        } else {
          // Production behavior: Use JSON sources only
          citations = parsedContent.sources || [];
          citationSource = 'json_production';
          console.log('🔍 Sources from JSON (production):', citations);
        }

        console.log('✅ Successfully parsed structured JSON response');
        console.log('🔍 Bio sentences as headlines:', headlines);
        console.log('🔍 Number of citations extracted:', citations.length);
      } else {
        throw new Error('JSON missing required bio or sources fields');
      }
    } catch (parseError) {
      console.log('🔄 JSON parsing failed, falling back to text parsing:', parseError.message);

      // Fallback: parse as plain text (old method)
      headlines = content
        .split('\n')
        .filter(line => line.trim() && !line.startsWith('•') && !line.startsWith('-'))
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(line => line.length > 10)
        .slice(0, 3);

      // Try to extract citations from search_results as fallback
      if (searchResults && searchResults.length > 0) {
        citations = searchResults.map(result => ({
          title: result.title || result.name || 'Source',
          url: result.url || '#'
        }));
        console.log('🔄 Using search_results as fallback for citations');
      }
    }

    if (headlines.length > 0) {
      console.log('✅ Successfully generated headlines:', headlines);
      console.log('✅ Citations found:', citations.length);

      // Validate citations format
      const validCitations = citations.filter(citation =>
        citation &&
        typeof citation === 'object' &&
        citation.title &&
        citation.url &&
        typeof citation.title === 'string' &&
        typeof citation.url === 'string'
      );

      console.log('✅ Valid citations after filtering:', validCitations.length);

      // CITATION COMPARISON ANALYSIS - Log both sources for investigation
      console.log('\n🔍 ===== CITATION COMPARISON ANALYSIS =====');
      console.log('📋 SOURCE A (JSON sources - Currently Used):');
      console.log('   Count:', citations.length);
      console.log('   Data:', JSON.stringify(citations, null, 2));

      console.log('\n📋 SOURCE B (search_results - Alternative):');
      console.log('   Count:', searchResults.length);
      console.log('   Data:', JSON.stringify(searchResults, null, 2));

      // Create search_results citations for comparison
      const searchResultsCitations = searchResults.map(result => ({
        title: result.title || result.name || 'Source',
        url: result.url || '#'
      }));

      console.log('\n📋 SOURCE B (Formatted as citations):');
      console.log('   Count:', searchResultsCitations.length);
      console.log('   Data:', JSON.stringify(searchResultsCitations, null, 2));

      console.log('\n🔍 URL COMPARISON:');
      citations.forEach((jsonCitation, index) => {
        const searchCitation = searchResultsCitations[index];
        console.log(`   Citation ${index + 1}:`);
        console.log(`     JSON URL:    ${jsonCitation.url}`);
        console.log(`     Search URL:  ${searchCitation ? searchCitation.url : 'N/A'}`);
        console.log(`     Match:       ${jsonCitation.url === (searchCitation?.url) ? '✅' : '❌'}`);
      });
      console.log('🔍 ============================================\n');

      // Add citation metadata to response
      const responseData = {
        success: true,
        headlines,
        citations: validCitations,
        citationSource: citationSource || 'json_production',
        citationCount: validCitations.length,
        hasSearchResults: searchResults.length > 0,
        hasJsonSources: (parsedContent.sources || []).length > 0
      };

      console.log('🔍 Final response being sent:', responseData);
      return res.json(responseData);
    } else {
      // Return employment-based fallback
      const fallbackHeadlines = [];
      if (occupation && employer) {
        fallbackHeadlines.push(`${name} serves as ${occupation} at ${employer}.`);
      }
      if (industry) {
        fallbackHeadlines.push(`Professional with experience in ${industry}.`);
      }
      if (location) {
        fallbackHeadlines.push(`Based in ${location} with established career background.`);
      }

      if (fallbackHeadlines.length === 0) {
        fallbackHeadlines.push(`${name} is a professional with established community connections.`);
      }

      console.log('⚠️ Using fallback headlines:', fallbackHeadlines);
      return res.json({ success: true, headlines: fallbackHeadlines });
    }

  } catch (error) {
    console.error('❌ Server API error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown server error'
    });
  }
});

// Handle React Router (return `index.html` for all non-API routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
