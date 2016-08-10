<s-loader>

  <div class="loader-item loader-item--top"> </div>
  <div class="loader-item">
    <h1>Chargement en cours...</h1>
  </div>
  <div class="loader-item loader-item--bottom"> </div>

  <style scoped>
    :scope {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }
    .loader-item {
      max-width: 50%;
    }
    .loader-item--top {
      align-self: flex-start;
    }
    .loader-item--bottom {
      align-self: flex-end;
    }
    h1 {
      color: #5da2c7;
    }
  </style>

</s-loader>
