function AuthStore () {
  var self = this
  riot.observable(self)

  self.dataProvider = []

  self.authentified = function () {
    var ca = Cookies.get('abibao-user-token')
    return lodash.isUndefined(ca) === false
  }
}
