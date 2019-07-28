console.log("sync-current-time loaded")


var createRandomName = () => {
  console.log("A creating a random name");
  let array = new Uint32Array(10);
  window.crypto.getRandomValues(array);
  console.log("Z created a random name", array[0]);
  return array[0].toString();
}

// debugger;
var myPort = browser.runtime.connect({name: createRandomName()});

console.log("sync-current-time opened a port", myPort)

window.lastSyncedAt = Date.now();

setTimeout( () => {
  console.log("A adding a seeked listener");

  video().addEventListener("seeked", e => {
    console.log("video did seek to", video().currentTime);

    if (window.lastSyncedAt + 300 > Date.now()) {
      console.log("I'm following the leader; I won't broadcast this");
    } else {
      console.log("I'm the leader! Broadcasting a seeked event to ", video().currentTime);
      myPort.postMessage({ event: "seeked", currentTime: video().currentTime });
    }
  });

  console.log("Z added a seeked listener");
}, 9000);

console.log("A adding a myPort message listener");
myPort.onMessage.addListener(m => {
  console.log("message received!", m);

  if (m.updateCurrentTime && window.lastSyncedAt + 300 < Date.now()) {
    window.lastSyncedAt = Date.now();

    video().currentTime = m.updateCurrentTime;
  }
})
console.log("Z added a myPort message listener");

console.log("sync-current-time finished loading");
