#ifndef FILEIO_H
#define FILEIO_H

#include <FS.h>

namespace FileIO {

void init();
size_t readFile(const char* filename, size_t size, uint8_t* output);
size_t writeFile(const char* filename, const size_t size, const uint8_t* buff);

}  // namespace FileIO

#endif
