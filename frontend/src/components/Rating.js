import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'; // Google Maps components
import './Rating.css'; // Import your custom CSS

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const Rating = () => {
  const locationState = useLocation();
  const navigate = useNavigate();

  const { location: initialLocation, category: initialCategory, subCategory: initialSubCategory, score: initialScore, factors: initialFactors } = locationState.state || {};

  const [newLocation, setNewLocation] = useState(initialLocation || '');
  const [newCategory, setNewCategory] = useState(initialCategory || '');
  const [newSubCategory, setNewSubCategory] = useState(initialSubCategory || '');
  const [score, setScore] = useState(initialScore || 'Loading...');
  const [factors, setFactors] = useState(initialFactors || ['Loading...', 'Loading...', 'Loading...', 'Loading...']);
  const [restaurants, setRestaurants] = useState([]); // To store restaurant data from Places API

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Make sure to set this in your .env file
    libraries: ['places'], // Include the places library for Places API
  });

  // Fetch American restaurants if the subCategory is "American"
  useEffect(() => {
    if (newSubCategory === 'American') {
      const [city, state] = newLocation.split(',').map(part => part.trim());
      fetchAmericanRestaurants(city, state); // Fetch restaurants if "American" is selected
    }
  }, [newSubCategory, newLocation]);

  // Function to fetch American restaurants using the Google Places API
  const fetchAmericanRestaurants = async (city, state) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=American+restaurants+in+${city},${state}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
      );
      setRestaurants(response.data.results); // Store the restaurant data in state
    } catch (error) {
      console.error('Error fetching American restaurants:', error);
    }
  };

  // Function to fetch coordinates (latitude, longitude) from Google Geocoding API
  const fetchCoordinates = async (location) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
      );
      
      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location;
        return { lat, lng };
      } else {
        console.error("No results found for the location");
        return { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco if no result
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return { lat: 37.7749, lng: -122.4194 }; // Default to San Francisco if error occurs
    }
  };

  // Function to render the map with markers
  const renderMap = () => (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={12}
      center={coordinates} // Use the fetched coordinates from Geocoding API
    >
      {restaurants.map((restaurant) => (
        <Marker key={restaurant.place_id} position={restaurant.geometry.location} />
      ))}
    </GoogleMap>
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const [city, state] = newLocation.split(',').map(part => part.trim());

    axios.post('http://localhost:3000/api/generate-business-score', {
      city,
      state,
      businessType: newCategory,
      cuisine: newSubCategory
    }).then(response => {
      setScore(response.data.score);
      setFactors(response.data.factors);
    }).catch(error => {
      console.error('Error fetching new score:', error);
    });

    navigate('/results', {
      state: {
        location: newLocation,
        category: newCategory,
        subCategory: newSubCategory,
      },
    });
  };
  
  const [coordinates, setCoordinates] = useState({ lat: 37.7749, lng: -122.4194 }); // Default to San Francisco

  useEffect(() => {
    if (newLocation) {
      fetchCoordinates(newLocation).then((coords) => {
        setCoordinates(coords); // Update the map's center based on the coordinates
      });
    }
  }, [newLocation]);

  useEffect(() => {
    if (initialLocation && !initialScore) {
      const [city, state] = initialLocation.split(',').map(part => part.trim());
      fetchBusinessScore(city, state, initialCategory, initialSubCategory);
    }
  }, [initialLocation, initialCategory, initialScore, initialSubCategory]);

  const fetchBusinessScore = async (city, state, businessType, subCategory) => {
    try {
      const response = await axios.post('http://localhost:3000/api/generate-business-score', {
        city,
        state,
        businessType,
        cuisine: subCategory,
      });

      const { score, factors } = response.data;
      setScore(score);
      setFactors(factors);
    } catch (error) {
      console.error('Error fetching business score:', error);
    }
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
    if (!location || typeof location !== 'string' || !location.includes(',')) return ''; // Prevent errors if location is undefined or improperly formatted
    const [city, state] = location.split(',').map(part => part.trim());
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
        {/* Left side: Map display */}
        <div className="map-container">
          <h3>Map of American Restaurants</h3>
          {isLoaded ? renderMap() : <div>Loading Map...</div>}
        </div>

        {/* Right side: Rating overview */}
        <div className="rating-container">
          <h3>
            Overall Rating for {getArticle(newSubCategory)} {capitalizeWords(newSubCategory)} {formatCategory(newCategory)} in {formatLocation(newLocation)}
          </h3>
          <div className="rating-overall">
            <h4>{score !== null ? score : 'Loading...'}</h4>
          </div>

          {/* Four rating factors */}
          <div className="rating-factors">
            <div className="rating-factor">
              <h5>Competition</h5>
              <p>{factors[1]}</p>
            </div>
            <div className="rating-factor">
              <h5>Popular Establishments</h5>
              <p>{factors[3]}</p>
            </div>
            <div className="rating-factor">
              <h5>Demographics</h5>
              <p>{factors[5]}</p>
            </div>
            <div className="rating-factor">
              <h5>Socio-economic Conditions</h5>
              <p>{factors[7]}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rating;
