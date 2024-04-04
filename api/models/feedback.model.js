import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true
    },
    feedbackName: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    }
}, {timestamps: true}

);

const Feedback = mongoose.model('Feedback', FeedbackSchema);
export default Feedback;
