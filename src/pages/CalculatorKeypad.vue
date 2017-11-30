<template>
      <f7-grid no-gutter class="keypad">

          <f7-col class="gray" width="25">
              <div @click="press">C</div>
          </f7-col>
          <f7-col class="gray" width="25">
              <div @click="press">±</div>
          </f7-col>
          <f7-col class="gray" width="25">
              <div @click="press">%</div>
          </f7-col>
          <f7-col class="orange" width="25">
              <div @click="press">/</div>
          </f7-col>
          <f7-col class="gray" width="25">
              <div @click="press">7</div>
          </f7-col>
          <f7-col class="gray" width="25">
              <div @click="press">8</div>
          </f7-col>
          <f7-col class="gray" width="25">
              <div @click="press">9</div>
          </f7-col>
          <f7-col class="orange" width="25">
              <div @click="press">x</div>
          </f7-col>
          <f7-col class="gray" width="25">
              <div @click="press">4</div>
          </f7-col>
          <f7-col class="gray" width="25">
              <div @click="press">5</div>
          </f7-col>
          <f7-col class="gray" width="25">
              <div @click="press">6</div>
          </f7-col>
          <f7-col class="orange" width="25">
              <div @click="press">-</div>
          </f7-col>
          <f7-col class="gray" width="25">
              <div @click="press">1</div>
          </f7-col>
          <f7-col class="gray" width="25">
              <div @click="press">2</div>
          </f7-col>
          <f7-col class="gray" width="25">
              <div @click="press">3</div>
          </f7-col>
          <f7-col class="orange" width="25">
              <div @click="press">+</div>
          </f7-col>

          <f7-col class="gray" width="50">
              <div @click="press">0</div>
          </f7-col>
          <f7-col class="gray" width="25">
              <div @click="press">.</div>
          </f7-col>
          <f7-col class="orange" width="25">
              <div @click="press">=</div>
          </f7-col>

      </f7-grid>
</template>

<style>
.orange{
    background: #e27e1f;
    border: thin solid black;
    height: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 2em;
}

.gray{
    background: #d3d3d3;
    border: thin solid black;
    height: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 2em;
}

.keypad{
    height: 82%;
}
</style>
<script>
export default{
    data: function(){
        return {
        }
    },
    props:{
        current : '',
        x: '',
        y: '',
        operator: null,
    },
    methods:{
        setNumber(digit){
            if(this.operator === null){
                this.x += digit;
                this.display = this.x;
            }
            else{
                this.y += digit;
                this.display = this.y;
            }
        },
        press: function (event) {
          if(!self.current){
            self.current = '';
          }
          //we make a reference to the inner text
          // of each button to dispatch our functions
          let key = event.target.innerText;
          if ( key != "=" &&
          key != "C" &&
          key != "x" &&
          key != "/" &&
          key != "%" &&
          key != "±"
          ) {
            self.current += key;
          } else if ( key === "=") {
              self.current = eval(self.current);
          } else if (key === "C") {
              self.current = '';
          } else if (key === "x") {
              self.current += '*';
          } else if (key === "/") {
              self.current +='/';
          } else if (key === "+") {
              self.current +='+';
          } else if (key === "-") {
              self.current +='-';
          } else if (key === "±") {
              self.current = '-' + self.current;
          } else if (key === "%") {
              self.current = self.current/100;
          }
          this.$emit('input', {
            expression: self.current
          });
        }
    }
}
</script>
