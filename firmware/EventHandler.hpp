#ifndef EVENTHANDLER_H
#define EVENTHANDLER_H

#include <vector>

template <typename T>
class EventHandler {
    std::vector<void(*)(T)> handlers;

public:
    EventHandler() {

    }

    void AddHandler(void *handler(T)) {
        this->handlers.push_back(handler);
    }

    void RemoveHandler(void *handler(T)) {
        for (auto i = 0; i < handlers.size(); i++) {
            if (handlers.at(i) == handler) {
                handlers.erase(handlers.begin() + i);
            }
        }
    }

    void ClearHandlers() {
        this->handlers.clear();
    }

    void Fire(T args) {
        for (auto &i : handlers) {
            i(args);
        }
    }
};

#endif
