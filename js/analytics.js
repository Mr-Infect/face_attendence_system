// Analytics Engine
// Handles data visualization and statistics

let trafficChart = null;
let deviceTrafficChart = null;
let powerChart = null;
let protocolChart = null;
let analyticsInterval = null;

// Historical data for charts
let trafficHistory = {
    labels: [],
    download: [],
    upload: []
};

let healthChart = null;
let healthScoreHistory = [];

// Initialize analytics
function initAnalytics() {
    initTrafficChart();
    initDeviceTrafficChart();
    initPowerChart();
    initProtocolChart();
    initHealthChart();
    startAnalyticsUpdates();
}

// Initialize traffic over time chart
function initTrafficChart() {
    const ctx = document.getElementById('trafficChart');
    if (!ctx) return;

    trafficChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Download',
                    data: [],
                    borderColor: 'rgb(96, 165, 250)',
                    backgroundColor: 'rgba(96, 165, 250, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Upload',
                    data: [],
                    borderColor: 'rgb(167, 139, 250)',
                    backgroundColor: 'rgba(167, 139, 250, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--text-primary')
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--text-secondary'),
                        callback: function (value) {
                            return formatSpeed(value);
                        }
                    },
                    grid: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--border-color')
                    }
                },
                x: {
                    ticks: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--text-secondary')
                    },
                    grid: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--border-color')
                    }
                }
            }
        }
    });
}

// Initialize device traffic chart
function initDeviceTrafficChart() {
    const ctx = document.getElementById('deviceTrafficChart');
    if (!ctx) return;

    deviceTrafficChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    'rgb(96, 165, 250)',
                    'rgb(167, 139, 250)',
                    'rgb(52, 211, 153)',
                    'rgb(251, 191, 36)',
                    'rgb(248, 113, 113)',
                    'rgb(251, 146, 60)',
                    'rgb(244, 114, 182)',
                    'rgb(129, 140, 248)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--text-primary'),
                        padding: 10,
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// Initialize power consumption chart
function initPowerChart() {
    const ctx = document.getElementById('powerChart');
    if (!ctx) return;

    const devices = getAllDevices().filter(d => d.status === 'online');

    powerChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: devices.map(d => d.name),
            datasets: [{
                label: 'Power (Watts)',
                data: devices.map(d => d.powerWatts),
                backgroundColor: 'rgba(52, 211, 153, 0.7)',
                borderColor: 'rgb(52, 211, 153)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--text-secondary'),
                        callback: function (value) {
                            return value + 'W';
                        }
                    },
                    grid: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--border-color')
                    }
                },
                x: {
                    ticks: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--text-secondary'),
                        maxRotation: 45,
                        minRotation: 45,
                        font: {
                            size: 9
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Initialize protocol distribution chart
function initProtocolChart() {
    const ctx = document.getElementById('protocolChart');
    if (!ctx) return;

    protocolChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    'rgb(96, 165, 250)',
                    'rgb(167, 139, 250)',
                    'rgb(52, 211, 153)',
                    'rgb(251, 191, 36)',
                    'rgb(248, 113, 113)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--text-primary')
                    }
                }
            }
        }
    });
}

// Update all charts
function updateCharts() {
    updateTrafficChart();
    updateDeviceTrafficChart();
    updatePowerChart();
    updateProtocolChart();
    updateHealthScore();
    updateSummaryStats();
    updateTopDevices();
}

// Update traffic chart
function updateTrafficChart() {
    if (!trafficChart) return;

    const speeds = getCurrentSpeeds();
    const now = new Date().toLocaleTimeString();

    trafficHistory.labels.push(now);
    trafficHistory.download.push(speeds.download);
    trafficHistory.upload.push(speeds.upload);

    // Keep last 20 data points
    if (trafficHistory.labels.length > 20) {
        trafficHistory.labels.shift();
        trafficHistory.download.shift();
        trafficHistory.upload.shift();
    }

    trafficChart.data.labels = trafficHistory.labels;
    trafficChart.data.datasets[0].data = trafficHistory.download;
    trafficChart.data.datasets[1].data = trafficHistory.upload;
    trafficChart.update('none');
}

// Update device traffic chart
function updateDeviceTrafficChart() {
    if (!deviceTrafficChart) return;

    const stats = getTrafficStats();
    const topDevices = stats.byDevice.slice(0, 8);

    deviceTrafficChart.data.labels = topDevices.map(d => d.device.name);
    deviceTrafficChart.data.datasets[0].data = topDevices.map(d => d.totalSize);
    deviceTrafficChart.update('none');
}

