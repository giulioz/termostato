#ifndef SCHEDULER_H
#define SCHEDULER_H

#include "Updateable.hpp"

#include <vector>

class Scheduler {
    std::vector<Updateable*> threads;

public:
    Scheduler();
    void Update();
    void AddThread(Updateable* thread);
};

#endif
