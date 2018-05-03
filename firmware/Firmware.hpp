#ifndef FIRMWARE_H
#define FIRMWARE_H

#include "FileIO.hpp"
#include "Config.hpp"
#include "TempSensor.hpp"
#include "Thermostat.hpp"
#include "Scheduler.hpp"
#include "TimeProvider.hpp"
#include "NTPTimeProvider.hpp"

#include <Arduino.h>
#include <stdlib.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>
#include <ArduinoJson.h>

class Firmware {
private:
    Config config;
    Scheduler scheduler;
    TempSensor tempSensor;
    Thermostat thermostat;
    ESP8266WebServer webServer;

    void InitNetwork(const char* ssid, const char* password, const IPAddress server_ip, const IPAddress gateway_ip, const IPAddress subnet_mask, const IPAddress dns_ip);
    void InitWebServer();
    void SendCommonHTTPHeaders();

public:
    Firmware();
    ~Firmware();
    void Init();
    void Update();
};

#endif
