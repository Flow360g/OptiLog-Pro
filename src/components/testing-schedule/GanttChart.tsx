import { useEffect, useRef } from 'react';
import { Test } from './types';

declare global {
  interface Window {
    google: typeof google;
  }
}

interface GanttChartProps {
  tests: Test[];
}

export const GanttChart = ({ tests }: GanttChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the Google Charts library
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/charts/loader.js';
    script.async = true;
    script.onload = () => {
      window.google.charts.load('current', { packages: ['gantt'] });
      window.google.charts.setOnLoadCallback(drawChart);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const drawChart = () => {
    if (!chartRef.current || !tests.length) return;

    const data = new window.google.visualization.DataTable();
    data.addColumn('string', 'Task ID');
    data.addColumn('string', 'Task Name');
    data.addColumn('string', 'Resource');
    data.addColumn('date', 'Start Date');
    data.addColumn('date', 'End Date');
    data.addColumn('number', 'Duration');
    data.addColumn('number', 'Percent Complete');
    data.addColumn('string', 'Dependencies');

    const rows = tests
      .filter(test => test.start_date && test.end_date)
      .map(test => [
        test.id,
        test.name,
        test.client,
        new Date(test.start_date!),
        new Date(test.end_date!),
        null,
        test.status === 'completed' ? 100 : test.status === 'in_progress' ? 50 : 0,
        null
      ]);

    data.addRows(rows);

    const options: google.visualization.GanttChartOptions = {
      height: 400,
      gantt: {
        trackHeight: 30,
        labelStyle: {
          fontName: 'Inter',
          fontSize: 12,
          color: '#333'
        },
        palette: [
          {
            "color": "#9b87f5",
            "dark": "#7E69AB",
            "light": "#BFB3F7"
          }
        ]
      }
    };

    const chart = new window.google.visualization.Gantt(chartRef.current);
    chart.draw(data, options);
  };

  useEffect(() => {
    if (window.google?.visualization) {
      drawChart();
    }
  }, [tests]);

  return (
    <div 
      ref={chartRef} 
      className="w-full min-h-[400px] bg-white rounded-lg border border-gray-200 p-4"
    />
  );
};