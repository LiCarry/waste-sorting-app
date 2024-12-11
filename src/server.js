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
      category: "Non-recyclable: Flush toilet paper down the toilet, please.",
    },
    { name: "Newspaper", category: "Recyclable" },
    {
      name: "Candy Paper (Papier Bonbon)",
      category: "Non-recyclable - Other Waste",
    },
    { name: "Paper Carton (Carton de Papier)", category: "Recyclable" },
    {
      name: "Tetra Pak",
      category:
        "Recyclable - Empty the liquid from the package completely, then clean the package thoroughly",
    },
  ],
  "Battery (Batterie)": [
    {
      name: "Dry Battery (Pile Sèche)",
      category: "Non-recyclable - Other Waste",
    },
    {
      name: "Li-ion Battery (Batterie Li-ion)",
      category:
        "Non-recyclable - Hazardous Waste: return my used batteries and light bulbs to supermarkets or shops.",
    },
    {
      name: "Car Battery (Batterie de Voiture)",
      category:
        "Non-recyclable - Hazardous Waste: return my used batteries and light bulbs to supermarkets or shops.",
    },
  ],
  "Glass (Verre)": [
    {
      name: "Broken Glass (Verre Cassé)",
      category: "Non-recyclable - Other Waste",
    },
    {
      name: "Glass Bottle (Bouteille en Verre)",
      category: "Recyclable: Clean the before through it",
    },
  ],
  "Medicine (Médicament)": [
    {
      name: "Expired Medicine (Médicament Périmé)",
      category:
        "Non-recyclable - Hazardous Waste: Takes the medicines back to the pharmacy.",
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
    {
      name: "Old Clothes (Vieux Vêtements)",
      category:
        "Recyclable: I give away my old clothes, toys which can still be used by the association",
    },
  ],
  "Kitchen & Food (Cuisine & Aliments)": [
    {
      name: "Food Waste (Déchets Alimentaires)",
      category: "Non-recyclable - Organic Waste",
    },
    {
      name: "Eggshells (Coquilles d'Œufs)",
      category: "Non-recyclable - Organic Waste",
    },
  ],
  "Hygiene Product (Produit Hygiène)": [
    {
      name: "Used Tissue (Mouchoir Usagé)",
      category: "Non-recyclable -  Other Waste",
    },
    { name: "Diapers (Couches)", category: "Non-recyclable -  Other Waste" },
  ],
  "High Tech(High-Tech)": [
    {
      name: "Mobile Phone(Téléphone mobile)",
      category:
        "Non-recyclable - Hazardous Waste: Return the old devieces to the seller, who takes it back free of charge.",
    },
  ],
  DIY: [
    {
      name: "Used Oil",
      category:
        "I take rubble, used oil, etc. and garden waste (grass cuttings, leaves, etc.) to the waste collection centre.",
    },
    {
      name: "Garden Waste",
      category:
        "I take rubble, used oil, etc. and garden waste (grass cuttings, leaves, etc.) to the waste collection centre.",
    },
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
