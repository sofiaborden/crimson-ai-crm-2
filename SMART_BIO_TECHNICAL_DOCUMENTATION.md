# 🧠 Smart Bio Feature - Technical Documentation

## Overview

Smart Bio is an AI-powered donor biography generation system that uses Perplexity AI to create factual, citation-backed donor profiles for political fundraising CRMs. The system generates **2-5 sentence professional biographies** with wealth insights, verified citations, and comprehensive source management.

---

## 1. Perplexity API Integration

### Backend API Route
The Smart Bio feature uses a backend API route (`/api/generate-bio`) that proxies requests to Perplexity AI to avoid CORS issues and handle API key security.

**Frontend API Endpoint:** `https://crimson-ai-crm-2.onrender.com/api/generate-bio`
**Backend Perplexity Endpoint:** `https://api.perplexity.ai/chat/completions`
**Model:** `sonar-pro` (advanced search model)
**Authentication:** Bearer token via backend environment variables

### API Parameters (Backend Configuration)
```javascript
{
  model: 'sonar-pro',
  temperature: 0.2,                      // Low temperature for factual accuracy
  max_tokens: 1000,                      // Enhanced from 500 to 1000 for richer content
  top_p: 0.9,
  return_citations: true,               // Critical for source tracking
  search_recency_filter: "month",       // Focus on recent results
  search_depth: "deep",                 // More thorough search
  search_domain_filter: [               // Trusted domains only
    "linkedin.com", "bloomberg.com", "forbes.com",
    "crunchbase.com", "sec.gov", "theorg.com",
    "about.me", "reuters.com", "wsj.com"
  ],
  response_format: {
    type: "json_schema",                // Structured JSON response
    json_schema: { /* schema definition */ }
  },
  messages: [...]
}
```

### Complete Prompt Structure

#### System Message:
```
"You are a research assistant that creates comprehensive factual bios about people for political fundraising outreach. You must return a JSON object with a detailed bio and separate sources array. Focus on profession, title, company affiliations, years of service, notable projects, educational background, recognitions, and achievements. Use ONLY verifiable public data from reputable sources."
```

#### User Prompt Template:
```
Generate a comprehensive, fact-based professional bio for ${name} using ONLY verifiable public data from reputable sources (LinkedIn, company websites, news outlets, professional profiles, university records). Do NOT include any URLs, citation markers, or sources in the main bio text.

Person Details:
- Name: ${name}
- Occupation: ${occupation || 'Not specified'}
- Employer: ${employer || 'Not specified'}
- Location: ${location || 'Not specified'}
- Industry: ${industry || 'Not specified'}

Return a JSON object containing:
- 'bio': A 2-5 sentence comprehensive professional bio (no URLs in text)
- 'sources': An array of objects with 'title' and 'url' for each public source used

Example format:
{
  "bio": "John Smith serves as Chief Technology Officer at TechCorp, where he has led digital transformation initiatives since 2018. He previously held senior engineering roles at StartupXYZ and graduated from Stanford University with a degree in Computer Science. Smith was recognized in TechWeek's 40 Under 40 list for his contributions to enterprise software development.",
  "sources": [
    {"title": "TechCorp Leadership Page", "url": "https://techcorp.com/leadership/john-smith"},
    {"title": "Stanford Alumni Directory", "url": "https://alumni.stanford.edu/directory/john-smith"},
    {"title": "TechWeek 40 Under 40 List", "url": "https://techweek.com/40-under-40-2023"}
  ]
}
```

### Response Processing
The backend processes structured JSON responses and returns processed data to the frontend:

```typescript
// Backend response processing (server.js)
if (parsedContent.bio && parsedContent.sources) {
  // Split the bio into sentences for headlines
  headlines = parsedContent.bio
    .split(/[.!?]+/)
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 10)
    .slice(0, 3)
    .map(sentence => sentence.endsWith('.') ? sentence : sentence + '.');

  // Extract citations from sources array
  citations = parsedContent.sources || [];
}

// Frontend data structure (DonorProfileLayoutTest3.tsx)
interface SmartBioData {
  perplexityHeadlines: string[];        // 2-5 sentence bio split into array
  wealthSummary: string;               // Generated from i360 data
  sources: Array<{ name: string; url: string }>;
  perplexityCitations: Array<{ title: string; url: string }>;
  confidence: 'High' | 'Medium' | 'Low';
  lastGenerated: string;
}

// Response processing in frontend
const bioData: SmartBioData = {
  perplexityHeadlines: headlines,      // Bio sentences as array
  wealthSummary: wealth,               // Local wealth calculation
  sources: [
    { name: 'Perplexity', url: 'https://www.perplexity.ai' },
    ...(wealth ? [{ name: 'i360 Internal Data', url: '#' }] : [])
  ],
  perplexityCitations: citations,      // Direct from API response
  confidence: 'High',
  lastGenerated: new Date().toISOString()
};
```

