// Custom Popup System for SheBloom
// Replaces browser alert() with beautiful styled popups

/**
 * Show a custom popup message
 * @param {string} message - The message to display
 * @param {string} type - Type of popup: 'error', 'success', 'warning', 'info'
 */
function showPopup(message, type = 'info') {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
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
        z-index: 9999;
        animation: fadeIn 0.2s ease-in-out;
    `;

    // Determine colors and icons based on type
    const typeConfig = {
        error: {
            color: '#ff6b6b',
            icon: 'fas fa-exclamation-circle',
            bgColor: '#ffe0e0'
        },
        success: {
            color: 'var(--pastel-mint)',
            icon: 'fas fa-check-circle',
            bgColor: 'var(--pastel-mint)'
        },
        warning: {
            color: 'var(--pastel-peach)',
            icon: 'fas fa-exclamation-triangle',
            bgColor: 'var(--pastel-peach)'
        },
        info: {
            color: 'var(--pastel-blue)',
            icon: 'fas fa-info-circle',
            bgColor: 'var(--pastel-blue)'
        }
    };

    const config = typeConfig[type] || typeConfig.info;

    // Create popup box
    const popup = document.createElement('div');
    popup.className = 'popup-box';
    popup.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        width: 90%;
        text-align: center;
        position: relative;
        animation: slideDown 0.3s ease-out;
    `;

    popup.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <i class="${config.icon}" style="font-size: 3rem; color: ${config.color};"></i>
        </div>
        <p style="font-size: 1.1rem; color: var(--text-dark); margin-bottom: 1.5rem; line-height: 1.6;">
            ${message}
        </p>
        <button id="popupCloseBtn" class="btn" style="background: ${config.bgColor}; color: var(--text-dark); padding: 0.75rem 2rem; border: none; border-radius: 10px; cursor: pointer; font-size: 1rem; font-weight: 600;">
            OK
        </button>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideDown {
            from { 
                transform: translateY(-50px);
                opacity: 0;
            }
            to { 
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    // Close handlers
    const closePopup = () => {
        overlay.style.animation = 'fadeOut 0.2s ease-in-out';
        setTimeout(() => {
            overlay.remove();
            style.remove();
        }, 200);
    };

    // Close on button click
    const closeBtn = document.getElementById('popupCloseBtn');
    closeBtn.addEventListener('click', closePopup);

    // Close on overlay click (click outside)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closePopup();
        }
    });

    // Auto-dismiss after 3 seconds for success/info
    if (type === 'success' || type === 'info') {
        setTimeout(closePopup, 3000);
    }

    // Add fade out animation
    style.textContent += `
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
}

/**
 * Show an error popup
 * @param {string} message - Error message to display
 */
function showErrorPopup(message) {
    showPopup(message, 'error');
}

/**
 * Show a success popup
 * @param {string} message - Success message to display
 */
function showSuccessPopup(message) {
    showPopup(message, 'success');
}

/**
 * Show a warning popup
 * @param {string} message - Warning message to display
 */
function showWarningPopup(message) {
    showPopup(message, 'warning');
}

/**
 * Show an info popup
 * @param {string} message - Info message to display
 */
function showInfoPopup(message) {
    showPopup(message, 'info');
}
