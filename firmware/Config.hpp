#ifndef CONFIG_H
#define CONFIG_H

#include "FileIO.hpp"

#include <Arduino.h>
#include <array>

class Config {
private:
    Config();
public:
    Config(const char* filename, FileIO* reader);
    bool Save(const char* filename, FileIO* reader);

    // config fields
    char identifier[50] = {0};
    int timeZone = 1;
    bool autoMode = false;
    bool manualOnOff = false;
    std::array<float, 24> targetTemps;
    float autoTollerance = 0.1f;
    int sensorPin = D8;
    int sensorResolution = 12;
    int relayPin = D2;
};

#endif
