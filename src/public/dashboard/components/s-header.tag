<s-header>

  <nav class="top persistent">
    <img class="logo" src="images/abibao_logo.png"/>
  </nav>

  <style scoped>
    nav.top {
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 99;
      padding: 1rem;
      -webkit-transform: translate3d(0,0,0);
      -moz-transform: translate3d(0,0,0);
      -ms-transform: translate3d(0,0,0);
      transform: translate3d(0,0,0);
      -webkit-transition: -webkit-transform 420ms cubic-bezier(.165,.84,.44,1);
      -moz-transition: -moz-transform 420ms cubic-bezier(.165,.84,.44,1);
      transition: transform 420ms cubic-bezier(.165,.84,.44,1);
    }
    nav.top.persistent {
      background: #ffffff;
      box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .logo {
      opacity: 0.6;
      filter: alpha(opacity=60);
    }
  </style>

</s-header>