// Update power chart
function updatePowerChart() {
    if (!powerChart) return;

    const devices = getAllDevices().filter(d => d.status === 'online');

    powerChart.data.labels = devices.map(d => d.name);
    powerChart.data.datasets[0].data = devices.map(d => d.powerWatts);
    powerChart.update('none');
}

// Update protocol chart
function updateProtocolChart() {
    if (!protocolChart) return;

    const stats = getTrafficStats();
    const protocols = Object.entries(stats.byProtocol);
    updateProtocolChart();
    updateHealthScore();
    updateSummaryStats();
    updateTopDevices();
}

// Update Health Score
function updateHealthScore() {
    if (!healthChart) return;

    // Calculate score logic
    const activeAlerts = document.querySelectorAll('.modal.active').length; // Simple check for active alerts
    const totalPower = getTotalPowerConsumption();
    const highLoadDevices = getOnlineDevices().filter(d => d.powerWatts > 200).length;

    let penalty = 0;
    if (activeAlerts > 0) penalty += 30; // High penalty for active alerts
    if (totalPower > 2000) penalty += 10;
    if (highLoadDevices > 2) penalty += (highLoadDevices * 5);

    // Randomize slightly for "AI" feel
    const variance = Math.floor(Math.random() * 5);
    let score = Math.max(0, Math.min(100, 100 - penalty - variance));

    // Update Chart
    healthChart.data.datasets[0].data = [score, 100 - score];
    healthChart.data.datasets[0].backgroundColor = [
        score > 80 ? 'rgb(52, 211, 153)' : (score > 50 ? 'rgb(251, 191, 36)' : 'rgb(248, 113, 113)'),
        'rgba(0,0,0,0.1)'
    ];
    healthChart.update('none');

    // Update Text
    const scoreEl = document.getElementById('healthScoreValue');
    const statusEl = document.getElementById('healthScoreStatus');
    if (scoreEl) scoreEl.textContent = `${score}%`;
    if (statusEl) {
        statusEl.textContent = score > 80 ? 'Optimal' : (score > 50 ? 'Moderate Risk' : 'Critical Risk');
        statusEl.style.color = score > 80 ? 'var(--success-color)' : (score > 50 ? 'var(--warning-color)' : 'var(--danger-color)');
    }
}



// Update summary statistics
function updateSummaryStats() {
    const totalData = getTotalDataTransferred();
    const speeds = getCurrentSpeeds();
    const avgSpeed = (speeds.download + speeds.upload) / 2;
    const totalPower = getTotalPowerConsumption();
    const costPerKwh = 0.12; // $0.12 per kWh
    const estimatedCost = (totalPower / 1000) * 24 * costPerKwh;

    document.getElementById('totalData').textContent = formatBytes(totalData);
    document.getElementById('avgSpeed').textContent = formatSpeed(avgSpeed);
    document.getElementById('totalPower').textContent = `${totalPower} W`;
    document.getElementById('estimatedCost').textContent = `$${estimatedCost.toFixed(2)}`;
}

// Update top devices list
function updateTopDevices() {
    const stats = getTrafficStats();
    const topDevices = stats.byDevice.slice(0, 5);
    const container = document.getElementById('topDevices');

    if (!container) return;

    container.innerHTML = topDevices.map(item => `
        <div class="top-device-item">
            <span class="top-device-name">${item.device.icon} ${item.device.name}</span>
            <span class="top-device-data">${formatBytes(item.totalSize)}</span>
        </div>
    `).join('');
}

// Start periodic analytics updates
function startAnalyticsUpdates() {
    if (analyticsInterval) return;

    analyticsInterval = setInterval(() => {
        updateCharts();
    }, 3000); // Update every 3 seconds
}

// Stop analytics updates
function stopAnalyticsUpdates() {
    if (analyticsInterval) {
        clearInterval(analyticsInterval);
        analyticsInterval = null;
    }
}

// Destroy all charts
function destroyCharts() {
    if (trafficChart) trafficChart.destroy();
    if (deviceTrafficChart) deviceTrafficChart.destroy();
    if (powerChart) powerChart.destroy();
    if (protocolChart) protocolChart.destroy();
}
