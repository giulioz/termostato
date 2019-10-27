#ifndef CONFIG_H
#define CONFIG_H

#include "Constants.hpp"

namespace Config {

typedef struct ConfigModel {
  bool WIFI_CONFIGURED;
  char WIFI_SSID[CONFIG_SSID_LENGTH];
  char WIFI_PASSWORD[CONFIG_PASSWORD_LENGTH];
  char IDENT[CONFIG_IDENT_LENGTH];
} ConfigModel;

bool read();
bool save();

const ConfigModel* get();
bool set(const ConfigModel* config);
bool init();

}  // namespace Config

#endif
