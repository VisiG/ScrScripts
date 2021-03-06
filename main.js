var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleUpgraderStorage = require('role.upgraderFromStorage');
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
    
    var spawn1 = Game.spawns['Spawn1'];
    var spawn2 = Game.spawns['Spawn2'];
    var currentSpawn = spawn1;
    if(!currentSpawn.memory.currentRoadTimer)
    {
       currentSpawn.memory.currentRoadTimer = 0; 
    }
    currentSpawn.memory.currentRoadTimer++;
    var storage;
    if(currentSpawn.memory.currentRoadTimer >= linkCheckInterval)
    {
        currentSpawn.memory.currentRoadTimer = 0;
        console.log("Checking links");
        
        storage = currentSpawn.room.find(FIND_STRUCTURES, {filter: function(object){
                return object.structureType == STRUCTURE_STORAGE
            }});
        var links = currentSpawn.room.find(FIND_STRUCTURES, {filter: function(object){
                return object.structureType == STRUCTURE_LINK
            }});
        var link1Distance = storage[0].pos.getRangeTo(links[0]);
        var link2Distance = storage[0].pos.getRangeTo(links[1]);
      
        var sender = links[0];
        var receiver = links[1];
        if(link1Distance < link2Distance)
        {
            sender = links[1];
            receiver = links[0];
        }
        if(sender.energy >= sender.energyCapacity*0.99 && receiver.energy < receiver.energyCapacity)
        {
            //var amountToTransfer = Math.max((receiver.energyCapacity - receiver.energy), sender.energyCapacity - sender.energy);
            sender.transferEnergy(receiver);//, amountToTransfer);
        }
    }
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' );
    //console.log('Harvesters: ' + harvesters.length);
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    //console.log('upgrader: ' + harvesters.length);
    var upgradersStorage = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgraderFromStorage');
    //console.log('upgrader: ' + harvesters.length);
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    //console.log('builder: ' + harvesters.length);
    var rechargers = _.filter(Game.creeps, (creep) => creep.memory.role == 'recharger');
    //console.log('builder: ' + harvesters.length);
    var interRechargers = _.filter(Game.creeps, (creep) => creep.memory.role == 'interRecharger');
    //console.log('builder: ' + harvesters.length);
    var linkRechargers = _.filter(Game.creeps, (creep) => creep.memory.role == 'linkRecharger');
    //console.log('builder: ' + harvesters.length);
    var roadRepairer = _.filter(Game.creeps, (creep) => creep.memory.role == 'roadRepairer');
    //console.log('builder: ' + harvesters.length);
    var reservers = _.filter(Game.creeps, (creep) => creep.memory.role == 'reserver');
    //console.log('builder: ' + harvesters.length);

    if(currentSpawn.spawning) {
        currentSpawn = spawn2;
        if(currentSpawn.spawning) {
            currentSpawn = null;
        }
    }
    
    if(currentSpawn != null)
    {
        var roomEnergy = currentSpawn.room.energyCapacityAvailable;
        var roomEnergyAvailable = currentSpawn.room.energyAvailable;
        if(harvesters.length < 2) {
            console.log(harvesters.length + ' ' + roomEnergyAvailable);
            if(harvesters.length < 1)
            {
                if(roomEnergyAvailable >= 1800)
                {
                    var newName = currentSpawn.createCreep([WORK, 
                                                            CARRY, CARRY ,CARRY, CARRY, CARRY, CARRY, CARRY ,CARRY, CARRY, CARRY, CARRY, CARRY ,
                                                            MOVE,
                                                            MOVE, MOVE ,MOVE ,MOVE,MOVE ,MOVE, MOVE ,MOVE ,MOVE,MOVE ,MOVE,MOVE], undefined, {role: 'harvester', homeSpawn: currentSpawn.id});
                    console.log('Spawning new 1800 harvester: ' + newName);
                }
                else if(roomEnergyAvailable >= 1200)
                {
                    var newName = currentSpawn.createCreep([WORK, WORK, WORK, WORK,CARRY, CARRY ,CARRY, CARRY, CARRY, CARRY ,MOVE ,MOVE,MOVE ,MOVE, MOVE, MOVE ,MOVE ,MOVE,MOVE ,MOVE], undefined, {role: 'harvester', homeSpawn: currentSpawn.id});
                    console.log('Spawning new 1200 harvester: ' + newName);
                }
                else if(roomEnergyAvailable >= 800)
                {
                    var newName = currentSpawn.createCreep([WORK, WORK, WORK,WORK,CARRY, CARRY,MOVE, MOVE ,MOVE,MOVE, MOVE ,MOVE], undefined, {role: 'harvester', homeSpawn: currentSpawn.id});
                    console.log('Spawning new 800 harvester: ' + newName);
                }
                else if(roomEnergyAvailable >= 650)
                {
                    var newName = currentSpawn.createCreep([WORK, WORK, WORK,CARRY, CARRY,MOVE ,MOVE,MOVE, MOVE ,MOVE], undefined, {role: 'harvester', homeSpawn: currentSpawn.id});
                    console.log('Spawning new 650 harvester: ' + newName);
                }
                else if(roomEnergyAvailable >= 550)
                {
                    var newName = currentSpawn.createCreep([WORK, WORK, WORK,CARRY,MOVE,MOVE, MOVE ,MOVE], undefined, {role: 'harvester', homeSpawn: currentSpawn.id});
                    console.log('Spawning new 550 harvester: ' + newName);
                }
                else if(roomEnergyAvailable >= 400)
                {
                    var newName = currentSpawn.createCreep([WORK, WORK,CARRY,MOVE,MOVE,MOVE], undefined, {role: 'harvester', homeSpawn: currentSpawn.id});
                    console.log('Spawning new 400 harvester: ' + newName);
                }
                else if(roomEnergyAvailable >= 250)
                {
                    var newName = currentSpawn.createCreep([WORK, CARRY,MOVE,MOVE], undefined, {role: 'harvester', homeSpawn: currentSpawn.id});
                    console.log('Spawning new 250 harvester: ' + newName);
                }
            }
            else if(roomEnergy >= 1800)
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
        else if (rechargers.length < 1)
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
        else if (linkRechargers.length < 1)
        {        
            if(roomEnergy >= 250)
            {
                var newName = currentSpawn.createCreep([CARRY, CARRY,MOVE  ,MOVE], undefined, 
                    {role: 'linkRecharger', homeSpawn: currentSpawn.id});
                console.log('Spawning new 200 linkRecharger: ' + newName);
            }

        }
        else if(upgradersStorage < 3 && storage != null)
        {
            if(storage[0].store[RESOURCE_ENERGY] > 500000 && roomEnergy >= 1800)
            {
                var newName = currentSpawn.createCreep([WORK, WORK, WORK, WORK, WORK, WORK,
                                                        CARRY, CARRY ,CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                                                        MOVE ,MOVE,MOVE ,MOVE, MOVE ,MOVE, 
                                                        MOVE, MOVE ,MOVE ,MOVE,MOVE ,MOVE, MOVE ,MOVE ,MOVE], undefined, {role: 'upgraderFromStorage', homeSpawn: currentSpawn.id});
                console.log('Spawning new 1800 upgraderFromStorage: ' + newName);
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
    }
    
    if(spawn1.spawning) {
            var spawningCreep = Game.creeps[spawn1.spawning.name];
            spawn1.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                spawn1.pos.x + 1,
                spawn1.pos.y,
                {align: 'left', opacity: 0.8});
        }
    if(spawn2.spawning) {
            var spawningCreep = Game.creeps[spawn2.spawning.name];
            spawn2.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                spawn2.pos.x + 1,
                spawn2.pos.y,
                {align: 'left', opacity: 0.8});
        }
    

    var towers = spawn1.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_TOWER);
                        }
                });
    for(var towerIdx in towers)
    {
        var tower = towers[towerIdx];
        
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: function(object) {
                return object.getActiveBodyparts(HEAL) > 0;
            }
        });
        var closestHostile2 = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
        else if(closestHostile2)
        {
            tower.attack(closestHostile2);                
        }
        else if(tower.energy/tower.energyCapacity > 0.5)
        {
            var closestDamagedStructure = tower.room.find(FIND_STRUCTURES, {
                filter: (structure) => 
                (structure.hits < structure.hitsMax) && 
                ( ((structure.structureType != STRUCTURE_WALL) && 
                  (structure.structureType != STRUCTURE_RAMPART)) || (structure.structureType == STRUCTURE_WALL && structure.hits < 80000)
                                                                               || (structure.structureType == STRUCTURE_RAMPART && structure.hits < 100000))
            });
            closestDamagedStructure.sort((a,b) => a.hits/a.hitsMax - b.hits/b.hitsMax);
            //console.log(closestDamagedStructure.length);
            if(closestDamagedStructure.length > 0) {
                tower.repair(closestDamagedStructure[0]);
            }
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
            creep.memory.emptyLink = '5994774086537c0bdbbb2fa4';
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
        else if(creep.memory.role == 'linkRecharger') {
            creep.memory.targetSource = '5994774086537c0bdbbb2fa4';
            roleRecharger.run(creep);
        }
        else if(creep.memory.role == 'upgraderFromStorage') {
            roleUpgraderStorage.run(creep);
        }
   

        // creep logic goes here
    
        const elapsed = Game.cpu.getUsed() - startCpu;
        // console.log('Creep '+name+'('+creep.memory.role+') has used '+elapsed+' CPU time');
    }
}
