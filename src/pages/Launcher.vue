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
                    <f7-col class="center-content" width='25' v-for='i in 4'>
                        <figure>
                            <img :src="phone" />
                            <figurecaption class="caption">Phone</figurecaption>
                        </figure>
                    </f7-col>
                </f7-grid>
            </f7-content>
        </div>
</f7-page>
</template>

<style>
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

export default {
    data: function(){
        return {
            clock: clock,
            phone: phone,
            ass: ass
        }
    }
}
</script>
