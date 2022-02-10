var slideIndex = 0;
var currentRoomTag = "#livingroom";
var cdn_url = "http://cdn09.ehaier.com/shunguang/VRshop/";

var coupon_instruction = "优惠券请到“我的优惠券”查看领取并在有效期内使用；";
var cash_instruction = "现金红包请点领取按钮并按步骤到公众号领取；";

//点击红包后，隐藏商品信息UI，显示红包UI
function hideProductUI(){
 	$("#details").css("display", "none");
}

function showProductUI(){
	$("#details").css("display", "block");
  $('.imageBlock').slick('setPosition');
  $('.imageBlock').slick('slickNext');
}


function cancelClick(){
  while(slideIndex >= 0){
    console.log("loop");
    $('.imageBlock').slick('slickRemove', slideIndex-1);
    slideIndex--;
  }
  
  $("#my-div").css("display","none");
  $("#details").css("display","none");
  
  // document.querySelector('#image-360').setAttribute('src', currentRoomTag);
  // overlay.remove();
  $('#back-to-origin').css('display', 'block');
  
  
  
  var krpano = document.getElementById("krpanoSWFObject");
  krpano.call("plugin[pp].action_disable_blur()");
  
  
}


$(document).ready(function(){
  $('.imageBlock').slick({
    dots: true,
    arrows : false,
  });
});

$("#pics").change(function(){
	//console.log(this.val());
});

function hongbaoClick(){
  hideProductUI();
  startLottery();
  
  $('.hongbao-open-animation').css('display', 'block')
  // create a reference to our element
  var element = document.querySelector('#hongbao-open-animation');
  // create our Motio sprite
  var sprite = new Motio(element, {fps: 26, frames: 26});
  // start animation
  sprite.play();
  sprite.on('frame', function(eventName){
    if(this.frame == 25){
      sprite.pause();
    }
  });
}


function noPrizeClick(){
  $("#no-prize").css("display", "none");
}

function noPrizeCancelClick(){
  $('#hongbao-no-prize').css('display', 'none');
  showProductUI();
}


function noPrizeLoginCancelClick(){
    $('#hongbao-no-prize-login').css('display', 'none');
  showProductUI();
}

function noPrizeLoginButtonClick(){
  window.location.href = 'http://m.ehaier.com/www/index.html#/guidePage/';
}


//关闭抽奖信息UI后，重新显示商品信息
function lotteryCancelClick(){
    $("#lottery-details").css("display","none");
  showProductUI();
}


function show(id,featureshort,tag,type,feature,moreurl,buyurl){
	$(".id span").eq(0).html(id);
	$(".featureshort").eq(0).html(featureshort);
	$(".tag ").eq(0).html(tag);
	$(".type span").eq(0).html(type);
	$(".feature").eq(0).html(feature);
	$(".more").attr("href",moreurl);
	$(".buy").attr("href",buyurl);
}

// var now = new Date().getTime().toString();
// var data = "67" + "13" + now;
// console.log("time " + now);
// console.log("md5 " + $.md5(data));

function showLotteryRules(){
  $("#lottery-details").css("display", "block");
  //$("#cash-prize").css("display", "none");
  //$("#coupon-prize").css("display", "none");
  $('#hongbao-container').css('display', 'none');
  $('#one-hongbao-container').css('display', 'none');
  $('#two-hongbao-container').css('display', 'none');
  $('#loading-ui-wrapper').css('display', 'none');
}

// Listen for orientation changes
window.addEventListener("orientationchange", function() {
  // Announce the new orientation number
  $('.imageBlock').slick('setPosition');
  $('.imageBlock').slick('slickNext');
}, false);

/*function backButtonClick(){
    console.log("put back to url here");
    window.location.href = 'http://www.baidu.com';
}*/

function test(data){
  alert(data);
}