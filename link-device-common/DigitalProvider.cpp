#include "DigitalProvider.hpp"

DigitalProvider::DigitalProvider(uint8_t pin, const char* identifier,
                                 bool writeMode) {
  this->pin = pin;
  this->identifier = identifier;
  this->writeMode = writeMode;
  this->lastSet = false;
}

DigitalProvider::~DigitalProvider() {}

const char* DigitalProvider::getIdentifier() { return this->identifier; }

String DigitalProvider::getData() {
  if (!writeMode) {
    pinMode(pin, INPUT);
    return String(digitalRead(pin));
  } else {
    return lastSet ? "1" : "0";
  }
}

void DigitalProvider::setData(const char* value) {
  if (writeMode) {
    lastSet = value[0] - '0';
    pinMode(pin, OUTPUT);
    digitalWrite(pin, lastSet);
  }
}

void DigitalProvider::update() {}
