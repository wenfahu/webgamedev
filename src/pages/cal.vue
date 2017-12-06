<template>
    <f7-page>
        <div class='cal-header'>
            <div class="header-row">
                <span class="header-col">S </span>
                <span class="header-col">M </span>
                <span class="header-col">T </span>
                <span class="header-col">W </span>
                <span class="header-col">T </span>
                <span class="header-col">F </span>
                <span class="header-col">S </span>
            </div>
            <div class="header-row">
                <span v-for='i in 7' class="header-col">
                    <p v-if="i==start_day_col">{{ month}}</p>
                </span>
            </div>
        </div>
        <div id='cal-main'>
            <div id='canvas'></div>
            <div class='cal-container'>
                <div v-for="r in row" class='cal-row'>
                    <span v-for="c in col" class='cal-col'>
                        {{daysCoordinates[[r, c]]}}
                    </span>
                </div>
            </div>
        </div>
    </f7-page>
</template>

<style lang="stylus" scoped>
.cal-header
    background: #fff
    display: flex
    flex-direction: column
    justify-content: center
    .header-row
        display: flex
        justify-content: center
        width: 100%
        .header-col
            text-align: center
            min-width: 14%
            p
                color: red

#cal-main
    width: 100%
    height: 100%

#canvas
    position: absolute
    z-index: -1
.cal-container
    display: flex
    flex-direction: column
    justify-content: center
    .cal-row
        display: flex
        justify-content: center
        width: 100%
        .cal-col
            text-align: center
            min-width: 14%
            min-height: h = (100/7)vw
            line-height: h

</style>

<script>
import Matter from 'matter-js';
import generator from 'generate-maze';
import {DateTime} from 'luxon';
import * as Hammer from 'hammerjs';

