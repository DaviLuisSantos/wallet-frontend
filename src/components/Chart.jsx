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

// Registrar os componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = ({ type = 'line', data, options }) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('chartjs-plugin-zoom').then((zoomPlugin) => {
        ChartJS.register(zoomPlugin.default);
      });
    }
  }, []);

  // Mapear os tipos de gráfico para os componentes correspondentes
  const chartTypes = {
    line: Line,
    bar: Bar,
    pie: Pie,
    doughnut: Doughnut,
    polarArea: PolarArea,
  };

  // Selecionar o componente de gráfico com base no tipo
  const Chart = chartTypes[type] || Line;

  return <Chart data={data} options={options} />;
};

export default ChartComponent;