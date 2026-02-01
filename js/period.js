// Period Tracker JavaScript
let periodData = JSON.parse(localStorage.getItem('shebloom_period')) || {
    cycles: [],
    currentPeriod: null,
    symptoms: []
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayCycleInfo();
    displayCyclePhases();
    displayStats();
    displayHistory();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('startPeriod').addEventListener('click', startPeriod);
    document.getElementById('endPeriod').addEventListener('click', endPeriod);
    document.getElementById('logSymptoms').addEventListener('click', logSymptoms);

    const symptomBtns = document.querySelectorAll('.symptom-btn');
    symptomBtns.forEach(btn => {
        btn.addEventListener('click', () => toggleSymptom(btn));
    });
}

function startPeriod() {
    if (periodData.currentPeriod) {
        showPopup('Period already in progress. End current period first. 🌸', 'error');
        return;
    }

    periodData.currentPeriod = {
        startDate: new Date().toISOString(),
        endDate: null,
        symptoms: []
    };

    localStorage.setItem('shebloom_period', JSON.stringify(periodData));
    displayCycleInfo();
    displayCyclePhases();
    displayStats();
    showNotification('Period started - tracking your cycle! 🌸');
}

function endPeriod() {
    if (!periodData.currentPeriod) {
        showPopup('No active period to end. 🌸', 'error');
        return;
    }

    periodData.currentPeriod.endDate = new Date().toISOString();
    periodData.cycles.unshift({ ...periodData.currentPeriod });
    periodData.currentPeriod = null;

    localStorage.setItem('shebloom_period', JSON.stringify(periodData));
    displayCycleInfo();
    displayCyclePhases();
    displayStats();
    displayHistory();
    showNotification('Period ended - cycle recorded! ✨');
}

function displayCycleInfo() {
    const cycleInfo = document.getElementById('cycleInfo');
    const startBtn = document.getElementById('startPeriod');
    const endBtn = document.getElementById('endPeriod');

    if (!periodData.currentPeriod) {
        cycleInfo.innerHTML = '<p class="empty-state">Click "Start Period" to begin tracking</p>';
        startBtn.style.display = 'inline-block';
        endBtn.style.display = 'none';
        return;
    }

    const startDate = new Date(periodData.currentPeriod.startDate);
    const daysRunning = Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24)) + 1;

    cycleInfo.innerHTML = `
        <div class="cycle-active">
            <div style="text-align: center; margin-bottom: 1rem;">
                <i class="fas fa-circle" style="color: var(--pastel-pink); font-size: 3rem; animation: pulse 2s infinite;"></i>
            </div>
            <p style="font-size: 1.2rem; text-align: center; margin-bottom: 0.5rem;">
                <strong>Day ${daysRunning}</strong>
            </p>
            <p style="text-align: center; color: var(--text-light);">
                Started: ${startDate.toLocaleDateString()}
            </p>
        </div>
    `;

    startBtn.style.display = 'none';
    endBtn.style.display = 'inline-block';
}

