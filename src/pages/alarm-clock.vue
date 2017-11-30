<template>
    <f7-page>
        <f7-block class="dark" inner>
            <span>
                <span id="cnt0" class="iOdometer"> </span>
                <span id="cnt1" class="iOdometer"> </span>
                <span class="clock">:</span>
                <span id="cnt2" class="iOdometer"> </span>
                <span id="cnt3" class="iOdometer"> </span>
            </span>
            <f7-input class="switch-btn" type="switch" @change="onChange"></f7-input>
        </f7-block>
    </f7-page>
</template>
<style>
span.iOdometer{
    font-size: 3em;
    color: #fff;
}
.clock{
    font-size: 3em;
    color: #fff;
}
.switch-btn{
    display: inline;
    position: absolute;
    right: 20px;
    top: 30%;
}
.dark{
    background-color: #000;
}

</style>
<script>
import Odometer from 'odometer';
import Odometer_theme from "./odometer-theme-minimal.css";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default{
    mounted: function(){
        this.od0 = new Odometer({
            el: document.querySelector('#cnt0'),
            theme: 'minimal',
            value: 0,
        });
        this.od1 = new Odometer({
            el: document.querySelector('#cnt1'),
            theme: 'minimal',
            value: 0,
        });
        this.od2 = new Odometer({
            el: document.querySelector('#cnt2'),
            theme: 'minimal',
            value: 0,
        });
        this.od3 = new Odometer({
            el: document.querySelector('#cnt3'),
            theme: 'minimal',
            value: 0,
        });
        this.running = true;
        // this.od.update(555)
        this.id0 = setInterval(()=>{
            var val = this.od0.value + 1;
            this.od0.update(val%2);
        }, 300);
        this.id1 = setInterval(()=>{
            var val = this.od1.value + 1;
            this.od1.update(val%10);
        }, 200);
        this.id2 = setInterval(()=>{
            var val = this.od2.value + 1;
            this.od2.update(val%6);
        }, 100);
        this.id3 = setInterval(()=>{
            var val = this.od3.value + 1;
            this.od3.update(val%10);
        }, 50);
    },
    computed: {
    },
    methods:{
        onChange: async function(){
            if(this.running){
                clearInterval(this.id0);
                await sleep(1000);
                clearInterval(this.id1);
                await sleep(1000);
                clearInterval(this.id2);
                await sleep(1000);
                clearInterval(this.id3);
            }else{
                this.id0 = setInterval(()=>{
                    var val = this.od0.value + 1;
                    this.od0.update(val%2);
                }, 300);
                this.id1 = setInterval(()=>{
                    var val = this.od1.value + 1;
                    this.od1.update(val%10);
                }, 200);
                this.id2 = setInterval(()=>{
                    var val = this.od2.value + 1;
                    this.od2.update(val%6);
                }, 100);
                this.id3 = setInterval(()=>{
                    var val = this.od3.value + 1;
                    this.od3.update(val%10);
                }, 50);
            }
            this.running = !this.running;
        },
    },
}
</script>
