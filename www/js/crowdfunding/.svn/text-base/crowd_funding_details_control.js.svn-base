/**
 * Created by lenovo on 2017-6-29.
 */

// 单品页
APP.controller('crowd_funding_details_control', ['$localstorage','LoginService','HomePageService','PopupService','CreditService','UrlService','$sce','$ionicSlideBoxDelegate','$rootScope','$stateParams','$state','$scope', 'CrowdFundingServerSingle', '$timeout','UserService','GoodsService','CommonAddressService',
  function ($localstorage,LoginService,HomePageService,PopupService,CreditService,UrlService,$sce,$ionicSlideBoxDelegate,$rootScope,$stateParams,$state,$scope, CrowdFundingServerSingle, $timeout,UserService,GoodsService,CommonAddressService) {
    $scope.productDataId=$stateParams.zActivityId;
    $scope.productList= [];
    $scope.isShowBtn=false;  // 状态显示 如果是众筹中和预热中显示 成功和失败不显示
    $scope.showQQ = false;
    $scope.showWeChat = false;
    $scope.isShowCopyButton = false;
    $scope.showQRimg = false;
    $scope.isSurplus = false;  //状态 剩余多少天  众筹中
    $scope.isStarts = false;   // 距离开始  预热中
    $scope.isError = false;   // 是否是失败
    $scope.isTrues = true;   // 成功
    $scope.detailsBanner=[];  //轮播
    $scope.Math=window.Math;
    //判断本地是否显示佣金;
    function GetSwitchChecked() {
      $scope.memberId = UserService.getUser().mid;
      var setSwitch = JSON.parse(localStorage.getItem('setSwitch'));
      var isExist = false;
      for (var i = setSwitch.length - 1; i >= 0; i--) {
        if (setSwitch[i].id == $scope.memberId) {
          $scope.settingsList = setSwitch[i].list;
          isExist = true;

        }
      }
      console.log($scope.settingsList);
    }
    $scope.init=function (zActivityId) {
      $scope.isError = true;
      $scope.isTrues = true;
      $scope.showShare = false;
      $scope.detailsBanner=[];
      if($stateParams.shareId){
          $rootScope.shareId = $stateParams.shareId;
        }
      CrowdFundingServerSingle.detailsListZC(zActivityId).success(function (response) {
        console.log(response)
        if (response.success == true) {
          //详情页数据
          $scope.productList=response.data;
          // 轮播
          $scope.detailsBanner=response.data.imageUrls;
          $ionicSlideBoxDelegate.$getByHandle('crowd_funding_details_slider').update(); // 更新图片
          $ionicSlideBoxDelegate.$getByHandle('crowd_funding_details_slider').loop(true);
          $scope.richText=$sce.trustAsHtml(response.data.activityDetails);  // 富文本
          console.log($scope.productList);
          // 显示状态
          $scope.activityStatus=$scope.productList.activityStatus;
          if($scope.activityStatus==0){
            $scope.isStatus='预热中';
            $scope.isShowBtn=true;  // 按钮
            $scope.isStarts = true; // 显示距离开始时间
            $scope.isSurplus = false; //不显示 剩余时间
            $scope.isError = true;  // 不显示
            $scope.isTrues = true; // 显示
          }
          else if($scope.activityStatus==1){
            $scope.isStatus='众筹中';
            $scope.isShowBtn=true;
            $scope.isSurplus = true;
            $scope.isStarts = false;
            $scope.isError = true;  // 不显示
            $scope.isTrues = true; //显示
          }
          else if($scope.activityStatus==2){
            $scope.isStatus='众筹成功';
            $scope.isShowBtn=false;
            $scope.isSurplus = true; // 剩余天数
            $scope.isError = true; //不显示
            $scope.isTrues = true; //显示
          }
          else if($scope.activityStatus==3){
            $scope.isStatus='众筹失败';
            $scope.isSurplus = true; //剩余天数
            $scope.isShowBtn=false;
            $scope.isError=false; //显示
            $scope.isTrues = false;//不显示
          }
          else if($scope.activityStatus==100){
            $scope.isStatus='计算中';
            $scope.isShowBtn=false;
            $scope.isSurplus = true; //剩余天数
            $scope.isError = true; //不显示
            $scope.isTrues = true; // 显示
          }
          else{
            $scope.isStatus='获取失败';
            $scope.isError = true;
            $scope.isTrues = false;
          }
        }
        else{
          console.log(response.message)
        }
      })
    }
    $scope.goToSupport = function(id){
      $state.go('crowd_funding_hot_redound',{zActivityId:id})
    }
    // 周期函数  每次都请求数据
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.isBuyer = LoginService.getRole(); //判断用户角色信息；0为买家；1为卖家
      GetSwitchChecked();//是否显示佣金本地存储
      $scope.init($scope.productDataId);
    })
    // 客服 调用之前的插件
    $scope.customerServe = function () {
      HomePageService.isWdHost()
        .success(function (res) {
          $rootScope.isWdHost = res.data.isHost;
          if($rootScope.isWdHost==-1){//如果没有登录 跳转到登录页面
            $state.go('login');
          }else{
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
             // window.open('http://m.ehaier.com/v3/h5/sg/common/customService.html', '_blank', 'location=no');
            //  window.open('http://mobiletest.ehaier.com:38080/v3/h5/sg/common/customService.html?itemid='+$scope.productList.id+'&flag='+$scope.kfTocken);
             window.open('http://m.ehaier.com/v3/h5/sg/common/customService.html?itemid='+$scope.productList.id+'&flag='+$scope.kfTocken);
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

          }
        })
    };
    // 分享按钮
    $scope.showShare = false;
    $rootScope.isApp = window.cordova ? true : undefined;
    $scope.share = function () {
      if (!UserService.getUser().mid) {
        $state.go('login');
        return;
      }
      $scope.moreShow = false;
      if (window.device && window.device.hasNewShare) {
        //新分享样式
        $scope.showShare = !$scope.showShare;
      }
    };
    /*********************分享标签－whiteBird start*********************/
    //复制
    $scope.copeText = function (text) {
      if (window.cordova) {
        cordova.plugins.clipboard.copy(text);
        PopupService.showToastShort('复制成功');
        $scope.isShowCopyButton = false;
      }
      else {
        PopupService.showToast('请下载APP执行此操作');
      }
    };
    $scope.hideblackCover = function () {
      $scope.showShare = false;
    };
    $scope.shareToPlatform = function (index) {

      var title = $scope.productList.activityName,
        content = $scope.productList.activityDsp || $scope.productList.activityName,
        pic = $scope.productList.imageUrls[0],//product 里只有这个img
        url = UrlService.getShareLinkHeader() + 'crowd_funding_details/' +$scope.productList.id+'/'+UserService.getUser().mid;
      if (window.umeng) {
        if (index == 0) {
          window.umeng.shareToSina(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
        } else if (index == 1) {
          window.umeng.shareToWechatSession(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
        } else if (index == 2) {
          window.umeng.shareToWechatTimeline(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
        } else if (index == 3) {
          window.umeng.shareToQQ(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
          CreditService.qqShare();
        } else if (index == 4) {
          window.umeng.shareToQzone(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
          CreditService.qqShare();
        }
        if (index == 5) {
          $scope.copeText(url);
        }else {
          CreditService.successShare();
        }
      } else {
        alert('umeng undefined 只能在app分享');
      }

      $scope.showShare = false;
    };
    /*********************分享标签－whiteBird end*********************/
  }])

APP.service('CrowdFundingServerSingle', ['$http', 'UrlService', function ($http, UrlService) {
  // 单品页
  this.detailsListZC=function (zActivityId) {
    // return $http.get(UrlService.getUrl('TEST_API'))
    //接收id
    var params={
      'zActivityId':zActivityId
    }
    // return $http.get('http://mobiletest.ehaier.com:38080/activity/zhongchou/getZActivitySinglePage?zActivityId='+params.zActivityId+'')
    return $http.get(UrlService.getZCUrl('ZC_ACTIVITY_SINGLE_PAGE'),params);
  }


}])

