function viewUpdate() {
    $.ajax({
        url: "js/data.json",
        type: "get",
        dataType: "json",
        async: "false",
        error: function () {
            console.log('실패')
        },
        success: function (data) { //데이터 성공적으로 요청되었을 때...

            var boxItemHtml =
                '<a href="#none" class="link_box">' +
                '<span class="thumb_img"></span>' +
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
                var serviceDese = data.project[i].service.desc;
                var serviceTit = data.project[i].service.tit;
                var serviceDate = data.project[i].service.date;
                var servicePara = data.project[i].service.para;
                var serviceWork = data.project[i].service.work.split("/").reverse();
                var serviceLinkList = Object.keys(data.project[i].service.link)
                var serviceLinkUrl = Object.values(data.project[i].service.link)
                imgUrl.attr('style', 'background-image:url(' + serviceImg + ')');
                titName.text(serviceName);
                subText.text(serviceDese);
                titProject.after('<dd>'+serviceTit+'</dd>');
                dateProject.after('<dd>'+serviceDate+'</dd>');
                descProject.after('<dd>'+servicePara+'</dd>');
                for (var i = 0; i < serviceWork.length; i++){
                    workProject.after('<dd>'+serviceWork[i]+'</dd>');
                };
                for (var i = 0; i < serviceLinkList.length; i++){
                    var linkUrl = '<a class="link_url" target="_blank" href="'+ serviceLinkUrl[i] +'">'+ serviceLinkList[i] +'</a>'
                    linkProject.append(linkUrl);
                }
            });
        }
    });
}
viewUpdate();

//마우스 휠 이벤트
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


//박스 배경 랜덤값
var $box = $('.box_comm');
$box.each(function(){
    var colorNum = Math.floor(Math.random() * 20);
    $(this).css('background','rgb('+colorNum+','+colorNum+','+colorNum+')');
});
//박스 클릭 모션
$(window).load(function(){
    var $itemBox = $('.link_box');
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
        var imgUrl = $(this).find('.thumb_img').attr('style');
        $layerBox.attr('style',imgUrl)

        var contLayer = $(this).next('.list_detail').clone();
        console.log(contLayer)
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




var didScroll;
var lastScrollTop = 0;
var delta = 5;

$(window).scroll(function(event){
    didScroll = true;
});

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);


function hasScrolled() {
    $contents.attr('class','')
    var st = $(this).scrollTop();
    if(Math.abs(lastScrollTop - st) <= delta)
        return;
    if (st > lastScrollTop){
    // Scroll Down
        $contents.addClass('page02');
        $('.box_wrap').addClass('on');
    } else {
    // Scroll Up
        $contents.addClass('page01');
        $('.box_wrap').removeClass('on');
    }
    lastScrollTop = st;

}

