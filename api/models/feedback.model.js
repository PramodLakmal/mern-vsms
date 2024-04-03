import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
    feedbackName: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    }
})

const Feedback = mongoose.model('Feedback', FeedbackSchema);
export default Feedback;
