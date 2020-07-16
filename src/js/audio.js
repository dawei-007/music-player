(function (root) {
  function AudioMange() {
      this.audio = new Audio()//创建一个audio实例
      this.status = 'pause';//歌曲的默认状态为暂停 
  }
  AudioMange.prototype = {
      //加载音乐
      load(src) {
        this.audio.src = src;//设置音乐的路径
        this.audio.load();//加载音乐
      },
      //播放音乐
      play() {
          this.audio.play();
          this.status = 'play';
      },
      //暂停音乐
      pause() {
         this.audio.pause();
         this.status = 'pause';
      },
      //跳到音乐的某个时间点
      playTo(time){
          this.audio.currentTime = time;//单位为秒
      }
  }

  root.music = new AudioMange();//把实例对象暴露出去 
})(window.player || (window.player = {}));