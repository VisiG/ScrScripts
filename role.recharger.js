var roleRecharger = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var hownSpawn = Game.getObjectById(creep.memory.homeSpawn);
        var targetSource = Game.getObjectById(creep.memory.targetSource);
        var targetSourceRoom = creep.memory.interSourceRoomPosition;
        
        //console.log(creep.carry.energy + ' ' + creep.carryCapacity);
        if(creep.carry.energy == creep.carryCapacity)
        {
            creep.memory.needEnergy = false;
        }
	    if(creep.memory.needEnergy && (creep.carry.energy < creep.carryCapacity)) {
            //source = creep.pos.findClosestByPath(FIND_SOURCES);
            //console.log('target is' + targetSource);
            var source = targetSource;
            if(!source)
            {
                creep.moveTo(targetSourceRoom);
                //source = creep.pos.findClosestByPath(FIND_SOURCES);
            }
            
            var result =  creep.harvest(source);
            if(result == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            else if(result == ERR_NOT_ENOUGH_RESOURCES)
            {
                source2 = source.room.find(FIND_SOURCES, {
                    filter: (structure) => {
                        return (structure.id != source.id)}});
                    
                if(source2.length > 0 && source2[0].energy > 0)
                {
                    creep.moveTo(source2[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                else
                {
                    if(targetSourceRoom)
                    {
                        creep.moveTo(targetSourceRoom, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                    else
                    {
                        creep.moveTo(27, 31, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            }
        }
        else {
            var targets = hownSpawn.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE &&  _.sum(structure.store) < structure.storeCapacity);
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else
            {
                creep.moveTo(16, 25, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            if(creep.carry.energy == 0)
            {
                creep.memory.needEnergy = true;
            }
        }
	}
};

module.exports = roleRecharger;
