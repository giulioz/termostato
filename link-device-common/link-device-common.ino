#include "ArduinoOTA.h"
#include "Config.hpp"
#include "Connection.hpp"
#include "Constants.hpp"
#include "DataManager.hpp"
#include "Discovery.hpp"
#include "HttpApi.hpp"
#include "FileIO.hpp"

void setup() {
  Serial.begin(115200);
  Serial.println("Initialising...");

  FileIO::init();

  Serial.print("Reading config...");
  if (Config::read()) {
    Serial.println(" ok");
  } else {
    if (Config::init()) {
      Serial.println(" ok");
    } else {
      Serial.println(" error!");
    }
  }

  Connection::init();
  Discovery::init();
  DataManager::init();
  HttpApi::init();

  ArduinoOTA.setHostname(DEVICE_SERIAL);
  ArduinoOTA.begin();
}

void loop() {
  Discovery::handle();
  DataManager::handle();
  HttpApi::handle();

  ArduinoOTA.handle();
}
