
var roleDumpHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.canId){

            if (creep.pos.getRangeTo(Game.getObjectById(creep.memory.canId)) == 0){
                var source = creep.pos.findClosestByPath(FIND_SOURCES)
                creep.harvest(source)
            }else{
                creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD)
                creep.moveTo(Game.getObjectById(creep.memory.canId))
            }

        }else{
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter : (struct) => {
                    return (struct.structureType == STRUCTURE_CONTAINER)
                }
            });
            if(!creep.memory.canId){
                creep.memory.canId = targets[creep.memory.canNum].id
            }
            

        }        
	}
};

module.exports = roleDumpHarvester;