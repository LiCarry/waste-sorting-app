import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Statistics from "./Statistics";

const App = () => {
  const [categories, setCategories] = useState([]); // 大类
  const [subcategories, setSubcategories] = useState([]); // 子类
  const [activeCategory, setActiveCategory] = useState(null); // 当前激活的大类
  const [activeInfo, setActiveInfo] = useState(null); // 当前激活的垃圾桶说明条目

  // 垃圾桶说明内容
  const infoItems = [
    {
      title: "Trash Can Introduction",
      content: `
        <strong>RECYCLABLE (Déchets recyclables):</strong>
        <p>Corresponds to the aforementioned recyclables. Used for resources such as:</p>
        <ul>
          <li>Paper: Newspaper, cardboard, and packaging paper.</li>
          <li>Plastic: Plastic bottles, containers (clean and free of oil).</li>
          <li>Metal: Aluminum cans, tin cans.</li>
          <li>Glass: Glass bottles and other clean glass items.</li>
        </ul>
        
        <strong>ORGANIC (Déchets organiques):</strong>
        <p>Corresponds to food waste (wet waste). Used for storing organic waste such as:</p>
        <ul>
          <li>Food scraps: Leftovers, fruit peels.</li>
          <li>Bones, shells, and leaves.</li>
        </ul>
        
        <strong>OTHER WASTE (Déchets résiduels):</strong>
        <p>Corresponds to other garbage (dry waste) that is difficult to recycle, such as:</p>
        <ul>
          <li>Cigarette butts, dust, used tissues.</li>
          <li>Broken ceramics, polluted plastics.</li>
        </ul>
        
        <strong>HAZARDOUS (Déchets dangereux):</strong>
        <p>Corresponds to hazardous waste, requiring special handling. Examples include:</p>
        <ul>
          <li>Used batteries, lamps.</li>
          <li>Medicines, chemical waste.</li>
        </ul>
      `,
    },
  ];

  // 获取大类
  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryClick = async (category) => {
    if (activeCategory === category) {
      setActiveCategory(null);
      setSubcategories([]);
    } else {
      try {
        const response = await axios.get(`/api/categories/${category}`);
        setSubcategories(response.data);
        setActiveCategory(category);

        // 记录统计信息
        await axios.post("/api/log", {
          item: category,
          category: "Main Category",
        });
      } catch (error) {
        console.error(
          "Error fetching subcategories or logging category:",
          error
        );
      }
    }
  };

  const handleInfoClick = (index) => {
    if (activeInfo === index) {
      setActiveInfo(null); // 收回当前展开条目
    } else {
      setActiveInfo(index); // 展开当前条目
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Router>
      <div className="container">
        <Routes>
          {/* 首页 */}
          <Route
            path="/"
            element={
              <>
                <h1>Waste Sorting Guider - Assistant au tri des déchets</h1>
                <div className="info-section">
                  {infoItems.map((item, index) => (
                    <div key={index} className="info-item">
                      <button
                        onClick={() => handleInfoClick(index)}
                        className={`info-button ${
                          activeInfo === index ? "active" : ""
                        }`}
                      >
                        {item.title}
                      </button>
                      {activeInfo === index && (
                        <div className="info-content">
                          <div
                            dangerouslySetInnerHTML={{ __html: item.content }}
                          />
                          <img src="/1.jpg" alt="Trash Bin Example" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <Link to="/statistics">
                  <button className="stats-button">View Statistics</button>
                </Link>
                <ul className="category-list">
                  {categories.map((category, index) => (
                    <li key={index} className="category-item">
                      <button
                        onClick={() => handleCategoryClick(category)}
                        className={`category-button ${
                          activeCategory === category ? "active" : ""
                        }`}
                      >
                        {category}
                      </button>
                      {activeCategory === category && (
                        <ul className="subcategory-list">
                          {subcategories.map((sub, subIndex) => (
                            <li key={subIndex} className="subcategory-item">
                              <strong>{sub.name}</strong> - {sub.category}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            }
          />
          {/* 统计页面 */}
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
