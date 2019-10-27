#include "AnalogProvider.hpp"

AnalogProvider::AnalogProvider(uint8_t pin, const char* identifier) {
  this->pin = pin;
  this->identifier = identifier;
}

AnalogProvider::~AnalogProvider() {}

const char* AnalogProvider::getIdentifier() { return this->identifier; }

String AnalogProvider::getData() { return String(analogRead(pin)); }

void AnalogProvider::setData(const char* value) {}

void AnalogProvider::update() {}
