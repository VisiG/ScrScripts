var pathCheckInterval = 5;

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(!creep.memory.checkPathTime)
        {
            creep.memory.checkPathTime = 0;
        }
        creep.memory.checkPathTime++;
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            if(creep.memory.checkPathTime >= pathCheckInterval)
            {
                source = creep.pos.findClosestByPath(FIND_SOURCES);
                if(source)
                {
                    creep.memory.sourcePath = source.id;
                    creep.memory.checkPathTime = 0;
                }
            }
            var target= Game.getObjectById(creep.memory.sourcePath);
            
            var result =  creep.harvest(target);
            if(result == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            else if(result == ERR_NOT_ENOUGH_RESOURCES)
            {
                creep.moveTo(18, 21, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
	}
};

module.exports = roleUpgrader;