import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [categories, setCategories] = useState([]); // 大类
  const [subcategories, setSubcategories] = useState([]); // 子类
  const [activeCategory, setActiveCategory] = useState(null); // 当前激活的大类

  // 获取大类
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // 处理类别点击事件
  const handleCategoryClick = async (category) => {
    if (activeCategory === category) {
      // 如果点击的是当前激活的大类，则收回下拉菜单
      setActiveCategory(null);
      setSubcategories([]);
    } else {
      // 如果点击的是其他大类，则加载该类的子类并展开
      try {
        const response = await axios.get(
          `/api/categories/${category}`
        );
        setSubcategories(response.data);
        setActiveCategory(category);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="container">
      <h1>Trash Classification</h1>
      <ul className="category-list">
        {categories.map((category, index) => (
          <li key={index} className="category-item">
            <button
              onClick={() => handleCategoryClick(category)}
              className={`category-button ${
                activeCategory === category ? 'active' : ''
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
    </div>
  );
};

export default App;
