import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import './SearchBar.css'; // For custom styling
import { useNavigate, useLocation } from 'react-router-dom'; // Add useLocation to capture state
import axios from 'axios'; // Import axios to make API requests

const SearchBar = () => {
  const navigate = useNavigate();
  const locationState = useLocation(); // Get location state when navigating
  const { city: initialCity = '', state: initialState = '', category: initialCategory = '', subCategory: initialSubCategory = '' } = locationState.state || {};

  // Initialize state with values from navigation or set defaults
  const [location, setLocation] = useState(`${initialCity}, ${initialState}` || ''); 
  const [category, setCategory] = useState(initialCategory || ''); 
  const [subCategory, setSubCategory] = useState(initialSubCategory || '');

  const restaurantOptions = [
    'African', 'American', 'Chinese', 'Indian', 'Italian', 'Japanese', 'Korean', 'Mediterranean', 'Mexican', 'Middle Eastern', 'Thai'
  ];

  const boutiqueOptions = [
    'Cafe/Bakery', 'Fashion/Apparel Retail', 'Grocery/Convenience', 'Health/Wellness'
  ];

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Split location into city and state
    const [city, state] = location.split(',').map(part => part.trim());

    try {
      // Send a POST request to your backend API
      const response = await axios.post('http://localhost:3000/api/generate-business-score', {
        city,
        state,
        businessType: category,
        cuisine: subCategory // If it's a restaurant, pass the cuisine
      });

      // Navigate to the results page and pass the response data as state
      navigate('/results', {
        state: {
          city,
          state,
          category,
          subCategory,
          score: response.data.score, // Assuming OpenAI generates a score
          factors: response.data.factors // Any other relevant data returned
        }
      });
    } catch (error) {
      console.error('Error generating score:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="search-bar-form">
      <Row>
        {/* First Search Bar: Location Input */}
        <Col md={12}>
          <Form.Group>
            <Form.Label>Location (City, State)</Form.Label>
            <Form.Control 
              type="text" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              placeholder="e.g., Blacksburg, VA" 
            />
          </Form.Group>
        </Col>

        {/* Second Search Bar: Business Type (Restaurant or Boutique/Services) */}
        <Col md={12}>
          <Form.Group>
            <Form.Label>Business Type</Form.Label>
            <Form.Control 
              as="select" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}>
              <option>Select a business category</option>
              <option value="restaurant">Restaurant</option>
              <option value="boutique/services">Boutique/Services</option>
            </Form.Control>
          </Form.Group>
        </Col>

        {/* Subcategory: Show based on the selected category */}
        <Col md={12}>
          {category === 'restaurant' && (
            <Form.Group>
              <Form.Label>Restaurant Type</Form.Label>
              <Form.Control 
                as="select" 
                value={subCategory} 
                onChange={(e) => setSubCategory(e.target.value)}>
                <option>Select a restaurant type</option>
                {restaurantOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Form.Control>
            </Form.Group>
          )}

          {category === 'boutique/services' && (
            <Form.Group>
              <Form.Label>Boutique/Service Type</Form.Label>
              <Form.Control 
                as="select" 
                value={subCategory} 
                onChange={(e) => setSubCategory(e.target.value)}>
                <option>Select a boutique/service type</option>
                {boutiqueOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Form.Control>
            </Form.Group>
          )}
        </Col>
      </Row>

      <Button variant="primary" type="submit" className="search-btn">Search</Button>
    </Form>
  );
};

export default SearchBar;
