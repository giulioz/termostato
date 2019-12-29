#ifndef CONSTANTS_HPP
#define CONSTANTS_HPP

/**************************
  User defined variables
**************************/
#define DEVICE_SERIAL "0001"
#define FIRMWARE_VERSION "0.2"

#define WIFI_FIXED false
#define WIFI_FIXED_SSID ""
#define WIFI_FIXED_PASSWORD ""

/**************************
  Advanced constants
**************************/
#define AP_SSID "IOT-LINK-" DEVICE_SERIAL
#define AP_PASSWORD "IOT-LINK"
#define WIFI_CONNECTION_TIMEOUT 5000000

#define DISCOVERY_PORT 3010
#define DISCOVERY_REQUEST "IOT_DISCOVERY"
#define DISCOVERY_RESPONSE_FORMAT "IOT_HELLO;%s"

#define HTTPAPI_PORT 3000

#define CONFIG_FILENAME "cfg"
#define CONFIG_SSID_LENGTH 50
#define CONFIG_PASSWORD_LENGTH 50
#define CONFIG_IDENT_LENGTH 20

#endif  // CONSTANTS_HPP
