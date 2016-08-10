import userService from './../services/user'

import './../components/s-header.tag'
import './../components/s-loader.tag'
import './../components/s-survey-reader.tag'

<homepage>

  <s-header></s-header>
  <s-loader if={ loading===true }></s-loader>
  <s-survey-reader if={ findNextState.stateName==='survey' } survey={ findNextState.params.id }></s-survey-reader>

  <script>

    let self = this

    self.loading = true
    self.findNextState = false

    self.on('mount', function() {
      userService.trigger(riot.EVENT.USER_AUTHENTICATE)
    })

    userService.on(riot.EVENT.USER_AUTHENTICATE_SUCCESS, function(user) {
      self.findNextState = findNextState(user.data)
      console.log(self.findNextState)
      self.loading = false
      self.update()
    })

    userService.on(riot.EVENT.USER_AUTHENTICATE_FAILED, function(error) {
      self.loading = false
      riot.route('login')
    })

    function findNextState(globalInfos) {
      var nextState = {
        params : {}
      }
      if (!globalInfos.abibaoCompleted.length) {
        nextState.stateName = 'survey'
        nextState.params.id = globalInfos.abibaoInProgress[0].id
      }
      else {
        if (!globalInfos.currentCharity) {
          if (globalInfos.abibaoCompleted.length == 1) {
            nextState.stateName = 'charitychoice'
          }
          else if(globalInfos.abibaoInProgress.length){
            nextState.stateName = 'survey'
            nextState.params.id = globalInfos.abibaoInProgress[0].id
          }
          else {
            nextState.stateName = 'all-finished'
          }
        }
        else {
          if (globalInfos.surveysInProgress.length) {
            nextState.stateName = 'survey'
            nextState.params.id = globalInfos.surveysInProgress[0].id
          }
          else if(globalInfos.abibaoInProgress.length){
            nextState.stateName = 'survey'
            nextState.params.id = globalInfos.abibaoInProgress[0].id
          }
          else if (globalInfos.abibaoCompleted.length == 2 && !globalInfos.surveysCompleted.length) {
            nextState.stateName = 'email-sended'
          }
          else {
            nextState.params.urn = false
            nextState.stateName = 'all-finished'
          }
        }
      }
      return nextState
    }

  </script>

  <style scoped>
  </style>

</homepage>
