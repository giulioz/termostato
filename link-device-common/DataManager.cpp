#include "DataManager.hpp"
#include <Arduino.h>

// static AnalogProvider lightSensor(1, "lightSensor");
static TempProvider tempSensor(D7, 12, "tempSensor");
static DigitalProvider relay(D2, "relay", true);

void DataManager::init() {}
void DataManager::handle() { tempSensor.update(); }

DataProvider* DataManager::getProvider(int i) {
  switch (i) {
    case 0:
      return &tempSensor;
    case 1:
      return &relay;
    default:
      return nullptr;
  }
}
