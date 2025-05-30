import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import apiconfig from '../../apiconfig/apiConfig.js';

const barColors = [
  '#4e79a7', '#f28e2b', '#e15759', '#76b7b2',
  '#59a14f', '#edc949', '#af7aa1', '#ff9da7',
  '#9c755f', '#bab0ab', '#86bc86', '#d37295'
];

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const UserChart = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedYear = selectedDate.getFullYear().toString();
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${apiconfig.baseURL}/api/admin/users`);
        const users = response.data;

        const monthlyData = Array(12).fill(0);

        users.forEach(user => {
          const createdAt = new Date(user.createdAt);
          const year = createdAt.getFullYear();
          const month = createdAt.getMonth(); // 0-based
          if (year.toString() === selectedYear) {
            monthlyData[month]++;
          }
        });

        const formattedData = monthNames.map((month, index) => ({
          month,
          users: monthlyData[index],
        }));

        setUserData(formattedData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [selectedYear]);

  return (
    <div className="performance-container">
      <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 className="performance-title">📊 User Growth - {selectedYear}</h2>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          showYearPicker
          dateFormat="yyyy"
          className="year-select-chart"
        />
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={userData}
          margin={{ bottom: 20 }}
        >
          <CartesianGrid vertical={false} horizontal={false} />
          <XAxis
            dataKey="month"
            stroke="#d3d3d3"
            axisLine={{ stroke: '#d3d3d3', strokeWidth: 2 }}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#444' }}
            interval={0}
            label={{
              value: 'Month',
              position: 'insideBottom',
              offset: -10,
              fill: '#666',
              fontSize: 14,
            }}
          />
          <YAxis
            stroke="#d3d3d3"
            axisLine={{ stroke: '#d3d3d3', strokeWidth: 2 }}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#444' }}
            label={{
              value: 'Users',
              angle: -90,
              position: 'insideLeft',
              offset: 10,
              fill: '#666',
              fontSize: 14,
            }}
          />
          <Tooltip
            formatter={(value) => [`👤 ${value} users`, '']}
            contentStyle={{
              backgroundColor: '#fff',
              borderColor: '#ccc',
              borderRadius: '5px',
              fontSize: '14px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
            cursor={false}
          />
          <Bar dataKey="users">
            {userData.map((_, index) => (
              <Cell key={index} fill={barColors[index % barColors.length]} />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserChart;
