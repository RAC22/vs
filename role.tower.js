var roleTower = {

    /** @param {Structure} tower **/
    run: function(tower) {

        var towerRepairRange = 0
        
        var towerX = tower.pos.x
        var towerY = tower.pos.y
        var highx = towerX + towerRepairRange
        var lowx = towerX - towerRepairRange
        var highy = towerY + towerRepairRange
        var lowy = towerY - towerRepairRange

        if(tower) {
                       
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            
            if(closestHostile && !closestHostile.name.includes('hopper')) {
                
                console.log('HOSTILE DETECTED!')
                tower.attack(closestHostile);
            }else{
                var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax &&
                    (structure.pos.x < highx && structure.pos.x > lowx ) &&
                    (structure.pos.y < highy && structure.pos.y > lowy)
                });
                
                if(closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }
            }
        }
    }
}
module.exports = roleTower;