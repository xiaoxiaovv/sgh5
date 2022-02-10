APP.controller('CustomPageCtrl', ['$stateParams', '$scope', '$rootScope', 'UrlService', 'CreditService', 'UserService', '$state', 'CustomPageService', '$timeout', '$localstorage', '$ionicSlideBoxDelegate', 'GetCouponsService', 'PopupService', 'BannerThemeService','GoodsService','$ionicLoading', function($stateParams, $scope, $rootScope, UrlService, CreditService, UserService, $state, CustomPageService, $timeout, $localstorage, $ionicSlideBoxDelegate, GetCouponsService, PopupService, BannerThemeService,GoodsService,$ionicLoading) {
  $scope.customPageId = $stateParams.customPageId ? $stateParams.customPageId : ''; //请求数据穿参
  $scope.showShare = false; //分享界面显示隐藏
  $scope.shareimg = ''; //分享图片路径
  $scope.storeId = 0; //店铺id
  $scope.hashtitle = ''; //页面标题
  $scope.sharedesp = ''; //描述
  $scope.moduleList = []; //模块列表
  $scope.skuMap = {}; //商品列表
  $scope.couponMap = {}; //优惠卷列表
  $scope.index = [];
  $scope.showjuanyz = false; //优惠卷印章默认不显示
  $scope.juanlist = []; //优惠卷列表
  $scope.juankeling = {}; //优惠卷是否可领
  $scope.juanqiangwan = {}; //优惠卷是否已抢光
  $scope.streetId = 12036596;//定位失败,默认定位到崂山区
  $scope.init = function() {
    $scope.storeId = $localstorage.get('storeId', $rootScope.globalConstant.storeId); //店铺id
    /*********************分享标签－whiteBird start*********************/
    $scope.showQQ = false;
    $scope.showWeChat = false;
    $scope.showShare = false; //分享菜单显示
    if (window.cordova || window.location.hash.indexOf('sg_rn_app')!= -1) {
      $scope.isApp = true;
    } else {
      $scope.isApp = false;
    }
    if (window.cordova) {
      window.umeng.checkAppInstalled('qq', function(data) {

        if (data == false) {
          $scope.showQQ = false;
        } else {
          $scope.showQQ = true;
        }
      });
      window.umeng.checkAppInstalled('wechat', function(data) {
        if (data == false) {
          $scope.showWeChat = false;
        } else {
          $scope.showWeChat = true;
        }
      });
    }
    $scope.$broadcast('scroll.refreshComplete');
    /*********************分享标签－whiteBird end*********************/
    GoodsService.getAddress().success(function(response){
          if(response.success){
            if(response.data){
              var addressMessage = eval(response.data)[0];
            if(addressMessage.streetId!=undefined){
              $scope.streetId = addressMessage.streetId;
            }else{
              
            }
            }else{
            } 
          }else{ //获取地址失败 用默认地址
            
          }
       CustomPageService.getdata($scope.customPageId,$scope.streetId).success(function(res) {
      if (res.success == true) {
        $scope.hashtitle = res.data.name; //页面标题
        $scope.moduleList = res.data.modualList; //模板列表
        $scope.skuMap = res.data.skuMap; //商品列表
        $scope.couponMap = res.data.couponMap; //优惠卷列表
        $scope.sharedesp = res.data.description;
        for (var j in $scope.moduleList) {
          if ($scope.moduleList[j].modualType == "SWITCH") {
            $scope.shareimg = $scope.moduleList[j].imageList[0].imageUrl; //分享图片取轮播图第一张
            break;
          }
        }
        for (var k=0;k<$scope.moduleList.length;k++) {
          if ($scope.moduleList[k].tabList) {
            $scope.index[k] = 0;
          }
        }
        for (var i in res.data.couponMap) {
          if (res.data.couponMap[i].totalGetNum >= res.data.couponMap[i].totalLimitNum) {
            $scope.juankeling[i] = true;
            $scope.juanqiangwan[i] = true; //扣已抢完的章
          } else {
            if (res.data.couponMap[i].getNum < res.data.couponMap[i].personLimitNum) {
              $scope.juankeling[i] = true;
              $scope.juanqiangwan[i] = false;
            }
            if (res.data.couponMap[i].getNum >= res.data.couponMap[i].personLimitNum) {
              $scope.juankeling[i] = false; //扣已领的章
              $scope.juanqiangwan[i] = false;
            }
          }
        }
        $timeout(function() {
          $ionicSlideBoxDelegate.update();
          $ionicSlideBoxDelegate.loop(true);
        }, 200);
      } else {
        PopupService.showToast(res.message);
      }
    });
    })    
  }
  $rootScope.$on('CACHE_SUCCESS', function (event, data) {
      var params = {
        template: '地址切换中，请稍后...',
        duration: 1000
      };
      $ionicLoading.show(params);
      $scope.init();
    })
  /*tab点击样式和数据切换*/
  $scope.changestyle = function(item,outerindex) {
    $scope.index[outerindex] = item;
  }
  /*点击领卷*/
  $scope.getjuan = function(item, index) {
    if ($scope.juanqiangwan[item] == true) { //如果卷抢完了,点击无效
      return;
    } else if ($scope.juankeling[item] == false) { //卷没抢完,但是领够了,点击无效
      return;
    } else { //卷没抢完,也没领够
      if (!UserService.getUser().mid) { //如果没有登录 去登录
        PopupService.showToast('领卷需要登录哦');
      } else { //登录了
        GetCouponsService.doGetNewCoupons(item) //先领卷
          .success(function(response) {
            if (response.success) {
              //改变卷的状态
              CustomPageService.getdata($scope.customPageId,$scope.streetId).success(function(res) {
                var getNum = res.data.couponMap[item].getNum,
                  personLimitNum = res.data.couponMap[item].personLimitNum,
                  totalGetNum = res.data.couponMap[item].totalGetNum,
                  totalLimitNum = res.data.couponMap[item].totalLimitNum;
                if (totalGetNum >= totalLimitNum) {
                  $scope.juankeling[item] = true;
                  $scope.juanqiangwan[item] = true;
                  return;
                } else {
                  if (getNum < personLimitNum) {
                    $scope.juankeling[item] = true;
                    $scope.juanqiangwan[item] = false;
                  }
                  if (getNum >= personLimitNum) {
                    $scope.juankeling[item] = false;
                    $scope.juanqiangwan[item] = false;
                  }
                }
                PopupService.showToast(response.message);
              })
            } else {
              PopupService.showToast(response.message);
            }
          });
      }
    }
  }
  //分享
  $scope.goshare = function() {
    var title = $scope.hashtitle; //分享标题
    var content = $scope.sharedesp; //分享内容
    var pic = $scope.shareimg; //分享图片，写绝对路径
    var url = UrlService.getShareLinkHeader() + 'CustomPage/'+$scope.customPageId;
    window.postMessage('custPageShare|'+title+'|'+content+'|'+pic+'|' + url);
    // if (!UserService.getUser().mid) {
    //   $state.go('login');
    //   return;
    // }
    // $scope.showShare = !$scope.showShare;
  };
  $scope.goBack = function() {
    $scope.$ionicGoBack();
  }
  //复制
  $scope.copeText = function(text) {
    if (window.cordova) {
      cordova.plugins.clipboard.copy(text);
      PopupService.showToastShort('复制成功');
    } else {
      PopupService.showToast('请下载APP执行此操作');
    }
  };
  //关闭分享
  $scope.hideblackCover = function() {
    $scope.showShare = false;
  };
  //分享方法
  $scope.shareToPlatform = function(index) {
    var title = $scope.hashtitle; //分享标题
    var content = $scope.sharedesp; //分享内容
    var pic = $scope.shareimg; //分享图片，写绝对路径
    var url = UrlService.getShareLinkHeader() + 'CustomPage';

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
      } else {
        CreditService.successShare();
      }
    } else {
      alert('umeng undefined 只能在app分享');
    }
    $scope.showShare = false;
  };
  //轮播图点击方法
  $scope.bannerClick = function(linkType, link, relationId) {
    var tempArr = link.split('&');
    switch (linkType) {
      case '-1':
        BannerThemeService.getBannerTheme(relationId)
          .success(function(response) {
            $state.go('bannerDaily', {
              bannerId: relationId,
              layout: response.data.layout
            });
          });
        break;
      case '0':
        $state.go('bannerTheme', {
          bannerId: relationId
        });
        break;
      case '1': //单品页
        var productId = tempArr[0].slice(tempArr[0].indexOf('=') + 1);
        $state.go('productDetail', {
          fromType: '',
          fromUrl: '',
          o2oType: 0,
          productId: productId,
          storeId: $scope.storeId
        });
        break;
      case '2': //领券中心/优惠券详情页
        if (!link) {
          $state.go('getCouponsList');
        } else {
          var couponsId = link.slice(link.indexOf('=') + 1);
          $state.go('couponsDetail', {
            cId: couponsId,
            userID: $scope.storeId,
            type: 2
          });
        }
        break;
      case '3': //游戏页
        var gameId = link.slice(link.indexOf('=') + 1);
        $state.go('game', {
          gameId: gameId
        });
        break;
      case '4': //活动页
        if (tempArr[0].slice(tempArr[0].indexOf('=') + 1) == '日常活动') {
          BannerThemeService.getBannerTheme(tempArr[1].slice(tempArr[1].indexOf('=') + 1))
            .success(function(response) {
              $state.go('bannerDaily', {
                bannerId: tempArr[1].slice(tempArr[1].indexOf('=') + 1),
                layout: response.data.layout
              });
            });
        } else if (tempArr[0].slice(tempArr[0].indexOf('=') + 1) == '主题活动') {
          $state.go('bannerTheme', {
            bannerId: tempArr[1].slice(tempArr[1].indexOf('=') + 1)
          });
        }
        break;
      case '5': //自定义类型页
        if (window.cordova) {
          /**
           * H5跳转原生webView页面
           * @param resultUrl {String} 链接url
           * @param title {String} 标题
           *
           */
          if (link.indexOf('m.ehaier.com/www/index.html') != -1) {
            var url = link.slice(link.indexOf('#/'));
            window.location.hash = url;
          } else {
            window.emc.presentH5View(link, "");
          }
        } else {
          window.open(link, '_blank', 'location=yes');
        }
        break;
      case '6': //众筹
        $state.go('crowdFunding');
        break;
      case '7': //新品
        if (!link) {
          $state.go('newSend');
        } else {
          $state.go('productDetail', {
            fromType: '',
            fromUrl: '',
            o2oType: 0,
            productId: link,
            storeId: $scope.storeId
          });
        }
        break;
      case '8': //社群
        if (!link) {
          $state.go('topic.qhot');
        } else {
          $state.go('noteDetails', {
            noteId: tempArr[0].slice(tempArr[0].indexOf('=') + 1),
            isShortStory: tempArr[1].slice(tempArr[1].indexOf('=') + 1)
          })
        }
        break;
    }
  }
  $scope.$on('$ionicView.beforeEnter', function(event, v) {
    if (v.direction == 'back') {
      
    }else{
      $scope.init();
    }   
  });
}]);


APP.service('CustomPageService', ['$http', 'UrlService', function($http, UrlService) {
  this.getdata = function(customPageId,streetId) {
    if (customPageId == '') {
      var params = { //没有customPageId就不传
        'streetId':streetId
      };
    } else {
      var params = {
        'customPageId': customPageId,
        'streetId':streetId
      };
    }
    return $http.get(UrlService.getNewUrl('CUSTOMPAGE_MODEL'), params);
  }
}]);