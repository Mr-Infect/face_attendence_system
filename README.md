# 🌐 IoT Network Monitoring & Control System

A sophisticated web-based application for monitoring and controlling IoT devices on your home network. Designed for non-technical users with plain English descriptions and intuitive visualizations.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?logo=chartdotjs&logoColor=white)

## 📋 Overview

This application provides a comprehensive solution for monitoring network traffic, analyzing device behavior, and controlling IoT devices in your home. With a GlassWire-inspired interface, it offers real-time traffic visualization, detailed analytics, and remote device control—all in plain English that anyone can understand.

### ✨ Key Features

- **🔍 Real-Time Traffic Monitoring** - Watch network activity as it happens with plain English descriptions
- **📊 Advanced Analytics** - Beautiful charts showing traffic patterns, power consumption, and device statistics
- **🎮 Device Control** - Remotely turn devices on/off and block/allow network communications
- **🌓 Light/Dark Themes** - Modern, sophisticated UI with theme switching
- **🏠 15 Simulated Devices** - Realistic household IoT devices for testing and demonstration
- **⚡ Power Tracking** - Monitor electricity consumption and estimated costs
- **🔒 Security Controls** - Block suspicious device communications with single click

## 🚀 Quick Start

### Prerequisites

- Python 3.x (for local web server)
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation & Running

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mr-Infect/iot-monitoring-system.git
   cd iot-monitoring-system
   ```

2. **Start the local web server**
   ```bash
   python3 -m http.server 8080
   ```
   
   Or if you have Python 2:
   ```bash
   python -m SimpleHTTPServer 8080
   ```

3. **Open in your browser**
   ```
   http://localhost:8080
   ```

That's it! The application will start immediately with simulated devices generating realistic traffic.

## 📱 Simulated Devices

The system includes 15 realistic household IoT devices:

| Device | Type | Power | Controllable |
|--------|------|-------|--------------|
| 💻 Work Laptop | Computer | 45W | ❌ |
| 📱 iPhone 14 | Smartphone | 5W | ❌ |
| 📺 Smart TV | Entertainment | 120W | ✅ |
| 🔧 Raspberry Pi | IoT Hub | 15W | ❌ |
| 🤖 Robot Vacuum | Appliance | 55W | ✅ |
| 💡 Living Room Lights | Lighting | 12W | ✅ |
| 🛏️ Bedroom Lights | Lighting | 10W | ✅ |
| 🔊 Amazon Alexa | Voice Assistant | 3W | ✅ |
| 🌡️ Smart Thermostat | Climate | 2W | ✅ |
| 🔔 Smart Doorbell | Security | 8W | ❌ |
| 📷 Security Camera | Security | 6W | ✅ |
| 🔌 Smart Plug (Fan) | Outlet | 1W | ✅ |
| 🧊 Smart Refrigerator | Appliance | 150W | ❌ |
| 📱 iPad | Tablet | 10W | ❌ |
| 🔈 Google Home | Smart Speaker | 5W | ✅ |

**Total Power Consumption**: 433W

## 🎯 How to Use

### Traffic Monitor Page

1. **View Real-Time Activity** - Traffic updates every 2 seconds
2. **Search Traffic** - Filter by device name or activity
3. **Filter by Device** - Select specific device from dropdown
4. **Block Devices** - Click "Block" to prevent network access
5. **Read Plain English** - No technical jargon, just simple descriptions

Example traffic descriptions:
- "Your Smart TV is streaming a video from Netflix"
- "Your iPhone 14 is syncing data with icloud.com"
- "Your Robot Vacuum is receiving commands from aws-iot.amazonaws.com"

### Analytics Dashboard

- **Traffic Over Time** - Line chart showing download/upload speeds
- **Traffic by Device** - Doughnut chart of data usage per device
- **Power Consumption** - Bar chart of electricity usage
- **Protocol Distribution** - Pie chart of traffic types
- **Summary Statistics** - Total data, speeds, power, and cost estimates

### Device Control Center

- **View All Devices** - Grid or list view of 15 devices
- **Turn On/Off** - Control 9 smart devices remotely
- **Block/Unblock** - Manage network access for any device
- **Monitor Status** - See online, offline, and blocked states

## 💡 Advantages

### For Home Users

- **Easy to Understand** - No technical knowledge required
- **Visual Insights** - See exactly what your devices are doing
- **Privacy Control** - Block devices sending unwanted data
- **Power Savings** - Identify and control energy-hungry devices
- **Security** - Detect and stop suspicious device behavior

### Technical Benefits

- **No Backend Required** - Pure client-side JavaScript
- **Lightweight** - No dependencies except Chart.js
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Customizable** - Easy to modify and extend
- **Realistic Simulation** - Perfect for testing and demonstrations

### Design Excellence

- **Modern UI** - GlassWire-inspired dark theme
- **Glassmorphism** - Beautiful translucent effects
- **Smooth Animations** - Professional transitions and interactions
- **Accessible** - Semantic HTML and ARIA labels
- **Theme Support** - Light and dark modes

## 🔮 Future Development

### Planned Features

- [ ] **Real Network Scanning** - Integrate with actual network tools (nmap, arp-scan)
- [ ] **Historical Data Storage** - IndexedDB for long-term traffic history
- [ ] **Export Reports** - PDF/CSV export of analytics data
- [ ] **Custom Alerts** - Notifications for unusual device behavior
- [ ] **Device Grouping** - Organize devices by room or type
- [ ] **Bandwidth Limits** - Set data caps per device
- [ ] **Scheduling** - Automated device control based on time
- [ ] **Multi-Network Support** - Monitor multiple networks simultaneously
- [ ] **Mobile App** - Native iOS/Android applications
- [ ] **Cloud Sync** - Backup settings and data to cloud

### Advanced Features

- [ ] **Machine Learning** - Anomaly detection for security threats
- [ ] **VPN Integration** - Monitor VPN-connected devices
- [ ] **Parental Controls** - Content filtering and time limits
- [ ] **Guest Network Management** - Separate monitoring for guest devices
- [ ] **API Integration** - Connect with smart home platforms (Home Assistant, SmartThings)
- [ ] **Traffic Shaping** - QoS and bandwidth prioritization
- [ ] **Network Topology Map** - Visual representation of device connections
- [ ] **Port Scanning** - Identify open ports and services

## 🛠️ Technology Stack

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with custom properties
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **Chart.js** - Beautiful, responsive charts
- **Python HTTP Server** - Simple local hosting

## 📁 Project Structure

```
iot-monitoring-system/
├── index.html          # Main application structure
├── styles.css          # Complete design system
├── js/
│   ├── devices.js      # 15 simulated devices
│   ├── traffic.js      # Traffic simulation engine
│   ├── analytics.js    # Chart.js visualizations
│   ├── controls.js     # Device control interface
│   └── app.js          # Main application controller
└── README.md           # This file
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Mr-Infect**

- GitHub: [@Mr-Infect](https://github.com/Mr-Infect)

## 🙏 Acknowledgments

- Inspired by [GlassWire](https://www.glasswire.com/) network monitoring tool
- Charts powered by [Chart.js](https://www.chartjs.org/)
- Icons from Unicode emoji set

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**⭐ If you find this project useful, please consider giving it a star!**