export default{
    data: function(){
        return {
            wallWidth : 0.5,
            cellwidth : window.innerWidth/7,
            col: 7,
            offset: 0,
        };
    },
    computed: {
        month: function(){
            let dt = DateTime.local().plus({
                months: this.offset,
            });
            return dt.toFormat('LLL').toUpperCase();
        },
        start_day_col: function(){
            let dt = DateTime.local().plus({
                months: this.offset,
            });
            let start_of_month = dt.startOf('month');
            let start_weekday = start_of_month.weekday;
            let start_col = start_weekday == 7 ? 1 : start_weekday + 1;
            return start_col;
        },
        ball_init_pos: function(){
            let dt = DateTime.local();
            let start_of_month = dt.startOf('month');
            let start_weekday = start_of_month.weekday;
            let start_col = start_weekday == 7 ? 0 : start_weekday;
            let current_row = Math.floor((dt.day + start_col) / 7);
            let current_col = dt.weekday == 7 ? 0 : dt.weekday;
            return [ current_col, current_row]
        },
        row: function(){
            let dt = DateTime.local().plus({
                months: this.offset,
            });
            let start_of_month = dt.startOf('month');
            let days_in_month = dt.daysInMonth;
            let start_weekday = start_of_month.weekday;
            let current_col = start_weekday == 7 ? 1 : start_weekday+1;
            return Math.ceil((current_col+days_in_month)/7);
        },
        daysCoordinates: function(){
            let dt = DateTime.local().plus({
                months: this.offset,
            });
            let start_of_month = dt.startOf('month');
            let days_in_month = dt.daysInMonth;
            let start_weekday = start_of_month.weekday;
            let current_row = 0;
            let current_col = start_weekday == 7 ? 0 : start_weekday;
            let coordinates = {};
            for (let day=1; day<=days_in_month; day++){
                // coordinates[day] = [current_row, current_col];
                coordinates[[current_row+1, current_col+1]] = day;
                current_col = (current_col + 1) % 7;
                if(current_col == 0){
                    current_row = current_row +1;
                }
            }
            return coordinates;
        },
    },
    mounted: function(){
        this.engine = Matter.Engine.create();
        let render = Matter.Render.create({
            element: document.getElementById('canvas'),
            engine: this.engine,
            options: {
                width: window.innerWidth,
                height: document.getElementById('cal-main').clientHeight,
                wireframes: false,
                background: 'white',
            },
        });
        Matter.Render.run(render);
        let runner = Matter.Runner.create();
        Matter.Runner.run(runner, this.engine);
        let matter = this.generate_maze(this.row, this.col);

        let [ball_x, ball_y] = this.ball_init_pos;
        const ball_opts = {
            render:{
                lineWidth: 1,
                strokeStyle: '#d44b5b',
                fillStyle: '#d44b5b',
            }
        };
        let ball = Matter.Bodies.circle((ball_x+0.5)*this.cellwidth, (ball_y+0.5)*this.cellwidth,
        20, ball_opts);

        let mc_ele = document.getElementById('cal-main');
        let mc = new Hammer(mc_ele);
        mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL});
        mc.on('swipeup', (event)=>{
            this.offset = this.offset + 1;
        });
        mc.on('swipedown', (event)=>{
            this.offset = this.offset - 1;
        });

        Matter.World.add(this.engine.world, [matter, ball]);
        window.addEventListener('deviceorientation', this.updateGravity, true);
        window.addEventListener('orientationchange', function() {
            this.updateGravity();
        }, false);
        window.addEventListener('keydown', (event)=>{
            if(event.keyCode == '74'){
                this.offset = this.offset + 1;
            }
            if(event.keyCode == '75'){
                this.offset = this.offset - 1;
            }
        }, false);
    },
    methods:{
        page_next: function(){
            this.offset = this.offset + 1;
        },
        page_prev: function(){
            this.offset = this.offset - 1;
        },
        generate_maze: function(row, col){
            var matter = Matter.Composite.create({
                isStatic: true
            });
            var maze = generator(col, row);
            for(var i=0; i<row; i++){
                for(var j=0; j<col; j++){
                    let cell = this.draw_cell(maze[i][j]);
                    Matter.Composite.add(matter, cell);
                }
            }
            return matter;
        },
        getRandomColor: function() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        },
        draw_cell: function(cell){
        /*
        draw maze cell based on the given cell state
        cell: an object with following properties
        {
          x: 4,          // Horizontal position, integer
          y: 7,          // Vertical position, integer
          top: false,    // Top/Up has a wall/blocked if true, boolean 
          left: false,   // Left has a wall/blocked if true, boolean
          bottom: true,  // Bottom/Down has a wall/blocked if true, boolean
          right: true,   // Right has a wall/blocked if true, boolean
          set: 5         // Set # used to generate maze, can be ignored
        }
        */
            const cell_walls = Matter.Composite.create({ isStatic: true });
            const wall_opts = {
                isStatic: true,
                render:{
                    lineWidth: 1,
                    strokeStyle: '#fefefe',
                    fillStyle: '#fefefe',
                }
            };
            let x = cell.x; // vertical coordinates
            let y = cell.y; // horizontal coordinates
            let cell_opts = {
                isStatic: true, 
                render: {
                    fillStyle: this.getRandomColor(),
                }
            };
            // Matter.Composite.add(cell_walls, Matter.Bodies.rectangle( (x+0.5) * this.cellwidth, (y+0.5)*this.cellwidth, 
            //     this.cellwidth, this.cellwidth, cell_opts));
            if(cell.top){
                Matter.Composite.add(cell_walls, Matter.Bodies.rectangle( (x+0.5) * this.cellwidth, y * this.cellwidth, 
                    this.cellwidth, this.wallWidth, wall_opts));
            }
            if(cell.left){
                Matter.Composite.add(cell_walls,  Matter.Bodies.rectangle( x * this.cellwidth, (y+0.5) * this.cellwidth, 
                    this.wallWidth, this.cellwidth, wall_opts));
            }
            if(cell.bottom){
                Matter.Composite.add(cell_walls,  Matter.Bodies.rectangle( (x+0.5) * this.cellwidth, (y+1) * this.cellwidth, 
                    this.cellwidth, this.wallWidth, wall_opts));
            }
            if(cell.right){
                Matter.Composite.add(cell_walls, Matter.Bodies.rectangle( (x+1) * this.cellwidth, (y+0.5) * this.cellwidth, 
                    this.wallWidth, this.cellwidth, wall_opts));
            }
            return cell_walls;
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
    }
}
</script>
