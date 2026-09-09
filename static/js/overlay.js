document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const closeBtn = document.getElementById('close-overlay');
    const copyBtn = document.getElementById('copy-btn');
    const tempPassword = document.getElementById('temp-password');

    // close overlay
    if (closeBtn) {
        closeBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        });
    }

    // copy temporary password to clipboard
    if (copyBtn && tempPassword) {
        copyBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            navigator.clipboard.writeText(tempPassword.textContent.trim())
                .then(() => {
                    alert("Temporary password copied!");
                })
                .catch(() => {
                    alert("Failed to copy password.");
                });
        });
    }
    
    // overlay click redirect
    if (overlay && !copyBtn) {
        const messageText = overlay.textContent;

        overlay.addEventListener('click', () => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (messageText.includes("Login successful")) {
                    window.location.href = "/dashboard";
                } else {
                    window.location.href = "/";
                }
            }, 300);
        });
    }
});
