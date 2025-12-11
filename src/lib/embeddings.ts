
import { openai } from './openai';
import { supabase } from './supabase';

export const generateEmbedding = async (text: string): Promise<number[] | null> => {
    if (!openai) return null;
    try {
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: text.replace(/\n/g, ' '),
        });
        return response.data[0].embedding;
    } catch (error) {
        console.error('Error generating embedding:', error);
        return null;
    }
};

export const storeKnowledge = async (content: string, metadata: any) => {
    if (!supabase) return;
    const embedding = await generateEmbedding(content);
    if (!embedding) return;

    const { error } = await supabase.from('knowledge_vectors').insert({
        content,
        metadata,
        embedding
    });

    if (error) {
        console.error('Error storing knowledge:', error);
    }
};

export const searchKnowledge = async (query: string, limit: number = 3) => {
    if (!supabase) return [];

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);
    if (!queryEmbedding) return [];

    // Call the RPC function match_knowledge
    const { data, error } = await supabase.rpc('match_knowledge', {
        query_embedding: queryEmbedding,
        match_threshold: 0.25, // Optimized threshold based on testing
        match_count: limit
    });

    if (error) {
        console.error('Error searching knowledge:', error);
        return [];
    }

    return data;
};
