var roleRepair = {

    /** @param {Creep} creep **/
    run: function(creep) {
// if creep has energy -> repair = true && harvest = false
// if creep has no energy -> harvest = true && repair = false

// if target and target hits = hitmax -> target = false
// if target and target hits < hitmax -> repair target
// if !target -> find new target
    var creepEmpty
    if (creep.store[RESOURCE_ENERGY] == 0){creepEmpty = true}else{creepEmpty = false}

    var creepFull
    if (creep.store.getFreeCapacity() == 0){creepFull = true}else{creepFull = false}

    if (creepFull){
        creep.memory.repair = true
        creep.say('🚧 Repair');
    }
    if (creepEmpty){
        creep.memory.repair = false
        creep.say('🔄 harvest');
    }
    if(creepEmpty && creep.memory.Target){
        creep.memory.Target = false
    }
    if (creep.memory.Target && !creepEmpty && creep.memory.repair){
        //console.log('Repair Target has ' + Game.getObjectById(creep.memory.Target).hits + ' hp')
		if(creep.repair(Game.getObjectById(creep.memory.Target)) == ERR_NOT_IN_RANGE) {
        creep.moveTo(Game.getObjectById(creep.memory.Target), {visualizePathStyle: {stroke: '#ffffff'}});
        }
        if((Game.getObjectById(creep.memory.Target).hits == Game.getObjectById(creep.memory.Target).hitsMax)){
            creep.memory.Target = false;
        }
        
    }else{
        if (creep.memory.repair){

            targets = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => s.hits > 0 && (s.hits / s.hitsMax) < .8
            });
            targets.sort(function (a, b) {
                return a.hits - b.hits;
            });
            if (targets.length > 0){
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
                var id = Game.getObjectById(targets[0].id);				
                creep.memory.Target = id.id;
            }    
        }else{
            var cans = creep.room.find(FIND_STRUCTURES, {
                filter : (struct) => {
                    return (struct.structureType == STRUCTURE_CONTAINER
                        && struct.store[RESOURCE_ENERGY] > 500
                        )
                }
            });
            
            var closest = creep.pos.findClosestByPath(cans)
            
            if(closest){
                if(creep.withdraw(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }else{
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[creep.memory.sourceNum]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[creep.memory.sourceNum], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                creep.memory.repair = false
            }			
    
        }



        
        }
    }
};

module.exports = roleRepair;