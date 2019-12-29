#include "DHTProvider.hpp"

DHTProvider::DHTProvider(uint8_t pin, uint8_t type, const char* identifier)
    : dht(pin, type) {
  // Setup sensor
  this->dht.begin();

  // First sensor read
  this->lastTemp = 0.0f;
  this->lastHumidity = 0.0f;

  this->identifier = identifier;
}

DHTProvider::~DHTProvider() {}

const char* DHTProvider::getIdentifier() { return this->identifier; }

String DHTProvider::getData() {
  return String(this->lastTemp, 2) + ";" + String(this->lastHumidity, 2);
}

void DHTProvider::setData(const char* value) {}

void DHTProvider::update() {
  if (millis() - this->lastRequest >= DHT_READING_DELAY) {
    this->lastTemp = this->dht.readTemperature();
    this->lastHumidity = this->dht.readHumidity();

    this->lastRequest = millis();
  }
}
