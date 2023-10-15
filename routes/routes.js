// routes/routes.js

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');
require('../login/passportConfig')(passport);

const Student = require('../model/student');
const University = require('../model/university')
const Department = require('../model/department')
const Review = require('../model/review');

module.exports = router;


//----------------------------------------------------------------------

//For student.js
// Register (signup) a new user -> ADDED CODE FOR REGISTRATION/LOGIN
router.post("/auth/signup",
    passport.authenticate('local-signup', { session: false }),
    (req, res) => {
        res.json({
            student: req.user,
            message: 'Account created successfully!'
        });
    }
);

// Login -> ADDED CODE FOR REGISTRATION/LOGIN
router.post(
    "/auth/login",
    passport.authenticate('local-login', { session: false }),
    (req, res) => {
        res.json({
            student: req.user,
            message: 'Logged in successfully'
        });
    }
);

//Get all Method
router.get('/getAllStudents', async (req, res) => {
    try{
        const student = await Student.find();
        res.json(student)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by ID Method
router.get('/getOneStudent/:id', async (req, res) => {
    try{
        const student = await Student.findById(req.params.id);
        res.json(student)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Update by ID Method
router.patch('/updateStudent/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedStudent = req.body;
        const options = { new: true };
        const result = await Student.findByIdAndUpdate(
            id, updatedStudent, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/deleteStudent/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const student = await Student.findByIdAndDelete(id)
        res.send(`Document with ${student.fullName} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})


//----------------------------------------------------------------------

// calculateAverageUniversityRating - it takes the departmentAverageRating and not each review
const calculateAverageUniversityRating = async (universityId) => {
    // Find all the departments for the specific universityID
    const universityDepartments = await Department.find({ universityID: universityId });
    // Filter out departments with no reviews (departmentAverageRating = 0)
    const ratedDepartments = universityDepartments.filter(department => department.departmentAverageRating > 0);
    // Add the departmentAverageRating of each rated department of the university, start from 0
    const totalUniversityRating = ratedDepartments.reduce((total, department) => total + department.departmentAverageRating, 0);
    // Calculate the average rating of the university, if there are no rated departments then set average rating to 0
    const averageUniversityRating = (ratedDepartments.length > 0) ? (totalUniversityRating / ratedDepartments.length) : 0;
    // Update the university's average rating, with 2 decimal points if needed
    await University.findByIdAndUpdate(universityId, { universityAverageRating: averageUniversityRating.toFixed(2) });
}

//For university.js
//Post method
router.post('/postUniversity', async (req, res) => {
    const university = new University({
        universityID: req.body.universityID,
        universityName: req.body.universityName,
        universityFoundedYear: req.body.universityFoundedYear,
        location: req.body.location,
        sortingLocation: req.body.sortingLocation,
        worldRanking: req.body.worldRanking,
        departmentIDs: req.body.departmentIDs,
        numberOfDepartments: req.body.numberOfDepartments,
        universityAverageRating: req.body.universityAverageRating
    })
    try {
        const UniversityToSave = await university.save();
        res.status(200).json(UniversityToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Get all Method + Location Filter + Pagination included
router.get('/getAllUniversities', async (req, res) => {
    const universitiesPerPage = 3;
    const page = parseInt(req.query.page) || 1; // value of page OR page=1
    const skip = (page - 1) * universitiesPerPage;
  
    // This is added for the filtering based on the location of the university
    let filter = {};
    if (req.query.sortingLocation) { // If a filter is picked
        filter.sortingLocation = req.query.sortingLocation; // pass it to filter.sortingLocation
    }

    try {
      const count = await University.countDocuments(filter); // count of universities, based on the filter
      const pageCount = Math.ceil(count / universitiesPerPage); // Math.ceil to round up to the nearest integer
  
      const universities = await University.find(filter) // fetch universities for the current page and based on the filter
        .skip(skip)
        .limit(universitiesPerPage);
  
      res.json({
        pagination: {
          count, // total number of universities
          pageCount, // total number of pages
          currentPage: page  // we give to currentPage the value page
        },
        universities: universities // array
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })

//Get by ID Method
router.get('/getOneUniversity/:id', async (req, res) => {
    try{
        const university = await University.findById(req.params.id);
        res.json(university)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

// Update university by ID
router.patch('/updateUniversity/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const updatedUniversity = req.body; // It retrieves the updated data from the request body using req.body. 
      // The request body should contain the new data that will replace the existing data in the document.
      const options = { new: true }; // It defines the options object for the findByIdAndUpdate method.
      // In this case, { new: true } ensures that the updated document is returned as the result.
      // Without this option, the method would return the original document before the update.
      const result = await University.findByIdAndUpdate(
            id, updatedUniversity, options
      )

      res.send(result)
    } 
    catch (error) {
      res.status(400).json({ message: error.message });
    }
  })

//Delete by ID Method
router.delete('/deleteUniversity/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const university = await University.findByIdAndDelete(id)
        res.send(`Document with ${university.universityName} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})


//----------------------------------------------------------------------

// calculateAverageDepartmentRating
const calculateAverageDepartmentRating = async (departmentId) => {
    // Find all the reviews for the specific departmentID
    const departmentReviews = await Review.find({ departmentID: departmentId });
    // Add the total ratings of the department, start from 0
    const totalDepartmentRating = departmentReviews.reduce((total, review) => total + review.overall, 0);
    // Calculate the average rating of the department, if 0 reviews then set average rating to 0
    const averageDepartmentRating = (departmentReviews.length > 0) ? (totalDepartmentRating / departmentReviews.length) : 0;
    // Update the department's average rating, with 2 decimal points if needed
    await Department.findByIdAndUpdate(departmentId, { departmentAverageRating: averageDepartmentRating.toFixed(2) });

    // After updating the department's average rating, find the department
    const findDepartment = await Department.findById(departmentId);
    // Update the university's average rating based on the new department rating
    await calculateAverageUniversityRating(findDepartment.universityID);
}



//For department.js
//Post method
router.post('/postDepartment', async (req, res) => {
    const department = new Department({
        departmentID: req.body.departmentID,
        departmentName: req.body.departmentName,
        fieldOfStudy: req.body.fieldOfStudy,
        departmentFoundedYear: req.body.departmentFoundedYear,
        universityID: req.body.universityID,
        academicYears: req.body.academicYears,
        departmentAverageRating: req.body.departmentAverageRating
    })
    try {
        const DepartmentToSave = await department.save();
        res.status(200).json(DepartmentToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Get all Method
router.get('/getAllDepartments', async (req, res) => {
    try{
        const department = await Department.find();
        res.json(department)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get all departments for a specific university (university id) + added pagination
router.get('/getDepartmentsByUniversity/:universityId', async (req, res) => {
    const departmentsPerPage = 3;
    const page = parseInt(req.query.page) || 1; // value of page OR page=1
    const skip = (page - 1) * departmentsPerPage;

    const universityId = req.params.universityId;

    try {
      const count = await Department.countDocuments({ universityID: universityId }); // count of universities
      const pageCount = Math.ceil(count / departmentsPerPage); // Math.ceil to round up to the nearest integer

      const departments = await Department.find({ universityID: universityId })
        .skip(skip)
        .limit(departmentsPerPage);
      
        res.json({
            pagination: {
                count, // total number of departments
                pageCount, // total number of pages
                currentPage: page  // current page
            },
            departments: departments // array
        });
    } 
    catch (error) {
      res.status(500).json({ message: error.message });
    }
});


//Get by ID Method
router.get('/getOneDepartment/:id', async (req, res) => {
    try{
        const department = await Department.findById(req.params.id);
        res.json(department)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Update by ID Method
router.patch('/updateDepartment/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedDepartment = req.body;
        const options = { new: true }; 
        const result = await Department.findByIdAndUpdate(
            id, updatedDepartment, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/deleteDepartment/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const department = await Department.findByIdAndDelete(id)
        res.send(`Document with ${department.departmentName} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})


//----------------------------------------------------------------------
//For review.js
//Post Method
router.post('/postReview', async (req, res) => {
     // Check if a review from this academicEmail already exists (To make only 1 review)
     const existingReview = await Review.findOne({ academicEmail: req.body.academicEmail });
     if (existingReview) {
         return res.status(409).json({ message: "You've already submitted a review" }); // 409 for conflict
     }
    const review = new Review({
        overall: req.body.overall,
        facilities: req.body.facilities,
        accommodationFoodServices: req.body.accommodationFoodServices,
        professors: req.body.professors,
        universityClubs: req.body.universityClubs,
        studentLife: req.body.studentLife,
        careerProspects: req.body.careerProspects,
        academicEmail: req.body.academicEmail,
        universityID: req.body.universityID,
        departmentID: req.body.departmentID
    });
    try {
        const savedReview = await review.save();

        await calculateAverageDepartmentRating(req.body.departmentID); // req.body, because of posting
        res.status(200).json({
            review: savedReview,
            message: 'Review added successfully'
        });
    }
    catch (error) {
        res.status(400).json({message: error.message});
    }
});

//Get all Method
router.get('/getAllReviews', async (req, res) => {
    try{
        const review = await Review.find();
        res.json(review)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by ID Method
router.get('/getOneReview/:id', async (req, res) => {
    try{
        const review = await Review.findById(req.params.id);
        res.json(review)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get all the reviews for a specific department
router.get('/getReviewsByDepartment/:departmentId', async (req, res) => {
    try {
        const departmentId = req.params.departmentId;
        const reviews = await Review.find({ departmentID: departmentId });

        // Check if there are no reviews
        if (reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this department.' }); //404 if not exists
        }

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Update by ID Method
router.patch('/updateReview/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedReview = req.body;
        const options = { new: true };
        const result = await Review.findByIdAndUpdate(
            id, updatedReview, options
        )
        
        await calculateAverageDepartmentRating(result.departmentID); // result, because updating
        res.status(200).json({
            review: result,
            message: 'Review updated successfully'
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/deleteReview/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const review = await Review.findById(id);
        // I save the departmentID to use it later for the average ratings.
        const departmentId = review.departmentID;
        await Review.findByIdAndDelete(id);

        await calculateAverageDepartmentRating(departmentId);
        res.json({ message: `The review has been deleted.` });
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})