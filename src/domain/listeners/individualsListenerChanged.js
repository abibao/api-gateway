'use strict'

module.exports = function () {
  var CURRENT_NAME = 'IndividualsListenerChanged'

  var self = this

  try {
    self.debug.listener('[start] %s', CURRENT_NAME)

    self.IndividualModel.changes().then(function (feed) {
      feed.each(function (error, doc) {
        if (error) {
          return error
        }
        if (doc.isSaved() === false) {
          // delete
          self.debug.listener('[delete] %s, %o', CURRENT_NAME, doc)
        } else if (doc.getOldValue() === null) {
          // create
          self.debug.listener('[create] %s %o', CURRENT_NAME, doc)
          self.individualSendEmailWelcomeCommand(doc)
        } else {
          // update
          self.debug.listener('[update] %s %o', CURRENT_NAME, doc)
        }
      })
    })
  } catch (e) {
    self.debug.error('%s %o', CURRENT_NAME, e)
  }
}
