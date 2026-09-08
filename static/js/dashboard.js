/* Global Variables */
let contacts = window.initialContacts || [];
let filteredContacts = [...contacts];
let manageMode = false;
let selectedCards = new Set();
let deleteAllBtn = null;

/* DOM Elements */
const contactGrid = document.getElementById("contactGrid");
const emptyText = document.getElementById("empty-text");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

/* Render Contact Cards */
function renderContacts(list) {
    if (!contactGrid) return;

    if (list.length === 0) {
        contactGrid.innerHTML = "";
        if (emptyText) emptyText.style.display = "block";
        return;
    }

    if (emptyText) emptyText.style.display = "none";

    contactGrid.innerHTML = list.map(contact => 
    `
        <div 
            class="contact-card" 
            data-id="${contact.id}" 
            data-tag-work="${contact.tag_work ? 'true' : 'false'}"
            data-tag-family="${contact.tag_family ? 'true' : 'false'}"
            data-tag-friend="${contact.tag_friend ? 'true' : 'false'}"
            data-tag-other="${contact.tag_other ? 'true' : 'false'}"
        >
            <div class="contact-img">${contact.name ? contact.name[0].toUpperCase() : ''}</div>
            <div class="contact-info">
                <p class="contact-name">${contact.name}</p>
                <p class="contact-number">${contact.phone}</p>
                <p class="contact-email">${contact.email}</p>
            </div>
        </div>
    `).join("");

    if (manageMode) {
        enableManageMode();
    } else {
        enableSingleView();
    }
}

/* Single card click → CONTACT DETAIL overlay */
function enableSingleView() {
    const cards = document.querySelectorAll('.contact-card');

    cards.forEach(card => {
        card.style.cursor = 'pointer';
        card.onclick = () => {
            if (!manageMode) openContactDetailOverlay(card);
        };
    });
}

/* Manage Contact Mode */ 
function enableManageMode() {
    manageMode = true;
    selectedCards.clear();

    const cards = document.querySelectorAll('.contact-card');

    cards.forEach(card => {
        card.style.cursor = 'pointer';

        card.onclick = () => {
            toggleCardSelection(card);
            updateDeleteAllButton(card);
        };

        card.onmouseenter = () => {
            if (manageMode && !selectedCards.has(card)) {
                card.style.backgroundColor = 'rgba(67, 195, 198, 0.2)';
            }
        };

        card.onmouseleave = () => {
            if (manageMode && !selectedCards.has(card)) {
                card.style.backgroundColor = '#FFFFFF';
            }
        };
    });
}


/* Initialize Dashboard */
function initDashboard() {
    renderContacts(contacts);

    if (searchInput) {
        searchInput.addEventListener('input', filterContacts);
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', sortContacts);
    }

    const manageBtn = document.getElementById('manageContactsBtn');
    if (manageBtn) {
        manageBtn.addEventListener('click', () => {
            manageMode = true;
            renderContacts(filteredContacts);

            showDashboardMessage(
                'Select the contacts you want to delete'
            );
        });
    }
}

/* Message popup (Manage Contacts) */
function showDashboardMessage(message) {
    const existingOverlay = document.getElementById(
        'dashboard-message-overlay'
    );

    if (existingOverlay) {
        existingOverlay.remove();
    }

    const overlay = document.createElement('div');
    overlay.id = 'dashboard-message-overlay';
    overlay.className = 'dashboard-message-overlay';

    const messageBox = document.createElement('div');
    messageBox.className = 'dashboard-message-box';
    messageBox.textContent = message;

    overlay.appendChild(messageBox);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => {
        overlay.remove();
    });
}

/* Toggle Selection */
function toggleCardSelection(card) {
    if (selectedCards.has(card)) {
        selectedCards.delete(card);
        card.style.backgroundColor = '#FFFFFF';
    } else {
        selectedCards.add(card);
        card.style.backgroundColor = 'rgba(67,195,198,0.5)';
    }
}

/* Delete All Button Implementation */
function updateDeleteAllButton(card) {
    if (selectedCards.size > 0) {
        if (!deleteAllBtn) {
            deleteAllBtn = document.createElement('button');
            deleteAllBtn.className = 'delete-all-btn';
            deleteAllBtn.textContent = 'DELETE ALL';

            deleteAllBtn.addEventListener(
                'click',
                openDeleteSelectedContactsOverlay
            );

            document.body.appendChild(deleteAllBtn);
        }

        const selectedCardList = Array.from(selectedCards);
        const targetCard =
            selectedCardList[selectedCardList.length - 1];

        const rect = targetCard.getBoundingClientRect();

        deleteAllBtn.style.position = 'fixed';
        deleteAllBtn.style.display = 'block';
        deleteAllBtn.style.left = `${rect.left + rect.width / 2}px`;
        deleteAllBtn.style.top = `${rect.top + rect.height / 2}px`;
        deleteAllBtn.style.transform = 'translate(-50%, -50%)';
    } else {
        if (deleteAllBtn) {
            deleteAllBtn.style.display = 'none';
        }
    }
}

/* Selected Card Deletion */
function deleteSelectedContacts() {
    selectedCards.forEach(card => {
        const id = card.getAttribute('data-id');
        contacts = contacts.filter(c => String(c.id) !== String(id));
        filteredContacts = filteredContacts.filter(c => String(c.id) !== String(id));
        card.remove();
    });

    selectedCards.clear();

    if (deleteAllBtn) {
        deleteAllBtn.style.display = 'none';
    }

    if (contacts.length === 0 && emptyText) {
        emptyText.style.display = 'block';
    }
}

/* Search Filter */
function filterContacts() {
    const keyword = (searchInput?.value || "").toLowerCase();
    filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(keyword));
    renderContacts(filteredContacts);
}

/* Sort Function */
function sortContacts() {
    const option = sortSelect?.value;

    if (option === "latest") {
        filteredContacts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (option === "oldest") {
        filteredContacts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (option === "AZ") {
        filteredContacts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (option === "ZA") {
        filteredContacts.sort((a, b) => b.name.localeCompare(a.name));
    } else if (option === "tagged") {
        filteredContacts.sort((a, b) => {
            const aIsTagged = hasAnyTag(a);
            const bIsTagged = hasAnyTag(b);
            return Number(bIsTagged) - Number(aIsTagged);
        });
    }

    renderContacts(filteredContacts);
}

/* Sort Tagged Contacts */
function hasAnyTag(contact) {
    return Boolean(
        contact.tag_work ||
        contact.tag_family ||
        contact.tag_friend ||
        contact.tag_other
    );
}

/* Alphabet Filter */
function filterByLetter(letter) {
    if (letter === "ALL") {
        filteredContacts = [...contacts];
    } else if (letter === "#") {
        filteredContacts = contacts.filter(c => !/^[A-Za-z]/.test(c.name));
    } else {
        filteredContacts = contacts.filter(c => c.name.toUpperCase().startsWith(letter));
    }

    renderContacts(filteredContacts);
}

/* Dashboard Message Boxes */
function setupDashboardMessage() {
    const messageOverlay = document.getElementById(
        'dashboard-message-overlay'
    );

    if (!messageOverlay) {
        return;
    }

    messageOverlay.addEventListener('click', () => {
        messageOverlay.classList.add('is-closing');

        setTimeout(() => {
            messageOverlay.remove();
        }, 200);
    });
}

document.addEventListener('DOMContentLoaded', setupDashboardMessage);


document.addEventListener("DOMContentLoaded", initDashboard);

/* Export Functions */
window.filterContacts = filterContacts;
window.sortContacts = sortContacts;
window.filterByLetter = filterByLetter;

