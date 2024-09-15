import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import './SearchBar.css'; // For custom styling
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const SearchBar = () => {
  const [location, setLocation] = useState(''); // Location input
  const [category, setCategory] = useState(''); // Restaurant or Boutique/Services
  const [subCategory, setSubCategory] = useState(''); // Subcategories (based on category)
  const navigate = useNavigate(); // Hook for navigation

  const restaurantOptions = [
    'African', 'American', 'Chinese', 'Indian', 'Italian', 'Japanese', 'Korean', 'Mediterranean', 'Mexican', 'Middle Eastern', 'Thai'
  ];

  const boutiqueOptions = [
    'Cafe/Bakery', 'Fashion/Apparel Retail', 'Grocery/Convenience', 'Health/Wellness'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Redirect to /results page and pass the search data as state
    navigate('/results', {
      state: {
        location,
        category,
        subCategory
      }
    });
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

