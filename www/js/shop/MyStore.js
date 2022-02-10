/**
 * creator:feng.jiang@dhc.com.cn
 * create time:2016/3/14
 * describe：MyStoreController 我的店铺（预览）控制器
 **/
APP.controller('MyStoreController', ['$localstorage','$scope', '$stateParams', '$rootScope', '$ionicHistory', '$state',
  '$ionicSideMenuDelegate', 'UserService', 'MyStoreService', '$ionicSlideBoxDelegate', '$ionicModal',
  'ChooseShopTemplateService', 'PopupService', 'GoodsService', 'CommonAddressService', '$timeout',
  '$ionicScrollDelegate', 'UrlService', 'SetShopCoverService', 'BannerThemeService', 'SeckillService', 'countdownService', '$interval', '$ionicLoading', 'LoginService','CreditService','ShopService','$http','GetStatisticInfoService','HomePageService',
  function ($localstorage,$scope, $stateParams, $rootScope, $ionicHistory, $state, $ionicSideMenuDelegate, UserService,
            MyStoreService, $ionicSlideBoxDelegate, $ionicModal, ChooseShopTemplateService, PopupService,
            GoodsService, CommonAddressService, $timeout, $ionicScrollDelegate, UrlService, SetShopCoverService, BannerThemeService, SeckillService, countdownService, $interval, $ionicLoading, LoginService,CreditService,ShopService,$http,GetStatisticInfoService,HomePageService) {
    /** 变量声明 **/
    $scope.lType = 'templates/common/ListTemplate1.html';
    $scope.tType = 'templates/common/TitleTemplate1.html';
    $scope.isBuyer = LoginService.getRole();//判断用户角色信息；0为买家；1为卖家
    $scope.userId = UserService.getUser().mid;
    $scope.productsList = [];  //商品列表
    $scope.contentDataListxyz = [];
    $scope.hasMoreData = false;//加载更多标识
    $scope.filterCategory = [true, false, false];  //筛选条件互斥展开标识
    $scope.myStoreInfo = {};  //我的店铺相关信息
    $scope.slideImage = [];  //轮播图
    $scope.avatarImage = '';//用户头像
    $scope.address = '';//显示区县及街道地址
    $scope.categorySelected = [true, false, false, false, false, false, false, false, false, false,
      false, false, false, false, false, false, false, false, false];  //分类是否选中
    $scope.brandList = [];   //筛选品牌列表
    $scope.otherList = [];  //其他筛选列表
    $scope.otherState = [false, false];  //其他筛选条件切换状态
    $scope.isCurrent = [true, false];     //条件是否选中标识
    $scope.brandSelected = [true, false];  //品牌是否选中标识
    $scope.priceSelected = [true, false];  //价格是否选中标识
    var firstParamsArr = ['all', 'all', '0'];  //库存，品牌，价格选中参数集合
    var secondParamsArr = [];  //其他筛选条件选中参数集合
    var paramIndex = 0;  //筛选其他条件的顺序（不包括品牌）
    $scope.allProducts = 0;//商品总数
    $scope.buttonShow = false;//右下角展开图标不打开
    $scope.buttonBuyerShow = false;  //买家中心入口是否显示
    $scope.coverImage = $rootScope.imgBaseURL+'img/bg_shop_4.png';//顶部封面图片
    $scope.countDownMsg = '';//倒计时提示
    $scope.screenWidth = window.innerWidth;
    $scope.storeId = $stateParams.storeId;
    $scope.shareStoreId = $stateParams.shareStoreId;
    $scope.storeTitleName = '';//标题栏店铺名称
    $scope.stockName = '显示全部货';//库存选中项，默认：显示全部货
    $scope.brandName = '全部';//品牌选中项，默认：全部
    $scope.priceName = '全部';//价格选中项，默认全部：全部
    $scope.otherName = ['全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部'];//其他筛选条件选中项，默认：全部
    var token = '';//第三方登录信息
    $scope.brand = true; //品牌展开标志
    $scope.iSPrice = true; //价格展开标志
    $scope.productCateIdType = '0'; //类型默认0【类目0 ， 品牌1 ， 属性2】
    $scope.productCateId = ''; //类目id
    $scope.switch = true; //筛选接口查询开关，防止多次请求筛选；
    $scope.StockStateArr = ['all', 'hasStock']; //库存状态数组
    $scope.filterParameterArr = ['all', 'all', '0']; //筛选参数数组
    $scope.filterPrice = {
      min: null,
      max: null
    };

    //IOS特殊样式
    $scope.leftArrow = {};
    $scope.mystoreTitle = {};
    $scope.addressDiv = {};
    $scope.addressLabel = {};
    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {//只有ios app 特有的样式
      $scope.leftArrow = {top: '14px'};
      $scope.mystoreTitle = {top: '18px'};
      $scope.addressDiv = {top: '16px'};
      $scope.addressLabel = {top: 0};
    }
    $scope.messageImgFlag=true;//消息图片判断
    $scope.flagNum = false;
    $scope.messageImgUrl = "http://cdn09.ehaier.com/shunguang/H5/www/img/messageLogo@2x.png";
    //地址选择框高度
    var screenHeight=window.innerHeight;
    var topHeight=250+123;
    var contentHeight=screenHeight-topHeight+'px';
    $scope.contentHeight = {
      'height':contentHeight
    }
    /** 地址变量声明 **/
    $scope.addressTitle = '配送至';
    $scope.dataAdd = null;
    $scope.flag = 'STORE_LOCATION';
    $scope.defaultValue = null;
    $scope.level = 0;
    var addressMessage = {};//自动定位地址信息
    var areaValue;
    var areaValueCity;

    /** http请求参数 **/
    var pageIndex = 1,  //分页页数
      pageSize = 5,    //每页请求数据条数
      filterData = '',//排序及筛选条件
      qs = 'saleDesc',
      fromType = '2',
      flag = '',
      memberId = '',//
      productCateId = 0,  //分类Id
      provinceId = 16,   //省分Id  山东
      cityId = 173,     //市Id  青岛
      districtId = 2450,  //区Id   崂山
      streetId = 12036596,//中韩街道
      provinceName = '',
      cityName = '',
      sortColumn = 'saleDesc';//排序标识
    $scope.stockState = false;
    /*********************分享标签－whiteBird start*********************/
    $scope.showShare = false;
    /*********************分享标签－whiteBird end*********************/

     /*swiper轮播*/
    //  $scope.swpcMyStore1;
    /** 方法 **/
    $scope.init = function () {
      /*********************分享标签－whiteBird start*********************/
      $scope.showQQ = false;
      $scope.showWeChat = false;

      /*********************分享标签－whiteBird end*********************/
      $scope.productsList = [];
      $scope.contentDataListxyz = [];
      restParams();
      MyStoreService.getStoreInfo($scope.storeId,$scope.shareStoreId)
        .success(function (response) {
          switch (response.data.titleLayout) {
            case 'tit-df':
                $scope.tType = 'templates/common/TitleTemplate' + 1 + '.html';
              break;
            case 'tit-bp':
                $scope.tType = 'templates/common/TitleTemplate' + 2 + '.html';
              break;
            case 'tit-colum2':
                $scope.tType = 'templates/common/TitleTemplate' + 3 + '.html';
              break;
          }
          switch (response.data.listLayout) {
            case 'layout-df':
                $scope.lType = 'templates/common/ListTemplate' + 1 + '.html';
              break;
            case 'layout-bp':
                $scope.lType = 'templates/common/ListTemplate' + 2 + '.html';
              break;
            case 'layout-colum2':
                $scope.lType = 'templates/common/ListTemplate' + 3 + '.html';
              break;
          }
          $scope.coverImage = response.data.coverUrl;
          $scope.myStoreInfo = response.data;
          $scope.slideImage = response.data.banner;
          $scope.avatarImage = response.data.avatarImageFileId;
          $scope.storeTitleName = $scope.myStoreInfo.storeName + $scope.myStoreInfo.storeTypeName;
          $ionicSlideBoxDelegate.$getByHandle('my_store_slider').update();
          $ionicSlideBoxDelegate.loop(true);
          // if(typeof $scope.swpcMyStore1 == "undefined" ){
          //   /*swiper轮播*/
          //   $timeout(function(){
          //     $scope.swpcMyStore1 = new Swiper('#swpc-MyStore-1', {   //轮播图绑定样式名
          //       pagination: '#swpp-MyStore-1',
          //       paginationClickable: true,
          //       autoplay: 4000,
          //       loop: false,
          //       observer:true,
          //       observeParents:true,
          //       autoplayDisableOnInteraction:false,
          //     });
          //   },200);
          // }else{
          //   $scope.swpcMyStore1.update();
          // }
        });
      ShopService.getLevelInfo(
        function(httpResult) {
          httpResult.success(
            function (response) {
	          if(!response.success){
	        	return;
	          }
              $scope.avatarImageFileId = response.data.avatarImageFileId;
              $scope.userCurrentLevelId = response.data.userCreditWithLevel.order;
              $scope.userName = response.data.userCreditWithLevel.name;
              $scope.storeCreditWithLevel = response.data.storeCreditWithLevel;
              if (response.data.storeCreditWithLevel) {
                $scope.levelArray = [];
                if (response.data.storeCreditWithLevel.order <= 3) {
                  $scope.imgCount = response.data.storeCreditWithLevel.order;
                  for (var i = 0; i < response.data.storeCreditWithLevel.order; i++) {
                    $scope.levelArray.push($rootScope.imgBaseURL+'img/StarLevel@2x.png');
                  }
                } else {
                  for (var i = 0; i < response.data.storeCreditWithLevel.order - 3; i++) {
                    $scope.levelArray.push($rootScope.imgBaseURL+'img/Diamond@2x.png');
                  }
                }
              }
            }
          )
        },$scope.storeId
      );
      $timeout(function () {
        MyStoreService.getPositionFromCookie().
          success(function (response, status, headers, config) {
            if (response.data != null && response.data != undefined && response.data.length != 0) {
              var addressInfo = eval(response.data);
              provinceId = addressInfo[0].provinceId;
              cityId = addressInfo[0].cityId;
              districtId = addressInfo[0].areaId;
              streetId = addressInfo[0].streetId;
              $scope.address = addressInfo[0].regionName;
              pageIndex = 1;
              $scope.productsList = [];
              $scope.contentDataListxyz = [];
              loadProducts(memberId, provinceId, cityId, districtId, streetId, provinceName, cityName, $scope.address, pageIndex, pageSize, productCateId, filterData, fromType, flag, false, qs);
            } else {
              getCurrentPosition();
              $timeout(function () {
                pageIndex = 1;
                $scope.productsList = [];
                $scope.contentDataListxyz = [];
                loadProducts(memberId, provinceId, cityId, districtId, streetId, provinceName, cityName, $scope.address, pageIndex, pageSize, productCateId, filterData, fromType, flag, false, qs);
              }, 500);
            }
          })
      }, 500);
      HomePageService.getUnReadMsg()
        .success(function (res) {
          if (res.data > 0) {
            $scope.flagNum = true;
          } else {
            $scope.flagNum = false;
          }
        })
    };
    $scope.getSeckillInfo = function () {
      SeckillService.getServerTime().success(function (response) {
        var serverTime = response.data;//得到服务器时间
        var beginTime = $scope.myStoreInfo.seckill.beginTime;
        var endTime = $scope.myStoreInfo.seckill.endTime;
        var diffTime = '';
        var interval = $interval(function () {
          serverTime = serverTime + 1;
          if (serverTime < beginTime) {
            diffTime = countdownService.getTime(countdownService.getTimeDif(beginTime * 1000, serverTime * 1000));
            $scope.countDownMsg = '距离开始时间还有' + diffTime;
          } else if (serverTime >= beginTime && serverTime <= endTime) {
            diffTime = countdownService.getTime(countdownService.getTimeDif(endTime * 1000, serverTime * 1000));
            $scope.countDownMsg = '距离结束时间还有' + diffTime;
          } else if (serverTime > endTime) {
            $scope.countDownMsg = '秒杀活动已结束';
            $interval.cancel(interval);
          }
        }, 1000);
      });
    };
    $scope.loadMore = function () {
      pageIndex = pageIndex + 1;
      // loadProducts(memberId, provinceId, cityId, districtId, streetId, provinceName, cityName, $scope.address, pageIndex, pageSize, productCateId, filterData, fromType, flag, true, qs);
      loadProducts(memberId, provinceId, cityId, districtId, streetId, provinceName, cityName, $scope.address, pageIndex,
        pageSize, productCateId, $scope.filterParams, fromType, flag, true, qs);
    };

    function loadProducts(memberId, provinceId, cityId, districtId, streetId, provinceName, cityName, districtName, pageIndex, pageSize, productCateId, filterData, fromType, flag, noLoading, qs) {
      MyStoreService.getProductsList(memberId, provinceId, cityId, districtId, streetId, provinceName, cityName, districtName, pageIndex, pageSize, productCateId, filterData, fromType, flag, noLoading, qs).
        success(function (response) {
          $scope.allProducts = response.totalCount;
          if (response.data && response.data.productList != null && response.data.productList != undefined
            && response.data.productList.length != 0) {
            if(pageIndex==1){
              $scope.productsList = response.data.productList;
              if(response.data.isCanSyncGetPrice){
                GoodsService.asyncPrice(response.data.traceId).success(function(res){
                  if(res.success){
                    for(var i=0,l=response.data.productList.length;i<l;i++){
                      var product=response.data.productList[i];
                      for(var j=0,m=res.products.length;j<m;j++){
                        var price=res.products[j];
                        if(product.sku==price.sku){
                          product["finalPrice"]=price["finalPrice"];
                          product["commission"]=price["commission"];
                        }
                      }
                    }
                  }
                });
              }
            }else{
              $scope.productsList = $scope.productsList.concat(response.data.productList);
              if(response.data.isCanSyncGetPrice){
                GoodsService.asyncPrice(response.data.traceId).success(function(res){
                  if(res.success){
                    for(var i=0,l=response.data.productList.length;i<l;i++){
                      var product=response.data.productList[i];
                      for(var j=0,m=res.products.length;j<m;j++){
                        var price=res.products[j];
                        if(product.sku==price.sku){
                          product["finalPrice"]=price["finalPrice"];
                          product["commission"]=price["commission"];
                        }
                      }
                    }
                  }
                });
              }
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $ionicLoading.hide();
            if ($scope.productsList) {
              var len = $scope.productsList.length;
              $scope.hasMoreData = !(response.totalCount === len);
            }
          } else {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.hasMoreData = false;
            $scope.allProducts = 0;
            $scope.productsList = [];
            $scope.contentDataListxyz = [];
          }
        });
    }

    function restParams() {//重置参数
      pageIndex = 1;
      $scope.productsList = [];
      $scope.contentDataListxyz = [];
      $scope.hasMoreData = false;
      $scope.buttonShow = false;//右下角展开图标不打开
      $scope.buttonBuyerShow = false;  //买家中心入口是否显示
    }

    //销量方法
    $scope.saleNum = function () {
      restParams();
      var sStyle = document.getElementById('myStoreSaleNum').style;
      var pStyle = document.getElementById('myStorePopularity').style;
      var fStyle = document.getElementById('myStoreFilter').style;
      sStyle.backgroundColor = '#32BEFF';
      sStyle.color = 'white';
      pStyle.backgroundColor = 'white';
      pStyle.color = '#888';
      fStyle.backgroundColor = 'white';
      fStyle.color = '#888';
      // filterData = ''; yl 记录筛选条件
      qs = 'saleDesc';
      loadProducts(memberId, provinceId, cityId, districtId, streetId, provinceName, cityName, $scope.address, pageIndex, pageSize, productCateId, filterData, fromType, flag, false, qs);
    };
    //人气方法
    $scope.popularity = function () {
      restParams();
      var sStyle = document.getElementById('myStoreSaleNum').style;
      var pStyle = document.getElementById('myStorePopularity').style;
      var fStyle = document.getElementById('myStoreFilter').style;
      sStyle.backgroundColor = 'white';
      sStyle.color = '#888';
      pStyle.backgroundColor = '#32BEFF';
      pStyle.color = 'white';
      fStyle.backgroundColor = 'white';
      fStyle.color = '#888';
      // filterData = ''; yl
      qs = 'isHotDesc';
      loadProducts(memberId, provinceId, cityId, districtId, streetId, provinceName, cityName, $scope.address, pageIndex,
        pageSize, productCateId, filterData, fromType, flag, false, qs);
    };
    //筛选方法
    // $scope.productsFilter = function () {
    //   var sStyle = document.getElementById('myStoreSaleNum').style;
    //   var pStyle = document.getElementById('myStorePopularity').style;
    //   var fStyle = document.getElementById('myStoreFilter').style;
    //   sStyle.backgroundColor = 'white';
    //   sStyle.color = '#888';
    //   pStyle.backgroundColor = 'white';
    //   pStyle.color = '#888';
    //   fStyle.backgroundColor = '#32BEFF';
    //   fStyle.color = 'white';
    //
    //   MyStoreService.getFilterList(productCateId).
    //     success(function (response, status, headers, config) {
    //       if (response.success) {
    //         $scope.brandList = response.data.brandList;
    //         if (response.data.filterMap != undefined) {
    //           $scope.otherList = response.data.filterMap.lstAttributes;
    //           for (var i = 0, len = $scope.otherList.length; i < len; i++) {
    //             secondParamsArr[i] = 0;
    //           }
    //         } else {
    //           $scope.otherList = [];
    //         }
    //       } else {
    //         console.log('获取筛选列表出错！');
    //       }
    //     });
    //   $scope.filterModal.show();
    // };

    // 打开筛选 modal
    $scope.productsFilter = function () {
      var sStyle = document.getElementById('myStoreSaleNum').style;
      var pStyle = document.getElementById('myStorePopularity').style;
      var fStyle = document.getElementById('myStoreFilter').style;
      sStyle.backgroundColor = 'white';
      sStyle.color = '#888';
      pStyle.backgroundColor = 'white';
      pStyle.color = '#888';
      fStyle.backgroundColor = '#32BEFF';
      fStyle.color = 'white';
      $scope.filterModal.show();
      // $scope.resetFilter();
      //$scope.filterParameterArr = ['hasStock', 'all', '0'];
      //防止多次加载
      if ($scope.switch) {
        // $scope.switch = false;
        GoodsService.getFilterData()
          .success(function (response) {
            if (response.success) {
              var data = response.data.brandList;
              for (var i = 0; i < data.length; i++) {
                if($scope.filterParameterArr && $scope.filterParameterArr[1] && $scope.filterParameterArr[1] != 'all'){ // 已选择的品牌项
                  if(($scope.filterParameterArr[1].indexOf(data[i].id)> -1)){
                    if(i>0){
                      data[i].isActive = true;
                    }
                  }else {
                    data[i].isActive = false;
                  }
                }else{
                  if (i == 0) {
                    data[i].isActive = true;
                  } else {
                    data[i].isActive = false;
                  }
                }
              }
              $scope.brandList = data;
              console.log($scope.brandList)
              //if (response.data.filterMap != undefined) {
              //  $scope.otherList = response.data.filterMap.lstAttributes;
              //  var len = $scope.otherList.length;
              //  for (var i = 0; i < len; i++) {
              //    $scope.filterOtherPatam[i] = 0;
              //    $scope.isCurrent[i] = [true,false];
              //  }
              //} else {
              //  $scope.otherList = [];
              //}
            }
          });

      }
    };

    //收起展开
    $scope.changeDown = function(item) {
      item.down = !item.down;
    };

    //选择品牌
    $scope.changeBrand = function () {
      $scope.brand = !$scope.brand;
    };
    //价格折叠
    $scope.changePrice = function () {
      $scope.iSPrice = !$scope.iSPrice;
    };
    //库存状态筛选方法
    $scope.chooseStockState = function (index) {
      $scope.filterParameterArr[0] = $scope.StockStateArr[index];
      // firstParamsArr[0] = param;
      // $scope.stockState = !$scope.stockState;
      // if (index == 0) {
      //   $scope.stockName = '显示全部货';
      // } else {
      //   $scope.stockName = '仅看有货'
      // }
    };

    //选择品牌 --支持多选
    $scope.chooseBrand = function (index, brand) {
      firstParamsArr[1] = $scope.brandList[index].id != 0 ? $scope.brandList[index].id : 'all';
      $scope.brandName = $scope.brandList[index].brandName;
      for (var i = 0, len = $scope.brandList.length; i < len; i++) {
        $scope.brandSelected[i] = (i === index);
      }
      //$scope.isBrand = [false, false, false, false, false, false, false, false, false];
      //$scope.isBrand[index] = true;
      //$scope.filterParameterArr[1] = $scope.brandList[index].id != 0 ? $scope.brandList[index].id : 'all';
      //$scope.brandName = $scope.brandList[index].brandName;
      //brand.isActive = !brand.isActive;
      var n = 0;
      var length = $scope.brandList.length;
      if (brand.brandName == "全部") {
        $scope.brandList[0].isActive = true;
        for (var i = 1; i < $scope.brandList.length; i++) {
          $scope.brandList[i].isActive = false;
        }
      } else {
        brand.isActive = !brand.isActive;
        for (var i = 1; i < $scope.brandList.length; i++) {
          if (!$scope.brandList[i].isActive) {
            $scope.brandList[0].isActive = false;
          } else {
            n++;
          }
        }
        if (n == 0) {
          $scope.brandList[0].isActive = true;
        }
        if (n == length - 1) {
          $scope.brandList[0].isActive = true;
          for (var i = 1; i < $scope.brandList.length; i++) {
            $scope.brandList[i].isActive = false;
          }
        }
      }
      if ($scope.brandList[0].isActive) {
        $scope.filterParameterArr[1] = 'all';
      } else {
        var str = '';
        for (var i = 1; i < $scope.brandList.length; i++) {
          if ($scope.brandList[i].isActive) {
            str += $scope.brandList[i].id + ';'
          }
        }
        str = str.substring(0, str.length - 1);
        $scope.filterParameterArr[1] = str;
      }
    };
    //选择除品牌价格外的条件
    //$scope.chooseOtherItem = function (outIndex,index, len) {
    //  for (var i = 0; i < len; i++) {
    //    $scope.isCurrent[outIndex][i] = (i === index);
    //  }
    //  $scope.filterOtherPatam[outIndex] = $scope.otherList[outIndex].lstAttributeOptions[index].id;
    //  $scope.otherName[outIndex] = $scope.otherList[outIndex].lstAttributeOptions[index].optionValue;
    //};
    //点击筛选 -支持多选；
    $scope.filterEnsure = function () {
      //解决 最小值和最大值输入负数问题
      if ($scope.filterPrice.min < 0 || $scope.filterPrice.max < 0) {
        PopupService.showToast('价格不能为负数');
        return;
      } else if (isNaN($scope.filterPrice.min) || isNaN($scope.filterPrice.max)) {
        PopupService.showToast('价格为数字');
        return;
      }
      if ($scope.filterPrice.min == null && $scope.filterPrice.max == null) {
        $scope.filterParameterArr[2] = '0';
      } else if ($scope.filterPrice.min == null && $scope.filterPrice.max != '') {
        $scope.filterParameterArr[2] = 'Undefined' + ';' + $scope.filterPrice.max;
      } else if ($scope.filterPrice.min == null && $scope.filterPrice.max == '0') {
        $scope.filterParameterArr[2] = 'Undefined' + ';' + $scope.filterPrice.max;
      } else if ($scope.filterPrice.min != '' && $scope.filterPrice.max == null) {
        $scope.filterParameterArr[2] = $scope.filterPrice.min + ';' + 'Undefined';
      } else if ($scope.filterPrice.min == '0' && $scope.filterPrice.max == null) {
        $scope.filterParameterArr[2] = $scope.filterPrice.min + ';' + 'Undefined';
      } else if ($scope.filterPrice.min > $scope.filterPrice.max) {
        PopupService.showToast('最低价不能高于最高价');
        return;
      } else {
        $scope.filterParameterArr[2] = $scope.filterPrice.min + ';' + $scope.filterPrice.max;
      };
      $scope.filterParams = $scope.filterParameterArr.join("@");
      //
      restParams();
      // var firstParams = firstParamsArr.join("@");
      // var secondParams = secondParamsArr.join(';');
      // filterData = firstParams + '@' + secondParams;
      loadProducts(memberId, provinceId, cityId, districtId, streetId, provinceName, cityName, $scope.address, pageIndex,
        pageSize, productCateId, $scope.filterParams, fromType, flag, false, qs);
      $scope.filterModal.hide();

    };

    //筛选条件重置方法
    $scope.resetFilter = function () {
      for (var i = 0; i < $scope.brandList.length; i++) {
        if (i == 0) {
          $scope.brandList[i].isActive = true;
        } else {
          $scope.brandList[i].isActive = false;
        }
      }
      $scope.brand = true;
      $scope.brandName = '全部';
      $scope.isBrand = [true, false, false, false, false, false, false, false, false];
      //$scope.otherName = ['全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部','全部', '全部'];//其他筛选条件选中项，默认：全部
      $scope.filterParameterArr = ['all', 'all', '0'];
      $scope.filterPrice = {
        min: null,
        max: null
      };
      //$scope.otherState = [false, false];
      // var len = $scope.otherList.length;
      // for (var i = 0; i < len; i++) {
      //   $scope.filterOtherPatam[i] = 0;
      //   $scope.isCurrent[i] = [true,false];
      // }
      $ionicScrollDelegate.resize();
    };

    //库存状态筛选方法
    // $scope.chooseStockState = function (param) {
    //   firstParamsArr[0] = param;
    //   $scope.stockState = !$scope.stockState;
    //   if (param == 'all') {
    //     $scope.stockName = '显示全部货';
    //   } else if (param == 'hasStock') {
    //     $scope.stockName = '仅看有货'
    //   }
    // };
    //品牌筛选方法
    // $scope.brandFilter = function (index) {
    //   firstParamsArr[1] = $scope.brandList[index].id != 0 ? $scope.brandList[index].id : 'all';
    //   $scope.brandName = $scope.brandList[index].brandName;
    //   for (var i = 0, len = $scope.brandList.length; i < len; i++) {
    //     $scope.brandSelected[i] = (i === index);
    //   }
    // };
    //价格筛选方法
    // $scope.priceFilter = function (index) {
    //   firstParamsArr[2] = index;
    //   switch (index) {
    //     case 0:
    //       $scope.priceName = '全部';
    //       break;
    //     case 1:
    //       $scope.priceName = '0～1000';
    //       break;
    //     case 2:
    //       $scope.priceName = '1001～2000';
    //       break;
    //     case 3:
    //       $scope.priceName = '2001～3000';
    //       break;
    //     case 4:
    //       $scope.priceName = '3001～4000';
    //       break;
    //     case 5:
    //       $scope.priceName = '4001～5000';
    //       break;
    //     case 6:
    //       $scope.priceName = '5000以上';
    //       break;
    //   }
    //   for (var i = 0; i < 7; i++) {
    //     $scope.priceSelected[i] = (i === index);
    //   }
    // };
    //其他条件筛选方法
    // $scope.chooseOtherItem = function (index, len) {
    //   for (var i = 0; i < len; i++) {
    //     $scope.isCurrent[i] = (i === index);
    //   }
    //   secondParamsArr[paramIndex] = $scope.otherList[paramIndex].lstAttributeOptions[index].id;
    //   $scope.otherName[paramIndex] = $scope.otherList[paramIndex].lstAttributeOptions[index].optionValue;
    // };


    //筛选完成方法
    // $scope.filterDone = function () {
    //   restParams();
    //   var firstParams = firstParamsArr.join("@");
    //   var secondParams = secondParamsArr.join(';');
    //   filterData = firstParams + '@' + secondParams;
    //   loadProducts(memberId, provinceId, cityId, districtId, streetId, provinceName, cityName, $scope.address, pageIndex,
    //     pageSize, productCateId, filterData, fromType, flag, false, qs);
    //   $scope.filterModal.hide();
    // };

    //切换筛选条件（前三个）
    // $scope.changeFilterOption = function (index) {
    //   for (var i = 0, len = $scope.filterCategory.length; i < len; i++) {
    //     $scope.filterCategory[i] = (i == index);
    //   }
    //   for (var k = 0, length = $scope.otherList.length; k < length; k++) {
    //     $scope.otherState[k] = false;
    //   }
    // };
    //切换其他筛选条件
    // $scope.changeOther = function (index) {
    //   $scope.filterCategory = [false, false, false];
    //   paramIndex = index;
    //   $scope.otherName[index] = '全部';
    //   for (var i = 0, len = $scope.otherList.length; i < len; i++) {
    //     $scope.otherState[i] = (i === index);
    //   }
    //   $scope.isCurrent = [true, false];
    // };

    //分类开关点击方法
    $scope.category = function () {
      $ionicSideMenuDelegate.$getByHandle('store_menu').toggleRight();
    };

    //切换商品分类
    $scope.changeCategory = function (index, id) {
      pageIndex = 1;
      $scope.productsList = [];
      $scope.contentDataListxyz = [];
      productCateId = id;
      loadProducts(memberId, provinceId, cityId, districtId, streetId, provinceName, cityName,
        $scope.address, pageIndex, pageSize, productCateId, filterData, fromType, flag, false, qs);
      for (var i = 0, len = $scope.categorySelected.length; i < len; i++) {
        $scope.categorySelected[i] = (i === index);
      }
      $ionicSideMenuDelegate.$getByHandle('store_menu').toggleRight();
    };

    //点击轮播图执行方法
    $scope.slideImageClick = function (index) {
      if ($scope.slideImage[index].type == '1') {
        if ($scope.slideImage[index].activityType == '主题活动') {
          $state.go('bannerTheme', {bannerId: $scope.slideImage[index].bannerId,shareStoreId: $stateParams.shareStoreId,platformType:$scope.slideImage[index].platformType});
        } else if ($scope.slideImage[index].activityType == '日常活动') {
          BannerThemeService.getBannerTheme($scope.slideImage[index].bannerId,$scope.slideImage[index].platformType)
            .success(function (response) {
              $state.go('bannerDaily', {bannerId: $scope.slideImage[index].bannerId, shareStoreId: $stateParams.shareStoreId,layout: response.data.layout,platformType:$scope.slideImage[index].platformType});
            });
        } else {
          console.log('进入活动页失败！');
        }
      }else if($scope.slideImage[index].type == '6'){//众筹的入口
        $state.go('crowdFunding');
      } else {
        console.log('type=0，不受控制的活动！');
      }
    };

    //二维码展示modal
    $ionicModal.fromTemplateUrl('my-qrcode-modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
      backdropClickToClose: true
    }).then(function (modal) {
      $scope.qrCodemodal = modal;
    });
    //筛选modal
    $ionicModal.fromTemplateUrl('templates/product/SearchFilterModal.html', {
      scope: $scope,
      animation: 'slide-in-left',
      backdropClickToClose: false
    }).then(function (modal) {
      $scope.filterModal = modal;
    });
    // //原来筛选modal
    // $ionicModal.fromTemplateUrl('templates/shop/FilterShop.html', {
    //   scope: $scope,
    //   animation: 'slide-in-left',
    //   backdropClickToClose: false
    // }).then(function (modal) {
    //   $scope.filterModal = modal;
    // });

    $scope.openQrcode = function () {
      if (!UserService.getUser().mid) {
          $state.go('login');
          return;
        }
      //$scope.moreShow = false;
      $scope.qrCodemodal.show();
    };
    $scope.backToStore = function () {
      $scope.filterModal.hide();
    };
    $scope.closeModal = function () {
      $scope.qrCodemodal.hide();
      $scope.filterModal.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.qrCodemodal.remove();
      $scope.filterModal.remove();
    });

    //保存二维码
    $scope.saveQrCode = function () {
      var imageName = 'myQRCode.jpg';//二维码名称
      var targetURL = '';
      if (ionic.Platform.isAndroid()) {
        targetURL = cordova.file.externalRootDirectory + 'DCIM/Camera/' + imageName;//保存路径
      } else {
        targetURL = cordova.file.documentsDirectory + imageName;//保存路径
      }
      var url = encodeURI($scope.myStoreInfo.qrcode);
      var trustHosts = true;//信任证书
      var options = {
        //headers: {
        //  "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
        //}
      };
      var fileTransfer = new FileTransfer();
      fileTransfer.download(
        url,
        targetURL,
        function (entry) {
          if (ionic.Platform.isAndroid()) {
            var path = entry.toURL();
            PopupService.showAlert('', '图片已经保存至' + path);
          } else {
            PopupService.showToast('保存成功');
          }
          //alert("download complete: " + entry.toURL());
        },
        function (error) {
          PopupService.showToast('保存失败！');
        },
        trustHosts,
        options
      );
    };

    $scope.share = function () {
      if (!UserService.getUser().mid) {

          $state.go('login');
          return;
        }
      /*********************分享标签－whiteBird start*********************/
      if (window.device && window.device.hasNewShare) {

        //新分享样式
        $scope.showShare = !$scope.showShare;
        /*********************分享标签－whiteBird end*********************/
      } else {
        //旧分享样式
        var title = $scope.myStoreInfo.storeName; //分享标题
        var content = '我的顺逛店铺，精选好货，快来逛逛吧~';  //分享内容  darcywang
        var pic = $scope.avatarImage;//分享图片，写绝对路径
        var url = UrlService.getShareLinkHeader() + 'myStore/' + $scope.storeId + '/' + $scope.storeId + '/' + '?fs';
        if (window.umeng) {
          window.umeng.share(title, content, pic, url, 0);
        } else {
          alert('只能在app分享,请下载app！');
        }
      }

    };

    /*********************分享标签－whiteBird start*********************/
      //复制
    $scope.copeText = function (text) {
      if (window.cordova) {
        cordova.plugins.clipboard.copy(text);
        PopupService.showToastShort('复制成功');
      }
      else {
        PopupService.showToast('请下载APP执行此操作');
      }
    };
    $scope.hideblackCover = function () {
      $scope.showShare = false;
    };
    $scope.shareToPlatform = function (index) {
      var title = $scope.myStoreInfo.storeName; //分享标题
      var content = '在顺逛上有一个挺不错的店铺，伙伴们快来看看，好东西不容错过~';  //分享内容
      var pic = $scope.avatarImage;//分享图片，写绝对路径
      var url = UrlService.getShareLinkHeader() + 'myStore/' + $scope.storeId + '/' + $scope.userId + '/' + '?fs';

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
        } else if (index == 5) {
          $scope.copeText(url);
        }
        CreditService.successShare();
      } else {
        alert('umeng undefined 只能在app分享');
      }

      $scope.showShare = false;
    };
    /*********************分享标签－whiteBird end*********************/
    $scope.goMessageCenter = function () {
      $state.go('messageCenter');
    };
    //右下角选项按钮
    $scope.isButtonShow = function () {
      $scope.buttonShow = !$scope.buttonShow;
    };

    $scope.goBuyerCenter = function () {
      if ($scope.shareStoreId) {
        $state.go('buyerCenter', {shareStoreId: $scope.shareStoreId});
      } else {
        $state.go('buyerCenter');
      }
    };
    $scope.toProductDetail = function (productId,o2oType,fromType,storeId,shareStoreId,firstName,secondName,hasStock) {
      if(window.cordova){
        $rootScope.gio.track('prodClickInStore',	{
          productId:	productId,		//	商品	SKU	ID
          o2oType:	o2oType,
          productFirstName:	firstName,
          productSecondName:	secondName,
          storeId:	storeId,
          storeName:	$scope.storeTitleName,
          hasStock:	hasStock
        });
      }
      $state.go('productDetail',{
        productId:productId,
        o2oType:o2oType,
        fromType:fromType,
        storeId:storeId,
        shareStoreId:shareStoreId
      })
    };
