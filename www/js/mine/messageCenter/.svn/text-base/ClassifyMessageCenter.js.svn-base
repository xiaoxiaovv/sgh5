
/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016/3/16
 * describe：MessageCenterController 测试控制器
 **/

APP.controller('ClassifyMessageCenterController', ['$localstorage','$timeout','$scope','$rootScope', 'CLASSIFYMESSAGECRNTERService','$state','UserService','InAppBrowserService','UrlService','$http','$stateParams',
  function ($localstorage,$timeout,$scope, $rootScope, CLASSIFYMESSAGECRNTERService, $state,UserService,InAppBrowserService,UrlService,$http,$stateParams) {
    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {//只有ios app 特有的样式
      $scope.paddingtopClass = {
        "margin-top": "16px"
      };
      $scope.paddingtopClasscontent = {
        "top": "60px"
      }
    }else{
      $scope.paddingtopClass = {
        "margin-top": "0px"
      };
      $scope.paddingtopClasscontent = {
        "top": "44px"
      }
    }
    /** 变量声明 **/
      //返回

    $scope.goBack = function () {
      $scope.$ionicGoBack();
    };
    $scope.init = function () {
      //消息分类
      CLASSIFYMESSAGECRNTERService.getMseeageClassify()
        .success(function(response){
          //订单消息
        	if(response.data.orderMesagesList==null){
        		$scope.orderMessage='';
        	}else{
        		$scope.orderMessage=response.data.orderMesagesList.content
        	}
        	$scope.orderNum=response.data.orderNum;
            //平台消息
            if(response.data.platformMesagesList==null){
        		$scope.platformMessage='';
        	}else{
        		$scope.platformMessage=response.data.platformMesagesList.content;
        	}
        	$scope.platformNum=response.data.platformNum;
        	//会员动态消息
        	if(response.data.memberMesagesList==null){
        		$scope.memberMessage='';
        	}else{
        		$scope.memberMessage=response.data.memberMesagesList.content
        	}
        	$scope.memberNum=response.data.memberNum;

          /*start by@zyr*/
          if (response.data.communityMesagesList == null) {
            $scope.communityMessage='';
          }else {
            $scope.communityMessage=response.data.communityMesagesList.content;
          }
          $scope.communityNum = response.data.communityNum;
          /*end by@zyr*/
        	if($scope.orderNum>99){
        		$scope.orderNumClose=99+"+";
        	}else{
        		$scope.orderNumClose=$scope.orderNum;
        	};
        	if($scope.platformNum>99){
        		$scope.platformNumClose=99+"+";
        	}else{
        		$scope.platformNumClose=$scope.platformNum;
        	};
        	if($scope.memberNum>99){
        		$scope.memberNumClose=99+"+";
        	}else{
        		$scope.memberNumClose=$scope.memberNum;
        	}
          /*start by@zyr*/
          if($scope.communityNum>99){
            $scope.communityNumClose=99+"+";
          }else{
            $scope.communityNumClose=$scope.communityNum;
          }
          /*end by @zyr*/
        })
    };
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    })

    $scope.goMessageList = function (messageType) {
      $scope.messageType = messageType;
      $state.go('messageCenter',{messageType: $scope.messageType});
    }
    /* 客服--调插件*/
    $scope.customerServe = function () {

      if (window.cordova) {
        var isAndroid = ionic.Platform.isAndroid();
        var iabRef = null;
        if (isAndroid) {
          iabRef = cordova.InAppBrowser.open('http://m.ehaier.com/v2/h5/sg/common/customService.html', '_blank', 'location=no');
        } else {
          iabRef = cordova.InAppBrowser.open('http://m.ehaier.com/v2/h5/sg/common/customService.html', '_blank', 'location=no,toolbar=no');
        }
        iabRef.addEventListener('loadstop', function (event) {
          if (event.url.indexOf('downt.ntalker') > -1) {
            $timeout(function () {
              var d = "var r= document.getElementsByTagName('div');" +
                "var newDiv  = document.createElement('span');" +
                "newDiv.style.width = '35px';" +
                "newDiv.style.height = '35px';" +
                "newDiv.style.background = 'transparent';" +
                "newDiv.style.zIndex = '999';" +
                "r[0].appendChild(newDiv);" +
                "newDiv.style.position = 'absolute';" +
                "newDiv.style.top = '10px';" +
                "newDiv.style.left = '12px';" +
                "newDiv.style.borderRadius = '17.5px';" +
                "newDiv.onclick = function(){window.location.href = window.location.href+'&close=true';};";
              iabRef.executeScript({
                code: d
              }, function () {
              });
            }, 1000);

          }
        });

        iabRef.addEventListener('loadstart', function (event) {
          if (event.url.indexOf('close=true') > -1) {
            iabRef.close();
          }
        });

      }
      else {
        $scope.kfTocken = $localstorage.get('sg_login_token_secret').substring(6);
      //  window.open('http://mobiletest.ehaier.com:38080/v3/h5/sg/common/customService.html?flag='+$scope.kfTocken);
         window.open('http://m.ehaier.com/v3/h5/sg/common/customService.html?flag='+$scope.kfTocken);
      }

      return;
      var u = navigator.userAgent;
      if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
        window.open = cordova.InAppBrowser.open('http://m.ehaier.com/v2/h5/sg/common/customService.html', '_blank', 'location=no');
      } else if (u.indexOf('iPhone') > -1) {
        window.open = cordova.InAppBrowser.open('http://m.ehaier.com/v2/h5/sg/common/customService.html', '_blank', 'location=no');
      } else {
        window.open = cordova.InAppBrowser.open('http://m.ehaier.com/v2/h5/sg/common/customService.html', 'location=yes');
      }
    };
  }]);
/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016-3-28
 * describe：消息中心
 **/
APP.service('CLASSIFYMESSAGECRNTERService', ['$http', 'UrlService','$rootScope', function ($http, UrlService,$rootScope) {
  //消息中心
  this.getMseeageClassify = function(){
    var params = {
      messageType: 0
    };
    return $http.get(UrlService.getUrl('MESSAGE_CLASSIFY'), params);
  }
  this.getMseeageClassifyNew = function(obj){
    var params = {
      'messageType': obj
    };
    return $http.get(UrlService.getUrl('MESSAGE_CLASSIFY'), params);
  }
//this.goMessageList =function(messageType){
//}
}]);
