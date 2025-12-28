import { generateOutreach } from '../services/aiOutreach.js';
export const generateOutreachController = async (req, res) => {
    try {
        const { company_name, internship_title, internship_description, type, user_notes } = req.body;
        if (!company_name || !internship_title || !type) {
            return res.status(400).json({ status: 'error', message: 'Missing required fields' });
        }
        const result = await generateOutreach({
            company_name,
            internship_title,
            internship_description: internship_description || '',
            type,
            user_notes
        });
        if (result.status === 'error') {
            return res.status(500).json(result);
        }
        res.json(result);
    }
    catch (error) {
        console.error('Controller Error:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};
