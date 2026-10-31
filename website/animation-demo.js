/* Deterministic illustrative animation; values are not hardware measurements. */
const animationDemo = (() => {
  const yagiAntenna = document.querySelector('.antenna-elements');
  const servoAngleValue = document.getElementById('servoAngleValue');
  const rssiValue = document.getElementById('rssiValue');
  const espStatusValue = document.getElementById('espStatusValue');
  const decisionText = document.getElementById('decisionText');
  const lockStatus = document.getElementById('lockStatus');
  const linkStatus = document.getElementById('linkStatus');
  const lockDetail = document.getElementById('lockDetail');
  const replayBtn = document.getElementById('replayAnimation');
  const pauseBtn = document.getElementById('pauseAnimation');
  const resetBtn = document.getElementById('resetAnimation');
  const signalBars = document.querySelectorAll('.signal-bar');
  const angleSequence = Array.from({ length: 13 }, (_, index) => index * 15);
  const rssiSequence = [-74, -70, -66, -62, -58, -53, -47, -49, -52, -56, -61, -66, -72];
  let animationIndex = 0;
  let isPaused = false;
  let intervalId;
  let phase = 'scanning';
  let bestRssi = null;
  let bestAngle = null;
  let lockedTicks = 0;

  const setAngle = (angle) => {
    yagiAntenna.style.transform = `rotate(${angle}deg)`;
    servoAngleValue.textContent = `${angle}°`;
    document.querySelectorAll('.servo-rotor').forEach(el => el.style.transform = `rotate(${angle}deg)`);
  };

  const setRssi = (value) => {
    rssiValue.textContent = value === null ? '—' : `${value} dBm`;
    signalBars.forEach((bar, idx) => {
      bar.style.opacity = value !== null && idx <= Math.min(Math.floor((value + 90) / 12), signalBars.length - 1) ? '1' : '.2';
    });
  };

  const updateEsp = (text) => {
    espStatusValue.textContent = text;
  };

  const updateDecision = (text) => {
    decisionText.textContent = text;
  };

  const updateLock = (locked) => {
    lockStatus.textContent = locked ? 'Best Demo Direction Found' : 'Illustrative scan in progress';
    const bestText = bestRssi === null ? 'No demo scan completed' : `${bestRssi} dBm at ${bestAngle}° (simulated)`;
    linkStatus.textContent = bestText;
    if (lockDetail) lockDetail.textContent = `Best illustrative RSSI: ${bestText}. Not a sensor reading.`;
    document.querySelector('.signal-lock').classList.toggle('locked', locked);
  };

  const runStep = () => {
    if (isPaused) return;
    if (phase === 'scanning' && animationIndex < angleSequence.length) {
      const angle = angleSequence[animationIndex];
      const rssi = rssiSequence[animationIndex];
      if (bestRssi === null || rssi > bestRssi) {
        bestRssi = rssi;
        bestAngle = angle;
      }
      setAngle(angle);
      setRssi(rssi);
      updateEsp('Simulation only — no ESP32 connection');
      updateDecision('Comparing illustrative RSSI values...');
      document.getElementById('statusRssi').textContent = `${rssi} dBm (demo)`;
      document.getElementById('statusAngle').textContent = `${angle}°`;
      document.getElementById('statusServo').textContent = 'MG996R positional (demo)';
      document.getElementById('statusEsp').textContent = 'ESP32 DevKit (simulated)';
      document.getElementById('statusQuality').textContent = 'Scanning';
      updateLock(false);
      animationIndex += 1;
      if (animationIndex === angleSequence.length) phase = 'evaluating';
      return;
    }

    if (phase === 'evaluating') {
      setRssi(null);
      updateEsp('Evaluating demo scan...');
      updateDecision(`Highest demo RSSI: ${bestRssi} dBm at ${bestAngle}°`);
      document.getElementById('statusRssi').textContent = '— (evaluation)';
      document.getElementById('statusServo').textContent = 'Holding position';
      document.getElementById('statusQuality').textContent = 'Evaluating';
      phase = 'aligning';
      return;
    }

    if (phase === 'aligning') {
      setAngle(bestAngle);
      setRssi(null);
      updateEsp('Aligning demo platform...');
      updateDecision(`Returning to ${bestAngle}° (demo)`);
      document.getElementById('statusRssi').textContent = '— (not sampled)';
      document.getElementById('statusAngle').textContent = `${bestAngle}°`;
      document.getElementById('statusServo').textContent = 'Aligning (demo)';
      document.getElementById('statusQuality').textContent = 'Aligning';
      phase = 'locked';
      lockedTicks = 0;
      return;
    }

    updateEsp('Simulation only — no ESP32 connection');
    document.getElementById('statusRssi').textContent = '— (best demo reading shown below)';
    document.getElementById('statusAngle').textContent = `${bestAngle}°`;
    document.getElementById('statusServo').textContent = 'Locked at best demo angle';
    document.getElementById('statusQuality').textContent = 'Locked / Best Direction Found';
    updateDecision('Best illustrative direction found');
    updateLock(true);
    lockedTicks += 1;
    if (lockedTicks >= 3) startAnimation();
  };

  const startAnimation = () => {
    clearInterval(intervalId);
    animationIndex = 0;
    isPaused = false;
    phase = 'scanning';
    bestRssi = null;
    bestAngle = null;
    lockedTicks = 0;
    updateLock(false);
    updateEsp('Illustrative simulation only');
    updateDecision('Starting 0°–180° scan in 15° steps...');
    setAngle(0);
    setRssi(null);
    document.getElementById('statusRssi').textContent = '—';
    document.getElementById('statusAngle').textContent = '0°';
    document.getElementById('statusServo').textContent = 'MG996R positional (demo)';
    document.getElementById('statusEsp').textContent = 'ESP32 DevKit (simulated)';
    document.getElementById('statusQuality').textContent = 'Scanning';
    intervalId = setInterval(runStep, 1100);
    pauseBtn.disabled = false;
    pauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
  };

  const pauseAnimation = () => {
    isPaused = !isPaused;
    pauseBtn.innerHTML = isPaused
      ? '<i class="fa-solid fa-play"></i> Resume'
      : '<i class="fa-solid fa-pause"></i> Pause';
    if (!isPaused && animationIndex < angleSequence.length) runStep();
  };

  const resetAnimation = () => {
    clearInterval(intervalId);
    intervalId = null;
    animationIndex = 0;
    isPaused = true;
    phase = 'scanning';
    bestRssi = null;
    bestAngle = null;
    lockedTicks = 0;
    setAngle(0);
    setRssi(null);
    updateEsp('Demo stopped');
    updateDecision('Press Replay Demo to start');
    document.getElementById('statusRssi').textContent = '—';
    document.getElementById('statusAngle').textContent = '0°';
    document.getElementById('statusServo').textContent = 'MG996R positional';
    document.getElementById('statusEsp').textContent = 'ESP32 DevKit (simulated)';
    document.getElementById('statusQuality').textContent = 'Stopped';
    updateLock(false);
    lockStatus.textContent = 'Demo stopped';
    linkStatus.textContent = 'No demo scan completed';
    if (lockDetail) lockDetail.textContent = 'Press Replay Demo to start the illustrative scan.';
    pauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
  };

  return {
    init() {
      replayBtn.addEventListener('click', startAnimation);
      pauseBtn.addEventListener('click', pauseAnimation);
      resetBtn.addEventListener('click', resetAnimation);
      startAnimation();
    }
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  animationDemo.init();
});
