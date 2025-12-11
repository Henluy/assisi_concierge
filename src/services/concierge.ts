import { getChatMessage, analyzeImage, generateSpeech } from '@/lib/openai';
import { searchPlaces } from '@/lib/google-places';
import { searchKnowledge } from '@/lib/embeddings';
import { predictCrowdLevel } from '@/lib/prediction';
import { generateTrackingLink } from '@/lib/commission';
import places from '@/data/places.json';

export type ConciergeResponse = {
    text: string;
    audio?: Buffer;
    intent: string;
};

// Simple localized labels
const LABELS: any = {
    'fr': { crowd: "Prédiction d'Affluence", level: "Niveau", wait: "Attente estimée", reason: "Raison", advice: "Conseil", open: "C'est le moment idéal !", restaurants: "Voici 3 restaurants recommandés", churches: "Lieux de prière", hotels: "Où dormir", audio: "Enregistrement de l'audioguide", error: "Erreur" },
    'en': { crowd: "Crowd Prediction", level: "Level", wait: "Est. Wait", reason: "Reason", advice: "Advice", open: "Great time to visit!", restaurants: "Here are 3 recommended restaurants", churches: "Places of worship", hotels: "Where to stay", audio: "Recording audio guide", error: "Error" },
    'it': { crowd: "Previsione Affluenza", level: "Livello", wait: "Attesa stimata", reason: "Motivo", advice: "Consiglio", open: "È il momento ideale!", restaurants: "Ecco 3 ristoranti consigliati", churches: "Luoghi di preghiera", hotels: "Dove dormire", audio: "Registrazione audioguida", error: "Errore" }
};

export class ConciergeService {
    static async processRequest(text: string, chatId: string, language: string = 'fr'): Promise<ConciergeResponse> {
        const lang = LABELS[language] || LABELS['fr'];
        const lowerText = text.toLowerCase();

        // 1. Audio / Guide Intent 🎧
        if (lowerText.includes('audio') || lowerText.includes('guide') || lowerText.includes('voice') || lowerText.includes('raconte')) {
            // Generate summary (mock for now, or could use GPT)
            const summary = "Bienvenue à la Basilique Saint-François d'Assise. Ce joyau de l'art gothique, achevé en 1253, abrite les célèbres fresques de Giotto racontant la vie du Saint.";
            const audioBuffer = await generateSpeech(summary);
            return {
                intent: 'audio',
                text: lang.audio,
                audio: audioBuffer || undefined
            };
        }

        // 2. Crowd Intent ⏳
        if (lowerText.includes('monde') || lowerText.includes('crowd') || lowerText.includes('wait') || lowerText.includes('attente') ||
            lowerText.includes('gente') || lowerText.includes('folla') || lowerText.includes('affollamento')) {
            const prediction = predictCrowdLevel();
            const emoji = prediction.level === 'Low' ? '🟢' : prediction.level === 'Moderate' ? '🟡' : '🔴';

            let response = `⏳ **${lang.crowd}**\n\n`;
            response += `${emoji} ${lang.level}: **${prediction.level}**\n`;
            response += `⏱️ ${lang.wait}: **${prediction.waitMinutes} min**\n`;

            return { intent: 'crowd', text: response };
        }

        // 3. Restaurants 🍽️
        if (lowerText.includes('mangiare') || lowerText.includes('eat') || lowerText.includes('manger')) {
            const liveData = await searchPlaces('restaurant');
            const dataToUse = (liveData && liveData.length > 0) ? liveData : places.filter(p => p.type === 'restaurant').slice(0, 3);

            let response = `🍽 *${lang.restaurants}:*\n\n`;
            dataToUse.forEach((r: any) => {
                response += `• *${r.name}* (⭐${r.rating || 'N/A'})\n\n`;
            });
            return { intent: 'restaurant', text: response };
        }

        // 4. Fallback: Knowledge Base + OpenAI
        const knowledge = await searchKnowledge(text);
        let context = "";
        if (knowledge && knowledge.length > 0) {
            context = knowledge.map((k: any) => `- ${k.content}`).join("\n");
        }

        // Multilingual System Prompt
        const systemPromptOverride = `You are the Assisi Concierge. Reply in ${language}. Use Italian emojis.`;
        const gptResponse = await getChatMessage(text, context + "\nSystem: " + systemPromptOverride);

        // Add Tracking
        const trackLink = generateTrackingLink('https://assisi.ai/book', 'generic', chatId);
        const finalResponse = gptResponse + `\n\n🔗 [Book now](${trackLink})`;

        return { intent: 'chat', text: finalResponse };
    }
}
