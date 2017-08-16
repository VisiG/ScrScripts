var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRecharger = require('role.recharger');
var roleRoadRepairer = require('role.roadRepairer');
var roleReserver = require('role.reserver');

var linkCheckInterval = 20;
var currentRoadTimer = 0;

var rechargerHomeSourceID = '5982fd2fb097071b4adbedb0';

var interSourceRoomPosition = new RoomPosition(29, 14, 'W19S16');
var interSourceID = '5982fd2fb097071b4adbedb4';

var reserverRoomPosition = new RoomPosition(37, 24, 'W19S16');

module.exports.loop = function () {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    var currentSpawn = Game.spawns['Spawn1'];
    if(!currentSpawn.memory.currentRoadTimer)
    {
       currentSpawn.memory.currentRoadTimer = 0; 
    }
    currentSpawn.memory.currentRoadTimer++;
    if(currentSpawn.memory.currentRoadTimer >= linkCheckInterval)
    {
        console.log("Checking links");
        
        var storage = currentSpawn.room.find(FIND_STRUCTURES, {filter: function(object){
                return object.structureType == STRUCTURE_STORAGE
            }});
        var links = currentSpawn.room.find(FIND_STRUCTURES, {filter: function(object){
                return object.structureType == STRUCTURE_LINK
            }});
        var link1Distance = storage.pos.getRangeTo(links[0]);
        var link2Distance = storage.pos.getRangeTo(links[1]);
      
        var sender = links[0];
        var receiver = links[1];
        if(link1Distance < link2Distance)
        {
            sender = links[1];
            receiver = links[2];
        }
        if(sender.energy >= sender.energyCapacity && receiver.energy < receiver.energyCapacity)
        {
            sender.transferEnergy(receiver, (receiver.energyCapacity - receiver.energy));
        }
        
        currentSpawn.memory.currentRoadTimer = 0;
    }
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' );
    //console.log('Harvesters: ' + harvesters.length);
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    //console.log('upgrader: ' + harvesters.length);
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    //console.log('builder: ' + harvesters.length);
    var rechargers = _.filter(Game.creeps, (creep) => creep.memory.role == 'recharger');
    //console.log('builder: ' + harvesters.length);
    var interRechargers = _.filter(Game.creeps, (creep) => creep.memory.role == 'interRecharger');
    //console.log('builder: ' + harvesters.length);
    var roadRepairer = _.filter(Game.creeps, (creep) => creep.memory.role == 'roadRepairer');
    //console.log('builder: ' + harvesters.length);
    var reservers = _.filter(Game.creeps, (creep) => creep.memory.role == 'reserver');
    //console.log('builder: ' + harvesters.length);

    var roomEnergy = currentSpawn.room.energyCapacityAvailable;
    var roomEnergyAvailable = currentSpawn.room.energyAvailable;
    if(harvesters.length < 2) {
        if(harvesters.length < 1 && roomEnergy <= 300)
        {
            if(currentSpawn.room.energyAvailable >= 250)
            {
                var newName = currentSpawn.createCreep([WORK, CARRY,MOVE,MOVE], undefined, {role: 'harvester', homeSpawn: currentSpawn.id});
                Game.creeps[newName].name = Game.creeps[newName].name;
                console.log('Spawning new 250 harvester: ' + newName);
            }
        }
        else if(roomEnergy >= 1500)
        {
            var newName = currentSpawn.createCreep([WORK, 
                                                    CARRY, CARRY ,CARRY, CARRY, CARRY, CARRY, CARRY ,CARRY, CARRY, CARRY, CARRY, CARRY ,
                                                    MOVE,
                                                    MOVE, MOVE ,MOVE ,MOVE,MOVE ,MOVE, MOVE ,MOVE ,MOVE,MOVE ,MOVE,MOVE], undefined, {role: 'harvester', homeSpawn: currentSpawn.id});
            console.log('Spawning new 1800 harvester: ' + newName);
        }
        else if(roomEnergy >= 1200)
        {
            var newName = currentSpawn.createCreep([WORK, WORK, WORK, WORK,CARRY, CARRY ,CARRY, CARRY, CARRY, CARRY ,MOVE ,MOVE,MOVE ,MOVE, MOVE, MOVE ,MOVE ,MOVE,MOVE ,MOVE], undefined, {role: 'harvester', homeSpawn: currentSpawn.id});
            console.log('Spawning new 1200 harvester: ' + newName);
        }
        else if(roomEnergy >= 800)
        {
            var newName = currentSpawn.createCreep([WORK, WORK, WORK,WORK,CARRY, CARRY,MOVE, MOVE ,MOVE,MOVE, MOVE ,MOVE], undefined, {role: 'harvester', homeSpawn: currentSpawn.id});
            console.log('Spawning new 800 harvester: ' + newName);
        }
        else if(roomEnergy >= 650)
        {
            var newName = currentSpawn.createCreep([WORK, WORK, WORK,CARRY, CARRY,MOVE ,MOVE,MOVE, MOVE ,MOVE], undefined, {role: 'harvester', homeSpawn: currentSpawn.id});
            console.log('Spawning new 650 harvester: ' + newName);
        }
        else if(roomEnergy >= 550)
        {
            var newName = currentSpawn.createCreep([WORK, WORK, WORK,CARRY,MOVE,MOVE, MOVE ,MOVE], undefined, {role: 'harvester', homeSpawn: currentSpawn.id});
            console.log('Spawning new 550 harvester: ' + newName);
        }
        else if(roomEnergy >= 400)
        {
            var newName = currentSpawn.createCreep([WORK, WORK,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'harvester', homeSpawn: currentSpawn.id});
            console.log('Spawning new 400 harvester: ' + newName);
        }
        else if(currentSpawn.room.energyAvailable >= 250)
        {
            var newName = currentSpawn.createCreep([WORK, CARRY,MOVE,MOVE], undefined, {role: 'harvester', homeSpawn: currentSpawn.id});
            console.log('Spawning new 250 harvester: ' + newName);
        }
    }
    //else if(harvesters.length < 1) {
    //}
    else if (upgraders.length < 3)
    {
        if(roomEnergy >= 1800)
        {
            var newName = currentSpawn.createCreep([WORK, WORK, WORK, WORK, WORK, WORK,
                                                    CARRY, CARRY ,CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                                                    MOVE ,MOVE,MOVE ,MOVE, MOVE ,MOVE, 
                                                    MOVE, MOVE ,MOVE ,MOVE,MOVE ,MOVE, MOVE ,MOVE ,MOVE], undefined, {role: 'upgrader', homeSpawn: currentSpawn.id});
            console.log('Spawning new 1800 upgrader: ' + newName);
        }
        else if(roomEnergy >= 1200)
        {
            var newName = currentSpawn.createCreep([WORK, WORK, WORK, WORK,CARRY, CARRY ,CARRY, CARRY, CARRY, CARRY ,MOVE ,MOVE,MOVE ,MOVE, MOVE, MOVE ,MOVE ,MOVE,MOVE ,MOVE], undefined, {role: 'upgrader', homeSpawn: currentSpawn.id});
            console.log('Spawning new 1200 upgrader: ' + newName);
        }
        else if(roomEnergy >= 800)
        {
            var newName = currentSpawn.createCreep([WORK, WORK, WORK,WORK,CARRY, CARRY,MOVE, MOVE ,MOVE,MOVE, MOVE ,MOVE], undefined, {role: 'upgrader', homeSpawn: currentSpawn.id});
            console.log('Spawning new 800 upgrader: ' + newName);
        }
        else if(roomEnergy >= 650)
        {
            var newName = currentSpawn.createCreep([WORK, WORK, WORK,CARRY, CARRY,MOVE ,MOVE,MOVE, MOVE ,MOVE], undefined, {role: 'upgrader', homeSpawn: currentSpawn.id});
            console.log('Spawning new upgrader: ' + newName);
        }
        else if(roomEnergy >= 550)
        {
            var newName = currentSpawn.createCreep([WORK, WORK, WORK,CARRY,MOVE,MOVE, MOVE ,MOVE], undefined, {role: 'upgrader', homeSpawn: currentSpawn.id});
            console.log('Spawning new upgrader: ' + newName);
        }
        else if(roomEnergy >= 400)
        {
            var newName = currentSpawn.createCreep([WORK, WORK,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'upgrader', homeSpawn: currentSpawn.id});
            console.log('Spawning new upgrader: ' + newName);
        }
        else if(currentSpawn.room.energyAvailable >= 250)
        {
            var newName = currentSpawn.createCreep([WORK, CARRY,MOVE,MOVE], undefined, {role: 'upgrader', homeSpawn: currentSpawn.id});
            console.log('Spawning new upgrader: ' + newName);
        }
    }
    else if (builders.length < 2)
    {
        if(roomEnergy >= 800)
        {
            var newName = currentSpawn.createCreep([WORK, WORK, WORK,WORK,CARRY, CARRY,MOVE, MOVE ,MOVE,MOVE, MOVE ,MOVE], undefined, {role: 'builder', homeSpawn: currentSpawn.id});
            console.log('Spawning new 800 builder: ' + newName);
        }
        else if(roomEnergy >= 650)
        {
            var newName = currentSpawn.createCreep([WORK, WORK, WORK,CARRY, CARRY,MOVE ,MOVE,MOVE, MOVE ,MOVE], undefined, {role: 'builder', homeSpawn: currentSpawn.id});
            console.log('Spawning new builder: ' + newName);
        }
        else if(roomEnergy >= 550)
        {
            var newName = currentSpawn.createCreep([WORK, WORK, WORK,CARRY,MOVE,MOVE, MOVE ,MOVE], undefined, {role: 'builder', homeSpawn: currentSpawn.id});
            console.log('Spawning new builder: ' + newName);
        }
        else if(roomEnergy >= 400)
        {
            var newName = currentSpawn.createCreep([WORK, WORK,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'builder', homeSpawn: currentSpawn.id});
            console.log('Spawning new builder: ' + newName);
        }
        else if(currentSpawn.room.energyAvailable >= 250)
        {
            var newName = currentSpawn.createCreep([WORK, CARRY,MOVE,MOVE], undefined, {role: 'builder', homeSpawn: currentSpawn.id});
            console.log('Spawning new builder: ' + newName);
        }
        
    }
    else if (rechargers.length < 2)
    {
        if(roomEnergy >= 1200)
        {
            var newName = currentSpawn.createCreep([WORK, WORK, WORK, WORK,CARRY, CARRY ,CARRY, CARRY, CARRY, CARRY ,MOVE ,MOVE,MOVE ,MOVE, MOVE, MOVE ,MOVE ,MOVE,MOVE ,MOVE], undefined, 
                {role: 'recharger', homeSpawn: currentSpawn.id, targetSource: rechargerHomeSourceID });
            console.log('Spawning new 1200 recharger: ' + newName);
        }
        else if(roomEnergy >= 800)
        {
            var newName = currentSpawn.createCreep([WORK, WORK,CARRY, CARRY,CARRY, CARRY,MOVE ,MOVE, MOVE ,MOVE,MOVE, MOVE ,MOVE], undefined, {role: 'recharger', homeSpawn: currentSpawn.id, targetSource: rechargerHomeSourceID});
            console.log('Spawning new 800 recharger: ' + newName);
        }
        else if(roomEnergy >= 650)
        {
            var newName = currentSpawn.createCreep([WORK, WORK, WORK,CARRY, CARRY,MOVE ,MOVE,MOVE, MOVE ,MOVE], undefined, {role: 'recharger', homeSpawn: currentSpawn.id, targetSource: rechargerHomeSourceID});
            console.log('Spawning new recharger: ' + newName);
        }
        else if(roomEnergy >= 550)
        {
            var newName = currentSpawn.createCreep([WORK, WORK, WORK,CARRY,MOVE,MOVE, MOVE ,MOVE], undefined, {role: 'recharger', homeSpawn: currentSpawn.id, targetSource: rechargerHomeSourceID});
            console.log('Spawning new recharger: ' + newName);
        }
        else if(roomEnergy >= 400)
        {
            var newName = currentSpawn.createCreep([WORK, WORK,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'recharger', homeSpawn: currentSpawn.id, targetSource: rechargerHomeSourceID});
            console.log('Spawning new recharger: ' + newName);
        }
        else if(currentSpawn.room.energyAvailable >= 250)
        {
            var newName = currentSpawn.createCreep([WORK, CARRY,MOVE,MOVE], undefined, {role: 'recharger', homeSpawn: currentSpawn.id, targetSource: rechargerHomeSourceID});
            console.log('Spawning new recharger: ' + newName);
        }
        
    }
    else if (roadRepairer.length < 1)
    {
       if(roomEnergy >= 400)
        {
            var newName = currentSpawn.createCreep([WORK, WORK,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'roadRepairer', homeSpawn: currentSpawn.id});
            console.log('Spawning new roadRepairer: ' + newName);
        }
        else if(currentSpawn.room.energyAvailable >= 250)
        {
            var newName = currentSpawn.createCreep([WORK, CARRY,MOVE,MOVE], undefined, {role: 'roadRepairer', homeSpawn: currentSpawn.id});
            console.log('Spawning new roadRepairer: ' + newName);
        }
        
    }
    else if (interRechargers.length < 2)
    {
        
        if(roomEnergy >= 1800)
        {
            var newName = currentSpawn.createCreep([WORK, WORK, WORK, WORK, WORK,
                                                    CARRY, CARRY ,CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                                                    MOVE ,MOVE ,MOVE,MOVE , MOVE ,
                                                    MOVE, MOVE, MOVE ,MOVE ,MOVE,MOVE ,MOVE,MOVE , MOVE, MOVE], undefined, 
                {role: 'interRecharger', homeSpawn: currentSpawn.id, targetSource: interSourceID });
            console.log('Spawning new 1800 inter recharger: ' + newName);
        }
        else if(roomEnergy >= 1300)
        {
            var newName = currentSpawn.createCreep([WORK, WORK, WORK, WORK,CARRY, CARRY ,CARRY, CARRY, CARRY, CARRY, CARRY,MOVE ,MOVE ,MOVE,MOVE ,MOVE, MOVE, MOVE ,MOVE ,MOVE,MOVE ,MOVE], undefined, 
                {role: 'interRecharger', homeSpawn: currentSpawn.id, targetSource: interSourceID });
            console.log('Spawning new 1300 inter recharger: ' + newName);
        }
        
    }
    else if (reservers.length < 1)
    {        
        if(roomEnergy >= 1300)
        {
            var newName = currentSpawn.createCreep([CLAIM, CLAIM,MOVE  ,MOVE], undefined, 
                {role: 'reserver', homeSpawn: currentSpawn.id});
            console.log('Spawning new 1300 reserver: ' + newName);
        }
        
    }
    
    if(currentSpawn.spawning) {
        var spawningCreep = Game.creeps[currentSpawn.spawning.name];
        currentSpawn.room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            currentSpawn.pos.x + 1,
            currentSpawn.pos.y,
            {align: 'left', opacity: 0.8});
    }

     var towers = currentSpawn.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_TOWER);
                        }
                });
    for(var towerIdx in towers)
    {
        var tower = towers[towerIdx];
        if(tower.energy/tower.energyCapacity > 0.5)
        {
            var closestDamagedStructure = tower.room.find(FIND_STRUCTURES, {
                filter: (structure) => (structure.hits < structure.hitsMax) && ((structure.structureType != STRUCTURE_WALL) || (structure.structureType == STRUCTURE_WALL && structure.hits < 30000))
            });
            closestDamagedStructure.sort((a,b) => a.hits/a.hitsMax - b.hits/b.hitsMax);
            //console.log(closestDamagedStructure.length);
            if(closestDamagedStructure.length > 0) {
                tower.repair(closestDamagedStructure[0]);
            }
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
    var harvesterCnt = 0;
    for(var name in Game.creeps) {
         const startCpu = Game.cpu.getUsed();
        var creep = Game.creeps[name];
        //creep.homeSpawn = currentSpawn.id;
        
        if(creep.memory.role == 'harvester') {
            if(harvesterCnt == 1)
            {
                creep.memory.reverseFilling = true;
            }
            else
            {
                creep.memory.reverseFilling = false;                
            }
            roleHarvester.run(creep);
            harvesterCnt++;
        }
        else if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        else if(creep.memory.role == 'recharger') {
            creep.memory.targetSource = rechargerHomeSourceID;
            roleRecharger.run(creep);
        }
        else if(creep.memory.role == 'interRecharger') {
            creep.memory.targetSource = interSourceID;
            creep.memory.interSourceRoomPosition = interSourceRoomPosition;
            roleRecharger.run(creep);
        }
        else if(creep.memory.role == 'roadRepairer') {
            roleRoadRepairer.run(creep);
        }
        else if(creep.memory.role == 'reserver') {
            creep.memory.targetRoomPosition = reserverRoomPosition ;
            roleReserver.run(creep);
        }
   

        // creep logic goes here
    
        const elapsed = Game.cpu.getUsed() - startCpu;
        // console.log('Creep '+name+'('+creep.memory.role+') has used '+elapsed+' CPU time');
    }
}
