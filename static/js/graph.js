class Color {
  constructor() {
    this.colors = {
      red: this.rgb(255, 99, 132),
      orange: this.rgb(255, 159, 64),
      yellow: this.rgb(255, 205, 86),
      green: this.rgb(75, 192, 192),
      blue: this.rgb(54, 162, 235),
      purple: this.rgb(153, 102, 255),
      grey: this.rgb(201, 203, 207)
    };
    const a = 0.2
    this.bgcolors = {
      red: this.rgba(255, 99, 132, a),
      orange: this.rgba(255, 159, 64, a),
      yellow: this.rgba(255, 205, 86, a),
      green: this.rgba(75, 192, 192, a),
      blue: this.rgba(54, 162, 235, a),
      purple: this.rgba(153, 102, 255, a),
      grey: this.rgba(201, 203, 207, a)
    }
  }
  rgba(r, g, b, a) {
    return `rgba(${r}, ${g}, ${b}, ${a})`
  }
  rgb(r, g, b) {
    return this.rgba(r, g, b, 1.0)
  }
}

class DownloadGraph {

  constructor(canvasId) {
    this.canvasId = canvasId
    this.main()
    this.color = new Color()
  }

  async main() {
    const res = axios.get('/speed.json')
    let data;
    try {
      const res_data = (await res).data
      data = this.createPlotData(res_data)
      console.log(data)
      return this.createCanvas(data, this.canvasId)
    } catch (e) {
      data = {
        labels: [], data: [],
      }
      console.log(e)
    }
    return this.createCanvas(data, this.canvasId)
  }

  createPlotData(res_data) {
    res_data['dlmbps'] = res_data['Download'].map(v => v / 1000000)

    const date2day = (str_date) => {
      const date = new Date(str_date)
      return date.toString().slice(0, 15)
    }
    const aggregateDailyData = (dates, values) => {
      const dailyDataDict = dates.reduce((acc, date, index) => {
        const day = date2day(date)
        const item = {
          day: day,
          date: date,
          value: values[index],
        }
        if(day in acc) {
          acc[day].push(item)
        } else {
          acc[day] = [item]
        }
        return acc
      }, {})
      return Object.values(dailyDataDict)
    }
    const dataDaily = aggregateDailyData(res_data['Timestamp'], res_data['dlmbps'])

    return {
      labels: res_data['Timestamp'],
      data: res_data['dlmbps'],
      dataDaily: dataDaily,
    }
  }

  createCanvas(data, canvasId) {
    const config = {
      type: 'line',
      data: {
        datasets: data.dataDaily.map(daily => ({
          label: 'Download speed: ' + daily[0].day,
          backgroundColor: this.color.bgcolors.red,
          borderColor: this.color.colors.red,
          data: daily.map(item => ({
            x: item.date,
            y: item.value,
          })),
          fill: true,
          lineTension: 0,
        })),
      },
      options: {
        responsive: true,
        animation: false,
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
              unit: 'hour',
              displayFormats: {
                hour: 'HH'
              }
            },
            scaleLabel: {
              display: true,
              labelString: 'Time'
            },
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
    const ctx = document.getElementById(canvasId).getContext('2d')
    return new Chart(ctx, config)
  }
}


