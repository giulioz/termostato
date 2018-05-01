#include "TempSensor.hpp"

TempSensor::TempSensor(const int pin, const int resolution) :
    oneWire(pin),
    sensors(&this->oneWire) {
    this->resolution = resolution;

    // Setup sensor
    this->sensors.begin();
    this->sensors.getAddress(this->address, 0);
    this->sensors.setResolution(this->address, resolution);
    this->sensors.setWaitForConversion(false);

    // First sensor read
    this->delay = 750 / (1 << (12 - resolution));
    this->lastTemp = 0.0f;
    this->StartReading();
}

TempSensor::~TempSensor() {
}

void TempSensor::StartReading() {
    this->sensors.requestTemperatures();
    this->lastTempRequest = millis();
}

void TempSensor::Update() {
    if (millis() - this->lastTempRequest >= this->delay) {
        this->lastTemp = this->sensors.getTempCByIndex(0);
        this->updateHandler.Fire(this->lastTemp);
        this->StartReading();
    }
}

float TempSensor::GetCurrentTemp() {
    return this->lastTemp;
}

EventHandler<float> TempSensor::GetUpdateHandler() {
    return this->updateHandler;
}
