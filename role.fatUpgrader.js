var roleFatUpgrader = {

     /** @param {Creep} creep **/
     run: function(creep) {
        if (creep.memory.canId){
            

            if (creep.pos.getRangeTo(Game.getObjectById(creep.memory.canId)) == 0){
               creep.upgradeController(creep.room.controller)
            }else{
                creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD)
                creep.moveTo(Game.getObjectById(creep.memory.canId))
            }
            if (creep.upgradeController(creep.room.canId) === ERR_NOT_ENOUGH_RESOURCES){
                
                creep.withdraw(Game.getObjectById(creep.memory.canId), RESOURCE_ENERGY)
            }

        }else{
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter : (struct) => {
                    return (struct.structureType == STRUCTURE_CONTAINER)
                }
            });
            creep.memory.canId = targets[2].id

        }        
	}
};

module.exports = roleFatUpgrader;