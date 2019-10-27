#include "TempProvider.hpp"

TempProvider::TempProvider(uint8_t pin, int resolution, const char* identifier)
    : oneWire(pin), sensors(&this->oneWire) {
  this->resolution = resolution;

  // Setup sensor
  this->sensors.begin();
  this->sensors.getAddress(this->address, 0);
  this->sensors.setResolution(this->address, resolution);
  this->sensors.setWaitForConversion(false);

  // First sensor read
  this->delay = 750 / (1 << (12 - resolution));
  this->lastTemp = 0.0f;
  this->startReading();

  this->identifier = identifier;
}

TempProvider::~TempProvider() {}

void TempProvider::startReading() {
  this->sensors.requestTemperatures();
  this->lastTempRequest = millis();
}

const char* TempProvider::getIdentifier() { return this->identifier; }

String TempProvider::getData() { return String(this->lastTemp, 2); }

void TempProvider::setData(const char* value) {}

void TempProvider::update() {
  if (millis() - this->lastTempRequest >= this->delay) {
    this->lastTemp = this->sensors.getTempCByIndex(0);
    this->startReading();
  }
}