//页面返回
    $scope.goBack = function () {
      if ($ionicHistory.backView()) {
        $scope.$ionicGoBack();
      } else {

      }
    };

     //地址窗口
    $scope.addressTop = function(){
      $scope.addressTipFlag=false;
      $scope.provinceTop=0;
      $scope.nowLevel=0;
      $scope.nowLevelIndex=[-1,-1,-1,-1];
      $scope.provinceDis=false;
      $scope.cityDis=false;
      $scope.areaDis=false;
      $scope.addressModal.show();
      $scope.dataAdd=null;
      $scope.defaultValue=null;
      $scope.selectProvince='';
      $scope.selectCity='';
      $scope.selectArea='';
      $scope.addressInit($scope.dataAdd,$scope.defaultValue,'STORE_LOCATION',0);
    };
    //地址初始化
    $scope.addressInit = function (defaultValue,data,flag,level) {
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
        $scope.nowLevel=$scope.level;
        $scope.nowLevel=$scope.nowLevel*(-1);
       for(var i=0;i<$scope.nowLevelIndex.length;i++){
        if(i>$scope.nowLevel){
          $scope.nowLevelIndex[i]=-1;
        }
      }
      } else {
        $scope.finish=false;
        $scope.addressTip='正在获取地址信息...';
        $scope.addressTipFlag=true;
        $scope.dataAdd="";
        //第一次取全国的省直辖市信息
        GoodsService.getLocationList('',0).success(function (response) {
           $scope.dataAdd = response.data;
           $scope.addressTipFlag=false;
           $scope.finish=true;
           $scope.nowLevel=$scope.level;
           $scope.nowLevel=$scope.nowLevel*(-1);
           var defaultValueFy=JSON.stringify($scope.defaultValue);
           var dataAddFy=JSON.stringify($scope.dataAdd);
//         $scope.addressInit(defaultValueFy,dataAddFy,$scope.flag,$scope.level)
           console.log($scope.nowLevel);
	       for(var i=0;i<$scope.nowLevelIndex.length;i++){
	        if(i>$scope.nowLevel){
	          $scope.nowLevelIndex[i]=-1;
	        }
	       }
         })
        .error(function (err) {
          PopupService.showToast('获取地址信息失败！');
        })
      }
    };
    //重新选择的下边框
    $scope.bottomBorder = {
      'border-bottom':"1px solid red"
    };
    $scope.provinceFlag=false;
    $scope.cityFlag=false;
    $scope.areaFlag=false;
    $scope.selectFlag=true;
    $scope.provinceDis=false;
    $scope.cityDis=false;
    $scope.areaDis=false;
    //返回重新选择省
    $scope.provinceSel = function(){
      $scope.addressInit(null,null,'STORE_LOCATION',0);
      $scope.selectCity='';
      $scope.selectArea='';
      $scope.provinceFlag=true;
      $scope.selectFlag=false;
      $scope.provinceDis=true;
      $scope.cityDis=false;
      $scope.areaDis=false;
    };
    //地址
    var isGoing = false;
    $scope.goSelect = ionic.Utils.debounce(function (index,item) {
      for(var i=0;i<$scope.nowLevelIndex.length;i++){
	    if(i>$scope.nowLevel){
	      $scope.nowLevelIndex[i]=-1;
	    }
     }
     $scope.dataAdd="";
      $scope.nowLevelIndex[$scope.nowLevel]=index;
      var item = arguments[1];
      var index = arguments[0];
      $scope.level = $scope.level - 1;//-1,下一个 为 －2 ，
      $scope.defaultValue['text' + $scope.level] = item.text;
      $scope.defaultValue['value' + $scope.level] = item.value;
      if ($scope.level > -2) {//xyz修改2级本地获取
        console.log($scope.level);
        if($scope.level == -1){//省
           $scope.selectProvince = item.text;
           $scope.provinceIndex=index;
           $scope.provinceFlag=false;
           $scope.selectFlag=true;
           $scope.provinceDis=true;
           $scope.provinceTop=$ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
           $scope.nowLevel=$scope.level;
           $scope.nowLevel=$scope.nowLevel*(-1);
           console.log($scope.nowLevel);
        }else{
//          $scope.dataAdd = $scope.dataAdd[index].children;
        }
        ah = $scope.level*-1;
        $scope.addressTip='正在获取地址信息...';
        $scope.addressTipFlag=true;
        GoodsService.getLocationList(item.value,ah).success(function (response) {
          if(ah==1){
            areaValueCity=item.value;
          }
          $scope.dataAdd = response.data;
          $scope.addressTipFlag=false;
          var defaultValueFy=JSON.stringify($scope.defaultValue);
          var dataAddFy=JSON.stringify($scope.dataAdd);
          $scope.addressInit(defaultValueFy,dataAddFy,$scope.flag,$scope.level);
        }).error(function (err) {
          PopupService.showToast('获取地址信息失败！');
        });
        $scope.levelArea=$scope.level;
        $scope.levelArea=$scope.levelArea+1;
        //重选市
        $scope.citySel = function(){
          $scope.addressTip='正在获取地址信息...';
          $scope.addressTipFlag=true;
          $scope.dataAdd="";
		      $scope.level= $scope.levelArea;
      	  GoodsService.getLocationList(areaValueCity,1).success(function (response) {
            $scope.dataAdd = response.data;
            $scope.addressTipFlag=false;
            var defaultValueFy=JSON.stringify($scope.defaultValue);
            var dataAddFy=JSON.stringify($scope.dataAdd);

            $scope.addressInit(defaultValueFy,dataAddFy,$scope.flag,-1);
              $scope.selectArea='';
              $scope.cityFlag=true;
              $scope.selectFlag=false;
              $scope.provinceDis=true;
              $scope.cityDis=true;
              $scope.areaDis=false;
              $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0,$scope.cityTop);
          }).error(function (err) {
            PopupService.showToast('获取地址信息失败！');
          });
        }
      }else if ($scope.level > -4) {//xyz添加远端获取
        $scope.selectCity = $scope.defaultValue['text-2'];
        $scope.provinceFlag=false;
        $scope.cityFlag=false;
        $scope.selectFlag=true;
        $scope.provinceDis=true;
        $scope.cityDis=true;
        $scope.areaDis=false;
        if($scope.level == -3){
          $scope.selectArea= item.text;
          $scope.cityFlag=false;
          $scope.areaFlag=false;
          $scope.selectFlag=true;
          $scope.provinceDis=true;
          $scope.cityDis=true;
          $scope.areaDis=true;
          $scope.areaTop=$ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
        }else{
          $scope.cityTop=$ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
        }
        ah = $scope.level*-1;
        $scope.addressTip='正在获取地址信息...';
        $scope.addressTipFlag=true;
        MyStoreService.getLocationList(item.value,ah).success(function (response) {
          $scope.dataAdd = response.data;
          $scope.addressTipFlag=false;
          if(ah==2){
          areaValue=item.value;
        }
          var defaultValueFy=JSON.stringify($scope.defaultValue);
          var dataAddFy=JSON.stringify($scope.dataAdd);

          $scope.addressInit(defaultValueFy,dataAddFy,$scope.flag,$scope.level);
        }).error(function (err) {
          PopupService.showToast('获取地址信息失败！');
        });
        $scope.levelArea=$scope.level;
        $scope.levelArea=$scope.levelArea+1;
        //重选区
         $scope.areaSel = function(){
            $scope.level=$scope.levelArea;
            $scope.addressTip='正在获取地址信息...';
            $scope.addressTipFlag=true;
            $scope.dataAdd="";
            MyStoreService.getLocationList(areaValue,2).success(function (response) {
            $scope.dataAdd = response.data;
            $scope.addressTipFlag=false;
            console.log($scope.dataAdd);
            var defaultValueFy=JSON.stringify($scope.defaultValue);
            var dataAddFy=JSON.stringify($scope.dataAdd);

            $scope.addressInit(defaultValueFy,dataAddFy,$scope.flag,$scope.level);
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0,$scope.areaTop);
            $scope.areaFlag=true;
            $scope.selectFlag=false;
            $scope.provinceDis=true;
          $scope.cityDis=true;
          $scope.areaDis=true;
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
        $scope.closeAddressModal();
      }
    }, 300);

    //自动定位
    $scope.getPosition = function () {
      if ($rootScope.globalConstant.autoPosition == '定位中···') {
        return;
      }
      addressMessage = CommonAddressService.getAddressInfo();
      var detailAddress = addressMessage.regionName + '/' + addressMessage.streetName;
      MyStoreService.addAddress(addressMessage.provinceId, addressMessage.cityId, addressMessage.areaId, detailAddress, addressMessage.streetId)
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
          $scope.closeAddressModal();
        })
    };
    //窗口modal
    $ionicModal.fromTemplateUrl('templates/common/CommonLocation.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.addressModal = modal;
    });
    $scope.closeAddressModal = function () {
      $scope.addressModal.hide();
    };
    //获取地址
    $rootScope.$on('STORE_LOCATION', function (event, data) {
      $scope.address = data['text-3'];
      provinceId = data['value-1'];
      cityId = data['value-2'];
      districtId = data['value-3'];
      provinceName = data['text-1'];
      streetId = data['value-4'];
      cityName = data['text-2'];
      var detailAddress =  data['text-3']+'/' + data['text-4'];
      GoodsService.addAddress(provinceId, cityId, districtId, detailAddress, streetId)
        .success(function (response, status, headers, config) {
          $scope.init();
        });
    });

    function getCurrentPosition() {//获取定位地址
      var addressMessage = CommonAddressService.getAddressInfo();
      if (addressMessage) {
        provinceId = addressMessage.provinceId;
        cityId = addressMessage.cityId;
        districtId = addressMessage.areaId;
        streetId = addressMessage.streetId;
        $scope.address = addressMessage.regionName;
      } else {
        provinceId = 16;
        cityId = 17;
        districtId = 2450;
        streetId = 12036596;
        $scope.address = '崂山区';
      }
    }

    $rootScope.$on('CACHE_SUCCESS', function (event, data) {
      $ionicLoading.show({template: '定位地址切换中···'});
      provinceId = data.provinceId;
      cityId = data.cityId;
      districtId = data.areaId;
      streetId = data.streetId;
      provinceName = data.provinceName;
      cityName = data.cityName;
      $scope.address = data.regionName;
      pageIndex = 1;
      $scope.productsList = [];
      $scope.contentDataListxyz = [];
      $scope.hasMoreData = false;
      loadProducts(memberId, provinceId, cityId, districtId, streetId, provinceName, cityName, $scope.address, pageIndex, pageSize, productCateId, filterData, fromType, flag, true);
    });
    $scope.$on('$ionicView.beforeLeave', function (e, v) {
      $scope.watch();
    });
    $scope.$on('$ionicView.beforeEnter', function (e, v) {
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
	//更新轮播
      $timeout(function(){
        $ionicSlideBoxDelegate.loop(true);
        $ionicSlideBoxDelegate.start();
        $ionicSlideBoxDelegate.update();
      },200);
      if(v.direction=='back'){
        HomePageService.getUnReadMsg()
        .success(function (res) {
          if (res.data > 0) {
            $scope.flagNum = true;
          } else {
            $scope.flagNum = false;
          }
        })
        return;
      }
      $scope.isBuyer = LoginService.getRole();//判断用户角色信息；0为买家；1为卖家
      $scope.userId = UserService.getUser().mid;
      token = $stateParams.token;
      if(token){
        MyStoreService.login(token).success(function (res) {
          if (!res.success||res.data.mid==null) {
            $state.go('login');
            return;
          }
          UserService.setUser(res.data);
          if(res.data.sessionValue){
            $localstorage.set('sg_login_token_secret','Bearer'+res.data.sessionValue);//把token存到本地
          }else{
            $localstorage.set('sg_login_token_secret','Bearer'+ GetStatisticInfoService.generateUUID());
          }
        });
      }
        $scope.buttonShow = false;
        // if ($stateParams.shareStoreId) {
        //   memberId = $stateParams.shareStoreId;
        // } else {
        //   memberId = UserService.getUser().mid;
        // }
        memberId = $stateParams.storeId;
        $scope.storeId = $stateParams.storeId;
        $scope.shareStoreId = $stateParams.shareStoreId;
        $ionicScrollDelegate.scrollTop();
        $scope.init();
        //地址
        $scope.addressInit($scope.dataAdd,$scope.defaultValue,'STORE_LOCATION',0);
        $scope.$on('$destroy', function () {
          $scope.addressModal.remove();
        });
    })
  }])
