#ifndef FILEIO_H
#define FILEIO_H

#include <Arduino.h>

class FileIO {
    // Singleton
public:
    static FileIO* GetDefault();
private:
    FileIO();
public:
    FileIO(FileIO const&) = delete;
    void operator=(FileIO const&) = delete;
    virtual ~FileIO();

    virtual size_t ReadFile(const char* filename, size_t size, uint8_t* output);
    virtual size_t WriteFile(const char* filename, const size_t size, const uint8_t* buff);
};

#endif
