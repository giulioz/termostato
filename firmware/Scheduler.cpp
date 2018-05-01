#include "Scheduler.hpp"

Scheduler::Scheduler() {

}

void Scheduler::Update() {
    for (auto &thread : this->threads) {
        thread->Update();
    }
}

void Scheduler::AddThread(Updateable* thread) {
    this->threads.push_back(thread);
}
