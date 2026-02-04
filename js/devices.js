// Device Management System
// Supports simulated, custom, and real devices with localStorage persistence

// Simulated devices (defaults for demo/testing)
const SIMULATED_DEVICES = [
    {
        id: 'laptop-001',
        name: 'Work Laptop',
        type: 'Computer',
        icon: '💻',
        ip: '192.168.1.101',
        mac: '00:1B:44:11:3A:B7',
        manufacturer: 'Dell',
        powerWatts: 45,
        controllable: false,
        status: 'online',
        blocked: false,
        servers: [
            { host: 'google.com', ip: '142.250.185.46', purpose: 'Web browsing and search' },
            { host: 'github.com', ip: '140.82.121.4', purpose: 'Code repository access' },
            { host: 'dropbox.com', ip: '162.125.65.1', purpose: 'Cloud file synchronization' },
            { host: 'slack.com', ip: '54.230.159.122', purpose: 'Team communication' }
        ],
        trafficPattern: { min: 50, max: 500, burstChance: 0.3 }
    },
    {
        id: 'phone-001',
        name: 'iPhone 14',
        type: 'Smartphone',
        icon: '📱',
        ip: '192.168.1.102',
        mac: '00:1B:44:11:3A:B8',
        manufacturer: 'Apple',
        powerWatts: 5,
        controllable: false,
        status: 'online',
        blocked: false,
        servers: [
            { host: 'icloud.com', ip: '17.253.144.10', purpose: 'Photo and data backup' },
            { host: 'whatsapp.net', ip: '31.13.82.51', purpose: 'Instant messaging' },
            { host: 'instagram.com', ip: '157.240.22.174', purpose: 'Social media browsing' },
            { host: 'spotify.com', ip: '35.186.224.25', purpose: 'Music streaming' }
        ],
        trafficPattern: { min: 20, max: 200, burstChance: 0.4 }
    },
    {
        id: 'tv-001',
        name: 'Living Room Smart TV',
        type: 'Entertainment',
        icon: '📺',
        ip: '192.168.1.103',
        mac: '00:1B:44:11:3A:B9',
        manufacturer: 'Samsung',
        powerWatts: 120,
        controllable: true,
        status: 'online',
        blocked: false,
        servers: [
            { host: 'netflix.com', ip: '52.34.12.5', purpose: 'Streaming movies and shows' },
            { host: 'youtube.com', ip: '142.250.185.78', purpose: 'Video streaming' },
            { host: 'primevideo.com', ip: '54.239.28.85', purpose: 'Amazon Prime content' }
        ],
        trafficPattern: { min: 500, max: 3000, burstChance: 0.2 }
    },
    {
        id: 'rpi-001',
        name: 'Raspberry Pi Hub',
        type: 'IoT Controller',
        icon: '🔧',
        ip: '192.168.1.104',
        mac: '00:1B:44:11:3A:C0',
        manufacturer: 'Raspberry Pi Foundation',
        powerWatts: 15,
        controllable: false,
        status: 'online',
        blocked: false,
        servers: [
            { host: 'mqtt.home', ip: '192.168.1.1', purpose: 'Home automation messaging' },
            { host: 'api.openweathermap.org', ip: '188.166.56.137', purpose: 'Weather data updates' },
            { host: 'home-assistant.io', ip: '104.21.53.196', purpose: 'Smart home coordination' }
        ],
        trafficPattern: { min: 5, max: 50, burstChance: 0.1 }
    },
    {
        id: 'vacuum-001',
        name: 'Robot Vacuum',
        type: 'Smart Appliance',
        icon: '🤖',
        ip: '192.168.1.105',
        mac: '00:1B:44:11:3A:C1',
        manufacturer: 'Roborock',
        powerWatts: 55,
        controllable: true,
        status: 'online',
        blocked: false,
        servers: [
            { host: 'roborock.com', ip: '47.88.62.108', purpose: 'Cleaning schedule sync' },
            { host: 'aws-iot.amazonaws.com', ip: '52.119.224.68', purpose: 'Remote control commands' }
        ],
        trafficPattern: { min: 10, max: 80, burstChance: 0.15 }
    },
    {
        id: 'light-living-001',
        name: 'Living Room Lights',
        type: 'Smart Lighting',
        icon: '💡',
        ip: '192.168.1.106',
        mac: '00:1B:44:11:3A:C2',
        manufacturer: 'Philips Hue',
        powerWatts: 12,
        controllable: true,
        status: 'online',
        blocked: false,
        servers: [
            { host: 'api.meethue.com', ip: '13.32.123.45', purpose: 'Lighting control and schedules' }
        ],
        trafficPattern: { min: 2, max: 20, burstChance: 0.05 }
    },
    {
        id: 'light-bedroom-001',
        name: 'Bedroom Lights',
        type: 'Smart Lighting',
        icon: '🛏️',
        ip: '192.168.1.107',
        mac: '00:1B:44:11:3A:C3',
        manufacturer: 'Philips Hue',
        powerWatts: 10,
        controllable: true,
        status: 'online',
        blocked: false,
        servers: [
            { host: 'api.meethue.com', ip: '13.32.123.45', purpose: 'Lighting control and schedules' }
        ],
        trafficPattern: { min: 2, max: 15, burstChance: 0.05 }
    },
    {
        id: 'alexa-001',
        name: 'Amazon Alexa',
        type: 'Voice Assistant',
        icon: '🔊',
        ip: '192.168.1.108',
        mac: '00:1B:44:11:3A:C4',
        manufacturer: 'Amazon',
        powerWatts: 3,
        controllable: true,
        status: 'online',
        blocked: false,
        servers: [
            { host: 'alexa.amazon.com', ip: '52.94.236.248', purpose: 'Voice commands processing' },
            { host: 'music.amazon.com', ip: '54.239.28.85', purpose: 'Music streaming' },
            { host: 'api.amazonalexa.com', ip: '52.94.236.250', purpose: 'Smart home device control' }
        ],
        trafficPattern: { min: 15, max: 150, burstChance: 0.25 }
    },
    {
        id: 'thermostat-001',
        name: 'Smart Thermostat',
        type: 'Climate Control',
        icon: '🌡️',
        ip: '192.168.1.109',
        mac: '00:1B:44:11:3A:C5',
        manufacturer: 'Nest',
        powerWatts: 2,
        controllable: true,
        status: 'online',
        blocked: false,
        servers: [
            { host: 'home.nest.com', ip: '216.58.214.206', purpose: 'Temperature control and scheduling' },
            { host: 'weather-api.nest.com', ip: '142.250.185.110', purpose: 'Weather-based adjustments' }
        ],
        trafficPattern: { min: 5, max: 30, burstChance: 0.1 }
    },
    {
        id: 'doorbell-001',
        name: 'Smart Doorbell',
        type: 'Security',
        icon: '🔔',
        ip: '192.168.1.110',
        mac: '00:1B:44:11:3A:C6',
        manufacturer: 'Ring',
        powerWatts: 8,
        controllable: false,
        status: 'online',
        blocked: false,
        servers: [
            { host: 'ring.com', ip: '54.148.37.5', purpose: 'Video streaming and alerts' },
            { host: 'api.ring.com', ip: '54.148.37.6', purpose: 'Motion detection notifications' }
        ],
        trafficPattern: { min: 30, max: 400, burstChance: 0.2 }
    },
    {
        id: 'camera-001',
        name: 'Security Camera',
        type: 'Security',
        icon: '📷',
        ip: '192.168.1.111',
        mac: '00:1B:44:11:3A:C7',
        manufacturer: 'Arlo',
        powerWatts: 6,
        controllable: true,
        status: 'online',
        blocked: false,
        servers: [
            { host: 'arlo.com', ip: '13.107.42.14', purpose: 'Video recording and storage' },
            { host: 'api.arlo.com', ip: '13.107.42.15', purpose: 'Motion alerts and live view' }
        ],
        trafficPattern: { min: 100, max: 800, burstChance: 0.15 }
    },
    {
        id: 'plug-fan-001',
        name: 'Smart Plug (Fan)',
        type: 'Smart Outlet',
        icon: '🔌',
        ip: '192.168.1.112',
        mac: '00:1B:44:11:3A:C8',
        manufacturer: 'TP-Link',
        powerWatts: 1,
        controllable: true,
        status: 'online',
        blocked: false,
        servers: [
            { host: 'use1-wap.tplinkcloud.com', ip: '54.172.115.98', purpose: 'Remote on/off control' }
        ],
        trafficPattern: { min: 1, max: 10, burstChance: 0.05 }
    },
    {
        id: 'fridge-001',
        name: 'Smart Refrigerator',
        type: 'Smart Appliance',
        icon: '🧊',
        ip: '192.168.1.113',
        mac: '00:1B:44:11:3A:C9',
        manufacturer: 'LG',
        powerWatts: 150,
        controllable: false,
        status: 'online',
        blocked: false,
        servers: [
            { host: 'lgthinq.com', ip: '52.78.123.45', purpose: 'Temperature monitoring' },
            { host: 'api.lgthinq.com', ip: '52.78.123.46', purpose: 'Smart diagnosis and alerts' }
        ],
        trafficPattern: { min: 5, max: 40, burstChance: 0.1 }
    },
    {
        id: 'tablet-001',
        name: 'iPad',
        type: 'Tablet',
        icon: '📱',
        ip: '192.168.1.114',
        mac: '00:1B:44:11:3A:D0',
        manufacturer: 'Apple',
        powerWatts: 10,
        controllable: false,
        status: 'online',
        blocked: false,
        servers: [
            { host: 'icloud.com', ip: '17.253.144.10', purpose: 'App and data synchronization' },
            { host: 'youtube.com', ip: '142.250.185.78', purpose: 'Video streaming' },
            { host: 'reddit.com', ip: '151.101.1.140', purpose: 'Social media browsing' }
        ],
        trafficPattern: { min: 30, max: 300, burstChance: 0.3 }
    },
    {
        id: 'speaker-001',
        name: 'Google Home',
        type: 'Smart Speaker',
        icon: '🔈',
        ip: '192.168.1.115',
        mac: '00:1B:44:11:3A:D1',
        manufacturer: 'Google',
        powerWatts: 5,
        controllable: true,
        status: 'online',
        blocked: false,
        servers: [
            { host: 'google.com', ip: '142.250.185.46', purpose: 'Voice search and commands' },
            { host: 'youtube.com', ip: '142.250.185.78', purpose: 'Music and podcast streaming' },
            { host: 'googleapis.com', ip: '142.250.185.10', purpose: 'Smart home integration' }
        ],
        trafficPattern: { min: 20, max: 180, burstChance: 0.2 }
    }
];

