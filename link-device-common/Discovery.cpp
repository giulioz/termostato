#include "Discovery.hpp"
#include <stdio.h>
#include "Arduino.h"
#include "Config.hpp"
#include "Constants.hpp"

#include <WiFiUDP.h>
static WiFiUDP UDP;

#define DISCOVERY_LENGTH (sizeof(DISCOVERY_REQUEST) - 1)
#define RESPONSE_BUFFER_SIZE \
  (sizeof(DISCOVERY_RESPONSE_FORMAT) + CONFIG_IDENT_LENGTH)

void Discovery::init() { UDP.begin(DISCOVERY_PORT); }

void Discovery::handle() {
  int packetSize = UDP.parsePacket();
  if (packetSize >= DISCOVERY_LENGTH) {
    char buffer[DISCOVERY_LENGTH] = {0};
    UDP.read(buffer, DISCOVERY_LENGTH);

    if (memcmp(buffer, DISCOVERY_REQUEST, DISCOVERY_LENGTH) == 0) {
      Serial.println("Sending discovery...");
      char responseBuffer[RESPONSE_BUFFER_SIZE] = {0};
      snprintf(responseBuffer, RESPONSE_BUFFER_SIZE, DISCOVERY_RESPONSE_FORMAT,
               Config::get()->IDENT);

      UDP.beginPacket(UDP.remoteIP(), UDP.remotePort());
      UDP.write(responseBuffer, RESPONSE_BUFFER_SIZE);
      UDP.endPacket();
    }
  }
}
