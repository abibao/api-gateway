import surveyService from './../services/survey'

<s-survey-reader>

  <div class="card">
    <h1>Survey</h1>
  </div>

  <script>

    let self = this

    self.loading = true
    self.survey = false

    self.on('mount', function() {
      surveyService.trigger(riot.EVENT.SURVEY_GET, self.opts.survey)
    })

  </script>

  <style scoped>
    :scope {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      margin-top: 180px;
    }
    .card {
      background-color: #fff;
      border-radius: .25rem;
      box-shadow: 0 1px 0 rgba(0,0,0,.25);
      padding: 2rem 2rem 1rem;
      margin: 0;
      position: relative;
      border: 1px solid #e8e8e8;
      display: flex;
      flex-direction: column;
    }
    h1, p {
      color: #555459;
    }
  </style>

</s-survey-reader>
