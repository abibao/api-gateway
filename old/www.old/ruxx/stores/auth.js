function AuthStore () {
  var self = this
  riot.observable(self)

  self.dataProvider = []

  self.authentified = function () {
    var ca = Cookies.get('USER-TOKEN')
    return lodash.isUndefined(ca) === false
  }
}
