var roleDefender = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(creep.attack(closestHostile) != 0){
            creep.moveTo(closestHostile)
        }else if (closestHostile.name.includes('hopper')){
            creep.say('Hi friend')
        }
        
	}
};

module.exports = roleDefender;