APP.controller('anAuspiciousStartController', ['$scope', 'anAuspiciousStartService', 'GameService', '$ionicPopup', '$timeout', 'CreditService', 'UrlService', '$http', '$ionicHistory', '$stateParams', 'PopupService', 'UserService', 'InAppBrowserService', '$state','$interval',
  function($scope, anAuspiciousStartService, GameService, $ionicPopup, $timeout, CreditService, UrlService, $http, $ionicHistory, $stateParams, PopupService, UserService, InAppBrowserService, $state,$interval) {
    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) { //只有ios app 特有的样式
      $scope.paddingtopClass = {
        "margin-top": "16px"
      };
      $scope.paddingtopClasscontent = {
        "padding-top": "60px"
      }
    } else {
      $scope.paddingtopClass = {
        "margin-top": "0px"
      };
      $scope.paddingtopClasscontent = {
        "padding-top": "44px"
      }
    }
    var hasPlayTimes = 0;
    $scope.isShowForm = false;
    $scope.picLists = [];
    $scope.surplusChance = '';
    $scope.gameId = $stateParams.anAuspiciousId;
    $scope.curP = 0;
    var sharePlatformFlag = '';
    $scope.isRuning = false; //是否正在抽奖，正在抽奖时 点击抽奖无效
    var interval = 330; //每330毫秒走一格
    var counter = 0; //记录转了多少格
    var circle = Math.floor(Math.random() * 3) + 2; //最少转的圈数 2,3,4随机
    var speedUp1, speedUp2, slowDown1, slowDown2; //加速点 ，减速点
    $scope.prizeLists = [];//中奖名单
    var gameIntervalId = null;//获取中奖名单定时器id
    $scope.start = function() {
      if ($scope.endP < 0 || $scope.endP > 11) {
        console.log('error, 抽奖错误，返回的中奖position 非法--');
        return;
      }
      $scope.isRuning = true;
      $scope.timer = $timeout(function() {
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
          $scope.isShowForm = true;
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

    if (!Array.prototype.shuffle) {
      Array.prototype.shuffle = function() {
        for (var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
        return this;
      };
    }

    $scope.gameButton = function() {
      if ($scope.isRuning) {
        console.log('is runing !!');
        return;
      }
      //从后台得到停止位置时 ,计算，加速减速点
      anAuspiciousStartService.drawPrize($scope.gameId).success(function(response) {
        if (response.success) {
          $scope.prizeData = response.result;
          $scope.surplusChance = response.result.surplusChance;
          hasPlayTimes = response.result.playTimes?response.result.playTimes:hasPlayTimes;
          if (response.result.prizeType != 3&&response.result.prizeType != -1) {//插入本人最新的中奖纪录
            var winningInformation = {
              mobile: "",
              prizeName: ""
            };
            winningInformation.mobile = UserService.getUser().mobile;
            winningInformation.mobile = winningInformation.mobile.substr(0,3)+"****"+winningInformation.mobile.substr(7);
            winningInformation.prizeName = response.result.prizeName;
            $scope.prizeLists.shuffle();
            $scope.prizeLists.splice(9, 0, winningInformation);
          }
          if (response.result.prizeType != -1) {
            $scope.endP = response.result.postion - 1; //得到停止位置
            $scope.start();
          } else {
            $scope.curP = undefined;
            PopupService.showToast(response.result.message);
          }
        } else {
          if(response.message){
            PopupService.showToast(response.message);
          }
        }
      }).error(function(msg) {
        PopupService.showToast('网络错误');
      });
      // $scope.curP = 0;
      var countZong = 12 * circle + $scope.endP;
      speedUp1 = 5;
      speedUp2 = circle == 4 ? 15 : 10;
      slowDown1 = circle == 4 ? countZong - 15 : countZong - 10;
      slowDown2 = circle == 4 ? countZong - 10 : countZong - 5;
    };

    $scope.hideForm = function() {
      $scope.isShowForm = false;
    };

    (function($) {
      $.fn.extend({
        RollTitle: function(opt) {
          if (!opt) var opt = {};
          var _this = this;
          $scope.timer = _this.timer = null;
          _this.lineH = _this.find("p:first").height();
          _this.line = opt.line ? parseInt(opt.line, 15) : parseInt(_this.height() / _this.lineH, 10);
          _this.speed = opt.speed;
            _this.timespan = opt.timespan;
          if (_this.line == 0) this.line = 1;

          _this.scrollUp = function() {
            _this.animate({
              marginTop: 0
            }, _this.speed, function() {
              for (i = 1; i <= _this.line; i++) {
                _this.find("p:first").appendTo(_this);
              }
              _this.css({
                marginTop: 0
              });
            });
          };
          _this.hover(function() {
            clearInterval(_this.timer);
          }, function() {
            _this.timer = setInterval(function() {
              _this.scrollUp();
            }, _this.timespan);
          }).mouseout();
        }
      })
    })(jQuery);

    $scope.goBack = function() {
      $ionicHistory.goBack();
    };

    $scope.toRules = function() {
      var u = navigator.userAgent;

      if (u.indexOf('iPhone') != -1) {
        var ref = InAppBrowserService.open(UrlService.getHead() + 'mstore/sg/helpDetail.html?id=1034', '活动规则');
        ref.addEventListener('exit', function(event) {});
      } else {
        $state.go('helpDetail', {
          'helpId': '1034',
          'content': '活动规则'
        });
      }
    };

    /*********************分享标签－whiteBird start*********************/
    //复制
    $scope.copeText = function(text) {
      if (window.cordova) {
        cordova.plugins.clipboard.copy(text);
        PopupService.showToastShort('复制成功');
      } else {
        PopupService.showToast('请下载APP执行此操作');
      }
    };
    $scope.isShowShare = function() {
      $scope.isShowForm = false;
      if(hasPlayTimes < $scope.information.partNum){
        PopupService.showAlert('分享','每人默认1次抽奖机会，机会用完才可以分享助力哦！');
      }else{
        if (window.cordova) {
          if (!UserService.getUser().mid) {
            $state.go('login');
            return;
          }
          $scope.showShare = true;
        } else {
          PopupService.showAlert('只能在app分享', '抱歉，只能在app分享');
        }
      }
    };

    $scope.chanceShare = function(indexShare) {
      if (indexShare == 1) {
        sharePlatformFlag = 'WX';
      } else if (indexShare == 2) {
        sharePlatformFlag = 'PYQ';
      } else if (indexShare == 3) {
        sharePlatformFlag = 'QQ';
      } else if (indexShare == 4) {
        sharePlatformFlag = 'QQKJ';
      } else if (indexShare == 5) {
        sharePlatformFlag = 'FZLJ';
      } else if (indexShare == 0) {
        sharePlatformFlag = 'WB';
      }
    };

    $scope.shareToPlatform = function(index) {
      $scope.chanceShare(index);
      var title = $scope.information.gameTitle,
        content = '助力可以获得更多的抽奖机会，帮他助个力吧！',
        pic = 'http://www.ehaier.com/mstatic/wd/v2/img/sg.png',
        url = UrlService.getShareLinkHeader() + 'helpStaff/' + $scope.memberId + '/' + $scope.gameId + '/' + sharePlatformFlag;

      if (window.umeng) {
        if (index == 0) {
          window.umeng.shareToSina(title, content, pic, url, 0, null, null);
        } else if (index == 1) {
          window.umeng.shareToWechatSession(title, content, pic, url, 0, null, null);
        } else if (index == 2) {
          window.umeng.shareToWechatTimeline(title, content, pic, url, 0, null, null);
        } else if (index == 3) {
          window.umeng.shareToQQ(title, content, pic, url, 0, null, null);
          CreditService.qqShare();
        } else if (index == 4) {
          window.umeng.shareToQzone(title, content, pic, url, 0, null,null);
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

    $scope.hideblackCover = function() {
      $scope.showShare = false;
    };
    /*********************分享标签－whiteBird end*********************/

    $scope.initWinningList = function() {
      anAuspiciousStartService.winningList($scope.gameId)
        .success(function(response, status, headers, config) {
          if (response.success == true) {
            if(response.data){
              $scope.prizeLists = response.data;
            }
          } else {
            if(response.message){
              PopupService.showToast(response.message);
            }
          }
        });
    };
    $scope.initInformation = function() {
      anAuspiciousStartService.gameInformation($scope.gameId)
        .success(function(response, status, headers, config) {
          if (response.success == true) {
            $scope.picLists = response.data.gameImgVos;
            $scope.information = response.data;
            $scope.surplusChance = response.data.surplusChance;
            hasPlayTimes = response.data.playTimes;
          } else {
            if(response.message){
              PopupService.showToast(response.message);
            }
          }
        });
    };
    function startGameInterval(){
      gameIntervalId = $interval($scope.initWinningList,20000);
    }

    $scope.$on('$ionicView.beforeEnter', function(e) {
      $scope.showShare = false;
      $scope.memberId = UserService.getUser().mid;
      $scope.gameId = $stateParams.anAuspiciousId;
      $scope.isShowForm = false;
      $scope.initInformation();
      $scope.initWinningList();
      startGameInterval();
    });
    $scope.$on('$ionicView.enter', function(e) {
      $(".record_list").RollTitle({
        line: 1,
        speed: 3000,
        timespan: 600
      });
    });
    $scope.$on('$ionicView.beforeLeave', function() {
      $interval.cancel(gameIntervalId);
    });
  }
]);


APP.service('anAuspiciousStartService', ['$http', 'UrlService', function($http, UrlService) {
  this.winningList = function(gameId) {
    var params = {
      'gameId': gameId,
      'noLoading':true
    };
    return $http.get(UrlService.getGameUrl('WINNING_LIST'), params);
  };
  this.drawPrize = function(gameId) {
    var params = {
      'gameId': gameId,
      'timeStamp': new Date().getTime()
    };
    return $http.get(UrlService.getGameUrl('LOTTERY'), params);
  };
  this.gameInformation = function(gameId) {
    var params = {
      'gameId': gameId
    };
    return $http.get(UrlService.getGameUrl('GAME_INFORMATION'), params);
  };
}]);
