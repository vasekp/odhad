let startTime;
let msm;

function start() {
  document.getElementById('b').disabled = true;
  document.body.setAttribute('data-state', 'waiting');
  let wait = 3000 * (Math.random() + 1);
  window.setTimeout(run, wait);
}

function run() {
  document.getElementById('b').disabled = false;
  document.body.setAttribute('data-state', 'running');
  startTime = Date.now();
}

function stop() {
  document.body.setAttribute('data-state', 'base');
  let time = Date.now();
  let diff = time - startTime - 1000;
  addLine(time, diff);
}

function click() {
  if(document.body.getAttribute('data-state') == 'running')
    stop();
  else
    start();
}

function addLine(time, diff, update = true) {
  let res = document.getElementById('r');
  let diffText = (diff > 0 ? '+' : '') + diff.toString();
  let cls = diff > 10 ? 'plus' : diff < -10 ? 'minus' : 'spoton';
  let now = new Date(time).toLocaleString();
  res.innerHTML = `${now}\t5s\t<span class="${cls}">${diffText} ms</span>\n` + res.innerHTML;
  if(update) {
    msm.push({time, diff});
    localStorage['odhad'] = JSON.stringify(msm);
  }
}

function loadLS() {
  msm = JSON.parse(localStorage['odhad'] || '[]');
  for(m of msm)
    addLine(m.time, m.diff, false);
}

window.addEventListener('DOMContentLoaded', function() {
  loadLS();
  document.getElementById('b').addEventListener('click', click);
});