function displayCyclePhases() {
    const phasesDiv = document.getElementById('cyclePhases');
    const currentPhaseDiv = document.getElementById('currentPhase');
    
    if (periodData.cycles.length === 0 && !periodData.currentPeriod) {
        phasesDiv.innerHTML = '<p class="empty-state">Start tracking to see your cycle phases</p>';
        currentPhaseDiv.innerHTML = '';
        return;
    }

    // Calculate average cycle length
    let cycleLength = 28; // Default
    if (periodData.cycles.length >= 2) {
        const cycleLengths = [];
        for (let i = 0; i < periodData.cycles.length - 1; i++) {
            const current = new Date(periodData.cycles[i].startDate);
            const previous = new Date(periodData.cycles[i + 1].startDate);
            const diff = Math.floor((current - previous) / (1000 * 60 * 60 * 24));
            if (diff > 0 && diff < 60) {
                cycleLengths.push(diff);
            }
        }
        if (cycleLengths.length > 0) {
            cycleLength = Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length);
        }
    }

    // Calculate current day of cycle
    let currentDay = 0;
    let currentPhase = '';
    
    if (periodData.currentPeriod) {
        const startDate = new Date(periodData.currentPeriod.startDate);
        currentDay = Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24)) + 1;
    } else if (periodData.cycles.length > 0) {
        const lastPeriod = new Date(periodData.cycles[0].startDate);
        currentDay = Math.floor((new Date() - lastPeriod) / (1000 * 60 * 60 * 24)) + 1;
    }

    // Determine phase based on day
    // Menstrual: Days 1-5
    // Follicular: Days 6-13
    // Ovulation: Days 14-16
    // Luteal: Days 17-28+
    
    if (currentDay >= 1 && currentDay <= 5) {
        currentPhase = 'menstrual';
    } else if (currentDay >= 6 && currentDay <= 13) {
        currentPhase = 'follicular';
    } else if (currentDay >= 14 && currentDay <= 16) {
        currentPhase = 'ovulation';
    } else {
        currentPhase = 'luteal';
    }

    // Create visual cycle representation
    const phases = [
        { name: 'Menstrual', days: '1-5', color: 'var(--pastel-pink)', icon: 'fas fa-tint' },
        { name: 'Follicular', days: '6-13', color: 'var(--pastel-mint)', icon: 'fas fa-seedling' },
        { name: 'Ovulation', days: '14-16', color: 'var(--pastel-yellow)', icon: 'fas fa-star' },
        { name: 'Luteal', days: '17-' + cycleLength, color: 'var(--pastel-lavender)', icon: 'fas fa-moon' }
    ];

    phasesDiv.innerHTML = `
        <div class="phase-timeline">
            ${phases.map(phase => `
                <div class="phase-block" style="background: ${phase.color};">
                    <i class="${phase.icon}"></i>
                    <div class="phase-name">${phase.name}</div>
                    <div class="phase-days">Days ${phase.days}</div>
                </div>
            `).join('')}
        </div>
    `;

    const phaseInfo = {
        menstrual: {
            name: 'Menstrual Phase',
            desc: 'Your period - shedding of the uterine lining',
            tips: 'Rest, stay hydrated, use heating pads for cramps'
        },
        follicular: {
            name: 'Follicular Phase',
            desc: 'Preparing for ovulation - estrogen rises',
            tips: 'Great energy levels, good time for workouts and new projects'
        },
        ovulation: {
            name: 'Ovulation Phase',
            desc: 'Most fertile days - egg is released',
            tips: 'Peak energy and mood, highest fertility'
        },
        luteal: {
            name: 'Luteal Phase',
            desc: 'Preparing for next period - progesterone rises',
            tips: 'May feel PMS symptoms, practice self-care'
        }
    };

    if (currentDay > 0 && currentDay <= cycleLength) {
        const info = phaseInfo[currentPhase];
        currentPhaseDiv.innerHTML = `
            <div class="current-phase-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h4 style="margin: 0;">Day ${currentDay} - ${info.name}</h4>
                    <span class="phase-badge" style="background: ${phases.find(p => p.name.toLowerCase() === currentPhase).color};">Current</span>
                </div>
                <p style="margin: 0.5rem 0;"><strong>${info.desc}</strong></p>
                <p style="margin: 0; color: var(--text-light); font-size: 0.9rem;"><i class="fas fa-lightbulb"></i> ${info.tips}</p>
            </div>
        `;
    } else {
        currentPhaseDiv.innerHTML = '';
    }
}

function displayStats() {
    const totalCycles = periodData.cycles.length + (periodData.currentPeriod ? 1 : 0);
    document.getElementById('totalCycles').textContent = totalCycles;

    if (periodData.cycles.length === 0) {
        document.getElementById('avgCycleLength').textContent = '--';
        document.getElementById('avgPeriodLength').textContent = '--';
        document.getElementById('nextPeriodDate').textContent = '--';
        return;
    }

    // Calculate average period length from completed cycles
    const periodLengths = periodData.cycles
        .filter(c => c.endDate)
        .map(c => {
            const start = new Date(c.startDate);
            const end = new Date(c.endDate);
            return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
        });

    const avgPeriod = periodLengths.length > 0 
        ? Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length)
        : '--';

    // Calculate cycle length (days between period starts)
    const cycleLengths = [];
    for (let i = 0; i < periodData.cycles.length - 1; i++) {
        const current = new Date(periodData.cycles[i].startDate);
        const previous = new Date(periodData.cycles[i + 1].startDate);
        const diff = Math.floor((current - previous) / (1000 * 60 * 60 * 24));
        if (diff > 0 && diff < 60) { // Reasonable range
            cycleLengths.push(diff);
        }
    }

    const avgCycle = cycleLengths.length > 0
        ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
        : 28; // Default to 28 days if no data

    // Predict next period
    let nextPeriod = '--';
    if (periodData.cycles.length > 0) {
        const lastPeriodStart = new Date(periodData.cycles[0].startDate);
        const cycleLength = cycleLengths.length > 0 ? avgCycle : 28;
        const predicted = new Date(lastPeriodStart);
        predicted.setDate(predicted.getDate() + cycleLength);
        
        const daysUntil = Math.ceil((predicted - new Date()) / (1000 * 60 * 60 * 24));
        const dateStr = predicted.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        if (daysUntil > 0) {
            nextPeriod = `${dateStr} (${daysUntil}d)`;
        } else if (daysUntil === 0) {
            nextPeriod = `${dateStr} (Today)`;
        } else {
            nextPeriod = `${dateStr} (${Math.abs(daysUntil)}d late)`;
        }
    }

    document.getElementById('avgCycleLength').textContent = cycleLengths.length > 0 ? `${avgCycle} days` : '28 days';
    document.getElementById('avgPeriodLength').textContent = avgPeriod !== '--' ? `${avgPeriod} days` : '--';
    document.getElementById('nextPeriodDate').textContent = nextPeriod;
}

