import React, { useState, useEffect, useRef } from 'react';
import ToneTextArea from './ToneSelectArea';

const AudienceDropdown = ({ onDemographicChange, onToneChange }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTones, setSelectedTones] = useState([]);
  const nextSelectedTones = useRef(null);

  const handleToneChange = (tones) => {
    setTimeout(() => setSelectedTones(nextSelectedTones.current), 0);
    setSelectedTones(selectedTones);
    onToneChange(tones)
  };

  useEffect(() => {
    const loadMosaics = async () => {
      const response = await fetch('/api/categories', {
        headers: {
          'Authorization': 'authToken',
        },
      });
      if (response.ok) {
        const data = await response.json();
        // Adjusted to directly use the returned data without slicing
        setCategories(data.map(category => ({
          label: category.label, // Use 'label' directly
          name: category.name, // Use 'name' directly
          description: category.description // Use 'description' directly
        })));
      } else {
        console.error('Failed to fetch mosaics data');
      }
    };
  
    loadMosaics();
  }, []);

  const handleCategoryChange = async (e) => {
    const categoryLabel = e.target.value;
    setSelectedCategory(categoryLabel);
    const selectedCategoryObj = categories.find(category => category.label === categoryLabel);

    // If a category is found, pass its name and description to the parent component
    if (selectedCategoryObj) {
      onDemographicChange(`${selectedCategoryObj.name}: ${selectedCategoryObj.description}`);
    }

    // for the selected category and returns the corresponding subcategories.
    const response = await fetch(`/api/subcategories?label=${categoryLabel}`, {
      headers: {
        'Authorization': 'authToken',
      },
    });

    if (response.ok) {
      const subcategoriesData = await response.json();
      setSubcategories(subcategoriesData);
    } else {
      console.error('Failed to fetch subcategories data');
      setSubcategories([]); // Reset subcategories on error
    }
  };

  const handleSubcategoryChange = (e) => {
    onDemographicChange(e.target.value);
  };

  return (
    <div>
      <div className="dropdown-container">
        <label htmlFor="category">For demographic:</label>
        <select
          id="category"
          className="dropdown"
          onChange={handleCategoryChange}
          value={selectedCategory}
        >
          <option value="">Select Category</option>
          {categories.map((category, index) => (
            <option key={index} value={category.label}>{`${category.name}: ${category.description}`}</option>
          ))}
        </select>
      </div>
      {selectedCategory && (
        <div className="dropdown-container">
          <label htmlFor="subcategory">Select Subcategory:</label>
          <select
            id="subcategory"
            className="dropdown"
            onChange={handleSubcategoryChange}
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((sub, index) => (
              <option key={index} value={`${sub.Name}: ${sub.Description}`}>{`${sub.Name}: ${sub.Description}`}</option>
            ))}
          </select>
        </div>
      )}
      {selectedCategory && (
        <ToneTextArea currentLabel={selectedCategory} onToneChange={handleToneChange}/> // Note: Ensure `selectedCategory` is the correct prop to pass as `currentLabel`
      )}
    </div>
  );
};

export default AudienceDropdown;