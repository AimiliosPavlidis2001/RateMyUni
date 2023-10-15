const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  universityID: {
    type: String,
    required: true,
    unique: true
  },
  universityName: {
    type: String,
    required: true
  },
  universityFoundedYear: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  // for the sorting of the location (north, central, south)
  sortingLocation: {
    type: String,
    required: true
  },
  worldRanking: {
    type: Number
  },
  departmentIDs: 
  { //so that we can have a lot of departmentIDs in the university database
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department' // Reference to the Department model
    }],
    default: [] // Empty array, because we may not have available departmentIDs
  },
  numberOfDepartments: {
    type: Number,
    required: true
  },
  universityAverageRating: {  // New field to store average rating
    type: Number,
    default: 0  // Default value is 0
  }
});

module.exports = mongoose.model('University', universitySchema);