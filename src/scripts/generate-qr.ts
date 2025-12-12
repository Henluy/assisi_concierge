import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

const BOT_USERNAME = 'AssisiConciergeBot'; // Replace with actual bot username
const BOT_LINK = `https://t.me/${BOT_USERNAME}`;
const WEB_LINK = 'https://assisi-concierge.vercel.app/chat';

async function generateQRCodes() {
    console.log('🎨 Generating QR Codes for Assisi Concierge...\n');

    const outputDir = path.join(process.cwd(), 'public', 'qr');

    // Create output directory
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // 1. Telegram Bot QR
    const telegramQRPath = path.join(outputDir, 'telegram-bot.png');
    await QRCode.toFile(telegramQRPath, BOT_LINK, {
        width: 400,
        margin: 2,
        color: {
            dark: '#0088cc', // Telegram blue
            light: '#ffffff'
        }
    });
    console.log(`✅ Telegram QR: ${telegramQRPath}`);
    console.log(`   Link: ${BOT_LINK}`);

    // 2. Web App QR
    const webQRPath = path.join(outputDir, 'web-chat.png');
    await QRCode.toFile(webQRPath, WEB_LINK, {
        width: 400,
        margin: 2,
        color: {
            dark: '#2563eb', // Blue-600
            light: '#ffffff'
        }
    });
    console.log(`✅ Web Chat QR: ${webQRPath}`);
    console.log(`   Link: ${WEB_LINK}`);

    // 3. Generate HTML flyer template
    const flyerHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Segoe UI', sans-serif; text-align: center; padding: 40px; }
        h1 { color: #1e3a5f; font-size: 32px; }
        .subtitle { color: #666; font-size: 18px; margin-bottom: 40px; }
        .qr-container { display: flex; justify-content: center; gap: 60px; margin: 40px 0; }
        .qr-box { background: #f8f9fa; padding: 30px; border-radius: 20px; }
        .qr-box img { width: 200px; height: 200px; }
        .qr-box h3 { margin-top: 15px; color: #333; }
        .features { display: flex; justify-content: center; gap: 30px; margin-top: 40px; }
        .feature { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px 25px; border-radius: 12px; }
        footer { margin-top: 50px; color: #999; font-size: 14px; }
    </style>
</head>
<body>
    <h1>🇮🇹 Assisi AI Concierge</h1>
    <p class="subtitle">Votre guide intelligent pour découvrir Assise</p>
    
    <div class="qr-container">
        <div class="qr-box">
            <img src="telegram-bot.png" alt="Telegram QR">
            <h3>📱 Telegram</h3>
            <p>Scannez pour ouvrir le Bot</p>
        </div>
        <div class="qr-box">
            <img src="web-chat.png" alt="Web QR">
            <h3>💻 Web</h3>
            <p>Scannez pour le Chat Web</p>
        </div>
    </div>
    
    <div class="features">
        <div class="feature">🍽️ Restaurants</div>
        <div class="feature">🙏 Messes</div>
        <div class="feature">🎧 Audioguides</div>
        <div class="feature">📸 Photos IA</div>
    </div>
    
    <footer>
        Powered by AssisiConcierge.ai • Gratuit • Multilingue (IT/EN/FR/DE/ES)
    </footer>
</body>
</html>
`;

    const flyerPath = path.join(outputDir, 'flyer.html');
    fs.writeFileSync(flyerPath, flyerHTML);
    console.log(`✅ Flyer HTML: ${flyerPath}`);

    console.log('\n🎉 QR Codes générés dans /public/qr/');
    console.log('   Ouvrez flyer.html pour imprimer les QR codes !');
}

generateQRCodes();
