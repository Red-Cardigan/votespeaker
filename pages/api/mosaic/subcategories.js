import data from './mosaics.json';

export default function handler(req, res) {
  // Check if the request is authorized
  if (req.headers.authorization !== "authToken") {
    // If the request is not authorized, return a 401 error
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Extract the label from query parameters
  const { label } = req.query;
  const subcategoriesData = getSubcategoriesData(label, data);

  // Check if subcategoriesData is not empty or does not contain an error
  if (!subcategoriesData || subcategoriesData.error || subcategoriesData.length === 0) {
    return res.status(404).json({ error: 'Not Found' });
  }

  // If everything is okay, return the subcategories data
  res.status(200).json(subcategoriesData);
}

function getSubcategoriesData(label, data) {
  // Assuming data structure where `data` is an object with category labels as keys
  const categoryData = data[label];
  if (!categoryData) {
    return { error: 'Category not found' }; // Return an error object or similar response
  }
  
  // Check if there are more than two items in the category
  if (categoryData.length > 2) {
    // Slice the array to get all items after the second one
    const itemsAfterSecond = categoryData.slice(2);
    // Map over these items to extract the Name and Description
    const subcategoriesInfo = itemsAfterSecond.map(item => ({
      Name: item.Name,
      Description: item.Description
    }));
    return subcategoriesInfo;
  } else {
    return []; // Return an empty array if there are not more than two items
  }
}