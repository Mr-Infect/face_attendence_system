// Device Controls
// Handles device control UI and interactions

let currentDeviceView = 'grid';

// Initialize device controls
function initDeviceControls() {
    renderDeviceGrid();
    setupDeviceViewToggle();
}

// Render device grid
function renderDeviceGrid() {
    const container = document.getElementById('devicesGrid');
    if (!container) return;

    const devices = getAllDevices();

    container.innerHTML = devices.map(device => createDeviceCard(device)).join('');

    // Add event listeners
    devices.forEach(device => {
        setupDeviceCardListeners(device.id);
    });
}

// Create device card HTML
function createDeviceCard(device) {
    const statusClass = device.blocked ? 'blocked' : device.status;
    const statusBadge = device.blocked ? 'blocked' : device.status;

    let controls = '';
    if (device.controllable) {
        const powerBtnClass = device.status === 'online' ? 'btn-danger' : 'btn-success';
        const powerBtnText = device.status === 'online' ? 'Turn Off' : 'Turn On';
        controls = `<button class="btn ${powerBtnClass}" data-action="power" data-device="${device.id}">${powerBtnText}</button>`;
    }

    const blockBtnClass = device.blocked ? 'btn-success' : 'btn-danger';
    const blockBtnText = device.blocked ? 'Unblock' : 'Block';

    return `
        <div class="device-card ${device.blocked ? 'blocked' : ''}" data-device-id="${device.id}">
            <div class="device-header">
                <div class="device-icon">${device.icon}</div>
                <div class="device-status-badge ${statusBadge}">${statusBadge.toUpperCase()}</div>
            </div>
            <div class="device-name">${device.name}</div>
            <div class="device-type">${device.type} • ${device.manufacturer}</div>
            <div class="device-stats">
                <div class="device-stat">
                    <span class="device-stat-label">IP Address</span>
                    <span class="device-stat-value">${device.ip}</span>
                </div>
                <div class="device-stat">
                    <span class="device-stat-label">Power Usage</span>
                    <span class="device-stat-value">${device.powerWatts}W</span>
                </div>
                <div class="device-stat">
                    <span class="device-stat-label">MAC Address</span>
                    <span class="device-stat-value">${device.mac.slice(-8)}</span>
                </div>
            </div>
            <div class="device-controls">
                ${controls}
                <button class="btn ${blockBtnClass}" data-action="block" data-device="${device.id}">${blockBtnText}</button>
            </div>
        </div>
    `;
}

// Setup device card event listeners
function setupDeviceCardListeners(deviceId) {
    const card = document.querySelector(`[data-device-id="${deviceId}"]`);
    if (!card) return;

    // Power button
    const powerBtn = card.querySelector('[data-action="power"]');
    if (powerBtn) {
        powerBtn.addEventListener('click', () => handleDevicePower(deviceId));
    }

    // Block button
    const blockBtn = card.querySelector('[data-action="block"]');
    if (blockBtn) {
        blockBtn.addEventListener('click', () => handleDeviceBlock(deviceId));
    }
}

// Handle device power toggle
function handleDevicePower(deviceId) {
    const device = getDevice(deviceId);
    if (!device || !device.controllable) return;

    const action = device.status === 'online' ? 'turn off' : 'turn on';

    showConfirmModal(
        `${action.charAt(0).toUpperCase() + action.slice(1)} Device`,
        `Are you sure you want to ${action} ${device.name}?`,
        () => {
            toggleDevicePower(deviceId);
            renderDeviceGrid();
            updateDeviceStats();
        }
    );
}

// Handle device block toggle
function handleDeviceBlock(deviceId) {
    const device = getDevice(deviceId);
    if (!device) return;

    const action = device.blocked ? 'unblock' : 'block';
    const message = device.blocked
        ? `This will allow ${device.name} to communicate with the network again.`
        : `This will prevent ${device.name} from sending or receiving data. The device will wait until you unblock it.`;

    showConfirmModal(
        `${action.charAt(0).toUpperCase() + action.slice(1)} Device`,
        `${message}\n\nAre you sure?`,
        () => {
            toggleDeviceBlock(deviceId);
            renderDeviceGrid();
            updateDeviceStats();
        }
    );
}

// Setup view toggle
function setupDeviceViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            currentDeviceView = view;

            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const grid = document.getElementById('devicesGrid');
            if (view === 'list') {
                grid.style.gridTemplateColumns = '1fr';
            } else {
                grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
            }
        });
    });
}

// Update device statistics in header
function updateDeviceStats() {
    const activeDevices = getOnlineDevices().length;
    const blockedDevices = getBlockedDevices().length;

    const activeEl = document.getElementById('activeDevices');
    const blockedEl = document.getElementById('blockedCount');

    if (activeEl) activeEl.textContent = activeDevices;
    if (blockedEl) blockedEl.textContent = blockedDevices;
}

// Show confirmation modal
function showConfirmModal(title, message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const confirmBtn = document.getElementById('modalConfirm');
    const cancelBtn = document.getElementById('modalCancel');

    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.add('active');

    // Remove old listeners
    const newConfirmBtn = confirmBtn.cloneNode(true);
    const newCancelBtn = cancelBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

    // Add new listeners
    newConfirmBtn.addEventListener('click', () => {
        onConfirm();
        modal.classList.remove('active');
    });

    newCancelBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}