// Device Catalog Templates
const DEVICE_CATALOG = [
    {
        name: 'Gaming Console',
        type: 'Entertainment',
        icon: '🎮',
        manufacturer: 'Sony/Microsoft',
        powerWatts: 200,
        controllable: true,
        servers: [
            { host: 'playstation.net', ip: '23.66.213.11', purpose: 'Online gaming service' },
            { host: 'xboxlive.com', ip: '65.55.42.23', purpose: 'Multiplayer gaming' },
            { host: 'twitch.tv', ip: '151.101.2.167', purpose: 'Live streaming' }
        ],
        trafficPattern: { min: 100, max: 2000, burstChance: 0.4 }
    },
    {
        name: 'Smart Lock',
        type: 'Security',
        icon: '🔒',
        manufacturer: 'August',
        powerWatts: 2,
        controllable: true,
        servers: [
            { host: 'connect.august.com', ip: '52.203.111.90', purpose: 'Remote locking/unlocking' }
        ],
        trafficPattern: { min: 1, max: 5, burstChance: 0.05 }
    },
    {
        name: 'Smart Printer',
        type: 'Computer',
        icon: '🖨️',
        manufacturer: 'HP',
        powerWatts: 40,
        controllable: false,
        servers: [
            { host: 'hpconnected.com', ip: '15.72.194.8', purpose: 'Cloud printing services' }
        ],
        trafficPattern: { min: 5, max: 50, burstChance: 0.1 }
    },
    {
        name: 'Baby Monitor',
        type: 'Security',
        icon: '👶',
        manufacturer: 'Nanit',
        powerWatts: 5,
        controllable: false,
        servers: [
            { host: 'api.nanit.com', ip: '34.205.112.55', purpose: 'Video stream upload' }
        ],
        trafficPattern: { min: 50, max: 400, burstChance: 0.2 }
    },
    {
        name: 'Smart Coffee Maker',
        type: 'Smart Appliance',
        icon: '☕',
        manufacturer: 'Keurig',
        powerWatts: 1400,
        controllable: true,
        servers: [
            { host: 'iot.keurig.com', ip: '54.88.19.22', purpose: 'Remote brew control' }
        ],
        trafficPattern: { min: 1, max: 10, burstChance: 0.01 }
    },
    {
        name: 'NAS Drive',
        type: 'Computer',
        icon: '💾',
        manufacturer: 'Synology',
        powerWatts: 30,
        controllable: false,
        servers: [
            { host: 'quickconnect.to', ip: '13.226.155.99', purpose: 'Remote file access' },
            { host: 'backblaze.com', ip: '104.16.2.5', purpose: 'Cloud backup' }
        ],
        trafficPattern: { min: 100, max: 5000, burstChance: 0.3 }
    }
];


