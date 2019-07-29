console.log("background script loaded!")

var ports = []

function handleSeeked(message, originPort) {
  console.log("Handling seeked!", message, originPort())

  ports.forEach(p => {
    if (p.name !== originPort().name) {
      console.log("posting to port", p)
      p.postMessage({ updateCurrentTime: message.currentTime })
    } else {
      console.log("Ignoring the origin port!")
    }
  })
}

function handlePlay(message, originPort) {
  console.log("Handling play!", message, originPort())

  ports.forEach(p => {
    if (p.name !== originPort().name) {
      console.log("posting to port", p)
      p.postMessage({ updatePlay: true })
    } else {
      console.log("Ignoring the origin port!")
    }
  })
}

function handlePause(message, originPort) {
  console.log("Handling pause!", message, originPort())

  ports.forEach(p => {
    if (p.name !== originPort().name) {
      console.log("posting to port", p)
      p.postMessage({ updatePause: true })
    } else {
      console.log("Ignoring the origin port!")
    }
  })
}

function connected(p) {
  console.log("New connection!", p)

  ports[p.sender.tab.id] = p

  p.onMessage.addListener(m => {
    console.log("message received!", m)

    if (m.event === "seeked") {
      handleSeeked(m, () => p)
    } else if (m.event === "play") {
      handlePlay(m, () => p)
    } else if (m.event === "pause") {
      handlePause(m, () => p)
    }
  })
}

browser.runtime.onConnect.addListener(connected)
