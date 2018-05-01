#include "Firmware.hpp"

Firmware firmware;

void setup() {
    firmware.Init();
}

void loop() {
    firmware.Update();
}