// Storage keys
const STORAGE_KEYS = {
    CUSTOM_DEVICES: 'iot_custom_devices',
    REAL_DEVICES: 'iot_real_devices'
};

// Device arrays
let customDevices = [];
let realDevices = [];

// Initialize device storage
function initDeviceStorage() {
    loadCustomDevices();
    loadRealDevices();
}

// Load custom devices from localStorage
function loadCustomDevices() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_DEVICES);
        customDevices = stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading custom devices:', error);
        customDevices = [];
    }
}

// Save custom devices to localStorage
function saveCustomDevices() {
    try {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_DEVICES, JSON.stringify(customDevices));
    } catch (error) {
        console.error('Error saving custom devices:', error);
        if (error.name === 'QuotaExceededError') {
            alert('Storage quota exceeded. Please delete some devices.');
        }
    }
}

// Load real devices from localStorage
function loadRealDevices() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.REAL_DEVICES);
        realDevices = stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading real devices:', error);
        realDevices = [];
    }
}

// Save real devices to localStorage
function saveRealDevices() {
    try {
        localStorage.setItem(STORAGE_KEYS.REAL_DEVICES, JSON.stringify(realDevices));
    } catch (error) {
        console.error('Error saving real devices:', error);
    }
}

// Add custom device
function addCustomDevice(deviceData) {
    // Validate required fields
    if (!deviceData.name || !deviceData.type || !deviceData.ip) {
        throw new Error('Missing required fields: name, type, ip');
    }

    // Generate unique ID
    const id = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newDevice = {
        id,
        name: deviceData.name,
        type: deviceData.type,
        icon: deviceData.icon || '📱',
        ip: deviceData.ip,
        mac: deviceData.mac || generateRandomMac(),
        manufacturer: deviceData.manufacturer || 'Custom',
        powerWatts: deviceData.powerWatts || 0,
        controllable: deviceData.controllable || false,
        status: 'online',
        blocked: false,
        source: 'custom',
        servers: deviceData.servers || [],
        trafficPattern: deviceData.trafficPattern || { min: 10, max: 100, burstChance: 0.1 }
    };

    customDevices.push(newDevice);
    saveCustomDevices();
    return newDevice;
}

