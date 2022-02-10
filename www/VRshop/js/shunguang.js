//顺逛api
var fakeData0 = {
	  "message": "谢谢参与",
	  "data": {
	    "redPacketAmount": "",
	    "image": "",
	    "couponId": "",
	    "prizeType": 3,
	    "prizeName": "谢谢参与"
	  },
	  "success": true
}

/*var fakeData1 = {
  "message": "领取优惠券",
  "success": true,
  "data": {
    "redPacketAmount": "",
    "image": "",
    "couponId": 1008,
    "prizeType": 2,
    "prizeName": "优惠券10元"
  }
}*/

var test_url = "http://mobiletest.ehaier.com:20306/v3/mstore/sg/game/lottery.html";
var prd_url = "http://m.ehaier.com/v3/mstore/sg/game/lottery.html";
var url =  prd_url;//TODO:更新为生产服务器
var gameId = "b0bb1dbe3b2d1afa";

function updateUI(json){
	var prizeType = json.data.prizeType;
	var redPacketAmount = json.data.redPacketAmount;
	var prizeName = json.data.prizeName;
  document.getElementById("lottery-msg").innerHTML = rules_msg;
    $("#hongbao-container").css('display', "block");
    $('#hongbao-instruction').html("");
  if(json.success){
     if(prizeType == 2){//优惠券
        console.log("优惠券顺逛");
        $('#one-hongbao-container').css('display', 'block');
        $('#hongbao-message').html(json.data.prizeName);
        $('#hongbao-instruction').html(coupon_instruction);
        $('#cash-ticket').attr('src', 'image/control/hongbao_ticket.png');
      } else if (prizeType == 4){//红包
      	console.log("获得红包奖励顺逛");
        $('#one-hongbao-container').css('display', 'block');
        $('#hongbao-message').html(json.data.prizeName);
        $('#hongbao-instruction').html(cash_instruction);
        $('#cash-ticket').attr('src', 'image/control/cash_ticket.png');
      } else{ //谢谢惠顾
        console.log("谢谢惠顾顺逛");
        $('#hongbao-no-prize').css('display', 'block');
        $('#hongbao-no-prize-message').html('谢谢参与');
      } 
     }
  else{
    if(json.message.includes("登陆")){
      $('#hongbao-no-prize-login').css('display', 'block');
      $('#hongbao-no-prize-login-message').html(json.message);
    }else{
      $('#hongbao-no-prize').css('display', 'block');
      $('#hongbao-no-prize-message').html(json.message);
    }
    
  }
	
  
    $('#loading-ui-wrapper').css('display', 'none');
}

function startLottery(){
	$.post( url, { gameId : gameId } ).done(function( data ) {
		updateUI(data);
	  }).fail(function() {
	  	updateUI(fakeData0);
	  })
  
  //updateUI(fakeData1);
  
    $('#loading-ui-wrapper').css('display', 'block');

}

var rules_msg = "1、请在游戏开始前注册并绑定手机号。若参与用户未绑定手机号,则无法领取奖品。" + "<br>" 
+ "2、活动期间,同一用户在一天内可有1次抽奖机会。(同一用户,是指账户、收货人姓名、详细地址、联系方式、IP地址等与用户身份相关的信息,其中任意一项或数项存在相同、相似、通过特定标记形成批量信息、或其他非真实有效等情形的,均将被认定为同一用户,按活动规则中的同一用户处理)。" + "<br>" 
+ "3、活动期间,若用户抽中现金红包, 请关注海尔商城官方微信账号，根据微信红包推送提示,进行手机号验证后领取现金红包，中奖金额将直接存入中奖用户微信零钱账户中。若用户抽中代金券红包,可到“我的账户”—“我的优惠券”中查看。" + "<br>" 
+ "4、 红包领取时间为6月30日之前,过期不领自动作废（活动结束后可在微信公众账号中找到活动领取菜单）。" + "<br>" 
+ "5、 现金红包以微信红包形式直接发到微信零钱,可抵现金使用；代金券红包可在购物消费时享受相应折扣,不能提现。代金券红包以代金券中显示金额为准,不能拆分使用。<br>";