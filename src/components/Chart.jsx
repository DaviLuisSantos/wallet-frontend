import React from 'react';
import { Chart } from 'react-google-charts';

const ChartComponent = ({ type, data, options }) => {
  switch (type) {
    case 'line':
      return <Chart chartType="LineChart" data={data} options={options} />;
    case 'bar':
      return <Chart chartType="BarChart" data={data} options={options} />;
    case 'pie':
      return <Chart chartType="PieChart" data={data} options={options} />;
    case 'scatter':
      return <Chart chartType="ScatterChart" data={data} options={options} />;
    default:
      return <Chart chartType="PieChart" data={data} options={options} />;
  }
};

export default ChartComponent;