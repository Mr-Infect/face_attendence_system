// Generates realistic network traffic with plain English descriptions

let trafficLog = [];
let trafficInterval = null;
let totalDataTransferred = 0;
let currentDownloadSpeed = 0;
let currentUploadSpeed = 0;
let nextAlertTime = Date.now() + (Math.random() * (120000 - 60000) + 60000); // Random alerting between 60s-120s


// Protocol types with plain English descriptions
const PROTOCOLS = {
    HTTPS: { port: 443, description: 'secure web browsing' },
    HTTP: { port: 80, description: 'web browsing' },
    DNS: { port: 53, description: 'looking up website addresses' },
    MQTT: { port: 1883, description: 'smart home device communication' },
    RTSP: { port: 554, description: 'video streaming' },
    WEBSOCKET: { port: 443, description: 'real-time updates' },
    NTP: { port: 123, description: 'time synchronization' }
};

// Activity templates for plain English descriptions
const ACTIVITY_TEMPLATES = {
    streaming: [
        'is streaming a video from',
        'is watching content on',
        'is playing media from'
    ],
    browsing: [
        'is browsing',
        'is visiting',
        'is loading content from'
    ],
    syncing: [
        'is syncing data with',
        'is backing up to',
        'is updating from'
    ],
    messaging: [
        'is sending messages via',
        'is chatting on',
        'is communicating through'
    ],
    control: [
        'is receiving commands from',
        'is sending status updates to',
        'is being controlled by'
    ],
    monitoring: [
        'is reporting to',
        'is sending sensor data to',
        'is updating status on'
    ]
};

