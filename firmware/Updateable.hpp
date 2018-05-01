#ifndef UPDATEABLE_H
#define UPDATEABLE_H

class Updateable {
public:
    virtual void Update() = 0;
    virtual ~Updateable() = default;
};

#endif
