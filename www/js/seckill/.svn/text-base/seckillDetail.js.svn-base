/**
 * Created by ZXT on 2016/3/15.
 */
APP.controller('SeckillDetailController', ['$scope', '$stateParams', '$rootScope', 'ProductDetailService',
  '$ionicPopup', '$timeout', '$ionicSlideBoxDelegate', '$state', 'UserService', 'UrlService', 'SeckillDetailService', 'CacheService', 'CommonAddressService', 'SeckillService', '$interval', 'countdownService', 'PopupService',
  function ($scope, $stateParams, $rootScope, ProductDetailService, $ionicPopup, $timeout,
            $ionicSlideBoxDelegate, $state, UserService, UrlService, SeckillDetailService, CacheService, CommonAddressService, SeckillService, $interval, countdownService, PopupService) {
    /** 变量声明 **/
    //更改地址页面载入不需要刷新
    var sharePic = 'http://www.ehaier.com/mstatic/wd/v2/img/sg.png';
    $scope.noFresh = false;
    //tableBar选中选品
    $scope.tabNav = 'selection';
    $scope.isButton = true;//秒杀按钮是否可点
    $scope.countDownMsg = '';//倒计时提示
    $scope.seckillList = [];//秒杀活动列表，二维数组，每个活动中有 商品列表
    $scope.isEnd = false;//秒杀活动是否结束
    $scope.productId = $stateParams.productId;
    $scope.message;
    $scope.beginTime = $stateParams.beginTime;
    $scope.endTime = $stateParams.endTime;
    $scope.unSale;//商品是否下架 true为已下架

    /** 方法 **/
      //页面初始化
    $scope.init = function () {
      $scope.isEnd = false;//秒杀活动是否结束
      SeckillService.getServerTime().then(function (response) {
        var serverTime = response.data.data;//得到服务器时间
        var beginTime = $scope.beginTime;
        var endTime = $scope.endTime;
        var diffTime = '';
        var interval = $interval(function () {
          serverTime = serverTime + 1;
          if (serverTime < beginTime) {
            diffTime = countdownService.getTime(countdownService.getTimeDif(beginTime * 1000, serverTime * 1000));
            $scope.countDownMsg = '距开始' + diffTime;
          } else if (serverTime >= beginTime && serverTime <= endTime || serverTime == beginTime) {
            $scope.countDownMsg = '秒杀';
          } else if (serverTime > endTime) {
            $scope.isEnd = true;
            $scope.countDownMsg = '秒杀活动已结束';
            $interval.cancel(interval);
          }
        }, 1000);
      });
      //获取用户信息
      $scope.user = UserService.getUser();
      //商品未载入标志
      $scope.iscompleteLoad = false;
      //接收前页传入商品Id,以请求商品详细信息
      $scope.storeId = $stateParams.storeId;
      $scope.o2oType = $stateParams.o2oType;
      $scope.status = $stateParams.status;
      $scope.fromType = $stateParams.fromType;
      $scope.front = $stateParams.front;
      $scope.sku = $stateParams.sku;
      $scope.seckillId = $stateParams.seckillId;
      $scope.hasStock = true;//有库存
      $scope.memberId = '';
      $scope.seckillPrice = $stateParams.seckillPrice;
      $scope.actualPrice;//微价
      $scope.pcPrice;//商品价格
      $scope.O2OStoreName;
      $scope.hasStock;
      $scope.productCount = 1;//秒杀只能买一件
      $scope.swiperImgs = [];
      if ($scope.user && $scope.user.mid) {
        $scope.memberId = $scope.user.mid;
      }

      var address = CommonAddressService.getAddressInfo();
      //todo 定位默认是北京

      var paramCheck = {
        sku: $scope.sku,
        prodId: $scope.productId,
        regionId: address.areaId,
        number: 1,//写死为1
        provinceId: address.provinceId,
        cityId: address.cityId,
        pcrName: address.provinceName + ' ' + address.cityName + ' ' + address.regionName,
        memberId: $scope.memberId,
        finalPrice: $scope.seckillPrice,
        seckillId: $scope.seckillId
      };

      if (true) { //$scope.nofresh 无用
        //如需要刷新,载入数据
        var param = {
          productId: $scope.productId,
          storeId: $scope.storeId,
          fromUrl: 'seckillList',
          seckillId: $scope.seckillId,
          ts: new Date() - 0
        };

        //秒杀商品的初始化
        SeckillDetailService.seckillDetail(param).success(function (response) {
          if (response.success == false) {
            $scope.unSale = true;
          } else {
            $scope.productModel = response.data.product;
            $scope.productModel.pcrName = response.data.pcrName;
            $scope.iscompleteLoad = true;
            $scope.swiperImgs = response.data.swiperImgs;//轮播图
            $scope.actualPrice = response.data.actualPrice;
            $scope.pcPrice = response.data.finalPrice;
            $scope.O2OStoreName = response.data.O2OStoreName;

            //得到地理位置信息后 检查库存
            //发请求检查库存，
            SeckillDetailService.checkStock(paramCheck).success(function (response) {
              $scope.hasStock = response.data.hasStock;
              $scope.message = response.data.message;
              $scope.isSupportCOD = response.data.isSupportCOD;
              $scope.expectTime = response.data.expectTime;
              $scope.commission = response.data.commission;
              //如果无货
              if (!$scope.hasStock) {
                $scope.isButton = false;//秒杀按钮是否可点
              } else if ($scope.hasStock) {
                $scope.isButton = true;//秒杀按钮是否可点
              }
            });
          }
        }).error(function (msg) {
          alert('网络错误');
        });
      }
    };

    //更改地址
    $rootScope.$on('SECKILL_LOCATION_' + $scope.productId, function (event, data) {
      $scope.noFresh = true;
      $scope.productModel.pcrName = data["text-1"] + ' ' + data["text-2"] + ' ' + data["text-3"]+' '+data["text-4"];
      if ($scope.productModel.pcrName) {
        var param = {
          sku: $scope.sku,
          prodId: $scope.productId,
          regionId: data['value-3'],
          number: 1,//写死为1
          provinceId: data['value-1'],
          streetId:data['value-4'],
          cityId: data['value-2'],
          pcrName: $scope.productModel.pcrName,
          memberId: $scope.memberId,
          finalPrice: $scope.seckillPrice,
          seckillId: $scope.seckillId
        };
        //发请求检查库存，
        SeckillDetailService.checkStock(param).success(function (response) {
          $scope.hasStock = response.data.hasStock;
          $scope.message = response.data.message;
          $scope.isSupportCOD = response.data.isSupportCOD;
          $scope.expectTime = response.data.expectTime;
          $scope.commission = response.data.commission;
          //如果无货
          if (!$scope.hasStock) {
            $scope.isButton = false;//秒杀按钮是否可点
          } else if ($scope.hasStock) {
            $scope.isButton = true;//秒杀按钮是否可点
          }
        });
      }
    });

    //回退到指定页面
    $scope.goBack = function () {
      if ($scope.front == 1) {
        $state.go('myStore');
      } else {
        $scope.$ionicGoBack();
      }
    };

    //页面初始化
    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      if (v.direction == 'back') {//不需要刷新
      } else {
        //需要刷新
        $scope.init();
      }
    });
    //改变添加到店铺状态
    $scope.changeState = function (sta) {
      if (sta == 1) {
        ProductDetailService.changeChooseStateJia($scope.productModel.product.sku, '1')
          .success(function (response, status, headers, config) {
            $scope.productModel.product.onShelf = !$scope.productModel.product.onShelf;
          });
      } else {
        ProductDetailService.changeChooseStateDui($scope.productModel.product.sku)
          .success(function (response, status, headers, config) {
            $scope.productModel.product.onShelf = !$scope.productModel.product.onShelf;
          });
      }
    };
    $scope.changeArea = function () {
      $state.go('commonLocation', {
        flag: 'SECKILL_LOCATION_' + $scope.productId
      });
    };
    $scope.seckillBuy = function () {
      var param = {
        productIds: $scope.productId,
        numbers: 1,
        seckillId: $scope.seckillId,
        COOKIE_DOMAIN: 'mk',//todo  传线上地址
        DOMAIN_URL: 'http://172.24.1.22',
        POM_STATIC_DOMAIN_NAME: 'http://172.24.1.22/mstatic'

      };
      SeckillDetailService.seckillBuy(param).success(function (response) {

        if (response.success == true && response.data != null) {
          CacheService.set('seckillOrderInfo', response.data);// 秒杀生成的订单信息存在缓存中，存在内存中
          $state.go('orderConfirmSeckill', {
            seckillId: param.seckillId,
            numbers: param.numbers,
            productIds: param.productIds,
            beginTime: $scope.beginTime,
            endTime: $scope.endTime
          });
        } else if (response.success == false) {
          $scope.unSale = true;//商品已下架
          //需要刷新
          $scope.init();
        }
        else {
          $scope.showPopup('立即购买失败');
        }
      }).error(function (err) {
        alert('网络错误');
      });
    };
    //添加收藏
    $scope.tianJiaShouCang = function () {
      ProductDetailService.addShouCang($scope.productId, $scope.productModel.product.productName, $scope.productModel.product.defaultImageUrl, $scope.productModel.product.sku, $scope.productModel.pcrName)
        .success(function (data) {
          $scope.showPopup('收藏成功');
          $scope.productModel.isCollected = !$scope.productModel.isCollected;
        });
    };
    //取消收藏
    $scope.quXiaoShouCang = function () {
      ProductDetailService.cancelShouCang($scope.productId)
        .success(function (data) {
          $scope.showPopup('取消成功');
          $scope.productModel.isCollected = !$scope.productModel.isCollected;
        });
    };
    //PopUp方法封装
    $scope.showPopup = function (messAge) {
      var myPopup = $ionicPopup.show({
        template: messAge
      });
      $timeout(function () {
        myPopup.close();
      }, 1000);
    };
    /* 客服--调插件*/
    $scope.customerServe = function () {
      var u = navigator.userAgent;
      if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
        window.open = cordova.InAppBrowser.open('http://app.qq.com/#id=detail&appid=1104761357', '_blank', 'location=yes');
      } else if (u.indexOf('iPhone') > -1) {
        window.open = cordova.InAppBrowser.open('http://app.qq.com/#id=detail&appid=1104761357', '_system', 'location=yes');
      } else {
        window.open = cordova.InAppBrowser.open('http://app.qq.com/#id=detail&appid=1104761357', '_system', 'location=yes');
      }
    };

    //分享
    $scope.share = function () {
      if (!UserService.getUser().mid) {
        PopupService.showToast('请先登录,再分享');
        return;
      }
      if (window.umeng) {
        var title = '顺逛秒杀活动',
          content = '给您推荐顺逛每日秒杀商品,不可错过哦!',
          pic = sharePic,
          url = UrlService.getShareLinkHeader() + 'seckillDetail/' + $scope.productId + '/' + $scope.o2oType + '/'
            + $scope.fromType + '/' + $scope.storeId + '/' + $scope.front + '/' + $scope.seckillPrice + '/'
            + $scope.seckillId + '/' + $scope.sku + '/' + $scope.status + '/' + $scope.beginTime + '/'
            + $scope.endTime + '/' + UserService.getUser().mid;
        window.umeng.share(title, content, pic, url, 0);
      }
    };

  }]);


APP.service('SeckillDetailService', ['$http', 'UrlService', function ($http, UrlService) {

  this.checkStock = function (param) {
    var url = UrlService.getUrl('CHECK_STOCK');
    return $http.get(url, param);
  };
  this.seckillDetail = function (param) {
    if (!param.productId) {
      alert('无productId error');
      return;
    }
    var url = UrlService.getUrl('SECKILLDETAIL') + param.productId + '.html';
    return $http.get(url, param);
  };

  this.seckillBuy = function (param) {
    var url = UrlService.getUrl('SECKILLBUY');
    return $http.get(url, param);
  };
}]);

