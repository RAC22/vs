
var utilities = {
    findEnergy : function() {
        var starterRoom = 'W18N16'
        return Game.rooms[starterRoom].energyAvailable
    },

    workerPart : function(role){
        var room = 'W18N16';
        var energyAvail = Game.rooms[room].energyAvailable
        
        function defaultParts() {
            var numOfWorkerParts = Math.floor(energyAvail / 200)
            let arrayToReturn = []
            for (let i = 0; i < numOfWorkerParts; i++){
                var chunk = arrayToReturn.push(WORK,CARRY,MOVE)
            }
            return arrayToReturn;
        }
        
        switch (role){
            case 'harvester' :
                return defaultParts();
            case 'builder' : 
                return defaultParts();
            case 'repair' :
                return defaultParts();  
            case 'upgrader' : 
                return defaultParts();
            case 'dumpHarvester' :
                var array = [WORK,WORK,WORK,WORK,WORK,MOVE]
                return array
            case 'runner' :
                var array = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
                return array
            case 'fatUpgrader' :
                var array = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,CARRY,CARRY,CARRY]
                return array
            case 'BLOBMAN' :
                var array = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL]
                return  array
            case 'scavenger' : 
                var array = [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
                return array
            case 'claimer' :
                var array = [CLAIM,MOVE,MOVE,MOVE]
                return array 
                
            default :
                console.log('HEY ROLE IS WRONG FOO')
        }        
    },

    spawnNumToggler : function (spawn, role) {
        if(spawn.memory.sourceNum == 1){
            spawn.memory.sourceNum = 0
        }else if (spawn.memory.sourceNum == 0){
            spawn.memory.sourceNum = 1
        }else{spawn.memory.sourceNum = 0}

        if(role == 'dumpHarvester'){
            if(spawn.memory.canNum == 1){
                spawn.memory.canNum = 0
            }else if (spawn.memory.canNum == 0){
                spawn.memory.canNum = 1
            }else{spawn.memory.canNum = 0}
        }
    }
}
module.exports = utilities;