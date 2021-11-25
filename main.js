const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepair = require('role.repair');
const roleDumpHarvester = require('role.dumpHarvester');
const roleRunner = require('role.runner');
const roleFatUpgrader = require('role.fatUpgrader');
const roleTower = require('role.tower');
const roleScavenger = require('role.scavenger');
const roleClaimer = require('role.claimer')

const roleBLOBMAN = require('role.BLOBMAN');

const utilities = require('utilities');



module.exports.loop = function () {

    console.log("Start " + Game.time)

    let homeroom = 'W18N16'
    let roles = {
        harvester :     {numOf:1},
        upgrader :      {numOf:0},
        builder :       {numOf:0},
        repair :        {numOf:1},
        dumpHarvester : {numOf:2},
        runner :        {numOf:3},
        fatUpgrader :   {numOf:1},
        BLOBMAN :       {numOf:0},
        scavenger :     {numOf:2},
        claimer :       {numOf:0}
    }
    
    console.log(utilities.findEnergy() + ' Energy available to spawn')



    //Run towers
    var towers = Game.rooms[homeroom].find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER)                     
        }        
    });

    var towerEnergy = 0
    var towerEnergyCapacity = 0

    for(var i = 0; i < towers.length; i++){
        roleTower.run(towers[i])
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
        
        var spawned = _.filter(Game.creeps, (creep) => creep.memory.role == role); 
        //console.log(role +" "+ spawned.length);
        if(spawned.length < roles[role].numOf) {

            var newName = role + Game.time;
            var spawn = Game.spawns['Spawn1']

            //toggle the number associated with either a source or cannister in spawn memory
            //this number determines which source the spawning creep harvests, or cannister they dump in.
            utilities.spawnNumToggler(spawn, role)

            console.log('Attempting to spawn new '+role+ ' ' + newName);

            if(spawn.spawnCreep(utilities.workerPart(role), newName, 
            {memory: {role: role, sourceNum : spawn.memory.sourceNum, canNum : spawn.memory.canNum}}) != 0){
                //if spawn error code, toggle the number back
                utilities.spawnNumToggler(spawn, role)
            }
   
        }
    }



    // text notification in game for what is spawning
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }


    
    // role execution loop
    for(var name in Game.creeps){

        var creep = Game.creeps[name];
        var role = creep.memory.role

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

            case 'BLOBMAN' :
                roleBLOBMAN.run(creep)
                break;
            
            case 'scavenger' : 
                roleScavenger.run(creep)
                break;
            
            case 'claimer' :
                roleClaimer.run(creep)
                break;

            default : 
                console.log('WRONG/NO ROLE TO EXECUTE!')
        }
    }
    
    console.log("END " + Game.time )
    console.log('Cpu bucket = ' + Game.cpu.bucket)
    console.log()
    if(Game.cpu.bucket == 10000){
        Game.cpu.generatePixel()
    }
}