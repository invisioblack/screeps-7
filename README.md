screeps
=======

My humble screeps scripts.

Feel free to use and abuse.

Current Status: 
    
    Harvests resrouces direct, or into containers.
    Builds construction sites.
    Repairs infrastructure.
    Simple tower defense.

Behavior model
===============================================================================

Motivator:

    The motivator is responsible for managing the highest level decision 
    making.
    
    Responsibilities
        Activate/Deactivate motivations
        Decide motivation priority
        Allocate units to motivations

Motivations:

    Motivations model the high level activities managed by the motivator. 
    Motivations are responsible for creating needs, based on their demands
    and the resources allocated to them. Motivations are scoped to a single 
    room.
    
    Motivations (by default priority):
        Supply Spawn Energy
        Supply Tower Energy
        Maintain Infrastructure (build and repair)
        Supply Controller Energy

Need Manager:

    The need manager is responsible for assigning needs the units they need to 
    be fulfilled.

Needs:

    Needs model specific tasks, or sets of tasks. Examples of needs are
    harvest this specific resource area. Attack this specific unit. Needs are
    responsible for assigning jobs to creeps. One or more creeps can be assigned
    to fulfill a need.

Jobs:

    Jobs model specific creep behavior to fulfill needs. Examples include build, 
    collect, harvest, heal.
