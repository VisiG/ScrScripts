var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //console.log(creep.carry.energy + ' ' + creep.carryCapacity);
        if(creep.carry.energy == creep.carryCapacity)
        {
            creep.memory.needEnergy = false;
        }
	    if(creep.memory.needEnergy && (creep.carry.energy < creep.carryCapacity)) {
	        var energy = creep.room.find(FIND_DROPPED_RESOURCES
            );
    
            if (energy.length) {
                if(creep.pickup(energy[0]) != 0)
                {
                    creep.moveTo(energy[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
                console.log('found ' + energy[0].energy + ' energy at ', energy[0].pos);
            }
            else
            {
    	        var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_STORAGE &&  _.sum(structure.store) > 0);
                        }
                });
                if(targets.length > 0) {
                    if(creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                else
                {
    	        
                    source = creep.pos.findClosestByPath(FIND_SOURCES);
                    //console.log(source);
                    var result =  creep.harvest(source);
                    if(result == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                    else if(result == ERR_NOT_ENOUGH_RESOURCES)
                    {
                        source2 = creep.room.find(FIND_SOURCES, {
                            filter: (structure) => {
                                return (structure.id != source.id)}});
                            
                        if(source2.length > 0)
                        {
                            creep.moveTo(source2[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                        else
                        {
                            creep.moveTo(27, 31, {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                    }
                }
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_CONTAINER) && structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else
            {
                var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity);
                        }
                });
                if(targets.length > 0) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                else
                {
                    creep.moveTo(27, 33, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            if(creep.carry.energy == 0)
            {
                creep.memory.needEnergy = true;
            }
        }
	}
};

module.exports = roleHarvester;