/**
 * Created by lenovo on 2017-11-15.
 */

APP.controller('localSpecialtyHomePageController', ['CommonAddressService','$ionicLoading','CreditService','CartService','newsendService','$ionicPlatform','$ionicHistory','UrlService', 'trueAuthenticationService', '$localstorage', 'GoodsSearchService', 'RegisterService', '$ionicModal', 'ShopService', '$q', 'GoodsService', 'CalculateStrLength', '$interval', '$http', '$scope', '$stateParams', '$ionicSlideBoxDelegate',
  '$state', 'UserService', '$timeout', '$rootScope', '$ionicScrollDelegate', 'BannerThemeService', 'PopupService', 'localSpecialtyHomePageService','HomePageService',
  function (CommonAddressService,$ionicLoading,CreditService,CartService,newsendService,$ionicPlatform,$ionicHistory,UrlService, trueAuthenticationService, $localstorage, GoodsSearchService, RegisterService, $ionicModal, ShopService, $q, GoodsService, CalculateStrLength, $interval, $http, $scope, $stateParams, $ionicSlideBoxDelegate, $state, UserService, $timeout, $rootScope, $ionicScrollDelegate, BannerThemeService, PopupService, localSpecialtyHomePageService,HomePageService) {

    /*变量*/
    $scope.allSpecialtyArr = []; //全国
   // $scope.showFlashSale = false; //是否显示限时抢购
    $scope.showReserveList = false; //是否显示新品预约
    $scope.crowdFundingList = false; //是否显示众筹
    $scope.selectedIndex = 0;   //分类选择
    $scope.isDisplay = false;  //分享模板
    $scope.menuImg = 'img/ic_lookMore.png';
    $scope.showShare = false;      //分享
    $scope.localSelect = 0;   //省级选择
    $scope.isTimeOver = false; //倒计时
    $scope.flashHour = ''; //几点场
    $scope.textTime = ''; //开始 结束
    $scope.drinkList = []; //特产饮品 轮播 只针对轮播
    $scope.foodList = []; //特产吃食  轮播 只针对轮播
    $scope.isDrinkList = false; //是否显示特产饮品整个模块
    $scope.isFoodList = false; //是否显示特产吃食整个模块
    $scope.Timetotal = [];
    $scope.youLikeTypeArr = []; //猜你喜欢 分类
    $scope.youLikeDataArr = []; //猜你喜欢 商品数据
    $scope.cateId=0; //类目id
    $scope.dealPrice = CalculateStrLength.dealPrice;
    $scope.newAndlimit ={
      flashProductList:[],  //限时抢购
      newSendList:[]        //新品预约
    };
    $scope.systemTime = 0;//系统时间
    $scope.clickFlag = 0;
    $scope.arrList ={
      bannerList:[],     //轮播
      navList:[],        // 导航 特产馆 各地
      specialtyListDrink:[],  // 特产 饮品
      specialtyListFood:[],   // 特产 吃食
      touristsList:[] ,       // 逛客
      midCommList:[]    // 逛客怎么说
    };
    $scope.addressMsg = { //地址
      provinceId:'',
      cityId:'',
      areaId:'',
      streetId:''
    };
    //默认地理位置
    $scope.provinceId = '16'; //省分Id  山东
    $scope.cityId = '173'; //市Id   青岛
    $scope.districtId = '2450'; //区Id   崂山
    $scope.streetId = '12036596'; //街道Id  中韩街道
    var NowTer;
    $scope.chooseTimer = function(index){
        $scope.clickFlag = index;
    }
    //跳转搜索页
    $scope.goToSearch = function () {
      $state.go('goodsSearch', {
        front: 1
      });
    };
    //倒计时
    $scope.endT = [];
    $scope.endTt = [];
    $scope.endTh = [];
    $scope.endTm = [];
    $scope.endTs = [];
    $scope.Timetotal = [];
    var newTime = [],
      addressMessage,
      remindArray = [],
      countDownNowTime = [],
      countDownendTime = [],
      nowT = new Date().getTime(),
      timerLength = "";
    //$scope.flashTime =''; //几点场
    // $scope.timeCount = { //时间
    //    startTime:0,
    //    endTime:0,
    //    systemTime:0,
    // };
    $scope.preheatingTime=0; //预热时间
    //众筹
    $scope.zcnow=[];
    $scope.zcpre=[];
    $scope.zcold=[];
    $scope.settingsList = '';//是否显示佣金本地存储
    //判断本地是否显示佣金;
    function GetSwitchChecked() {
      $scope.memberId = UserService.getUser().mid;
      var setSwitch = JSON.parse(localStorage.getItem('setSwitch'));
      var isExist = false;
      for (var i = setSwitch.length - 1; i >= 0; i--) {
        if (setSwitch[i].id ==$scope.memberId) {
          $scope.settingsList = setSwitch[i].list;
          isExist = true;

        }
      }
    }
    //倒计时
    // $scope.moreCountTime = {
    //   hours: '00',
    //   minutes: '00',
    //   seconds: '00'
    // };

    /*头部*/
    if (ionic.Platform.platform().indexOf('ios') !=-1 && window.cordova) {//只有ios app 特有的样式
      $scope.paddingtopClass = {
        "margin-top": "16px"
      };
      $scope.paddingtopClasscontent = {
        "top": "60px"
      };
    }else{
      $scope.paddingtopClass = {
        "margin-top": "0px"
      };
      $scope.paddingtopClasscontent = {
        "top": "44px"
      };
    }
    //初始化
    $scope.init = function () {
      $scope.clickFlag = 0;
      $scope.cartTotalNum = 0;
      $scope.storeId = $localstorage.get('storeId', $rootScope.globalConstant.storeId);
      $scope.getAddress();
      $scope.crowdFundingMsg(2);    //众筹
      $scope.youLikeType(); //猜你喜欢 分类
      $scope.getUserMsg(); //用户身份
      $scope.getCartNum();//购物车数量
    };

    //身份
    $scope.getUserMsg =function () {
      HomePageService.isWdHost()
        .success(function (res) {
          $rootScope.isWdHost = res.data.isHost;
        });
    };
    //获取数量
    $scope.getCartNum = function () {
      CartService.getNumber()
        .success(function (res) {
          if(res.success){
            $scope.cartTotalNum = res.data;
          }else{
            $scope.cartTotalNum = 0;
          }
        });
    };
    //主接口
    function mainRes(streetId) {
      //var deferred = $q.defer();
      localSpecialtyHomePageService.getMaster(streetId)
        .success(function (response) {
          if(response.success){
            //轮播
            if(response.data.topBannerList !=null && response.data.topBannerList.bannerList!=null){
              $scope.arrList.bannerList = response.data.topBannerList.bannerList;
              $ionicSlideBoxDelegate.$getByHandle('crowd_funding_slider').update();
              $ionicSlideBoxDelegate.$getByHandle('crowd_funding_slider').loop(true);
            }else{
              $scope.arrList.bannerList =[];
            }
            //导航
            if(response.data.regionList!=null && response.data.regionList.regionList!=null){
              if(response.data.regionList.regionList.length>3){
                $scope.arrList.navList = response.data.regionList.regionList.slice(0,3);
              }else{
                $scope.arrList.navList = response.data.regionList.regionList;
              }

            }
            //特产饮品
            if(response.data.drinkList != null){
              if(response.data.drinkList.bannerList!=null || response.data.drinkList.topBanner!=null){
                $scope.isDrinkList = true;
                $scope.arrList.specialtyListDrink = response.data.drinkList;
                $scope.drinkList = response.data.drinkList.bannerList;
              }else{
                $scope.isDrinkList = false;
                $scope.arrList.specialtyListDrink= [];
                $scope.drinkList = [];
              }
            }
            //特产吃食
            if(response.data.foodList != null){
              if(response.data.foodList.productList!=null || response.data.foodList.topBanner!=null){
                $scope.isFoodList = true;
                $scope.arrList.specialtyListFood = response.data.foodList;
                $scope.foodList = response.data.foodList.productList;
              }else{
                $scope.isFoodList = false;
                $scope.arrList.specialtyListFood = [];
                $scope.foodList =[];
              }
            }
            //逛客怎么说
            if(response.data.communityList!=null && response.data.communityList.bannerList!=null){
              $scope.arrList.midCommList = response.data.communityList;
            }
            else{
              $scope.arrList.midCommList =null;
            }

          }else{
           // PopupService.showToast('获取数据失败，请稍后重试。');
            console.log('主接口请求错误');
          }
        });
      //  return deferred.promise;
    }
    //限时抢购 新品预约 接口
    $scope.newProductAndTimeLimit = function (provinceId, cityId, areaId, streetId) {
      localSpecialtyHomePageService.getNewAndLimit(provinceId, cityId, areaId, streetId)
        .success(function (response) {
          if(response.success){
            if(response.data != null){
              //限时抢购
              // $scope.isWd = response.data.isWd;
              // if(response.data.flash == null){
              //   $scope.showFlashSale = false;
              // }else{
              //  // $scope.showFlashSale = true;
              //   $scope.newAndlimit.flashProductList = response.data.flash.flashProductList;
              //   $scope.flashTime = response.data.flash.flashTime;
              //   $scope.preheatingTime = response.data.flash.preheatingTime;
              //   $scope.timeCount = { //时间
              //     startTime:response.data.flash.startTime,
              //     endTime:response.data.flash.endTime,
              //     systemTime:response.data.flash.systemTime
              //   };
              //   if($scope.flashTime){
              //     $scope.flashHour = $scope.flashTime.slice(11,16)+'场';
              //   }
              //   if($scope.newAndlimit.flashProductList.length==0 || ($scope.timeCount.systemTime - new Date($scope.newAndlimit.flashProductList[0].endTime).getTime() > -1000) || ($scope.timeCount.systemTime<$scope.preheatingTime)){
              //     $scope.showFlashSale = false;
              //   }else{
              //     $scope.showFlashSale = true;
              //     if($scope.timeCount.systemTime - $scope.timeCount.startTime > -1000){
              //       $scope.timer = $interval(function () {
              //         if ($scope.timeCount.endTime - $scope.timeCount.systemTime <1000){
              //           $interval.cancel($scope.timer);
              //           $scope.newProductAndTimeLimit($scope.addressMsg.provinceId, $scope.addressMsg.cityId, $scope.addressMsg.areaId, $scope.addressMsg.streetId);
              //         }
              //         limitCountTimes($scope.timeCount.endTime- $scope.timeCount.systemTime);
              //         $scope.timeCount.systemTime+=1000;
              //       }, 1000);
              //       $timeout(function () {
              //         $scope.textTime='结束';
              //       }, 1000)
              //     }else{
              //       $scope.timer1 = $interval(function () {
              //         if ($scope.timeCount.startTime - $scope.timeCount.systemTime <1000) {
              //           $interval.cancel($scope.timer1);
              //           $scope.newProductAndTimeLimit($scope.addressMsg.provinceId, $scope.addressMsg.cityId, $scope.addressMsg.areaId, $scope.addressMsg.streetId);
              //         }
              //         limitCountTimes($scope.timeCount.startTime - $scope.timeCount.systemTime);
              //         $scope.timeCount.systemTime+=1000;
              //       }, 1000);
              //       $timeout(function () {
              //         $scope.textTime='开始';
              //       }, 1000)
              //     }
              //   }

              // }

              //新品预约
              if(response.data.reverse!=null){
                timerLength = remindArray.length;
                $scope.newAndlimit.newSendList = response.data.reverse.acReserveList;
                $scope.newAndlimitLength = response.data.reverse.acReserveList.length;
                if($scope.newAndlimit.newSendList.length==0 || $scope.newAndlimit.newSendList==[]){
                  $scope.showReserveList = false;
                }else{
                  $scope.showReserveList = true;
                  for (var a = 0; a < $scope.newAndlimit.newSendList.length; a++) {
                    remindArray.push(a);
                    countDownNowTime[a] = parseInt(nowT / 1000);
                    countDownendTime[a] = parseInt(($scope.newAndlimit.newSendList[a].reserveEndTime) / 1000);
                  }
                  for (var i = timerLength; i < remindArray.length; i++) {
                    countTimeNew(countDownNowTime[remindArray[i]], countDownendTime[remindArray[i]], remindArray[i]);
                  }
                }
              }else{
                $scope.showReserveList = false;
              }
            }else{
              //$scope.showFlashSale = false; //是否显示限时抢购
              $scope.showReserveList = false; //是否显示新品预约
              // $scope.timeCount = { //时间
              //   startTime:0,
              //   endTime:0,
              //   systemTime:0
              // };
              // $scope.moreCountTime = {
              //   hours: '00',
              //   minutes: '00',
              //   seconds: '00'
              // };
            }

          }else{
           // $scope.showFlashSale = false; //是否显示限时抢购
            $scope.showReserveList = false; //是否显示新品预约
            // $scope.timeCount = { //时间
            //   startTime:0,
            //   endTime:0,
            //   systemTime:0
            // };
            // $scope.moreCountTime = {
            //   hours: '00',
            //   minutes: '00',
            //   seconds: '00'
            // };
           // PopupService.showToast('获取数据失败，请稍后重试。');
          }

        });
    };
    $scope.getflashsale = function(provinceId, cityId, areaId, streetId){
      $interval.cancel(NowTer);
      localSpecialtyHomePageService.getflashsale(provinceId, cityId, areaId, streetId).success(function(res){
        console.log(res);
          if (res.data.flash.list&&res.data.flash.list.length!=0) {
            console.log(res.data.flash.list);
            $scope.newAndlimit.flashProductList = res.data.flash.list;
            $scope.systemTime = res.data.flash.systemTime;//服务器时间
            if($scope.systemTime>=$scope.newAndlimit.flashProductList[0].startTime){
                NowTer=$interval(function(){
              $scope.systemTime+=1000;
              if($scope.systemTime>=$scope.newAndlimit.flashProductList[0].endTime){
                $interval.cancel(NowTer);
                $scope.getflashsale($scope.addressMsg.provinceId, $scope.addressMsg.cityId, $scope.addressMsg.areaId, $scope.addressMsg.streetId);
              }
              },1000)
            }
            if($scope.systemTime<$scope.newAndlimit.flashProductList[0].startTime){
                NowTer=$interval(function(){
              $scope.systemTime+=1000;
              if($scope.systemTime>=$scope.newAndlimit.flashProductList[0].startTime){
                $interval.cancel(NowTer);
                $scope.getflashsale($scope.addressMsg.provinceId, $scope.addressMsg.cityId, $scope.addressMsg.areaId, $scope.addressMsg.streetId);
              }
              },1000)
            }
          }else{
           
          }
      })
    }
    //倒计时
    function countTimeNew(nowtime, endtime, index) {
      $scope.endT[index] = endtime - nowtime;
      newTime[index] = $interval(function() {
        $scope.endTt[index] = Math.floor($scope.endT[index] / 86400);

        $scope.endTh[index] = checkTime(Math.floor(($scope.endT[index] - $scope.endTt[index] * 86400) / 3600));

        $scope.endTm[index] = checkTime(Math.floor(($scope.endT[index] - $scope.endTt[index] * 86400 - $scope.endTh[index] * 3600) / 60));

        $scope.endTs[index] = checkTime($scope.endT[index] - $scope.endTt[index] * 86400 - $scope.endTh[index] * 3600 - $scope.endTm[index] * 60);
        $scope.endT[index]--;
        $scope.Timetotal[index] = $scope.endTt[index] +'天'+$scope.endTh[index]+':'+$scope.endTm[index]+':'+$scope.endTs[index];

        if ($scope.endT[index] == -1) {
          // $state.reload();
          $interval.cancel(newTime[index]);
        }
      }, 1000);
    }

    //众筹单独接口
    $scope.crowdFundingMsg = function (num) {
      newsendService.getcrowold(num)
        .success(function (response) {
          if(response.success){
            if(response.data.zActivitySuccessList.length!=0 || response.data.zActivityBeginningList.length!=0 || response.data.zActivityToBeginList.length!=0){
              $scope.crowdFundingList = true;
              $scope.zcold=response.data.zActivitySuccessList;
              $scope.zcnow=response.data.zActivityBeginningList;
              $scope.zcpre=response.data.zActivityToBeginList;
            }else{
              $scope.crowdFundingList = false;
              $scope.zcold=[];
              $scope.zcnow=[];
              $scope.zcpre=[];
            }

          }else{
            $scope.crowdFundingList=false;
            $scope.zcold=[];
            $scope.zcnow=[];
            $scope.zcpre=[];
          }
        });
    };
    //猜你喜欢 分类
    $scope.youLikeType = function() {
      localSpecialtyHomePageService.getSpecialtyLikeType(3)
        .success(function (response) {
          if(response.success && response.data.length!=0){
            $scope.youLikeTypeArr = response.data;
            if($scope.selectedIndex == 0){
              $scope.cateId = response.data[0].cId;
            }
          }else{
            $scope.youLikeTypeArr =[];
          //  PopupService.showToast('获取数据失败，请稍后重试。');
          }
        });
    };
    //猜你喜欢 商品数据
    $scope.youLikeDataList = function (type,cateId,pId,cId,rId,sId) {
      localSpecialtyHomePageService.getSpecialtyLikeDta(type,cateId,pId,cId,rId,sId)
        .success(function (response) {
          if(response.success && response.data!=null){
            $scope.youLikeDataArr = response.data; //猜你喜欢 商品数据
          }else{
            $scope.youLikeDataArr =[];
            console.log('获取猜你喜欢商品数据失败');
          }
        });
    };


    //轮播点击方法
    $scope.bannerClick = function (linkType, link, relationId) {
      var tempArr = link.split('&');
      switch (linkType) {
        case -1:
          BannerThemeService.getBannerTheme(relationId)
            .success(function (response) {
              $state.go('bannerDaily', {
                bannerId: relationId,
                layout: response.data.layout
              });
            });
          break;
        case 0:
          $state.go('bannerTheme', {
            bannerId: relationId
          });
          break;
        case 1: //单品页
          var productId = tempArr[0].slice(tempArr[0].indexOf('=') + 1);
          $state.go('productDetail', {
            fromType: '',
            fromUrl: '',
            o2oType: 0,
            productId: productId,
            storeId: $scope.storeId,
            shareStoreId: $rootScope.shareId
          });
          break;
        case 2: //领券中心/优惠券详情页
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
        case 3: //游戏页
          var gameId = link.slice(link.indexOf('=') + 1);
          $state.go('game', {
            gameId: gameId
          });
          break;
        case 4: //活动页
          if (tempArr[0].slice(tempArr[0].indexOf('=') + 1) == '日常活动') {
            BannerThemeService.getBannerTheme(tempArr[1].slice(tempArr[1].indexOf('=') + 1))
              .success(function (response) {
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
        case 5: //自定义类型页
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
        case 6: //众筹
          $state.go('crowdFunding');
          break;
        case 7: //新品
          if (!link) {
            $state.go('newSend');
          } else {
            $state.go('productDetail', {
              fromType: '',
              fromUrl: '',
              o2oType: 0,
              productId: link,
              storeId: $scope.storeId,
              shareStoreId: $rootScope.shareId
            });
          }
          break;
        case 8: //社群
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
    };
    /*返回*/
    $scope.goBack = function() {
      for (var i = 0; i <= remindArray.length; i++) {
        $interval.cancel(newTime[remindArray[i]]);
      }
      remindArray = [];
      $ionicHistory.goBack();
      // $state.go('homePage');
    };
    /*头部右上角*/
    $scope.showMenu = function () {
      if ($scope.isDisplay) {
        $scope.isDisplay = false;
        $scope.menuImg = 'img/ic_lookMore.png';
      } else {
        $scope.isDisplay = true;
        $scope.menuImg = 'img/ic_lookMoreActive.png';
      }
    };
    /*分享*/
    $scope.toShare = function () {

      if (!window.cordova){
        PopupService.showToast('请下载APP执行此操作');
      }else{
        if (!UserService.isUserLogin()) {
          $state.go('login');
          return;
        }else{
          $scope.showShare = true;
        }
      }
    };
    /*去首页*/
    $scope.toHomePage = function () {
      $scope.isDisplay = false;
      $state.go('homePage');
    };
    /*客服*/
    $scope.contactCustomer = function () {
      $scope.isDisplay = false;
      if (UserService.isUserLogin()) { //如果没有登录 跳转到登录页面
        // $state.go('login');
        var chatparams = {
          goods_id:'-1',//消息页等其他页面商品id固定传-1  单品页传商品id正常传  订单传商品id正常传
          clientGoods_type:'1',//传1
          //0:客服端不展示商品信息;1：客服端以商品ID方式获取商品信息(goods_id:商品ID，clientGoods_type = 1时goods_id参数传值不能为空)
          appGoods_type:'0'//单品页传1  订单传3 并吧三下面的四个参数传递过来
        };
        if (window.xneng) {
          window.xneng.NTalkerStartChat('hg_1000_1508927913371','普通客服组',chatparams,function(success){
            console.log('小能调起成功');
          },function(error){
            console.log(error);
          });
        }
        else {
          window.open('http://m.ehaier.com/v3/h5/sg/common/customService.html'+'?flag='+$localstorage.get('sg_login_token_secret').substring(6), '_blank', 'location=no');
        }
      } else {
        $state.go('login');
      }
    };
    /*分享功能*/
    $scope.shareToPlatform = function (index) {
      if (!UserService.getUser().mid) {
        $state.go('login');
        return;
      }
      var title = '顺逛·特产汇 汇集全国优质特产',
        content = '找特产，来顺逛，质量更可靠，价格更亲民，特产汇欢迎您的带来',
        pic = 'http://cdn09.ehaier.com/shunguang/H5/www/img/specialty_share_pic.png', //本地 img
        url = UrlService.getShareLinkHeader() + 'localSpecialtyHomePage/'+$scope.storeId;//分享链接
      var callbackWarpper=function(){
        CreditService.shareSuccessCallback();
      };
      if (window.umeng) {
        if (index == 0) {
          window.umeng.shareToSina(title, content, pic, url, 0, null, callbackWarpper);
        } else if (index == 1) {
          window.umeng.shareToWechatSession(title, content, pic, url, 0, null, callbackWarpper);
        } else if (index == 2) {
          window.umeng.shareToWechatTimeline(title, content, pic, url, 0, null, callbackWarpper);
        } else if (index == 3) {
          window.umeng.shareToQQ(title, content, pic, url, 0, null, callbackWarpper);
          CreditService.qqShare();
        } else if (index == 4) {
          window.umeng.shareToQzone(title, content, pic, url, 0, null, callbackWarpper);
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
    $scope.copeText = function (text) {
      if (window.cordova) {
        cordova.plugins.clipboard.copy(text);
        PopupService.showToastShort('复制成功');
        $scope.isShowCopyButton = false;
      } else {
        PopupService.showToast('请下载APP执行此操作');
      }
    };
    /*分享取消*/
    $scope.cancelShare=function () {
      $scope.showShare = false;
      $scope.isDisplay = false;
    };

    /*点击省级馆*/
    $scope.goToSpecialtyVenue = function (index,regionId) {
      $scope.localSelect = index;
      $scope.moreSpecialtyModal.hide();
      $timeout(function () {
        $state.go('SpecialtyVenueHome',{
          regionId:regionId,
          streetId:$scope.addressMsg.streetId
        });
      },600);

    };

    /*更多特产*/
    $scope.moreSelectSpecialty = function () {
      $scope.moreSpecialtyModal.show();
      localSpecialtyHomePageService.getAllMsg()
        .success(function (response) {
          if(response.success){
            $scope.allSpecialtyArr = response.data;
          }else{
            console.log('获取全国特产馆失败');
          }
        });

    };
    /*关闭更多特产场馆*/
    $scope.closeMoreSpecialty = function () {
      $scope.moreSpecialtyModal.hide();
    };
    function checkTime(item) {
      if(item < 10){
        item = '0' + item;
      }
      return item;
    }
    //限时抢购
    // function  limitCountTimes (time) {
    //   var hours = checkTime(parseInt((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    //   var minutes =checkTime(parseInt((time % (1000 * 60 * 60)) / (1000 * 60)));
    //   var seconds = checkTime(Math.floor((time % (1000 * 60)) / 1000));
    //   $scope.moreCountTime = {
    //     hours: hours,
    //     minutes: minutes,
    //     seconds: seconds
    //   };
    // }
    //地址初始化
    $scope.getAddressInit = function () {
      mainRes($scope.addressMsg.streetId);
      //限时抢购
      $scope.newProductAndTimeLimit($scope.addressMsg.provinceId, $scope.addressMsg.cityId, $scope.addressMsg.areaId, $scope.addressMsg.streetId);
      $scope.getflashsale($scope.addressMsg.provinceId, $scope.addressMsg.cityId, $scope.addressMsg.areaId, $scope.addressMsg.streetId);
     //猜你喜欢商品数据
      $timeout(function () {
        $scope.youLikeDataList(3,$scope.cateId,$scope.addressMsg.provinceId, $scope.addressMsg.cityId, $scope.addressMsg.areaId, $scope.addressMsg.streetId);
      },800);
    };
    //获取地址
    $scope.getAddress = function () {
      //地址参数存储
      localSpecialtyHomePageService.getPositionId()
        .success(function (res) {
          if(res.success){
            addressMessage = eval(res.data)[0];
            if(addressMessage.provinceId!=undefined && addressMessage.cityId!=undefined && addressMessage.areaId!=undefined  && addressMessage.streetId!=undefined ){
              $scope.addressMsg = { //地址
                provinceId:addressMessage.provinceId,
                cityId:addressMessage.cityId,
                areaId:addressMessage.areaId,
                streetId:addressMessage.streetId
              };
              $scope.getAddressInit();
            }else{
              $scope.addressMsg = { //地址
                provinceId:$scope.provinceId,
                cityId:$scope.cityId,
                areaId:$scope.districtId,
                streetId:$scope.streetId
              };
              $scope.getAddressInit();
            }
          }else{ //获取地址失败 用默认地址
            $scope.addressMsg = { //地址
              provinceId:$scope.provinceId,
              cityId:$scope.cityId,
              areaId:$scope.districtId,
              streetId:$scope.streetId
            };
            $scope.getAddressInit();
          }
        })
        .error(function () {
          $scope.addressMsg = { //地址
            provinceId:$scope.provinceId,
            cityId:$scope.cityId,
            areaId:$scope.districtId,
            streetId:$scope.streetId
          };
          $scope.getAddressInit();
        });
    };

    $rootScope.$on('CACHE_SUCCESS', function (event, data) {
      for (var i = 0; i <= remindArray.length; i++) {
        $interval.cancel(newTime[remindArray[i]]);
      }
      $interval.cancel($scope.timer);
      $interval.cancel($scope.timer1);
      var params = {
        template: '地址切换中，请稍后...',
        duration: 1000
      };
      $ionicLoading.show(params);
      $scope.getAddress();

    });



    //去详情
    $scope.goProductDetail = function (pId) {
      $state.go('productDetail', {
        fromType: '',
        fromUrl: '',
        o2oType: 0,
        productId: pId,
        storeId: $scope.storeId,
        shareStoreId: $rootScope.shareId
      });
    };


    //筛选模板
    $ionicModal.fromTemplateUrl('templates/localSpecialty/moreSpecialtyModal.html', {
      scope: $scope,
      animation: 'slide-in-left',
      backdropClickToClose: false
    }).then(function(modal) {
      $scope.moreSpecialtyModal = modal;
    });
    $scope.$on('$destroy', function() {
      $scope.moreSpecialtyModal.remove();
    });
    /*猜你喜欢分类*/
    $scope.goToClassify=function (index,cateId) {
      $scope.selectedIndex = index;
      $scope.cateId = cateId;
      $scope.youLikeDataList(3,cateId,$scope.addressMsg.provinceId, $scope.addressMsg.cityId, $scope.addressMsg.areaId, $scope.addressMsg.streetId);
    };
    /*跳转*/
    $scope.toGoSecialtyVenueHome = function (regionId) {
      $state.go('SpecialtyVenueHome',{
        regionId:regionId,
        streetId:$scope.addressMsg.streetId
      });
    };
    $scope.hideMenu = function () {
      $scope.isDisplay = false;
      $scope.menuImg = 'img/ic_lookMore.png';
    };
    //离开页面
    $scope.$on('$ionicView.beforeLeave', function (e, v) {
      $scope.isDisplay = false;
      for (var i = 0; i <= remindArray.length; i++) {
        $interval.cancel(newTime[remindArray[i]]);
      }
        $interval.cancel($scope.timer);
        $interval.cancel($scope.timer1);
    });
    /*进入页面*/
    $scope.$on('$ionicView.beforeEnter', function (event,data) {
      if(!$rootScope.shareId){
        $rootScope.shareId = $stateParams.storeId;
      }
      $scope.isDisplay = false;
      nowT = new Date().getTime();
      if(data.direction == 'back'){
        $scope.getCartNum();
         $scope.newProductAndTimeLimit($scope.addressMsg.provinceId, $scope.addressMsg.cityId, $scope.addressMsg.areaId, $scope.addressMsg.streetId);
        $scope.getflashsale($scope.addressMsg.provinceId, $scope.addressMsg.cityId, $scope.addressMsg.areaId, $scope.addressMsg.streetId);
      }else{
        //$interval.cancel($scope.timer);
        //$interval.cancel($scope.timer1);
        //for (var i = 0; i <= remindArray.length; i++) {
        //  $interval.cancel(newTime[remindArray[i]]);
        //}
        $scope.init();
        GetSwitchChecked();
        $scope.showShare = false;
        $scope.localSelect = 0;
      }
    });

  }]);


APP.service('localSpecialtyHomePageService', ['$http', 'UrlService', function ($http, UrlService) {

  this.getAllMsg = function () { //全国特产馆
    return $http.get(UrlService.getNewUrl('ALL_SPECIALTY'));
  };
  this.getPositionId = function () { //获取省市区街道
    return $http.get(UrlService.getUrl('GET_POSITION_FROM_COOLIE'));
  };
  this.getMaster = function (street) { //主接口
    var params ={
      streetId: street,
      noLoading: true
    };
    return $http.get(UrlService.getNewUrl('LOCAL_SPECIALTY'),params);
  };
  this.getNewAndLimit = function (provinceId,cityId,districtId,street) { //新品 限时
    var params = {
      provinceId: provinceId,
      cityId: cityId,
      districtId: districtId,
      streetId: street,
      noLoading: true
    };
    return $http.get(UrlService.getNewUrl('NEW_AND_LIMIT'),params);
  };
  this.getflashsale = function(provinceId,cityId,districtId,street){
    var params = {
          provinceId: provinceId,
          cityId: cityId,
          districtId: districtId,
          streetId: street
    };
    return $http.get(UrlService.getNewUrl('NEW_LOCAL_FLASHSALE'),params);
  };
  this.getSpecialtyLikeType = function (type) { //推荐分类
    var params ={
      type:type
    }
    return $http.get(UrlService.getNewUrl('LOCAL_SPECIALTY_LIKE_TYPE'),params);
  };
  this.getSpecialtyLikeDta = function (type,cateId,pId,cId,rId,sId) { //推荐商品
    var params ={
      type:type,
      cateId:cateId,
      pId:pId,
      cId:cId,
      rId:rId,
      sId:sId,
      noLoading: true
    };
    return $http.get(UrlService.getNewUrl('LOCAL_SPECIALTY_LIKE_DATA'),params);
  };


}]);
