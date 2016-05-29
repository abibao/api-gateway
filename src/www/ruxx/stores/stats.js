function StatsStore () {
  var self = this
  riot.observable(self)

  self._countGendersInAbibao = {
    labels: [
      'Hommes',
      'Femmes'
    ],
    datasets: [
      {
        data: [0, 0],
        borderColor: '#DDDDDD',
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
        borderColor: '#DDDDDD',
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
}
