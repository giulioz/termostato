#include <ArduinoJson.h>
#include <DallasTemperature.h>
#include <OneWire.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>
#include <Ticker.h>
#include "FS.h"

// CHANGE ME - costants
const int sensorPin = D8;
const int relayPin = D2;
const char* fversion = "WIP 12/11/17";
const char* ssid = "ZausaNet";
const char* password = "clzausa58";
//const char* ntpServerName = "time.nist.gov";
const int NTP_PACKET_SIZE = 48;
IPAddress server_ip (172, 16, 14, 1);
IPAddress dns_ip (8,8,8,8);
IPAddress gateway_ip (172, 16, 0, 1);
IPAddress subnet_mask(255, 255, 0, 0);

// Saved data
typedef struct save {
    float programHours[24];
    int currentMode; // 0: off, 1: on, 2: auto
    unsigned long timeZone;
    String identifier;
};
struct save savedData;

// Temp variables
OneWire oneWire(sensorPin);
DallasTemperature sensors(&oneWire);
ESP8266WebServer server(80);
byte packetBuffer[NTP_PACKET_SIZE];
IPAddress timeServerIP(37,247,53,178);
WiFiUDP udp;
int currentTime;
int currentState;
Ticker checkTicker;

// send an NTP request to the time server at the given address
unsigned long sendNTPpacket(IPAddress& address) {
    // set all bytes in the buffer to 0
    memset(packetBuffer, 0, NTP_PACKET_SIZE);
    // Initialize values needed to form NTP request
    // (see URL above for details on the packets)
    packetBuffer[0] = 0b11100011;   // LI, Version, Mode
    packetBuffer[1] = 0;     // Stratum, or type of clock
    packetBuffer[2] = 6;     // Polling Interval
    packetBuffer[3] = 0xEC;  // Peer Clock Precision
    // 8 bytes of zero for Root Delay & Root Dispersion
    packetBuffer[12]  = 49;
    packetBuffer[13]  = 0x4E;
    packetBuffer[14]  = 49;
    packetBuffer[15]  = 52;

    // all NTP fields have been given values, now
    // you can send a packet requesting a timestamp:
    udp.beginPacket(address, 123); //NTP requests are to port 123
    udp.write(packetBuffer, NTP_PACKET_SIZE);
    udp.endPacket();
}

unsigned long getTime() {
    //WiFi.hostByName(ntpServerName, timeServerIP);
    sendNTPpacket(timeServerIP);
    delay(1000);
    int cb = udp.parsePacket();
    if (cb) {
        udp.read(packetBuffer, NTP_PACKET_SIZE);
        unsigned long highWord = word(packetBuffer[40], packetBuffer[41]);
        unsigned long lowWord = word(packetBuffer[42], packetBuffer[43]);
        unsigned long secsSince1900 = highWord << 16 | lowWord;
        const unsigned long seventyYears = 2208988800UL;
        unsigned long epoch = secsSince1900 - seventyYears;
        return epoch + savedData.timeZone;
    }
}

void updateTime() {
    currentTime = getTime();
}

bool loadConfig() {
    File configFile = SPIFFS.open("/config.json", "r");
    if (!configFile) {
        return false;
    }

    size_t size = configFile.size();
    if (size > 1024) {
        return false; // File too large
    }
    std::unique_ptr<char[]> buf(new char[size]);
    configFile.readBytes(buf.get(), size);
    StaticJsonBuffer<1000> jsonBuffer;
    JsonObject& json = jsonBuffer.parseObject(buf.get());
    if (!json.success()) {
        return false;
    }

    savedData.timeZone = json["timeZone"];
    savedData.currentMode = json["currentMode"];
    savedData.identifier = json["identifier"].as<String>();
    for (int i = 0; i < 24; i++) {
        savedData.programHours[i] = json["programHours"][i];
    }

    return true;
}

bool saveConfig() {
    StaticJsonBuffer<1000> jsonBuffer;
    JsonObject& json = jsonBuffer.createObject();
    json["timeZone"] = savedData.timeZone;
    json["currentMode"] = savedData.currentMode;
    json["identifier"] = savedData.identifier;
    JsonArray& progs = json.createNestedArray("programHours");
    for (int i = 0; i < 24; i++) {
        progs.add(savedData.programHours[i]);
    }
  
    File configFile = SPIFFS.open("/config.json", "w");
    if (!configFile) {
      return false;
    }
  
    json.printTo(configFile);
    return true;
  }

