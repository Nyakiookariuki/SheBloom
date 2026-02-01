// Study Planner JavaScript
let studyTasks = JSON.parse(localStorage.getItem('shebloom_study')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayStudyTasks();
    updateStats();
    document.getElementById('addStudyTask').addEventListener('click', addStudyTask);
    
    // Set today's date as default
    document.getElementById('studyDate').valueAsDate = new Date();
});

function addStudyTask() {
    const subject = document.getElementById('studySubject').value.trim();
    const topic = document.getElementById('studyTopic').value.trim();
    const duration = document.getElementById('studyDuration').value;
    const date = document.getElementById('studyDate').value;

    if (!subject || !topic || !duration || !date) {
        alert('Please fill in all fields!');
        return;
    }

    const task = {
        subject: subject,
        topic: topic,
        duration: parseInt(duration),
        date: date,
        completed: false,
        timestamp: Date.now()
    };

    studyTasks.unshift(task);
    localStorage.setItem('shebloom_study', JSON.stringify(studyTasks));

    // Reset form
    document.getElementById('studySubject').value = '';
    document.getElementById('studyTopic').value = '';
    document.getElementById('studyDuration').value = '';
    document.getElementById('studyDate').valueAsDate = new Date();

    displayStudyTasks();
    updateStats();
    showNotification('Study task added! 📚');
}

function displayStudyTasks() {
    const studyList = document.getElementById('studyList');

    if (studyTasks.length === 0) {
        studyList.innerHTML = '<p class="empty-state">No study tasks yet. Add your first task to get started!</p>';
        return;
    }

    studyList.innerHTML = studyTasks.map((task, index) => `
        <div class="study-item ${task.completed ? 'completed' : ''}">
            <div>
                <strong>${task.subject}</strong> - ${task.topic}
                <p style="font-size: 0.9rem; color: var(--text-light); margin: 0.3rem 0 0 0;">
                    ${task.duration} minutes • ${new Date(task.date).toLocaleDateString()}
                </p>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn" onclick="toggleComplete(${index})" style="padding: 0.5rem 1rem;">
                    ${task.completed ? '<i class="fas fa-undo"></i> Undo' : '<i class="fas fa-check"></i> Complete'}
                </button>
                <button class="delete-btn" onclick="deleteTask(${index})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function toggleComplete(index) {
    studyTasks[index].completed = !studyTasks[index].completed;
    localStorage.setItem('shebloom_study', JSON.stringify(studyTasks));
    displayStudyTasks();
    updateStats();
}

function deleteTask(index) {
    showConfirmPopup('Delete this study task?', () => {
        studyTasks.splice(index, 1);
        localStorage.setItem('shebloom_study', JSON.stringify(studyTasks));
        displayStudyTasks();
        updateStats();
    });
}

function updateStats() {
    const total = studyTasks.length;
    const completed = studyTasks.filter(task => task.completed).length;
    const totalMinutes = studyTasks
        .filter(task => task.completed)
        .reduce((sum, task) => sum + task.duration, 0);
    const hours = (totalMinutes / 60).toFixed(1);

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('totalHours').textContent = hours;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--pastel-yellow);
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
