const container = document.querySelector('.container');
window.addEventListener('load', function () {
    container.style.transition = 'all 1s ease-in';  
});

let BO = false;
// Subtle parallax mouse tracking only for desktop pointer devices
function DynamicRunner() {
    if (window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        window.addEventListener('mousemove', function(a) {
            container.style.transition = 'all 0.05s ease-out';  
            const HfWidth = document.documentElement.clientWidth / 2;
            container.style.left = ((a.clientX - HfWidth) / 60) + 'px';
        });
    }
}
DynamicRunner();

// Play GIF icons only ONCE per hover/tap
document.querySelectorAll('.container button img, .container .avatar-circle img').forEach(img => {
    const originalSrc = img.getAttribute('src');

    // Calculate exact duration of each GIF animation so it runs only ONCE
    let duration = 2520;
    if (originalSrc.includes('1141-email')) {
        duration = 2020;
    } else if (originalSrc.includes('680-avatar')) {
        duration = 2270;
    }

    // Create a canvas to hold the static first frame of the GIF
    const canvas = document.createElement('canvas');
    canvas.className = 'icon-static';
    img.parentNode.insertBefore(canvas, img);

    function captureFirstFrame() {
        canvas.width = img.naturalWidth || 80;
        canvas.height = img.naturalHeight || 80;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        img.style.display = 'none'; // Keep the animated GIF hidden initially
    }

    if (img.complete && img.naturalWidth !== 0) {
        captureFirstFrame();
    } else {
        img.addEventListener('load', captureFirstFrame, { once: true });
    }

    let playTimer = null;
    const trigger = img.closest('button, .avatar-circle');

    function playGifOnce() {
        clearTimeout(playTimer);
        canvas.style.display = 'none';
        img.style.display = 'block';

        // Restart the GIF animation from frame 1
        img.src = originalSrc.split('#')[0] + '#' + Date.now();

        // Stop the animation after exactly 1 playback cycle
        playTimer = setTimeout(() => {
            img.style.display = 'none';
            canvas.style.display = 'block';
        }, duration);
    }

    if (trigger) {
        trigger.addEventListener('mouseenter', playGifOnce);

        trigger.addEventListener('mouseleave', () => {
            clearTimeout(playTimer);
            img.style.display = 'none';
            canvas.style.display = 'block';
        });

        // Also trigger on touch/tap for mobile
        trigger.addEventListener('touchstart', playGifOnce, { passive: true });
    }
});

// Click handling for social buttons (open URLs in blank tab & copy email)
const socialBtns = document.querySelectorAll(".social-buttons button");
socialBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Trigger wobble animation
        btn.style.animation = 'none';
        btn.offsetHeight;
        btn.style.animation = 'rot 0.6s linear';

        // 1. External Links: LinkedIn, GitHub, Instagram
        const url = btn.getAttribute('data-url');
        if (url) {
            window.open(url, '_blank');
        }

        // 2. Email button: Copy email to clipboard & show "Copied!" text
        if (btn.classList.contains('email')) {
            const email = btn.getAttribute('data-email') || 'y4610091@gmail.com';
            navigator.clipboard.writeText(email).then(() => {
                const btnWrap = btn.closest('.btn-wrap');
                const tooltip = btnWrap ? btnWrap.querySelector('p') : null;
                if (tooltip) {
                    tooltip.textContent = 'Copied! ✓';
                    tooltip.classList.remove('copied');
                    void tooltip.offsetWidth; // re-trigger transition
                    tooltip.classList.add('copied');
                }
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        }
    });
});

// Reset Email tooltip back to "Email" ONLY after the mouse/touch has left the button
const emailButton = document.querySelector('.social-buttons button.email');
if (emailButton) {
    const emailWrap = emailButton.closest('.btn-wrap');
    const emailTooltip = emailWrap ? emailWrap.querySelector('p') : null;
    let resetTimer = null;

    if (emailWrap) {
        emailWrap.addEventListener('mouseleave', () => {
            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => {
                if (!emailWrap.matches(':hover') && emailTooltip) {
                    emailTooltip.classList.remove('copied');
                    emailTooltip.textContent = 'Email';
                }
            }, 300);
        });

        emailWrap.addEventListener('mouseenter', () => {
            clearTimeout(resetTimer);
        });
    }
}

// Avatar circle skills speech bubble toggle for mobile touch
const avatarCircle = document.querySelector('.avatar-circle');
if (avatarCircle) {
    avatarCircle.addEventListener('click', (e) => {
        // If clicking on or inside the bubble itself, don't toggle off immediately
        if (e.target.closest('p')) return;
        avatarCircle.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!avatarCircle.contains(e.target)) {
            avatarCircle.classList.remove('active');
        }
    });
}

// About Me modal controls (reliable for both mobile touch & desktop)
const aboutBtn = document.querySelector('.about');
const meCard = document.querySelector('.me');
const fogBackdrop = document.querySelector('.fog-backdrop');
const meCloseBtn = document.getElementById('meCloseBtn');

function openAboutModal() {
    if (meCard) meCard.classList.add('active');
    if (fogBackdrop) fogBackdrop.classList.add('active');
}

function closeAboutModal() {
    if (meCard) meCard.classList.remove('active');
    if (fogBackdrop) fogBackdrop.classList.remove('active');
    if (aboutBtn) aboutBtn.blur();
}

if (aboutBtn) {
    aboutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (meCard && meCard.classList.contains('active')) {
            closeAboutModal();
        } else {
            openAboutModal();
        }
    });

    aboutBtn.addEventListener('focus', openAboutModal);
}

if (meCloseBtn) {
    meCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAboutModal();
    });
}

if (fogBackdrop) {
    fogBackdrop.addEventListener('click', closeAboutModal);
}