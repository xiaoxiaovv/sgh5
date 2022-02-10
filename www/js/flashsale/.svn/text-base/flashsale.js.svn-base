APP.controller('flashsaleCtrl', ['$stateParams','$scope', '$state', '$http', '$interval', 'UrlService', 'flashService', 'GoodsService', '$rootScope', '$localstorage','$ionicSlideBoxDelegate','$ionicHistory', 'UserService','$ionicScrollDelegate','BannerThemeService',function($stateParams,$scope, $state, $http, $interval, UrlService, flashService, GoodsService, $rootScope, $localstorage,$ionicSlideBoxDelegate,$ionicHistory,UserService,$ionicScrollDelegate,BannerThemeService) {
  /*声明变量*/
  $scope.typeNumber = $stateParams.type;
  $scope.typeNumber = $scope.typeNumber==2 ? 2:1;
  /*一级页数据*/
  $scope.index = 0;
  $scope.index1 = 0;
  $scope.isWd = false;
  /*二级页总数据*/
  $scope.flashInfoTwototal = [];
  /*二级页分类数据*/
  $scope.flashInfoTwo = [];
  /*倒计时时间存放*/
  // $scope.showtime = '';
  // $scope.datenow = 0;
  // $scope.datenow1 = 0;
  // $scope.dateHour = 0;
  // $scope.datemonth = 0;
  // $scope.datayear = 0;
  $scope.storeId = 0;
  var timer;
  var NowTer;
  // var timerbefore=[];
  // var remindArray = [];
  // var countDownNowTime = [];
  // var countDownendTime = [];
  // var timerLength = '';
  // 倒计时定义
  $scope.endT = '';
  $scope.endTt = '';
  $scope.endTh = '';
  $scope.endTm = '';
  $scope.endTs = '';
  $scope.Timetotal = '';
  /*地址信息存放*/
  $scope.provinceId=0;
  $scope.cityId=0;
  $scope.districtId=0;
  $scope.streetId=0;
  $scope.isCommission=$rootScope.isCommission;
  /*方法*/
  $scope.init = function() {
    $scope.index = 0;
  $scope.index1 = 0;
    //$scope.timeflag =[];
    $scope.storeId = $localstorage.get('storeId',$rootScope.globalConstant.storeId);
      /*地址信息*/
      GoodsService.getAddress().success(function(re) {
          var obj = eval(re.data);
          $scope.provinceId = obj[0].provinceId;
          $scope.cityId = obj[0].cityId;
          $scope.districtId = obj[0].areaId;
          $scope.streetId = obj[0].streetId;
    //       for (var i = 0; i < remindArray.length; i++) {
    //   $interval.cancel(timer[remindArray[i]]);
    // }
    //remindArray = [];
    /*获取数据*/
      flashService.getFlashone($scope.provinceId,$scope.cityId,$scope.districtId,$scope.streetId,$scope.typeNumber)
        .success(function(response) {
          console.log('初始数据',response)
          //timerLength = remindArray.length;
          //remindArray = [];
          if (response.data.isWd == true) {
            $scope.isWd = true;
          } else {
            $scope.isWd = false;
          }
          if(response.data.dates&&response.data.dates[$scope.index].list.length!=0){
                  $scope.systemTime = response.data.systemTime; 
                $scope.flashInfoTwototal =response.data;
                $scope.flashInfoTwo = $scope.flashInfoTwototal.dates[$scope.index].list;
                var defaultData = $scope.flashInfoTwo;
                for(var i =0;i<defaultData.length;i++){
                  if($scope.systemTime>=defaultData[i].startTime&&$scope.systemTime<=defaultData[i].endTime){
                    $scope.index1 = i;
                    NowTer=$interval(function(){
                      $scope.systemTime+=1000;
                      if($scope.systemTime>=defaultData[i].endTime){
                        $interval.cancel(NowTer);
                        $scope.init();
                      }
                    },1000);
                    break;
                  }
                  if($scope.systemTime<defaultData[i].startTime){
                    $scope.index1 = i;
                    NowTer=$interval(function(){
                      $scope.systemTime+=1000;
                      if($scope.systemTime>=defaultData[i].startTime){
                        $interval.cancel(NowTer);
                        $scope.init();
                      }
                    },1000);
                    break;
                  }
                }
                
                $interval.cancel(timer);
            if($scope.systemTime>=$scope.flashInfoTwo[$scope.index1].startTime&&$scope.systemTime<=$scope.flashInfoTwo[$scope.index1].endTime){
                countDown($scope.systemTime/1000,$scope.flashInfoTwo[$scope.index1].endTime/1000)
            }else if($scope.systemTime<$scope.flashInfoTwo[$scope.index1].startTime){
                countDown($scope.systemTime/1000,$scope.flashInfoTwo[$scope.index1].startTime/1000)
            }else{

            }
          }
          
          // $scope.date=[];
          // for (var i in $scope.flashInfoTwototal) {
          //   $scope.date.push({
          //     time: i.slice(5).replace('/', '月') + '日',
          //     item: i
          //   });
          // }
          // $scope.date[0].id = 1;
          // var shijian1 = [];
          // var shijian2=[];
          // var nowdate = new Date();
          // $scope.datenow = nowdate.getTime();
          // $scope.datenow1=[];
          // $scope.dateHour = nowdate.getDate();
          // $scope.datemonth = Format(nowdate.getMonth()+1).toString();
          // $scope.datayear = nowdate.getFullYear();
          // /*一堆计算*/
          // for (var j in $scope.flashInfoTwototal[$scope.date[0].item]) {
          //     /*console.log($scope.flashInfoTwototal[$scope.date[0].item][j][q].startTime)*/
          //     if ($scope.datenow >= $scope.flashInfoTwototal[$scope.date[0].item][j][0].startTime && $scope.datenow <= $scope.flashInfoTwototal[$scope.date[0].item][j][0].endTime) {
          //       $scope.showdiv.push(true);
          //       $scope.timeflag.push(true);
          //       shijian1.push($scope.flashInfoTwototal[$scope.date[0].item][j][0].endTime);
          //     } else if($scope.datenow < $scope.flashInfoTwototal[$scope.date[0].item][j][0].startTime){
          //         $scope.showdiv.push(true);
          //         $scope.timeflag.push(false);
          //         shijian2.push($scope.flashInfoTwototal[$scope.date[0].item][j][0].startTime);
          //     }else if($scope.datenow > $scope.flashInfoTwototal[$scope.date[0].item][j][0].endTime){
          //         $scope.showdiv.push(false);
          //     }else {
          //       $scope.showdiv.push(true);
          //       $scope.timeflag.push(false);
          //     }
          // }
          // for(var b=0;b<shijian2.length;b++){
          //   $scope.datenow1[b]=nowdate.getTime();
          //   fashbegin(new Date().getTime(),shijian2[b],b);
          // }
          // for (var a = 0; a < shijian1.length; a++) {
          //   remindArray.push(a);
          //   countDownNowTime[a] = parseInt($scope.datenow / 1000);
          //   countDownendTime[a] = parseInt((shijian1[a]) / 1000);
          // }
          // for (var k = timerLength; k < remindArray.length; k++) {
          //   countDown(countDownNowTime[remindArray[k]], countDownendTime[remindArray[k]], remindArray[k],$scope.timeflag[k]);
          // }
          // /*循环遍历当前日下的所有数据,得出数据,push一起存到数组*/
          // $scope.flashInfoTwo = $scope.flashInfoTwototal[$scope.date[0].item];
        })
        })
        /*轮播*/
      flashService.slidedata().success(function(res){
        console.log(res);
          $scope.bannerList = res.data.topBanner;
          $scope.others = res.data.others;
          $ionicSlideBoxDelegate.update();
          $ionicSlideBoxDelegate.$getByHandle("flashsale_slide").loop(true);
      })
    }
    //  倒计时方法
  function countDown(nowtime, endtime) {
    $scope.endT = endtime - nowtime;
    timer = $interval(function() {
      $scope.endTt = Format(Math.floor($scope.endT / 86400));

      $scope.endTh = Format(Math.floor(($scope.endT - $scope.endTt * 86400) / 3600));

      $scope.endTm = Format(Math.floor(($scope.endT - $scope.endTt * 86400 - $scope.endTh * 3600) / 60));

      $scope.endTs = Format($scope.endT - $scope.endTt * 86400 - $scope.endTh * 3600 - $scope.endTm * 60);
      $scope.endT--;
      $scope.Timetotal = $scope.endTh+':'+$scope.endTm+':'+$scope.endTs;
      if ($scope.endT == -1) {
        $interval.cancel(timer);
      }
    }, 1000);
  }
  // 格式化
  function Format(a) {
    if (a < 10) {
      a = '0' + a;
    } else {
      a = a;
    }
    return a;
  };
  //点击轮播图执行方法
    $scope.bannerClick = function (linkType, link, relationId) {
      var tempArr = link.split('&');
      switch (linkType) {
         case '-1':
          BannerThemeService.getBannerTheme(relationId)
            .success(function (response) {
              console.log(response);
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
          var fromType=link.slice(link.lastIndexOf('=')+1);
          var reg=/\=(.*?)\&/g;
          var arr=link.match(reg);
          var arr1=[];
          for(var x=0;x<arr.length;x++){
              arr1.push(arr[x].substring(1,arr[x].length-1));
          }
            //var productId = link.slice(link.indexOf('=' + 1));
            $state.go('productDetail', {
              fromType: fromType,
              fromUrl: arr1[3],
              o2oType: arr1[2],
              productId: arr1[0],
              storeId:arr1[1]
            });
          break;
        case '2': //领券中心/优惠券详情页
          if (!link) {
            $state.go('getCouponsList');
          } else {
            var couponsId = link.slice(link.indexOf('=' + 1));
            $state.go('couponsDetail', {
              cId: couponsId,
              userID: $scope.storeId,
              type: 2
            });
          }
          break;
        case '3': //游戏页
          var gameId = link.slice(link.indexOf('=' + 1));
          $state.go('game', {
            gameId: gameId
          });
          break;
        case '4': //活动页
          if (tempArr[0].slice(tempArr[0].indexOf('=') + 1) == '日常活动') {
            BannerThemeService.getBannerTheme(tempArr[1].slice(tempArr[1].indexOf('=') + 1))
              .success(function (response) {
                console.log(response);
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
            if(link.indexOf('m.ehaier.com/www/index.html')!=-1){
              var url = link.slice(link.indexOf('#/'));
              window.location.hash=url;
            }else{
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
  /*点击tab样式改变，并且数据切换*/
  $scope.changecolor = function(item) {
    /*样式改变*/
    //$scope.index1 = 0;
    $scope.index = item;
    $ionicScrollDelegate.$getByHandle('hxScroll').resize();
    $scope.flashInfoTwo = $scope.flashInfoTwototal.dates[item].list;
    for(var i =0;i<$scope.flashInfoTwo.length;i++){
                  if($scope.systemTime>=$scope.flashInfoTwo[i].startTime&&$scope.systemTime<=$scope.flashInfoTwo[i].endTime){
                    $scope.index1 = i;
                    break;
                  }
                  if($scope.systemTime<$scope.flashInfoTwo[i].startTime){
                    $scope.index1 = i;
                    break;
                  }
                }
    $interval.cancel(timer);
      if($scope.systemTime>=$scope.flashInfoTwo[$scope.index1].startTime&&$scope.systemTime<=$scope.flashInfoTwo[$scope.index1].endTime){
          countDown($scope.systemTime/1000,$scope.flashInfoTwo[$scope.index1].endTime/1000)
      }else if($scope.systemTime<$scope.flashInfoTwo[$scope.index1].startTime){
          countDown($scope.systemTime/1000,$scope.flashInfoTwo[$scope.index1].startTime/1000)
      }else{

      }
      $ionicScrollDelegate.resize();
     $ionicScrollDelegate.scrollTop();
    // if (item == 0) {
    //   $scope.date[0].id = 1;
    // } else {
    //   $scope.date[0].id = 2;
    // };
    /*数据切换逻辑*/
    /*tab存放一条时间一级数据,页面取到，传进这个函数，循环出来的数据和点击的时候数据匹配，然后渲染*/
    
    // $scope.timeflag =[];
    // $scope.showdiv = [];
    // var nows = new Date();
    // $scope.datenow = nows.getTime();
    // for (var j in $scope.flashInfoTwo) {
    //           /*console.log($scope.flashInfoTwo[j][q].startTime)*/
    //           if ($scope.datenow >= $scope.flashInfoTwo[j][0].startTime && $scope.datenow <= $scope.flashInfoTwo[j][0].endTime) {
    //             $scope.showdiv.push(true);
    //             $scope.timeflag.push(true);
    //           } else if($scope.datenow < $scope.flashInfoTwo[j][0].startTime){
    //               $scope.showdiv.push(true);
    //               $scope.timeflag.push(false);
    //           }else if($scope.datenow > $scope.flashInfoTwo[j][0].endTime){
    //               $scope.showdiv.push(false);
    //           }else {
    //             $scope.showdiv.push(true);
    //             $scope.timeflag.push(false);
    //           }
    //       }
  }
  $scope.changetime = function (item){
      $scope.index1 = item;
      $interval.cancel(timer);
      if($scope.systemTime>=$scope.flashInfoTwo[item].startTime&&$scope.systemTime<=$scope.flashInfoTwo[item].endTime){
          countDown($scope.systemTime/1000,$scope.flashInfoTwo[item].endTime/1000)
      }else if($scope.systemTime<$scope.flashInfoTwo[item].startTime){
          countDown($scope.systemTime/1000,$scope.flashInfoTwo[item].startTime/1000)
      }else{

      }
     $ionicScrollDelegate.resize();
     $ionicScrollDelegate.scrollTop();
  }
  $scope.$on('$ionicView.beforeEnter', function(e,v) {
    if (v.direction == 'back') {
      return;
      }
      $scope.init();
  });
  /*返回页面*/
  $scope.goback = function() {
    $interval.cancel(timer);
    $interval.cancel(NowTer);
    $ionicScrollDelegate.scrollTop();
    $ionicHistory.goBack();
  };
  //物理返回按钮清楚定时器
  $rootScope.$on('$stateChangeStart',
          function(event, toState, toParams, fromState, fromParams){
            if('flashsale' == fromState.name){
               $interval.cancel(timer);
               $interval.cancel(NowTer);
            }
          });
}]);
APP.service('flashService', ['$http', 'UrlService', function($http, UrlService) {
  this.PrefixInteger = function(num) {
    if (num < 10) {
      return '0' + num;
    } else {
      return num;
    }
  };
  this.getFlashone = function(provinceId,cityId,districtId,streetId,from) {
    //return $http.get(UrlService.getUrl('FLASH_TWO'));
    var params = {
      'provinceId': provinceId,
      'cityId': cityId,
      'districtId': districtId,
      'streetId': streetId,
      'from':from
    }
    return $http.get(UrlService.getNewUrl('NEW_FLASHSALE'), params);
  }
  this.slidedata = function () {
    var params = {
      "type":2
    };
    return $http.get(UrlService.getNewUrl('NEW_SLIDE'), params);
  }
}])
