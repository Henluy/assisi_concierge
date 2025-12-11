export type CrowdLevel = 'Low' | 'Moderate' | 'High' | 'Extreme' | 'Closed';

export interface PredictionResult {
    level: CrowdLevel;
    waitMinutes: string;
    score: number;
    reason: string;
    isOpen: boolean;
}

// Simple heuristic landmarks hours (simplification)
const OPENING_HOURS = {
    start: 8, // 8 AM
    end: 18,  // 6 PM
};

export function predictCrowdLevel(timestamp: Date = new Date()): PredictionResult {
    const hour = timestamp.getHours();
    const day = timestamp.getDay(); // 0 = Sunday, 6 = Saturday
    const month = timestamp.getMonth(); // 0 = Jan

    // 1. Check if Open
    if (hour < OPENING_HOURS.start || hour >= OPENING_HOURS.end) {
        return {
            level: 'Closed',
            waitMinutes: '0',
            score: 0,
            reason: 'Le lieu est actuellement fermé.',
            isOpen: false
        };
    }

    let score = 1.0;
    let reasons: string[] = [];

    // 2. Seasonality
    // Peak: April (Easter), June-August (Summer), December (Xmas)
    if (month === 3 || (month >= 5 && month <= 7) || month === 11) {
        score *= 1.5;
        reasons.push("Haute saison");
    }

    // 3. Day of Week
    if (day === 0 || day === 6) {
        score *= 1.4;
        reasons.push("Week-end");
    }

    // 4. Time of Day
    if (hour >= 10 && hour <= 12) {
        score *= 1.3;
        reasons.push("Pic matinal");
    } else if (hour >= 14 && hour <= 16) {
        score *= 1.2;
        reasons.push("Pic après-midi");
    } else {
        score *= 0.8; // Off-peak hours
    }

    // Level Mapping
    let level: CrowdLevel = 'Low';
    let waitMinutes = '0-5';

    if (score > 2.2) {
        level = 'Extreme';
        waitMinutes = '> 45';
    } else if (score > 1.6) {
        level = 'High';
        waitMinutes = '20-40';
    } else if (score > 1.2) {
        level = 'Moderate';
        waitMinutes = '10-20';
    }

    return {
        level,
        waitMinutes,
        score: parseFloat(score.toFixed(2)),
        reason: reasons.length > 0 ? reasons.join(' + ') : 'Conditions normales',
        isOpen: true
    };
}
