#include <ArduinoJson.h>
#include <DallasTemperature.h>
#include <OneWire.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>

// CHANGE ME - costants
const int sensorPin = D8;
const int relayPin = D9;
const char* identifier = "termostato";
const char* fversion = "WIP 11/11/17";
const char* ssid = "ZausaNet";
const char* password = "clzausa58";
const char* ntpServerName = "time.nist.gov";
const int NTP_PACKET_SIZE = 48;

// Saved data
float hotTemp = 25.00f;
float coldTemp = 20.00f;
byte days[7][24];

// Temp variables
OneWire oneWire(sensorPin);
DallasTemperature sensors(&oneWire);
ESP8266WebServer server(80);
IPAddress timeServerIP;
byte packetBuffer[ NTP_PACKET_SIZE];
WiFiUDP udp;

typedef struct save {
  unsigned long timeZone;
  
};
struct save savedData = { 3600 };

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
  WiFi.hostByName(ntpServerName, timeServerIP);
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

void setup() {
  sensors.begin();
  pinMode(relayPin, OUTPUT);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  udp.begin(2390);

  server.on("/temp", HTTP_GET, [](){
    sensors.requestTemperatures();
    server.send(200, "text/json", String(sensors.getTempCByIndex(0)));
  });
  server.on("/identifier", HTTP_GET, [](){
    server.send(200, "text/json", "\"" + String(identifier) + "\"");
  });
  server.on("/identifier", HTTP_POST, [](){
    StaticJsonBuffer<200> newBuffer;
    JsonObject& newjson = newBuffer.parseObject(server.arg("plain"));
    identifier = newjson["identifier"];
    server.send(200, "text/plain", "ok");
  });
  server.on("/verson", HTTP_GET, [](){
    server.send(200, "text/json", "\"" + String(fversion) + "\"");
  });
  server.on("/time", HTTP_GET, [](){
    server.send(200, "text/json", String(getTime()));
  });
  server.on("/force_on", HTTP_POST, [](){
    digitalWrite(relayPin, 1);
    server.send(200, "text/plain", "ok");
  });
  server.on("/force_off", HTTP_POST, [](){
    digitalWrite(relayPin, 0);
    server.send(200, "text/plain", "ok");
  });
  server.begin();
}

void loop() {
  server.handleClient();
}
