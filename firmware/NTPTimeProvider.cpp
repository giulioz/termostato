#include "NTPTimeProvider.hpp"

#include <ESP8266WiFi.h>
#include <time.h>
#include <coredecls.h>

NTPTimeProvider::NTPTimeProvider() {
    
}

NTPTimeProvider::~NTPTimeProvider() {
    
}

NTPTimeProvider* NTPTimeProvider::GetDefault() {
    static NTPTimeProvider instance;
    return &instance;
}

void NTPTimeProvider::Config(int timeZone, int dstMN) {
    configTime(timeZone*3600, dstMN*60, "pool.ntp.org");
}

int NTPTimeProvider::GetHour() {
    time_t now = time(NULL);
    struct tm *tm_struct = localtime(&now);
    return tm_struct->tm_hour;
}
