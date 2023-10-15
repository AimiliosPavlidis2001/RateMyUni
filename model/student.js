const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    academicEmail: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    nationality: {
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
    },
    admissionYear: {
        type: Number,
        required: true
    },
    degreeLevel: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// for the hashed password
studentSchema.pre('save', async function (next) {
    try {
      const student = this;
      if (!student.isModified('password')) {
        return next();
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
  
      next();
    }
    catch (error) {
      return next(error);
    }
});

// check if the password matches
studentSchema.methods.matchPassword = async function (password) {
    try {
      return await bcrypt.compare(password, this.password);
    } 
    catch (error) {
      throw new Error(error);
    }
  };

module.exports = mongoose.model('Student', studentSchema);