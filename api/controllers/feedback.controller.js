import e from "express";
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
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });

        

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

export const editFeedbacks = async (req, res, next) => {
    try {
        const feedback = await Feedback.findById(req.params.feedbackId);
        if(!feedback){
            return next(errorHandler(404, 'Feedback not found'));
        }
        if(feedback.userId !== req.user.id){
            return next(errorHandler(403, 'You are not allowed to edit this feedback'));
        }
        const updatedFeedback = await Feedback.findByIdAndUpdate(req.params.feedbackId, { feedback: req.body.feedback }, { new: true });
        res.status(200).json(updatedFeedback);
    } catch (error) {
        next(errorHandler(500, 'Failed to update feedback'));
    }
};

export const deleteFeedbacks = async (req, res, next) => {
    try {
        const feedback = await Feedback.findById(req.params.feedbackId);
        if(!feedback){
            return next(errorHandler(404, 'Feedback not found'));
        }
        if(feedback.userId !== req.user.id){
            return next(errorHandler(403, 'You are not allowed to delete this feedback'));
        }
        await Feedback.findByIdAndDelete(req.params.feedbackId);
        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        next(errorHandler(500, 'Failed to delete feedback'));
    }
};