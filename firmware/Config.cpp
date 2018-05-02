#include "Config.hpp"

Config::Config() { }

Config::Config(const char* filename, FileIO* reader) {
    reader->ReadFile(filename, sizeof(Config), reinterpret_cast<uint8_t*>(this));
}

bool Config::Save(const char* filename, FileIO* reader) {
    return reader->WriteFile(filename, sizeof(Config), reinterpret_cast<uint8_t*>(this)) == sizeof(Config);
}
