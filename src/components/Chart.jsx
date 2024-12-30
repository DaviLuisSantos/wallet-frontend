import React, { useEffect } from 'react';
import { Line, Bar, Pie, Doughnut, PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

// Register the components and plugins with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const ChartComponent = ({ type = 'line', data, options }) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('chartjs-plugin-zoom').then((zoomPlugin) => {
        ChartJS.register(zoomPlugin.default);
      });
    }
  }, []);

  // Map the chart types to the corresponding components
  const chartTypes = {
    line: Line,
    bar: Bar,
    pie: Pie,
    doughnut: Doughnut,
    polarArea: PolarArea,
  };

  // Select the chart component based on the type
  const Chart = chartTypes[type] || Line;

  return <Chart data={data} options={options} />;
};

export default ChartComponent;