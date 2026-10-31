# 📡 Automatic Antenna Alignment System for Optimized Wireless Communications

<p align="center">
  <strong>An ESP32-Based Smart Antenna Alignment and Wireless Signal Optimization Project</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-ESP32-blue?style=for-the-badge&logo=espressif" alt="ESP32">
  <img src="https://img.shields.io/badge/Language-Embedded%20C-orange?style=for-the-badge" alt="Embedded C">
  <img src="https://img.shields.io/badge/IDE-Arduino%20IDE-00979D?style=for-the-badge&logo=arduino" alt="Arduino IDE">
  <img src="https://img.shields.io/badge/Domain-IoT-green?style=for-the-badge" alt="IoT">
</p>

---

## 📌 1. Project Overview

The **Automatic Antenna Alignment System for Optimized Wireless Communications** is an ESP32-based engineering project designed to explore automated antenna positioning using Wi-Fi Received Signal Strength Indicator (RSSI) measurements.

In conventional wireless communication systems, antenna positioning is often performed manually. Incorrect antenna orientation can result in weaker signal reception, reduced connectivity, and inconsistent wireless performance.

This project explores an automated approach in which an ESP32 scans available Wi-Fi signals, measures their RSSI values, and uses a servo motor to adjust the antenna position toward a direction associated with stronger signal reception.

The proposed system aims to reduce manual alignment efforts and demonstrate how embedded systems, wireless communication, sensor-based measurements, and motor control can work together.

**Project Goal:** To develop a smart, automated antenna alignment prototype that identifies stronger wireless signal directions and assists in optimizing antenna positioning.

---

## 🎯 2. Project Objectives

The primary objectives of this project are:

- To develop an automatic antenna alignment prototype using ESP32.
- To monitor Wi-Fi signal strength using RSSI measurements.
- To perform signal scanning across multiple antenna positions.
- To identify the position associated with the strongest measured signal.
- To control antenna movement using a servo motor.
- To display relevant system information using an I2C LCD.
- To explore embedded control techniques for wireless communication applications.
- To investigate the potential of automated antenna positioning in remote and rural communication environments.

---

## 🏗️ 3. System Architecture

The system follows a microcontroller-based control architecture in which signal measurement and antenna positioning are coordinated through an ESP32.

### System Block Diagram

```text
          Wi-Fi Router / Access Point
                     |
                     |
              Wireless Signal
                     |
                     ▼
             Antenna Assembly
                     |
                     ▼
              ESP32 Controller
                     |
          ┌──────────┴──────────┐
          |                     |
          ▼                     ▼
    Wi-Fi RSSI Scan       Control Algorithm
          |                     |
          ▼                     ▼
    Signal Measurement    Servo Motor Control
          |                     |
          └──────────┬──────────┘
                     |
                     ▼
             Antenna Positioning
                     |
                     ▼
              LCD Information
```

### Architecture Description

1. **Wi-Fi Signal Source:** A router or wireless access point provides the Wi-Fi signal.
2. **Antenna Assembly:** Receives the wireless signal at different orientations.
3. **ESP32 Controller:** Acts as the central processing and control unit.
4. **RSSI Measurement:** Measures the received Wi-Fi signal strength.
5. **Control Algorithm:** Compares signal measurements from different positions.
6. **Servo Motor:** Adjusts the antenna orientation according to the selected position.
7. **LCD Display:** Provides system information and signal-related readings.

---

## 🔩 4. Hardware Components

| Component | Purpose |
|---|---|
| ESP32 Development Board | Main controller and Wi-Fi scanning |
| Wi-Fi Antenna | Wireless signal reception |
| Servo Motor (MG996R) | Mechanical antenna positioning |
| I2C LCD Display | Displaying system information |
| External Power Supply | Supplying appropriate power to hardware |
| Connecting Wires | Electrical interconnections |
| Mounting Structure | Supporting the antenna and positioning mechanism |

### Main Controller: ESP32

