<template>
    <f7-page>
    <f7-navbar title="About" back-link="Back" sliding></f7-navbar>
        <div id="note">
            <div class="physics">
                 id est laborum.
            </div>
            <div class="physics">
                 anim id est laborum.
            </div>
        </div>
    </f7-page>
</template>

<style lang="stylus" scoped>
#note
    color: #fff

</style>

<script>
var Physics = require('physicsjs/dist/physicsjs-full');
export default{
    data: function(){
        return{
            gravity : { x: 0, y: 1 },
            gravityBehavior: null,
            delta : [ 0, 0 ],
        }
    },
    mounted: function(){
        var iterations = 16;
        var timeStep = 1000 / 260; 
        //getBrowserDimensions();
        var stage = [ window.screenX, window.screenY, window.innerWidth, window.innerHeight ];
        var worldAABB = Physics.aabb.apply(null, stage);
        window.addEventListener( 'deviceorientation', this.onWindowDeviceOrientation, false );
        this.world = Physics.world({
            timestep: timeStep,
            maxIPF: iterations
        });
        var edgeBounce = Physics.behavior('edge-collision-detection', {
            aabb: worldAABB,
            restitution: 0.4,
            cof: 0.5
        });
        this.world.add( edgeBounce );
        this.world.add( Physics.behavior('body-collision-detection', { checkAll: false }) );
        this.world.add( Physics.behavior('sweep-prune') );
        this.world.add( Physics.behavior('body-impulse-response') );
        // constraints
        var constraints = Physics.behavior('verlet-constraints', {
            iterations: 2
        });
        this.world.add( constraints );

        // add gravity
        this.gravityBehavior = Physics.behavior('constant-acceleration',
            {acc: this.gravity });
        this.world.add( this.gravityBehavior );
        // Get physics-element elements

        var properties = [];
        var elements = document.getElementsByClassName("physics");

        for ( var i = 0; i < elements.length; i ++ ) {

            properties[i] = this.getElementProperties( elements[i] );

        }
        var bodies = [];
        for ( var i = 0; i < elements.length; i ++ ) {

            var element = elements[ i ];
            element.style.position = 'absolute';
            element.style.left = ( - properties[i][2]/2) + 'px'; // will be set by renderer
            element.style.top = ( - properties[i][3]/2) + 'px';
            element.style.width = properties[i][2] + 'px';
            bodies[i] = Physics.body('convex-polygon', {
                x: properties[i][0] + properties[i][2]/2,
                y: properties[i][1] + properties[i][3]/2,
                vertices: [
                    { x: 0, y: 0 },
                    { x: properties[i][2], y: 0 },
                    { x: properties[i][2], y: properties[i][3] },
                    { x: 0, y: properties[i][3] }
                ]
            });
            bodies[i].view = element;
            // Clean position dependencies
            while ( element.offsetParent ) {
                element = element.offsetParent;
                element.style.position = 'static';
            }
        }
        // add the bodies to the world
        this.world.add( bodies );
        // renderer
        var renderer = Physics.renderer('dom', {
            el: document.getElementById('note'),
            width: window.innerWidth,
            height: window.innerHeight,
        });
        this.world.add( renderer );
        // position the views
        this.world.render();
        //world.pause();
        Physics.util.ticker.on( this.loop );
        Physics.util.ticker.start();
        // magic to trigger GPU
        this.world.on('render', function( data ){
            var style;
            for ( var i = 0, l = data.bodies.length; i < l; ++i ){
                
                style = data.bodies[ i ].view.style;
                style.WebkitTransform += ' translateZ(0)';
                style.MozTransform += ' translateZ(0)';
                style.MsTransform += ' translateZ(0)';
                style.transform += ' translateZ(0)';
            }
        });
        // window.addEventListener( 'deviceorientation', 
        //     this.onWindowDeviceOrientation, true );
        // window.addEventListener('orientationchange', function() {
        //     this.onWindowDeviceOrientation();
        // }, false);
        // window.addEventListener('devicemotion', (event)=> {
        //     this.gravityBehavior.setAcceleration({
        //         x: event.accelerationIncludingGravity.x * 5,
        //         y: event.accelerationIncludingGravity.y * 5
        //     });
        //     console.log(this.gravityBehavior._acc);
        // });
    },
    methods:{
        run: function(){
            this.world.unpause();
        },
        onDeviceMotion: function(event){
            debugger;
            this.gravityBehavior.setAcceleration({
                x: event.accelerationIncludingGravity.x/1000 ,
                y: event.accelerationIncludingGravity.y/1000
            });
        },
        onWindowDeviceOrientation: function( event ) {
            if ( event.beta ) {
                this.gravity.x = Math.sin( event.gamma * Math.PI / 180 );
                this.gravity.y = Math.sin( ( Math.PI / 4 ) + event.beta * Math.PI / 180 );
            } 
        },
        loop: function( time ) {
            this.delta[0] += (0 - this.delta[0]) * .5;
            this.delta[1] += (0 - this.delta[1]) * .5;

            this.gravityBehavior.setAcceleration({ 
                x: this.gravity.x * 5e-4 + this.delta[0], 
                y: this.gravity.y * 5e-4 + this.delta[1]
            });

            console.log(this.gravityBehavior);
            this.world.step( time );
            this.world.render();
        },
        setWalls: function() {
            worldAABB = Physics.aabb.apply(null, stage);
            edgeBounce.setAABB( worldAABB );
        },
        getElementProperties: function( element ) {
            var x = 0;
            var y = 0;
            var width = element.offsetWidth;
            var height = element.offsetHeight;
            do {
                
                x += element.offsetLeft;
                y += element.offsetTop;

            } while ( element = element.offsetParent );
            return [ x, y, width, height ];
        },
        getBrowserDimensions: function() {
            var changed = false;
            if ( stage[0] != window.screenX ) {
                this.delta[0] = (window.screenX - stage[0]) * 50;
                stage[0] = window.screenX;
                changed = true;
            }
            if ( stage[1] != window.screenY ) {

                this.delta[1] = (window.screenY - stage[1]) * 50;
                stage[1] = window.screenY;
                changed = true;
            }

            if ( stage[2] != window.innerWidth ) {

                stage[2] = window.innerWidth;
                changed = true;
            }

            if ( stage[3] != window.innerHeight ) {

                stage[3] = window.innerHeight;
                changed = true;
            }

            return changed;
        },
    },

}
</script>
