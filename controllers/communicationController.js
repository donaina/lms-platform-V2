const Communication = require('../models/Communication');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

// Email transporter setup
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Send message
exports.sendMessage = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { recipientId, subject, message, priority } = req.body;

        // Verify recipient exists and is from the same school
        const recipient = await User.findOne({
            _id: recipientId,
            school: req.user.school
        });

        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }

        const communication = new Communication({
            school: req.user.school,
            sender: req.user._id,
            recipient: recipientId,
            subject,
            message,
            priority
        });

        if (req.file) {
            communication.attachments.push({
                fileName: req.file.originalname,
                fileUrl: req.file.path
            });
        }

        await communication.save();

        // Send email notification
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: recipient.email,
            subject: `New message: ${subject}`,
            html: `
                <h2>You have a new message</h2>
                <p><strong>From:</strong> ${req.user.name}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
                <p>Login to the platform to respond.</p>
            `
        });

        res.status(201).json(communication);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Reply to message
exports.replyToMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { message } = req.body;

        const communication = await Communication.findOne({
            _id: messageId,
            $or: [
                { sender: req.user._id },
                { recipient: req.user._id }
            ]
        });

        if (!communication) {
            return res.status(404).json({ message: 'Message not found' });
        }

        communication.replies.push({
            sender: req.user._id,
            message
        });

        communication.status = 'replied';
        await communication.save();

        // Notify the other party
        const notifyUser = communication.sender.toString() === req.user._id.toString()
            ? communication.recipient
            : communication.sender;

        const recipient = await User.findById(notifyUser);
        
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: recipient.email,
            subject: `New reply to: ${communication.subject}`,
            html: `
                <h2>New Reply</h2>
                <p><strong>From:</strong> ${req.user.name}</p>
                <p><strong>Original Subject:</strong> ${communication.subject}</p>
                <p><strong>Reply:</strong></p>
                <p>${message}</p>
                <p>Login to the platform to view the full conversation.</p>
            `
        });

        res.json(communication);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get user's messages
exports.getMessages = async (req, res) => {
    try {
        const { status, priority } = req.query;
        const query = {
            school: req.user.school,
            $or: [
                { sender: req.user._id },
                { recipient: req.user._id }
            ]
        };

        if (status) query.status = status;
        if (priority) query.priority = priority;

        const messages = await Communication.find(query)
            .populate('sender', 'name email')
            .populate('recipient', 'name email')
            .sort({ createdAt: -1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;

        const communication = await Communication.findOne({
            _id: messageId,
            recipient: req.user._id,
            status: { $ne: 'read' }
        });

        if (!communication) {
            return res.status(404).json({ message: 'Message not found' });
        }

        communication.status = 'read';
        await communication.save();

        res.json(communication);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}; 