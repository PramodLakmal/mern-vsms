import Feedback from "../models/feedback.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
    if(!req.body.feedbackName || !req.body.feedback){
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
