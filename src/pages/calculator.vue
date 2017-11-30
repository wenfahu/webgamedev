<template>
    <f7-page>
      <f7-navbar title="Calculator" back-link="Back" sliding></f7-navbar>
      <div class="display">
          <div class="cell_text">{{current.expression}}</div>
      </div>
      <CalculatorKeypad v-model='current' />
    </f7-page>
</template>

<style>
.display{
    font:5em "Open Sans", sans-serif;
    color: #FFF;
    height: 18%;
    position: relative;
}
.cell_text{
    position: absolute;
    bottom: 0;
    right: 0;
}

.input-box{
    background: rgba(99, 106, 112, 0.5);
    height: 100px;
}

.full_page{
    height: 100%;
}
</style>
<script>
import CalculatorKeypad from './CalculatorKeypad.vue'
export default{
    components:{
        CalculatorKeypad
    },
    props:{
    },
    methods:{
    },
    data: function(){
        return {
            current: ''
        }
    }
}
</script>
