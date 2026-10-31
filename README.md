
# Automatic Antenna Alignment System for Optimized Wireless Communications

An ESP32-based smart antenna alignment prototype that monitors Wi-Fi Received Signal Strength Indicator (RSSI) across different antenna orientations and explores servo-based positioning to identify stronger signal directions.

**Project Status:** In Progress

## Project Overview

The Automatic Antenna Alignment System aims to improve wireless connectivity by identifying antenna orientations associated with stronger Wi-Fi signal reception.

The system uses an ESP32 development board to monitor Wi-Fi RSSI while exploring automated antenna positioning through a servo motor.

## Objectives

- Monitor Wi-Fi signal strength using ESP32.
- Scan signal strength across different antenna orientations.
- Identify orientations with stronger RSSI values.
- Explore automated antenna positioning using a servo motor.
- Display system information using an I2C LCD.
- Study wireless communication and antenna alignment concepts.

## System Architecture

Router / Wi-Fi Source  
↓  
Antenna and ESP32 Wi-Fi RSSI Monitoring  
↓  
Signal Strength Measurement  
↓  
Scanning and Decision Logic  
↓  
Servo Motor Positioning  
↓  
Antenna Orientation Adjustment

## Hardware Components

- ESP32 Development Board
- Servo Motor (MG996R)
- 16×2 I2C LCD Display
- Wi-Fi Antenna
- Power Supply
- Connecting Wires and Supporting Hardware

## Software and Technologies

- Embedded C / Arduino Programming
- Arduino IDE
- ESP32 Wi-Fi Library
- ESP32Servo Library
- LiquidCrystal_I2C Library
- I2C Communication
- Wi-Fi RSSI Monitoring

## Working Principle

1. The ESP32 connects to an available Wi-Fi network.
2. The system monitors the received Wi-Fi signal strength.
3. Different antenna orientations are explored during scanning.
4. RSSI readings are monitored and compared.
5. Servo-based positioning is used to explore antenna alignment.
6. The LCD provides system-status information.

## Repository Structure

- `antennaaligncode.ino` – ESP32 source code
- `circuit-diagrams/` – Hardware circuit documentation
- `images/` – Prototype photographs
- `website/` – Project demonstration website source code

## Project Demonstration Website

The website source code is available in the `website/` directory.

Online hosting is not yet completed.

## Current Development

- ESP32-based Wi-Fi RSSI monitoring.
- Servo motor interfacing and positioning.
- I2C LCD interfacing.
- Hardware testing and debugging.
- Website development and documentation.

## Future Scope

- Improved signal measurement and scanning algorithms.
- More precise antenna positioning.
- Outdoor wireless communication testing.
- Solar-powered communication node integration.
- Extended testing with directional antennas.

## Learning Outcomes

- ESP32 programming and microcontroller interfacing.
- Wi-Fi RSSI monitoring.
- Servo motor control.
- I2C display interfacing.
- Embedded hardware debugging.
- Antenna and wireless communication concepts.
- Technical documentation and project development.

## Author

**Yash Santosh Katyare**

B.Tech Electronics & Telecommunication Engineering  
Pillai College of Engineering, Navi Mumbai

GitHub: https://github.com/Yashkatyare

---

*Academic engineering project – currently under development.*