// Generate a traffic packet
function generateTrafficPacket(device) {
    if (!device || device.status !== 'online' || device.blocked) {
        return null;
    }

    const server = getRandomServer(device);
    if (!server) return null;

    // Determine if this is a burst
    const isBurst = Math.random() < device.trafficPattern.burstChance;
    const baseSize = device.trafficPattern.min +
        Math.random() * (device.trafficPattern.max - device.trafficPattern.min);
    const size = isBurst ? baseSize * 2 : baseSize;

    // Select appropriate protocol and activity
    let protocol = 'HTTPS';
    let activityType = 'browsing';

    if (device.type === 'Entertainment') {
        protocol = Math.random() > 0.3 ? 'RTSP' : 'HTTPS';
        activityType = 'streaming';
    } else if (device.type === 'IoT Controller' || device.type === 'Smart Lighting') {
        protocol = 'MQTT';
        activityType = 'control';
    } else if (device.type === 'Security') {
        protocol = Math.random() > 0.5 ? 'RTSP' : 'HTTPS';
        activityType = 'monitoring';
    } else if (device.type === 'Voice Assistant' || device.type === 'Smart Speaker') {
        protocol = 'WEBSOCKET';
        activityType = Math.random() > 0.5 ? 'streaming' : 'control';
    } else if (device.type === 'Smart Appliance') {
        protocol = 'MQTT';
        activityType = 'monitoring';
    } else if (server.purpose.includes('sync') || server.purpose.includes('backup')) {
        activityType = 'syncing';
    } else if (server.purpose.includes('messaging') || server.purpose.includes('chat')) {
        activityType = 'messaging';
    }

    // Generate plain English description
    const templates = ACTIVITY_TEMPLATES[activityType];
    const template = templates[Math.floor(Math.random() * templates.length)];
    const description = `Your ${device.name} ${template} ${server.host}`;
    const detail = server.purpose;

    return {
        id: `traffic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        device: device,
        source: device.ip,
        destination: server.ip,
        destinationHost: server.host,
        protocol: protocol,
        size: Math.round(size), // KB
        description: description,
        detail: detail,
        direction: Math.random() > 0.3 ? 'download' : 'upload',
        source_type: 'simulation'
    };
}

// Start traffic simulation
function startTrafficSimulation() {
    if (trafficInterval) return;

    trafficInterval = setInterval(() => {
        const onlineDevices = getOnlineDevices();
        let downloadSpeed = 0;
        let uploadSpeed = 0;

        // Generate traffic for random devices
        const numPackets = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numPackets; i++) {
            const device = onlineDevices[Math.floor(Math.random() * onlineDevices.length)];
            if (device) {
                const packet = generateTrafficPacket(device);
                if (packet) {
                    trafficLog.unshift(packet);
                    totalDataTransferred += packet.size;

                    if (packet.direction === 'download') {
                        downloadSpeed += packet.size;
                    } else {
                        uploadSpeed += packet.size;
                    }
                }
            }
        }

        // Random Security Alert Generation (> 1 minute intervals)
        if (Date.now() > nextAlertTime) {
            const onlineDevices = getOnlineDevices().filter(d => !d.blocked);
            if (onlineDevices.length > 0) {
                // Pick random device
                const victim = onlineDevices[Math.floor(Math.random() * onlineDevices.length)];

                // Generate anomaly event
                const anomalyEvent = new CustomEvent('securityAlert', {
                    detail: {
                        type: 'Traffic Spike',
                        device: victim.name,
                        deviceId: victim.id,
                        value: formatBytes(Math.random() * 5000 + 2000), // Random 2MB-7MB
                        message: `Suspicious outgoing traffic burst detected. Recommended action: Block device immediately.`
                    }
                });
                window.dispatchEvent(anomalyEvent);

                // Schedule next alert (60s - 180s)
                nextAlertTime = Date.now() + (Math.random() * (180000 - 60000) + 60000);
            }
        }

        // Update speeds (smoothed)
        currentDownloadSpeed = currentDownloadSpeed * 0.7 + downloadSpeed * 0.3;
        currentUploadSpeed = currentUploadSpeed * 0.7 + uploadSpeed * 0.3;

        // Keep log size manageable
        if (trafficLog.length > 200) {
            trafficLog = trafficLog.slice(0, 200);
        }

        // Trigger UI update
        if (window.updateTrafficUI) {
            window.updateTrafficUI();
        }
    }, 2000); // Generate traffic every 2 seconds
}

// Stop traffic simulation
function stopTrafficSimulation() {
    if (trafficInterval) {
        clearInterval(trafficInterval);
        trafficInterval = null;
    }
}

// Get traffic log
function getTrafficLog(limit = 50) {
    return trafficLog.slice(0, limit);
}

// Get traffic for specific device
function getDeviceTraffic(deviceId, limit = 50) {
    return trafficLog
        .filter(packet => packet.device.id === deviceId)
        .slice(0, limit);
}

// Get current speeds
function getCurrentSpeeds() {
    return {
        download: currentDownloadSpeed,
        upload: currentUploadSpeed
    };
}

// Get total data transferred
function getTotalDataTransferred() {
    return totalDataTransferred;
}

// Get traffic statistics
function getTrafficStats() {
    const deviceTraffic = {};
    const protocolTraffic = {};

    trafficLog.forEach(packet => {
        // By device
        if (!deviceTraffic[packet.device.id]) {
            deviceTraffic[packet.device.id] = {
                device: packet.device,
                totalSize: 0,
                packetCount: 0
            };
        }
        deviceTraffic[packet.device.id].totalSize += packet.size;
        deviceTraffic[packet.device.id].packetCount++;

        // By protocol
        if (!protocolTraffic[packet.protocol]) {
            protocolTraffic[packet.protocol] = 0;
        }
        protocolTraffic[packet.protocol] += packet.size;
    });

    return {
        byDevice: Object.values(deviceTraffic).sort((a, b) => b.totalSize - a.totalSize),
        byProtocol: protocolTraffic
    };
}

// Clear traffic log
function clearTrafficLog() {
    trafficLog = [];
    totalDataTransferred = 0;
}

// Format bytes to human readable
function formatBytes(kb) {
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    if (kb < 1024 * 1024) return `${(kb / 1024).toFixed(1)} MB`;
    return `${(kb / (1024 * 1024)).toFixed(2)} GB`;
}

// Format speed
function formatSpeed(kbps) {
    if (kbps < 1) return `${(kbps * 1024).toFixed(0)} B/s`;
    if (kbps < 1024) return `${kbps.toFixed(1)} KB/s`;
    return `${(kbps / 1024).toFixed(2)} MB/s`;
}

// Get time ago
function getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}


