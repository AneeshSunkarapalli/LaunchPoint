import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API calls
import './Rating.css'; // Import your custom CSS

const Rating = () => {
  const locationState = useLocation();
  const navigate = useNavigate();

  const { location: initialLocation, category: initialCategory, subCategory: initialSubCategory } = locationState.state || {};

  const [newLocation, setNewLocation] = useState(initialLocation || '');
  const [newCategory, setNewCategory] = useState(initialCategory || '');
  const [newSubCategory, setNewSubCategory] = useState(initialSubCategory || '');
  const [collegeRating, setCollegeRating] = useState(null); // State for the college rating

  const [submittedLocation, setSubmittedLocation] = useState(initialLocation);
  const [submittedCategory, setSubmittedCategory] = useState(initialCategory);
  const [submittedSubCategory, setSubmittedSubCategory] = useState(initialSubCategory);

  // Fetch the college rating when the component mounts or location changes
  useEffect(() => {
    if (submittedLocation) {
      const [city, state] = submittedLocation.split(',').map(part => part.trim());
      fetchCollegeRating(city, state);
    }
  }, [submittedLocation]);

  // Function to fetch the college rating based on city and state input
  const fetchCollegeRating = async (city, state) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/best-locations`, {
        params: { city, state } // Adjust this URL if your backend is on a different port
      });
      console.log(response.data); // Check the data in console
      setCollegeRating(response.data.score); // Update the college rating in state
    } catch (error) {
      console.error('Error fetching college rating:', error);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSubmittedLocation(newLocation);
    setSubmittedCategory(newCategory);
    setSubmittedSubCategory(newSubCategory);

    // Fetch the college rating for the new location
    const [city, state] = newLocation.split(',').map(part => part.trim());
    fetchCollegeRating(city, state);

    navigate('/results', {
      state: {
        location: newLocation,
        category: newCategory,
        subCategory: newSubCategory,
      },
    });
  };

  const getArticle = (subCategory) => {
    if (!subCategory) return 'a';
    const firstLetter = subCategory[0].toLowerCase();
    return ['a', 'e', 'i', 'o', 'u'].includes(firstLetter) ? 'an' : 'a';
  };

  const capitalizeWords = (str) => {
    if (!str) return '';
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatCategory = (category) => {
    if (category === 'boutique/services') {
      return 'Boutique/Services'; // Capitalize 'Services'
    }
    return capitalizeWords(category); // Capitalize other categories as needed
  };

  const formatLocation = (location) => {
    if (!location) return '';
    const [city, state] = location.split(',');
    return `${capitalizeWords(city)}, ${state.trim().toUpperCase()}`;
  };

  const restaurantOptions = ['African', 'American', 'Chinese', 'Indian', 'Italian', 'Japanese', 'Korean', 'Mediterranean', 'Mexican', 'Middle Eastern', 'Thai'];
  const boutiqueOptions = ['Cafe/Bakery', 'Fashion/Apparel Retail', 'Grocery/Convenience', 'Health/Wellness'];

  return (
    <div className="results-page">
      <div className="search-bar-results">
        {/* Results Page Search Bar */}
        <form className="business-type" onSubmit={handleSearchSubmit}>
          <input 
            type="text"
            placeholder="Location (City, State)"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
          />
          <select 
            value={newCategory}
            onChange={(e) => {
              setNewCategory(e.target.value);
              setNewSubCategory(''); // Reset subcategory when category changes
            }}
          >
            <option value="">Select Business Type</option>
            <option value="restaurant">Restaurant</option>
            <option value="boutique/services">Boutique/Services</option>
          </select>

          {newCategory === 'restaurant' && (
            <select value={newSubCategory} onChange={(e) => setNewSubCategory(e.target.value)}>
              <option value="">Select Restaurant Type</option>
              {restaurantOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
          {newCategory === 'boutique/services' && (
            <select value={newSubCategory} onChange={(e) => setNewSubCategory(e.target.value)}>
              <option value="">Select Boutique/Service Type</option>
              {boutiqueOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
          <button type="submit">Search</button>
        </form>
      </div>

      {/* Main content area */}
      <div className="results-content">
        {/* Left side: Map placeholder */}
        <div className="map-container">
          <h3>Map Placeholder</h3>
          <div className="map-placeholder"></div>
        </div>

        {/* Right side: Rating overview */}
        <div className="rating-container">
          <h3>
            Overall Rating for {getArticle(submittedSubCategory)} {capitalizeWords(submittedSubCategory)} {formatCategory(submittedCategory)} in {formatLocation(submittedLocation)}
          </h3>
          <div className="rating-overall">
            <h4>85/100</h4>
          </div>

          {/* Four rating factors */}
          <div className="rating-factors">
            <div className="rating-factor">
              <h5>Competition</h5>
              <p>Description</p>
            </div>
            <div className="rating-factor">
              <h5>Popular Establishments</h5>
              <p>Description</p>
            </div>
            <div className="rating-factor">
              <h5>Demographics</h5>
              <p>Description</p>
            </div>
            <div className="rating-factor">
              <h5>Socio-economic Conditions</h5>
              <p>Score: {collegeRating !== null ? collegeRating : 'Loading...'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rating;
