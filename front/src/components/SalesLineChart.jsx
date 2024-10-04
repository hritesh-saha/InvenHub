// src/components/SalesLineChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, Title);

const SalesLineChart = ({ salesData }) => {
  const data = {
    labels: salesData.map(item => item.name), // Assuming each product has a name
    datasets: [
      {
        label: 'Sales',
        data: salesData.map(item => item.sales), // Assuming each product has a sales property
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default SalesLineChart;
