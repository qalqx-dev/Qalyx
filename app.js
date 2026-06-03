// QALQX SYSTEM KERNEL v2.0
document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- 1. THEME LOADER ---
    const savedTheme = localStorage.getItem('qalqx-theme') || 'default';
    if(savedTheme !== 'default') {
        document.body.classList.add(savedTheme);
    }

    // --- 2. HAPTIC ENGINE ---
    const buttons = document.querySelectorAll('button, .card, .back-btn, input[type="range"], .chip, .app-card, .dock-item');
    buttons.forEach(btn => {
        const trigger = (event) => {
            if (event.type === 'click' || event.type === 'touchstart' || event.type === 'pointerdown') {
                if(localStorage.getItem('qalqx-haptics') !== 'off' && navigator.vibrate) {
                    navigator.vibrate(10);
                }
            }
        };
        btn.addEventListener('click', trigger);
        btn.addEventListener('touchstart', trigger, { passive: true });
        btn.addEventListener('pointerdown', trigger, { passive: true });
    });

    // --- 3. INPUT ANIMATION ---
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(inp => {
        inp.addEventListener('focus', () => {
            if(localStorage.getItem('qalqx-haptics') !== 'off' && navigator.vibrate) {
                navigator.vibrate(5);
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        const target = event.target;
        const isTyping = target && /INPUT|TEXTAREA|SELECT/.test(target.tagName);
        if (isTyping) return;

        if (event.key === '/' || event.key === '?') {
            event.preventDefault();
            const search = document.getElementById('search');
            if (search) {
                search.focus();
                search.select();
                if (navigator.vibrate) navigator.vibrate(8);
            }
        }

        if (event.key === 'h' && !event.metaKey && !event.ctrlKey) {
            const firstCard = document.querySelector('.app-card');
            if (firstCard) firstCard.focus();
        }
    }, { passive: false });

    if (!reduceMotion && 'DeviceMotionEvent' in window) {
        let lastShake = 0;
        window.addEventListener('devicemotion', (e) => {
            const a = e.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };
            const force = Math.sqrt((a.x || 0) ** 2 + (a.y || 0) ** 2 + (a.z || 0) ** 2);
            if (force > 18 && Date.now() - lastShake > 900) {
                lastShake = Date.now();
                if (navigator.vibrate) navigator.vibrate([12, 18, 12]);
            }
        }, { passive: true });
    }

    console.log("QALQX System Online. Theme:", savedTheme);
});

// GLOBAL UTILS
function saveTheme(themeName) {
    // Remove old themes
    document.body.classList.remove('theme-green', 'theme-gold', 'theme-red', 'theme-light');
    
    // Add new (unless default)
    if(themeName !== 'default') {
        document.body.classList.add(themeName);
    }
    
    // Save to memory
    localStorage.setItem('qalqx-theme', themeName);
}
/* --- 4. TOAST NOTIFICATION SYSTEM --- */
// Call showToast("Message") from any tool to use this.

const style = document.createElement('style');
style.innerHTML = `
    .toast-box {
        position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%) translateY(100px);
        background: rgba(30, 30, 30, 0.9); border: 1px solid var(--primary);
        color: #fff; padding: 12px 24px; border-radius: 50px;
        font-size: 0.9rem; box-shadow: 0 5px 20px rgba(0,0,0,0.5);
        opacity: 0; transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        z-index: 1000; pointer-events: none; white-space: nowrap;
        display: flex; align-items: center; gap: 8px;
    }
    .toast-box.show { transform: translateX(-50%) translateY(0); opacity: 1; }
`;
document.head.appendChild(style);

// Create the element once
const toastEl = document.createElement('div');
toastEl.className = 'toast-box';
toastEl.id = 'sysToast';
document.body.appendChild(toastEl);

function showToast(msg, type = 'info') {
    const t = document.getElementById('sysToast');
    let icon = 'ℹ️';
    if(type === 'success') icon = '✅';
    if(type === 'error') icon = '⚠️';
    
    t.innerHTML = `<span>${icon}</span> ${msg}`;
    t.classList.add('show');
    
    // Haptic
    if(navigator.vibrate) navigator.vibrate(30);

    // Hide after 3s
    setTimeout(() => {
        t.classList.remove('show');
    }, 3000);
}

// Override standard alert with Toast for better UI
window.alert = function(msg) {
    showToast(msg);
};
