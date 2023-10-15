const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  overall: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  facilities: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  accommodationFoodServices: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  professors: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  universityClubs: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  studentLife: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  careerProspects: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  academicEmail: {
    type: String,
    required: true
  },
  universityID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: true
  },
  departmentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  }
});

// Middleware to validate academicEmail
reviewSchema.pre('save', async function(next) {
    try {
      // Find a student with the same academicEmail as the current review
      const student = await mongoose.model('Student').findOne({ academicEmail: this.academicEmail });
      
      // If no student is found, throw an error
      if (!student) {
        throw new Error('Invalid academic email. No matching student found.');
      }
      
      // If a matching student is found, continue
      next();
    } catch (error) {
      next(error);
    }
  });

module.exports = mongoose.model('Review', reviewSchema);