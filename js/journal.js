// Journal JavaScript
let journals = JSON.parse(localStorage.getItem('shebloom_journals')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayJournals();
    document.getElementById('saveJournal').addEventListener('click', saveJournal);
});

function saveJournal() {
    const title = document.getElementById('journalTitle').value.trim();
    const content = document.getElementById('journalContent').value.trim();

    if (!content) {
        showPopup('Please write something first!', 'warning');
        return;
    }

    const journalEntry = {
        title: title || 'Untitled',
        content: content,
        date: new Date().toLocaleString(),
        timestamp: Date.now()
    };

    journals.unshift(journalEntry);
    localStorage.setItem('shebloom_journals', JSON.stringify(journals));

    // Reset form
    document.getElementById('journalTitle').value = '';
    document.getElementById('journalContent').value = '';

    displayJournals();
    showNotification('Journal entry saved! 📖');
}

function displayJournals() {
    const journalList = document.getElementById('journalList');

    if (journals.length === 0) {
        journalList.innerHTML = '<p class="empty-state">No journal entries yet. Start writing your story!</p>';
        return;
    }

    journalList.innerHTML = journals.map((entry, index) => `
        <div class="journal-item">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div style="flex: 1;">
                    <h4>${entry.title}</h4>
                    <div class="journal-date">${entry.date}</div>
                    <p>${entry.content}</p>
                </div>
                <button class="delete-btn" onclick="deleteJournal(${index})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function deleteJournal(index) {
    showConfirmPopup('Delete this journal entry?', () => {
        journals.splice(index, 1);
        localStorage.setItem('shebloom_journals', JSON.stringify(journals));
        displayJournals();
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--pastel-peach);
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
