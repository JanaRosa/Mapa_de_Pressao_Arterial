/**
 * SISTEMA DIGITAL DE MONITORAMENTO - MAPA DE PRESSÃO ARTERIAL
 * Módulo de Controle de Interface, Gráficos e Envio de Dados
 */

let bpChart = null;
let syncMode = 'APPS_SCRIPT';
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxPpw4lCUNRd7waNw4I1kGuN0E2qV7cZETnvuSheNRp1N_cOrx4q6OadPZ_5KhPiRk-/exec';

document.addEventListener('DOMContentLoaded', () => {
  renderDays();
  initChart();
  loadLocalStorage();
  updateSummary();
});

function renderDays() {
  const container = document.getElementById('days-container');
  if (!container) return;
  container.innerHTML = '';

  for (let i = 1; i <= 7; i++) {
    const dayHtml = `
      <div class="day-card" data-day="${i}">
        <div class="day-header">Dia ${i}</div>
        <div class="day-grid">
          <div class="period-block">
            <div class="period-title">☀️ Manhã (Antes do Remédio)</div>
            <div class="form-group">
              <label for="p-m-${i}">Pressão Arterial (mmHg)</label>
              <input type="text" id="p-m-${i}" placeholder="Ex: 120/80" oninput="validateAndClassify(this)">
              <span class="help-text">Formato: 120/80</span>
              <div class="feedback-badge" id="badge-p-m-${i}"></div>
            </div>
            <div class="form-group" style="margin-top: 8px;">
              <label for="hr-m-${i}">Frequência Cardíaca (bpm)</label>
              <input type="number" id="hr-m-${i}" placeholder="Ex: 70" min="30" max="220" oninput="updateSummary()">
            </div>
          </div>

          <div class="period-block">
            <div class="period-title">🌙 Noite</div>
            <div class="form-group">
              <label for="p-n-${i}">Pressão Arterial (mmHg)</label>
              <input type="text" id="p-n-${i}" placeholder="Ex: 120/80" oninput="validateAndClassify(this)">
              <span class="help-text">Formato: 120/80</span>
              <div class="feedback-badge" id="badge-p-n-${i}"></div>
            </div>
            <div class="form-group" style="margin-top: 8px;">
              <label for="hr-n-${i}">Frequência Cardíaca (bpm)</label>
              <input type="number" id="hr-n-${i}" placeholder="Ex: 72" min="30" max="220" oninput="updateSummary()">
            </div>
          </div>
        </div>

        <div class="form-group" style="margin-top: 12px;">
          <label for="obs-${i}">Sintomas / Observações do Dia ${i}</label>
          <input type="text" id="obs-${i}" placeholder="Ex: Tontura leve, dor de cabeça...">
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', dayHtml);
  }
}

function formatPhone(input) {
  let value = input.value.replace(/\D/g, '');
  if (value.length > 11) value = value.slice(0, 11);
  if (value.length > 6) {
    input.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
  } else if (value.length > 2) {
    input.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
  } else {
    input.value = value;
  }
}

function calculateAge() {
  const birthDateInput = document.getElementById('birth-date')?.value;
  if (!birthDateInput) return;

  const birthDate = new Date(birthDateInput);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  const ageInput = document.getElementById('patient-age');
  if (ageInput) ageInput.value = age >= 0 && age <= 120 ? age : '';
}

function validateAndClassify(input) {
  const value = input.value.trim();
  const badge = document.getElementById(`badge-${input.id}`);
  const regex = /^(\d{2,3})\/(\d{2,3})$/;

  if (!badge) return;

  if (!value) {
    badge.textContent = '';
    badge.className = 'feedback-badge';
    updateSummary();
    return;
  }

  const match = value.match(regex);
  if (!match) {
    badge.textContent = '⚠️ Digite no formato 120/80';
    badge.className = 'feedback-badge bg-stage1';
    updateSummary();
    return;
  }

  const sys = parseInt(match[1]);
  const dia = parseInt(match[2]);

  let statusText = '';
  let cssClass = '';

  if (sys >= 140 && dia < 90) {
    statusText = '🟠 Hipertensão Sistólica Isolada';
    cssClass = 'bg-stage1';
  } else if (sys >= 180 || dia >= 110) {
    statusText = '🔴 Hipertensão Grave (Estágio 3)';
    cssClass = 'bg-stage2';
  } else if ((sys >= 160 && sys <= 179) || (dia >= 100 && dia <= 109)) {
    statusText = '🔴 Hipertensão Moderada (Estágio 2)';
    cssClass = 'bg-stage2';
  } else if ((sys >= 140 && sys <= 159) || (dia >= 90 && dia <= 99)) {
    statusText = '🟠 Hipertensão Leve (Estágio 1)';
    cssClass = 'bg-stage1';
  } else if ((sys >= 130 && sys <= 139) || (dia >= 85 && dia <= 89)) {
    statusText = '🟡 Normal Limítrofe';
    cssClass = 'bg-elevated';
  } else if (sys < 130 && dia < 85) {
    statusText = '🟢 Normal';
    cssClass = 'bg-normal';
  } else {
    statusText = '🟡 Normal Limítrofe';
    cssClass = 'bg-elevated';
  }

  badge.textContent = statusText;
  badge.className = `feedback-badge ${cssClass}`;

  updateSummary();
}

function updateSummary() {
  let sysList = [], diaList = [], hrList = [], count = 0;

  for (let i = 1; i <= 7; i++) {
    ['m', 'n'].forEach(period => {
      const bpVal = document.getElementById(`p-${period}-${i}`)?.value.trim();
      const hrVal = document.getElementById(`hr-${period}-${i}`)?.value.trim();

      const regex = /^(\d{2,3})\/(\d{2,3})$/;
      if (bpVal && regex.test(bpVal)) {
        const parts = bpVal.split('/');
        sysList.push(parseInt(parts[0]));
        diaList.push(parseInt(parts[1]));
        count++;
      }

      if (hrVal && !isNaN(hrVal) && hrVal !== '') {
        hrList.push(parseInt(hrVal));
      }
    });
  }

  const elTotal = document.getElementById('total-records');
  const elMissing = document.getElementById('missing-records');
  const elAvgBp = document.getElementById('avg-bp');
  const elMaxBp = document.getElementById('max-bp');
  const elMinBp = document.getElementById('min-bp');
  const elAvgHr = document.getElementById('avg-hr');

  if (elTotal) elTotal.textContent = `${count} / 14`;
  if (elMissing) elMissing.textContent = 14 - count;

  if (count > 0) {
    const avgSys = Math.round(sysList.reduce((a, b) => a + b, 0) / sysList.length);
    const avgDia = Math.round(diaList.reduce((a, b) => a + b, 0) / diaList.length);
    if (elAvgBp) elAvgBp.textContent = `${avgSys} / ${avgDia}`;

    const maxSys = Math.max(...sysList);
    const maxDiaIndex = sysList.indexOf(maxSys);
    if (elMaxBp) elMaxBp.textContent = `${maxSys} / ${diaList[maxDiaIndex]}`;

    const minSys = Math.min(...sysList);
    const minDiaIndex = sysList.indexOf(minSys);
    if (elMinBp) elMinBp.textContent = `${minSys} / ${diaList[minDiaIndex]}`;
  } else {
    if (elAvgBp) elAvgBp.textContent = '-- / --';
    if (elMaxBp) elMaxBp.textContent = '-- / --';
    if (elMinBp) elMinBp.textContent = '-- / --';
  }

  if (hrList.length > 0) {
    const avgHr = Math.round(hrList.reduce((a, b) => a + b, 0) / hrList.length);
    if (elAvgHr) elAvgHr.textContent = avgHr;
  } else {
    if (elAvgHr) elAvgHr.textContent = '--';
  }

  updateChart();
}

function initChart() {
  const canvas = document.getElementById('bpChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  bpChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['D1-M', 'D1-N', 'D2-M', 'D2-N', 'D3-M', 'D3-N', 'D4-M', 'D4-N', 'D5-M', 'D5-N', 'D6-M', 'D6-N', 'D7-M', 'D7-N'],
      datasets: [
        { label: 'Sistólica (Máxima)', data: [], borderColor: '#C5221F', backgroundColor: 'rgba(197, 34, 31, 0.1)', tension: 0.3 },
        { label: 'Diastólica (Mínima)', data: [], borderColor: '#005A9C', backgroundColor: 'rgba(0, 90, 156, 0.1)', tension: 0.3 },
        { label: 'Freq. Cardíaca (bpm)', data: [], borderColor: '#34A853', borderDash: [5, 5], tension: 0.3 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: false, min: 40, max: 200 } }
    }
  });
}

function updateChart() {
  if (!bpChart) return;

  let sysData = [], diaData = [], hrData = [];

  for (let i = 1; i <= 7; i++) {
    ['m', 'n'].forEach(period => {
      const bpVal = document.getElementById(`p-${period}-${i}`)?.value.trim();
      const hrVal = document.getElementById(`hr-${period}-${i}`)?.value.trim();
      const regex = /^(\d{2,3})\/(\d{2,3})$/;

      if (bpVal && regex.test(bpVal)) {
        const parts = bpVal.split('/');
        sysData.push(parseInt(parts[0]));
        diaData.push(parseInt(parts[1]));
      } else {
        sysData.push(null);
        diaData.push(null);
      }

      hrData.push(hrVal ? parseInt(hrVal) : null);
    });
  }

  bpChart.data.datasets[0].data = sysData;
  bpChart.data.datasets[1].data = diaData;
  bpChart.data.datasets[2].data = hrData;
  bpChart.update();
}

function collectFormData() {
  let records = [];
  for (let i = 1; i <= 7; i++) {
    records.push({
      dia: i,
      manha_pa: document.getElementById(`p-m-${i}`)?.value || '',
      manha_hr: document.getElementById(`hr-m-${i}`)?.value || '',
      noite_pa: document.getElementById(`p-n-${i}`)?.value || '',
      noite_hr: document.getElementById(`hr-n-${i}`)?.value || '',
      obs: document.getElementById(`obs-${i}`)?.value || ''
    });
  }

  return {
    paciente: {
      nome: document.getElementById('patient-name')?.value || '',
      inicio: document.getElementById('start-date')?.value || '',
      nascimento: document.getElementById('birth-date')?.value || '',
      idade: document.getElementById('patient-age')?.value || '',
      telefone: document.getElementById('patient-phone')?.value || '',
      observacoes_gerais: document.getElementById('general-notes')?.value || ''
    },
    registros: records
  };
}

async function saveData() {
  const payload = collectFormData();
  localStorage.setItem('mapa_pa_data', JSON.stringify(payload));

  if (syncMode === 'LOCAL') {
    alert('✅ Informações salvas localmente no navegador!');
    return;
  }

  const saveBtn = document.querySelector('button[onclick="saveData()"]');
  const originalText = saveBtn ? saveBtn.textContent : '';
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = '⏳ Processando e Enviando...';
  }

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    alert('✅ Dados registrados! A planilha individual foi gerada no Google Drive.');
  } catch (err) {
    alert('❌ Erro ao conectar com o Google Apps Script: ' + err.message);
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = originalText;
    }
  }
}

function loadLocalStorage() {
  const saved = localStorage.getItem('mapa_pa_data');
  if (!saved) return;

  try {
    const data = JSON.parse(saved);
    if (data.paciente) {
      if (document.getElementById('patient-name')) document.getElementById('patient-name').value = data.paciente.nome || '';
      if (document.getElementById('start-date')) document.getElementById('start-date').value = data.paciente.inicio || '';
      if (document.getElementById('birth-date')) document.getElementById('birth-date').value = data.paciente.nascimento || '';
      if (document.getElementById('patient-age')) document.getElementById('patient-age').value = data.paciente.idade || '';
      if (document.getElementById('patient-phone')) document.getElementById('patient-phone').value = data.paciente.telefone || '';
      if (document.getElementById('general-notes')) document.getElementById('general-notes').value = data.paciente.observacoes_gerais || '';
    }

    if (data.registros && Array.isArray(data.registros)) {
      data.registros.forEach(r => {
        const pm = document.getElementById(`p-m-${r.dia}`);
        const hrm = document.getElementById(`hr-m-${r.dia}`);
        const pn = document.getElementById(`p-n-${r.dia}`);
        const hrn = document.getElementById(`hr-n-${r.dia}`);
        const obs = document.getElementById(`obs-${r.dia}`);

        if (pm) pm.value = r.manha_pa || '';
        if (hrm) hrm.value = r.manha_hr || '';
        if (pn) pn.value = r.noite_pa || '';
        if (hrn) hrn.value = r.noite_hr || '';
        if (obs) obs.value = r.obs || '';

        if (pm) validateAndClassify(pm);
        if (pn) validateAndClassify(pn);
      });
    }
  } catch (e) {
    console.error('Erro ao carregar do localStorage:', e);
  }
}