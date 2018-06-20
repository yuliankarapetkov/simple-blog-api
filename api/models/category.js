const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   name: { Type: String, required: true },
   description: String
});

module.exports = mongoose.model('Category', categorySchema);