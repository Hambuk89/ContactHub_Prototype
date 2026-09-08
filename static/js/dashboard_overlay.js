/* Dashboard Overlay Functions */
function createDashboardOverlay(title, contentHTML, footerHTML, customClass = "dashboard-overlay-box", showInitials = true, contactName = null) {
    const overlay = document.createElement('div');
    overlay.className = 'dashboard-overlay';

    const initials = contactName
        ? contactName.split(" ")[0][0].toUpperCase()
        : getUserInitials();

    overlay.innerHTML = `
        <div class="${customClass}">
            <div class="dashboard-overlay-header">
                <h3 class="dashboard-overlay-title">${title}</h3>
                <button class="dashboard-overlay-close">×</button>
            </div>
            ${showInitials ? `
            <div class="dashboard-overlay-profile">
                <div class="dashboard-profile-circle">
                    <span class="dashboard-profile-initials">${initials}</span>
                </div>
            </div>` : ""}
            <div class="dashboard-overlay-content">
                ${contentHTML}
            </div>
            <div class="dashboard-overlay-footer">
                ${footerHTML}
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const closeButtons = overlay.querySelectorAll('.dashboard-overlay-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => overlay.remove());
});

    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.remove();
    });
}

/* Get User Initials */
function getUserInitials() {
    const username = currentUser.username || "";
    const parts = username.split(" ");
    const first = parts[0][0] || "";
    const last = parts[1] ? parts[1][0] : "";
    return (first + last).toUpperCase();
}

/* CONTACT DETAIL (from card) */
function openContactDetailOverlay(card) {
    const name = card.querySelector('.contact-name').textContent;
    const phone = card.querySelector('.contact-number').textContent;
    const email = card.querySelector('.contact-email').textContent;
    const id = card.getAttribute('data-id');

    const tags = [];
    if (card.dataset.tagWork === 'true') {
        tags.push('Work');
    }
    if (card.dataset.tagFamily === 'true') {
        tags.push('Family');
    }
    if (card.dataset.tagFriend === 'true') {
        tags.push('Friend');
    }
    if (card.dataset.tagOther === 'true') {
        tags.push('Other');
    }
    const tagsHTML = tags.length > 0
        ? tags
            .map(tag => `<span class="contact-tag">${tag}</span>`)
            .join('')
        : `<span class="contact-no-tags">No tags selected</span>`;

    const content = `
        <div class="dashboard-info-box">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email}</p>

            <div class="contact-tags-section">
                <strong>Tags:</strong>
                <div class="contact-tag-list">
                    ${tagsHTML}
                </div>
            </div>
        </div>
    `;

    const footer = `
        <button class="dashboard-btn dashboard-btn-primary" onclick="fetchContactAndEdit(${id})">EDIT</button>
        <button class="dashboard-btn dashboard-btn-danger" onclick="openDeleteContactOverlay(${id})">DELETE</button>
    `;

    createDashboardOverlay("CONTACT DETAIL", content, footer, "dashboard-overlay-box", true, name);
}

/* FETCH CONTACT JSON → EDIT OVERLAY */
function fetchContactAndEdit(contactId) {
    fetch(`/contact/${contactId}/json`)
        .then(res => res.json())
        .then(contact => openEditContactOverlay(contact));
}

/* EDIT CONTACT */
function openEditContactOverlay(contact) {
    const content = `
        <form id="editContactForm" class="dashboard-form" method="POST" action="/contact/${contact.id}/update">
            <input class="dashboard-input" type="text" name="name" value="${contact.name}" required>
            <input class="dashboard-input" type="text" name="phone" value="${contact.phone}" required>
            <input class="dashboard-input" type="email" name="email" value="${contact.email}" required>
            <input class="dashboard-input" type="text" name="address" value="${contact.address}" required>

            <div class="dashboard-checkbox-group">
                <label><input type="checkbox" name="work" ${contact.tag_work ? "checked" : ""}> Work</label>
                <label><input type="checkbox" name="family" ${contact.tag_family ? "checked" : ""}> Family</label>
                <label><input type="checkbox" name="friend" ${contact.tag_friend ? "checked" : ""}> Friend</label>
                <label><input type="checkbox" name="other" ${contact.tag_other ? "checked" : ""}> Other</label>
            </div>
        </form>
    `;

    const footer = `
        <button type="submit" form="editContactForm" class="dashboard-btn dashboard-btn-primary">SAVE</button>
        <button class="dashboard-btn dashboard-btn-cancel dashboard-overlay-close">CANCEL</button>
    `;

    createDashboardOverlay("EDIT CONTACT", content, footer);
}

/* ADD CONTACT */
function openAddContactOverlay() {
    const content = `
        <form id="addContactForm" class="dashboard-form" method="POST" action="/contact/add">
            <input class="dashboard-input" type="text" name="name" placeholder="Name (first and last name)" required>
            <input class="dashboard-input" type="text" name="phone" placeholder="Phone Number" required>
            <input class="dashboard-input" type="email" name="email" placeholder="Email">
            <input class="dashboard-input" type="text" name="address" placeholder="Address">

            <div class="dashboard-checkbox-group">
                <label><input type="checkbox" name="work"> Work</label>
                <label><input type="checkbox" name="family"> Family</label>
                <label><input type="checkbox" name="friend"> Friend</label>
                <label><input type="checkbox" name="other"> Other</label>
            </div>
        </form>
    `;

    const footer = `
        <button type="submit" form="addContactForm" class="dashboard-btn dashboard-btn-primary">ADD</button>
        <button class="dashboard-btn dashboard-btn-cancel dashboard-overlay-close">CANCEL</button>
    `;

    createDashboardOverlay("ADD CONTACT", content, footer, "dashboard-overlay-box", false);
}


/* VIEW USER PROFILE */
function openProfileOverlay() {
    const content = `
        <div class="dashboard-info-box">
            <p><strong>Name:</strong> ${currentUser.username}</p>
            <p><strong>Password:</strong> ********</p>
            <p><strong>Phone:</strong> ${currentUser.phone}</p>
            <p><strong>Email:</strong> ${currentUser.email}</p>
            <p><strong>Address:</strong> ${currentUser.address}</p>
        </div>
    `;

    const footer = `
        <button class="dashboard-btn dashboard-btn-primary" onclick="openProfileEditOverlay()">EDIT</button>
        <button class="dashboard-btn dashboard-btn-cancel dashboard-overlay-close">CANCEL</button>
    `;

    createDashboardOverlay("VIEW USER DETAIL", content, footer, "dashboard-overlay-box", true);
}


/* EDIT USER PROFILE */
function openProfileEditOverlay() {
    const content = `
        <form id="profileUpdateForm" class="dashboard-form" method="POST" action="/profile/update">
            <input class="dashboard-input" type="text" name="username" value="${currentUser.username}" required>
            <input class="dashboard-input" type="password" name="password" placeholder="New Password">
            <input class="dashboard-input" type="text" name="phone" value="${currentUser.phone}" required>
            <input class="dashboard-input" type="email" name="email" value="${currentUser.email}" required>
            <input class="dashboard-input" type="text" name="address" value="${currentUser.address}" required>
        </form>
    `;

    const footer = `
        <button type="submit" form="profileUpdateForm" class="dashboard-btn dashboard-btn-primary">UPDATE</button>
        <button class="dashboard-btn dashboard-btn-cancel dashboard-overlay-close">CANCEL</button>
    `;

    createDashboardOverlay("UPDATE USER DETAIL", content, footer, "dashboard-overlay-box", true);
}



/* DELETE CONTACT CONFIRM */
function openDeleteContactOverlay(contactId) {
    const content = `
        <p>Are you sure you want to delete this contact?</p>
    `;

    const footer = `
        <form method="POST" action="/contact/${contactId}/delete">
            <button type="submit" class="dashboard-btn dashboard-btn-danger">DELETE</button>
        </form>
        <button class="dashboard-btn dashboard-btn-cancel dashboard-overlay-close">CANCEL</button>
    `;

    createDashboardOverlay("DELETE CONTACT", content, footer);
}

/* DELETE SELECTED CONTACTS CONFIRM */
function openDeleteSelectedContactsOverlay() {
    const selectedIds = Array.from(selectedCards).map(card =>
        card.getAttribute('data-id')
    );

    if (selectedIds.length === 0) {
        return;
    }

    const content = `
        <p>Confirm deletion to proceed.</p>
        <p>${selectedIds.length} contact(s) will be deleted.</p>
    `;

    const hiddenInputs = selectedIds
        .map(id => `<input type="hidden" name="contact_ids" value="${id}">`)
        .join("");

    const footer = `
        <form method="POST" action="/contacts/delete">
            ${hiddenInputs}
            <button type="submit" class="dashboard-btn dashboard-btn-danger">
                DELETE
            </button>
        </form>

        <button class="dashboard-btn dashboard-btn-cancel dashboard-overlay-close">
            CANCEL
        </button>
    `;

    createDashboardOverlay(
        "DELETE CONTACTS",
        content,
        footer,
        "dashboard-overlay-box",
        false
    );
}

/* SIGN OUT CONFIRM OVERLAY */
function openSignOutOverlay() {
    const content = `
        <div class="signout-overlay-content">
            <p>Are you sure you want to sign out?</p>
        </div>
    `;

    const footer = `
        <div class="signout-overlay-footer">
            <form id="signOutForm" method="POST" action="/signout">
                <button type="submit" class="signout-btn-confirm">CONFIRM</button>
            </form>
            <button class="signout-btn-cancel dashboard-overlay-close">CANCEL</button>
        </div>
    `;

    createDashboardOverlay("SIGN OUT", content, footer, "signout-overlay-box", true);
}



/* MENU BUTTONS */
document.addEventListener("DOMContentLoaded", () => {
    const viewProfileBtn = document.getElementById('viewProfileBtn');
    const addContactBtn = document.getElementById('addContactBtn');
    const signOutBtn = document.getElementById('signOutBtn');

    if (viewProfileBtn) viewProfileBtn.addEventListener('click', openProfileOverlay);
    if (addContactBtn) addContactBtn.addEventListener('click', openAddContactOverlay);
    if (signOutBtn) signOutBtn.addEventListener('click', openSignOutOverlay);
    });