;


/**
 * creator:feng.jiang@dhc.com.cn
 * create time:16/4/1
 * describe：我的店铺服务
 **/
APP.service('MyStoreService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getActivityProductsList = function (storeId, isWdHost, productCateId, provinceId, cityId, districtId, sortColumn) {
    var params = {
      storeId: storeId,
      isWdHost: isWdHost,
      productCateId: productCateId,
      provinceId: provinceId,
      cityId: cityId,
      districtId: districtId,
      sortColumn: sortColumn
    };
    return $http.get(UrlService.getUrl('ACTIVITY_PRODUCTS_LIST'), params);
  };
  this.getCommonProductsList = function (storeId, isHost, productCateId, provinceId, cityId, districtId, pageIndex, sortColumn) {
    var params = {
      storeId: storeId,
      isHost: isHost,
      productCateId: productCateId,
      provinceId: provinceId,
      cityId: cityId,
      districtId: districtId,
      pageIndex: pageIndex,
      sortColumn: sortColumn,
      noLoading: true
    };
    return $http.get(UrlService.getUrl('PRODUCTS_LIST'), params);
  };
  this.getPositionFromCookie = function () {
    var params = {};
    return $http.get(UrlService.getUrl('GET_POSITION_FROM_COOLIE'), params);
  };
  this.getProductsList = function (memberId, provinceId, cityId, districtId, streetId, provinceName, cityName, districtName, pageIndex, pageSize, productCateId, filterData, fromType, flag, noLoading, qs) {
    var params = {
      memberId: memberId,
      provinceId: provinceId,
      cityId: cityId,
      districtId: districtId,
      streetId: streetId,
      provinceName: provinceName,
      cityName: cityName,
      districtName: districtName,
      pageIndex: pageIndex,
      pageSize: pageSize,
      productCateId: productCateId,
      filterData: filterData,
      fromType: fromType,
      flag: flag,
      noLoading: noLoading,
      qs: qs
    };
    return $http.get(UrlService.getUrl('COMMONLOADITEMNEW'), params);
  };
  this.getMyStoreInfo = function (COOKIE_DOMAIN, DOMAIN_URL, POM_STATIC_DOMAIN_NAME, link, storeId) {
    var params = {
      COOKIE_DOMAIN: COOKIE_DOMAIN,
      DOMAIN_URL: DOMAIN_URL,
      POM_STATIC_DOMAIN_NAME: POM_STATIC_DOMAIN_NAME,
      link: link,
      storeId: storeId,
      fromType: 2
    };
    return $http.get(UrlService.getUrl('MY_STORE'), params);
  };
  this.getStoreInfo = function (storeId,shareStoreId) {
    if(shareStoreId){
      var params = {
        storeId:storeId,
        shareStoreId:shareStoreId
      };
    }else{
      var params = {
        storeId:storeId
      };
    }
    return $http.get(UrlService.getUrl('MY_STORE_NEW'), params);
  };
  //获取分类分级的店铺等级
  this.getMyStoreInfoNew = function(storeId){
    var params = {
      memberId:storeId
    };
    return $http.get(UrlService.getUrl('SHUNGUANG_VIP'),params);
  };
  this.getFilterList = function (productCateId) {
    var params = {
      productCateId: productCateId
    };
    return $http.get(UrlService.getUrl('GET_FILTER_DATA'), params);
  };
  this.login = function(token){
    var params = {
      token:token
    };
    return $http({
      method:'POST',
      url:UrlService.getUrl('OTHER_LOGIN'),
      params: params,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
  };
  //地址
  this.getLocationList = function (parentId,regionType) {
    var params = {
      parentId: parentId,
      regionType:regionType
    };
    return $http.get(UrlService.getUrl('GET_REGION_BY_ID_TYPE'), params);
  };
  //添加地址信息
  this.addAddress = function (provinceId, cityId, areaId, regionName, streetId) {
    var params = {
      'provinceId': provinceId,
      'cityId': cityId,
      'areaId': areaId,
      'regionName': regionName,
      'streetId': streetId,
      'noLoading': true
    };
    return $http.get(UrlService.getUrl('ADDADDRESSSELECTION_INIT'), params);
  };
}]);
