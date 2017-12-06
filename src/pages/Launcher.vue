<template>
    <f7-page>
        <f7-content>
            <f7-grid>
                <div class="ass-touch" v-for='n in 45'>
                    <img :src='ass'/>
                </div>
                <f7-col class='center-content' width='25' v-for='i in 8'>
                    <figure>
                        <img :src="clock" />
                        <figurecaption class="caption">Clock</figurecaption>
                    </figure>
                </f7-col>
            </f7-grid>
        </f7-content>
        <div class="bottom-dock">
            <f7-content>
                <f7-grid>
                    <f7-col class="center-content" width='25'>
                        <figure>
                            <span class="notify-badge">{{likes}}</span>
                            <img @click="phone_call" :src="phone" />
                            <figurecaption class="caption">Phone</figurecaption>
                        </figure>
                    </f7-col>
                    <f7-col class="center-content" width='25'>
                        <figure>
                            <img @click="phone_call" :src="phone" />
                            <figurecaption class="caption">Phone</figurecaption>
                        </figure>
                    </f7-col>
                    <f7-col class="center-content" width='25'>
                        <figure>
                            <img @click="phone_call" :src="phone" />
                            <figurecaption class="caption">Phone</figurecaption>
                        </figure>
                    </f7-col>
                    <f7-col class="center-content" width='25'>
                        <figure>
                            <img @click="phone_call" :src="phone" />
                            <figurecaption class="caption">Phone</figurecaption>
                        </figure>
                    </f7-col>
                </f7-grid>
            </f7-content>
        </div>
</f7-page>
</template>

<style>
.notify-badge{
    position: absolute;
    right:10px;
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

export default {
    data: function(){
        return {
            clock: clock,
            phone: phone,
            ass: ass,
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
