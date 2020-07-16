(function (root) {
    function Progress() {
        this.durTime = 0;//存储的总时间
        this.frameId = 0;//定时器
        this.startTime = 0;//开始播放的时间
        this.lastPercent = 0;//上一次播放的时间
        // this.isAuto = false;
        this.init();
    }

    Progress.prototype = {
        init() {
            // console.log('123')
            this.getDom();
        },
        getDom() {
          this.curTime = document.querySelector('.curTime');
          this.circle = document.querySelector('.circle');
          this.frontBg = document.querySelector('.frontBg');
          this.totalTime = document.querySelector('.totalTime');
        },
        renderAlltime (time){
            this.durTime = time;
            time = this.formatTime(time);
            this.totalTime.innerHTML = time;
        },
        formatTime(time) {
            time = Math.round(time);
            let m = Math.floor(time / 60);
            let s = time % 60;

            m  = m < 10 ? '0' + m : m;
            s = s < 10? '0' + s : s;
            return m + ':' + s;
        },
        //开始进度条
        move(per, isDrag) {
            let This = this;
            console.log(This)
            this.lastPercent = per === undefined ? this.lastPercent : per;
            this.startTime =  new Date().getTime();
            cancelAnimationFrame(this.frameId);
            function frame() {
                let curTime = new Date().getTime();//当前时间
                let per = This.lastPercent + (curTime - This.startTime) / (This.durTime * 1000);
                if(per <= 1){
                    This.update(per, isDrag)
                }else {
                    console.log('停止了')
                    cancelAnimationFrame(This.frameId)
                    player.musicPlay.isAuto();
                    // This.isAuto = true;
                }
                This.frameId  = requestAnimationFrame(frame);
            }
            frame()
        }, 
        //更新进度条
        update(per, isDrag) {
        //   console.log('开始播放')
         let time = this.formatTime(per * this.durTime)
         this.curTime.innerHTML = time;
         //更新进度条的位置
         this.frontBg.style.width = per * 100 + '%';
         //如果用户拖拽就要原点要走了
         if(isDrag) {
             return;
         }
         //更新原点的位置
         let  l = per * this.circle.parentNode.offsetWidth;
         this.circle.style.transform = 'translateX(' + l + 'px)';
        },
        //停止进度条
        stop() {
           cancelAnimationFrame(this.frameId)
           let stopTime = new Date().getTime();
           this.lastPercent += (stopTime - this.startTime) / (this.durTime * 1000);
           return this.lastPercent
        }
    }

    function instancesProgress() {
        return new Progress()
    }

    function Drag(obj) {
        this.obj = obj;
        this.stratPointX = 0;
        this.startleft = 0;
        this.percent = 0;
        this.init();
    }

    Drag.prototype = {
       init() {
           console.log("拖拽开始")
           let This = this;
           this.obj.style.transform = 'translateX(0)';
           //原点触碰的时候
           this.obj.addEventListener('touchstart', function(e) {
            //    console.log(e.changedTouches);
               This.stratPointX = e.changedTouches[0].pageX;
               This.startleft = parseFloat(this.style.transform.split('(')[1])
               //console.log(This.stratPointX);
               This.start && This.start();//对外暴露拖拽开始的方法，按下的时候要做的事情就交给用户去处理
           })
           //原点拖拽的时候
           this.obj.addEventListener('touchmove', function(e) {
            This.dispointX = e.changedTouches[0].pageX - This.stratPointX;
            //console.log(This.dispointX, This.startleft);
            let l = This.startleft + This.dispointX;
            if(l < 0) { 
                l = 0
            }else if(l > this.offsetParent.offsetWidth) {
                l = this.offsetParent.offsetWidth
            }

            this.style.transform = 'translateX(' + l + 'px)';
            This.parcent = l / this.offsetParent.offsetWidth;//拖拽的百分比
            This.move && This.move(This.parcent);//将百分比传入进去
        })

        //手指抬起的时候 
        this.obj.addEventListener('touchend', function(e) {
            This.end && This.end(This.parcent);
        })
       }
    }

    function instancesDrag(obj) {
        return new Drag(obj)
    }

    root.progress = {
        pro: instancesProgress,
        drag: instancesDrag,
    }
}(window.player || (window.player = {})))