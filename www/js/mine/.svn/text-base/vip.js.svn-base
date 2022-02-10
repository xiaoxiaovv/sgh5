'use strict';

// APP.controller('VipController',['$scope','$ionicPopup','$ionicHistory',function($scope,$ionicPopup,$ionicHistory){
//   $scope.isShowMore = false;
//   $scope.isShowRule = false;
//   $scope.goBack = function(){
//     $ionicHistory.goBack();
//   }
//   $scope.showMore = function(){
//     $scope.isShowMore = !$scope.isShowMore;
//   }
//   $scope.showRule = function(){
//     $scope.isShowRule = !$scope.isShowRule;
//   }
//   $scope.closeRule = function(){
//     $scope.isShowRule = false;
//   }
//   $scope.levelUp = function(){
//     $ionicPopup.alert({
//       template:'<div style="font-size: 17px;color: #030303;letter-spacing: -0.41px;line-height: 26px;">恭喜，你已经是旅长了，还有345金币你就可以升级为司令！</div>',
//       okText:'我知道啦'
//     })
//   }
// }])

APP.controller('VipController', ['CommonAddressService','ProductDetailService','$scope', '$rootScope', '$stateParams', '$state', '$timeout', 'UrlService', '$interval', '$ionicPopup', 'GameService', 'PopupService', '$ionicHistory', '$ionicModal', 'UserService', '$http', 'CreditService', 'InAppBrowserService', '$ionicScrollDelegate', function (CommonAddressService,ProductDetailService,$scope, $rootScope, $stateParams, $state, $timeout, UrlService, $interval, $ionicPopup, GameService, PopupService, $ionicHistory, $ionicModal, UserService, $http, CreditService, InAppBrowserService, $ionicScrollDelegate) {

  $scope.isShowMore = false;
  $scope.isShowRule = false;
  $scope.closeAll = function () {
    $scope.isShowMore = false;
    $scope.isShowRule = false;
  };
  $scope.showMore = function () {
    $scope.isShowMore = !$scope.isShowMore;
  };
  $scope.showRule = function () {
    $scope.isShowRule = !$scope.isShowRule;
  };
  $scope.closeRule = function () {
    $scope.isShowRule = false;
  };
  //申请对话框
  $scope.applyDialog = function () {
    return $ionicPopup.show({
      cssclass: 'leader-popup',
      template: '\n        <div class=\'apply-list popup-form\'>\n          <div class = \'form-title\' ng-show=\'teamName=="\u76DF\u4E3B"\'>\u606D\u559C\u60A8\u83B7\u5F97\u7533\u8BF7\u76DF\u4E3B\u7684\u8D44\u683C\uFF01</div>\n          <div class = \'form-title\' ng-show=\'teamName=="\u8235\u4E3B"\'>\u606D\u559C\u60A8\u83B7\u5F97\u7533\u8BF7\u8235\u4E3B\u7684\u8D44\u683C\uFF01</div>\n          <div class=\'form-content\'>\n           <div class=\'sub-title\'>\u8BF7\u586B\u5199\u7533\u8BF7\u7406\u7531\uFF0C\u6211\u4EEC\u4F1A\u5C3D\u5FEB\u8DDF\u4F60\u8054\u7CFB</div>\n           <p class=\'input-name\'>\u8054\u7CFB\u90AE\u7BB1<span class=\'error\' ng-show=\'mailIsError\'>\u8BF7\u586B\u5199\u6B63\u786E\u90AE\u7BB1</span></p>\n           <div class=\'input-area\'><input type=\'text\' placeholder=\'\u586B\u5199\u4F60\u7684\u90AE\u7BB1(\u5FC5\u586B)\' ng-model=\'data.input1\' ng-blur=\'checkEmail(data.input1)\'></div>\n          </div>\n          <div class=\'form-content\'>\n          <p class=\'input-name\'>\u7533\u8BF7\u7406\u7531<span class=\'error\' ng-show=\'reasonIsError\'>\u8BF7\u586B\u5199\u7533\u8BF7\u7406\u7531</span></p>\n           <div class=\'input-area\'><textarea rows=\'3\' ng-blur="checkReason(data.input2)" cols=\'20\' placeholder=\'\u586B\u5199\u4F60\u7684\u7533\u8BF7\u7406\u7531(\u5FC5\u586B\uFF0C\u4E0D\u652F\u6301\u7279\u6B8A\u5B57\u7B26\u3001\u8868\u60C5)\' ng-model=\'data.input2\'></textarea></div>\n          </div>\n          <div class=\'form-info\'>\n            <span  ng-click=\'lookLeaderRights()\'>\u70B9\u51FB\u67E5\u770B\u66F4\u591A\u8235\u4E3B\u76DF\u4E3B\u6743\u76CA</span>\n          </div>\n          <div class=\'form-button\'>\n           <span class=\'left-btn\' ng-click=\'fnClosePopup()\' >\u518D\u60F3\u60F3</span>\n           <span class=\'right-btn\' ng-click=\'fnExchangeGoods()\' >\u63D0\u4EA4\u7533\u8BF7</span>\n          </div>\n        </div>\n      ',
      scope: $scope
    });
  };
  $scope.levelUp = function (msg) {
    $ionicPopup.alert({
      template: '<div style="font-size: 17px;color: #030303;letter-spacing: -0.41px;line-height: 26px;">' + msg + '</div>',
      okText: '我知道啦'
    });
  };

  //转盘游戏
  $scope.modal = undefined;

  // 进入 vip 页面，获取到gameid，并 绑定到 $scope 上，然后再通过  ui-serf='goldgame({id: $scope.gameId})' 传递给 /#/goldgame/:id
  $scope.gameId = $stateParams.gameId;
  $scope.levelMsg = $stateParams.msg;
  $scope.gameTitle;
  $scope.gameDesc;$scope.isShowForm = false;
  $scope.startTime = '';
  $scope.endTime = '';
  $scope.hasBkgColor = true;
  var sharePic = 'http://www.ehaier.com/mstatic/wd/v2/img/sg.png';
  $scope.isAdmin = $stateParams.isAdmin; //是否后台查看

  $scope.shareStoreId;

  var height22 = window.innerWidth * 0.20;
  $scope.gridHeight = {
    height: height22 + 'px'
  };
  $scope.gridHeightMiddle = {
    height: height22 * 2 + 8 + 'px'
  };

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

  $scope.addressInfo = {};
  $scope.game = {};

  $scope.prizeList = [];
  $scope.startP = 0;
  $scope.endP = 11;
  $scope.curP = undefined; //高亮 grid
  $scope.timer = undefined;
  $scope.isRuning = false; //是否正在抽奖，正在抽奖时 点击抽奖无效
  var interval = 330; //每330毫秒走一格

  /*********************分享标签－whiteBird start*********************/
  $scope.showShare = false;
  /*********************分享标签－whiteBird end*********************/

  //IOS特殊样式
  $scope.topBtnCss4IOS = {};
  if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
    //只有ios app 特有的样式
    $scope.topBtnCss4IOS = {
      top: '12px'
    };
  }

  function date2Str(ms) {

    var date = new Date(ms);

    var year = date.getFullYear();
    var month = date.getMonth() + 1; //js从0开始取
    var date1 = date.getDate();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var second = date.getSeconds();
    return year + "年" + month + "月" + date1 + "日"; //+hour+"时"+minutes +"分"+second+"秒"
  }

  //特殊情况 ，!!!!!!!!!!!!当奖品全被抽完，灯转转灭了， 提示谢谢参与
  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.isShowMore = false;
    $scope.isShowRule = false;
    $scope.xyzMemberId = UserService.getUser().mid;
    $scope.shareStoreId = $stateParams.shareStoreId; //分享 memberID
    $scope.isAdmin = $stateParams.isAdmin; //是否后台查看
    $scope.memberId = UserService.getUser().mid;
    $ionicScrollDelegate.$getByHandle('gradeScroll').scrollBy(0, 0);
    // console.log($scope.memberId);

    //地址
    $scope.dataAdd = null;
    $scope.defaultValue = null;
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

    $scope.init();
    //$scope.scrollMainToTop();
    // $ionicPopup.alert({
    //     template:'<p>恭喜您XXX,奖励XX金币！</p><p style="color:#000">XXX：今日登陆完成了订单评价按时完成订单送货分享了一个话评</p>'
    //   });
  });
  function getApplyStatus() {
    //用户申请状态
    GameService.getapplyDuozhu().success(function (response) {
      //response={"message":"","result":{"teamLevelId":3,"reviewTime":1503560430,"status":-1,"remark":"9999","applyTime":1503560396,"isVacancy":false,"checkMonth":"201707","id":93,"applyReason":"sldfasdfa;sjf;asjfd;asldk","name":"盟主","memberId":1383067586,"applyMonth":"201708"},"code":"","success":true};
      if (response.success) {
        //团队等级名称
        $scope.memberId = response.data.memberId;
        $scope.teamLevelId = response.data.teamLevelId;
        console.log($scope.memberId);
        $scope.applyName = response.data.name;
        $scope.teamName = response.data.name;
        $scope.applyTeamName = response.data.name;
        $scope.applyStatus = response.data.status;
        console.log($scope.applyStatus);
        if (response.data.isVacancy) {
          response.data.status = response.data.levelDownMonth == response.data.applyMonth ? -3 : 2;
        } else if (response.data.status == undefined) {
          response.data.status = -2;
        }
        var teamLevel = { '舵主': 'duozhu@2x.png', '盟主': 'mengzhu@2x.png' };
        var suffix = teamLevel[$scope.teamName];
        var status = {
          '-3': { text: "未通过", "icon": $rootScope.imgBaseURL+"img/dis" + suffix, handler: function handler() {
              PopupService.showAlert('未通过', '您本月不能申请！');
            } },
          '-2': { text: "申请", "icon": $rootScope.imgBaseURL+"img/apply" + suffix, handler: function handler() {
              var myPopup = $scope.applyDialog();
              //关闭申请盟主 弹窗
              $scope.fnClosePopup = function () {
                myPopup.close();
              };
              // 提交申请
              // mailIsError true 有错误
              $scope.mailIsError = false;
              $scope.reasonIsError = false;
              $scope.checkEmail = function (str) {
                // 如果是邮箱  返回true，不是邮箱返回false
                var re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
                var isOk = re.test(str);
                $scope.mailIsError = !isOk;
              };
              function utf16toEntities(str) {
                var patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则
                str = str.replace(patt, '');
                return str;
              }
              $scope.checkReason = function (data) {
                // data = data.replace(/[^u4e00-u9fa5w]/g, '');
                data = utf16toEntities(data);
                $scope.reasonIsError = !data;
                if ($scope.reasonIsError) {
                  $scope.data.input2 = '';
                }
              };
              $scope.fnExchangeGoods = function () {
                $scope.checkEmail($scope.data.input1);
                if ($scope.mailIsError) {
                  return;
                }
                $scope.checkReason($scope.data.input2);
                if ($scope.reasonIsError) {
                  $scope.data.input2 = '';
                  return;
                }
                /*if (!$scope.data.input2) {
                  $scope.reasonIsError = true;
                  return;
                } else {
                  $scope.reasonIsError = false;
                }*/
                // 提交数据，申请盟主
                console.log($scope.data.input1);
                console.log($scope.data.input2);
                GameService.applyDuozhu({ email: $scope.data.input1, applyReason: $scope.data.input2, teamLevelId: $scope.teamLevelId }).success(function (response, status, headers, config) {
                  if (response.success == true) {
                    if (response.data) {
                      PopupService.showAlert('盟主舵主权益', '申请成功');
                    }
                  } else {
                    PopupService.showAlert('盟主舵主权益', response.message);
                  }
                  myPopup.close();
                  getApplyStatus();
                });
              };
              //点击查看盟主舵主权益
              $scope.lookLeaderRights = function () {
                PopupService.showAlert('盟主舵主权益', $scope.LeaderRights);
              };
            } },
          '-1': { text: "未通过", "icon": $rootScope.imgBaseURL+"img/dis" + suffix, handler: function handlder() {
              PopupService.showAlert('未通过', '您本月的申请被拒绝，下月继续努力！');
            } },
          '0': { text: "已申请", "icon": $rootScope.imgBaseURL+"img/dis" + suffix, handler: function handler() {
              PopupService.showAlert('已申请', '您本月的申请已经提交，请等待工作人员审批！');
            } },
          '1': { text: "已通过", "icon": $rootScope.imgBaseURL+"img/dis" + suffix, handler: function handler() {
              PopupService.showAlert('已通过', '您已经是' + response.data.name + '了！');
            } },
          '2': { text: "不可申请", "icon": $rootScope.imgBaseURL+"img/dis" + suffix, handler: function handler() {
              PopupService.showAlert('盟主舵主权益', $scope.LeaderRights);
            } },
          '3': { text: "盟主", "icon": $rootScope.imgBaseURL+'img/meng@2x.png', handler: function handler() {
              PopupService.showAlert('已通过', '您已经是' + response.data.name + '了！');
            } }
        };
        $scope.applyText = status['' + response.data.status].text;
        $scope.applyIcon = status['' + response.data.status].icon;
        $scope.handler = status['' + response.data.status].handler;
      }
    });
  }
  $scope.init = function () {
    getApplyStatus();
    $scope.prizeList = new Array(12);
    //初始化页面数据
    $scope.applyName = '盟主';
    CreditService.getGameId(function (gameId) {
      var shunguangVipUrl = UrlService.getUrl('SHUNGUANG_VIP');
      var shunguangParam = {
        gameId: gameId,
        withLevelPath: true
      };
      if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
        //只有ios app 特有的样式
        $scope.paddingtopClass = {
          "padding-top": "30px"
        };
      } else {
        $scope.paddingtopClass = {
          "padding-top": "14px"
        };
      }
      $http.get(shunguangVipUrl, shunguangParam).success(function (response) {
        //如果有积分变动消息
        if ($scope.levelMsg) {
          $scope.levelUp($scope.levelMsg);
        }
        if (response.success) {
          $scope.name = response.data.userCreditWithLevel.name;
          $scope.avatarImageFileId = UserService.getUser().avatarImageFileId ? UserService.getUser().avatarImageFileId : response.data.avatarImageFileId;
          $scope.userCurrentLevelId = response.data.userCreditWithLevel.order;
          $scope.order = response.data.userCreditWithLevel.order;
          $scope.levelGrowArr = response.data.levels;
          $scope.totalCreditNum = response.data.userCreditWithLevel.consumeCreditNum;
          $scope.creditNum = response.data.userCreditWithLevel.totalCreditNum;
          $scope.userRank = response.data.userCreditWithLevel.userRank;
          $scope.congratulationMsg = '有' + $scope.userRank + '个小伙伴超过了你';
          if ($scope.userRank == 0) {
            $scope.congratulationMsg = '恭喜你，你已经是天下第一了，继续保持哦！';
          }
          $scope.storeCreditWithLevel = response.data.storeCreditWithLevel;
          if ($scope.storeCreditWithLevel) {
            $scope.storeCurrentLevelId = response.data.storeCreditWithLevel.order;
            // $scope.creditNum = response.data.storeCreditWithLevel.creditNum;
            $scope.storeName = response.data.storeCreditWithLevel.name;
            $scope.levelArray = [];

            if ($scope.storeCurrentLevelId <= 3) {
              $scope.levelArray = [$rootScope.imgBaseURL+'img/StarLevel@2x.png'];
            } else {
              $scope.levelArray = [$rootScope.imgBaseURL+'img/Diamond@2x.png'];
            }
          }
          $("canvas:not('#radarMapCanvas')").remove();
          // $scope.totalCreditNum =  response.data.userCreditWithLevel.consumeCreditNum;
          $('.cur' + $scope.order).radialIndicator({
            barColor: '#8FB8FF',
            barWidth: 2,
            initValue: 0,
            roundCorner: true,
            percentage: false,
            displayNumber: false
          });
          var radialObj = $('.cur' + $scope.order).data('radialIndicator');
          radialObj.animate(100);
          $scope.scrollMainToTop();
        }
      });
    });
    //微店主 信息
    GameService.storeDetailInfo({ memberId: $scope.memberId }).success(function (response) {
      if (response.success == true) {
        $scope.storeVipName = response.data.storeName;
        $scope.teamLevelName = response.data.teamLevelName;
        $scope.storeId = response.data.memberId;
      }
    });
    /*********************分享标签－whiteBird start*********************/
    $scope.showQQ = false;
    $scope.showWeChat = false;
    if (window.umeng) {
      window.umeng.checkAppInstalled('qq', function (data) {

        if (data == false) {
          $scope.showQQ = false;
        } else {
          $scope.showQQ = true;
        }
      });
      window.umeng.checkAppInstalled('wechat', function (data) {

        if (data == false) {
          $scope.showWeChat = false;
        } else {
          $scope.showWeChat = true;
        }
      });
    }
    /*********************分享标签－whiteBird end*********************/

    $scope.startP = 0;
    // $scope.endP = 11;

    $scope.curP = undefined; //高亮 gridd
    GameService.gameInfo({ gameId: $scope.gameId }).success(function (response) {
      if (response.success) {
        $scope.prizeList = response.data.gameImg;
		$scope.partNum = response.data.partNum;
        $scope.game = response.data.game;
        $scope.chouCount = response.data.playTimes; //已抽奖次数
        $scope.startTime = date2Str($scope.game.beginTime * 1000);
        $scope.endTime = date2Str($scope.game.endTime * 1000);
        $ionicModal.fromTemplateUrl('templates/common/CommonGame.html', {
          scope: $scope,
          animation: 'slide-in-left'
        }).then(function (modal) {
          $scope.modal = modal;
        });
        if (!$scope.game.backgroundPic) {
          //没传背景图特殊处理
          $scope.hasBkgColor = false;
        }
      } else {
        //请求失败
        alert(response.message);
      }
    }).error(function () {
      PopupService.showMsg('网络错误');
    });

    GameService.notapplyDuozhu().success(function (response) {
      if (response.success == true) {
        $scope.LeaderRights = response.data.description;
      }
    });
  };
  //默认滑动位置
  $scope.scrollMainToTop = function () {
    //防止滚动部分全部滑到左边，需要加条件限制; 滑到第八个之后，就不再 向左滑动;
    var theEight = 8;
    console.log($scope.order);
    console.log($scope.order < theEight || $scope.order == theEight);
    if ($scope.order < theEight || $scope.order == theEight) {
      // $ionicScrollDelegate.$getByHandle('gradeScroll').scrollBy((5 - 1)*110,0);
      $ionicScrollDelegate.$getByHandle('gradeScroll').scrollTo(($scope.order - 1) * 133, 0);
    } else {
      $ionicScrollDelegate.$getByHandle('gradeScroll').scrollTo((theEight - 1) * 133, 0);
    }
  };
  var counter = 0 //记录转了多少格

  ,
      circle = Math.floor(Math.random() * 3) + 2; //最少转的圈数 2,3,4随机
  var speedUp1, speedUp2, slowDown1, slowDown2; //加速点 ，减速点
  console.log('circle--random--' + circle);
  $scope.clickChou = function () {
    if ($scope.isRuning) {
      console.log('is runing !!');
      return;
    }

    // $stateParams  路由的参数
    // gameId = $stateParams.gameId
    //从后台得到停止位置时 ,计算，加速减速点
    GameService.luckDraw({gameId: $scope.gameId, timeStamp: new Date().getTime()}).success(function (response) {
      if (response.success&&response.result.prizeType!=-1) {
        $scope.chouResult = response.result;
        $scope.endP = response.result.postion - 1; //得到停止位置
        $scope.start();
        CreditService.getGameId(function (gameId) {
          var shunguangVipUrl = UrlService.getUrl('SHUNGUANG_VIP');
          var shunguangParam = {
            gameId: gameId
          };
          $http.get(shunguangVipUrl, shunguangParam).success(function (response) {
            if (response.success) {
              //每次转完 从后台 获取最新的金币数量
              $scope.totalCreditNum = response.data.userCreditWithLevel.consumeCreditNum;
            }
          });
        });
        $scope.chouCount++; //每次抽完 抽奖次数 自增1
      }else if(response.success&&response.result.prizeType == -1){
        $ionicPopup.alert({
          template: response.result.message
        });
        $scope.curP = undefined;
      }else if (response.message && response.message.indexOf('抽奖次数') > -1) {
        $ionicPopup.alert({
          template: response.message
        });
        $scope.curP = undefined;
      } else if (response.message && response.message.indexOf('GAME') > -1) {
        $ionicPopup.alert({
          template: '对不起，奖品已被抽光'
        });
        $scope.curP = undefined;
      } else if (response.message && response.message.indexOf('未登录') > -1) {
        $scope.curP = undefined;
        $state.go('login');
      } else {
        //后台报错// 或者未登录
        $scope.curP = undefined;
        if (response.errorCode == '-100') {
          //登录失效不需要打印错误信息
          return;
        }
        console.log(response.message);
        $ionicPopup.alert({
          template: response.message
        });
      }
    }).error(function (msg) {
      PopupService.showToast('网络错误');
    });

    // $scope.start();
    $scope.curP = 0;
    var countZong = 12 * circle + $scope.endP;
    speedUp1 = 5;speedUp2 = circle == 4 ? 15 : 10;slowDown1 = circle == 4 ? countZong - 15 : countZong - 10;slowDown2 = circle == 4 ? countZong - 10 : countZong - 5;
  };
  // memberId

  // 用户head部分的星星等级显示
  $scope.starsList = [{ src: $rootScope.imgBaseURL+'img/whiteStar-Grade@2x.png' }, { src: $rootScope.imgBaseURL+'img/whiteStar-Grade@2x.png' }, { src: $rootScope.imgBaseURL+'img/whiteStar-Grade@2x.png' }, { src: $rootScope.imgBaseURL+'img/whiteStar-Grade@2x.png' }, { src: $rootScope.imgBaseURL+'img/whiteStar-Grade@2x.png' }];
  $scope.starsListLimit = 6;
  // 申请盟主
  $scope.showPopup = function () {
    $scope.data = { input1: '', input2: '' };
    if ($scope.handler) {
      $scope.handler.call();
    }
  };
  $scope.start = function () {
    if ($scope.endP<0 || $scope.endP > 11) {
      console.log('error, 抽奖错误，返回的中奖position 非法--');
      return;
    }
    $scope.isRuning = true;
    $scope.timer = $timeout(function () {
      counter++;
      if (counter >= speedUp1) {
        //加速
        interval = 100;
      } else if (counter >= speedUp2) {
        interval = 60; //再减速
      } else if (counter >= slowDown1) {
        interval = 100;
      } else if (counter >= slowDown2) {
        interval = 500;
      }
      //停止到指定位置
      if (counter > circle * 12 && $scope.curP === $scope.endP) {
        counter = 0;
        $scope.isRuning = false;
        $scope.showForm(); //转动停止，打开提示层
        return;
      }
      if ($scope.curP < 12) {
        $scope.curP++;
      } else {
        $scope.curP = 0;
      }
      $scope.start();
    }, interval);
  };
  $scope.openPic = function () {
    $scope.modal.show();
  };
  $scope.closePic = function () {
    $scope.modal.hide();
  };
  $scope.share = function () {
    //当 todo showForm为true时 diable 该按钮


    /*********************分享标签－whiteBird start*********************/
    if (window.device && window.device.hasNewShare) {
      if ($scope.isAdmin && $scope.isAdmin == 1) {
        return;
      }
      if (!UserService.getUser().mid) {
        PopupService.showToast('请先登录,再分享');
        return;
      }
      if ($scope.isShowForm) {
        //有弹出层时 不分享
        return;
      }
      console.log("分享");
      //新分享样式
      $scope.showShare = !$scope.showShare;
      /*********************分享标签－whiteBird end*********************/
    } else {

      //旧分享样式
      if ($scope.isAdmin && $scope.isAdmin == 1) {
        return;
      }
      if (!UserService.getUser().mid) {
        PopupService.showToast('请先登录,再分享');
        return;
      }
      if ($scope.isShowForm) {
        //有弹出层时 不分享
        return;
      }
      console.log("分享");
      if (window.umeng) {
        var title = '顺逛抽奖活动',
            content = '给您推荐顺逛每日抽奖活动,不可错过哦!',
            pic = sharePic,
            url = UrlService.getShareLinkHeader() + 'game/' + $scope.gameId + '/' + UserService.getUser().mid + '/';
        window.umeng.share(title, content, pic, url, 0);
      }
    }
  };
  $scope.goBack = function () {
    if( window.location.href.indexOf('sg_rn_app') != -1&&$ionicHistory.viewHistory().histories.root.cursor == 0){
      window.postMessage('goback');
    }
    //当 todo showForm为true时 diable 该按钮
    if ($scope.isAdmin && $scope.isAdmin == 1) {
      return;
    }
    if ($scope.isShowForm) {
      //有弹出层时 不分享
      return;
    }
    if ($rootScope.fromState == 'advertisement') {
      $state.go('homePage');
    } else {
      $scope.$ionicGoBack();
    }
  };
  $scope.showForm = function () {
    $scope.isShowForm = true;
  };
  $scope.hideForm = function () {
    $scope.isShowForm = false;
  };

  // todo  验证电话 ，其他非空
  $scope.confirmGameInfo = function () {
    if (!$scope.chouResult.consignee) {
      $ionicPopup.alert({
        title: '提示',
        template: '收件人必须填写！'
      });
      return;
    }
    if (!$scope.globalConstant.mobileNumberRegExp.test($scope.chouResult.mobile)) {
      $ionicPopup.alert({
        title: '提示',
        template: '请输入正确的手机号！'
      });
      return;
    }
    if (!$scope.chouResult.regionName) {
      $ionicPopup.alert({
        title: '提示',
        template: '收件地区必须填写！'
      });
      return;
    }
    if (!$scope.chouResult.regionName) {
      $ionicPopup.alert({
        title: '提示',
        template: '收件地区必须填写！'
      });
      return;
    }
    if (!$scope.chouResult.address) {
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
    GameService.confirmGameInfo(param).success(function (response) {
      var cc = response;
      if (response.success) {
        PopupService.showToast('提交成功');
        $scope.hideForm();
      } else {
        alert('提交失败');
      }
    }).error(function (msg) {
      alert('网络错误');
    });
  };
  $scope.chouResult = { "gameId": 189,
    "backgroundPic": null,
    "titleHidden": 1,
    "gameTitle": "游戏主题",
    "activityPic": null,
    "timeHidden": 1,
    "beginTime": 1468208908,
    "endTime": 1469677709,
    "activityDescHidden": 1,
    "activityDesc": "活动说明",
    "image": "",
    "winnerListId": 292,
    "prizeType": 1,
    "address": "1234575666",
    "mobile": "13698541258",
    "consignee": "哈哈哈",
    "prizeName": "苹果7",
    "regionName": "山东青岛城阳区",
    "provinceId": 16, "cityId": 173,
    "regionId": 2444, "isClick": true,
    "postion": 1
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
    $scope.addressInit($scope.dataAdd, $scope.defaultValue, 'PRODUCT_DETAIL_LOCATION', 0);
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
  //选择地址的方法
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
        console.log($scope.nowLevel);
      } else {
        //          $scope.dataAdd = $scope.dataAdd[index].children;
      }
      var ah = $scope.level * -1;
      $scope.addressTip='正在获取地址信息...';
      $scope.addressTipFlag=true;
      ProductDetailService.getLocationList(item.value, ah).success(function (response) {
        if (ah == 1) {
          var areaValueCity = item.value;
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
        $scope.addressTip='正在获取地址信息...';
        $scope.addressTipFlag=true;
        $scope.dataAdd="";
        $scope.level = $scope.levelArea;
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
          var areaValue = item.value;
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
    $scope.chouResult.streetId = data['value-4']; //街道
    $scope.chouResult.regionName = $scope.textOne + $scope.textTwo + $scope.textThree + $scope.textFour;

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
    if (window.cordova) {
      cordova.plugins.clipboard.copy(text);
      PopupService.showToastShort('复制成功');
    } else {
      PopupService.showToast('请下载APP执行此操作');
    }
  };
  $scope.hideblackCover = function () {
    $scope.showShare = false;
  };
  $scope.shareToPlatform = function (index) {

    var title = '顺逛抽奖活动',
        content = '给您推荐顺逛每日抽奖活动,不可错过哦!',
        pic = sharePic,
        url = UrlService.getShareLinkHeader() + 'game/' + $scope.gameId + '/' + UserService.getUser().mid + '/';
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
  /*********************分享标签－whiteBird end*********************/

  $scope.toRules = function () {
    var u = navigator.userAgent;

    if (u.indexOf('iPhone') != -1) {
      var ref = InAppBrowserService.open(UrlService.getHead() + 'mstore/sg/helpDetail.html?id=609', '金币（积分）说明');
      ref.addEventListener('exit', function (event) {});
    } else {
      $state.go('helpDetail', { 'helpId': '609', 'content': '金币（积分）说明' });
    }
  };
}]);

APP.service('GameService', ['$http', 'UrlService', function ($http, UrlService) {

  this.gameInfo = function (param) {
    var url = UrlService.getGameUrl('GAME_INFO');
    return $http.get(url, param);
  };
  this.luckDraw = function (param) {
    var url = UrlService.getGameUrl('LOTTERY');
    return $http.get(url, param);
  };
  //提交中奖的
  this.confirmGameInfo = function (param) {
    var url = UrlService.getGameUrl('GAME_HAVE_PRIZE');
    var params = 'gameId=' + param.gameId + '&uuid=' + param.uuid + '&prizeId=' + param.prizeId + '&consignee=' + param.consignee + '&mobile=' + param.mobile + '&address=' + param.address + '&regionName=' + param.regionName + '&isDefault=' + param.isDefault + '&provinceId=' + param.provinceId + '&cityId=' + param.cityId + '&regionId=' + param.regionId + '&streetId=' + param.streetId;
    return $http({
      method: 'POST',
      url: url,
      data: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  };
  //微店主详细信息
  this.storeDetailInfo = function (param) {
    var url = UrlService.getUrl('GET_STORE_DETAIL');
    return $http.get(url, param);
  };
  // 获取是否 能申请舵主或者盟主 状态
  this.getapplyDuozhu = function (param) {
    var url = UrlService.getUrl('GET_APPLY_MENGZHU');
    return $http.get(url, param);
  };
  this.applyDuozhu = function (params) {
    var url = UrlService.getUrl('APPLY_MENGZHU');
    return $http({ method: 'POST', url: url, params: params });
  };
  // 点击申请盟主 提示不可申请
  this.notapplyDuozhu = function (param) {
    var url = UrlService.getUrl('APPLY_MENGZHU_NOT');
    return $http.get(url, param);
  };
}]);