---

## 2. Source Generation & Citation System

### Citation Data Structure
```typescript
interface Citation {
  title: string;    // Human-readable source title
  url: string;      // Source URL for verification
}

interface SmartBioData {
  perplexityHeadlines: string[];           // Bio sentences array
  wealthSummary?: string;                  // Optional wealth data
  sources: { name: string; url: string }[]; // Source metadata
  perplexityCitations: Citation[];         // Detailed citations
  confidence: 'High' | 'Medium' | 'Low';
  lastGenerated: string;                   // ISO timestamp
}
```

### Source Extraction Process
1. **API Response Parsing**: Citations extracted from Perplexity's structured JSON response
2. **URL Validation**: Source URLs filtered for validity and relevance
3. **Source Compilation**: Multiple source types combined:
   - Perplexity AI research results
   - i360 Internal Data (when available)
   - Public records and professional profiles

### Citation Display System
**Sources Modal Component:**
- **View Sources Button**: Shows count of available sources
- **Modal Interface**: Full-screen overlay with source list
- **Clickable Links**: Direct navigation to source URLs
- **Source Categorization**: Different source types clearly labeled

```tsx
// Sources display in modal
{bioData.sources.map((source, index) => (
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
))}
```

---

## 3. Source Hiding/Filtering System

### UI Controls for Source Management

#### Hide Source Button
Each citation in the sources modal includes a hide button:
```tsx
<button
  onClick={() => handleHideCitation(citation)}
  className="text-red-600 hover:text-red-800 text-xs"
>
  Hide Source
</button>
```

#### Hide Citation Modal
Confirmation modal with two hiding options:
- **Session Only**: Hide source for current session only
- **Permanently**: Hide source permanently (saved to localStorage)

```tsx
// Hide Citation Confirmation Modal
{showHideCitationModal && citationToHide && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900">Hide Source</h3>
        <p className="text-sm text-gray-600">This will hide this source from the bio</p>
        
        <div className="flex gap-3 mt-6">
          <button onClick={() => confirmHideCitation(false)}>
            Hide for Session
          </button>
          <button onClick={() => confirmHideCitation(true)}>
            Hide Permanently
          </button>
        </div>
      </div>
    </div>
  </div>
)}
```

### Source Hiding Implementation

#### State Management
```typescript
const [hiddenCitations, setHiddenCitations] = useState<Set<string>>(new Set());
const [permanentlyHiddenCitations, setPermanentlyHiddenCitations] = useState<Set<string>>(new Set());
const [sessionHiddenCitations, setSessionHiddenCitations] = useState<Set<string>>(new Set());
```

#### Hiding Logic
```typescript
const confirmHideCitation = (permanent: boolean) => {
  if (!citationToHide) return;

  if (permanent) {
    // Add to permanently hidden citations
    const newHiddenCitations = new Set(permanentlyHiddenCitations);
    newHiddenCitations.add(citationToHide.url);
    setPermanentlyHiddenCitations(newHiddenCitations);

    // Save to localStorage for persistence
    localStorage.setItem(
      `hiddenCitations_${donor.id}`,
      JSON.stringify(Array.from(newHiddenCitations))
    );
  } else {
    // Add to session-only hidden citations
    const newSessionHidden = new Set(sessionHiddenCitations);
    newSessionHidden.add(citationToHide.url);
    setSessionHiddenCitations(newSessionHidden);
  }
};
```

#### Citation Filtering Functions
```typescript
// Get visible citations (not hidden)
const getVisibleCitations = () => {
  if (!smartBioData?.perplexityCitations) return [];
  return smartBioData.perplexityCitations.filter(citation =>
    !permanentlyHiddenCitations.has(citation.url) &&
    !sessionHiddenCitations.has(citation.url)
  );
};

// Get hidden citations with metadata
const getHiddenCitations = () => {
  if (!smartBioData?.perplexityCitations) return [];
  return smartBioData.perplexityCitations.filter(citation =>
    permanentlyHiddenCitations.has(citation.url) ||
    sessionHiddenCitations.has(citation.url)
  ).map(citation => ({
    ...citation,
    isPermanent: permanentlyHiddenCitations.has(citation.url)
  }));
};
```

### Persistence System
- **Session Hiding**: Stored in component state, cleared on page refresh
- **Permanent Hiding**: Stored in localStorage with donor-specific keys
- **Key Format**: `hiddenCitations_${donor.id}`
- **Data Format**: JSON array of hidden citation URLs

