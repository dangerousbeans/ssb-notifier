var appName = process.env.ssb_appname || 'ssb'
var pull = require('pull-stream')

module.exports = {
  name: 'notifier',
  version: '1.0.0',
  manifest: {
    notify: 'sync'
  },
  init: function (sbot, config) {
    var notify
    require('./notifier')(appName, function (err, _notify) {
      if (err) return console.error('[notifier]', err.message || err)
      notify = _notify
      pull(
        sbot.createLogStream({old: false}),
        require('./notifications')(sbot, sbot.id),
        pull.drain(notify, function (err) {
          console.error('[notifier]', err)
        })
      )
    })

    return {
      notify: function (notification) {
        if (notify) notify(notification)
        else console.log('[notifier]', notification)
      }
    }
  }
}