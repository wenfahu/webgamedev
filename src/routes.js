export default [
  {
      path: '/about/',
      component: require('./pages/about.vue')
  },
  {
      path: '/form/',
      component: require('./pages/form.vue')
  },
  {
      path: '/grid/',
      component: require('./pages/Launcher.vue')
  },
  {
      path: '/calculator/',
      component: require('./pages/calculator.vue')
  },
  {
      path: '/siri/',
      component: require('./pages/siri.vue')
  },
  {
      path: '/weather/',
      component: require('./pages/weather.vue')
  },
  {
      path: '/clock/',
      component: require('./pages/alarm-clock.vue')
  },
  {
      path: '/cal/',
      component: require('./pages/cal.vue')
  },
  {
      path: '/msg/',
      component: require('./pages/sms.vue')
  },
  {
      path: '/notes/',
      component: require('./pages/notes.vue')
  },
  {
      path: '/dynamic-route/blog/:blogId/post/:postId/',
      component: require('./pages/dynamic-route.vue')
  }
]
