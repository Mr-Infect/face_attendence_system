// Main Application Controller
// Orchestrates all modules and handles UI interactions

let currentPage = 'traffic';
let currentTheme = 'dark';

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initTrafficPage();
    initAnalyticsPage();
    initDevicesPage();

    // Start simulations
    startTrafficSimulation();

    // Initial updates
    updateDeviceStats();
    updateTrafficUI();
});

// Initialize theme
function initTheme() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    currentTheme = savedTheme;
    document.documentElement.setAttribute('data-theme', currentTheme);

    // Theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

// Toggle theme
function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);

    // Update charts if they exist
    if (currentPage === 'analytics') {
        destroyCharts();
        setTimeout(() => {
            initAnalytics();
        }, 100);
    }
}

// Initialize navigation
function initNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            navigateToPage(page);
        });
    });
}

// Navigate to page
function navigateToPage(page) {
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === page);
    });

    // Update pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.toggle('active', p.id === `${page}-page`);
    });

    currentPage = page;

    // Page-specific initialization
    if (page === 'analytics') {
        if (!trafficChart) {
            initAnalytics();
        }
    } else if (page === 'devices') {
        renderDeviceGrid();
    }
}

// Initialize traffic page
function initTrafficPage() {
    const searchInput = document.getElementById('trafficSearch');
    const deviceFilter = document.getElementById('deviceFilter');

    // Populate device filter
    if (deviceFilter) {
        const devices = getAllDevices();
        deviceFilter.innerHTML = '<option value="all">All Devices</option>' +
            devices.map(d => `<option value="${d.id}">${d.name}</option>`).join('');

        deviceFilter.addEventListener('change', updateTrafficUI);
    }

    if (searchInput) {
        searchInput.addEventListener('input', updateTrafficUI);
    }
}

// Update traffic UI
window.updateTrafficUI = function () {
    const container = document.getElementById('trafficList');
    if (!container) return;

    const searchTerm = document.getElementById('trafficSearch')?.value.toLowerCase() || '';
    const deviceFilter = document.getElementById('deviceFilter')?.value || 'all';

    let traffic = getTrafficLog(100);

    // Apply filters
    if (deviceFilter !== 'all') {
        traffic = traffic.filter(packet => packet.device.id === deviceFilter);
    }

    if (searchTerm) {
        traffic = traffic.filter(packet =>
            packet.device.name.toLowerCase().includes(searchTerm) ||
            packet.description.toLowerCase().includes(searchTerm) ||
            packet.destinationHost.toLowerCase().includes(searchTerm)
        );
    }

    // Render traffic items
    container.innerHTML = traffic.slice(0, 50).map(packet => createTrafficItem(packet)).join('');

    // Update stats
    const speeds = getCurrentSpeeds();
    document.getElementById('downloadSpeed').textContent = formatSpeed(speeds.download);
    document.getElementById('uploadSpeed').textContent = formatSpeed(speeds.upload);

    updateDeviceStats();
};

// Create traffic item HTML
function createTrafficItem(packet) {
    const blockedClass = packet.device.blocked ? 'blocked' : '';
    const statusClass = packet.device.blocked ? 'blocked' : '';

    return `
        <div class="traffic-item ${blockedClass}">
            <div class="traffic-info">
                <div class="traffic-device">
                    <span class="device-status ${statusClass}"></span>
                    ${packet.device.icon} ${packet.device.name}
                </div>
                <div class="traffic-description">${packet.description}</div>
                <div class="traffic-details">
                    ${packet.source} → ${packet.destination} (${packet.destinationHost}) • 
                    ${packet.protocol} • 
                    ${formatBytes(packet.size)} • 
                    ${getTimeAgo(packet.timestamp)}
                </div>
            </div>
            <div class="traffic-actions">
                ${packet.device.blocked
            ? `<button class="btn btn-success" onclick="handleQuickUnblock('${packet.device.id}')">Unblock</button>`
            : `<button class="btn btn-danger" onclick="handleQuickBlock('${packet.device.id}')">Block</button>`
        }
            </div>
        </div>
    `;
}

// Quick block from traffic list
window.handleQuickBlock = function (deviceId) {
    const device = getDevice(deviceId);
    if (!device) return;

    showConfirmModal(
        'Block Device Communication',
        `This will prevent ${device.name} from sending or receiving data. The device will wait until you unblock it.\n\nAre you sure?`,
        () => {
            toggleDeviceBlock(deviceId);
            updateTrafficUI();
            if (currentPage === 'devices') {
                renderDeviceGrid();
            }
        }
    );
};

// Quick unblock from traffic list
window.handleQuickUnblock = function (deviceId) {
    toggleDeviceBlock(deviceId);
    updateTrafficUI();
    if (currentPage === 'devices') {
        renderDeviceGrid();
    }
};

// Initialize analytics page
function initAnalyticsPage() {
    const timeBtns = document.querySelectorAll('.time-btn');

    timeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            timeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // In a real app, this would filter data by time range
            // For simulation, we'll just update the charts
            if (trafficChart) {
                updateCharts();
            }
        });
    });
}

// Initialize devices page
function initDevicesPage() {
    initDeviceControls();
}

// Handle window resize
window.addEventListener('resize', () => {
    if (currentPage === 'analytics' && trafficChart) {
        trafficChart.resize();
        deviceTrafficChart.resize();
        powerChart.resize();
        protocolChart.resize();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopTrafficSimulation();
    stopAnalyticsUpdates();
});
