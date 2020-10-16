let startTime;

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
  let res = document.getElementById('r');
  let now = new Date().toLocaleString();
  let diff = Date.now() - startTime - 1000;
  diff = (diff > 0 ? '+' : '') + diff.toString();
  let cls = diff > 10 ? 'plus' : diff < -10 ? 'minus' : 'spoton';
  res.innerHTML += `${now}\t5s\t<span class="${cls}">${diff} ms</span>\n`;
}

function click() {
  if(document.body.getAttribute('data-state') == 'running')
    stop();
  else
    start();
}

window.addEventListener('DOMContentLoaded', function() {
  document.getElementById('b').addEventListener('click', click);
});
