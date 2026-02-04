// Device Controls
// Handles device control UI and interactions

let currentDeviceView = 'grid';
let editingDeviceId = null;

// Initialize device controls
function initDeviceControls() {
    renderDeviceGrid();
    setupDeviceViewToggle();
    setupDeviceModal();
    setupCatalogModal();
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
    const sourceClass = device.source || 'simulated';

    let controls = '';
    if (device.controllable) {
        const powerBtnClass = device.status === 'online' ? 'btn-danger' : 'btn-success';
        const powerBtnText = device.status === 'online' ? 'Turn Off' : 'Turn On';
        controls = `<button class="btn ${powerBtnClass}" data-action="power" data-device="${device.id}">${powerBtnText}</button>`;
    }

    const blockBtnClass = device.blocked ? 'btn-success' : 'btn-danger';
    const blockBtnText = device.blocked ? 'Unblock' : 'Block';

    // Edit/Delete buttons only for custom devices
    const editControls = device.source === 'custom' ? `
        <div class="device-edit-controls">
            <button class="btn btn-secondary" data-action="edit" data-device="${device.id}">Edit</button>
            <button class="btn btn-danger" data-action="delete" data-device="${device.id}">Delete</button>
        </div>
    ` : '';

    return `
        <div class="device-card ${device.blocked ? 'blocked' : ''}" data-device-id="${device.id}">
            <div class="device-header">
                <div class="device-icon">${device.icon}</div>
                <div style="display: flex; flex-direction: column; gap: 0.25rem; align-items: flex-end;">
                    <div class="device-status-badge ${statusBadge}">${statusBadge.toUpperCase()}</div>
                    <div class="device-source-badge ${sourceClass}">${sourceClass}</div>
                </div>
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
            ${editControls}
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

    // Edit button
    const editBtn = card.querySelector('[data-action="edit"]');
    if (editBtn) {
        editBtn.addEventListener('click', () => handleDeviceEdit(deviceId));
    }

    // Delete button
    const deleteBtn = card.querySelector('[data-action="delete"]');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => handleDeviceDelete(deviceId));
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

// Setup device modal
function setupDeviceModal() {
    const addBtn = document.getElementById('addDeviceBtn');
    const modal = document.getElementById('deviceModal');
    const form = document.getElementById('deviceForm');
    const cancelBtn = document.getElementById('deviceModalCancel');

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            editingDeviceId = null;
            document.getElementById('deviceModalTitle').textContent = 'Add New Device';
            form.reset();
            modal.classList.add('active');
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            editingDeviceId = null;
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleDeviceSave();
        });
    }

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            editingDeviceId = null;
        }
    });
}

// Handle device save (add or update)
function handleDeviceSave() {
    const deviceData = {
        name: document.getElementById('deviceName').value,
        type: document.getElementById('deviceType').value,
        icon: document.getElementById('deviceIcon').value || '📱',
        ip: document.getElementById('deviceIp').value,
        manufacturer: document.getElementById('deviceManufacturer').value || 'Custom',
        powerWatts: parseInt(document.getElementById('devicePower').value) || 0,
        controllable: document.getElementById('deviceControllable').checked
    };

    try {
        if (editingDeviceId) {
            updateCustomDevice(editingDeviceId, deviceData);
        } else {
            addCustomDevice(deviceData);
        }

        document.getElementById('deviceModal').classList.remove('active');
        renderDeviceGrid();
        updateDeviceStats();
        editingDeviceId = null;
    } catch (error) {
        alert('Error saving device: ' + error.message);
    }
}

// Handle device edit
function handleDeviceEdit(deviceId) {
    const device = getDevice(deviceId);
    if (!device || device.source !== 'custom') return;

    editingDeviceId = deviceId;
    document.getElementById('deviceModalTitle').textContent = 'Edit Device';
    document.getElementById('deviceName').value = device.name;
    document.getElementById('deviceType').value = device.type;
    document.getElementById('deviceIcon').value = device.icon;
    document.getElementById('deviceIp').value = device.ip;
    document.getElementById('deviceManufacturer').value = device.manufacturer;
    document.getElementById('devicePower').value = device.powerWatts;
    document.getElementById('deviceControllable').checked = device.controllable;

    document.getElementById('deviceModal').classList.add('active');
}

// Handle device delete
function handleDeviceDelete(deviceId) {
    const device = getDevice(deviceId);
    if (!device || device.source !== 'custom') return;

    showConfirmModal(
        'Delete Device',
        `Are you sure you want to delete ${device.name}? This action cannot be undone.`,
        () => {
            try {
                deleteCustomDevice(deviceId);
                renderDeviceGrid();
                updateDeviceStats();
            } catch (error) {
                alert('Error deleting device: ' + error.message);
            }
        }
    );
}

// Setup Catalog Modal
function setupCatalogModal() {
    const catalogModal = document.getElementById('catalogModal');
    const switchBtn = document.getElementById('switchToCatalogBtn');
    const closeBtn = document.getElementById('catalogModalClose');
    const addBtn = document.getElementById('catalogAddBtn');
    const grid = document.getElementById('catalogGrid');

    let selectedTemplate = null;

    if (switchBtn) {
        switchBtn.addEventListener('click', () => {
            // Close device modal and open catalog modal
            document.getElementById('deviceModal').classList.remove('active');
            openCatalog();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            catalogModal.classList.remove('active');
        });
    }

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            if (selectedTemplate) {
                try {
                    addDeviceFromCatalog(selectedTemplate.name);
                    renderDeviceGrid();
                    updateDeviceStats();
                    catalogModal.classList.remove('active');
                } catch (error) {
                    alert('Error adding device: ' + error.message);
                }
            }
        });
    }

    // Render Catalog
    function openCatalog() {
        catalogModal.classList.add('active');
        selectedTemplate = null;
        if (addBtn) addBtn.disabled = true;

        if (grid) {
            grid.innerHTML = DEVICE_CATALOG.map((template, index) => `
                <div class="catalog-item" data-index="${index}" style="
                    border: 1px solid var(--border-color); 
                    border-radius: 8px; 
                    padding: 1rem; 
                    cursor: pointer; 
                    transition: all 0.2s; 
                    text-align: center;
                    background: var(--bg-card);
                ">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">${template.icon}</div>
                    <div style="font-weight: 500;">${template.name}</div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary);">${template.type}</div>
                </div>
            `).join('');

            // Selection logic
            grid.querySelectorAll('.catalog-item').forEach(item => {
                item.addEventListener('click', () => {
                    grid.querySelectorAll('.catalog-item').forEach(i => {
                        i.style.borderColor = 'var(--border-color)';
                        i.style.background = 'var(--bg-card)';
                    });

                    item.style.borderColor = 'var(--primary-color)';
                    item.style.background = 'rgba(37, 99, 235, 0.1)';

                    selectedTemplate = DEVICE_CATALOG[parseInt(item.dataset.index)];
                    if (addBtn) addBtn.disabled = false;
                });
            });
        }
    }

    // Close on background click
    if (catalogModal) {
        catalogModal.addEventListener('click', (e) => {
            if (e.target === catalogModal) {
                catalogModal.classList.remove('active');
            }
        });
    }
}
