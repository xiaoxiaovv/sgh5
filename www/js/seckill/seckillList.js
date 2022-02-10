APP.controller('SeckillListController', ['$scope', '$rootScope', '$stateParams', '$state', '$timeout', 'UrlService',
  '$interval', 'SeckillService', '$localstorage', 'UserService', 'PopupService',
  function ($scope, $rootScope, $stateParams, $state, $timeout, UrlService, $interval, SeckillService, $localstorage, UserService, PopupService) {

    $scope.storeId;//秒杀记住从哪个店 分享出去，哪个店返佣金
    $scope.seckillStatus = 0;// 1 未开始，2 正在进行 ，3 已经结束，0 代表进入页面时 倒计时 为空
    $scope.seckillList = [];//秒杀活动列表，二维数组，每个活动中有 商品列表
    $scope.timer = undefined;
    $scope.curTime;
    $scope.timeDiff; //服务器与本地时间差
    $scope.isNull;//控制没有商品图片的显示  true 显示图片
    var sharePic = 'http://www.ehaier.com/mstatic/wd/v2/img/sg.png';

    function date2Str(ms) {
      var date = new Date(ms);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;    //js从0开始取
      month = month < 10 ? '0' + month : month;
      var date1 = date.getDate();
      date1 = date1 < 10 ? '0' + date1 : date1;
      var hour = date.getHours();
      hour = hour < 10 ? '0' + hour : hour;
      var minutes = date.getMinutes();
      minutes = minutes < 10 ? '0' + minutes : minutes;
      var second = date.getSeconds();
      second = second < 10 ? '0' + second : second;
      return (month + "月" + date1 + "日" + hour + ':' + minutes + ':' + second );//+hour+"时"+minutes +"分"+second+"秒"
    }

    $scope.init = function () {
      $scope.isNull = false;

      $scope.seckillList = [];
      var storeId = $localstorage.get('storeId', $rootScope.globalConstant.storeId);
      $scope.storeId = storeId;
      SeckillService.getServerTime().error(function () {
        alert('网络失败');
      }).then(function (response1) {
        var serverS = response1.data.data;//得到服务器时间
        $scope.serverMs = serverS * 1000;
        var a = new Date($scope.serverMs);
        //$scope.serverMs = Date.parse(new Date(2016,7,19,10,1,20));
        return SeckillService.getSeckillList();
      }).then(function (response2) {
        if (!response2) {
          $scope.ponitList = [];
          alert('网络失败');
          return;
        }

        $scope.seckillList = response2.data.data;
        if ($scope.seckillList.size == 0) {
          $scope.isNull = true;
        }
        $scope.ponitList = [];
        angular.forEach($scope.seckillList, function (i, index) {
          i.beginStr = date2Str(i.beginTime * 1000);
          i.endStr = date2Str(i.endTime * 1000);
          //活动的状态 1，未开始，2已开始，未结束，3已结束
          i.status = undefined;
          if ($scope.serverMs < i.beginTime * 1000) {
            i.status = 1;
            $scope.ponitList.push(i.beginTime * 1000 - $scope.serverMs);
          } else if ($scope.serverMs >= i.beginTime * 1000 && $scope.serverMs <= i.endTime * 1000) {
            $scope.ponitList.push(i.endTime * 1000 - $scope.serverMs);
            i.status = 2;
          } else if ($scope.serverMs > i.endTime * 1000) {
            i.status = 3;
          }
          angular.forEach(i.sgSeckillItemFormList, function (obj, index) {
            obj.beginTime = i.beginTime;
            obj.endTime = i.endTime;
          });
        });
        //根据不同活动开始结束时间 找到最近的 刷新时间点 刷新页面跟新活动状态
        function sortNumber(a, b) {
          return a - b
        }

        $scope.ponitList.sort(sortNumber);//升序排数组
        if ($scope.ponitList[0]) {
          console.log($scope.ponitList[0]);
          //在最近时间点 初始化页面
          $scope.timer = $timeout(function () {
            $scope.init();
          }, $scope.ponitList[0] > 3600000 ? 3600000 : $scope.ponitList[0]);//setTimeout 最大等待时间 2的31次方毫秒,超过此视为0
        }
      }, function (msg) {
        alert('网络失败');
        $scope.isNull = true;
      });
    };

    $scope.toDetail = function (pro, status) {
      //var aaa =pro; debugger;
      $state.go('seckillDetail', {
        productId: pro.productId,
        o2oType: 0,
        fromType: 4,
        storeId: $stateParams.storeId,
        front: 0,
        sku: pro.sku,
        seckillPrice: pro.seckillPrice,
        seckillId: pro.seckillId,
        status: status,
        beginTime: pro.beginTime,
        endTime: pro.endTime
      });//8973/0/4:/13823483/0
    };

    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      $scope.init();
    });
    $scope.$on('$ionicView.beforeLeave', function (e, v) {
      $timeout.cancel($scope.timer);//离开页面清空计时器
    });

    //下拉刷新
    $scope.doRefresh = function () {
      console.log('Refreshing!');
      $timeout(function () {
        $scope.init();
        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      }, 1000);
    };

    //分享
    $scope.share = function () {
      if (!UserService.getUser().mid) {
        PopupService.showToast('请先登录,再分享');
        return;
      }
      if (window.umeng) {
        var title = '顺逛秒杀活动',
          content = '给您推荐顺逛每日秒杀活动,不可错过哦!',
          pic = sharePic,
          url = UrlService.getShareLinkHeader() + 'seckillList/' + UserService.getUser().mid;
        window.umeng.share(title, content, pic, url, 0);
      }
    };

  }]);

