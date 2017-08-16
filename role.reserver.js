var roleReserver = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var hownSpawn = Game.getObjectById(creep.memory.homeSpawn);
        var targetRoomPosition = Game.getObjectById(creep.memory.targetRoomPosition);
        
        if(creep.carry.energy < creep.carryCapacity) {
            source = hownSpawn.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE)}});
            if(creep.harvest(source[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	}
        else
        {
            if(creep.room.name != targetRoomPosition.roomName)
            {
                creep.moveTo(targetRoomPosition, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            else
            {
                controller = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTROLLER)}});
                if(creep.reserveController(controller[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(controller[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }        
            }
        }
     }
};

module.exports = roleReserver;
