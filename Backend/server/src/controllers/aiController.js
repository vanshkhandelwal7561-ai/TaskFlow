const Groq = require('groq-sdk');

exports.suggest = async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Task title is required.' });
  }

 
  if (!process.env.GROQ_API_KEY) {
    return res.json({
      success: true,
      fallback: true,
      data: buildFallback('AI not configured — using default estimate.'),
    });
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const today = new Date().toISOString().split('T')[0];

    const prompt = `You are a project management assistant helping estimate task effort.

Task title: "${title}"
Task description: "${description || 'No description provided.'}"
Today's date: ${today}

Respond ONLY with a valid JSON object — no markdown, no code fences, no extra text.

{
  "effort": "S" | "M" | "L" | "XL",
  "hours": <number between 1 and 40>,
  "suggestedDueDate": "<YYYY-MM-DD, at least 1 day from today>",
  "reasoning": "<one concise sentence explaining the estimate>"
}

Rules:
- S = 1-2 hours, M = 3-8 hours, L = 1-3 days, XL = 1+ weeks
- Set suggestedDueDate based on effort size from today
- Keep reasoning under 20 words`;

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI request timed out')), 15000)
    );

    const aiPromise = groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 200,
    });

    const result = await Promise.race([aiPromise, timeoutPromise]);
    const rawText = result.choices[0].message.content.trim();

   
    const cleaned = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleaned);

    if (!parsed.effort || !parsed.hours || !parsed.suggestedDueDate || !parsed.reasoning) {
      throw new Error('Incomplete AI response');
    }

    return res.json({ success: true, fallback: false, data: parsed });

  } catch (err) {
    console.error('[AI] Suggestion failed:', err.message);
    return res.json({
      success: true,
      fallback: true,
      data: buildFallback('AI temporarily unavailable — using default estimate.'),
    });
  }
};

function buildFallback(reason) {
  const due = new Date();
  due.setDate(due.getDate() + 7);
  return {
    effort: 'M',
    hours: 4,
    suggestedDueDate: due.toISOString().split('T')[0],
    reasoning: reason,
  };
}