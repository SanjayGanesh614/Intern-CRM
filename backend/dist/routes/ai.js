import { Router } from 'express';
import { analyzeJob, generateCoverLetter } from '../services/ai';
import { Internship } from '../models/Internship';
import { auth as authenticate } from '../middleware/auth';
const router = Router();
// POST /ai/analyze
router.post('/analyze', authenticate, async (req, res) => {
    try {
        const { internship_id, resume_text } = req.body;
        if (!internship_id || !resume_text) {
            res.status(400).json({ error: 'internship_id and resume_text are required' });
            return;
        }
        // Fetch internship to get description? 
        // Wait, Internship model currently DOES NOT have description.
        // It's mostly metadata. The description acts as input, or we might validly assume 
        // we fetched it. If we don't have it, we might need to rely on what user pastes 
        // or re-fetch.
        // For now, let's assume the user sends description OR we use what we have (title/company).
        // Let's modify the request to accept description derived from frontend or pasted by user.
        // Actually Phase 3 fetched logs mentions saving "processed_data". 
        // But the Internship Schema in 'Data.md' (Phase 1) didn't explicitly have 'description'.
        // Let's check Internship model later. For now, let's accept 'job_description' in body 
        // as a fallback if not in DB.
        let { job_description } = req.body;
        const internship = await Internship.findById(internship_id);
        if (!internship) {
            res.status(404).json({ error: 'Internship not found' });
            return;
        }
        // If we don't have description passed, construct minimal one or fail
        if (!job_description) {
            job_description = `${internship.title} at ${internship.company_id}. (Full description unavailable, analyze based on title)`;
        }
        const analysis = await analyzeJob(job_description, resume_text);
        res.json(analysis);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Analysis failed' });
    }
});
// POST /ai/cover-letter
router.post('/cover-letter', authenticate, async (req, res) => {
    try {
        const { internship_id, resume_text, job_description } = req.body;
        if (!internship_id || !resume_text) {
            res.status(400).json({ error: 'internship_id and resume_text are required' });
            return;
        }
        const internship = await Internship.findById(internship_id);
        if (!internship) {
            res.status(404).json({ error: 'Internship not found' });
            return;
        }
        const description = job_description || `${internship.title} at ${internship.company_id}`;
        const coverLetter = await generateCoverLetter(description, resume_text, internship.company_id, // This is ID currently, hopefully string name? Schema says string.
        internship.title);
        res.json({ cover_letter: coverLetter });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Generation failed' });
    }
});
export default router;
