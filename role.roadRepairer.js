var roleRoadRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var hownSpawn = Game.getObjectById(creep.memory.homeSpawn);

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('🚧 reparing');
	    }

	    if(creep.memory.building) {
	        var currentTarget =  Game.getObjectById(creep.memory.currentRoadRepair);
	        //console.log(creep.memory.currentRoadRepair);
	       // console.log(currentTarget);
	        if(!currentTarget)
	        {
	            var targets = hownSpawn.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax)}});
	            targets.sort((a,b) => a.hits/a.hitsMax - b.hits/b.hitsMax);
	            if(targets.length > 0)
	            {
	                currentTarget = targets[0];
	                creep.memory.currentRoadRepair = currentTarget.id;
	            }
	            else
	            {
	                creep.moveTo(38, 28, {visualizePathStyle: {stroke: '#ffffff'}});
	                return;
	            }
	        }
	        var result = creep.repair(currentTarget);
	        //console.log(result);
	        if(result == ERR_NOT_IN_RANGE) 
	        {
                creep.moveTo(currentTarget, {visualizePathStyle: {stroke: '#ffffff'}});
            }
	           // console.log(currentTarget.hits + ' '+ currentTarget.hitsMax);
            if(currentTarget.hits == currentTarget.hitsMax)
            {
                creep.memory.currentRoadRepair = 0;
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

module.exports = roleRoadRepairer;