The ESP32 is selected because it provides:

- Built-in Wi-Fi connectivity.
- Integrated microcontroller functionality.
- GPIO support for peripheral interfacing.
- PWM capability for servo motor control.
- I2C communication support.
- Compatibility with Arduino IDE.

---

## 💻 5. Software and Technologies

| Technology | Application |
|---|---|
| Embedded C / C++ | Microcontroller programming |
| Arduino IDE | Firmware development and uploading |
| ESP32 Wi-Fi Library | Wireless scanning and RSSI measurement |
| ESP32Servo Library | Servo motor control |
| Wire Library | I2C communication |
| LiquidCrystal_I2C | LCD interfacing |
| HTML, CSS, JavaScript | Project demonstration website |
| Git & GitHub | Source code management and project hosting |
| GitHub Pages | Website deployment |

### Communication and Interfacing

- **Wi-Fi:** Wireless network scanning and RSSI measurement.
- **PWM:** Servo motor position control.
- **I2C:** LCD communication.

---

## ⚙️ 6. Working Principle

The proposed system operates through the following sequence:

**Step 1: System Initialization**

The ESP32 initializes the required hardware interfaces, Wi-Fi functionality, LCD display, and servo motor.

**Step 2: Wireless Signal Scanning**

The ESP32 scans for available Wi-Fi networks and collects signal-strength information.

**Step 3: RSSI Measurement**

The Received Signal Strength Indicator (RSSI) is used to estimate the received Wi-Fi signal strength.

RSSI values are generally represented in dBm. Values closer to zero generally indicate stronger received signals.

For example:

- -40 dBm: Strong signal
- -60 dBm: Good signal
- -75 dBm: Weaker signal
- -90 dBm: Very weak signal

These values are illustrative and actual reception depends on the environment and hardware.

**Step 4: Antenna Position Scanning**

The servo motor moves the antenna assembly through predefined positions to investigate signal reception at different orientations.

**Step 5: Signal Comparison**

The ESP32 compares the recorded RSSI measurements and identifies the position associated with the strongest measured signal.

**Step 6: Automatic Alignment**

The servo motor moves the antenna toward the selected position.

**Step 7: Display and Monitoring**

The LCD can display relevant information such as signal strength and system status.

### Simplified Flowchart

```text
       START
         |
         ▼
 Initialize ESP32
         |
         ▼
 Initialize Wi-Fi,
 LCD and Servo
         |
         ▼
 Scan Wi-Fi Signals
         |
         ▼
 Measure RSSI
         |
         ▼
 Move Through
 Antenna Positions
         |
         ▼
 Record Signal Values
         |
         ▼
 Compare RSSI Values
         |
         ▼
 Identify Strongest
 Measured Position
         |
         ▼
 Move Antenna to
 Selected Position
         |
         ▼
 Display System Status
         |
         ▼
 Continue Monitoring
```

---

## 📁 7. Repository Structure

The repository contains the project demonstration website and its supporting resources.

```text
Automatic-Antenna-Alignment-System/
│
├── website/
│   ├── index.html
│   ├── about.html
│   ├── applications.html
│   ├── components.html
│   ├── contact.html
│   ├── dashboard.html
│   ├── future-scope.html
│   ├── gallery.html
│   ├── how-it-works.html
│   │
│   ├── css/
│   │   ├── style.css
│   │   ├── animation-demo.css
│   │   └── dashboard.css
│   │
│   ├── js/
│   │   ├── main.js
│   │   ├── dashboard.js
│   │   └── animation-demo.js
│   │
│   └── assets/
│       └── images/
│
├── .github/
│   └── workflows/
│       └── GitHub Pages deployment workflow
│
└── README.md
```

---

## 🌐 8. Project Demonstration Website

A dedicated website has been developed to explain the concept, architecture, components, working principle, applications, and future scope of the proposed system.

### Live Website

