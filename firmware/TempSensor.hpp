#ifndef TEMP_SENSOR_H
#define TEMP_SENSOR_H

#include <Arduino.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "Promise.hpp"
#include "Updateable.hpp"
#include "EventHandler.hpp"

class TempSensor : public Updateable {
    int resolution, delay;
    unsigned long lastTempRequest;
    float lastTemp;
    EventHandler<float> updateHandler;

    OneWire oneWire;
    DallasTemperature sensors;
    DeviceAddress address;

    void StartReading();

public:
    TempSensor(const int pin, const int resolution);
    virtual ~TempSensor();

    virtual void Update();
    float GetCurrentTemp();
    EventHandler<float> GetUpdateHandler();
};

#endif
