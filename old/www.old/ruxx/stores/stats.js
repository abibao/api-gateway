function StatsStore () {
  var self = this
  riot.observable(self)

  self.getGreenToRed = function (max) {
    var colors = []
    for (var i = 0; i < max; i++) {
      var red = Math.round(i * 255 / max)
      var green = 255 - red
      var blue = 0
      var color = 'rgb(' + red + ',' + green + ',' + blue + ')'
      colors.push(color)
      if (i === max - 1) return colors
    }
  }

  self._countGendersInAbibao = {
    labels: [
      'Hommes',
      'Femmes'
    ],
    datasets: [
      {
        data: [0, 0],
        borderColor: '#ffffff',
        borderWidth: 2,
        backgroundColor: [
          '#36A2EB',
          '#FF6384'
        ],
        hoverBackgroundColor: []
      }]
  }
  self.countGendersInAbibao = function () {
    return self._countGendersInAbibao
  }

  self._countMembersInEntities = {
    labels: [],
    datasets: [
      {
        data: [],
        borderColor: '#ffffff',
        borderWidth: 2,
        backgroundColor: [
          '#AEEA00',
          '#EC407A',
          '#00BFA5',
          '#7E57C2',
          '#5C6BC0',
          '#42A5F5',
          '#66BB6A',
          '#EF5350'
        ],
        hoverBackgroundColor: []
      }]
  }
  self.countMembersInEntities = function () {
    return self._countMembersInEntities
  }

  self._countMembersAges = {
    MALE: {
      labels: [],
      datasets: [
        {
          data: [],
          borderColor: '#ffffff',
          borderWidth: 2,
          backgroundColor: self.getGreenToRed(10),
          hoverBackgroundColor: []
        }]
    },
    FEMALE: {
      labels: [],
      datasets: [
        {
          data: [],
          borderColor: '#ffffff',
          borderWidth: 2,
          backgroundColor: self.getGreenToRed(10),
          hoverBackgroundColor: []
        }]
    }
  }
  self.countMembersAges = function (gender) {
    return self._countMembersAges[gender]
  }
}
