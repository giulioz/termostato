#include "FileIO.hpp"

void FileIO::init() { SPIFFS.begin(); }

size_t FileIO::readFile(const char* filename, const size_t size,
                        uint8_t* buff) {
  File file = SPIFFS.open(filename, "r");
  if (!file) {
    Serial.println("Cannot read file!");
    return 0;
  }
  size_t bytes = file.read(buff, size);
  file.close();
  return bytes;
}

size_t FileIO::writeFile(const char* filename, const size_t size,
                         const uint8_t* buff) {
  File file = SPIFFS.open(filename, "w+");
  if (!file) {
    Serial.println("Cannot write file!");
    return 0;
  }
  size_t bytes = file.write(buff, size);
  file.flush();
  file.close();
  return bytes;
}
