import Notice from '../models/notice.model.js';

// Create a new notice
export const createNotice = async (req, res, next) => {
  try {
    const noticeData = req.body;
    const notice = new Notice(noticeData);
    await notice.save();
    res.status(201).json({ message: 'Notice created successfully', notice });
  } catch (error) {
    next(error);
  }
};

// Get all notices
export const getAllNotices = async (req, res, next) => {
  try {
    const notices = await Notice.find();
    res.status(200).json({ notices });
  } catch (error) {
    next(error);
  }
};

// Get a single notice by ID
export const getNoticeById = async (req, res, next) => {
  try {
    const noticeId = req.params.id;
    const notice = await Notice.findById(noticeId);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.status(200).json(notice);
  } catch (error) {
    next(error);
  }
};

// Delete a notice by ID
export const deleteNoticeById = async (req, res, next) => {
  try {
    const noticeId = req.params.id;
    const deletedNotice = await Notice.findByIdAndDelete(noticeId);
    if (!deletedNotice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.status(200).json({ message: 'Notice deleted successfully', deletedNotice });
  } catch (error) {
    next(error);
  }
};

// Update a notice by ID
export const updateNoticeById = async (req, res, next) => {
  try {
    const noticeId = req.params.id;
    const updatedNoticeData = req.body;
    const updatedNotice = await Notice.findByIdAndUpdate(noticeId, updatedNoticeData, { new: true });
    if (!updatedNotice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.status(200).json({ message: 'Notice updated successfully', updatedNotice });
  } catch (error) {
    next(error);
  }
};
