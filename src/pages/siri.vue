<template>
    <f7-page>
        <f7-navbar title="About" back-link="Back" sliding></f7-navbar>
        <f7-block>
            <!--
            <f7-button color="white" @click="toggle_audio"></f7-button>
            -->
            <div class="mic-zone" @click="toggle_audio">
                <h2 class="tlt">请问需要什么帮助？</h2>
                <icon name="microphone" scale=2 class="fa-inverse" ></icon>
            </div>
            <div id="siri-wave"></div>
        </f7-block>
    </f7-page>
</template>
<style>
.mic-zone{
    margin-top: 30px;
    color: #fff;
    text-align: center;
}
#siri-wave{
    position: absolute;
    bottom: 20px;
}
</style>
<script>
/*

Usage:
audioNode = createAudioMeter(audioContext,clipLevel,averaging,clipLag);

audioContext: the AudioContext you're using.
clipLevel: the level (0 to 1) that you would consider "clipping".
   Defaults to 0.98.
averaging: how "smoothed" you would like the meter to be over time.
   Should be between 0 and less than 1.  Defaults to 0.95.
clipLag: how long you would like the "clipping" indicator to show
   after clipping has occured, in milliseconds.  Defaults to 750ms.

Access the clipping through node.checkClipping(); use node.shutdown to get rid of it.
*/
// monkeypatch Web Audio
import SiriWave from 'siriwavejs';
import 'vue-awesome/icons/microphone';
import Icon from 'vue-awesome/components/Icon';
import $ from "jquery";
import 'lettering.js';
import louder_audio from '../assets/louder.mp3';
import understand_audio from '../assets/not_understand.mp3';

var audioContext = null;
window.AudioContext = window.AudioContext || window.webkitAudioContext;

// grab an audio context
audioContext = new AudioContext();
var meter = null;

export default{
    components:{
        Icon,
    },
    data: function(){
        return {
            isRecording: false,
            audioContext: null,
            processor: null,
            mediaStreamSource: null,
        }
    },
    mounted: function(){
        this.siri = new SiriWave({
            container: document.getElementById('siri-wave'),
            width: 400,
            height: 50,
            style: 'ios9',
            speed: 0.2,
        });
    },
    methods:{
        // Attempt to get audio input
        toggle_audio: function() {
            this.isRecording = !this.isRecording;
            if(this.isRecording){
                this.siri.start();
                this.siri.setAmplitude(1);
                navigator.getUserMedia = navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia;
                // ask for an audio input
                navigator.getUserMedia(
                {
                    "audio": {
                        "mandatory": {
                            "googEchoCancellation": "false",
                            "googAutoGainControl": "false",
                            "googNoiseSuppression": "false",
                            "googHighpassFilter": "false"
                        },
                        "optional": []
                    }, 
                }, gotStream, didntGetStream);
            }else{
                meter.shutdown();
                this.siri.setAmplitude(0);
                //this.siri.stop();
            }
        },
    },
}

function createAudioMeter(audioContext,clipLevel,averaging,clipLag) {
	var processor = audioContext.createScriptProcessor(512);
	processor.onaudioprocess = volumeAudioProcess;
	processor.clipping = false;
	processor.lastClip = 0;
	processor.volume = 0;
	processor.clipLevel = clipLevel || 0.98;
	processor.averaging = averaging || 0.95;
	processor.clipLag = clipLag || 750;

	// this will have no effect, since we don't copy the input to the output,
	// but works around a current Chrome bug.
	processor.connect(audioContext.destination);
    processor.volumeMax = 0;

	processor.checkClipping =
		function(){
			if (!this.clipping)
				return false;
			if ((this.lastClip + this.clipLag) < window.performance.now())
				this.clipping = false;
			return this.clipping;
		};

	processor.shutdown =
		function(){
            console.log(this.volumeMax);
            if(this.volumeMax < 0.05){
                $('.tlt').text("请大声点");
                let audio = new Audio(louder_audio);
                audio.play();
            }else{
                $('.tlt').text("我听不懂你说了什么");
                let audio = new Audio(understand_audio);
                audio.play();
            }
			this.disconnect();
			this.onaudioprocess = null;
		};

	return processor;
}

function volumeAudioProcess( event ) {
	var buf = event.inputBuffer.getChannelData(0);
    var bufLength = buf.length;
	var sum = 0;
    var x;

	// Do a root-mean-square on the samples: sum up the squares...
    for (var i=0; i<bufLength; i++) {
    	x = buf[i];
    	if (Math.abs(x)>=this.clipLevel) {
    		this.clipping = true;
    		this.lastClip = window.performance.now();
    	}
    	sum += x * x;
    }

    // ... then take the square root of the sum.
    var rms =  Math.sqrt(sum / bufLength);

    // Now smooth this out with the averaging factor applied
    // to the previous sample - take the max here because we
    // want "fast attack, slow release."
    this.volume = Math.max(rms, this.volume*this.averaging);
    this.volumeMax = this.volume > this.volumeMax ? this.volume : this.volumeMax;
}
var mediaStreamSource = null;
function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);

    // kick off the visual updating
}
function didntGetStream() {
    alert('Stream generation failed.');
}
</script>
