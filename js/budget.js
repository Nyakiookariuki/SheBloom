// Budget Manager JavaScript
let transactions = JSON.parse(localStorage.getItem('shebloom_budget')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayTransactions();
    updateSummary();
    document.getElementById('addTransaction').addEventListener('click', addTransaction);
    
    // Set today's date as default
    document.getElementById('transactionDate').valueAsDate = new Date();
});

function addTransaction() {
    const type = document.getElementById('transactionType').value;
    const description = document.getElementById('transactionDesc').value.trim();
    const amount = parseFloat(document.getElementById('transactionAmount').value);
    const date = document.getElementById('transactionDate').value;
    const category = document.getElementById('transactionCategory').value;

    if (!description || !amount || !date) {
        showPopup('Please fill in all fields! 💰', 'error');
        return;
    }

    if (amount <= 0) {
        showPopup('Amount must be greater than 0! 💰', 'error');
        return;
    }

    const transaction = {
        type: type,
        description: description,
        amount: amount,
        date: date,
        category: category,
        timestamp: Date.now()
    };

    transactions.unshift(transaction);
    localStorage.setItem('shebloom_budget', JSON.stringify(transactions));

    // Reset form
    document.getElementById('transactionDesc').value = '';
    document.getElementById('transactionAmount').value = '';
    document.getElementById('transactionDate').valueAsDate = new Date();

    displayTransactions();
    updateSummary();
    showNotification('Transaction added! 💰');
}

function displayTransactions() {
    const transactionList = document.getElementById('transactionList');

    if (transactions.length === 0) {
        transactionList.innerHTML = '<p class="empty-state">No transactions yet. Start tracking your finances!</p>';
        return;
    }

    transactionList.innerHTML = transactions.map((transaction, index) => `
        <div class="transaction-item ${transaction.type}">
            <div>
                <strong>${transaction.description}</strong>
                <p style="font-size: 0.9rem; color: var(--text-light); margin: 0.3rem 0 0 0;">
                    ${transaction.category} • ${new Date(transaction.date).toLocaleDateString()}
                </p>
            </div>
            <div style="display: flex; gap: 1rem; align-items: center;">
                <strong style="font-size: 1.1rem; color: ${transaction.type === 'income' ? 'green' : 'red'};">
                    ${transaction.type === 'income' ? '+' : '-'}KES ${transaction.amount.toFixed(2)}
                </strong>
                <button class="delete-btn" onclick="deleteTransaction(${index})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function deleteTransaction(index) {
    showConfirmPopup('Delete this transaction?', () => {
        transactions.splice(index, 1);
        localStorage.setItem('shebloom_budget', JSON.stringify(transactions));
        displayTransactions();
        updateSummary();
    });
}

function updateSummary() {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expense;

    document.getElementById('totalIncome').textContent = `KES ${income.toFixed(2)}`;
    document.getElementById('totalExpense').textContent = `KES ${expense.toFixed(2)}`;
    document.getElementById('balance').textContent = `KES ${balance.toFixed(2)}`;
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
