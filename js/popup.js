// Custom Popup System for SheBloom
function showPopup(message, type = 'info') {
    // Remove any existing popup
    const existingPopup = document.querySelector('.shebloom-popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    // Create popup elements
    const overlay = document.createElement('div');
    overlay.className = 'shebloom-popup-overlay';
    
    const popup = document.createElement('div');
    popup.className = `shebloom-popup shebloom-popup-${type}`;
    
    // Icon based on type
    const icons = {
        error: 'fa-exclamation-circle',
        success: 'fa-check-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const colors = {
        error: '#ff6b9d',
        success: '#90ee90',
        warning: '#ffd700',
        info: '#87ceeb'
    };
    
    popup.innerHTML = `
        <div class="shebloom-popup-icon">
            <i class="fas ${icons[type]}" style="color: ${colors[type]};"></i>
        </div>
        <div class="shebloom-popup-message">${message}</div>
        <button class="shebloom-popup-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .shebloom-popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .shebloom-popup {
            background: white;
            padding: 25px 30px;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            max-width: 400px;
            width: 90%;
            position: relative;
            display: flex;
            align-items: center;
            gap: 15px;
            animation: popIn 0.3s ease;
        }
        
        .shebloom-popup-icon {
            font-size: 32px;
            flex-shrink: 0;
        }
        
        .shebloom-popup-message {
            flex: 1;
            font-size: 16px;
            color: #333;
            line-height: 1.5;
        }
        
        .shebloom-popup-close {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 20px;
            color: #999;
            cursor: pointer;
            padding: 5px;
            transition: color 0.2s;
        }
        
        .shebloom-popup-close:hover {
            color: #333;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes popIn {
            from {
                transform: scale(0.8);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }
    `;
    
    document.head.appendChild(style);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    // Close handlers
    const closePopup = () => {
        overlay.style.animation = 'fadeIn 0.3s ease reverse';
        popup.style.animation = 'popIn 0.3s ease reverse';
        setTimeout(() => overlay.remove(), 300);
    };
    
    popup.querySelector('.shebloom-popup-close').addEventListener('click', closePopup);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closePopup();
    });
    
    // Auto-close after 5 seconds for success/info
    if (type === 'success' || type === 'info') {
        setTimeout(closePopup, 5000);
    }
}