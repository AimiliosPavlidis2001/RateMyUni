const LocalStrategy = require("passport-local");
const Student = require('../model/student');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
  passport.use(
    'local-signup',
    new LocalStrategy(
        {
            usernameField: 'academicEmail',
            passwordField: 'password',
            passReqToCallback: true // for more complex login
        },
        async (req, academicEmail, password, done) => {
            try {
                const studentExists = await Student.findOne({ academicEmail });
                if (studentExists) {
                    return done(null, false, { message: 'Email already exists' });
                }

                const { fullName, nationality, universityID, departmentID, admissionYear, degreeLevel } = req.body;

                const student = new Student({
                    academicEmail,
                    password,
                    fullName,
                    nationality,
                    universityID,
                    departmentID,
                    admissionYear,
                    degreeLevel
                });

                await student.save();
                
                return done(null, student);
            }
            catch (error) {
                done(error);
            }
        }
    )
);

  passport.use(
    'local-login',
    new LocalStrategy(
        {
            usernameField: 'academicEmail',
            passwordField: 'password',
            passReqToCallback: true //for academicEmail and password
        },
        async (req, academicEmail, password, done) => {
            try {
                const student = await Student.findOne({ academicEmail });
                if (!student) {
                    return done(null, false, { message: 'Invalid credentials' });
                }

                const isMatch = await student.matchPassword(password);
                if (!isMatch) {
                    return done(null, false, { message: 'Invalid credentials' });
                }

                return done(null, student);
            }
            catch (error) {
                return done(error);
            }
        }
    )
  );
};