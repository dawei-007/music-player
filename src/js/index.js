// console.log(window)
(function($, player){
   function MusicPlayer(dom) {
       this.wrap = dom;//播放器的容器(用于加载listControl模块)
       this.dataList = []; //存储数据
    //    this.now = 0;//初始索引
       this.indexObj = null;//索引值对象(用于切割)
       this.rotateTimer = null;	//旋转唱片的定时器
       this.curIndex = 0;//当前播放的索引值
       this.list = null;//在列表切歌测试
       this.progress = player.progress.pro();
       this.curtime = null;//暂停播放后的进度时间
    }

   MusicPlayer.prototype = {
       init() {
           //初始化
           this.getDom();
           this.getData('../mock/data.json');//请求数据
       },

       getDom() {
           //获取页面里的元素
           this.record = document.querySelector('.songImg img');//旋转图片
           this.controlBtns = document.querySelectorAll('.control li');//底部导航的按钮
       },
 
       getData(url) {
           let This = this;
           $.ajax({
               url: url,
               method: 'get',
               success: function(data) {
                   This.dataList = data;//请求数据
                   This.listPlay();	//列表切歌，它要放在loadMusic的前面，因为this.list对象是在这个方法里声明的，要在loadMusic里使用
                   This.indexObj = new player.controlIndex(data.length);//给索引对象辅助
                   This.loadMusic(This.indexObj.index)//加载音乐
                   This.musicControl();//控制音乐操作
                   This.dragProgress();//控制拖拽
                   console.log(data)
               },
               error: function() {
                   console.log('请求数据失败')
               }
           })
       },
       loadMusic(index) {
           //加载音乐
           player.render(this.dataList[index])//渲染图片歌曲等信息
           player.music.load(this.dataList[index].audioSrc);
        //    console.log(player.progress)
           this.progress.renderAlltime(this.dataList[index].duration)
           if(player.music.status == 'play'){
              player.music.play();
              console.log(this)
              this.controlBtns[2].className = 'playing'; 

              this.progress.move(0);
           }
           //改变列表里的状态
           this.list.changeSelect(index);

           this.curIndex = index;//当前歌曲索引
       },
       musicControl() {	//控制音乐（上一首、下一首。。。）
        let This = this;
        //上一首
        this.controlBtns[1].addEventListener('touchend', function () {
            player.music.status = 'play';
            This.imgRotate(0)
            //This.now--;
            // This.loadMusic(--This.now);
            This.loadMusic(This.indexObj.prev());
        });

        //播放、暂停
        this.controlBtns[2].addEventListener('touchend', function () {
            if (player.music.status == 'play') {	//歌曲的状态为播放，点击后要暂停
                player.music.pause();	//歌曲暂停
                this.className = '';	//按钮变成暂停状态
                This.imgStop();			//停止旋转图片

                This.curtime = This.progress.stop() * This.dataList[This.indexObj.index].duration;//停止播放进度

            } else {//歌曲的状态为暂停，点击后要播放
                player.music.play();	//歌曲播放
                this.className = 'playing';	//按钮变成播放状态

                //第二次播放的时候需要加上上一次旋转的角度。但是第一次的时候这个角度是没有的，取不到。所以做了一个容错处理
                let deg=This.record.dataset.rotate || 0;
                This.imgRotate(deg);	//旋转图片
                console.log(This.curtime)
                This.progress.move(This.curtime / This.dataList[This.indexObj.index].duration , false);//开始播放进度
            }
        });


        //下一首
        this.controlBtns[3].addEventListener('touchend', function () {
            player.music.status = 'play';
            This.imgRotate(0)
            //This.now--;
            // This.loadMusic(++This.now);
            This.loadMusic(This.indexObj.next());
        });
    },
    imgRotate(deg) {	//旋转唱片
        let This = this;

        clearInterval(this.rotateTimer);

        this.rotateTimer = setInterval(function () {
            deg = +deg + 0.2;	//前面的加号是把字符串转数字

            This.record.style.transform = 'rotate(' + deg + 'deg)';
            This.record.dataset.rotate=deg;	//把旋转的角度存到标签身上，为了暂停后继续播放能取到
        }, 1000 / 60);
    },
    imgStop(){	//停止图片旋转
        clearInterval(this.rotateTimer);
    },
    listPlay() {
        let This=this;

        this.list = player.listControl(this.dataList, this.wrap);
       
        //列表按钮添加点击事件
		this.controlBtns[4].addEventListener('touchend',function(){
				This.list.slideUp();	//让列表显示出来
            });
        //歌曲列表添加事件 
        this.list.musicList.forEach((item, index) => {
          item.addEventListener('touchend', function() {
            if(This.curIndex == index) {
                return
            }
            player.music.status = 'play';
            This.indexObj.index = index; //索引对象的索引值
            This.loadMusic(index);
            This.imgRotate(0)
            This.list.slideDown();
          })
          
        })

    },
    dragProgress() {
        let This = this;
        let circle = player.progress.drag(document.querySelector('.circle'));//获取拖拽实例
        circle.start = function() {
            This.progress.stop();
        }

        circle.move = function(per) {
            This.progress.update(per, true)
        }

        circle.end = function (per) {
            This.curtime = per * This.dataList[This.indexObj.index].duration;
            console.log(This.curtime)
            player.music.playTo(This.curtime);
            if( player.music.status !== 'play'){
               return;
            }
            player.music.play();
            This.progress.move(per, false)
        }
    },
    isAuto() {
       if(player.music.audio.ended) {
        player.music.status = 'play';
        player.musicPlay.imgRotate(0)
        player.musicPlay.loadMusic(player.musicPlay.indexObj.next());
       }
    }
}

   let musicPlay = new MusicPlayer(document.getElementById('wrap'));
   player.musicPlay = musicPlay;
   musicPlay.init();
})(window.Zepto, window.player);