const colors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};

axios.get('/speed.json')
  .then(res => {
    createCanvas(res.data)
  })
  .catch(e => console.log(e))

const createCanvas = data => {
  const config = {
    type: 'line',
    data: {
      labels: data['Timestamp'],
      datasets: [{
        label: 'Download speed',
        backgroundColor: colors.red,
        borderColor: colors.red,
        data: data['Download'].map(v => v / 1000000),
        fill: false,
      }]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: 'Result of SpeedTest'
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [{
          display: true,
          type: 'time',
          time: {
            displayFormats: {
              hour: 'h'
            }

          },
          scaleLabel: {
            display: true,
            labelString: 'Time'
          },
          ticks: {
            source: 'data',
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Speed [Mbps]'
          }
        }]
      }
    }
  }
  const ctx = document.getElementById('canvas').getContext('2d')
  return new Chart(ctx, config)
}
