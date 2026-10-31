/*
  AUTOMATIC ANTENNA ALIGNMENT SYSTEM
  ESP32 + MG996R Continuous-Rotation Servo + I2C LCD + AWS

  Receiver ESP32:
    Servo signal -> GPIO18
    LCD SDA      -> GPIO21
    LCD SCL      -> GPIO22

  IMPORTANT:
  - MG996R must be continuous-rotation type for timed scanning.
  - Servo needs a suitable external 5-6V supply.
  - Connect external supply GND to ESP32 GND.
  - client.setInsecure() is for prototype testing only.
*/

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <ESP32Servo.h>

// ---------------- WIFI SETTINGS ----------------

const char* routerSSID = "Antenna_Test";
const char* routerPassword = "12345678";

// Wi-Fi network being measured
const char* sourceSSID = "Antenna_Test";

// ---------------- AWS SETTINGS -----------------

const char* awsEndpoint =
  "https://aqqdbwzdo1.execute-api.ap-south-1.amazonaws.com/prod/live";

const char* deviceToken = "123456789123456789123456789123456789";

// ---------------- HARDWARE PINS ----------------

const int SERVO_PIN = 18;
const int LCD_SDA = 21;
const int LCD_SCL = 22;

LiquidCrystal_I2C lcd(0x27, 16, 2);
Servo antennaServo;

// ---------------- SERVO SETTINGS ----------------

// These values are for a continuous-rotation servo.
// Calibrate the movement time on your actual mechanism.
const int SERVO_STOP = 1500;
const int SERVO_FORWARD = 1570;
const int SERVO_REVERSE = 1430;

const int STEP_DEGREES = 15;
const int MAX_ANGLE = 180;

// Time for an approximate 15-degree movement.
// Adjust after testing your physical antenna mechanism.
const unsigned long STEP_TIME_MS = 400;
const unsigned long SETTLE_TIME_MS = 300;

// 0, 15, 30, ... 180 = 13 scan positions
const int TOTAL_POINTS = (MAX_ANGLE / STEP_DEGREES) + 1;

// ---------------- SCAN DATA ---------------------

int bestAngle = 0;
int bestRSSI = -100;

int currentAngle = 0;
int currentRSSI = -100;

bool sourceFound = false;

// ---------------- LCD HELPERS -------------------

void showLCD(const String& line1, const String& line2) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(line1.substring(0, 16));
  lcd.setCursor(0, 1);
  lcd.print(line2.substring(0, 16));
}

// ---------------- INTERNET WIFI ------------------

bool connectInternetWiFi() {
  if (WiFi.status() == WL_CONNECTED) {
    return true;
  }

  Serial.println("Connecting to internet Wi-Fi...");
  WiFi.mode(WIFI_STA);
  WiFi.begin(routerSSID, routerPassword);

  unsigned long startTime = millis();

  while (WiFi.status() != WL_CONNECTED &&
         millis() - startTime < 20000) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("Connected. IP: ");
    Serial.println(WiFi.localIP());
    return true;
  }

  Serial.println("Internet Wi-Fi connection failed.");
  return false;
}

// ---------------- SERVO MOVEMENT -----------------

void stopServo() {
  antennaServo.writeMicroseconds(SERVO_STOP);
  delay(200);
}

void moveOneStepForward() {
  antennaServo.writeMicroseconds(SERVO_FORWARD);
  delay(STEP_TIME_MS);
  stopServo();
  delay(SETTLE_TIME_MS);
}

void moveOneStepReverse() {
  antennaServo.writeMicroseconds(SERVO_REVERSE);
  delay(STEP_TIME_MS);
  stopServo();
  delay(SETTLE_TIME_MS);
}

// ---------------- RSSI SCAN ----------------------

int readSourceRSSI() {
  int numberOfNetworks = WiFi.scanNetworks(false, true);
  int foundRSSI = -100;

  if (numberOfNetworks < 0) {
    Serial.println("Wi-Fi scan failed.");
    WiFi.scanDelete();
    return -100;
  }

  for (int i = 0; i < numberOfNetworks; i++) {
    if (WiFi.SSID(i) == sourceSSID) {
      int rssi = WiFi.RSSI(i);

      // RSSI closer to zero means a stronger signal.
      if (foundRSSI == -100 || rssi > foundRSSI) {
        foundRSSI = rssi;
      }
    }
  }

  WiFi.scanDelete();

  if (foundRSSI != -100) {
    Serial.print("Source RSSI: ");
    Serial.print(foundRSSI);
    Serial.println(" dBm");
  } else {
    Serial.println("Antenna_Test not found.");
  }

  return foundRSSI;
}

// ---------------- AWS UPLOAD ---------------------

