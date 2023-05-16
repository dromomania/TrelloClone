function currentTime() {
  let date = new Date()
  let hour = date.getHours()
  let min = date.getMinutes()
  let sec = date.getSeconds()
  let midday = "AM"
  midday = (hour >= 12) ? "PM" : "AM"
  hour = (hour == 0) ? 12 : ((hour > 12) ? (hour - 12): hour); /* assigning hour in 12-hour format */
  hour = updateTime(hour)
  min = updateTime(min)
  sec = updateTime(sec)
  document.getElementById("clock").innerText = hour + " : " + min + " : " + sec + " " + midday
    let t = setTimeout(currentTime, 1000) /* setting timer */
}

function updateTime(k) { /* appending 0 before time elements if less than 10 */
  if (k < 10) {
    return "0" + k
  }
  else {
    return k
  }
}

export { currentTime }
