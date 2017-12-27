<template>
    <f7-page>
        <f7-navbar title="Note" back-link="Back" sliding></f7-navbar>
        <!---
        <div id='debug'>
        </div>
        -->
        <div class="wrapper">
            <div id="text" @click=clicked>
              <p>去月亮上的白色荒原<br>
              那里有一处一望无际的仓库<br>
              在排列成行的细颈瓶中保存着<br>
              人们没有经历过的历史<br>
              曾经敲过意识之门又永远消失的思想<br>
              在组合游戏中可能被抛出来的粒子<br>
              可能达到却永远达不到的解决办法</p>
            </div>
        </div>
    </f7-page>
</template>
<style lang="stylus" scoped>
.wrapper
    color: #fff
</style>

<script>
import Matter from 'matter-js';
export default{
    methods:{
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
        clicked: function(){
            let div = document.getElementById('text');
            let text = div.firstChild.textContent;
            let span = document.createElement('span');
            let splited_text = [...text];
            splited_text.forEach(function(e){
                let text_span = document.createElement('span');
                text_span.innerHTML = e;
                text_span.setAttribute('class', 'matter');
                text_span.setAttribute('style', 'position: absolute');
                span.appendChild(text_span);
            });
            div.parentNode.insertBefore(span, div.nextSibling);
            div.style.display = 'none';

            var VIEW = {};
            VIEW.SAFE_WIDTH = 100;
            VIEW.SAFE_HEIGHT = 100;
            VIEW.scale = Math.min(window.innerWidth / VIEW.SAFE_WIDTH, window.innerHeight / VIEW.SAFE_HEIGHT);
            VIEW.width = window.innerWidth / VIEW.scale;
            VIEW.height = window.innerHeight / VIEW.scale;
            VIEW.centerX = VIEW.width / 2;
            VIEW.centerY = VIEW.height / 2;
            VIEW.offsetX = (VIEW.width - VIEW.SAFE_WIDTH) / 2 / VIEW.scale;
    VIEW.offsetY = (VIEW.height - VIEW.SAFE_HEIGHT) / 2 / VIEW.scale;

            // Matter.js module aliases
            var Engine = Matter.Engine,
                World = Matter.World,
                Bodies = Matter.Bodies;

            // create a Matter.js engine
            this.engine = Engine.create({
                render: {
                    element: document.getElementById("debug"),
                    options: {
                        width: 100,
                        height: 100,
                        background: '#fafafa',
                        wireframeBackground: '#222',
                        hasBounds: false,
                        enabled: true,
                        wireframes: true,
                        showSleeping: true,
                        showDebug: false,
                        showBroadphase: false,
                        showBounds: false,
                        showVelocity: false,
                        showCollisions: false,
                        showAxes: false,
                        showPositions: false,
                        showAngleIndicator: false,
                        showIds: false,
                        showShadows: false
                    }
                }
            });

            // var ground = Bodies.rectangle(50, 350, 400, 500, {
            //     isStatic: true,
            // });
            var ground = [
                Bodies.rectangle(50, 350, 400, 500, { isStatic: true }),
                Bodies.rectangle(0, 200, 10, 400, { isStatic: true }),
                Bodies.rectangle(100, 200, 10, 400, { isStatic: true }),
                //Bodies.rectangle(50, 0, 400, 500, { isStatic: true })
                ];

            // add all of the bodies to the world
            // World.add(this.engine.world, [ground]);
            World.add(this.engine.world, ground);

            // run the engine
            Engine.run(this.engine);

            var bodiesDom = document.querySelectorAll('.matter');
            var bodies = [];
            for (var i = 0, l = bodiesDom.length; i < l; i++) {
                var body = Bodies.rectangle(
                    VIEW.centerX,
                    20, 
                    VIEW.width*bodiesDom[i].offsetWidth/window.innerWidth, 
                    VIEW.height*bodiesDom[i].offsetHeight/window.innerHeight,
                );
                bodiesDom[i].id = body.id;
                bodies.push(body);
            }
            World.add(this.engine.world, bodies);

            window.requestAnimationFrame(update);
            function update() {
                for (var i = 0, l = bodiesDom.length; i < l; i++) {
                    var bodyDom = bodiesDom[i];
                    var body = null;
                    for (var j = 0, k = bodies.length; j < k; j++) {
                        if ( bodies[j].id == bodyDom.id ) {
                            body = bodies[j];
                            break;
                        }
                    }
                    
                    if ( body === null ) continue;
                    
                    bodyDom.style.transform = "translate( " 
                        + ((VIEW.offsetX + body.position.x) * VIEW.scale - bodyDom.offsetWidth/2 ) 
                        + "px, "
                        + (VIEW.offsetY *2 + ( body.position.y) * VIEW.scale - bodyDom.offsetHeight/2)
                        + "px )";
                    bodyDom.style.transform += "rotate( " + body.angle + "rad )";
                    
                }
                window.requestAnimationFrame(update);
            }
            window.addEventListener('deviceorientation', this.updateGravity, true);
            window.addEventListener('orientationchange', function() {
                this.updateGravity();
            }, false);

        },
    }
}
</script>
