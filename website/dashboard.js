/* The dashboard is a deterministic illustrative demo, not ESP32 telemetry. */

document.addEventListener('DOMContentLoaded', () => {

  const els = {
    rssiValue:      document.getElementById('rssiValue'),
    rssiGaugeFill:  document.getElementById('rssiGaugeFill'),
    rssiGaugeText:  document.getElementById('rssiGaugeText'),
    angleValue:     document.getElementById('angleValue'),
    servoStatus:    document.getElementById('servoStatus'),
    connStatus:     document.getElementById('connStatus'),
    connDot:        document.getElementById('connDot'),
    signalQuality:  document.getElementById('signalQuality'),
    scanStatus:     document.getElementById('scanStatus'),
    scanDot:        document.getElementById('scanDot'),
    bestRssiValue:  document.getElementById('bestRssiValue'),
    bestAngleValue: document.getElementById('bestAngleValue'),
    compassNeedle:  document.getElementById('compassNeedle'),
    compassDeg:     document.getElementById('compassDeg'),
    servoArm:       document.getElementById('servoArm'),
    signalBars:     document.querySelectorAll('.signal-meter .bar'),
    modeAuto:       document.getElementById('modeAuto'),
    modeManual:     document.getElementById('modeManual'),
    manualSlider:   document.getElementById('manualSlider'),
    manualSliderWrap: document.getElementById('manualSliderWrap'),
  };

  const GAUGE_RADIUS = 84;
  const GAUGE_CIRC = 2 * Math.PI * GAUGE_RADIUS;
  if (els.rssiGaugeFill){
    els.rssiGaugeFill.style.strokeDasharray = `${GAUGE_CIRC}`;
  }

  let mode = 'auto';
  const demoAngles = Array.from({ length: 13 }, (_, index) => index * 15);
  const demoReadings = [-74, -70, -66, -62, -58, -53, -47, -49, -52, -56, -61, -66, -72];
  let demoPhase = 'scanning';
  let scanIndex = 0;
  let simAngle = 0;
  let bestRssi = null;
  let bestAngle = null;
  let lockedTicks = 0;

  /* ---------- Build compass ticks once ---------- */
  const compass = document.getElementById('compass');
  if (compass){
    for (let deg = 0; deg <= 180; deg += 15){
      const tick = document.createElement('div');
      tick.className = 'tick' + (deg % 30 === 0 ? ' major' : '');
      tick.style.transform = `rotate(${deg}deg)`;
      compass.appendChild(tick);
    }
    [0, 90, 180].forEach(deg => {
      const l = document.createElement('div');
      l.className = 'compass-label';
      l.textContent = `${deg}°`;
      const rad = (deg - 90) * Math.PI / 180;
      const x = 100 + Math.cos(rad) * 78 - 10;
      const y = 100 + Math.sin(rad) * 78 - 7;
      l.style.left = x + 'px';
      l.style.top = y + 'px';
      compass.appendChild(l);
    });
  }

  /* ---------- Chart.js: RSSI vs Angle ---------- */
  let chart;
  const chartCanvas = document.getElementById('rssiChart');
  if (chartCanvas && window.Chart){
    chart = new Chart(chartCanvas, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'RSSI (dBm)',
          data: [],
          borderColor: '#4CD6FF',
          backgroundColor: 'rgba(76,214,255,0.12)',
          borderWidth: 2,
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 400 },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0B1630',
            borderColor: 'rgba(76,214,255,0.4)',
            borderWidth: 1,
            titleColor: '#F3F7FF',
            bodyColor: '#A7B4D6',
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Antenna Angle (°)', color: '#6E7CA3', font:{family:'JetBrains Mono', size:10} },
            ticks: { color: '#6E7CA3', font:{family:'JetBrains Mono', size:10} },
            grid: { color: 'rgba(167,180,214,0.08)' }
          },
          y: {
            title: { display: true, text: 'RSSI (dBm)', color: '#6E7CA3', font:{family:'JetBrains Mono', size:10} },
            ticks: { color: '#6E7CA3', font:{family:'JetBrains Mono', size:10} },
            grid: { color: 'rgba(167,180,214,0.08)' }
          }
        }
      }
    });
  }

  /* ---------- Update the illustrative demo display ---------- */
  function updateDashboard(data){
    const { rssi, angle, servoStatus, scanStatus } = data;
    const hasRssi = Number.isFinite(rssi);

    // RSSI numeric + gauge (map -100..-30 dBm to 0..100%)
    const pct = hasRssi ? Math.max(0, Math.min(100, ((rssi + 100) / 70) * 100)) : 0;
    if (els.rssiValue) els.rssiValue.textContent = hasRssi ? rssi : '—';
    if (els.rssiGaugeFill){
      const offset = GAUGE_CIRC - (pct/100) * GAUGE_CIRC;
      els.rssiGaugeFill.style.strokeDashoffset = offset;
    }
    if (els.rssiGaugeText) els.rssiGaugeText.textContent = hasRssi ? Math.round(pct) + '%' : '—';

    // Angle + compass + servo arm
    if (els.angleValue) els.angleValue.textContent = angle + '°';
    if (els.compassNeedle) els.compassNeedle.style.transform = `rotate(${angle}deg)`;
    if (els.compassDeg) els.compassDeg.textContent = angle + '°';
    if (els.servoArm) els.servoArm.style.transform = `rotate(${(angle - 90)}deg)`;

    // Signal quality bars (5-step)
    const step = Math.ceil(pct / 20);
    els.signalBars.forEach((bar, i) => bar.classList.toggle('active', i < step));
    let qualityLabel = 'Not measured';
    if (hasRssi && pct <= 35) qualityLabel = 'Poor (demo)';
    else if (hasRssi && pct > 80) qualityLabel = 'Excellent (demo)';
    else if (hasRssi && pct > 60) qualityLabel = 'Good (demo)';
    else if (hasRssi) qualityLabel = 'Fair (demo)';
    if (els.signalQuality) els.signalQuality.textContent = qualityLabel;

    // Servo status
    if (els.servoStatus) els.servoStatus.textContent = servoStatus;

    // The best values are illustrative simulation values, not measurements.
    if (els.bestRssiValue) els.bestRssiValue.textContent = bestRssi === null ? '—' : `${bestRssi} dBm`;
    if (els.bestAngleValue) els.bestAngleValue.textContent = bestAngle === null ? '—' : `${bestAngle}°`;
    if (els.scanStatus) els.scanStatus.textContent = scanStatus;
    const scanning = ['Scanning', 'Evaluating', 'Aligning'].includes(scanStatus);
    if (els.scanDot) els.scanDot.className = 'status-dot ' + (scanning ? 'warn' : '');

    // Chart
    if (chart && hasRssi){
      chart.data.labels.push(angle);
      chart.data.datasets[0].data.push(rssi);
      if (chart.data.labels.length > 30){
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
      }
      chart.update('none');
    }
  }
  /* ---------- Deterministic simulation engine (demo only) ---------- */
  function simulateTick(){
    if (mode === 'manual'){
      simAngle = parseInt(els.manualSlider ? els.manualSlider.value : simAngle, 10);
      updateDashboard({
        rssi: null,
        angle: simAngle,
        servoStatus: 'Manual demo',
        scanStatus: 'Idle'
      });
      return;
    }

    if (demoPhase === 'scanning'){
      simAngle = demoAngles[scanIndex];
      const rssi = demoReadings[scanIndex];
      if (bestRssi === null || rssi > bestRssi){
        bestRssi = rssi;
        bestAngle = simAngle;
      }
      updateDashboard({
        rssi,
        angle: simAngle,
        servoStatus: 'Scanning demo',
        scanStatus: 'Scanning'
      });
      scanIndex += 1;
      if (scanIndex === demoAngles.length) demoPhase = 'evaluating';
      return;
    }

    if (demoPhase === 'evaluating'){
      updateDashboard({
        rssi: null,
        angle: 180,
        servoStatus: 'Evaluating',
        scanStatus: 'Evaluating'
      });
      demoPhase = 'aligning';
      return;
    }

    if (demoPhase === 'aligning'){
      simAngle = bestAngle;
      updateDashboard({
        rssi: null,
        angle: simAngle,
        servoStatus: 'Aligning',
        scanStatus: 'Aligning'
      });
      demoPhase = 'locked';
      lockedTicks = 0;
      return;
    }

    updateDashboard({
      rssi: null,
      angle: bestAngle,
      servoStatus: 'Locked (demo)',
      scanStatus: 'Locked / Best Direction Found'
    });
    lockedTicks += 1;
    if (lockedTicks >= 3){
      demoPhase = 'scanning';
      scanIndex = 0;
      bestRssi = null;
      bestAngle = null;
    }
  }

  /* ---------- Mode toggle ---------- */
  function setMode(newMode){
    mode = newMode;
    if (els.modeAuto) els.modeAuto.classList.toggle('active', mode === 'auto');
    if (els.modeManual) els.modeManual.classList.toggle('active', mode === 'manual');
    if (els.manualSliderWrap) els.manualSliderWrap.style.display = mode === 'manual' ? 'block' : 'none';
    if (mode === 'auto'){
      demoPhase = 'scanning';
      scanIndex = 0;
      bestRssi = null;
      bestAngle = null;
      simAngle = 0;
      updateDashboard({
        rssi: null,
        angle: simAngle,
        servoStatus: 'MG996R positional',
        scanStatus: 'Idle'
      });
    } else {
      simulateTick();
    }
  }
  if (els.modeAuto) els.modeAuto.addEventListener('click', () => setMode('auto'));
  if (els.modeManual) els.modeManual.addEventListener('click', () => setMode('manual'));
  updateDashboard({
    rssi: null,
    angle: simAngle,
    servoStatus: 'MG996R positional',
    scanStatus: 'Idle'
  });
  const simInterval = setInterval(simulateTick, 1000);
  setMode('auto');

  if (els.manualSlider){
    els.manualSlider.addEventListener('input', () => {
      const label = document.getElementById('manualSliderVal');
      if (label) label.textContent = els.manualSlider.value + '°';
    });
  }

  window.addEventListener('beforeunload', () => clearInterval(simInterval));
});
