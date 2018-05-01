#include "FileIO.hpp"
#include <FS.h>

FileIO::FileIO() {
    SPIFFS.begin();
}

FileIO::~FileIO() {
    
}

FileIO* FileIO::GetDefault() {
    static FileIO instance;
    return &instance;
}

size_t FileIO::ReadFile(const char* filename, const size_t size, uint8_t* buff) {
    File file = SPIFFS.open(filename, "r");
    if (!file) {
        return 0;
    }
    size_t bytes = file.read(buff, size);
    file.close();
    return bytes;
}

size_t FileIO::WriteFile(const char* filename, const size_t size, const uint8_t* buff) {
    File file = SPIFFS.open(filename, "w");
    if (!file) {
        return 0;
    }
    size_t bytes = file.write(buff, size);
    file.close();
    return bytes;
}