void uploadReading(
  int angle,
  int rssi,
  int strongestAngle,
  int strongestRSSI,
  const char* statusText
) {
  if (!connectInternetWiFi()) {
    Serial.println("AWS upload skipped: no internet Wi-Fi.");
    return;
  }

  WiFiClientSecure client;

  // TEMPORARY prototype testing only.
  // This disables server certificate verification.
  // Configure certificate validation before permanent use.
  client.setInsecure();

  HTTPClient http;

  if (!http.begin(client, awsEndpoint)) {
    Serial.println("Could not start HTTPS request.");
    return;
  }

  http.setTimeout(10000);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-device-token", deviceToken);

  String body = "{";
  body += "\"currentAngle\":" + String(angle) + ",";
  body += "\"currentRSSI\":" + String(rssi) + ",";
  body += "\"bestAngle\":" + String(strongestAngle) + ",";
  body += "\"bestRSSI\":" + String(strongestRSSI) + ",";
  body += "\"status\":\"" + String(statusText) + "\",";
  body += "\"sourceSSID\":\"Antenna_Test\"";
  body += "}";

  Serial.println("Uploading to AWS...");
  Serial.println(body);

  int httpCode = http.POST(body);

  Serial.print("AWS HTTP code: ");
  Serial.println(httpCode);

  if (httpCode > 0) {
    String response = http.getString();
    Serial.print("AWS response: ");
    Serial.println(response);
  } else {
    Serial.print("HTTPS error: ");
    Serial.println(http.errorToString(httpCode));
  }

  http.end();
}

// ---------------- FULL ANTENNA SCAN --------------

void performAntennaScan() {
  bestRSSI = -100;
  bestAngle = 0;
  currentAngle = 0;
  currentRSSI = -100;
  sourceFound = false;

  showLCD("Starting scan...", "Please wait");
  Serial.println();
  Serial.println("=== ANTENNA SCAN START ===");

  for (int point = 0; point < TOTAL_POINTS; point++) {
    currentAngle = point * STEP_DEGREES;

    // Move from the previous estimated position.
    if (point > 0) {
      moveOneStepForward();
    }

    Serial.print("Estimated angle: ");
    Serial.println(currentAngle);

    showLCD("Angle: " + String(currentAngle) + " deg",
            "Scanning Wi-Fi");

    currentRSSI = readSourceRSSI();

    if (currentRSSI != -100) {
      sourceFound = true;

      if (currentRSSI > bestRSSI) {
        bestRSSI = currentRSSI;
        bestAngle = currentAngle;
      }
    }

    Serial.print("Best angle so far: ");
    Serial.println(bestAngle);

    showLCD("RSSI: " + String(currentRSSI) + " dBm",
            "Best: " + String(bestRSSI) + " dBm");

    delay(150);
  }

  stopServo();

  if (!sourceFound) {
    showLCD("Source not found", "Check Antenna_Test");
    Serial.println("No source network found.");

    uploadReading(
      currentAngle,
      currentRSSI,
      bestAngle,
      bestRSSI,
      "Source not found"
    );

    return;
  }

  // Return toward the estimated best scan position.
  int reverseSteps = (MAX_ANGLE - bestAngle) / STEP_DEGREES;

  showLCD("Moving to best", "Angle: " + String(bestAngle));

  Serial.print("Returning by reverse steps: ");
  Serial.println(reverseSteps);

  for (int i = 0; i < reverseSteps; i++) {
    moveOneStepReverse();
  }

  stopServo();
  currentAngle = bestAngle;

  showLCD("Best angle: " + String(bestAngle),
          "Best: " + String(bestRSSI) + " dBm");

  Serial.println("=== SCAN COMPLETE ===");
  Serial.print("Best estimated angle: ");
  Serial.println(bestAngle);
  Serial.print("Best RSSI: ");
  Serial.print(bestRSSI);
  Serial.println(" dBm");

  uploadReading(
    currentAngle,
    bestRSSI,
    bestAngle,
    bestRSSI,
    "Aligned"
  );
}

// ---------------- SETUP -------------------------

void setup() {
  Serial.begin(115200);
  delay(1000);

  Wire.begin(LCD_SDA, LCD_SCL);
  lcd.init();
  lcd.backlight();

  antennaServo.setPeriodHertz(50);
  antennaServo.attach(SERVO_PIN, 1000, 2000);
  stopServo();

  showLCD("Antenna System", "Connecting WiFi");

  if (connectInternetWiFi()) {
    showLCD("WiFi connected", "System ready");
  } else {
    showLCD("WiFi unavailable", "Check settings");
  }

  delay(1500);
}

// ---------------- MAIN LOOP ----------------------

void loop() {
  performAntennaScan();

  // Wait 10 seconds before the next complete scan.
  // The dashboard will show the latest uploaded result.
  for (int i = 10; i > 0; i--) {
    showLCD("Next scan in:", String(i) + " seconds");
    delay(1000);
  }
}