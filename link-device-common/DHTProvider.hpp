#ifndef DHTPROVIDER_H
#define DHTPROVIDER_H

#include <Arduino.h>
#include "DataProvider.hpp"
#include "DHT.h"

#define DHT_READING_DELAY 1000

class DHTProvider : public DataProvider {
 private:
  const char* identifier;

  unsigned long lastRequest;
  float lastTemp, lastHumidity;

  DHT dht;

 public:
  DHTProvider(uint8_t pin, uint8_t type, const char* identifier);
  virtual ~DHTProvider() override;
  virtual const char* getIdentifier() override;
  virtual String getData() override;
  virtual void setData(const char* value) override;
  virtual void update() override;
};

#endif