// Add device from catalog
function addDeviceFromCatalog(templateName) {
    const template = DEVICE_CATALOG.find(d => d.name === templateName);
    if (!template) throw new Error('Device template not found');

    const deviceData = {
        ...template,
        ip: `192.168.1.${Math.floor(Math.random() * 150) + 100}`, // Random IP
        mac: generateRandomMac()
    };

    return addCustomDevice(deviceData);
}

// Update custom device
function updateCustomDevice(deviceId, deviceData) {
    const index = customDevices.findIndex(d => d.id === deviceId);
    if (index === -1) {
        throw new Error('Device not found');
    }

    // Update fields
    const device = customDevices[index];
    Object.assign(device, {
        name: deviceData.name || device.name,
        type: deviceData.type || device.type,
        icon: deviceData.icon || device.icon,
        ip: deviceData.ip || device.ip,
        mac: deviceData.mac || device.mac,
        manufacturer: deviceData.manufacturer || device.manufacturer,
        powerWatts: deviceData.powerWatts !== undefined ? deviceData.powerWatts : device.powerWatts,
        controllable: deviceData.controllable !== undefined ? deviceData.controllable : device.controllable
    });

    saveCustomDevices();
    return device;
}

// Delete custom device
function deleteCustomDevice(deviceId) {
    const index = customDevices.findIndex(d => d.id === deviceId);
    if (index === -1) {
        throw new Error('Device not found');
    }

    customDevices.splice(index, 1);
    saveCustomDevices();
    return true;
}

