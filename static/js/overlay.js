document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.addEventListener('click', () => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 300);
        });
    }
});

function redirectToLogin() {
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.style.opacity = '0';
    }
    setTimeout(() => {
        window.location.href = "/";
    }, 300);
}