import Feedback from "../models/feedback.model.js";
import { errorHandler } from "../utils/error.js";


export const create = async (req, res, next) => {
    if(!req.body.currentUser || !req.body.feedback){
        return next(errorHandler(403, 'Please provide feedback name and feedback'));
    }

    const newFeedback = new Feedback({
        ...req.body, userId: req.user.id 
    });
    try {
        const savedFeedback = await newFeedback.save();
        res.status(201).json(savedFeedback);
    } catch (error) {
        next(errorHandler(500, 'Failed to save feedback'));
    }
};

export const getFeedbacks = async (req, res, next) => {
    try {
        const feedbacks = await Feedback.find();

        const totalFeedbacks = await Feedback.find().countDocuments();
        const now = new Date();

        const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
        );

        const lastMonthFeedbacks = await Feedback.countDocuments({
        createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
        feedbacks,
        totalFeedbacks,
        lastMonthFeedbacks,
        });
    
    } catch (error) {
        next(errorHandler(500, 'Failed to fetch feedbacks'));
    }
};
