var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var hownSpawn = Game.getObjectById(creep.memory.homeSpawn);

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    else if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var targets = hownSpawn.room.find(FIND_CONSTRUCTION_SITES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_ROAD)}});
	        if(targets.length > 0) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else
            {
    	        var targets = hownSpawn.room.find(FIND_CONSTRUCTION_SITES);
                if(targets.length > 0) {
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                else
                {
                    const targets = hownSpawn.room.find(FIND_STRUCTURES, {
                        filter: object => object.hits < object.hitsMax && object.structureType != STRUCTURE_WALL
                    });
                    
                    targets.sort((a,b) => a.hits - b.hits);
                    
                    if(targets.length > 0) {
                        if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                    else
                    {
			 			var source = Game.getObjectById('5982fd2fb097071b4adbedb0');
			   			var link = source.pos.findInRange(FIND_STRUCTURES,5, {
							filter: object => object.structureType != STRUCTURE_LINK
						});
			    		if(link.length && link[0].energy < link[0].energyCapacity)
						{
							if(creep.transfer(link[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
								creep.moveTo(link[0], {visualizePathStyle: {stroke: '#ffaa00'}});
							}
						}
						else
						{
                        	creep.moveTo(16, 25, {visualizePathStyle: {stroke: '#ffffff'}});
						}
                    }
                }
            }
	    }
	    else {
	        var source = Game.getObjectById('5982fd2fb097071b4adbedb0');
	        //source = creep.pos.findClosestByPath(FIND_SOURCES);
            //console.log(source);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	    }
	}
};

module.exports = roleBuilder;
