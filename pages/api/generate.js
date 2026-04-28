export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic, style, aspectRatio, mood, season, educationalLevel } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured. Add GROQ_API_KEY to your environment variables.' });
  }

  const aspectRatioMap = {
    '1:1': 'square composition, 1:1 aspect ratio',
    '16:9': 'wide cinematic landscape, 16:9 aspect ratio, widescreen format',
    '9:16': 'vertical portrait orientation, 9:16 aspect ratio, mobile-friendly format',
    '4:3': 'classic landscape format, 4:3 aspect ratio',
    '3:2': 'standard photography format, 3:2 aspect ratio',
    '2:3': 'vertical portrait format, 2:3 aspect ratio',
  };

  const metaAIAspectHint = aspectRatio ? (aspectRatioMap[aspectRatio] || null) : null;

  const systemPrompt = `You are an expert agricultural educator and AI image prompt engineer specializing in farm and agricultural educational content.

Your task is to generate detailed, vivid image prompts optimized for Meta AI (Imagine), Midjourney, DALL-E, and Stable Diffusion.

Rules:
- Always focus on educational and realistic farm/agricultural content
- Include specific photographic/artistic details: lighting, camera angle, depth of field, color palette
- Make prompts educational and informative in nature
- If aspect ratio is specified, include the exact aspect ratio instruction in the prompt
- Generate prompts that are safe, positive, and family-friendly
- When a field says "let AI decide" or is unspecified, freely choose the most fitting option
- Output ONLY the image prompt, nothing else - no explanation, no preamble, no labels`;

  const userPrompt = `Generate a detailed AI image prompt for the following farm/agricultural educational content:

Topic: ${topic}
${style ? `Visual Style: ${style}` : 'Visual Style: (choose the most fitting style for this farm topic)'}
${mood ? `Mood/Atmosphere: ${mood}` : 'Mood/Atmosphere: (choose naturally based on the topic)'}
${season ? `Season: ${season}` : 'Season: (choose what fits best visually)'}
${educationalLevel ? `Educational Level: ${educationalLevel}` : 'Educational Level: (general audience)'}
${metaAIAspectHint ? `Aspect Ratio: ${metaAIAspectHint}` : 'Aspect Ratio: (no specific ratio required — choose freely)'}

Generate ONE comprehensive, detailed image prompt that would work perfectly in Meta AI (Imagine) or Midjourney. Include: subject details, lighting, camera angle, artistic style, color palette${metaAIAspectHint ? ', and the aspect ratio specification' : ''}. The prompt should be educational and showcase farm/agricultural knowledge.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 600,
        temperature: 0.85,
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error('Groq API error:', errData);

      // Try fallback model if the primary one fails
      const fallbackResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 600,
          temperature: 0.85,
        }),
      });

      if (!fallbackResponse.ok) {
        const fallbackErr = await fallbackResponse.json();
        return res.status(500).json({ error: fallbackErr.error?.message || 'AI generation failed' });
      }

      const fallbackData = await fallbackResponse.json();
      const prompt = fallbackData.choices?.[0]?.message?.content?.trim();
      return res.status(200).json({ prompt, model: 'llama-3.3-70b-versatile', aspectRatio });
    }

    const data = await response.json();
    const prompt = data.choices?.[0]?.message?.content?.trim();

    if (!prompt) {
      return res.status(500).json({ error: 'No prompt generated' });
    }

    return res.status(200).json({
      prompt,
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      aspectRatio,
      topic,
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
}
