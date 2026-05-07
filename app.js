const spots = [
  { name: "稻香田园", feature: "农耕体验", open: "08:30 - 18:00", tips: "适合亲子采摘" },
  { name: "古桥水街", feature: "民俗老街", open: "09:00 - 21:00", tips: "夜景与小吃丰富" },
  { name: "山野露营地", feature: "星空露营", open: "全天", tips: "周末需预约" },
  { name: "非遗工坊", feature: "手作体验", open: "10:00 - 17:30", tips: "支持团体课程" }
];

const routeTemplates = {
  family: ["稻香田园（采摘+萌宠喂养）", "非遗工坊（亲子手作）", "古桥水街（晚餐+夜景）"],
  culture: ["古桥水街（古建漫步）", "非遗工坊（匠人讲解）", "村史馆（民俗展）"],
  food: ["早市农产品集市", "古桥水街（小吃巷）", "乡村土灶餐厅（晚餐）"]
};

const flowData = {
  today: [120, 180, 260, 310, 480, 650, 720, 690, 520, 430, 300, 210],
  week: [340, 410, 500, 550, 620, 760, 810],
  month: Array.from({ length: 30 }, () => Math.floor(220 + Math.random() * 650))
};

function renderSpots() {
  const grid = document.getElementById("spot-grid");
  grid.innerHTML = spots.map((s) => `
    <article class="spot-card">
      <h3>${s.name}</h3>
      <p><strong>特色：</strong>${s.feature}</p>
      <p><strong>开放：</strong>${s.open}</p>
      <p><strong>提示：</strong>${s.tips}</p>
    </article>
  `).join("");
}

function generateRoute() {
  const type = document.getElementById("route-type").value;
  const list = routeTemplates[type];
  document.getElementById("route-result").innerHTML = list.map((x) => `<li>${x}</li>`).join("");
}

function analyze(values) {
  const current = values[values.length - 1];
  const peak = Math.max(...values);
  const peakIndex = values.indexOf(peak);
  const crowd = Math.min(100, Math.round((current / peak) * 100));
  return { current, peak, peakIndex, crowd };
}

function drawChart(values) {
  const canvas = document.getElementById("flow-chart");
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const pad = 34;
  const max = Math.max(...values) * 1.1;
  const stepX = (w - pad * 2) / (values.length - 1);

  ctx.strokeStyle = "#d9e6d9";
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const y = pad + ((h - pad * 2) * i) / 4;
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(w - pad, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "#2e7d32";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  values.forEach((v, i) => {
    const x = pad + i * stepX;
    const y = h - pad - (v / max) * (h - pad * 2);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.fillStyle = "#2e7d32";
  values.forEach((v, i) => {
    const x = pad + i * stepX;
    const y = h - pad - (v / max) * (h - pad * 2);
    ctx.beginPath();
    ctx.arc(x, y, 2.8, 0, Math.PI * 2);
    ctx.fill();
  });
}

function updateFlow() {
  const range = document.getElementById("time-range").value;
  const values = flowData[range];
  const info = analyze(values);
  document.getElementById("current-count").textContent = `${info.current} 人`;
  document.getElementById("peak-hour").textContent = `${info.peakIndex + 1} 时段 (${info.peak} 人)`;
  document.getElementById("crowd-index").textContent = `${info.crowd}/100`;
  drawChart(values);
}

renderSpots();
generateRoute();
updateFlow();

document.getElementById("generate-route").addEventListener("click", generateRoute);
document.getElementById("time-range").addEventListener("change", updateFlow);
