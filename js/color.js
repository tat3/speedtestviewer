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
    const a = 0.1
    this.bgcolors = {
      red: this.rgba(255, 99, 132, a),
      orange: this.rgba(255, 159, 64, a),
      yellow: this.rgba(255, 205, 86, a),
      green: this.rgba(75, 192, 192, a),
      blue: this.rgba(54, 162, 235, a),
      purple: this.rgba(153, 102, 255, a),
      grey: this.rgba(201, 203, 207, a)
    }
    this.series = [
      this.colorItem('red'),
      this.colorItem('orange'),
      this.colorItem('yellow'),
      this.colorItem('green'),
      this.colorItem('blue'),
      this.colorItem('purple'),
      this.colorItem('grey'),
    ]
  }
  rgba(r, g, b, a) {
    return `rgba(${r}, ${g}, ${b}, ${a})`
  }
  rgb(r, g, b) {
    return this.rgba(r, g, b, 1.0)
  }
  colorItem(name) {
    return {color: this.colors[name], bgcolor: this.bgcolors[name]}
  }
}

module.exports = Color

