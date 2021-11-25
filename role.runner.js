var roleRunner = {

    /** @param {Creep} creep **/
    run: function(creep) {
    // make creep with lots of move/carry
    // if no energy, target cannister and move to it and get some
    // if energy, go give energy to what needs it. 
        
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
                if (targets.length == 0 && Game.getObjectById('619a330aab7e4c0814fb415d').store[RESOURCE_ENERGY] < 1500){
                    targets.push(Game.getObjectById('619a330aab7e4c0814fb415d'))
                    
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
                        
                        return (struct.structureType == STRUCTURE_CONTAINER
                            && struct.store[RESOURCE_ENERGY] > 300
                            
                            )
                    }
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