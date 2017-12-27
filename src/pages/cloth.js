import Matter from 'matter-js';
export default function() {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Body = Matter.Body,
        Composites = Matter.Composites,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        World = Matter.World,
        Bodies = Matter.Bodies;

    // create engine
    var engine = Engine.create(),
        world = engine.world;

    // function makePattern(pWidth) {
    //     var canvas = document.createElement("canvas");
    //     var ctx = canvas.getContext("2d");
    //     canvas.width = canvas.height = (pWidth || 10 + Math.random() * 20 >> 0);
    //     ctx.fillStyle = '#fff';
    //     if (Math.random() * 2 < 1) {
    //         ctx.arc(canvas.width / 2 >> 0, canvas.width / 2 >> 0, canvas.width * (Math.random() * 0.5), 0, 2 * Math.PI);
    //         ctx.fill()
    //     } else {
    //         var half = canvas.width / 2;
    //         var lineHeight = Math.random() * canvas.width >> 0;
    //         ctx.translate(half, half);
    //         ctx.rotate(Math.random() * 90 * Math.PI / 180);
    //         ctx.fillRect(-canvas.width, -lineHeight / 2 >> 0, canvas.width * 2, lineHeight);
    //     }
    //     return ctx.createPattern(canvas, 'repeat');
    // }

    // create renderer
    var render = Render.create({
        element: document.getElementById('effect'),
        engine: engine,
        options: {
            width: 400,
            height: 600,
            background: '#fafafa',
            wireframes: false,
            // wireframeBackground: 'transparent',
            background: 'transparent',
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // add bodies
    var group = Body.nextGroup(true),
        particleOptions = { friction: 0.00001,  collisionFilter: { group: group }, render: { visible: false, strokeStyle: '#000'}},
        constraintOptions = { stiffness: 0.06 },
        cloth = Composites.softBody(0, 0, 40, 30, 8, 8, true, 20, particleOptions, constraintOptions);

    for (var i = 0; i < 40; i++) {
        cloth.bodies[i].isStatic = true;
    }

    World.add(world, [
        cloth,
        //Bodies.circle(300, 500, 80, { isStatic: true }),
        //Bodies.rectangle(500, 480, 80, 80, { isStatic: true }),
        //Bodies.rectangle(400, 609, 800, 50, { isStatic: true })
    ]);

    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.98,
                render: {
                    visible: false
                }
            }
        });

    World.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 600 }
    });

    // context for MatterTools.Demo
    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function() {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        }
    };
};

