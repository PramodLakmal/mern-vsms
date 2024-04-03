import Notice from '../models/notice.model.js'; // Import the Notice model
import mongoose from 'mongoose';

const getNotices = async (req, res) => {
    try {
        const notices = await Notice.find({}).sort({ date: -1 }); // Sort notices by date in descending order
        res.status(200).json(notices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getNotice = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid notice ID' });
    }

    try {
        const notice = await Notice.findById(id);
        if (!notice) {
            return res.status(404).json({ error: 'Notice not found' });
        }
        res.status(200).json(notice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNotice = async (req, res) => {
    const { title, date, noticeType, description } = req.body;

    try {
        const notice = await Notice.create({ title, date, noticeType, description });
        res.status(201).json(notice);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteNotice = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid notice ID' });
    }

    try {
        const notice = await Notice.findOneAndDelete({ _id: id });
        if (!notice) {
            return res.status(404).json({ error: 'Notice not found' });
        }
        res.status(200).json(notice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateNotice = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid notice ID' });
    }

    try {
        const notice = await Notice.findByIdAndUpdate(id, req.body, { new: true });
        if (!notice) {
            return res.status(404).json({ error: 'Notice not found' });
        }
        res.status(200).json(notice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
    getNotices,
    getNotice,
    createNotice,
    deleteNotice,
    updateNotice
};
