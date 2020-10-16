let startTime;
let msm, conf;

function start() {
  document.getElementById('b').disabled = true;
  document.body.setAttribute('data-state', 'waiting');
  let wait = (2*Math.random() + 1) * conf.wait * 1000;
  window.setTimeout(run, wait);
}

function run() {
  document.getElementById('b').disabled = false;
  document.body.setAttribute('data-state', 'running');
  startTime = Date.now();
  if(conf.sound)
    document.querySelector('audio').play();
}

function stop() {
  document.body.setAttribute('data-state', 'base');
  let time = Date.now();
  let diff = time - startTime - conf.goal * 1000;
  addLine(time, conf.goal, diff);
  document.querySelector('audio').load();
}

function click() {
  if(document.body.getAttribute('data-state') == 'running')
    stop();
  else
    start();
}

function addLine(time, goal, diff, update = true) {
  let res = document.getElementById('r');
  let diffText = (diff > 0 ? '+' : '') + diff.toString();
  let cls = diff > 10 ? 'plus' : diff < -10 ? 'minus' : 'spoton';
  let now = new Date(time).toLocaleString();
  res.innerHTML = `${now}\t${goal}s\t<span class="${cls}">${diffText} ms</span>\n` + res.innerHTML;
  if(update) {
    msm.push({time, goal, diff});
    localStorage['odhad'] = JSON.stringify(msm);
  }
}

function loadLS() {
  msm = JSON.parse(localStorage['odhad'] || '[]');
  for(m of msm)
    addLine(m.time, m.goal || 5, m.diff, false);

  conf = JSON.parse(localStorage['odhad-conf'] || '{}');
  document.getElementById('iGoal').value = conf.goal || 5;
  document.getElementById('iWait').value = conf.wait || 1;
  document.getElementById('iSound').checked = conf.sound || false;
  inputGoal(document.getElementById('iGoal'));
  inputWait(document.getElementById('iWait'));
}

function inputGoal(elm) {
  let val = elm.value;
  elm.labels[1].innerText = `${val} s`;
  if(conf.goal != val) {
    conf.goal = val;
    localStorage['odhad-conf'] = JSON.stringify(conf);
  }
}

function inputWait(elm) {
  let val = elm.value;
  elm.labels[1].innerText = val == 0 ? '0 s' : `${val} – ${3*val} s`;
  if(conf.wait != val) {
    conf.wait = val;
    localStorage['odhad-conf'] = JSON.stringify(conf);
  }
}

function inputSound(elm) {
  let val = elm.checked;
  if(conf.sound != val) {
    conf.sound = val;
    localStorage['odhad-conf'] = JSON.stringify(conf);
  }
}

window.addEventListener('DOMContentLoaded', function() {
  document.getElementById('b').addEventListener('click', click);
  document.getElementById('iGoal').addEventListener('input', e => inputGoal(e.currentTarget));
  document.getElementById('iWait').addEventListener('input', e => inputWait(e.currentTarget));
  document.getElementById('iSound').addEventListener('input', e => inputSound(e.currentTarget));
  loadLS();
});
