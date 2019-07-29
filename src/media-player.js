const rewind = (seconds) => {
  return fastForward(-seconds)
}

const fastForward = (seconds) => {
  return video().currentTime += seconds
}

const jumpToTenth = (tenth) => {
  return video().currentTime = (tenth / 10 * video().duration)
}

const isFullScreen = function() {
  return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement)
}

const toggleFullscreen = function() {
  if (isFullScreen()) {
     if (document.exitFullscreen) document.exitFullscreen()
     else if (document.mozCancelFullScreen) document.mozCancelFullScreen()
     else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen()
     else if (document.msExitFullscreen) document.msExitFullscreen()
     setFullscreenData(false)
  }
  else {
     if (video().requestFullscreen) video().requestFullscreen()
     else if (video().mozRequestFullScreen) video().mozRequestFullScreen()
     else if (video().webkitRequestFullScreen) video().webkitRequestFullScreen()
     else if (video().msRequestFullscreen) videoContainer.msRequestFullscreen()
     setFullscreenData(true)
  }
}

const togglePause = () => {
  let v = video()
  if (v.paused) {
    v.play()
  } else {
    v.pause()
  }
}

const toggleMute = () => {
  let v = video()
  let isMuted = v.muted
  v.muted = !isMuted
}

const video = () => {
  return document.querySelector("video")
}

const keyupHandler = (event) => {
  console.log("keyUp", event)

  if (event.defaultPrevented) {
    return
  }

  switch (event.key) {
    case "Left":
    case "ArrowLeft":
      rewind(5)
      break
    case "j":
      rewind(10)
      break
    case "Right":
    case "ArrowRight":
      fastForward(5)
      break
    case "k":
      fastForward(10)
      break
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case "0":
      jumpToTenth(event.key)
      break
    case "Home":
      jumpToTenth("0")
      break
    case " ":
    case "Space":
    case "Spacebar":
      togglePause()
      break
    case "m":
      toggleMute()
      break
    case "f":
      toggleFullscreen()
      break
    default:
      return
  }
}

document.addEventListener("keyup", keyupHandler)
