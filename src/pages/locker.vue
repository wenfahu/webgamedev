<template>
  <f7-page>
    <f7-navbar title="Locker" back-link="Back" sliding></f7-navbar>
    <div id="slot">
        <span class="notes">
            <p>Slide to unlock</p>
        </span>
        <div id="arrow">
            <img :src="arrow" />
        </div>
    </div>
  </f7-page>
</template>

<style lang="stylus" scoped>
#slot
    background: rgba(192, 203, 219, 0.3)
    color: White
    position: fixed
    bottom: 40px
    left: 10%
    margin: 0 auto
    text-align: center
    width: 80%
    height: 30px
    .notes
       display: flex
       justify-content: center
       align-items: center
       height: 100%
    #arrow
        position: absolute
        left: 0
        top: 0
</style>

<script>
import arrow from '../assets/arrow.png'
export default {
    data: function(){
        return {
            arrow: arrow,
        }
    },
    mounted: function(){
        var active = false;
        var currentX;
        var currentY;
        var initialX;
        var initialY;
        var xOffset = 0;
        var yOffset = 0;
        var dragItem = document.querySelector("#arrow>img");
        var container = document.querySelector("#arrow");
        // var slot = document.querySelector('#slot');
        // var endX = slot.offsetWidth ;
        // var endY = slot.offsetHeight ;
        var endX = 210;
        var endY = 0;


        container.addEventListener("touchstart", dragStart, false);
        container.addEventListener("touchend", dragEnd, false);
        container.addEventListener("touchmove", drag, false);
        function dragStart(e) {
            if (e.type === "touchstart") {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }

            if (e.target === dragItem) {
                active = true;
            }
        } 

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            active = false;
        }

        var that = this;
        function drag(e) {
            if (active) { 
                e.preventDefault(); 
                if (e.type === "touchmove") {
                    currentX = e.touches[0].clientX - initialX;
                    currentY = e.touches[0].clientY - initialY;
                } else {
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                }

                xOffset = currentX;
                yOffset = currentY;
                if (Math.abs(currentX - endX) < 5 && Math.abs(currentY - endY) <  1){
                    that.$router.back();

                }
                setTranslate(currentX, currentY, dragItem);
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
        }
    },
}
</script>
