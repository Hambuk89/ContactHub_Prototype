// Search filter
function filterContacts() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.contact-card');
            
    cards.forEach(card => {
        const name = card.querySelector('.contact-name').textContent.toLowerCase();
        card.style.display = name.includes(input) ? 'block' : 'none';
    });
}

// Sort function
function sortContacts() {
    const sortValue = document.getElementById('sortSelect').value;
    const grid = document.getElementById('contactGrid');
    const cards = Array.from(grid.querySelectorAll('.contact-card'));

    cards.sort((a, b) => {
        const nameA = a.querySelector('.contact-name').textContent.toLowerCase();
        const nameB = a.querySelector('.contact-name').textContent.toLowerCase();

        if (sortValue === 'az') return nameA.localeCompare(nameB);
        if (sortValue === 'za') return nameB.localeCompare(nameA);
        return 0;
                
    });

    grid.innerHTML = '';
    cards.forEach(card => grid.appendChild(card));
}

// Alphabetical filter
function filterByLetter(letter) {
    const cards = document.querySelectorAll('.contact-card');
           
    cards.forEach(card => {
        const name = card.querySelector('.contact-name').textContent.toUpperCase();
        const firstChar = name.charAt(0);
                
        if (letter === 'ALL' || name.startsWith(letter)) {
            card.style.display = 'block';
        } else if (letter === '#') {
            card.style.display = /^[^A-Z]/.test(firstChar) ? 'block' : 'none';
        } else {
            card.style.display = firstChar === letter ? 'block' : 'none';
        }
    });
}
  