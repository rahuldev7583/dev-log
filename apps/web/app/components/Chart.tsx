'use client';
import { useEffect, useRef } from 'react';

import Chart from 'chart.js/auto';

interface WeeklyChartProps {
  labels?: string[];
  data?: number[];
  total?: string;
  title?: string;
}

export const WeeklyCodingHoursChart: React.FC<WeeklyChartProps> = ({
  labels = [
    'Mar 23',
    'Mar 24',
    'Mar 25',
    'Mar 26',
    'Mar 27',
    'Mar 28',
    'Mar 29',
  ],
  data = [4.1, 6.8, 3.9, 8.2, 5.4, 7.9, 6.3],
  total = '42h 36m',
  title = 'Weekly Coding Hours',
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Coding hours',
            data,
            borderColor: '#00f5a0',
            backgroundColor: 'rgba(0, 245, 160, 0.12)',
            borderWidth: 4,
            tension: 0.4,
            fill: true,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            grid: { color: '#27272a' },
            ticks: { color: '#a1a1aa', stepSize: 2 },
          },
          x: {
            grid: { color: '#27272a' },
            ticks: { color: '#a1a1aa' },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [labels, data]);

  return (
    <div className='bg-zinc-900 rounded-3xl p-6'>
      <div className='flex justify-between items-baseline mb-4'>
        <h4 className='font-semibold text-lg'>{title}</h4>
        <span className='text-emerald-400 font-mono text-sm'>{total}</span>
      </div>
      <div className='chart-container h-full w-full relative'>
        <canvas ref={chartRef} className='w-full h-full' />
      </div>
    </div>
  );
};

interface BranchChartProps {
  labels?: string[];
  data?: number[];
  title?: string;
}

export const TimePerBranchChart: React.FC<BranchChartProps> = ({
  labels = [
    'main',
    'feature/auth-flow',
    'bugfix/mobile',
    'release/v2',
    'feature/new-ui',
  ],
  data = [21.4, 12.8, 6.3, 4.1, 8.9],
  title = 'Time per Git Branch',
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Hours',
            data,
            backgroundColor: '#00f5a0',
            borderRadius: 8,
            barThickness: 32,
          },
        ],
      },
      options: {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { color: '#27272a' },
            ticks: { color: '#a1a1aa' },
          },
          y: {
            grid: { color: '#27272a' },
            ticks: { color: '#a1a1aa', font: { family: 'monospace' } },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [labels, data]);

  return (
    <div className='bg-zinc-900 rounded-3xl p-6'>
      <h4 className='font-semibold text-lg mb-4'>{title}</h4>
      <div className='chart-container h-80 relative'>
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

interface LanguageChartProps {
  labels?: string[];
  data?: number[];
  colors?: string[];
  title?: string;
}

export const TimeByLanguageChart: React.FC<LanguageChartProps> = ({
  labels = ['TypeScript', 'Python', 'Rust', 'React/TSX', 'Go'],
  data = [42, 27, 16, 11, 4],
  colors = ['#3178C6', '#FFD43B', '#DEA584', '#61DAFB', '#00f5a0'],
  title = 'Time by Language • Last 30 days',
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = new Chart(chartRef.current, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors,
            borderColor: '#18181b',
            borderWidth: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '78%',
        plugins: { legend: { display: false } },
      },
    });

    return () => chart.destroy();
  }, [labels, data, colors]);
  const total = data.reduce((a, b) => a + b, 0);

  return (
    <div className='bg-zinc-900 rounded-3xl pl-20 pt-6 pr-6 pb-6'>
      <h4 className='font-semibold text-lg mb-6'>{title}</h4>
      <div className='flex flex-col md:flex-row items-center gap-8'>
        <div className='chart-container w-72 h-72 relative flex-shrink-0'>
          <canvas ref={chartRef} />
        </div>

        <div className='flex-1 space-y-5'>
          {labels.map((lang, i) => (
            <div key={lang} className='flex items-center gap-x-3'>
              <span
                className='w-4 h-4 rounded'
                style={{ backgroundColor: colors[i] }}
              />
              <span className='font-mono flex-1'>{lang}</span>
              <span className='ml-auto font-semibold'>
                {data && data[i] && ((data[i] / total) * 100).toFixed(1)}%
              </span>
              <span className='font-mono text-zinc-400 text-sm'>
                {data && data[i] && data[i].toFixed(1)}h
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
