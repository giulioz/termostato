#include "DataManager.hpp"
#include <Arduino.h>

// static AnalogProvider lightSensor(1, "lightSensor");
// static TempProvider tempSensor(D7, 12, "tempSensor");
// static DigitalProvider relay(D2, "relay", true);

static DHTProvider dhtSensor(4, DHT22, "dhtSensor");

void DataManager::init() {}
void DataManager::handle() { dhtSensor.update(); }

DataProvider* DataManager::getProvider(int i) {
  switch (i) {
    case 0:
      return &dhtSensor;
    default:
      return nullptr;
  }
}
