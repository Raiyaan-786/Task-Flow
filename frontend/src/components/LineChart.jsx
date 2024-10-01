import React from 'react'
import { LineChart } from '@mui/x-charts/LineChart';

const uData = [8000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 1300];
const xLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
];


const LineChartM = () => {
  return (
    <LineChart 
      // sx={{"&."}}
      series={[
        { data: pData, label: 'Last Year' },
        { data: uData, label: 'This Year' },
      ]}
      xAxis={[{ scaleType: 'point', data: xLabels }]}
    />
  )
}



export default LineChartM