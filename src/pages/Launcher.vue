<template>
    <f7-page>
        <f7-content>
            <f7-grid>
                <!--
                <div class="ass-touch" v-for='n in 45'>
                    <img :src='ass'/>
                </div>
                -->
                <f7-col class='center-content' width='25'>
                    <figure>
                        <a href="/clock/"><img :src="clock" /></a>
                        <figurecaption class="caption">Clock</figurecaption>
                    </figure>
                </f7-col>
                <f7-col class='center-content' width='25'>
                    <figure>
                        <a href="/calculator/"><img :src="calculator" /></a>
                        <figurecaption class="caption">Calculator</figurecaption>
                    </figure>
                </f7-col>
                <f7-col class='center-content' width='25'>
                    <figure>
                        <a href="/weather/"><img :src="weather"/></a>
                        <figurecaption class="caption">Weather</figurecaption>
                    </figure>
                </f7-col>
                <f7-col class='center-content' width='25'>
                    <figure>
                        <a href="/about/"><img :src="notes" /></a>
                        <figurecaption class="caption">Notes</figurecaption>
                    </figure>
                </f7-col>
                <f7-col class='center-content' width='25'>
                    <figure>
                        <a href="siri"><img :src="siri" /></a>
                        <figurecaption class="caption">Siri</figurecaption>
                    </figure>
                </f7-col>
                <f7-col class='center-content' width='25'>
                    <figure>
                        <a href="/cal/"><img :src="calendar" /></a>
                        <figurecaption class="caption">Calendar</figurecaption>
                    </figure>
                </f7-col>
                <f7-col width='50'>
                </f7-col>
            </f7-grid>
        </f7-content>
        <div class="bottom-dock">
            <f7-content>
                <f7-grid>
                    <f7-col width='25'></f7-col>
                    <f7-col class="center-content" width='25'>
                        <figure>
                            <span class="notify-badge">{{likes}}</span>
                            <img @click="phone_call" :src="phone" />
                            <figurecaption class="caption">Phone</figurecaption>
                        </figure>
                    </f7-col>
                    <f7-col class="center-content" width='25'>
                        <figure>
                            <a href="/msg/"><img :src="message" /></a>
                            <figurecaption class="caption">Message</figurecaption>
                        </figure>
                    </f7-col>
                    <f7-col width='25'></f7-col>
                </f7-grid>
            </f7-content>
        </div>
</f7-page>
</template>

<style>
.notify-badge{
    position: absolute;
    right:50%;
    top:10px;
    background:red;
    text-align: center;
    border-radius: 50%;
    color:white;
    padding:0px 10px;
    font-size:20px;
}

.ass-touch{
    width: 50px;
    height:50px;
    position:fixed;
}

.ass-touch-fixed{
    width: 50px;
    height:50px;
    position:fixed;
}

.bottom-dock{
    position: fixed;
    bottom:0;
    max-height: 20%;
    background-color: rgba(255, 255, 255, 0.5);
    padding-left: 10px;
    padding-right: 10px;
}

.center-content{
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin:0;
}
.caption{
    color: #fff;
}

</style>

<script>
import clock from "../assets/AppIcon/Clock.png"
import phone from "../assets/AppIcon/Phone.png"
import ass from "../assets/touch-mini.png"
import io from 'socket.io-client';
import calculator from '../assets/AppIcon/calculator.png'
import notes from '../assets/AppIcon/notes.png'
import weather from '../assets/AppIcon/weather.png' 
import siri from '../assets/AppIcon/Siri.png' 
import message from '../assets/AppIcon/Messages.png' 
import calendar from '../assets/AppIcon/calendar.png' 

export default {
    data: function(){
        return {
            clock: clock,
            phone: phone,
            calculator: calculator,
            notes: notes,
            weather: weather,
            siri: siri,
            ass: ass,
            message: message,
            calendar: calendar,
            likes : 0,
        }
    },
    mounted:function(){
        this.socket = io('/like');
        this.socket.on('message', (res)=>{
            console.log(res);
            this.likes = res.likes;
        });
        this.socket.on('change_liked', (res)=>{
            console.log(res);
            this.likes = res.likes;
        });
    },
    methods: {
        phone_call: function(){
            this.socket.emit('liked');
        },
    }
}
</script>
