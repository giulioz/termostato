#ifndef ANALOGPROVIDER_H
#define ANALOGPROVIDER_H

#include "DataProvider.hpp"
#include "Arduino.h"

class AnalogProvider : public DataProvider {
 private:
  uint8_t pin;
  const char* identifier;

 public:
  AnalogProvider(uint8_t pin, const char* identifier);
  virtual ~AnalogProvider() override;
  virtual const char* getIdentifier() override;
  virtual String getData() override;
  virtual void setData(const char* value) override;
  virtual void update() override;
};

#endif