void setup() {
    // Loads config
    SPIFFS.begin();
    loadConfig();

    // Set up hardware
    sensors.begin();
    pinMode(relayPin, OUTPUT);

    // WiFi and OTA
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    WiFi.config(server_ip, gateway_ip, subnet_mask, dns_ip);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
    }
    ArduinoOTA.begin();
    udp.begin(2390);

    // HTTP Requests
    server.on("/login_mode", HTTP_GET, [](){
        server.send(200, "text/json", "false");
    });
    server.on("/temp", HTTP_GET, [](){
        sensors.requestTemperatures();
        server.send(200, "text/json", String(sensors.getTempCByIndex(0)));
    });
    server.on("/identifier", HTTP_GET, [](){
        server.send(200, "text/json", "\"" + String(savedData.identifier) + "\"");
    });
    server.on("/identifier", HTTP_POST, [](){
        StaticJsonBuffer<200> newBuffer;
        JsonObject& newjson = newBuffer.parseObject(server.arg("plain"));
        savedData.identifier = newjson["identifier"].as<String>();
        if (saveConfig()) {
            server.send(200, "text/plain", "\"ok\"");
        } else {
            server.send(200, "text/plain", "\"error\"");
        }
    });
    server.on("/verson", HTTP_GET, [](){
        server.send(200, "text/json", "\"" + String(fversion) + "\"");
    });
    server.on("/time", HTTP_GET, [](){
        server.send(200, "text/json", String(currentTime) + " " +  String(savedData.timeZone));
    });
    server.on("/time", HTTP_POST, [](){
        StaticJsonBuffer<200> newBuffer;
        JsonObject& newjson = newBuffer.parseObject(server.arg("plain"));
        savedData.timeZone = newjson["shift"];
        if (saveConfig()) {
            server.send(200, "text/plain", "\"ok\"");
        } else {
            server.send(200, "text/plain", "\"error\"");
        }
    });
    server.on("/switching_mode", HTTP_GET, [](){
        if (savedData.currentMode == 1) {
            server.send(200, "text/json", "\"on\"");
        } else if (savedData.currentMode == 0) {
            server.send(200, "text/json", "\"off\"");            
        } else {
            if (digitalRead(relayPin)) {
                server.send(200, "text/json", "\"auto_on\"");
            } else {
                server.send(200, "text/json", "\"auto_off\"");
            }
        }
    });
    server.on("/switching_mode", HTTP_POST, [](){
        StaticJsonBuffer<200> newBuffer;
        JsonObject& newjson = newBuffer.parseObject(server.arg("plain"));
        if (newjson["mode"] == "on") {
            savedData.currentMode = 1;
            digitalWrite(relayPin, savedData.currentMode);
        } else if (newjson["mode"] == "off") {
            savedData.currentMode = 0;
            digitalWrite(relayPin, savedData.currentMode);
        } else {
            savedData.currentMode = 2;
            // start auto
        }
        if (saveConfig()) {
            server.send(200, "text/plain", "\"ok\"");
        } else {
            server.send(200, "text/plain", "\"error\"");
        }
    });
    server.on("/auto_prog", HTTP_GET, [](){
        StaticJsonBuffer<500> newBuffer;
        JsonArray& data = newBuffer.createArray();
        for (int i = 0; i < 24; i++) {
            data.add(savedData.programHours[i]);
        }
        String jsonRes;
        data.printTo(jsonRes);
        server.send(200, "text/json", jsonRes);
    });
    server.on("/auto_prog", HTTP_POST, [](){
        StaticJsonBuffer<500> newBuffer;
        JsonArray& data = newBuffer.parseArray(server.arg("plain"));
        for (int i = 0; i < 24; i++) {
            savedData.programHours[i] = data[i];
        }
        if (saveConfig()) {
            server.send(200, "text/plain", "\"ok\"");
        } else {
            server.send(200, "text/plain", "\"error\"");
        }
    });
    server.on("/debug", HTTP_GET, [](){
        sensors.requestTemperatures();
        float temp = sensors.getTempCByIndex(0);
        int currentHour = (currentTime % 86400L) / 3600;
        server.send(200, "text/json", String(currentHour) + " " + String(currentTime) + " "
            + String(savedData.programHours[currentHour]) + " "
            + String(temp) + " "
            + String(savedData.programHours[currentHour] > temp ? 1 : 0) + " "
            + String(savedData.currentMode) + " ");
    });
    server.begin();

    checkTicker.attach(60*1, updateTime);
}

void loop() {
    server.handleClient();
    ArduinoOTA.handle();

    if (savedData.currentMode > 1) {
        int hour = (currentTime % 86400L) / 3600;
        sensors.requestTemperatures();
        float temp = sensors.getTempCByIndex(0);
        currentState = savedData.programHours[hour] > temp ? 1 : 0;
    }
    digitalWrite(relayPin, savedData.currentMode < 2 ? savedData.currentMode : currentState);
}
