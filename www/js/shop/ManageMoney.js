/**
 * Created by jiangfeng on 2017/6/5.
 */
APP.controller('ManageMoneyController', ['$scope', 'ManageMoneyService', '$ionicModal', '$state', 'InAppBrowserService', '$stateParams', 'UrlService','PopupService','$rootScope',
  function ($scope, ManageMoneyService, $ionicModal, $state, InAppBrowserService, $stateParams, UrlService,PopupService,$rootScope) {

    /*变量定义*/
    var pageNo = 1,//分页索引
      pageSize = 5;//每页返回数据条数
    var partner_id = UrlService.getCPUrl('KQT_ID'),//快捷通商户ID
      token = '';//第三方token
    var ref = null;//new webview
    $scope.activityInfo = [];//活动说明信息
    $scope.activityRule = '';//活动规则
    var locationUrl = null;
    var frontState = $stateParams.frontState;
    var backUrl = '';
    var serverHead = UrlService.getHead().replace('v3', 'www');
    $scope.showAgreement = false;
    $scope.hasMoreData = false;//查看更多是否显示
    $scope.promoCode = '';//推荐码
    $scope.qrCodeUrl = '';//二维码图片url
    $scope.promotionList = [];//好友投资列表
    //页面初始化方法
    $scope.init = function () {
      pageNo = 1;
      if (locationUrl.indexOf('auth_code') != -1) {
        var startIndex = locationUrl.indexOf('auth_code') + 10;
        var auth_code = locationUrl.toString().substr(startIndex, 32);
        ManageMoneyService.getKjtToken(auth_code).
          success(function (response) {
            token = response.data.token;
            $scope.promotionList = [];
            getActivityInfo(response.data.token);
            $scope.getPromoteReward(response.data.token, 1, pageSize);
            getRefCode(response.data.token);
          })
      } else {
        checkLogin();
      }
    };
     //校验登录状态并处理
    function checkLogin() {
      ManageMoneyService.checkKjtLogin().
        success(function (response) {
          if (response.data.isLogin) {
            token = response.data.token;
            $scope.promotionList = [];
            getActivityInfo(response.data.token);
            $scope.getPromoteReward(response.data.token, 1, pageSize);
            getRefCode(response.data.token);
          } else {
            var callBackUrl = serverHead + 'index.html#/manageMoney/' + frontState + '?page=' + backUrl;
            var encodeUrl = escape(callBackUrl);
            var kjtUrl = UrlService.getCPUrl('KQT_URL')+'?page=authorizeMain&partner_id=' + partner_id + '&return_url=' + encodeUrl;//快捷通授权链接
            if (window.cordova) {
              //手机端处理
              var loadUrl = '';
              var shopBackUrl = 'page=' + serverHead + 'index.html#/homePage/',
                revenueBackUrl = 'page=' + serverHead + 'index.html#/shopRevenue';
              ref = InAppBrowserService.open(kjtUrl);
              ref.addEventListener('exit', function (){
                if(loadUrl.indexOf('auth_code') != -1||loadUrl.indexOf(revenueBackUrl) != -1||loadUrl.indexOf(shopBackUrl) != -1){

                }else{
                  $scope.$ionicGoBack();
                }
              });
              ref.addEventListener('loadstart', function (event) {
                loadUrl = unescape(event.url);
                if (event.url.indexOf('auth_code') != -1) {
                  var startIndex = event.url.indexOf('auth_code') + 10;
                  var auth_code = event.url.toString().substr(startIndex, 32);
                  ref.close();
                  ManageMoneyService.getKjtToken(auth_code).
                    success(function (response) {
                      token = response.data.token;
                      $scope.promotionList = [];
                      getActivityInfo(response.data.token);
                      $scope.getPromoteReward(response.data.token, 1, pageSize);
                      getRefCode(response.data.token);
                    })
                } else if (loadUrl.indexOf(revenueBackUrl) != -1&&loadUrl.indexOf('&return_url=')==-1) {
                  $state.go('shopRevenue');
                } else if (loadUrl.indexOf(shopBackUrl) != -1&&loadUrl.indexOf('&return_url=')==-1) {
                  $state.go('homePage');
                }
              });
            } else {
              //网页端处理
              window.location.href = kjtUrl;
            }
          }
        })
    }

//查询活动规则信息
    function getActivityInfo(token) {
      ManageMoneyService.getHryActivityInfo(token).
        success(function (response) {
          if (response.success) {
            $scope.activityInfo = response.data.promotionActivityList;
            $scope.activityRule = response.data.description;
          }
        })
    }

    //查询好友投资记录
    $scope.getPromoteReward = function (token, pageNo, pageSize) {
      ManageMoneyService.getPromoteReward(token, pageNo, pageSize).
        success(function (response) {
          if (response.success) {
            $scope.promotionList = $scope.promotionList.concat(response.data.promotionList);
            var length = $scope.promotionList.length;
            $scope.hasMoreData = (length != response.totalCount);
          } else {
            $scope.hasMoreData = false;
          }
        })
    };
    //获取推荐码
    function getRefCode(token) {
      ManageMoneyService.getRefCode(token)
        .success(function (response) {
          if (response.success) {
            $scope.promoCode = response.data.promoCode;
            $scope.qrCodeUrl = response.data.qrCodeUrl;
          }
        })
    }

    //分页加载更多
    $scope.getMoreData = function(){
      pageNo++;
      $scope.getPromoteReward(token,pageNo,pageSize)
    };
    //分享方法
    $scope.shareToPlatform = function (index) {
      var title = '快来领688元红包！'; //分享标题
      var content = '好友力邀您来海融易，海融易为您准备了一份688大礼，快来领取吧！';  //分享内容
      var pic = 'http://m.ehaier.com/www/img/icon_inside_qrcode.png';//分享图片，写绝对路径
      var url = $scope.qrCodeUrl;//分享链接，绝对路径
      if (window.umeng) {
        if (index == 1) {//好友
          window.umeng.shareToWechatSession(title, content, pic, url, 0, null,function(){$scope.sharemodal.hide()});
        } else {//朋友圈
          window.umeng.shareToWechatTimeline(title, content, pic, url, 0, null,function(){$scope.sharemodal.hide()});
        }
      } else {
        PopupService.showAlert('只能在app分享', '抱歉，只能在app分享');
      }
    };
    //跳转天天聚
    $scope.skipToTTJ = function(){
      var callBackUrl = serverHead + 'index.html#/manageMoney/' + frontState;
      var encodeUrl = escape(callBackUrl);
      var TTJUrl = UrlService.getCPUrl('TTQ_URL')+'?token=' + token + '&loginUrl=' + encodeUrl + '&returnUrl=' + encodeUrl;//天天聚
      if(window.cordova){
        var ttjRef = null;//绑定天天聚webview
        ttjRef = InAppBrowserService.open(TTJUrl);
        ttjRef.addEventListener('loadstart', function (event) {
          if (event.url.indexOf('index.html#/manageMoney') != -1) {
            ttjRef.close();
          }
        });
      }else{
       window.location.href = TTJUrl;
      }
    };
    $scope.goBack = function(){
      //if(frontState == 'shopRevenue'){
      //  $state.go('shopRevenue');
      //}else{
      //  $state.go('shop');
      //}
      if(frontState == 'shopRevenue'){
        $state.go('shopRevenue');
      }else{
        // window.location.href = './index.html#/financialMoney';
        $state.go('financialMoney', {whereId:'manageMoney'});
      }

    };
    //二维码展示modal
    $ionicModal.fromTemplateUrl('mm-qrcode-modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
      backdropClickToClose: true
    }).then(function (modal) {
      $scope.qrCodemodal = modal;
    });
    //分享modal
    $ionicModal.fromTemplateUrl('mm-share-modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
      backdropClickToClose: true
    }).then(function (modal) {
      $scope.sharemodal = modal;
    });
    $scope.openQRModal = function () {
      $scope.qrCodemodal.show();
      var qrnode = new AraleQRCode({
        text: $scope.qrCodeUrl,
        size: 106,
        image: $rootScope.imgBaseURL+'img/icon_inside_qrcode.png',
        imageSize: 30
      });
      var qrCodeElement = document.getElementById('createdQrCode');
      if (qrCodeElement.childNodes.length != 0) {
        qrCodeElement.removeChild(qrCodeElement.childNodes[0]);
      }
      qrCodeElement.appendChild(qrnode);
      qrCodeElement.childNodes[0].style.position = 'relative';

    };
    $scope.closeQRModal = function () {
      $scope.qrCodemodal.hide();
    };
    $scope.openShareModal = function () {
      $scope.sharemodal.show();
    };
    $scope.closeShareModal = function () {
      $scope.sharemodal.hide();
    };
    $scope.openAgreement = function () {
      $scope.sharemodal.hide();
      setTimeout(function () {
        $scope.showAgreement = true;
      }, 300);
    };
    $scope.closeAgreement = function(){
      $scope.showAgreement = false;
    };
    $scope.$on('$destroy', function () {
      $scope.qrCodemodal.remove();
      $scope.sharemodal.remove()
    });

    $scope.$on('$ionicView.beforeEnter', function (event, data) {
      locationUrl = window.location.href;
      frontState = $stateParams.frontState;
      serverHead = UrlService.getHead().replace('v3', 'www');
      if (frontState == 'shopRevenue') {
        backUrl = serverHead + 'index.html#/shopRevenue';
      } else {
        backUrl = serverHead + 'index.html#/homePage/';
      }
      $scope.init();
    });
    //$scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    //  if((toState.name=='shop'||toState.name=='shopRevenue')){H5不需要这段代码
    //    setTimeout(function(){
    //      ref.close();
    //    },300);
    //  }
    //});
  }]);


APP.service('ManageMoneyService', ['$http', 'UrlService', function ($http, UrlService) {
  this.checkKjtLogin = function () {//检查快捷通登录状态
    return $http.get(UrlService.getUrl('CHECK_KJT_LOGIN'));
  };
  this.getKjtToken = function (authCode) {//获取token
    var params = {
      authCode: authCode
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('GET_KJT_TOKEN'),
      params: params
    })
  };
  this.getHryActivityInfo = function (token) {//获取海融活动规则
    var params = {
      token: token
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('GET_HAIRONGYI_ACTIVITYIFNO'),
      params: params
    })
  };
  this.getPromoteReward = function (token, pageNo, pageSize) {//获取好友投资记录
    var params = {
      token: token,
      pageNo: pageNo,
      pageSize: pageSize
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('GET_PROMOTE_REWARD'),
      params: params
    })
  };
  this.getRefCode = function (token) {
    var params = {
      token: token
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('GET_REF_CODE'),
      params: params
    })
  }
}]);
