APP.controller('GameController', ['$scope', '$rootScope', '$stateParams', '$state','$timeout','UrlService',
  '$interval','$ionicPopup','GameService','PopupService','$ionicHistory','$ionicModal','UserService','CreditService','$ionicScrollDelegate','$http','ProductDetailService','CommonAddressService',
  function ($scope, $rootScope, $stateParams, $state,$timeout,UrlService,$interval,$ionicPopup,GameService,PopupService,$ionicHistory,$ionicModal,UserService,CreditService,$ionicScrollDelegate,$http,ProductDetailService,CommonAddressService) {



    $scope.modal = undefined;
    $scope.gameId = $stateParams.gameId;
    $scope.gameTitle ;
    $scope.gameDesc ;$scope.isShowForm  =false;
    $scope.startTime = '';
    $scope.endTime = '';
    $scope.hasBkgColor = true;
    var sharePic = 'http://www.ehaier.com/mstatic/wd/v2/img/sg.png';
    $scope.isAdmin = $stateParams.isAdmin;//是否后台查看

    $scope.shareStoreId;

    var height22 = window.innerWidth*0.22;
    $scope.gridHeight ={
      height:height22+'px'
    };
    $scope.gridHeightMiddle ={
      height:(height22*2+8)+'px'
  };

    $scope.addressInfo = {};
    $scope.game = {};

    $scope.prizeList = [];
    $scope.startP = 0;
    $scope.endP = 11;
    $scope.curP = undefined;//高亮 grid
    $scope.timer = undefined;
    $scope.isRuning = false;//是否正在抽奖，正在抽奖时 点击抽奖无效
    var interval = 330;//每330毫秒走一格

    //地址选择框高度
    var screenHeight = window.innerHeight;
    var topHeight = 250 + 123;
    var topDis = 87;
    var contentHeight = screenHeight - topHeight + 'px';
    var topDisHeight = topDis + 'px';
    $scope.contentHeight = {
      'height': contentHeight
      //      'top':topDisHeight
    }
    /** 地址变量声明 **/
    $scope.addressTitle = '配送至';
    $scope.dataAdd = null;
    $scope.flag = 'CHANGEADDRESS_LOCATION_GAME';
    $scope.defaultValue = null;
    $scope.level = 0;
    var addressMessage = {}; //自动定位地址信息

    /*********************分享标签－whiteBird start*********************/
    $scope.showShare = false;
    /*********************分享标签－whiteBird end*********************/

    //IOS特殊样式
    $scope.topBtnCss4IOS = {};
    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {//只有ios app 特有的样式
      $scope.topBtnCss4IOS = {
        top: '12px'
      }
    }

    function date2Str(ms){

      var date = new Date(ms);

      var year = date.getFullYear();
      var month = date.getMonth()+1;    //js从0开始取
      var date1 = date.getDate();
      var hour = date.getHours();
      var minutes = date.getMinutes();
      var second = date.getSeconds();
      return (year+"年"+month+"月"+date1+"日" );//+hour+"时"+minutes +"分"+second+"秒"
    }

    $scope.$on('$ionicView.beforeLeave', function (e, v) {
      $scope.watch();
    })
    //特殊情况 ，!!!!!!!!!!!!当奖品全被抽完，灯转转灭了， 提示谢谢参与
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.goBackFlag=true;
      $scope.shareStoreId = $stateParams.shareStoreId;//分享 memberID
      $scope.isAdmin = $stateParams.isAdmin;//是否后台查看
      $scope.init();
      //地址
      $scope.nowLevel=0;
      $scope.nowLevelIndex=[-1,-1,-1,-1];
      $scope.provinceTop=0;
      $scope.cityTop=0;
      $scope.areaTop=0;
      $scope.finish=false;
      $scope.watch=$scope.$watch('finish',function(newValue,oldValue){
	      if(newValue){
	        $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0,$scope.provinceTop);
	      }
      });
      $scope.addressInit($scope.dataAdd,$scope.defaultValue,'CHANGEADDRESS_LOCATION_GAME',0);
      $scope.$on('$destroy', function () {
	      $scope.addressModal.remove();
	    });
    });
    $scope.init = function () {
      $scope.prizeList = new Array(12);

      /*********************分享标签－whiteBird start*********************/
      $scope.showQQ = false;
      $scope.showWeChat = false;
      /*********************分享标签－whiteBird end*********************/

      $scope.startP = 0;
     // $scope.endP = 11;

      $scope.curP = undefined;//高亮 gridd
      GameService.gameInfo({gameId:$scope.gameId}).success(function(response){
        if(response.success){
          $scope.prizeList = response.data.gameImg;
          $scope.game=response.data.game;
          $scope.startTime = date2Str($scope.game.beginTime*1000);
          $scope.endTime = date2Str($scope.game.endTime*1000);
          $ionicModal.fromTemplateUrl('templates/common/CommonGame.html', {
            scope: $scope,
            animation: 'slide-in-left'
          }).then(function (modal) {
            $scope.modal = modal;
          });
          if(!$scope.game.backgroundPic){//没传背景图特殊处理
            $scope.hasBkgColor = false;
          }

        }else{
          //请求失败
          PopupService.showToast(response.message);
        }

      }).error(function(){
        PopupService.showMsg('网络错误');
      });

    };
    var counter = 0//记录转了多少格
      , circle = Math.floor(Math.random()*3)+2;//最少转的圈数 2,3,4随机
      var speedUp1, speedUp2, slowDown1,slowDown2;  //加速点 ，减速点
    console.log('circle--random--'+circle);
    $scope.clickChou  =function(){
     if($scope.isRuning) {
       console.log('is runing !!');
       return;
     }
      //从后台得到停止位置时 ,计算，加速减速点
      GameService.luckDraw({gameId:$scope.gameId}).success(function(response){
        if(response.success&&response.result.prizeType!=-1){
          $scope.chouResult =  response.result;
          $scope.endP = response.result.postion-1;//得到停止位置

          $scope.start();

        }
        else if(response.success&&response.result.prizeType == -1){
          $ionicPopup.alert({
            template: response.result.message
          });
        }
        else if(response.message && response.message.indexOf('抽奖次数')>-1){
          $ionicPopup.alert({
            template: response.message
          });
          $scope.curP = undefined;
        }
        else if(response.message && response.message.indexOf('GAME')>-1){
          $ionicPopup.alert({
            template: '对不起，奖品已被抽光'
          });
          $scope.curP = undefined;
        }
        else if(response.message && response.message.indexOf('未登录')>-1){
          $scope.curP = undefined;
          $state.go('login');
        }
        else{//后台报错// 或者未登录
          $scope.curP = undefined;
          if(response.errorCode == '-100'){//登录失效不需要打印错误信息
            return;
          }
          $ionicPopup.alert({
            template: response.message
          });

        }

      }).error(function(msg){
        PopupService.showToast('网络错误');
      });


     // $scope.start();
      $scope.curP = 0;
      var countZong = 12*circle + $scope.endP;
      speedUp1 =5 ;speedUp2 = circle==4?15:10 ;slowDown1 = circle==4?countZong-15:countZong-10;slowDown2 = circle==4?countZong -10:countZong -5;
    };

    $scope.start = function(){
      if( $scope.endP<0  || $scope.endP>11){
        console.log('error, 抽奖错误，返回的中奖position 非法--');
        return ;
      }
      $scope.isRuning = true;
      $scope.timer = $timeout(function(){
        counter ++;
        if(counter>=speedUp1){//加速
          interval =100;
        }else if(counter>=speedUp2){
          interval = 60; //再减速
        }else if(counter>=slowDown1){
          interval = 100;
        }
        else if(counter>=slowDown2){
          interval = 500;
        }
        //停止到指定位置
        if(counter>circle*12 && $scope.curP === $scope.endP){
          counter =0;
          $scope.isRuning = false;
          $scope.showForm();//转动停止，打开提示层
          return;
        }
        if($scope.curP <12) {
          $scope.curP++;
        }else{
          $scope.curP = 0;
        }
        $scope.start();
      },interval);
    };
    $scope.openPic = function(){
      $scope.modal.show();
    };
    $scope.closePic = function(){
      $scope.modal.hide();
    };
    $scope.share = function(){//当 todo showForm为true时 diable 该按钮


      /*********************分享标签－whiteBird start*********************/
      if(window.device && window.device.hasNewShare){
        if($scope.isAdmin && $scope.isAdmin==1){
          return;
        }
        if (!UserService.getUser().mid) {
          PopupService.showToast('请先登录,再分享');
          return;
        }
        if($scope.isShowForm){//有弹出层时 不分享
          return ;
        }
        console.log("分享");
        //新分享样式
        $scope.showShare = !$scope.showShare;
        /*********************分享标签－whiteBird end*********************/
      }else{

        //旧分享样式
        if($scope.isAdmin && $scope.isAdmin==1){
          return;
        }
        if (!UserService.getUser().mid) {
          PopupService.showToast('请先登录,再分享');
          return;
        }
        if($scope.isShowForm){//有弹出层时 不分享
          return ;
        }
        console.log("分享");
        if (window.umeng) {
          var title = '顺逛抽奖活动',
              content = '给您推荐顺逛每日抽奖活动,不可错过哦!',
              pic = sharePic,
              url = UrlService.getShareLinkHeader() + 'game/' + $scope.gameId + '/' + UserService.getUser().mid+'/';
          window.umeng.share(title, content, pic, url,0);
        }

      }

    };
    $scope.goBack = function(){//当 todo showForm为true时 diable 该按钮
      if($scope.isAdmin && $scope.isAdmin==1){
        return;
      }
      if($scope.isShowForm){//有弹出层时 不分享
        return ;
      }
      if($scope.goBackFlag){
        $scope.goBackFlag=false;
        $ionicHistory.goBack();
      }

    };
    $scope.showForm = function(){
      $scope.isShowForm = true;
    };
    $scope.hideForm = function(){
      $scope.isShowForm = false;
    };

    // todo  验证电话 ，其他非空
    $scope.confirmGameInfo = function(){
      if(!$scope.chouResult.consignee){
        $ionicPopup.alert({
          title: '提示',
          template: '收件人必须填写！'
        });
        return;
      }
      if (!($scope.globalConstant.mobileNumberRegExp.test($scope.chouResult.mobile))) {
        $ionicPopup.alert({
          title: '提示',
          template: '请输入正确的手机号！'
        });
        return;
      }
      if(!$scope.chouResult.regionName){
        $ionicPopup.alert({
          title: '提示',
          template: '收件地区必须填写！'
        });
        return;
      }
      if(!$scope.chouResult.regionName){
        $ionicPopup.alert({
          title: '提示',
          template: '收件地区必须填写！'
        });
        return;
      }
      if(!$scope.chouResult.address){
        $ionicPopup.alert({
          title: '提示',
          template: '地址必须填写！'
        });
        return;
      }



      var param = {
        gameId: $scope.chouResult.gameId,
        uuid:$scope.chouResult.uuid,
        prizeId:$scope.chouResult.gamePrizeId,
        consignee: $scope.chouResult.consignee,
        mobile: $scope.chouResult.mobile,
        address: $scope.chouResult.address,
        regionName: $scope.chouResult.regionName,
        isDefault: 0, //这个参数哪里来的
        provinceId: $scope.chouResult.provinceId,
        cityId: $scope.chouResult.cityId,
        regionId: $scope.chouResult.regionId,
        streetId: $scope.chouResult.streetId //街道
      };
      GameService.confirmGameInfo(param).success(function(response){
        var cc = response;
        if(response.success){
          PopupService.showToast('提交成功');
          $scope.hideForm();
        }else{
          alert('提交失败')
        }

      }).error(function(msg){
        alert('网络错误');
      });
    };
    $scope.chouResult ={"gameId":189,
      "backgroundPic":null,
      "titleHidden":1,
      "gameTitle":"游戏主题"
      ,"activityPic":null,
      "timeHidden":1,
      "beginTime":1468208908,
      "endTime":1469677709,
      "activityDescHidden":1,
      "activityDesc":"活动说明",
      "image":"",
      "winnerListId":292,
      "prizeType":1,
      "address":"1234575666",
      "mobile":"13698541258",
      "consignee":"哈哈哈",
      "prizeName":"苹果7",
      "regionName":"山东青岛城阳区",
      "provinceId":16,"cityId":173,
      "regionId":2444,"isClick":true,
      "postion":1
    };
     //地址窗口
    $scope.addressTop = function () {
      $scope.addressTipFlag=false;
      $scope.provinceTop = 0;
      $scope.nowLevel = 0;
      $scope.nowLevelIndex = [-1, -1, -1, -1];
      $scope.provinceDis = false;
      $scope.cityDis = false;
      $scope.areaDis = false;
      $scope.addressModal.show();
      $scope.dataAdd = null;
      $scope.defaultValue = null;
      $scope.selectProvince = '';
      $scope.selectCity = '';
      $scope.selectArea = '';
      $scope.addressInit($scope.dataAdd, $scope.defaultValue, 'CHANGEADDRESS_LOCATION_GAME', 0);
    }
    //地址初始化
    $scope.addressInit = function (defaultValue, data, flag, level) {
      $scope.addressTipFlag=false;
      $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
      $scope.addressTitle = '配送至';
      if (defaultValue) {
        $scope.defaultValue = JSON.parse(defaultValue);
      } else {
        $scope.defaultValue = {};
      }
      $scope.level = level;
      if (data) {
        $scope.dataAdd = JSON.parse(data);
        $scope.nowLevel = $scope.level;
        $scope.nowLevel = $scope.nowLevel * (-1);
        console.log($scope.nowLevelIndex);
        for (var i = 0; i < $scope.nowLevelIndex.length; i++) {
          if (i > $scope.nowLevel) {
            $scope.nowLevelIndex[i] = -1;
          }
        }
      } else {
        $scope.finish = false;
        $scope.addressTip='正在获取地址信息...';
        $scope.addressTipFlag=true;
        $scope.dataAdd="";
        //第一次取全国的省直辖市信息
    //     $http.get("data/region.json")
    //       .success(function (response) {
    //         $scope.dataAdd = response.data;
    //         $scope.finish = true;
    //         $scope.nowLevel = $scope.level;
    //         $scope.nowLevel = $scope.nowLevel * (-1);
    //         console.log($scope.nowLevel);
    //         for (var i = 0; i < $scope.nowLevelIndex.length; i++) {
    //           if (i > $scope.nowLevel) {
    //             $scope.nowLevelIndex[i] = -1;
    //           }
    //         }
    //       })
    //       .error(function (err) {
    //         PopupService.showToast('获取地址信息失败！');
    //       })
    //   }
    // }
    //第一次取全国的省直辖市信息
        ProductDetailService.getLocationList('', 0).success(function (response) {
            $scope.dataAdd = response.data;
            $scope.addressTipFlag=false;
            $scope.finish = true;
            $scope.nowLevel = $scope.level;
            $scope.nowLevel = $scope.nowLevel * (-1);
            var defaultValueFy = JSON.stringify($scope.defaultValue);
            var dataAddFy = JSON.stringify($scope.dataAdd);
            //         $scope.addressInit(defaultValueFy,dataAddFy,$scope.flag,$scope.level)
            console.log($scope.nowLevel);
            for (var i = 0; i < $scope.nowLevelIndex.length; i++) {
              if (i > $scope.nowLevel) {
                $scope.nowLevelIndex[i] = -1;
              }
            }
          })
          .error(function (err) {
            PopupService.showToast('获取地址信息失败！');
          })
      }
    }
    //重新选择的下边框
    $scope.bottomBorder = {
      'border-bottom': "2px solid red"
    }
    $scope.provinceFlag = false;
    $scope.cityFlag = false;
    $scope.areaFlag = false;
    $scope.selectFlag = true;
    $scope.provinceDis = false;
    $scope.cityDis = false;
    $scope.areaDis = false;
    //返回重新选择省
    $scope.provinceSel = function () {
      $scope.addressInit(null, null, 'CHANGEADDRESS_LOCATION_GAME', 0);
      $scope.selectCity = '';
      $scope.selectArea = '';
      $scope.provinceFlag = true;
      $scope.selectFlag = false;
      $scope.provinceDis = true;
      $scope.cityDis = false;
      $scope.areaDis = false;
    }
    //地址
    var isGoing = false;
    $scope.goSelect = ionic.Utils.debounce(function (index, item) {
      for (var i = 0; i < $scope.nowLevelIndex.length; i++) {
        if (i > $scope.nowLevel) {
          $scope.nowLevelIndex[i] = -1;
        }
      }
      $scope.dataAdd="";
      $scope.nowLevelIndex[$scope.nowLevel] = index;
      var item = arguments[1];
      var index = arguments[0];
      $scope.level = $scope.level - 1; //-1,下一个 为 －2 ，
      $scope.defaultValue['text' + $scope.level] = item.text;
      $scope.defaultValue['value' + $scope.level] = item.value;
      if ($scope.level > -2) { //xyz修改2级本地获取
        console.log($scope.level);
        if ($scope.level == -1) { //省
          $scope.selectProvince = item.text;
          $scope.provinceIndex = index;
          $scope.provinceFlag = false;
          $scope.selectFlag = true;
          $scope.provinceDis = true;
          $scope.provinceTop = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
          $scope.nowLevel = $scope.level;
          $scope.nowLevel = $scope.nowLevel * (-1);
        } else {
          // $scope.dataAdd = $scope.dataAdd[index].children;
        }
        ah = $scope.level * -1;
        $scope.addressTip='正在获取地址信息...';
        $scope.addressTipFlag=true;
        ProductDetailService.getLocationList(item.value, ah).success(function (response) {
          if (ah == 1) {
            areaValueCity = item.value;
          }
          $scope.dataAdd = response.data;
          $scope.addressTipFlag=false;
          var defaultValueFy = JSON.stringify($scope.defaultValue);
          var dataAddFy = JSON.stringify($scope.dataAdd);
          $scope.addressInit(defaultValueFy, dataAddFy, $scope.flag, $scope.level);
        }).error(function (err) {
          PopupService.showToast('获取地址信息失败！');
        });
        $scope.levelArea = $scope.level;
        $scope.levelArea = $scope.levelArea + 1;
        //重选市
        $scope.citySel = function () {
          $scope.level = $scope.levelArea;
          $scope.addressTip='正在获取地址信息...';
          $scope.addressTipFlag=true;
          $scope.dataAdd="";
          ProductDetailService.getLocationList(areaValueCity, 1).success(function (response) {
            $scope.dataAdd = response.data;
            $scope.addressTipFlag=false;
            var defaultValueFy = JSON.stringify($scope.defaultValue);
            var dataAddFy = JSON.stringify($scope.dataAdd);

            $scope.addressInit(defaultValueFy, dataAddFy, $scope.flag, -1);
            $scope.selectArea = '';
            $scope.cityFlag = true;
            $scope.selectFlag = false;
            $scope.provinceDis = true;
            $scope.cityDis = true;
            $scope.areaDis = false;
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0, $scope.cityTop);
          }).error(function (err) {
            PopupService.showToast('获取地址信息失败！');
          });
        }
      } else if ($scope.level > -4) { //xyz添加远端获取
        $scope.selectCity = $scope.defaultValue['text-2'];
        $scope.provinceFlag = false;
        $scope.cityFlag = false;
        $scope.selectFlag = true;
        $scope.provinceDis = true;
        $scope.cityDis = true;
        $scope.areaDis = false;
        if ($scope.level == -3) {
          $scope.selectArea = item.text;
          $scope.cityFlag = false;
          $scope.areaFlag = false;
          $scope.selectFlag = true;
          $scope.provinceDis = true;
          $scope.cityDis = true;
          $scope.areaDis = true;
          $scope.areaTop = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top
        } else {
          $scope.cityTop = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
        }
        ah = $scope.level * -1;
        $scope.addressTip='正在获取地址信息...';
        $scope.addressTipFlag=true;
        ProductDetailService.getLocationList(item.value, ah).success(function (response) {
          $scope.dataAdd = response.data;
          $scope.addressTipFlag=false;
          if (ah == 2) {
            areaValue = item.value;
          }
          var defaultValueFy = JSON.stringify($scope.defaultValue);
          var dataAddFy = JSON.stringify($scope.dataAdd);

          $scope.addressInit(defaultValueFy, dataAddFy, $scope.flag, $scope.level);
        }).error(function (err) {
          PopupService.showToast('获取地址信息失败！');
        });
        $scope.levelArea = $scope.level;
        $scope.levelArea = $scope.levelArea + 1;
        //重选区
        $scope.areaSel = function () {
          $scope.addressTip='正在获取地址信息...';
          $scope.addressTipFlag=true;
          $scope.dataAdd="";
          $scope.level = $scope.levelArea;
          ProductDetailService.getLocationList(areaValue, 2).success(function (response) {
            $scope.dataAdd = response.data;
            $scope.addressTipFlag=false;
            console.log($scope.dataAdd);
            var defaultValueFy = JSON.stringify($scope.defaultValue);
            var dataAddFy = JSON.stringify($scope.dataAdd);

            $scope.addressInit(defaultValueFy, dataAddFy, $scope.flag, $scope.level);
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0, $scope.areaTop);
            $scope.areaFlag = true;
            $scope.selectFlag = false;
            $scope.provinceDis = true;
            $scope.cityDis = true;
            $scope.areaDis = true;
          }).error(function (err) {
            PopupService.showToast('获取地址信息失败！');
          });
        }
      } else {
        if (isGoing) {
          return;
        }
        $timeout(function () {
          isGoing = false;
        }, 1500);
        $rootScope.$broadcast($scope.flag, $scope.defaultValue);
        isGoing = true;
        //      $scope.$ionicGoBack($scope.level);
        $scope.closeAddressModal();
      }
    }, 300);

    $rootScope.$on('CHANGEADDRESS_LOCATION_GAME', function (event, data) {

      $scope.textOne = data['text-1'];
      $scope.textTwo = data['text-2'];
      $scope.textThree = data['text-3'];
      $scope.textFour = data['text-4'];
      $scope.chouResult.provinceId = data['value-1'];
      $scope.chouResult.cityId = data['value-2'];
      $scope.chouResult.regionId = data['value-3'];
      $scope.chouResult.streetId = data['value-4'];//街道
      $scope.chouResult.regionName =  $scope.textOne+ $scope.textTwo+ $scope.textThree+ $scope.textFour;

    });
    //自动定位
    $scope.getPosition = function () {
      if ($rootScope.globalConstant.autoPosition == '定位中···') {
        return;
      }
      addressMessage = CommonAddressService.getAddressInfo();
      var detailAddress = addressMessage.regionName + '/' + addressMessage.streetName;
      ProductDetailService.addAddress(addressMessage.provinceId, addressMessage.cityId, addressMessage.areaId, detailAddress, addressMessage.streetId)
        .success(function () {
          var autoAddress = {
            'text-1': addressMessage.provinceName,
            'text-2': addressMessage.cityName,
            'text-3': addressMessage.regionName,
            'text-4': addressMessage.streetName,
            'value-1': addressMessage.provinceId,
            'value-2': addressMessage.cityId,
            'value-3': addressMessage.areaId,
            'value-4': addressMessage.streetId
          };
          $rootScope.$broadcast($scope.flag, autoAddress);
          $scope.addressModal.hide();
        })
    };
    //窗口modal
    $ionicModal.fromTemplateUrl('templates/common/CommonLocation.html', {
      scope: $scope,
      animation: 'slide-in-up',
    }).then(function (modal) {
      $scope.addressModal = modal;
    });
    $scope.closeAddressModal = function () {
      $scope.addressModal.hide();
    };


    /*********************分享标签－whiteBird start*********************/
      //复制
    $scope.copeText = function (text) {
      if(window.cordova)
      {
        cordova.plugins.clipboard.copy(text);
        PopupService.showToastShort('复制成功');
      }
      else
      {
        PopupService.showToast('请下载APP执行此操作');
      }
    };
    $scope.hideblackCover = function(){
      $scope.showShare = false;
    };
    $scope.shareToPlatform = function(index){

      var title = '顺逛抽奖活动',
          content = '给您推荐顺逛每日抽奖活动,不可错过哦!',
          pic = sharePic,
          url = UrlService.getShareLinkHeader() + 'game/' + $scope.gameId + '/' + UserService.getUser().mid+'/';
      if (window.umeng) {
        if(index==0)
        {
          window.umeng.shareToSina(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
        }else if(index==1)
        {
          window.umeng.shareToWechatSession(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
        }else if(index==2)
        {
          window.umeng.shareToWechatTimeline(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
        }else if(index==3)
        {
          window.umeng.shareToQQ(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
          CreditService.qqShare();
        }else if(index==4)
        {
          window.umeng.shareToQzone(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
          CreditService.qqShare();
        }
        if(index==5)
        {
          $scope.copeText(url);
        }else{
          CreditService.successShare();
        }
      } else {
        alert('umeng undefined 只能在app分享');
      }

      $scope.showShare = false;
    };
    /*********************分享标签－whiteBird end*********************/



  }]);
