const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        postalCode: String
    },
    contactInfo: {
        email: String,
        phone: String,
        website: String
    },
    logo: {
        type: String
    },
    settings: {
        allowParentCommunication: {
            type: Boolean,
            default: true
        },
        autoGradeEnabled: {
            type: Boolean,
            default: true
        },
        maxFileSize: {
            type: Number,
            default: 10 // in MB
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const School = mongoose.model('School', schoolSchema);

module.exports = School; 