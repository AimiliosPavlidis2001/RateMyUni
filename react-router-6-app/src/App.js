//client/src/app.js
import React, { useState, useEffect } from 'react';
import './App.css';
import LocationFilter from './locationFilter';
import DepartmentDetails from './pages/DepartmentDetails'; // Import the DepartmentDetails component
import LoginSignup from './pages/loginSignup';
import LoginPage from './pages/loginPage';
import SignupPage from './pages/signupPage';
import logo from './logo/ratemyuni.png'; // import logo
import CreateReview from './pages/createReview'; // import create Review
import DepartmentReviews from './pages/DepartmentReviews'; // import show department reviews
import EditReview from './pages/editReview';
// BrowserRouter as Router -> for keep Ui in sync with URL
// useParams to get the universityId
import {BrowserRouter as Router, Routes, Route, useParams, Link, useLocation, useNavigate} from 'react-router-dom'

function App() {
  const [universities, setUniversities] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [universitiesLoaded, setUniversitiesLoaded] = useState(false); // New state to track if universities are loaded
  const location = useLocation();

  // For state login and timer
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const LOGOUT_TIMER = 900000; // 15 minutes inactivity for logout

  // Prepare for logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("student"); // Clear the "student" from local storage on logout
    localStorage.removeItem('academicEmail'); // Also clear the other attributes
    localStorage.removeItem('universityID');
    localStorage.removeItem('departmentID');
    alert('You have been logged out.');
  };

  // Check if student is logged in and save him
  useEffect(() => {
    const loggedInStudent = localStorage.getItem("student");
    if (loggedInStudent) {
        setIsLoggedIn(true);
    }
  }, []);
  // For timer to logout
  useEffect(() => {
    if (isLoggedIn) {
      const timer = setTimeout(() => {
        setIsLoggedIn(false);
        alert('You have been logged out due to inactivity.');
      }, LOGOUT_TIMER);

      return () => clearTimeout(timer); // Clear the timer if the component is unmounted
    }
  }, [isLoggedIn]);


  // For the fetching of the universities + Added the option for the filters
  useEffect(() => {
    async function fetchData() {
        let endpoint = `https://ratemyuni.onrender.com/api/getAllUniversities?page=${page}`;

        // Add location to the endpoint if it's selected
        if (selectedLocation) {
            endpoint += `&sortingLocation=${selectedLocation}`; // add the selectedLocation to the endpoint
        }

        try {
            const response = await fetch(endpoint);
            const data = await response.json();

            if (Array.isArray(data.universities)) {
                setUniversities(data.universities); // update the array of universities
                setPageCount(data.pagination.pageCount); // update the pageCount (total pages)
                setUniversitiesLoaded(true); // Set universitiesLoaded to true when universities are loaded
            } else {
                setUniversities([]);
                setUniversitiesLoaded(false); // Set universitiesLoaded to false when no universities are found
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    fetchData();
  }, [selectedLocation, page]);

 // Handling the previous page
 function handlePrevious() {
  setPage((p) => (p === 1 ? p : p - 1)); // if p=1 returns p, if p!=1 it subtracts 1 from p
}

// Handling the next page
function handleNext() {
  setPage((p) => (p === pageCount ? p : p + 1)); // if p=pageCount returns p, if p!=pageCount it adds 1 to p
}

// Function to handle the location filter selection
function handleLocationFilter(sortingLocation) {
  setSelectedLocation(sortingLocation);
  setPage(1);
}

// Filter universities based on the selected location
const filteredUniversities = universities.filter(
  (university) => university.sortingLocation === selectedLocation // returns true if sortingLocation = selectedLocation
  // and false if not
);

// Display the universities based on the selected location or all universities
const universitiesToDisplay = selectedLocation ? filteredUniversities : universities; // if location is selected, then
// universitiesToDisplay will be assigned the value of filteredUniversities,
// if no location is selected then universitiesToDisplay will be assigned the value of universities

// To go back to all the universities and page=1 (used for the logo)
function handleBackToAllUniversities() {
  setSelectedLocation(''); // reset the location filter (to show all universities)
  setPage(1); // Reset the page to 1
}

return (
  <>
    <div className="header-container">
      {
        // if you are not inside the departments page, show the filters
        !location.pathname.startsWith("/getDepartmentsByUniversity") &&
        <LocationFilter onSelectLocation={handleLocationFilter} />
      }
      <div className="logo-container">
      <Link to="/" onClick={handleBackToAllUniversities}>
          <img src={logo} alt="ratemyuni" className="logo" />
        </Link>
      </div>
    </div>
    <LoginSignup />
    <div className="leave-space-university"></div>
    <div className="App">
    <div className="logged-in-message">
      {isLoggedIn && (
        <div>
          <h3>Logged In</h3>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
      <Routes>
      <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/createReview" element={<CreateReview isLoggedIn={isLoggedIn} />} />
      {/* Routes for edit review and delete review */}
      <Route path="/editReview/:reviewId" element={<EditReview isLoggedIn={isLoggedIn} />} />
        <Route path="/" element={
          <div>
            {/* Display the filtered universities */}
            {
              universitiesToDisplay.length > 0 ?
                universitiesToDisplay.map((university) => (
                  <> {/* Add children without extra nodes. To let me use leave-space-university */}
                    <div key={university._id} className="border">
                      <div className="container">
                        <div className="university">
                          <div className="university-details">
                            <h2 id="universityName">
                              <Link to={`/getDepartmentsByUniversity/${university._id}`} className="university-link">
                                {university.universityName}
                              </Link>
                            </h2>
                            <div className="info-box">
                              <div className="university-row1">
                                {/* If the AverageRating = 0 (no reviews), then show N/A. If it's not 0, then show the value of the AverageRating */}
                                <p className="row-att">Review Score: <strong id="rat">{university.universityAverageRating === 0 ? "N/A" : university.universityAverageRating}</strong></p>
                                <p className="row-att">World Ranking: {university.worldRanking}</p>
                              </div>
                              <div className="university-row2">
                                <p className="row-att">Location: {university.location}</p>
                                <p className="row-att">Founded Year: {university.universityFoundedYear}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="leave-space-university"></div>
                  </>
                ))
                : null // if no universitiesToDisplay then null
            }
          </div>
        } />
        {/* renamed the setPage to avoid conflict */}
        <Route path="/getDepartmentsByUniversity/:universityId" element={<UniversityDepartments setSelectedLocation={setSelectedLocation} resetPage={setPage} />} />
        <Route path="/departmentReviews/:departmentId" element={<DepartmentReviews isLoggedIn={isLoggedIn} />} />
      </Routes>
      <footer>
        {
          location.pathname === "/" && // this footer is used only when path is "/"
          <>
            <button disabled={page === 1} onClick={handlePrevious}>Previous</button>
            {/* If current page = total pages, then no more pages (disable the button) */}
            {/* OR If the universities are not loaded, wait for them (disable the button) */}
            <button disabled={page === pageCount || !universitiesLoaded} onClick={handleNext}>Next</button>
          </>
        }
      </footer>
      {
        location.pathname === "/" && // this leave-space-university is used only when path is "/"
        <>
          <div className="leave-space-university2"></div>
        </>
      }
    </div>
  </>
);
}

function UniversityDepartments({ setSelectedLocation, resetPage }) { // added all new parameters for the pagination (because it is separate from App)
  const { universityId } = useParams(); // to get the universityId
  const [departments, setDepartments] = useState([]); // New state for departments
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [departmentsLoaded, setDepartmentsLoaded] = useState(false);
  const navigate = useNavigate(); // to go back to the universities

  // Fetch departments based on universityId
  useEffect(() => {
    fetch(`https://ratemyuni.onrender.com/api/getDepartmentsByUniversity/${universityId}?page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.departments)) {
          setDepartments(data.departments); // update the array of departments
          setDepartmentsLoaded(true); // Set departmentsLoaded to true when departments are loaded
        } else {
          setDepartments([]);
          setDepartmentsLoaded(false); // Set departmentsLoaded to false when no departments are found
        }
        setPageCount(data.pagination.pageCount);
      })
      .catch((error) => console.error("Error:", error));
  }, [universityId, page]);

  // to scroll from the top when hitting Next or Previous buttons
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0});
  }, [page]); // it will run when the page changes


  function handlePreviousDepartment() {
    setPage(p => p === 1 ? p : p - 1);
  }

  function handleNextDepartment() {
      setPage(p => p === pageCount ? p : p + 1);
  }

  // for the button back to universities
  function handleBackToUniversities() {
    setSelectedLocation(''); // reset the location filter (to show all universities)
    resetPage(1); // Reset the page to 1
    navigate('/');
  }

  return (
    <>
      <button className="back-to-universities" onClick={handleBackToUniversities}>Back to Universities</button>
      <div className="leave-space-university"></div>

      {
        departments.map((department, index) => ( // index starts from 0 (number of department we visit)
          <DepartmentDetails key={index} department={department} />
        ))
      }
      <div className="leave-space-university"></div>
      <footer>
        <button disabled={page === 1} onClick={handlePreviousDepartment}>Previous</button>
        <button disabled={page === pageCount || !departmentsLoaded || departments.length === 0} onClick={handleNextDepartment}>Next</button>
      </footer>
    </>
  );
}

export default App;