#ifndef DATAMANAGER_H
#define DATAMANAGER_H

#include "Constants.hpp"
#include "DataProvider.hpp"

#define PROVIDERS_COUNT 2
#include "AnalogProvider.hpp"
#include "DigitalProvider.hpp"
#include "TempProvider.hpp"
#include "DHTProvider.hpp"

namespace DataManager {

void init();
void handle();
DataProvider* getProvider(int i);

}  // namespace DataManager

#endif
