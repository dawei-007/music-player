 //渲染功能: 渲染图片， 音乐信息，是否喜欢
;(function(root) {
    //渲染图片
    function renderImg(src) {
        root.blurImg(src);//给body添加背景图片
        let img = document.querySelector('.songImg img');
        img.src = src;
    }
    //渲染音乐信息
    function renderInfo(data) {
        let songInfoChildren = document.querySelector('.songInfo').children;
        songInfoChildren[0].innerHTML = data.name;
        songInfoChildren[1].innerHTML = data.singer;
        songInfoChildren[2].innerHTML = data.album;
    }
    //是否喜欢
    function renderIslike(islike) {
        let lis = document.querySelectorAll('.control li')
        lis[0].className = islike ? 'liking' : '';
    }
    root.render = function(data) {
        renderImg(data.image);
        renderInfo(data);
        renderIslike(data.isLike);
    }
 })(window.player || (window.player = {}));  