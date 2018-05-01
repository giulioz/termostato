#ifndef PROMISE_H
#define PROMISE_H

template <typename T>
class Promise {
public:
    Promise(void *fullfill(T result));
    void *fullfill(T result);
};

#endif
