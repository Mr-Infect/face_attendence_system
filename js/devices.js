// Device Simulation Engine
// Defines 15 household IoT devices with realistic properties

const DEVICES = [
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

// Get device by ID
function getDevice(deviceId) {
    return DEVICES.find(d => d.id === deviceId);
}

// Get all devices
function getAllDevices() {
    return DEVICES;
}

// Get online devices
function getOnlineDevices() {
    return DEVICES.filter(d => d.status === 'online' && !d.blocked);
}

// Get blocked devices
function getBlockedDevices() {
    return DEVICES.filter(d => d.blocked);
}

// Get controllable devices
function getControllableDevices() {
    return DEVICES.filter(d => d.controllable);
}

// Toggle device power (for controllable devices)
function toggleDevicePower(deviceId) {
    const device = getDevice(deviceId);
    if (device && device.controllable) {
        device.status = device.status === 'online' ? 'offline' : 'online';
        return true;
    }
    return false;
}

// Block/unblock device
function toggleDeviceBlock(deviceId) {
    const device = getDevice(deviceId);
    if (device) {
        device.blocked = !device.blocked;
        return true;
    }
    return false;
}

// Get total power consumption
function getTotalPowerConsumption() {
    return DEVICES
        .filter(d => d.status === 'online')
        .reduce((total, device) => total + device.powerWatts, 0);
}

// Get random server for a device
function getRandomServer(device) {
    if (!device.servers || device.servers.length === 0) return null;
    return device.servers[Math.floor(Math.random() * device.servers.length)];
}
