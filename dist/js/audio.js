!function(i){function a(){this.audio=new Audio,this.status="pause"}a.prototype={load(i){this.audio.src=i,this.audio.load()},play(){this.audio.play(),this.status="play"},pause(){this.audio.pause(),this.status="pause"},playTo(i){this.audio.currentTime=i}},i.music=new a}(window.player||(window.player={}));