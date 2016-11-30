screeps
=======

My humble screeps scripts.

Feel free to use and abuse.

More stuff.

Behavior model
===============================================================================

Motivator
    The motivator is responsible for managing the highest level decision 
    making. 
    
    Responsibilites:
        Activate/Deactivate motivations
            Each motivation has shouldBeActive()
        Decide motivation priority
            priority + status weight 
        Allocate resources to each active motivation

    The motivator is the part in which the player interacts with.

    Mode:
        The mode of the motivator determines how resources are distributed
        across motivations. It can operate in modes from single minded,
        where it focuses on a single motivation, to balanace where it evently
        spreads resouces across motivations. 

Motivations
    Motivations model the high level activities managed by the motivator. 
    Motivations are responsible for creating needs, based on their demands
    and the resources allocated to them. Motivations are scoped to a single 
    room.
    
    Motivations (by default priority): 
        Supply Spawn Energy
            Demand Labor (1/50 energy demanded)
            Demand Energy
        Defend
            Demand Military
            Demand Medical
        Upgrade Controller
            Demand Labor (1/50 energy demanded)
            Demand Energy
        Attack
            Demand Military
            Demand Medical
        Maintain Infrastructure (build and repair)
            Demand Labor
            Demand Energy

        In addition player interactions are modeled as motivations.

Need Manager
    The need manager is responsible for assigning and reassigning needs to the
    resources they need to be fullfilled. In most cases this means assigning a
    creep to fulfill the task, but in some cases it will be things like asking 
    the spawn to build another unit.

Needs
    Needs model specific tasks, or sets of tasks. Examples of needs are
    harvest this specific resource area. Attack this specific unit. Needs are
    responsible for assigning jobs to creeps.

Jobs
    Jobs model specific creep behavior to fulfill needs. Examples include build, 
    collect, harvest, heal.

Resource Manager

Resources
    Energy (units)
        Demands labor
    Labor (1 x highest number of either WORK or CARRY / creep)
        Demands energy
        Demands spawning
    Military
        Demands spawning
    Medical
        Demands spawning
    Spawning
        Demands Energy






