document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const closeBtn = document.getElementById('close-overlay');
    const copyBtn = document.getElementById('copy-btn');
    const tempPassword = document.getElementById('temp-password');

    // close overlay
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        });
    }

    // copy temporary password to clipboard
    if (copyBtn && tempPassword) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(tempPassword.textContent)
                .then(() => {
                    alert("Temporary password copied!");
                })
                .catch(() => {
                    alert("Failed to copy password.");
                });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const messageText = overlay ? overlay.textContent : "";

    if (overlay) {
        overlay.addEventListener('click', () => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                // redirect to dashboard if login successful, otherwise redirect to login page
                if (messageText.includes("Login successful")) {
                    window.location.href = "/dashboard";
                } else {
                    window.location.href = "/";
                }
            }, 300);
        });
    }
});