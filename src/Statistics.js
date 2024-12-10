import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(
  ArcElement, // 用于饼图
  Tooltip,
  Legend,
  CategoryScale, // 用于柱状图
  LinearScale,
  BarElement
);


const Statistics = () => {
  const [stats, setStats] = useState([]); // 用户查询统计数据

  // 获取统计数据
  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // 数据准备：饼图 & 柱状图
  const pieData = {
    labels: stats.map((stat) => stat.item),
    datasets: [
      {
        label: 'Queries',
        data: stats.map((stat) => stat.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: stats.map((stat) => stat.item),
    datasets: [
      {
        label: 'click times of user',
        data: stats.map((stat) => stat.count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h1>Statistics</h1>
      <div className="charts">
        <div className="chart">
          <h3>The propotion of frequency about people check good's class</h3>
          <Pie data={pieData} />
        </div>
        <div className="chart">
          <h3>The number of frequency about people check good's class</h3>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
