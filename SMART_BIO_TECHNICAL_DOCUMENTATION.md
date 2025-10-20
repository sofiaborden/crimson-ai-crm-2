# 🧠 Smart Bio Feature - Technical Documentation

## Overview

Smart Bio is an AI-powered donor biography generation system that uses Perplexity AI to create factual, citation-backed donor profiles for political fundraising CRMs. The system generates 2-3 sentence professional biographies with wealth insights, verified citations, and comprehensive source management.

---

## 1. Perplexity API Integration

### API Configuration
**Endpoint:** `https://api.perplexity.ai/chat/completions`
**Model:** `sonar-pro` (advanced search model)
**Authentication:** Bearer token via environment variables

### API Parameters
```javascript
{
  model: 'sonar-pro',
  temperature: 0.1,           // Low temperature for factual accuracy
  max_tokens: 800,
  top_p: 0.9,
  return_citations: true,     // Critical for source tracking
  messages: [...]
}
```

### Complete Prompt Structure

#### System Message:
```
"You are a research assistant that writes short, factual, citation-backed donor bios for U.S. political fundraising CRMs. You must only state facts you can cite with reputable URLs. If uncertain, omit. Output JSON exactly in the requested schema. Do not include commentary."
```

#### User Prompt Template:
```
Task: Produce a concise factual bio for a U.S. donor and a one-line giving summary if confidently found in FEC or equivalent sources.

Donor: {donor.name}
Location: {donor.location || 'Not specified'}
Total Lifetime Giving: ${donor.totalLifetimeGiving || 'Unknown'}

Rules:
- Bio = 2–3 sentences, neutral tone, no opinions.
- Include current role/employer (if citable), industry/field, and one notable public fact (e.g., board role, published piece, award) only if citable.
- Add 0–2 brief recent-news bullets **only if** clearly about this person and reputable (major news, employer press, .gov, .edu).
- Giving summary one-liner from FEC or OpenSecrets (federal) if confident; otherwise leave empty.
- No speculation. If multiple people match, return disambiguation state.
- Use only reputable sources: FEC, major news outlets, employer/official sites, .gov/.edu. Exclude low-credibility sites.
- Output JSON strictly in this schema:

{
  "bio_sentences": ["sentence1", "sentence2", "sentence3"],
  "giving_summary": "string or empty",
  "citations": [{"title": "string", "url": "string"}],
  "confidence": "high",
  "matching_notes": "brief string",
  "candidates": []
}
```

### Response Processing
The system processes structured JSON responses with fallback handling:

```typescript
interface BioResponse {
  bio: string;
  givingSummary: string;
  confidence: 'High' | 'Medium' | 'Low';
  sources: string[];
}

const processStructuredResponse = (content: string, donor: any): BioResponse => {
  // Extract JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  const parsed = JSON.parse(jsonMatch[0]);
  
  // Process bio sentences (limit to 3, join with spaces)
  const bio = Array.isArray(parsed.bio_sentences)
    ? parsed.bio_sentences.filter(s => s.trim()).slice(0, 3).join(' ')
    : `${donor.name} is a political donor with available public records.`;
  
  // Extract source URLs from citations
  const sources = Array.isArray(parsed.citations)
    ? parsed.citations.map(c => c.url).filter(Boolean)
    : ['Public Records'];
    
  return { bio, givingSummary, confidence, sources };
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
   - FEC/OpenSecrets data
   - Public records

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
3. **API Call**: Perplexity API called with structured prompt
4. **Response Processing**: JSON response parsed and validated
5. **Data Compilation**: Bio text, sources, and citations compiled
6. **State Update**: SmartBioData object stored in component state
7. **UI Display**: Bio content rendered with sources button

### Error Handling
- **API Failures**: Graceful fallback to basic donor information
- **Invalid Responses**: Fallback processing for malformed JSON
- **Missing Data**: Default values for confidence and sources
- **Network Issues**: User-friendly error messages

### Performance Considerations
- **Caching**: Generated bios stored in component state
- **Rate Limiting**: Single bio generation per user action
- **Cost Control**: Confirmation modal prevents accidental API calls
- **Lazy Loading**: Sources modal only renders when opened

---

*This documentation reflects the current Smart Bio implementation as of January 2024. The source hiding feature affects source display only, not bio text content.*