🔗 **[Visit the Automatic Antenna Alignment System Website](https://yashkatyare.github.io/Automatic-Antenna-Alignment-System/)**

### Website Features

- Project introduction and overview.
- System architecture and working principle.
- Hardware component information.
- Applications and potential use cases.
- Interactive visual demonstrations.
- Dashboard-style project interface.
- Future development possibilities.

**Note:** The website provides a conceptual and visual demonstration of the project. Its simulated visual elements should not be interpreted as live hardware telemetry unless connected to an actual hardware data source.

---

## 📊 9. Current Development

The project is being developed as an ESP32-based automatic antenna alignment prototype.

The current development activities include:

- ESP32 Wi-Fi scanning and RSSI monitoring.
- Servo motor interfacing and movement control.
- LCD interfacing through the I2C protocol.
- Development of a signal-strength comparison approach.
- Integration and testing of the antenna positioning mechanism.
- Development and deployment of the project demonstration website.

Further hardware integration, calibration, and practical performance validation are part of the ongoing development process.

---

## 🌍 10. Applications

The proposed system has potential applications in:

**1. Rural Connectivity**

Could assist in positioning wireless antennas in rural locations where reliable connectivity is important.

**2. Remote Communication Stations**

Potential use in remote communication installations where manual antenna adjustment may be difficult.

**3. Wireless Network Optimization**

Can be explored for improving antenna positioning in Wi-Fi-based communication setups.

**4. IoT Infrastructure**

Could support wireless connectivity in distributed IoT installations.

**5. Educational and Research Applications**

Useful for understanding RSSI measurements, embedded control, antenna positioning, and wireless communication principles.

**6. Disaster Management Communication**

Could be investigated for temporary communication setups in areas where communication infrastructure is limited.

---

## 🔮 11. Future Scope

The project can be extended through several improvements:

- **360-Degree Scanning:** Implement a complete rotational scanning mechanism.
- **Improved Signal Processing:** Introduce averaging and filtering to reduce RSSI fluctuations.
- **Dual-Axis Alignment:** Explore horizontal and vertical antenna positioning.
- **Solar Power Integration:** Develop a solar-powered version for remote installations.
- **Weather-Resistant Design:** Introduce protective enclosures for outdoor deployment.
- **Remote Monitoring:** Integrate IoT-based monitoring and control.
- **Cloud Connectivity:** Store signal measurements and positioning data for analysis.
- **Automated Re-Alignment:** Investigate periodic scanning and adjustment when signal conditions change.
- **Advanced Algorithms:** Explore optimization techniques for more reliable positioning.

---

## 📚 12. Learning Outcomes

This project provides practical exposure to:

- ESP32 microcontroller programming.
- Embedded C/C++ development.
- Wi-Fi scanning and RSSI measurement.
- Wireless communication fundamentals.
- Servo motor interfacing and control.
- PWM-based hardware control.
- I2C communication and LCD interfacing.
- Embedded system integration.
- Hardware and software development.
- Technical documentation and project presentation.
- GitHub repository management and website deployment.

---

## 👨‍💻 13. Author

**Yash Katare**

B.Tech – Electronics & Telecommunication Engineering  
Pillai College of Engineering, Navi Mumbai  
Graduating: 2027

### Areas of Interest

- Embedded Systems Engineering
- Firmware Development
- IoT and Wireless Communication
- Microcontrollers and ARM Architecture
- Robotics and Automation
- Electronics Hardware Development

### Connect

- GitHub: [Yashkatyare](https://github.com/Yashkatyare)
- Project Repository: [Automatic Antenna Alignment System](https://github.com/Yashkatyare/Automatic-Antenna-Alignment-System)
- Live Website: [Project Demonstration](https://yashkatyare.github.io/Automatic-Antenna-Alignment-System/)

---

## ⭐ Support

If you find this project interesting, consider giving the repository a ⭐ on GitHub.

This project is developed for academic learning, experimentation, and exploration of automated antenna positioning techniques.

**Thank you for visiting!**
