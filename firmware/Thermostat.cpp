#include "Thermostat.hpp"
#include "Arduino.h"

Thermostat::Thermostat(int controlPin, TempSensor* sensor, TimeProvider* time, Config* config) {
    this->config = config;
    this->sensor = sensor;
    this->time = time;
    this->controlPin = controlPin;
    this->currentState = false;
    pinMode(controlPin, OUTPUT);
}

Thermostat::~Thermostat() {
}

void Thermostat::Update() {
    // Auto Thermostat
    if (this->config->autoMode) {
        int hour = this->time->GetHour();
        if (hour >= 0 && hour < 24) {
            auto targetTemperature = this->config->targetTemps[hour];
            auto temperature = sensor->GetCurrentTemp();
            this->currentState = targetTemperature - temperature > this->config->autoTollerance;
        }
    }

    // Manual On / Off
    else {
        this->currentState = this->config->manualOnOff;
    }

    // digitalWrite(controlPin, currentState);
    digitalWrite(controlPin, 0);
}

bool Thermostat::GetCurrentState() {
    return this->currentState;
}
