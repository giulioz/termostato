#include "Config.hpp"
#include "Constants.hpp"
#include "FileIO.hpp"

static Config::ConfigModel currentConfig = {0};

bool Config::read() {
  return FileIO::readFile(CONFIG_FILENAME, sizeof(Config::ConfigModel),
                          reinterpret_cast<uint8_t*>(&currentConfig)) ==
         sizeof(Config::ConfigModel);
}

bool Config::save() {
  return FileIO::writeFile(CONFIG_FILENAME, sizeof(Config::ConfigModel),
                           reinterpret_cast<uint8_t*>(&currentConfig)) ==
         sizeof(Config::ConfigModel);
}

const Config::ConfigModel* Config::get() { return &currentConfig; }

bool Config::set(const Config::ConfigModel* config) {
  Serial.println("Saving settings...");
  currentConfig = *config;
  return Config::save();
}

bool Config::init() {
  memset(&currentConfig, 0, sizeof(Config::ConfigModel));
  return Config::save();
}
