// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// const trashData = {
//   'Paper (Papier)': [
//     { name: 'Toilet Paper (Papier Toilette)', category: 'Non-recyclable' },
//     { name: 'Newspaper (Journal)', category: 'Recyclable' },
//     { name: 'Candy Paper (Papier Bonbon)', category: 'Non-recyclable' },
//     { name: 'Paper Carton (Carton de Papier)', category: 'Recyclable' },
//   ],
//   'Battery (Batterie)': [
//     { name: 'Dry Battery (Pile Sèche)', category: 'Hazardous Waste' },
//     { name: 'Li-ion Battery (Batterie Li-ion)', category: 'Hazardous Waste' },
//     { name: 'Lead-acid Battery (Batterie au Plomb-acide)', category: 'Hazardous Waste' },
//   ],
//   'Glass (Verre)': [
//     { name: 'Broken Glass (Verre Cassé)', category: 'Non-recyclable' },
//     { name: 'Glass Bottle (Bouteille en Verre)', category: 'Recyclable' },
//   ],
//   'Medicine (Médicament)': [
//     { name: 'Expired Medicine (Médicament Périmé)', category: 'Hazardous Waste' },
//   ],
//   'Packing & Parcel (Emballage & Colis)': [
//     { name: 'Plastic Wrap (Film Plastique)', category: 'Non-recyclable' },
//     { name: 'Cardboard Box (Boîte en Carton)', category: 'Recyclable' },
//   ],
//   'Clothing (Vêtements)': [
//     { name: 'Old Clothes (Vieux Vêtements)', category: 'Recyclable' },
//   ],
//   'Kitchen & Food (Cuisine & Aliments)': [
//     { name: 'Food Waste (Déchets Alimentaires)', category: 'Organic Waste' },
//     { name: 'Eggshells (Coquilles d\'Œufs)', category: 'Organic Waste' },
//   ],
//   'Hygiene Product (Produit Hygiène)': [
//     { name: 'Used Tissue (Mouchoir Usagé)', category: 'Non-recyclable' },
//     { name: 'Diapers (Couches)', category: 'Non-recyclable' },
//   ],
// };

// // 用户查询统计数据
// const userStats = {}; // 用于记录每个物品的查询次数

// // 获取大类
// app.get('/api/categories', (req, res) => {
//   res.json(Object.keys(trashData));
// });

// // 获取指定大类的子类
// app.get('/api/categories/:category', (req, res) => {
//   const category = req.params.category;
//   if (trashData[category]) {
//     res.json(trashData[category]);
//   } else {
//     res.status(404).json({ error: 'Category not found' });
//   }
// });

// // 记录用户查询
// app.post('/api/log', (req, res) => {
//   const { item, category } = req.body;

//   if (!item || !category) {
//     return res.status(400).json({ error: 'Invalid request data' });
//   }

//   // 更新统计数据
//   if (!userStats[item]) {
//     userStats[item] = { item, category, count: 0 };
//   }
//   userStats[item].count++;

//   res.json({ message: 'Logged successfully' });
// });

// // 获取用户查询统计数据
// app.get('/api/stats', (req, res) => {
//   // 返回以数组形式表示的统计数据
//   const statsArray = Object.values(userStats);
//   res.json(statsArray);
// });

// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.json());

const trashData = {
  "Paper (Papier)": [
    {
      name: "Toilet Paper (Papier Toilette)",
      category: "Non-recyclable - Hygiene Waste",
    },
    { name: "Newspaper (Journal)", category: "Recyclable" },
    {
      name: "Candy Paper (Papier Bonbon)",
      category: "Non-recyclable - Other Waste",
    },
    { name: "Paper Carton (Carton de Papier)", category: "Recyclable" },
  ],
  "Battery (Batterie)": [
    {
      name: "Dry Battery (Pile Sèche)",
      category: "Hazardous Waste - Non-recyclable",
    },
    {
      name: "Li-ion Battery (Batterie Li-ion)",
      category: "Hazardous Waste - Non-recyclable",
    },
    {
      name: "Lead-acid Battery (Batterie au Plomb-acide)",
      category: "Hazardous Waste - Non-recyclable",
    },
  ],
  "Glass (Verre)": [
    {
      name: "Broken Glass (Verre Cassé)",
      category: "Non-recyclable - Other Waste",
    },
    { name: "Glass Bottle (Bouteille en Verre)", category: "Recyclable" },
  ],
  "Medicine (Médicament)": [
    {
      name: "Expired Medicine (Médicament Périmé)",
      category: "Hazardous Waste - Non-recyclable",
    },
  ],
  "Packing & Parcel (Emballage & Colis)": [
    {
      name: "Plastic Wrap (Film Plastique)",
      category: "Non-recyclable - Other Waste",
    },
    { name: "Cardboard Box (Boîte en Carton)", category: "Recyclable" },
  ],
  "Clothing (Vêtements)": [
    { name: "Old Clothes (Vieux Vêtements)", category: "Recyclable" },
  ],
  "Kitchen & Food (Cuisine & Aliments)": [
    {
      name: "Food Waste (Déchets Alimentaires)",
      category: "Organic Waste - Non-recyclable",
    },
    {
      name: "Eggshells (Coquilles d'Œufs)",
      category: "Organic Waste - Non-recyclable",
    },
  ],
  "Hygiene Product (Produit Hygiène)": [
    {
      name: "Used Tissue (Mouchoir Usagé)",
      category: "Non-recyclable - Hygiene Waste",
    },
    { name: "Diapers (Couches)", category: "Non-recyclable - Hygiene Waste" },
  ],
};

const dbPath = path.join(__dirname, "db.json");

// 读取统计数据
const readStatsFromFile = () => {
  try {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify({}));
    }
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading stats from file:", error);
    return {};
  }
};

// 写入统计数据

const writeStatsToFile = async (stats) => {
  try {
    await fs.promises.writeFile(dbPath, JSON.stringify(stats, null, 2));
  } catch (error) {
    console.error("Error writing stats to file:", error);
  }
};

// 初始化用户查询统计数据
let userStats = readStatsFromFile();

// 获取大类
app.get("/api/categories", (req, res) => {
  res.json(Object.keys(trashData));
});

// 获取指定大类的子类
app.get("/api/categories/:category", (req, res) => {
  const category = req.params.category;
  if (trashData[category]) {
    res.json(trashData[category]);
  } else {
    res.status(404).json({ error: "Category not found" });
  }
});

app.post("/api/log", async (req, res) => {
  const { item, category } = req.body;

  if (!item || !category) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  if (!userStats[item]) {
    userStats[item] = { item, category, count: 0 };
  }
  userStats[item].count++;

  // 异步写入文件
  writeStatsToFile(userStats);

  res.json({ message: "Logged successfully" });
});

// app.post('/api/log', (req, res) => {
//   const { item, category } = req.body;

//   if (!item || !category) {
//     return res.status(400).json({ error: 'Invalid request data' });
//   }

//   if (!userStats[item]) {
//     userStats[item] = { item, category, count: 0 };
//   }
//   userStats[item].count++;

//   writeStatsToFile(userStats); // 确保统计数据持久化到文件
//   res.json({ message: 'Logged successfully' });
// });

// 获取用户查询统计数据
app.get("/api/stats", (req, res) => {
  res.json(Object.values(userStats));
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
