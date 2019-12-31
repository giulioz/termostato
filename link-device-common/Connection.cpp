#include "Connection.hpp"
#include <ESP8266WiFi.h>
#include <stdio.h>
#include "Config.hpp"
#include "Constants.hpp"

static bool tryConnection(const char* ssid, const char* password) {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  uint32_t start = micros();
  while (WiFi.status() != WL_CONNECTED) {
    yield();

    if ((micros() - start) >= WIFI_CONNECTION_TIMEOUT) {
      return false;
    }
  }

  return true;
}

void Connection::init() {
  if (WIFI_FIXED && tryConnection(WIFI_FIXED_SSID, WIFI_FIXED_PASSWORD)) {
    Serial.println("Fixed SSID: WiFi mode");
  } else if (!Config::get()->WIFI_CONFIGURED) {
    WiFi.softAP(AP_SSID, AP_PASSWORD);
    Serial.println("AP mode");
  } else {
    if (!tryConnection(Config::get()->WIFI_SSID,
                       Config::get()->WIFI_PASSWORD)) {
      Serial.println("Cannot connect, rebooting...");
      Config::ConfigModel newConfig = *Config::get();
      newConfig.WIFI_CONFIGURED = false;
      Config::set(&newConfig);
      ESP.restart();
    } else {
      Serial.println("WiFi mode");
    }
  }
}

void Connection::connectAndReboot(const char* ssid, const char* password) {
  Config::ConfigModel newConfig = *Config::get();
  strncpy(newConfig.WIFI_SSID, ssid, CONFIG_SSID_LENGTH);
  strncpy(newConfig.WIFI_PASSWORD, password, CONFIG_PASSWORD_LENGTH);
  newConfig.WIFI_CONFIGURED = true;
  newConfig.WIFI_SSID[CONFIG_SSID_LENGTH - 1] = 0;
  newConfig.WIFI_PASSWORD[CONFIG_PASSWORD_LENGTH - 1] = 0;
  if (Config::set(&newConfig)) {
    ESP.restart();
  } else {
    Serial.println("ERROR! cannot reboot and save connection");
  }
}
