
import { useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface MoodData {
  date: Date;
  mood: number;
  anxiety: number;
  stress: number;
}

interface MoodChartProps {
  moodData: MoodData[];
}

export function MoodChart({ moodData }: MoodChartProps) {
  // Format data for the chart
  const chartData = moodData.map(item => ({
    date: item.date.toLocaleDateString(),
    mood: item.mood,
    anxiety: item.anxiety,
    stress: item.stress
  }));
  
  // For smaller screens, reduce the number of data points shown
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const displayData = screenWidth < 768 && chartData.length > 10 
    ? chartData.slice(-10) // Show only the last 10 data points on mobile
    : chartData;

  // Custom tooltip to improve readability
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded shadow-sm text-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={displayData}
        margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
      >
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 10 }} 
          tickFormatter={(value) => {
            // Show fewer ticks on smaller screens
            if (screenWidth < 768) {
              return '';
            }
            // For the last 7 entries, format as day of week
            const date = new Date(value);
            return date.toLocaleDateString(undefined, { weekday: 'short' });
          }}
        />
        <YAxis 
          domain={[0, 100]} 
          tick={{ fontSize: 10 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="mood" 
          stroke="#3b82f6" 
          strokeWidth={2} 
          dot={{ r: 2 }}
          activeDot={{ r: 4 }}
          name="Mood"
        />
        <Line 
          type="monotone" 
          dataKey="anxiety" 
          stroke="#ef4444" 
          strokeWidth={2} 
          dot={{ r: 2 }}
          activeDot={{ r: 4 }}
          name="Anxiety"
        />
        <Line 
          type="monotone" 
          dataKey="stress" 
          stroke="#eab308" 
          strokeWidth={2} 
          dot={{ r: 2 }}
          activeDot={{ r: 4 }}
          name="Stress"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
