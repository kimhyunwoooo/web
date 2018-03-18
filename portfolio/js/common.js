imagesProgress();
/* 로딩 스크립트 함수 */
function imagesProgress() {
    var $container = $('#progress'),
        $progressBar = $container.find('.progress-bar'),
        $progressText = $container.find('.progress-text'),
        imgLoad = imagesLoaded('body'),
        imgTotal = imgLoad.images.length,
        imgLoaded = 0,
        current = 0,
        progressTimer = setInterval(updateProgress, 1000 / 60);
    imgLoad.on('progress', function () {
        imgLoaded++;
    });
    function updateProgress() {
        var target = (imgLoaded / imgTotal) * 100;
        current += (target - current) * 0.1;
        $progressBar.css({width: current + '%'});
        $progressText.text(Math.floor(current) + '%');
        if (current >= 100) {
            clearInterval(progressTimer);
            $container.addClass('progress-complete');
            $progressBar.add($progressText).delay(500).animate({opacity: 0}, 250, function () {
                $container.animate({top: '-100%'}, 600);
            });

        };
        if (current > 99.9) {
            current = 100;
            wheelEvent();
            $('.tit_copy').addClass('active');
        };
    };
};

function viewUpdate() {
    $.ajax({
        url: "js/data.json",
        type: "get",
        dataType: "json",
        async: "false",
        error: function () {
            console.log('실패')
        },
        success: function (data) {

            var boxItemHtml =
                '<a href="#none" class="link_box">' +
                '<span class="thumb_img" data-url=""></span>' +
                '<strong class="tit_service"></strong>' +
                '<p class="txt_service"></p>' +
                '</a>' +
                '<dl class="list_detail">' +
                '<dt class="tit_project">Project.</dt>' +
                '<dt class="date_project">Date.</dt>' +
                '<dt class="desc_project">Description.</dt>' +
                '<dt class="work_project">work.</dt>' +
                '<dt class="link_project">link.</dt>' +
                '<dd class="link_item"></dd>' +
                '</dl>';
            var projectItem = Object.keys(data.project);
            var projectItemLength = projectItem.length;
            var $boxSort = $('.box_wrap .box_comm');
            console.log(projectItem)

            //랜덤 인덱스 추출
            var randomArray = [];
            for (var i = 1; i < $boxSort.length; i++) {
                randomArray.push(i);
            }
            randomArray.sort(function () {
                return Math.random() - 0.5
            });
            var randomIndex = randomArray.slice(0, projectItemLength);
            console.log(randomIndex)
            //랜덤하게 박스 추가
            for (var i = 0; i < projectItemLength; i++) {
                var tempIndex = randomIndex[i];
                $boxSort.eq(tempIndex).html(boxItemHtml).attr('value', i);
            }
            ;
            //랜덤박스에 데이터 추가
            var $boxTarget = $('.box_wrap .box_comm[value]');
            $boxTarget.each(function (i) {
                var imgUrl = $(this).find('.thumb_img');
                var titName = $(this).find('.tit_service');
                var subText = $(this).find('.txt_service');
                var titProject = $(this).find('.tit_project');
                var dateProject = $(this).find('.date_project');
                var descProject = $(this).find('.desc_project');
                var workProject = $(this).find('.work_project');
                var linkProject = $(this).find('.link_item');
                var serviceImg = data.project[i].service.img;
                var serviceName = data.project[i].service.name;
                var serviceDesc = data.project[i].service.desc;
                var serviceTit = data.project[i].service.tit;
                var serviceDate = data.project[i].service.date;
                var servicePara = data.project[i].service.para;
                var serviceWork = data.project[i].service.work.split("/").reverse();
                var servicelinkObj = data.project[i].service.link;
                for (key in servicelinkObj) {
                    var linkUrl = '<a class="link_url" target="_blank" href="'+ servicelinkObj[key] +'">'+ key +'</a>'
                    linkProject.append(linkUrl);
                }
                imgUrl.attr('style', 'background-image:url(' + serviceImg + ')').attr( "data-url",serviceImg);
                titName.text(serviceName);
                subText.text(serviceDesc);
                titProject.after('<dd>'+serviceTit+'</dd>');
                dateProject.after('<dd>'+serviceDate+'</dd>');
                descProject.after('<dd>'+servicePara+'</dd>');
                for (var i = 0; i < serviceWork.length; i++){
                    workProject.after('<dd>'+serviceWork[i]+'</dd>');
                };
            });

            //레이어 연동
            console.log('wheel')
            var $itemBox = $('.link_box');
            var $layerImg = $('.thumb_layer');
            var $layerDimmed = $('.dimmed_layer');
            var $layerBox = $('.layer_comm');
            var $layerClose = $('.layer_comm .link_close');
            var $layerCont = $('.vertical_box');
            //레이어 함수
            function layerClose(){
                $itemBox.removeClass('active');
                $layerDimmed.removeClass('show');
                $layerBox.removeClass('show');
            }
            function layerOpen(){
                $layerDimmed.addClass('show');
                $layerBox.addClass('show');
            }
            $itemBox.click(function(){
                $layerCont.children().remove();
                var imgUrl = $(this).find('.thumb_img').attr('data-url')
                $layerImg.attr('src',imgUrl)

                var contLayer = $(this).next('.list_detail').clone();
                $layerCont.append(contLayer)
                $(this).addClass('active');
                layerOpen();
            });
            $layerClose.click(function(){
                layerClose();
            });
            $layerDimmed.click(function(){
                layerClose();
            });
        }
    });
}
viewUpdate();


//마우스 휠 이벤트
function wheelEvent(){
    var $contents = $('#contents');
    $contents.addClass('page01');
    $(window).bind('mousewheel', function(event) {
        $contents.attr('class','')
        if (event.originalEvent.wheelDelta >= 0) {
            console.log('Scroll up');
            $contents.addClass('page01');
            $('.box_wrap').removeClass('on');
        }
        else {
            console.log('Scroll down');
            $contents.addClass('page02');
            $('.box_wrap').addClass('on');
        }
    });
    //모바일 터치 이벤트
    $(window).bind('touchstart', touchstart);
    function touchstart(event) {
        var touches = event.originalEvent.touches;
        if (touches && touches.length) {
            startY = touches[0].pageY;
            $(window).bind('touchmove', touchmove);
        }
    }
    function touchmove(event) {
        var touches = event.originalEvent.touches;
        if (touches && touches.length) {
            var deltaY = startY - touches[0].pageY;

            if (deltaY >= 50) {
                console.log("swipeUp");
                $contents.attr('class','').addClass('page02')
                $('.box_wrap').addClass('on');
            }
            if (deltaY <= -50) {
                console.log("swipeDown");
                $contents.attr('class','').addClass('page01')
                $('.box_wrap').removeClass('on');
            }
            if (Math.abs(deltaY) >= 50) {
                $(window).unbind('touchmove', touchmove);
            }
        }
    }
};

//박스 배경 랜덤값
var $box = $('.box_comm');
$box.each(function(){
    var colorNum = Math.floor(Math.random() * 20);
    $(this).css('background','rgb('+colorNum+','+colorNum+','+colorNum+')');
});
//박스 클릭 모션
$(window).load(function(){


})
//텍스트 효과
var $textTarget = $('.txt_motion');
var $AddText = $textTarget.text();
var t = 0;
$textTarget.text('');
setInterval (function () {
    $textTarget.append($AddText.charAt(t));
    t++;
    if(t > $AddText.length+15){
        $textTarget.text('');
        t = 0;
    };
},70);
