
import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.warn('OPENAI_API_KEY is not defined');
}

export const openai = apiKey ? new OpenAI({ apiKey }) : null;

export const getChatMessage = async (userMessage: string, context?: string) => {
    if (!openai) return "OpenAI API not configured.";

    try {
        const systemPrompt = `Tu es le concierge officiel d'Assisi, expert en histoire et culture locale.
        Réponse courte (<100 mots) et actionable. Inclure emoji 🇮🇹.
        ${context ? `Contexte: ${context}` : ''}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ],
            temperature: 0.3,
            max_tokens: 150,
        });

        return completion.choices[0].message.content || "Je n'ai pas pu générer de réponse.";
    } catch (error) {
        console.error('Error calling OpenAI:', error);
        return "Désolé, une erreur est survenue lors de la consultation de mes archives.";
    }
};
