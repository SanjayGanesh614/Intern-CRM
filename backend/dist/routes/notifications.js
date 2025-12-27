import { Router } from 'express';
import { auth } from '../middleware/auth';
import { getUnreadNotifications, markAsRead, markAllAsRead } from '../services/notificationService';
import { Notification } from '../models/Notification';
const router = Router();
// GET /notifications
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const notifications = await Notification.find({ user_id: userId })
            .sort({ created_at: -1 })
            .limit(50); // Get recent 50
        res.json(notifications);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});
// GET /notifications/unread
router.get('/unread', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const notifications = await getUnreadNotifications(userId);
        res.json(notifications);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});
// PATCH /notifications/:id/read
router.patch('/:id/read', auth, async (req, res) => {
    try {
        await markAsRead(req.params.id);
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to mark as read' });
    }
});
// POST /notifications/mark-all-read
router.post('/mark-all-read', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        await markAllAsRead(userId);
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to mark all as read' });
    }
});
export default router;
