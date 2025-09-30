import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// API endpoint for generating bio
app.post('/api/generate-bio', async (req, res) => {
  try {
    const { name, occupation, employer, location, email, industry } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }

    const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
    const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY ||
                               'pplx-b8c1c2e8c9d4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0';

    console.log('🔍 Server-side API call for:', name);
    console.log('🔍 API Key available:', !!PERPLEXITY_API_KEY);

    if (!PERPLEXITY_API_KEY || PERPLEXITY_API_KEY.includes('your_perplexity_api_key_here')) {
      return res.status(500).json({
        success: false,
        error: 'Perplexity API key not configured'
      });
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
        model: 'llama-3.1-sonar-small-128k-online',
        temperature: 0.2,
        max_tokens: 300,
        top_p: 0.9,
        return_citations: true,
        search_domain_filter: ["linkedin.com", "bloomberg.com", "forbes.com", "crunchbase.com", "sec.gov"],
        messages: [
          {
            role: 'system',
            content: 'You are a research assistant that creates concise factual headlines about people for political fundraising outreach. Focus on profession, title, company affiliations, recognitions, or notable achievements. Use a professional tone and be factual.'
          },
          {
            role: 'user',
            content: `Create 2-3 concise factual headlines about this person that would be helpful for political fundraising outreach. Focus on their professional role, company, and any notable achievements or affiliations.

Name: ${name}
${occupation ? `Title: ${occupation}` : ''}
${employer ? `Company: ${employer}` : ''}
${location ? `Location: ${location}` : ''}
${email ? `Email: ${email}` : ''}

Search for recent information about this person and their professional background. Return only 2-3 factual headlines, one per line.`
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

    const content = data.choices?.[0]?.message?.content || '';

    // Parse headlines from response
    const headlines = content
      .split('\n')
      .filter(line => line.trim() && !line.startsWith('•') && !line.startsWith('-'))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(line => line.length > 10)
      .slice(0, 3);

    if (headlines.length > 0) {
      console.log('✅ Successfully generated headlines:', headlines);
      return res.json({ success: true, headlines });
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
