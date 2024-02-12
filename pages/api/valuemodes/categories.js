// Import your data or logic for fetching data
import data from './valuemodes.json'; // Adjust the path as necessary

export default function handler(req, res) {
  if (req.headers.authorization === "authToken") {
    const categoriesData = Object.keys(data).map(key => ({
      label: key, // The key itself is used as the label
      name: key, // The key is also the name of the category
      description: data[key].description // Directly access the description property
    }));
    res.status(200).json(categoriesData);
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}