APP.service('SeckillService', ['$http', 'UrlService', function ($http, UrlService) {

  this.getSeckillList = function () {
    var url = UrlService.getUrl('SECKILL_LIST');
    return $http.post(url);
  };
  this.getSeckillDetail = function (param) {
    var url = UrlService.getUrl('SECKILL_LIST', param);
    return;
  };
  this.getServerTime = function (param) {
    var url = UrlService.getUrl('SECKILL_SERVICE_TIME', param);

    return $http.get(url);
  }

}]);

APP.directive('countdown', ['$timeout', 'countdownService', function ($timeout, countdownService) {
  return {
    restrict: 'E',
    template: '<i>{{time.dd}}</i> <span>天</span> <i>{{time.hh}}</i>{{type}}<i>{{time.mm}}</i>{{type}}<i>{{time.ss}}</i>',
    link: function (scope, iElement, iAttrs) {
      scope.type = iAttrs.type || ':';
      var timer = undefined;
      var r = Math.random();

      //计算倒计时毫秒值
      var time, timediff, timeEnd;
      if (!iAttrs.endtime) {
        return false;
      }
      if (!iAttrs.endtime || !iAttrs.curtime) {
        console.error('倒计时 指令错误，endTime，curTime undefinded');
        return;
      }
      timeEnd = countdownService.formatTime2Ms(iAttrs.endtime);

      if (iAttrs.curtime) {//如果curtime 已经在dom元素的属性里 直接倒计时
        time = countdownService.getTimeDif(iAttrs.endtime, iAttrs.curtime);
        timediff = iAttrs.curtime - new Date() - 0;
        fnCountdown(1);
      }
      else {//如果没有curtime 需要请求服务器时间，回调后开始倒计时
        countdownService.getCurrTime().then(function (response) {
          iAttrs.curtime = response.data;
          time = countdownService.getTimeDif(iAttrs.endtime, iAttrs.curtime);
          timediff = iAttrs.curtime - new Date() - 0;
          fnCountdown(1);
        });

      }

      //倒计时函数
      function fnCountdown(leftms) {
        // console.log(time);
        if (time > 0 && leftms > 0) {
          var serverms = new Date() - 0 + timediff,
            leftms = timeEnd - serverms;
          //    time-=1000;

          scope.time = countdownService.changeMs2Time(leftms);
          timer = $timeout(function () {
            fnCountdown(leftms);
          }, 1000);
        } else {
          //倒计时结束调用配置项里callback
          if (iAttrs.callback) {
            scope.time = {
              dd: '00',
              hh: '00',
              mm: '00',
              ss: '00'
            };
            scope[iAttrs.callback](iAttrs.callbackparam);

          } else {
            //配置项里没有，则调默认的callback
            scope.time = {
              dd: '00',
              hh: '00',
              mm: '00',
              ss: '00'
            };
            scope.callback()
          }
        }
      }

    },
    controller: function ($scope) {
      //倒计时结束的默认callback
      $scope.callback = function () {
        //console.log('已结束')
      };
      $scope.$on('$destroy', function () {

      });
    }
  }

}]);


APP.factory('countdownService', ['$http', function ($http) {
  return {
    //计算时间差
    getTimeDif: function (endTime, curTime) {
      return this.formatTime2Ms(endTime) - this.formatTime2Ms(curTime || new Date());
    },
    //转换时间格式为毫秒值
    formatTime2Ms: function (time) {
      if (!time) {
        return 0
      }

      var nTIME = Date.parse(time.toString().replace(/-/g, '/'));
      return nTIME || time;
    },
    // 将毫秒值转换为需要的字符串
    changeMs2Time: function (ms) {
      if (!ms || parseInt(ms) < 0) {
        return {
          dd: '00',
          hh: '00',
          mm: '00',
          ss: '00'
        };
      }
      //天
      var d = parseInt(ms / 86400000);
      var dd = d < 10 ? '0' + d : d;

      //小时
      ms = parseInt(ms % (86400000));
      var h = parseInt(ms / 3600000);
      var hh = h < 10 ? '0' + h : h;

      //分
      ms = ms - h * 3600000;
      var m = parseInt(ms / 60000);
      var mm = m < 10 ? '0' + m : m;

      //秒
      ms = ms - m * 60000;
      var s = parseInt(ms / 1000);
      var ss = s < 10 ? '0' + s : s;

      return {
        dd: dd,
        hh: hh,
        mm: mm,
        ss: ss
      };
    },
    /**
     * 将倒计时毫秒值转化为字符串格式，如1天1时1分1秒 或者 1:1:1:1
     * 参数说明:
     *  ms   ：倒计时毫秒值
     *  type :
     *
     * */
    getTime: function (ms, type) {
      var o = this.changeMs2Time(ms);
      var str = '';
      type = type || ':';

      if (type == ':') {
        str = o.dd + '天' + o.hh + ':' + o.mm + ':' + o.ss;
      } else {
        str = o.dd + '天' + o.hh + '时' + o.mm + '分' + o.ss + '秒';
      }
      return str;
    },
    /*
     * 获取服务器时间
     */
    getCurrTime: function () {
      return $http.post('/currTime');
    }
  }

}]);
