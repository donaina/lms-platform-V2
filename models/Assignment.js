const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    maxScore: {
        type: Number,
        required: true
    },
    questions: [{
        question: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['multiple_choice', 'true_false', 'short_answer'],
            required: true
        },
        options: [{
            type: String
        }],
        correctAnswer: {
            type: String,
            required: true
        },
        score: {
            type: Number,
            required: true
        }
    }],
    submissions: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        answers: [{
            questionId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            answer: {
                type: String,
                required: true
            }
        }],
        submittedAt: {
            type: Date,
            default: Date.now
        },
        score: {
            type: Number
        },
        feedback: {
            type: String
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Assignment', assignmentSchema); 