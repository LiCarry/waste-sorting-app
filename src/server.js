const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const trashData = {
  Paper: [
    { name: 'Toilet Paper', category: 'Non-recyclable' },
    { name: 'Newspaper', category: 'Recyclable' },
    { name: 'Candy Paper', category: 'Non-recyclable' },
    { name: 'Paper Carton', category: 'Recyclable' },
  ],
  Battery: [
    { name: 'Dry Battery', category: 'Hazardous Waste' },
    { name: 'Li-ion Battery', category: 'Hazardous Waste' },
    { name: 'Lead-acid Battery', category: 'Hazardous Waste' },
  ],
  Glass: [
    { name: 'Broken Glass', category: 'Non-recyclable' },
    { name: 'Glass Bottle', category: 'Recyclable' },
  ],
  Medicine: [
    { name: 'Expired Medicine', category: 'Hazardous Waste' },
  ],
  'Packing & Parcel': [
    { name: 'Plastic Wrap', category: 'Non-recyclable' },
    { name: 'Cardboard Box', category: 'Recyclable' },
  ],
  Clothing: [
    { name: 'Old Clothes', category: 'Recyclable' },
  ],
  'Kitchen & Food': [
    { name: 'Food Waste', category: 'Organic Waste' },
    { name: 'Eggshells', category: 'Organic Waste' },
  ],
  'Hygiene Product': [
    { name: 'Used Tissue', category: 'Non-recyclable' },
    { name: 'Diapers', category: 'Non-recyclable' },
  ],
};

// 获取大类
app.get('/api/categories', (req, res) => {
  res.json(Object.keys(trashData));
});

// 获取指定大类的子类
app.get('/api/categories/:category', (req, res) => {
  const category = req.params.category;
  if (trashData[category]) {
    res.json(trashData[category]);
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
