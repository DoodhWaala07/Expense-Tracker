import './pieChart.css'
import { useEffect, useRef, useState } from 'react'
import { Chart, PieController, ArcElement, Legend, Tooltip, Title } from 'chart.js'

Chart.register(PieController, ArcElement, Legend, Tooltip, Title);

function generateColors(numColors) {
      const colors = [];
      for (let i = 0; i < numColors; i++) {
        // Generate random color using HSL for a well-distributed range of colors
        const hue = Math.floor((i / numColors) * 360);
        colors.push(`hsl(${hue}, 70%, 50%)`); // Adjust saturation and lightness for better color contrast
      }
      return colors;
    }

function formatData(data) {
    let labels = []
    let values = []
    console.log(data)
    if(data){
        data.map(category => {
            labels.push(category.Name + ' (' + Math.floor(category.Total) + ')')
            values.push(category.Total)
        })
    }

    return {
        labels: labels,
        datasets: [{
            data: values,
            backgroundColor: generateColors(values.length)
        }]
    }
}


export default function PieChart({data, title}) {

    const canvasRef = useRef(null)
    // const [chart, setChart] = useState(null)
    const chart = useRef()

    // const data = {
    //     labels: ['Category A', 'Category B', 'Category C', 'Category D'],
    //     datasets: [{
    //       data: [60, 15, 40, 5], // The values for each slice
    //       backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'], // Colors for each slice
    //     }]
    //   };
    

    const pieData = formatData(data)
    console.log(pieData)
  
    const pieConfig = {
        type: 'pie', // Specify pie chart type
        data: pieData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right', // Position the legend
            },
            tooltip: {
              enabled: true, // Enable tooltips
            },
            title: {
                display: true,
                text: title,
                
                font: {
                    size: 24,
                    weight: 'bold' // Optional: bold font
                },
                position: 'top',
            },
          }
        }
      };

    useEffect(() => {
        const canvas = canvasRef.current
        if(canvas === null) return
        const ctx = canvas.getContext('2d')
        if(chart.current) {
            chart.current.destroy()
        }

        chart.current = new Chart(ctx, pieConfig)
        // setChart(new Chart(ctx, pieConfig))
    }, [data])

    return (
        data.length > 0 && <div className='pc-wrapper'>
            {console.log('RENDERING PIE CHART')}
            <canvas className='pc-canvas' ref={canvasRef}></canvas>
        </div>
    )
}