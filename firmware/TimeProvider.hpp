#ifndef TIMEPROVIDER_H
#define TIMEPROVIDER_H

#include "EventHandler.hpp"

class TimeProvider {
public:
    virtual ~TimeProvider() = default;
    virtual int GetHour() = 0;
};

#endif
