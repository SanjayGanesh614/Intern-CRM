import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';
// Initialize Gemini
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
export const analyzeJob = async (jobDescription, resumeText) => {
    if (!env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured');
    }
    const prompt = `
    You are an expert career coach and ATS analyzer. 
    Analyze the following Job Description (JD) against the Candidate's Resume.

    JOB DESCRIPTION:
    ${jobDescription}

    RESUME:
    ${resumeText}

    Output a JSON object with the following structure (do NOT include markdown formatting like \`\`\`json):
    {
        "match_score": number (0-100),
        "key_missing_skills": string[],
        "improvement_tips": string[],
        "summary": "Brief 1-sentence summary of fit"
    }
    `;
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        // Clean up markdown if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    }
    catch (error) {
        console.error('AI Analysis Failed:', error);
        throw new Error('Failed to analyze job');
    }
};
export const generateCoverLetter = async (jobDescription, resumeText, companyName, roleTitle) => {
    if (!env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured');
    }
    const prompt = `
    Write a professional and compelling Cover Letter for the following role.
    Use the candidate's resume to highlight relevant experience.

    ROLE: ${roleTitle} at ${companyName}
    JOB DESCRIPTION: ${jobDescription}
    RESUME: ${resumeText}

    Return ONLY the body of the cover letter as plain text. Do not include placeholders like [Your Name] if you can infer it, otherwise use brackets.
    `;
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    }
    catch (error) {
        console.error('AI Cover Letter Gen Failed:', error);
        throw new Error('Failed to generate cover letter');
    }
};