// Add real device (from network scanner)
function addRealDevice(deviceData) {
    const existing = realDevices.find(d => d.ip === deviceData.ip);
    if (existing) {
        // Update existing device
        Object.assign(existing, deviceData);
    } else {
        const id = `real-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        realDevices.push({
            id,
            source: 'real',
            status: 'online',
            blocked: false,
            ...deviceData
        });
    }
    saveRealDevices();
}

// Clear real devices
function clearRealDevices() {
    realDevices = [];
    saveRealDevices();
}

// Generate random MAC address
function generateRandomMac() {
    return Array.from({ length: 6 }, () =>
        Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
    ).join(':').toUpperCase();
}

// Merge all device sources
function mergeDeviceSources() {
    // Add source field to simulated devices
    const simulatedWithSource = SIMULATED_DEVICES.map(d => ({ ...d, source: 'simulated' }));
    return [...simulatedWithSource, ...customDevices, ...realDevices];
}

// Get device by ID
function getDevice(deviceId) {
    return mergeDeviceSources().find(d => d.id === deviceId);
}

// Get all devices
function getAllDevices() {
    return mergeDeviceSources();
}

// Get online devices
function getOnlineDevices() {
    return mergeDeviceSources().filter(d => d.status === 'online' && !d.blocked);
}

// Get blocked devices
function getBlockedDevices() {
    return mergeDeviceSources().filter(d => d.blocked);
}

// Get controllable devices
function getControllableDevices() {
    return mergeDeviceSources().filter(d => d.controllable);
}

// Get devices by source
function getDevicesBySource(source) {
    return mergeDeviceSources().filter(d => d.source === source);
}

// Toggle device power (for controllable devices)
function toggleDevicePower(deviceId) {
    const device = getDevice(deviceId);
    if (!device || !device.controllable) return false;

    // Update in appropriate array
    if (device.source === 'simulated') {
        const simDevice = SIMULATED_DEVICES.find(d => d.id === deviceId);
        if (simDevice) {
            simDevice.status = simDevice.status === 'online' ? 'offline' : 'online';
        }
    } else if (device.source === 'custom') {
        const customDevice = customDevices.find(d => d.id === deviceId);
        if (customDevice) {
            customDevice.status = customDevice.status === 'online' ? 'offline' : 'online';
            saveCustomDevices();
        }
    } else if (device.source === 'real') {
        const realDevice = realDevices.find(d => d.id === deviceId);
        if (realDevice) {
            realDevice.status = realDevice.status === 'online' ? 'offline' : 'online';
            saveRealDevices();
        }
    }

    return true;
}

// Block/unblock device
function toggleDeviceBlock(deviceId) {
    const device = getDevice(deviceId);
    if (!device) return false;

    // Update in appropriate array
    if (device.source === 'simulated') {
        const simDevice = SIMULATED_DEVICES.find(d => d.id === deviceId);
        if (simDevice) {
            simDevice.blocked = !simDevice.blocked;
        }
    } else if (device.source === 'custom') {
        const customDevice = customDevices.find(d => d.id === deviceId);
        if (customDevice) {
            customDevice.blocked = !customDevice.blocked;
            saveCustomDevices();
        }
    } else if (device.source === 'real') {
        const realDevice = realDevices.find(d => d.id === deviceId);
        if (realDevice) {
            realDevice.blocked = !realDevice.blocked;
            saveRealDevices();
        }
    }

    return true;
}

// Get total power consumption
function getTotalPowerConsumption() {
    return mergeDeviceSources()
        .filter(d => d.status === 'online')
        .reduce((total, device) => total + (device.powerWatts || 0), 0);
}

// Get random server for a device
function getRandomServer(device) {
    if (!device.servers || device.servers.length === 0) return null;
    return device.servers[Math.floor(Math.random() * device.servers.length)];
}

// Initialize on load
initDeviceStorage();
