import '../styles/topic-graph.scss'
import { useEffect, useState, useRef } from 'react'
import Chart from 'chart.js/auto'

function TopicGraph({ keywords }) {
  const [topics, setTopics] = useState()
  const [chartInstance, setChartInstance] = useState()

  const chartContainer = useRef()

  useEffect(() => {
    chrome.runtime.sendMessage(
      {
        action: 'getTopics',
      },
      (response) => {
        setTopics(response.topics)
      }
    )
  }, [keywords])

  useEffect(() => {
    if (keywords && chartContainer && chartContainer.current) {
      if (chartInstance) {
        chartInstance.destroy()
      }
      let dataMap = {}

      for (let topic of topics) {
        dataMap[topic[0].term] = topic[0].probability
      }

      const data = Object.values(dataMap)
        .sort((a, b) => {
          return a - b
        })
        .reverse()
        .slice(0, 5)

      const labels = Object.keys(dataMap)
        .sort((a, b) => {
          return dataMap[a] - dataMap[b]
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
                  return `rgb(${255 - val}, 255, ${255 - val})`
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
    <div className="topic-graph flex flex-column align-center justify-center">
      {keywords && keywords.length > 0 && <canvas ref={chartContainer} />}
      {!keywords || (keywords.length === 0 && <div>No data to show</div>)}
      {keywords && keywords.length > 0 && (
        <h2 className="topic-graph__title">Your top topics</h2>
      )}
    </div>
  )
}

export default TopicGraph
