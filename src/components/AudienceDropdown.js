import React, { useState, useEffect, useRef } from 'react';
import ToneTextArea from './ToneSelectArea';

const AudienceDropdown = ({ onDemographicChange, onToneChange }) => {
  const [demographicSystem, setDemographicSystem] = useState('');
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
    if (!demographicSystem) {
      setCategories([]);
      setSubcategories([]);
      setSelectedCategory('');
      return;
    }

    const loadCategories = async () => {
      const apiPath = `/api/${demographicSystem.toLowerCase()}/categories`;
      const response = await fetch(apiPath, {
        headers: {
          'Authorization': 'authToken',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data.map(category => ({
          label: category.label,
          name: category.name,
          description: category.description
        })));
      } else {
        console.error(`Failed to fetch ${demographicSystem} categories`);
        setCategories([]);
      }
    };

    loadCategories();
    setSelectedCategory(''); // Reset selected category when demographic system changes
}, [demographicSystem]);

  const handleDemographicSystemChange = (e) => {
    setDemographicSystem(e.target.value);
  };

  const handleCategoryChange = async (e) => {
    const categoryLabel = e.target.value;
    setSelectedCategory(categoryLabel);
    const selectedCategoryObj = categories.find(category => category.label === categoryLabel);

    if (selectedCategoryObj) {
      onDemographicChange(`${selectedCategoryObj.name}: ${selectedCategoryObj.description}`);
    }

    // Only make a request for subcategories if the demographic system is "Mosaic"
    if (demographicSystem === 'Mosaic') {
      const apiPath = `/api/mosaic/subcategories?label=${categoryLabel}`;
      const response = await fetch(apiPath, {
        headers: {
          'Authorization': 'authToken',
        },
      });

      if (response.ok) {
        const subcategoriesData = await response.json();
        setSubcategories(subcategoriesData);
      } else {
        console.error(`Failed to fetch ${demographicSystem} subcategories`);
        setSubcategories([]);
      }
    } else {
      // If not "Mosaic", clear the subcategories
      setSubcategories([]);
    }
  };

  const handleSubcategoryChange = (e) => {
    onDemographicChange(e.target.value);
  };

  const combinedLabel = `${demographicSystem}:${selectedCategory}`;

  return (
    <div>
      <div className="dropdown-container">
        <label htmlFor="demographic-system">Demographic system:</label>
        <select
          id="demographic-system"
          className="dropdown"
          onChange={handleDemographicSystemChange}
          value={demographicSystem}
        >
          <option value="">Select System</option>
          <option value="Mosaic">Mosaic</option>
          <option value="MoreInCommon">More in Common</option>
          <option value="ValueModes">Value Modes</option>
        </select>
      </div>
      {demographicSystem && (
        <>
          <div className="dropdown-container">
            <label htmlFor="category">Add demographic:</label>
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
          {demographicSystem === 'Mosaic' && selectedCategory && (
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
        </>
      )}
      {selectedCategory && (
        <ToneTextArea currentLabel={combinedLabel} onToneChange={handleToneChange}/>
      )}
    </div>
  );
};

export default AudienceDropdown;