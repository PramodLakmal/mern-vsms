import mongoose from 'mongoose';


const FeedbackSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true
    },
    currentUser: {
        type: String,
        required: false
    },
    feedbackName: {
        type: String,
        required: false
    },
    feedback: {
        type: String,
        required: true
    },
    feedbackId: {
        type: String,
        required: false
    }
}, {timestamps: true}

);

const Feedback = mongoose.model('Feedback', FeedbackSchema);
export default Feedback;
