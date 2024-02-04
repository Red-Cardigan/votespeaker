// Import your data or logic for fetching data
import data from './mosaics.json'; // Adjust the path as necessary

export default function handler(req, res) {
  if (req.headers.authorization === "authToken") {
    const categoriesData = Object.keys(data).map(key => ({
      label: key,
      name: data[key][0].Name,
      description: data[key][0].Description
    }));
    res.status(200).json(categoriesData);
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}