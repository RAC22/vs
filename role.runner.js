var roleRunner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if (creep.memory.Target && creep.store[RESOURCE_ENERGY] < 300){
            creep.say('🔄 Collect?');
            
            if(creep.withdraw(Game.getObjectById(creep.memory.Target), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.Target), {visualizePathStyle: {stroke: '#ffffff'}});
            }else{
                creep.memory.Target = false
            }
            if (creep.memory.Target && creep.store[RESOURCE_ENERGY] != 0 ){
                creep.memory.Target = false
                creep.memory.hauling = true
            }
        }else{
            
            if(creep.memory.hauling && creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.hauling = false;
                creep.say('🔄 Collect');
            }
            if(!creep.memory.hauling && creep.store.getFreeCapacity() == 0) {
                creep.memory.hauling = true;
                creep.say('⚡ Hauling');
            }

            if(creep.memory.hauling) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && 
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }                    
                });

                //medium piority
                var upgradeContainer = creep.room.find(FIND_STRUCTURES, {
                    filter: { structureType: STRUCTURE_CONTAINER }
                })[2];
                if(upgradeContainer){
                    if(targets.length == 0 && upgradeContainer.store.getFreeCapacity(RESOURCE_ENERGY) > 500){
                        if(creep.transfer(upgradeContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(upgradeContainer, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }         
                }
                       
                //low priority
                if (targets.length == 0){
                    
                    targets.push(creep.room.find(FIND_STRUCTURES, {
                        filter : (structure) => {
                            return (structure.structureType == STRUCTURE_STORAGE)
                        }
                    })[0]);
                }
                
                
                if(targets.length > 0) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }else{
                        creep.transfer(targets[0], RESOURCE_ENERGY)
                    }
                }
            }
            else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter : (struct) => {
                        
                        return (struct.structureType == STRUCTURE_CONTAINER)
                    }
                });
                //remove the last container, which should be the upgrader container
                if(targets.length == 3){
                    targets.pop()
                }
                //sort to find the least empty container
                targets.sort(function (a, b) {
                    return a.store.getFreeCapacity() - b.store.getFreeCapacity();
                });                
                if(creep.withdraw(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
                
                if(Object.keys(targets).length != 0){
                    
                    var id = Game.getObjectById(targets[0].id);				
                    creep.memory.Target = id.id;
                }
                
            }
        }
	}
};

module.exports = roleRunner;