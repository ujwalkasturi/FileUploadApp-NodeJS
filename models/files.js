const mongoose = require('mongoose');
const fileSchema = new mongoose.Schema({
    userName: {
        type: 'string',
        required: true,
    },
    fileImage: {
        type: 'string',
        required: true,
    },
    uploaded: {
        type: Date,
        required: true,
        default: Date.now,
    }
});

module.exports = mongoose.model('FileUpload',fileSchema);