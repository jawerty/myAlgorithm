import { useEffect, useState, useRef } from 'react'
import '../styles/domain-graph.scss'
import Chart from 'chart.js/auto'

function DomainGraph({ keywords }) {
  const [chartInstance, setChartInstance] = useState()
  const chartContainer = useRef()

  useEffect(() => {
    if (keywords && chartContainer && chartContainer.current) {
      if (chartInstance) {
        chartInstance.destroy()
      }
      let dataMap = {}

      keywords.forEach((keyword) => {
        Object.keys(keyword.history).forEach((sourceDomain) => {
          if (sourceDomain in dataMap) {
            dataMap[sourceDomain] += keyword.history[sourceDomain]
          } else {
            dataMap[sourceDomain] = keyword.history[sourceDomain]
          }
        })
      })

      const data = Object.values(dataMap)
        .sort((a, b) => {
          return a - b
        })
        .reverse()
        .slice(0, 5)

      const labels = Object.keys(dataMap)
        .sort((sourceDomainA, sourceDomainB) => {
          return dataMap[sourceDomainA] - dataMap[sourceDomainB]
        })
        .reverse()
        .slice(0, 5)

      const dataCopy = [...data]
      const chartData = {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [
            {
              label: '',
              data: data,
              backgroundColor: dataCopy
                .map((datum, i) => {
                  const iteration = 255 / data.length
                  const val = (i + 1) * iteration
                  return `rgb(${255 - val}, ${255 - val}, 255)`
                })
                .reverse(),
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      }
      chartContainer.current.height = '150px'
      chartContainer.current.style.maxHeight = '150px'
      chartContainer.current.width = '150px'
      setChartInstance(new Chart(chartContainer.current, chartData))
    }
  }, [keywords, chartContainer])

  return (
    <div className="domain-graph flex flex-column align-center justify-center">
      {keywords && keywords.length > 0 && <canvas ref={chartContainer} />}
      {!keywords || (keywords.length === 0 && <div>No data to show</div>)}
      {keywords && keywords.length > 0 && (
        <h2 className="domain-graph__title">
          Websites you engage with the most (by occurrence)
        </h2>
      )}
    </div>
  )
}

export default DomainGraph
