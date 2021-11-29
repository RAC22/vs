const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepair = require('role.repair');
const roleDumpHarvester = require('role.dumpHarvester');
const roleRunner = require('role.runner');
const roleFatUpgrader = require('role.fatUpgrader');
const roleTower = require('role.tower');
const roleScavenger = require('role.scavenger');
const roleClaimer = require('role.claimer');
const roleDefender = require('role.defender');
const roleStorageDisperser = require('role.storageDisperser')

const utilities = require('utilities');


module.exports.loop = function () {

    for (spawn in Game.spawns){
        
        var room = Game.spawns[spawn].pos.roomName
        var spawn = Game.spawns[spawn]
        var roomObject = Game.rooms[room]    
        
        console.log("Start " + Game.time  + " room " + room )

        let roles = {
            harvester :     {numOf:3},
            upgrader :      {numOf:1},
            builder :       {numOf:0},
            repair :        {numOf:1},
            dumpHarvester : {numOf:0},
            runner :        {numOf:0},
            fatUpgrader :   {numOf:0},
            scavenger :     {numOf:0},
            claimer :       {numOf:0},
            defender :      {numOf:0},
            storageDisperser:{numOf:0}
        }

        //find stage of development, switch to dump harvesters and runners when cannisters are in place
        var cannisters = roomObject.find(FIND_STRUCTURES, {
            filter : (struct) => {
                return (struct.structureType == STRUCTURE_CONTAINER)
            }
        });
        if(cannisters.length >= 2 && roomObject.energyCapacityAvailable >= 800){
            roles.dumpHarvester.numOf = 2
            roles.runner.numOf = 3
            roles.harvester.numOf = 1 
        }
        if (cannisters.length >= 3 && roomObject.energyCapacityAvailable >= 800){
            roles.fatUpgrader.numOf = 1
            roles.upgrader.numOf = 0
        }

        //change how many builders spawn depending on how many construction sites are around
        var constructionSites = roomObject.find(FIND_MY_CONSTRUCTION_SITES)
        if(constructionSites.length > 0 && constructionSites.length <= 5){
            roles.builder.numOf = 1
        }
        if(constructionSites.length > 5){
            roles.builder.numOf = 2
        }

        //sense enemies and spawn defenders
        var enemies = roomObject.find(FIND_HOSTILE_CREEPS)
        if(enemies.length > 0){
            roles.defender.numOf = (enemies.length * 2);
        }
        //if a large storage container is being used, add a disperser
        var storage = roomObject.find(FIND_STRUCTURES, {
            filter : {structureType: STRUCTURE_STORAGE}
        });
        if(storage.length > 0){
            roles.storageDisperser.numOf = 1
        }
        // if(room == 'W19N16'){
        //     roles.scavenger.numOf = 1
        // }

        
        console.log(roomObject.energyAvailable + ' Energy available to spawn, and '+roomObject.energyCapacityAvailable+' capacity')

        //Run towers
        var towers = roomObject.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER)                     
            }        
        });

        var towerEnergy = 0
        var towerEnergyCapacity = 0

        for(var i = 0; i < towers.length; i++){
            roleTower.run(towers[i])
            //set for logging purposes
            towerEnergy += towers[i].store[RESOURCE_ENERGY]
            towerEnergyCapacity += towers[i].store.getCapacity([RESOURCE_ENERGY])
        }
        console.log('Total tower energy = '+ towerEnergy + ' and ' + towerEnergyCapacity + ' Capacity'  )



        // clear memory of dead creeps
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory: ', name);
            }
        }
        console.log('current canNum = ' + Game.spawns["Spawn1"].memory.canNum+' and '+'sourceNum = ' + Game.spawns["Spawn1"].memory.sourceNum)

        
        
        //spawning loop
        for (var role in roles){
            
            var spawned = roomObject.find(FIND_MY_CREEPS, {
                filter : (creep) =>{
                    return creep.memory.role == role
                }
            });

            //console.log(role +" "+ spawned.length);
            if(spawned.length < roles[role].numOf) {
                var newName = role + Game.time;               

                //toggle the number associated with either a source or cannister in spawn memory
                //this number determines which source the spawning creep harvests, or cannister they dump in.
                utilities.spawnNumToggler(spawn, role)

                console.log('Attempting to spawn new '+role+' '+newName+' at '+spawn);
                
                if(spawn.spawnCreep(utilities.workerPart(role, room), newName, 
                {memory: {role: role, sourceNum : spawn.memory.sourceNum, canNum : spawn.memory.canNum}}) != 0){
                    //if spawn error code, toggle the number back
                    utilities.spawnNumToggler(spawn, role)
                }
    
            }
        }



        // text notification in game for what is spawning
        if(spawn.spawning) { 
            var spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                spawn.pos.x + 1, 
                spawn.pos.y, 
                {align: 'left', opacity: 0.8});
        }
        console.log("END " + Game.time + " room " + room )
        console.log('Cpu bucket = ' + Game.cpu.bucket)
        console.log()
        if(Game.cpu.bucket == 10000){
            Game.cpu.generatePixel()
        }
    } // end spawning loop

        
    // role execution loop
    for(var name in Game.creeps){

        var donateToRoom = false
        var creepTypeToDonate = 'builder'
        var destination = new RoomPosition(25,25, 'W19N16')

        var creep = Game.creeps[name];
        var role = creep.memory.role
        
        if (donateToRoom && role == creepTypeToDonate && creep.pos.roomName != destination.roomName){
            utilities.sendToOtherRoom(creep, destination)
        }else{
            switch (role){
                case 'harvester' :
                    if((creep.room.energyCapacityAvailable === creep.room.energyAvailable) && (towerEnergy == towerEnergyCapacity)){
                        roleUpgrader.run(creep)
                    }else{
                        roleHarvester.run(creep)
                    }
                    break;

                case 'builder' : 
                    roleBuilder.run(creep)
                    break;

                case 'repair' :
                    roleRepair.run(creep)
                    break;  

                case 'upgrader' : 
                    roleUpgrader.run(creep)
                    break;

                case 'dumpHarvester' :
                    roleDumpHarvester.run(creep)
                    break;

                case 'runner' :
                    roleRunner.run(creep)
                    break;
                    
                case 'fatUpgrader' :
                    roleFatUpgrader.run(creep)
                    break;

                case 'scavenger' : 
                    roleScavenger.run(creep)
                    break;
                
                case 'claimer' :
                    roleClaimer.run(creep)
                    break;

                case 'defender' :
                    roleDefender.run(creep)
                    break;
                
                case 'storageDisperser' :
                    roleStorageDisperser.run(creep)
                    break;

                default : 
                    console.log('WRONG/NO ROLE TO EXECUTE! ' + creep )
            }
        }            
    }    
}