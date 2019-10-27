#ifndef DIGITALPROVIDER_H
#define DIGITALPROVIDER_H

#include "DataProvider.hpp"
#include "Arduino.h"

class DigitalProvider : public DataProvider {
 private:
  uint8_t pin;
  const char* identifier;
  bool writeMode;
  bool lastSet;

 public:
  DigitalProvider(uint8_t pin, const char* identifier, bool writeMode);
  virtual ~DigitalProvider() override;
  virtual const char* getIdentifier() override;
  virtual String getData() override;
  virtual void setData(const char* value) override;
  virtual void update() override;
};

#endif
