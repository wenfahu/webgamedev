<template>
    <f7-page>
        <div id="note">
            <div class="physics">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
            <div class="physics">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
        </div>
    </f7-page>
</template>

<style lang="stylus" scoped>
#note
    color: #fff

</style>

<script>
import Matter from 'matter-js';
export default{
    mounted: function(){
        // init of matter js
        this.engine = Matter.Engine.create({
            render:{
                element: document.getElementById('note'),
                options:{
                    width: window.innerWidth,
                    height: window.innerHeight,
                    background : 'transparent'
                }
            }
        });
        
        let bodies = [];
        let properties = [];
        let elements = document.querySelectorAll('.physics');
        for (let i=0; i < elements.length; i++){
            properties[i] = this.getElementProperties( elements[i] );
        }

        for(let i=0; i < elements.length; i++){
            let element = elements[ i ];
            element.style.position = 'absolute';
            element.style.left = ( - properties[i][2]/2) + 'px'; // will be set by renderer
            element.style.top = ( - properties[i][3]/2) + 'px';
            element.style.width = properties[i][2] + 'px';
            bodies[i] = Matter.Bodies.fromVertices(
                properties[i][0] + properties[i][2]/2,
                properties[i][1] + properties[i][3]/2,
                [
                    { x: 0, y: 0 },
                    { x: properties[i][2], y: 0 },
                    { x: properties[i][2], y: properties[i][3] },
                    { x: 0, y: properties[i][3] }
                ]);
        }
        Matter.World.add(this.engine.world, bodies);
        Matter.Engine.run(this.engine);

        window.addEventListener('deviceorientation', this.updateGravity, true);
        window.addEventListener('orientationchange', function() {
            this.updateGravity();
        }, false);
    },
    methods:{
        getElementProperties: function ( element ) {
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
        updateGravity : function () {
            if (!this.engine)
                return;
            var orientation = window.orientation,
                gravity = this.engine.world.gravity;

            if (orientation === 0) {
                gravity.x = Matter.Common.clamp(event.gamma, -90, 90) / 90;
                gravity.y = Matter.Common.clamp(event.beta, -90, 90) / 90;
            } else if (orientation === 180) {
                gravity.x = Matter.Common.clamp(event.gamma, -90, 90) / 90;
                gravity.y = Matter.Common.clamp(-event.beta, -90, 90) / 90;
            } else if (orientation === 90) {
                gravity.x = Matter.Common.clamp(event.beta, -90, 90) / 90;
                gravity.y = Matter.Common.clamp(-event.gamma, -90, 90) / 90;
            } else if (orientation === -90) {
                gravity.x = Matter.Common.clamp(-event.beta, -90, 90) / 90;
                gravity.y = Matter.Common.clamp(event.gamma, -90, 90) / 90;
            }
        },
    },
}
</script>
