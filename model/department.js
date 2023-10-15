const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  departmentID: {
    type: String,
    required: true,
    unique: true
  },
  departmentName: {
    type: String,
    required: true
  },
  fieldOfStudy: {
    type: String,
    required: true
  },
  departmentFoundedYear: {
    type: Number,
    required: true
  },
  universityID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University', // Reference to the University model
    required: true
  },
  academicYears: {
    type: Number,
    required: true
  },
  departmentAverageRating: {  // New field to store average rating
    type: Number,
    default: 0  // Default value is 0
  }
});

module.exports = mongoose.model('Department', departmentSchema);