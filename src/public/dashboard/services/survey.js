/*global riot:false*/
class SurveyStore {

  constructor () {
    riot.observable(this)
    this.bindEvents()
  }

  bindEvents () {
    var self = this

    self.on(riot.EVENT.SURVEY_GET, function (urn) {
      console.log(urn)
      var surveys = riot.feathers.service('v1/auth/survey')
      surveys.get(urn)
        .then(function (survey) {
          console.log(survey)
          return self.trigger(riot.EVENT.SURVEY_GET_SUCCESS, survey)
        })
        .catch(function (error) {
          console.log(error)
          return self.trigger(riot.EVENT.SURVEY_GET_FAILED, error)
        })
    })
  }

}

export default new SurveyStore()
