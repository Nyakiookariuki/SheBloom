// Mood Tracker JavaScript
let moods = JSON.parse(localStorage.getItem('shebloom_moods')) || [];
let selectedMood = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayMoods();
    setupEventListeners();
});

function setupEventListeners() {
    const moodButtons = document.querySelectorAll('.mood-btn');
    moodButtons.forEach(btn => {
        btn.addEventListener('click', () => selectMood(btn));
    });

    document.getElementById('saveMood').addEventListener('click', saveMood);
}

function selectMood(button) {
    // Remove selected class from all buttons
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selected class to clicked button
    button.classList.add('selected');
    selectedMood = button.dataset.mood;
}

function saveMood() {
    if (!selectedMood) {
        showPopup('Please select a mood first! 🌸', 'error');
        return;
    }

    const note = document.getElementById('moodNote').value.trim();
    const moodEntry = {
        mood: selectedMood,
        note: note,
        date: new Date().toLocaleString(),
        timestamp: Date.now()
    };

    moods.unshift(moodEntry);
    localStorage.setItem('shebloom_moods', JSON.stringify(moods));

    // Reset form
    document.getElementById('moodNote').value = '';
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    selectedMood = null;

    displayMoods();
    showNotification('Mood saved successfully! 🌸');
}

function displayMoods() {
    const moodList = document.getElementById('moodList');
    
    if (moods.length === 0) {
        moodList.innerHTML = '<p class="empty-state">No mood entries yet. Start tracking your feelings!</p>';
        return;
    }

    const moodEmojis = {
        amazing: '<i class="fas fa-star" style="color: var(--pastel-yellow);"></i>',
        happy: '<i class="fas fa-smile" style="color: var(--pastel-mint);"></i>',
        okay: '<i class="fas fa-meh" style="color: var(--pastel-blue);"></i>',
        sad: '<i class="fas fa-sad-tear" style="color: var(--pastel-lavender);"></i>',
        stressed: '<i class="fas fa-tired" style="color: var(--pastel-peach);"></i>'
    };

    moodList.innerHTML = moods.map((entry, index) => `
        <div class="mood-item">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${moodEmojis[entry.mood]} ${entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}</strong>
                    <p style="font-size: 0.9rem; color: var(--text-light); margin: 0.5rem 0 0 0;">${entry.date}</p>
                </div>
                <button class="delete-btn" onclick="deleteMood(${index})"><i class="fas fa-trash"></i></button>
            </div>
            ${entry.note ? `<p style="margin-top: 0.5rem;">${entry.note}</p>` : ''}
        </div>
    `).join('');
}

function deleteMood(index) {
    showConfirmPopup('Delete this mood entry?', () => {
        moods.splice(index, 1);
        localStorage.setItem('shebloom_moods', JSON.stringify(moods));
        displayMoods();
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--pastel-mint);
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