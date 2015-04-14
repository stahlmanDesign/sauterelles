ig.module(
	'game.entities.sauterelle'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntitySauterelle = ig.Entity.extend({
	size: {x: 8, y: 15},
    offset: {x: 8, y: 9},
	maxVel: {x: 50, y: 200},
	friction: {x: 150, y: 0},
	
	type: ig.Entity.TYPE.B, // Evil enemy group
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	health: 5,
	
	
	speed: 18,
	flip: false,
	
    jump: 150,
    
	animSheet: new ig.AnimationSheet( 'media/sprites.png', 24, 24 ),
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'crawl', 0.5, [0,1] );
        this.addAnim( 'jump', 0.5, [2,3,4] );
        this.reproduceTimer = new ig.Timer(0);
        this.speed += Math.random()*35; // some are faster
        ig.game.numSauterelles++;
	},
	
	
	update: function() {
		// near an edge? return!
		if( !ig.game.collisionMap.getTile && this.vel >0 (
				this.pos.x + (this.flip ? +4 : this.size.x -4),
				this.pos.y + this.size.y
			)
		) {
			this.flip = !this.flip;
		}
		
        this.currentAnim.flip.x = this.flip;
        
		var xdir = this.flip ? -1 : 1;
		this.vel.x = this.speed * xdir;
		
		this.parent();
        this.currentAnim = this.anims.crawl;
        
        
        // jump
		if( Math.random()<0.01 && this.standing && this.vel.y >= 0) {
        console.log('jumped')
			this.vel.y = -this.jump*Math.random()*2;
            
        }
        
        //console.log("numSauterelles = "+ig.game.numSauterelles);
        if (this.reproduceTimer.delta() > 9 && ig.game.numSauterelles <20){
            ig.game.spawnEntity( EntitySauterelle, this.pos.x, this.pos.y, {flip:this.flip});
            this.reproduceTimer.set(Math.random()*9);
        }
        
	},
	
	
	handleMovementTrace: function( res ) {
		this.parent( res );
		
		// collision with a wall? return!
		if( res.collision.x ) {
			this.flip = !this.flip;
            this.vel.y = -this.jump;
		}
	},	
	
	check: function( other ) {
		other.receiveDamage( 10, this );
       
        ig.game.spawnEntity(EntitySpit, this.pos.x+3, this.pos.y, -4);
	},kill: function () {
        ig.game.numKilled++;
        ig.game.numSauterelles--;
		this.parent();
        for (var i=0;i<13;i++){
        
            ig.game.spawnEntity(EntityShard, this.pos.x+3, this.pos.y, -4);
        }
	}
});
// Shrapnel particles
// 	Cosmetic particle effects
// The Impact API says:
//	Objects that don't need to be placed in Weltmeister don't need their own file
EntitySpit = ig.Entity.extend({
	size: {x: 6, y: 6},
	maxVel: {x: 80, y: 50},
	
	bounciness: 0.1, 
	
	type: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.PASSIVE,
		
	animSheet: new ig.AnimationSheet( 'media/shard1.png', 8, 8),
	
	bounceNum: 0,
	
	// This method is called only once on creation
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.vel.x = settings;
		this.vel.y = -150+Math.floor(Math.random()*-49);
		this.addAnim( 'fly', 0.1+Math.floor(Math.random()*3)/10, [4,5,6,7] );
		this.currentAnim.frame = Math.floor(Math.random()*4);
	},
		
	handleMovementTrace: function( res ) {
		this.parent( res );
		if( res.collision.x || res.collision.y ) {
			
			// only bounce 3 times
			this.bounceNum++;
			if( this.bounceNum > 3 ) {
				this.kill();
			}
		}
	}	
});

// Shrapnel particles
// 	Cosmetic particle effects
// The Impact API says:
//	Objects that don't need to be placed in Weltmeister don't need their own file
EntityShard = ig.Entity.extend({
	size: {x: 6, y: 6},
	maxVel: {x: 80, y: 50},
	
	bounciness: 0.1, 
	
	type: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.PASSIVE,
		
	animSheet: new ig.AnimationSheet( 'media/shard1.png', 8, 8),
	
	bounceNum: 0,
	
	// This method is called only once on creation
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.vel.x = settings;
		this.vel.y = -150+Math.floor(Math.random()*-49);
		this.addAnim( 'fly', 0.1+Math.floor(Math.random()*3)/10, [0,1,2,3] );
		this.currentAnim.frame = Math.floor(Math.random()*4);
	},
		
	handleMovementTrace: function( res ) {
		this.parent( res );
		if( res.collision.x || res.collision.y ) {
			
			// only bounce 1 times
			this.bounceNum++;
			if( this.bounceNum > 1 ) {
				this.kill();
			}
		}
	}	
});
});