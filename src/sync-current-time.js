const log = (...args) => {
  // return console.log(...args)
}

log("sync-current-time loaded")

const createRandomName = () => {
  log("A creating a random name")
  let array = new Uint32Array(10)
  window.crypto.getRandomValues(array)
  log("Z created a random name", array[0])
  return array[0].toString()
}

const portToBackground = browser.runtime.connect({name: createRandomName()})

log("sync-current-time opened a port", portToBackground)

const updateDebounce = () => { window.lastSyncedAt = Date.now() }

updateDebounce()
const isWithinDebounce = () => window.lastSyncedAt + 300 > Date.now()
const isWithoutDebounce = () => !isWithinDebounce()

const setVideoTime = (seconds) => { video().currentTime = seconds }

log("A adding a portToBackground message listener")
portToBackground.onMessage.addListener(m => {
  log("message received!", m)

  if (m.updateCurrentTime && isWithoutDebounce()) {
    if (isBeginningOfSession(m.updateCurrentTime)) {
      return
    }

    updateDebounce()

    setVideoTime(m.updateCurrentTime)
  }
})
log("Z added a portToBackground message listener")

const isBeginningOfSession = t => t < 3

const MAX_LOAD_TIME_MS = 9000

setTimeout(() => {
  log("A adding a seeked listener")

  video().addEventListener("seeked", e => {
    log("video did seek to", video().currentTime)

    if (isWithinDebounce()) {
      log("I'm following the leader I won't broadcast this")
    } else {
      log("I'm the leader! Broadcasting a seeked event to ", video().currentTime)
      portToBackground.postMessage({ event: "seeked", currentTime: video().currentTime })
    }
  })

  log("Z added a seeked listener")
}, MAX_LOAD_TIME_MS)

log("sync-current-time finished loading")
