#ifndef THERMOSTAT_H
#define THERMOSTAT_H

#include "TempSensor.hpp"
#include "Config.hpp"
#include "TimeProvider.hpp"
#include "Updateable.hpp"

class Thermostat : public Updateable {
private:
    Config* config;
    TempSensor* sensor;
    TimeProvider* time;
    int controlPin;
    bool currentState;

public:
    Thermostat(int controlPin, TempSensor* sensor, TimeProvider* time, Config* config);
    virtual ~Thermostat();
    void Update();
    bool GetCurrentState();
};

#endif
