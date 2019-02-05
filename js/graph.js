const Color = require('./color')

class DownloadGraph {

  constructor(canvasId) {
    this.canvasId = canvasId
    this.color = new Color()
    this.main()
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
      // date.setHours(date.getHours() + 10)
      return date.toString().slice(0, 15)
    }
    const aggregateDailyData = (dates, values) => {
      const dailyDataDict = dates.reduce((acc, date, index) => {
        const day = date2day(date)
        const dateFmt = `2019-02-02T${(new Date(date)).toString().slice(16, 24)}.000000`
        // console.log(dateFmt)
        const item = {
          day: day,
          date: dateFmt,
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
      .map(itemList => (itemList
        .map((item, i, list) => {
          if (i != 0 && i != list.length - 1) {
            item.value = (item.value + list[i-1].value + list[i+1].value) / 3
          }
          return item
        })
      ))


    return {
      labels: res_data['Timestamp'],
      data: res_data['dlmbps'],
      dataDaily: dataDaily,
    }
  }

  createCanvas(data, canvasId) {
    const config = {
      type: 'line',
      // type: 'scatter',
      data: {
        datasets: data.dataDaily.map((daily, index) => ({
          label: 'Download [Mbps]: ' + daily[0].day,
          backgroundColor: this.color.series[index].bgcolor,
          borderColor: this.color.series[index].color,
          borderWidth: 1,
          radius: 1,
          data: daily.map(item => ({
            x: item.date,
            y: item.value,
          })),
          fill: false,
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
              },
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

module.exports = DownloadGraph

