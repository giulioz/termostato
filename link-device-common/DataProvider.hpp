#ifndef DATAPROVIDER_H
#define DATAPROVIDER_H

#include <Arduino.h>

class DataProvider {
 public:
  virtual ~DataProvider() {};
  virtual const char* getIdentifier() = 0;
  virtual void setData(const char* value) = 0;
  virtual String getData() = 0;
  virtual void update() = 0;
};

#endif
