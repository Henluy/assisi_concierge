
export const logAPI = (service: string, details: string, costEstimate: number = 0) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${service}] ${details} | Est. Cost: €${costEstimate.toFixed(4)}`);
};
