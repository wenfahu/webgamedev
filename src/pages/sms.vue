<template>
    <f7-page>
        <f7-messages id="msg-content">
            <f7-message v-for="msg in messages" :text="msg.m" :type="msg.type">
            </f7-message>
        </f7-messages>
        <f7-messagebar placeholder="Message" send-link="Send" @submit="onSubmit"></f7-messagebar>
    </f7-page>
</template>

<style lang="stylus" scoped>

#msg-content
    padding-bottom: 50px;

</style>

<script>
import io from 'socket.io-client';
export default{
    data: function(){
        return {
            id: 0,
            messages: []
        };
    },
    // computed: {
    //     messages: function(){
    //         // this.$http.get('/load').then(function(res){
    //         //     return res;
    //         // }, function(res){
    //         //     console.log(res);
    //         // });
    //         return [];
    //     }
    // },
    mounted: function(){
        this.socket = io('/msg');
        this.messages = [];
        this.socket.on('message', (res)=>{
            // console.log(res);
            for(var r of res){
                let x = JSON.parse(r);
                x.type = 'received';
                this.messages.push(x);
            }
            //this.messages = res;
            this.$forceUpdate();
        });
        //this.socket.connect('ws://166.111.82.202:8889');
        this.socket.on('latest', (res)=>{
            this.id = this.socket.id.split('#')[1];
            let msg = JSON.parse(res); 
            msg.type = msg.n != this.id ?"received" : "sent" ;
            this.messages.push(msg);
            this.$forceUpdate();
        });
    },
    methods:{
        onSubmit: function(text, clear){
            if(text.trim().length === 0) return;
            //this.socket.emit('io:message', text);
            this.socket.emit('io:message', text);
            clear();
        },
    },
}
</script>
