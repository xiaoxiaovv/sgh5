/**
 * creater:刘成杰
 * create time:2017/8/4
 * describe：更多
 **/
APP.controller('SeeMoreController', ['UrlService', '$sce', 'HomePageService', 'PopupService', '$ionicPopup', 'UrlService', '$q', '$rootScope', 'CommonAddressService', 'AreaService', 'InAppBrowserService', 'CreditService', 'ShopService', '$scope', '$timeout', 'UserService', '$state', 'SeeMoreService', 'GoodsService', '$localstorage', 'RegisterService',
  function (UrlService, $sce, HomePageService, PopupService, $ionicPopup, UrlService, $q, $rootScope, CommonAddressService, AreaService, InAppBrowserService, CreditService, ShopService, $scope, $timeout, UserService, $state, SeeMoreService, GoodsService, $localstorage, RegisterService) {
    /** 变量声明 **/
    //获取经纬度和城市编码
    function getPosition() {
      var deferred = $q.defer(); //声明承诺
      //定位相关
      if (ionic.Platform.isAndroid() && window.cordova) {
        if (cordova.plugins.amap4location) {
          cordova.plugins.amap4location.location(
            function (response) {
              $rootScope.globalConstant.lat = response.latitude;
              $rootScope.globalConstant.lon = response.longitude;
              AreaService.getLocalArea()
                .then(function (res) {
                  deferred.resolve(res.regeocode.addressComponent.adcode);
                })
              CommonAddressService.addAddressInfo();
              $rootScope.globalConstant.positionStatus = true; //定位状态
            },
            function (error) {
              if (error['errorCode'] == '12') {
                $ionicPopup.alert({
                  title: '',
                  cssClass: 'location-popup',
                  okText: '知道了',
                  template: '<div style="color: #000;font-size: 14px;font-weight: bold;">此功能需获取您的位置信息</div><div style="color: #000;font-size: 12px;">请打开“定位服务”允许“顺逛”获取你的位置信息</div>'
                });
              }
              CommonAddressService.addAddressInfo();
              $rootScope.globalConstant.positionStatus = false; //定位状态
            }
          );
        }
      } else {
        //定位服务--采用浏览器定位
        AreaService.init().then(function (res) {
          console.log(res);
          $rootScope.globalConstant.lat = res.coords.latitude;
          $rootScope.globalConstant.lon = res.coords.longitude;
          AreaService.getLocalArea()
            .then(function (res) {
              console.log(res);
              deferred.resolve(res.regeocode.addressComponent.adcode);
            })
          CommonAddressService.addAddressInfo();
          $rootScope.globalConstant.positionStatus = true; //定位状态
        }, function (error) {
          if (error.code == '1') {
            $ionicPopup.alert({
              title: '',
              cssClass: 'location-popup',
              okText: '知道了',
              template: '<div style="color: #000;font-size: 14px;font-weight: bold;">此功能需获取您的位置信息</div><div style="color: #000;font-size: 12px;">请打开“定位服务”允许“顺逛”获取你的位置信息</div>'
            });
          }
          CommonAddressService.addAddressInfo();
          $rootScope.globalConstant.positionStatus = false; //定位状态
        });
      }
      return deferred.promise;
    }
    //好慷在家
    $scope.toHomeking = function(){
      SeeMoreService.homeking().success(function(res){
        if(res.data != -100){
          var url = encodeURI(res.data);
          if (window.cordova) {
            /**
             * H5跳转原生webView页面
             * @param resultUrl {String} 链接url
             * @param title {String} 标题
             *
             */
            window.emc.presentH5View(url, "好慷在家");
          } else {
            window.location.href = url ;
          }
        }else{
          $state.go('login');
        }
      })
    };

//     //云缴费
// $scope.goToLiving = function(){

//   if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
//     $scope.isIosApp = 'ios';
  // } else if (ionic.Platform.platform().indexOf('android') != -1 && window.cordova)  {
  //   $scope.isIosApp = 'android';
  // } else {
  //   $scope.isIosApp = 'H5';
  // }
  // GoodsService.getAddress()
  //   .success(function(res){
  //     if (res.data == null) {
  //       $scope.value = '173';

  //     } else {
  //       var data = eval(res.data)[0];
  //       $scope.value = data.cityId;
  //     }

  //     HomePageService.isWdHost()
  //       .success(function (res) {
  //         $rootScope.isWdHost = res.data.isHost;
  //         if (res.data.isHost == -1) {
  //           $state.go('login');
  //         } else {
//             var url = UrlService.getLiveingUrl();
//             console.log(url)
//             var LIVING = url+"?flag="+$localstorage.get('sg_login_token_secret')+"&systemType="+$scope.isIosApp+"&cityId="+$scope.value;
//             //如果是 网页端
//             if (!window.cordova) {
//               window.location.href = LIVING;
//             } else {
//               /**
//                * H5跳转原生webView页面
//                * @param resultUrl {String} 链接url
//                * @param title {String} 标题
//                *
//                */
//               window.emc.presentH5View(LIVING, "生活缴费");
//             }
//           }
//         });
//     })
// };

    //投资
    $scope.goToManageMoney = function () {
      if ($rootScope.isWdHost == 1) {
        $state.go('financialMoney', {
          whereId: 'seeMore'
        });
      } else if ($rootScope.isWdHost == 0) { //普通用户 没开过店 0（记得改回来）
        RegisterService.wdApply().success(function (response) {
          if (response.success) {
            if (response.data) { //绑定过手机
              $state.go('newAuthenticationHome'); //去完善信息页面
            } else { //没绑定过手机
              $state.go('registerForStore', {
                hasHistory: 1
              }); //去绑定手机号  hasHistory
            }
          } else { //接口异常
            PopupService.showToast('服务端错误');
          }
        }).error(function () {
          alert('网络错误');
        });
      } else {
        $state.go('login');
      }
    }
    //生活服务
    $scope.goToEmc = function () {
      if ($scope.isApp) {
        HomePageService.isWdHost()
          .success(function (res) {
            $rootScope.isWdHost = res.data.isHost;
            if (res.data.isHost == -1) {
              $state.go('login');
            } else {
              // var access_token = UserService.getUser().accessToken;
              // console.log(access_token);
              HomePageService.token_get()
                .success(function (res) {
                  var access_token = res.data;
                  if (access_token) {
                    /**
                     *调转视图方法
                     * @param1 isOffical {Integer} （1:正式环境；0:测试环境）
                     * @param2 access_token {String} 用户中心返回的access_token
                     * @param3 entryPoint {String} 进入EMC后直接进入某功能，例如“OldforNew”,可传空字符串""
                     */
                    window.emc.presentEmcView(UrlService.getEnviroment(), access_token, "");
                  } else {
                    PopupService.showToast('您当前账号暂无法访问此服务,请使用关联手机号登录。');
                  }
                })
            }
          })
      }
      else {
        PopupService.showToast('请去顺逛App查看此服务');
      }
      // $state.go('lifeService');
    };
    $scope.openCC = function (type, url) {
      switch (type) {
        case 1: //水之道
          HomePageService.isWdHost()
            .success(function (res) {
              $rootScope.isWdHost = res.data.isHost;
              if (res.data.isHost == -1) {
                $state.go('login');
              } else {
                getPosition()
                  .then(function (res) {
                    var url = UrlService.getCPUrl('SZD_URL'); //水之道URL
                    var finalUrl = url + "?token=" + UserService.getUser().token + "&alt=" + $rootScope.globalConstant.lat + "&lng=" + $rootScope.globalConstant.lon + "&cityCode=" + res;
                    console.log(finalUrl);
                    if (window.cordova) {
                      /**
                       * H5跳转原生webView页面
                       * @param resultUrl {String} 链接url
                       * @param title {String} 标题
                       *
                       */
                      window.emc.presentH5View(finalUrl, "水之道");
                    } else {
                      window.open(finalUrl, '_blank', 'location=yes');
                    }
                  })
              }
            })
          break;
        case 2: //游戏
          if (window.cordova) {
            /**
             * H5跳转原生webView页面
             * @param resultUrl {String} 链接url
             * @param title {String} 标题
             *
             */
            window.emc.presentH5View(url, "游戏头条");
          } else {
            window.open(url, '_blank', 'location=yes');
          }
          break;
        case 3: //定制
          HomePageService.isWdHost()
            .success(function (res) {
              $rootScope.isWdHost = res.data.isHost;
              if (res.data.isHost == -1) {
                $state.go('login');
              } else {
                var DINGZHI_ZHONGCHUANGHUI = "http://m.ehaier.com/v3/mstore/sg/diy/login/request.html"+"?flag="+$localstorage.get('sg_login_token_secret').substring(6);
                //如果是 网页端
                if (!window.cordova) {
                  window.location.href = DINGZHI_ZHONGCHUANGHUI;
                  return;
                } else {
                  /**
                   * H5跳转原生webView页面
                   * @param resultUrl {String} 链接url
                   * @param title {String} 标题
                   *
                   */
                  window.emc.presentH5View(DINGZHI_ZHONGCHUANGHUI, "海尔交互定制平台");
                }
              }
            })
          break;
        case 4: //海尔洗衣机
          HomePageService.isWdHost()
            .success(function (res) {
              $rootScope.isWdHost = res.data.isHost;
              if (res.data.isHost == -1) {
                $state.go('login');
              } else {
                if (window.cordova) {
                  /**
                   *调转海尔洗衣机方法
                   * @param userAccount {String} 用户名
                   * @param passWord {String} 密码
                   * @param access_token
                   */
                  var access_token = UserService.getUser().accessToken;
                  window.emc.presentWashView($rootScope.userAccount, $rootScope.password, access_token);
                } else {
                  PopupService.showToast('请去顺逛App查看此服务');
                }
              }
            })
            break;
        case 5://了解海尔热水器(只有H5才有这个入口)
          var rsqEntryUrl = 'http://m.ehaier.com/mobile/heater/index.html';//热水器入口url
          window.open(rsqEntryUrl, '_blank', 'location=yes');
          break;
        case 6://好空气
          var hkqEntryUrl = 'http://uhome.haier.net:8470/acbizCms/aircircle/indexAirCircle.do';//好空气入口url
          if (!window.cordova) {
            window.open(hkqEntryUrl, '_blank', 'location=yes');
          } else {
            /**
             * H5跳转原生webView页面
             * @param resultUrl {String} 链接url
             * @param title {String} 标题
             *
             */
            window.emc.presentH5View(hkqEntryUrl, "好空气");
          }
          break;
        case 7://馨小厨
          var xxcUrl = 'http://linkcook.cn/quanquan/ulist.html';
          if (!window.cordova) {
            window.open(xxcUrl, '_blank', 'location=yes');
          } else {
            window.emc.presentH5View(xxcUrl, "馨小厨");
          }
          break;
        case 8://酒知道
          var jzdUrl = 'http://jiuzhidao.com/wap/';
          if (!window.cordova) {
            window.open(jzdUrl, '_blank', 'location=yes');
          } else {
            window.emc.presentH5View(jzdUrl, "酒知道");
          }
          break;
          case 9://企业购
          var qygdUrl = 'http://b2b.haier.com/mobiles/index.html';
          if (!window.cordova) {
            window.open(qygdUrl, '_blank', 'location=yes');
          } else {
            window.emc.presentH5View(qygdUrl, "海尔企业购");
          }
          break;
        case 10://社区洗
          var sqxUrl = 'http://www.saywash.com/saywash/WashCallWx/page/index.html';
          if (!window.cordova) {
            window.open(sqxUrl, '_blank', 'location=yes');
          } else {
            window.emc.presentH5View(sqxUrl, "社区洗");
          }
          break;
      }

    }
    $scope.$on('$ionicView.beforeEnter', function () {
      if (window.cordova) {
        $scope.isApp = true;
      } else {
        $scope.isApp = false;
      }

    })
    $scope.goToApplyForCard = function () {

      HomePageService.isWdHost().success(function (res) {
        $rootScope.isWdHost = res.data.isHost;
        if (res.data.isHost == -1) {
          $state.go('login');
        } else {
          $state.go('applyForCard');
        }
      });
    }
  }
]);
/**
 * creator:刘成杰
 * create time:2017/8/4
 * describe：更多
 **/
APP.service('SeeMoreService', ['$http', 'UrlService', function ($http, UrlService) {
  //个人中心
  this.personalInit = function () {
    return $http.get(UrlService.getNewUrl('PERSONAL_CENTER'));
  }
  //好慷在家
  this.homeking =function(){
    return $http.get(UrlService.getNewUrl('GET_homeking'));
  };
}]);
