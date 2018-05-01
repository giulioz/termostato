#ifndef NTPTIMEPROVIDER_H
#define NTPTIMEPROVIDER_H

#include "TimeProvider.hpp"
#include "EventHandler.hpp"

#include <sys/time.h>

class NTPTimeProvider : public TimeProvider {
    // Singleton
public:
    static NTPTimeProvider* GetDefault();
private:
    NTPTimeProvider();
public:
    NTPTimeProvider(NTPTimeProvider const&) = delete;
    void operator=(NTPTimeProvider const&) = delete;
    virtual ~NTPTimeProvider();
    
public:
    void Config(int timeZone, int dstMN);
    virtual int GetHour();
};

#endif