function toggleSymptom(button) {
    button.classList.toggle('selected');
}

function logSymptoms() {
    const selectedSymptoms = Array.from(document.querySelectorAll('.symptom-btn.selected'))
        .map(btn => btn.dataset.symptom);
    const flowLevel = document.getElementById('flowLevel').value;
    const note = document.getElementById('symptomNote').value.trim();

    const symptomLog = {
        date: new Date().toISOString(),
        symptoms: selectedSymptoms,
        flow: flowLevel,
        note: note
    };

    periodData.symptoms.unshift(symptomLog);
    
    // Also add to current period if active
    if (periodData.currentPeriod) {
        periodData.currentPeriod.symptoms.push(symptomLog);
    }

    localStorage.setItem('shebloom_period', JSON.stringify(periodData));

    // Reset form
    document.querySelectorAll('.symptom-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('flowLevel').value = '';
    document.getElementById('symptomNote').value = '';

    displayCyclePhases();
    showNotification('Symptoms logged! 💗');
}

function displayHistory() {
    const periodList = document.getElementById('periodList');

    if (periodData.cycles.length === 0) {
        periodList.innerHTML = '<p class="empty-state">No cycle data yet. Start tracking to see your history!</p>';
        return;
    }

    periodList.innerHTML = periodData.cycles.map((cycle, index) => {
        const startDate = new Date(cycle.startDate);
        const endDate = cycle.endDate ? new Date(cycle.endDate) : null;
        const duration = endDate 
            ? Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
            : 'Ongoing';

        return `
            <div class="period-item">
                <div style="flex: 1;">
                    <strong><i class="fas fa-calendar-alt"></i> ${startDate.toLocaleDateString()}</strong>
                    ${endDate ? ` - ${endDate.toLocaleDateString()}` : ' - Present'}
                    <p style="font-size: 0.9rem; color: var(--text-light); margin: 0.3rem 0 0 0;">
                        Duration: ${duration} ${duration === 1 ? 'day' : 'days'}
                        ${cycle.symptoms.length > 0 ? ` • ${cycle.symptoms.length} symptom logs` : ''}
                    </p>
                </div>
                <button class="delete-btn" onclick="deleteCycle(${index})"><i class="fas fa-trash"></i></button>
            </div>
        `;
    }).join('');
}

function deleteCycle(index) {
    showConfirmPopup('Delete this cycle record?', () => {
        periodData.cycles.splice(index, 1);
        localStorage.setItem('shebloom_period', JSON.stringify(periodData));
        displayHistory();
        displayStats();
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--pastel-pink);
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px var(--shadow);
        z-index: 1000;
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showConfirmPopup(message, onConfirm) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    `;

    const popup = document.createElement('div');
    popup.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        text-align: center;
    `;

    popup.innerHTML = `
        <p style="font-size: 1.1rem; margin-bottom: 1.5rem; color: var(--text-dark);">${message}</p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button id="confirmYes" class="btn" style="background: var(--pastel-pink);">Yes, Delete</button>
            <button id="confirmNo" class="btn" style="background: var(--pastel-blue);">Cancel</button>
        </div>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    document.getElementById('confirmYes').addEventListener('click', () => {
        overlay.remove();
        onConfirm();
    });

    document.getElementById('confirmNo').addEventListener('click', () => {
        overlay.remove();
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}