---

## 4. Bio Text and Source Correlation

### Current Implementation Status
**Important Note**: The current implementation does **NOT** automatically filter bio text based on hidden sources. The source hiding feature only affects the sources display in the modal, not the bio content itself.

### Bio Text Structure
```typescript
// Bio text is stored as an array of sentences
perplexityHeadlines: string[]  // ["Sentence 1", "Sentence 2", "Sentence 3"]

// Display logic joins sentences
const bioText = smartBioData.perplexityHeadlines.join('\n\n');
```

### Source-to-Text Relationship
Currently, there is **no direct correlation** between individual sources and specific bio sentences. The system:
- ✅ **Tracks hidden sources** in separate state
- ✅ **Filters source display** in the modal
- ❌ **Does not filter bio text** based on hidden sources
- ❌ **Does not link specific sources to specific sentences**

### Future Enhancement Opportunity
To implement source-to-text correlation, the system would need:
1. **Enhanced API Response**: Request sentence-level citations from Perplexity
2. **Citation Mapping**: Link each bio sentence to its supporting sources
3. **Filtered Display**: Hide or mark bio sentences when their sources are hidden
4. **UI Indicators**: Show which sentences are affected by hidden sources

---

## 5. Integration Workflow

### Complete Smart Bio Generation Process
1. **User Initiates**: Click "Generate AI-researched donor bio" button
2. **Cost Confirmation**: Modal shows estimated cost (~$0.02 per bio)
3. **Parallel Data Generation**: Two processes run simultaneously:
   - **Perplexity API Call**: Backend route called with donor information
   - **Wealth Summary Generation**: Local i360 data processed for wealth insights
4. **Response Processing**:
   - Backend processes Perplexity JSON response and returns headlines + citations
   - Wealth summary generated from mock wealth codes and mapping
5. **Data Compilation**:
   - Bio headlines (2-5 sentences) from Perplexity
   - Wealth summary from i360 data
   - Sources array combining Perplexity and i360 sources
   - Citations array from Perplexity response
6. **State Update**: Complete SmartBioData object stored in component state
7. **UI Display**: Bio content rendered with wealth info and sources button

### Wealth Summary Integration
```typescript
// Wealth summary generation (local, synchronous)
const generateWealthSummary = (donor: Donor): string => {
  const wealthCode = getMockWealthCode(donor.name);
  if (!wealthCode || !WEALTH_MAPPING[wealthCode]) return '';

  const wealthData = WEALTH_MAPPING[wealthCode];
  return `Estimated wealth: ${wealthData.range} (${wealthData.tier})`;
};

// Sources compilation includes both data types
const sources = [
  { name: 'Perplexity', url: 'https://www.perplexity.ai' },
  ...(wealth ? [{ name: 'i360 Internal Data', url: '#' }] : [])
];
```

### Error Handling
- **API Failures**: Graceful fallback to employment-based headlines
- **Invalid Responses**: Fallback processing for malformed JSON
- **Missing Data**: Default values for confidence and sources
- **Network Issues**: User-friendly error messages
- **Fallback Headlines**: Generated from donor employment information when API fails

```typescript
// Fallback headline generation
const fallbackHeadlines = [
  `${donor.name} serves as ${donor.employment.occupation} at ${donor.employment.employer}.`,
  `Professional with experience in ${donor.employment.industry || 'their field'}.`,
  `Based in ${donor.primaryAddress?.city || 'their location'} with established career background.`
];
```

### Performance Considerations
- **Caching**: Generated bios stored in component state
- **Rate Limiting**: Single bio generation per user action
- **Cost Control**: Confirmation modal prevents accidental API calls
- **Lazy Loading**: Sources modal only renders when opened

---

## 6. Current Implementation Features

### ✅ Implemented Features
- **2-5 sentence professional biographies** generated via Perplexity AI
- **Backend API proxy** for secure API key handling and CORS resolution
- **Wealth summary integration** from i360 internal data
- **Source citation system** with clickable links and modal display
- **Source hiding/filtering** with session and permanent options
- **Edit/reset functionality** for bio content modification
- **Export options** (Copy, PDF, Email, Report Issue)
- **Error handling** with employment-based fallbacks
- **Cost transparency** with confirmation modals

### ❌ Not Implemented
- **FEC data integration** (removed from current implementation)
- **Source-to-text correlation** (sources and bio text are independent)
- **Automatic bio filtering** based on hidden sources
- **Real-time bio updates** when sources are hidden

---

*This documentation reflects the current Smart Bio implementation in DonorProfileLayoutTest3.tsx as of January 2025. The feature focuses on professional biography generation with wealth insights, excluding FEC integration.*
