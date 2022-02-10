APP.controller('criticalSuccessController', ['$scope', '$stateParams', '$timeout', 'PlatformService', '$ionicLoading', 'PopupService', '$state', '$ionicHistory', '$rootScope', 'UrlService', 'CreditService', 'criticalSuccessService',
  function($scope, $stateParams, $timeout, PlatformService, $ionicLoading, PopupService, $state, $ionicHistory, $rootScope, UrlService, CreditService, criticalSuccessService) {
    function Base64() {  
      _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      this.encode = function(input) {  
        var output = "";  
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;  
        var i = 0;  
        input = _utf8_encode(input);  
        while (i < input.length) {   
          chr1 = input.charCodeAt(i++);   
          chr2 = input.charCodeAt(i++);   
          chr3 = input.charCodeAt(i++);   
          enc1 = chr1 >> 2;   
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);   
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);   
          enc4 = chr3 & 63;   
          if (isNaN(chr2)) {    
            enc3 = enc4 = 64;   
          } else if (isNaN(chr3)) {    
            enc4 = 64;   
          }   
          output = output +    _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +    _keyStr.charAt(enc3) + _keyStr.charAt(enc4);  
        }  
        return output; 
      }
      _utf8_encode = function(string) {  
            string = string.replace(/\r\n/g, "\n");  
            var utftext = "";  
            for (var n = 0; n < string.length; n++) {   
                var c = string.charCodeAt(n);   
                if (c < 128) {    
                    utftext += String.fromCharCode(c);   
                } else if ((c > 127) && (c < 2048)) {    
                    utftext += String.fromCharCode((c >> 6) | 192);    
                    utftext += String.fromCharCode((c & 63) | 128);   
                } else {    
                    utftext += String.fromCharCode((c >> 12) | 224);    
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);    
                    utftext += String.fromCharCode((c & 63) | 128);   
                }  
            }  
            return utftext; 
        }
    }
    var baseEncode = new Base64();
    $scope.thisTitleName = '评价成功';
    $scope.goBack = function() {
      if($ionicHistory.viewHistory().backView.stateName == 'lookAssess'){
        $ionicHistory.goBack(-1);
      }else{
        $ionicHistory.goBack(-2);
      }
    }
    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) { //只有ios app 特有的样式
      $scope.paddingtopClass = {
        "margin-top": "16px"
      };
      $scope.paddingtopClasscontent = {
        "top": "60px"
      }
    } else {
      $scope.paddingtopClass = {
        "margin-top": "0px"
      };
      $scope.paddingtopClasscontent = {
        "top": "44px"
      }
    }
    var wdOrderSnBase;

    //复制
    $scope.copeText = function(text) {
      if (window.cordova) {
        cordova.plugins.clipboard.copy(text);
        PopupService.showToastShort('复制成功');
      } else {
        PopupService.showToast('请下载APP执行此操作');
      }
    };

    $scope.shareToPlatform = function(index) {
      wdOrderSnBase = encodeURIComponent(baseEncode.encode($scope.wdOrderSn));
      var title = '邀请评价'; //分享标题
      var content = $scope.isCriticalShop.productName; //分享内容
      var pic = $scope.isCriticalShop.productImg; //分享图片，写绝对路径
      var url = UrlService.getShareLinkHeader() + 'useExperience/' + wdOrderSnBase; //分享链接，绝对路径
      if (window.umeng) {
        if (index == 0) {
          window.umeng.shareToWechatSession(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
        } else if (index == 1) {
          window.umeng.shareToQQ(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
        }
        if (index == 2) {
          $scope.copeText(url);
        } else {
          CreditService.successShare();
        }
      } else {
        alert('只能在app分享');
      }
    };
    /*********************分享标签－whiteBird end*********************/

    $scope.criticalInit = function() {
      criticalSuccessService.criticalNo($scope.wdOrderSn)
        .success(function(response) {
          if(response.success){
            $scope.noCriticalOrderList = response.data.waitComments;
            $scope.isCriticalShop = response.data.productInfo;
            $scope.isMeOrder = response.data.isMyOrder;
            $scope.isStore = response.data.isStoreMember;
          }else{
            PopupService.showToastShort(response.message);
          }
        });
    };

    $scope.$on('$ionicView.beforeEnter', function() {
      $scope.thisTitleName = '评价成功';
      if($ionicHistory.viewHistory().backView.stateName == 'lookAssess'){
        $scope.thisTitleName = '邀请评价';
      }
      //网单号
      $scope.wdOrderSn = $stateParams.cOrderSn;
      $scope.shareList = [{
        "img": $rootScope.imgBaseURL+"img/mm-wechat.png",
        "text": "微信"
      }, {
        "img": $rootScope.imgBaseURL+"img/qq.png",
        "text": "QQ"
      }, {
        "img": $rootScope.imgBaseURL+"img/btn_link.png",
        "text": "复制链接"
      }];
      $scope.criticalInit();
    });
  }
]);

APP.service('criticalSuccessService', ['$http', 'UrlService', function($http, UrlService) {
  //待评价的商品
  this.criticalNo = function(cOrderSn) {
    var params = {
      cOrderSn: cOrderSn
    };
    return $http.get(UrlService.getUrl('CRITICALSUC'),params);
  };
}]);
