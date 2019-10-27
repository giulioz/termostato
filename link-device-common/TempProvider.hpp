#ifndef TEMPPROVIDER_H
#define TEMPPROVIDER_H

#include <Arduino.h>
#include <DallasTemperature.h>
#include <OneWire.h>
#include "DataProvider.hpp"

class TempProvider : public DataProvider {
 private:
  const char* identifier;

  int resolution, delay;
  unsigned long lastTempRequest;
  float lastTemp;

  OneWire oneWire;
  DallasTemperature sensors;
  DeviceAddress address;

  void startReading();

 public:
  TempProvider(uint8_t pin, int resolution, const char* identifier);
  virtual ~TempProvider() override;
  virtual const char* getIdentifier() override;
  virtual String getData() override;
  virtual void setData(const char* value) override;
  virtual void update() override;
};

#endif
