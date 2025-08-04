const generateAIProfile = async (donor: Donor) => {
  const prompt = `Research and summarize in 5 sentences: ${donor.name}, ${donor.location}, ${donor.employer}. Focus on: wealth indicators, political giving history, community involvement, family status, interests.`;
  
  // Call Perplexity API ($3/1M tokens is very cost-effective)
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${API_KEY}` },
    body: JSON.stringify({
      model: "llama-3.1-sonar-small-128k-online",
      messages: [{ role: "user", content: prompt }]
    })
  });
  
  return response.json();
};