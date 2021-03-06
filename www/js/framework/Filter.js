/**
 * Created by 11150221040138 on 2016/4/25.
 */
APP.filter('ImageFilter', ['$rootScope',function ($rootScope) {
  return function (value) {
    if (!value) {
      return $rootScope.imgBaseURL+'img/ic_haier_2.png';
    } else {
      return value;
    }
  }
}]).filter('ImageUserFilter', ['$rootScope',function ($rootScope) {
  return function (value) {
    if (!value) {
      return $rootScope.imgBaseURL+'img/quanzi/user.jpg';
    } else {
      return value;
    }
  }
}]).filter('ImageTopicFilter', ['$rootScope',function ($rootScope) {
  return function (value) {
    if (!value) {
      return $rootScope.imgBaseURL+'img/quanzi/quanzi.png';
    } else {
      return value;
    }
  }
}]).filter('scoleFilter', ['$rootScope',function ($rootScope) {
  return function (value) {
    if (!value) {
      return $rootScope.imgBaseURL+'img/circleIcon/scoleimg.png';
    } else {
      return value;
    }
  }
}]).filter('bgImgFilter', ['$rootScope',function ($rootScope) {
  return function (value) {
    if (!value) {
      return $rootScope.imgBaseURL+'img/circleIcon/bgImg.png';
    } else {
      return value;
    }
  }
}]).filter('Num4Filter', [function () {
  return function (value) {
    if (parseInt(value) > 9999) {
      value = '9999+'
    }
    return value;
  }
}])
  .filter('Num2Filter', [function () {
    return function (value) {
      if (parseInt(value) > 99) {
        value = '99+';
      } else if (parseInt(value) == 0 || parseInt(value) == -1) {
        value = 0;
      }
      return value;
    }
  }])
  .filter('BigNumFilter', [function () {
    return function (value) {
      if (parseInt(value) > 99999) {
        value = '10万+';
      } else if (parseInt(value) == 0 || parseInt(value) == -1) {
        value = 0;
      }
      return value;
    }
  }])
  .filter("bluetext", function ($sce, $log) {

    var fn = function (text, search) {
      if (!search) {
        return $sce.trustAsHtml(text);
      }
      //text = encodeURI(text);
      //search = encodeURI(search);
      var regex = new RegExp(search, 'gi');
      var result = text.replace(regex, '<span style="color: #0076fd">$&</span>');
      //result = decodeURI(result);
      return $sce.trustAsHtml(result);
    };
    return fn;
  }).filter('cutTwoFilter', [function () {
  return function (value) {
    if (typeof(number) == 'number') {
      value = value.toFixed(2);
      value = parseFloat(value);
    }
    return value;
  }
}])
  //格式化 数字 如：200000 ---> 200,000
  .filter('formatNumber',function(){
    return function(value){
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  })
    //图片裁剪
  .filter('addImgURLPostfix', [function () {
    return function (value, width, height) {
      var pattern = /cdn[23][0-9].ehaier.com/;
      if(pattern.test(value)){
        value = value+'@'+width+'_'+height;
      }
      return value;
    }
  }])
  //截取数字整数部分 如：200.12 ---> 200
  .filter('keepInt',function(){
    return function(value){
      if(value){
        var pointIndex = value.toFixed(2).toString().indexOf('.');
        return value.toFixed(2).toString().slice(0,pointIndex);
      }else{
        return 0;
      }
    }
  })
  //截取数字小数部分带小数点 如：200.12 ---> .12
  .filter('keepFloat',function(){
    return function(value){
      if(value){
        var pointIndex = value.toFixed(2).toString().indexOf('.');
        return value.toFixed(2).toString().slice(pointIndex);
      }else{
        return ".00"
      }
    }
  })
  //手机号码4-7位加****显示 13800138000 ---->138****8000
  .filter('encryptPhone',function(){
    return function(value){
      if(value.length == 11){
         return value.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
      }else{
        return value;
      }
    }
  })
  //积分类型变成字
  .filter('totext', [function () {
  return function (value) {
    if (value=='1') {
      return '收入'
    } else {
      return '支出';
    }
  }
}]).filter('chinaDate',function(){
  return function(value){
      return value.substring(4,6)+'月'+value.substring(6,8)+'日';
  }
})
 //用户带* 
 .filter('FilterRealName',function(){
	 return function(value){
		if(value.length >= 2){
			var n=value.length; 
			var str='';
			for(var i=0;i<n-1; i++){
				str+='*';
			}
			return value = str+value.substring(n-1,n);
		}else{
			return value;
		}
	}
 })
 .filter('flashsaleDenum',function(){
  return function(value){
    if(value.substring(0,1)==0){
        return value=value.substring(1,5);
    }
    else{
      return value;
    }
  }
 })
 //去掉数字前的0
 .filter('delLing',function(){
  return function(value){
    if(value.substring(5,6)=='0'){
      return value=value.substring(6).replace('/','月')+'日';
    }else{
      return value=value.substring(5).replace('/','月')+'日';;
    }
  }
 })
    .filter('collectsFilter', [function () {
        return function (value) {

            if(value < 10000){
                return value;
            }
            if ((value%100) > 0 && (value%100) < 50) {
                value = (value/10000).toFixed(2) + 0.01;
            } else {
                value = (value/10000).toFixed(2);
            }
            return value;
        }
    }])
  //2018年01月01日转2018/01/01
  .filter('datachange',function(){
      return function (value){
          value = value.replace('年','/').replace('月','/').replace('日','');
          return value;
      }
  })
  //奖励类型转文字
  .filter('rewardToword',function(){
      return function (value){
          if(value=='YC'){
            value = '育成奖励'
          }
          if(value=='BC'){
            value = '补差奖励'
          }
          if(value=='ST'){
            value = '生态奖励'
          }
          if(value=='JY'){
            value = '经营奖励'
          }
          if(value=='FWB'){
            value = '服务兵奖励'
          }
          if(value=='PT'){
            value = '平台奖励'
          }
          if(value=='PX'){
            value = '培训奖励'
          }
          return value;
      }
  })
  // 定义高亮 filter
  .filter("highlight", function ($sce, $log) {

    var fn = function (text, search) {
      $log.info("text: " + text);
      $log.info("search: " + search);

      if (!search) {
        return $sce.trustAsHtml(text);
      }
      text = encodeURI(text);
      search = encodeURI(search);

      var regex = new RegExp(search, 'gi')
      var result = text.replace(regex, '<span style="color:#2979FF">$&</span>');
      result = decodeURI(result);
      $log.info("result: " + result);
      return $sce.trustAsHtml(result);
    };

    return fn;
  })
  //url白名单
  .filter('whiteUrl',['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}])
;
