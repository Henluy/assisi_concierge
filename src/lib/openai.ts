
import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.warn('OPENAI_API_KEY is not defined');
}

export const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function getChatMessage(userMessage: string, context: string = ""): Promise<string> {
    if (!openai) return "OpenAI API not configured.";

    try {
        const systemPrompt = `Tu es le concierge officiel d'Assise (Assisi AI Concierge), expert en histoire, culture et tourisme local.
Ton but est d'aider les pèlerins et touristes.
Réponse courte, chaleureuse et utile (< 100 mots).
Utilise des emojis italiens 🇮🇹.
Si on te demande un lieu, sois précis.
${context ? `Uitlise ces informations contextuelles pour répondre :\n${context}` : ''}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage },
            ],
            temperature: 0.3,
            max_tokens: 200,
        });

        return completion.choices[0].message.content || "Désolé, je suis un peu confus.";
    } catch (error) {
        console.error("OpenAI Error:", error);
        return "Je rencontre des difficultés techniques pour le moment. Réessayez plus tard.";
    }
}

export async function analyzeImage(imageUrl: string): Promise<string> {
    if (!openai) return "OpenAI API not configured.";

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Tu es un expert en art et architecture d'Assise. Analyse cette image. Si c'est une fresque ou un monument, identifie-le (artiste, date, lieu). Si c'est un plat, décris-le. Réponds en français, de manière éducative et engageante.",
                },
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Qu'est-ce que c'est ?" },
                        {
                            type: "image_url",
                            image_url: {
                                "url": imageUrl,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 300,
        });

        return response.choices[0].message.content || "Je n'ai pas pu analyser cette image.";
    } catch (error) {
        console.error("Error analyzing image:", error);
        return "Désolé, je n'arrive pas à voir cette image pour le moment (Erreur Vision).";
    }
};
