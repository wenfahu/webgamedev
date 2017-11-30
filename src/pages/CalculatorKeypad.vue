<template>
      <f7-grid no-gutter class="keypad">

          <f7-col class="gray" width="25">
              <div @click="press">{{keys[0]}}</div>
          </f7-col>
          <f7-col class="gray" width="25">
              <div @click="press">{{keys[1]}}</div>
          </f7-col>
          <f7-col class="gray" width="25">
              <div @click="press">{{keys[2]}}</div>
          </f7-col>
          <f7-col class="orange" width="25">
              <div @click="press">{{keys[3]}}</div>
          </f7-col>
          <f7-col class="gray" width="25">
              <div @click="press">{{keys[4]}}</div>
          </f7-col>
          <f7-col class="gray" width="25">
              <div @click="press">{{keys[5]}}</div>
          </f7-col>
          <f7-col class="gray" width="25">
              <div @click="press">{{keys[6]}}</div>
          </f7-col>
          <f7-col class="orange" width="25">
              <div @click="press">{{keys[7]}}</div>
          </f7-col>
          <f7-col class="gray" width="25">
              <div @click="press">{{keys[8]}}</div>
          </f7-col>
          <f7-col class="gray" width="25">
              <div @click="press">{{keys[9]}}</div>
          </f7-col>
          <f7-col class="gray" width="25">
              <div @click="press">{{keys[10]}}</div>
          </f7-col>
          <f7-col class="orange" width="25">
              <div @click="press">{{keys[11]}}</div>
          </f7-col>
          <f7-col class="gray" width="25">
              <div @click="press">{{keys[12]}}</div>
          </f7-col>
          <f7-col class="gray" width="25">
              <div @click="press">{{keys[13]}}</div>
          </f7-col>
          <f7-col class="gray" width="25">
              <div @click="press">{{keys[14]}}</div>
          </f7-col>
          <f7-col class="orange" width="25">
              <div @click="press">{{keys[15]}}</div>
          </f7-col>

          <f7-col class="gray" width="50">
              <div @click="press">{{keys[16]}}</div>
          </f7-col>
          <f7-col class="gray" width="25">
              <div @click="press">{{keys[17]}}</div>
          </f7-col>
          <f7-col class="orange" width="25">
              <div @click="press"{{keys[18]}}=</div>
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
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export default{
    data: function(){
        return {
            keys:[ 'C', '±', '%', '/', '7', '8', '9',
                'x', '4', '5', '6', '-', '1', '2', '3',
                '+', '0', '.', '=']
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
          this.keys = shuffle(this.keys);
          this.$forceUpdate();
        }
    }
}
</script>
