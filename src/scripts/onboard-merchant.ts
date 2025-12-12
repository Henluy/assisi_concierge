import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import readline from 'readline';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question: string): Promise<string> {
    return new Promise(resolve => rl.question(question, resolve));
}

async function onboardMerchant() {
    console.log('\n🏪 === ONBOARDING NOUVEAU COMMERÇANT ===\n');

    try {
        const name = await ask('Nom du commerce : ');
        const email = await ask('Email du commerçant : ');
        const type = await ask('Type (restaurant/hotel/experience) : ');
        const commissionRate = await ask('Taux de commission % (défaut: 10) : ') || '10';

        console.log('\n📋 Récapitulatif :');
        console.log(`   Nom: ${name}`);
        console.log(`   Email: ${email}`);
        console.log(`   Type: ${type}`);
        console.log(`   Commission: ${commissionRate}%`);

        const confirm = await ask('\nConfirmer l\'inscription ? (o/n) : ');

        if (confirm.toLowerCase() !== 'o') {
            console.log('❌ Inscription annulée.');
            rl.close();
            return;
        }

        // Insert into Supabase
        const { data, error } = await supabase
            .from('merchants')
            .insert({
                name,
                email,
                type,
                commission_rate: parseFloat(commissionRate) / 100
            })
            .select()
            .single();

        if (error) throw error;

        console.log('\n✅ Commerçant inscrit avec succès !');
        console.log(`   ID: ${data.id}`);
        console.log(`   Lien Dashboard: https://assisi-concierge.vercel.app/dashboard/login`);

        // Generate tracking link example
        console.log(`\n📎 Exemple de lien tracké pour ce commerçant :`);
        console.log(`   https://assisi.ai/book?ref=${data.id}&sig=...`);

        // Send welcome email (if RESEND_API_KEY is configured)
        if (process.env.RESEND_API_KEY) {
            console.log('\n📧 Un email de bienvenue va être envoyé...');
            // TODO: Integrate with Resend
        }

    } catch (error) {
        console.error('❌ Erreur:', error);
    }

    rl.close();
}

onboardMerchant();
