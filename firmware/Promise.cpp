#include "Promise.hpp"

template <typename T>
Promise<T>::Promise(void *fullfill(T result)) {
    this->fullfill = fullfill;
}