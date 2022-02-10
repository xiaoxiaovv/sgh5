APP.controller('GoodsSearchController', ['$ionicHistory','$scope', 'GoodsSearchService', '$ionicPopup', '$timeout',
  '$ionicActionSheet', 'UserService', 'MyStoreService', 'CommonAddressService', '$stateParams', '$localstorage', '$rootScope',
  'PopupService', 'LoginService','$ionicScrollDelegate','$ionicModal','GoodsService','HomePageService','$state','UrlService',
  function ($ionicHistory,$scope, GoodsSearchService, $ionicPopup, $timeout, $ionicActionSheet, UserService, MyStoreService,
            CommonAddressService, $stateParams, $localstorage, $rootScope, PopupService, LoginService,$ionicScrollDelegate,$ionicModal,GoodsService,HomePageService,$state,UrlService) {
    //xyz定义
    var Focus = document.querySelector('#focus');
    $scope.history = [];
    $scope.hShow = true;
    $scope.hShowB = true;
    var bv = "";
    var bvv = "aicxyz";
    var jl = localStorage.getItem("historys");
    //热门词数据定义
    $scope.hotWords = '';
    $scope.lianXiWords = '';
    $scope.hotWordShow = true;
    $scope.lianXC = false;
    // daba STARTA
    $scope.comprehensive = ['img/comprehensive_black.png', 'img/comprehensive_white.png']; //综合 箭头数组
    $scope.comprehensive_index = 0; //综合箭头数组下标
    $scope.arrowState = ['img/arrow_state_0.png', 'img/arrow_state_1.png', 'img/arrow_state_2.png']; //佣金和价格 箭头数组
    $scope.commission_index = 0; //佣金 箭头数组 下标
    $scope.price_index = 0; //价格 箭头数组 下标
    $scope.filterState = ['img/filter_state_0.png', 'img/filter_state_1.png']; //筛选 图片数组
    $scope.filter_index = 0; //筛选数组下标
    var tabState = ['isHotDesc', ['commissionDesc', 'commission'], '', 'saleDesc', ['priceDesc', 'price']]; //筛选 接口需要传递的参数 数组
    $scope.comprehensiveSub = ['人气优先']; //综合 子选项数组
    $scope.selectComprehensiveSubIndex = 0; //综合 子选项数组 默认下标
    $scope.switch = true; //筛选接口查询开关，防止多次请求筛选；
    //daba END
    //变量定义
    $scope.productIds='';
    $scope.isShowUp = false;
    $scope.isIos = false;
    $scope.screenWidth = window.screen.width;
    $scope.front = $stateParams.front;//0:从店铺预览页跳转，  1：从选品页跳转
    $scope.shareStoreId = $stateParams.shareStoreId;
    $scope.isBuyer = LoginService.getRole();//判断用户角色信息；0为买家；1为卖家
    $scope.userId = UserService.getUser().mid;//用户Id
    var memberId = '';//用户Id
    var searchType = '0';
    var provinceId = 16,   //省分Id  山东
      cityId = 173,     //市Id   青岛
      districtId = 2450, //区Id   崂山
      streetId = 12036596;//街道Id  中韩街道
    $scope.gsPlaceholder = '请搜索名字、型号等关键字';
    $scope.storeId = $localstorage.get('storeId', $rootScope.globalConstant.storeId);//获取店铺Id，传递到详情页
    /******************筛选功能相关变量定义start****************/
    $scope.iSPrice = true; //价格展开标志
    $scope.brand = true; //品牌展开标志
    $scope.brandName = '全部'; //品牌选中项，默认：全部
    $scope.brandList = []; //筛选品牌列表
    //$scope.otherList = [];  //其他筛选列表
    $scope.filterParameterArr = ['all', 'all', '0'];//筛选参数数组
    //$scope.filterOtherPatam = [];//筛选条件中其他参数暂存数组
    //$scope.isCurrent = [[true], [true]];     //其他条件是否选中标识
    $scope.StockStateArr = ['all', 'hasStock'];//库存状态数组
    $scope.filterPrice = {
      min: null, //筛选最低价格
      max: null //筛选最高价格
    };
    $scope.filterParams = ''; //请求接口筛选条件参数
    $scope.qs = ''; //请求接口排序方式参数
    /******************筛选功能相关变量定义end****************/
    var u = navigator.userAgent;

    $scope.goBack = ionic.Utils.debounce(function () {
      $ionicHistory.goBack();
    },300);

    $scope.settingsList='';//是否显示佣金本地存储
    //判断本地是否显示佣金;
   function GetSwitchChecked() {
        $scope.memberId = UserService.getUser().mid;
        var setSwitch = JSON.parse(localStorage.getItem('setSwitch'));
        var isExist = false;
        for (var i = setSwitch.length - 1; i >= 0; i--) {
            if (setSwitch[i].id == $scope.memberId) {
                $scope.settingsList = setSwitch[i].list;
                isExist = true;

            }
        }
    }

    if (u.indexOf('iPhone') != -1) {
      $scope.isIos = true;
    } else {
      $scope.isIos = false;
    }

    if ($scope.screenWidth < 375) {
      $scope.searchInputStyle = {
        position: 'absolute',
        top: '7px',
        right: '55px',
        width: '48%'
      };
    } else if ($scope.screenWidth < 414) {
      $scope.searchInputStyle = {
        position: 'absolute',
        top: '7px',
        right: '55px',
        width: '55%'
      };
    } else {
      $scope.searchInputStyle = {
        position: 'absolute',
        top: '7px',
        right: '55px',
        width: '58%'
      };
    }


    $scope.searchTopRight = {
      position: 'absolute',
      right: '10px',
      top: '5px'

    };

    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {//只有ios app 特有的样式
      $scope.searchInputStyle = {
        position: 'absolute',
        top: '24px',
        right: '13%',
        width: '58%'

      };
      $scope.searchTopRight = {
        position: 'absolute',
        right: '-1%',
        top: '24px'

      };
    }
    // xyz添加数组去重方法
    function unique(array){
        var n = [];//临时数组
        for(var i = 0;i < array.length; i++){
            if(n.indexOf(array[i]) == -1) n.push(array[i]);
        }
        return n;
    }

    //获取历史记录
    function historyOldUse(){
      jl = localStorage.getItem("historys");
      if(jl){
        var jlArray = jl.split("$$");
        var oldHistorys = unique(jlArray);
        if(oldHistorys.length > 10){
          oldHistorys.length = 10;
          $scope.history = oldHistorys;
        }else{
          $scope.history = oldHistorys;
        }
      }else{
          $scope.hShow = false;
          $scope.hShowB = true;
      }
    }

    $scope.changePadding = function(){
      if(Focus.value.length>0){
        $scope.inputPadding = {
          "padding-right":"30px"
        }
      }else{
        $scope.inputPadding = {
          "padding-right":"0px"
        }
      }
    };
    $scope.clearLocal = function(){
      localStorage.removeItem("historys");
      $scope.hShow = false;
      $scope.hShowB = true;
    };

//联想词添加
    $scope.alWs = function(a){
      if(a){
        $scope.hotWordShow = false;
        $scope.hShowB = false;
        $scope.emptySearch = false;
        $scope.hShow = false;
        $scope.lianXC = true;
        $scope.searchData = null; //商品列表
        $scope.xyzShData = null; //商品列表
        GoodsSearchService.associationalWords(a)
        .success(function(response){
          $scope.lianXiWords = response.data;
        })
      }else{
        $ionicScrollDelegate.scrollTop();
        $scope.searchData = null; //商品列表
        $scope.xyzShData = null; //商品列表
        $scope.hShow = true;
        $scope.hShowB = false;
        historyOldUse();
        $scope.emptySearch = false;
        $scope.hotWordShow = true;
        $scope.lianXC = false;
        //隐藏 排序按钮
        $scope.showTab = false;
      }
    }

    // xyz收起和弹出软键盘
    $scope.$on('$ionicView.enter', function () {
      if (bvv == 'back') {
        $scope.showTab = true;
        Focus.blur();
      } else {
        $scope.comprehensive_index = 1; //综合箭头数组下标
        $scope.commission_index = 0; //佣金 箭头数组 下标
        $scope.price_index = 0; //价格 箭头数组 下标
        $scope.filter_index = 0; //筛选数组下标
        $scope.showComprehensiveSub = false;
        $scope.chooseIndex = 0;
        setTimeout(
          function () {
            try {
              Focus.focus();
            } catch (e) {

            }
          }, 200);
      }
    });
    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      GetSwitchChecked();//获取是否显示佣金的
      //$ionicScrollDelegate.scrollTop();
      $scope.isBuyer = LoginService.getRole();//判断用户角色信息；0为买家；1为卖家
      if(ionic.Platform.platform().indexOf('ios') != -1 && window.cordova){
        $scope.topStyle = {
          "top":"64px"
        };
      }else{
        $scope.topStyle = {
          "top":"44px"
        };
      }
      //筛选 排序 tab显示的开关
      $scope.showTab = false;
      $scope.filterParams = '';
      $scope.lianXC = false;
      //热门词数据的获取
      $scope.hotWordShow = true;
      GoodsSearchService.hotWords()
      .success(function (response) {
        $scope.hotWords = response.data;
        if(!$scope.hotWords){
          $scope.hotWordShow = false;
        }
      });
      GoodsSearchService.defaultSearch()
      .success(function (response) {
          $scope.gsPlaceholder = response.data.hot_word;
      });

      bv = $ionicHistory.viewHistory().backView;
      bvv = v.direction;
      //xyz添加搜索记录
      $scope.emptySearch = false;
      //每次进入搜索页面收起 搜索类型选择
      $scope.isShowUp = false;
      historyOldUse();

      $scope.storeId = $localstorage.get('storeId', $rootScope.globalConstant.storeId);
      $scope.isBuyer = LoginService.getRole();//判断用户角色信息；0为买家；1为卖家
      $scope.userId = UserService.getUser().mid;//用户Id
      if(v.direction=='back'){
        //xyz修改
        $scope.hShow = false;
        $scope.hotWordShow = false;
        $scope.hShowB = false;
      }else{
        var lll = localStorage.getItem("historys");
        if(lll){
          $scope.hShow = true;
          $scope.hShowB = false;
        }else {
          $scope.hShow = false;
          $scope.hShowB = true;
        }
        $scope.tabNav = 'selection'; //tableBar选中选品
        $scope.hasmore = false; //上拉加载时能标志
        $scope.typeChoose = '商品'; //搜索分类初始选项
        searchType='0';//每次进入 设置搜索 类型id 为 商品id 即 0
        $scope.gsPlaceholder='请搜索名字、型号等关键字';
        $scope.searchData = null; //商品列表
        $scope.xyzShData = null; //商品列表
        $scope.page = 2; //上拉加载起始页
        $scope.front = $stateParams.front; //0:从店铺预览页跳转，  1：从选品页跳转
        //获取用户信息
        if ($stateParams.shareStoreId) {
          memberId = $stateParams.shareStoreId;
        } else if(UserService.getUser().mid){
          memberId = UserService.getUser().mid;
        }
        $scope.searchGoodsName = {
          name: ''
        };
      }
    });

    //xyz搜索商品
    $scope.sGoods = function (h) {
      //点击筛选以外的按钮 筛选重置
      // $scope.resetFilter();
      $scope.chooseIndex = 0;
      $scope.comprehensive_index = 1;//综合箭头数组下标
      $scope.filterParams = '';
      $scope.lianXC = false;
      $scope.hShow = false;
      $scope.hotWordShow = false;
      $scope.hShowB = false;
      $scope.searchGoodsName.name = h;
      var oldRecord = localStorage.getItem("historys");
      var newRecord = $scope.searchGoodsName.name;
      if(oldRecord){
        var Record = newRecord + "$$" + oldRecord;
        localStorage.setItem("historys",Record);
      }else{
        localStorage.setItem("historys",newRecord);
      }
      historyOldUse();
      MyStoreService.getPositionFromCookie().
        success(function (response) {
          if (response.success) {
            if (response.data != null && response.data != undefined && response.data.length != 0) {
              var addressInfo = eval(response.data);
              provinceId = addressInfo[0].provinceId;
              cityId = addressInfo[0].cityId;
              districtId = addressInfo[0].areaId;
              streetId = addressInfo[0].streetId;
              searchStart();
            } else {
              var addressMessage = CommonAddressService.getAddressInfo();
              if (addressMessage) {
                provinceId = addressMessage.provinceId;
                cityId = addressMessage.cityId;
                districtId = addressMessage.areaId;
                streetId = addressMessage.streetId;
              } else {
                provinceId = 16;
                cityId = 17;
                districtId = 2450;
                streetId = 12036596;
              }
              searchStart();
            }
          }
        })
        .error(function (err) {
          var addressMessage = CommonAddressService.getAddressInfo();
          if (addressMessage) {
            provinceId = addressMessage.provinceId;
            cityId = addressMessage.cityId;
            districtId = addressMessage.areaId;
            streetId = addressMessage.streetId;
          } else {
            provinceId = 16;
            cityId = 17;
            districtId = 2450;
            streetId = 12036596;
          }
          searchStart();
        });
    };

    //搜索商品
    $scope.searchGoods = function () {
      //点击筛选以外的按钮 筛选重置
      // $scope.resetFilter();
      $scope.searchData = '';
      $scope.xyzShData = '';
      $scope.filterParams = '';
      // $scope.hShow = false;
      // $scope.hotWordShow = false;
      // $scope.hShowB = false;
      $scope.comprehensive_index = 1;//综合箭头数组下标
      $scope.commission_index = 0;//佣金 箭头数组 下标
      $scope.price_index = 0;//价格 箭头数组 下标
      $scope.filter_index = 0;//筛选数组下标
      $scope.chooseIndex = 0;
      $scope.lianXC = false;
      //收起 搜索分类选择项
      $scope.isShowUp = false;
      //如果 预置词 为空，并且用户输入内容也为空
      if ($scope.searchGoodsName.name == ''&&!$scope.gsPlaceholder) {
        PopupService.showToast('请填写搜索内容');
        // $scope.sGoods($scope.gsPlaceholder);
        return;
      }else if($scope.gsPlaceholder&&$scope.searchGoodsName.name == ''){
        $scope.sGoods($scope.gsPlaceholder);
        return;
      } else if ($scope.searchGoodsName.name != '') {
        //xyz添加本地缓存
        oldRecord = localStorage.getItem("historys");
        newRecord = $scope.searchGoodsName.name;
        if(oldRecord){
          Record = newRecord + "$$" + oldRecord;
          localStorage.setItem("historys",Record);
        }else{
          localStorage.setItem("historys",newRecord);
        }
        historyOldUse();
        MyStoreService.getPositionFromCookie().
          success(function (response) {
            if (response.success) {
              if (response.data != null && response.data != undefined && response.data.length != 0) {
                var addressInfo = eval(response.data);
                provinceId = addressInfo[0].provinceId;
                cityId = addressInfo[0].cityId;
                districtId = addressInfo[0].areaId;
                streetId = addressInfo[0].streetId;
                searchStart();
              } else {
                var addressMessage = CommonAddressService.getAddressInfo();
                if (addressMessage) {
                  provinceId = addressMessage.provinceId;
                  cityId = addressMessage.cityId;
                  districtId = addressMessage.areaId;
                  streetId = addressMessage.streetId;
                } else {
                  provinceId = 16;
                  cityId = 17;
                  districtId = 2450;
                  streetId = 12036596;
                }
                searchStart();
              }
            }
          })
          .error(function (err) {
            var addressMessage = CommonAddressService.getAddressInfo();
            if (addressMessage) {
              provinceId = addressMessage.provinceId;
              cityId = addressMessage.cityId;
              districtId = addressMessage.areaId;
              streetId = addressMessage.streetId;
            } else {
              provinceId = 16;
              cityId = 17;
              districtId = 2450;
              streetId = 12036596;
            }
            searchStart();
          });

      }

    };

    // xyz实现
    $scope.todoSomething=function($event){
    if($event.keyCode==13){//回车
        $scope.searchGoods();
        Focus.blur();
        }
    };

    // 社群争霸赛添加跳转
    $scope.babyrace = function() {

      HomePageService.isWdHost()
        .success(function (res) {
          $rootScope.isWdHost = res.data.isHost;
          if (res.data.isHost == -1) {
            $state.go('login');
          } else {
            window.location.href = UrlService.getThirdUrl('race/');
          }
        });
    }

    function searchStartNew() {
      $scope.searchValue = $scope.searchGoodsName.name; //点击搜索时 把搜索内容存下来
      $scope.hShow = false;
      $scope.hotWordShow = false;
      $scope.hShowB = false;
      $scope.emptySearch = false;
      $scope.page = 2;
      $ionicScrollDelegate.scrollTop();
      if ($scope.front == 0) {
        GoodsSearchService.wdCommonSearchNew('1', '5', memberId, $scope.searchGoodsName.name, searchType, provinceId, cityId, districtId, streetId, 2, $scope.filterParams, false, $scope.qs)
          .success(function (response, status, headers, config) {
            if (response.data.productList.length <= 0) {
              $scope.emptySearch = true;
              $scope.hShow = true;
              $scope.hotWordShow = true;
              $scope.hShowB = false;
              $scope.showTab = false;
              $scope.filterParams = '';
            } else {
              $scope.emptySearch = false;
              $scope.searchData = response.data.productList;
              $scope.showTab = true;
              $scope.hasmore = true;
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
          })
      } else if ($scope.front == 1) {
        GoodsSearchService.myStoreSearch('1', '5', memberId, $scope.searchGoodsName.name, searchType, provinceId, cityId, districtId, streetId, 1, $scope.filterParams, false, $scope.qs)
          .success(function (response, status, headers, config) {
            $scope.productIds = response.data.productCateIds?response.data.productCateIds:'';
            console.log($scope.productIds);
            if (response.data.productList.length <= 0) {
              $scope.emptySearch = true;
              $scope.hShow = true;
              $scope.hotWordShow = true;
              $scope.hShowB = false;
              $scope.showTab = false;
              $scope.filterParams = '';
            } else {
              $scope.emptySearch = false;
              $scope.searchData = response.data.productList;
              $scope.showTab = true;
              $scope.hasmore = true;
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
          })
      }

    }

    function searchStart() {
      if (window.cordova) {
        $rootScope.gio.evar.set({
          source: 'Search',
          value: $scope.searchGoodsName.name
        });
      }
      $scope.searchValue = $scope.searchGoodsName.name; //点击搜索时 把搜索内容存下来
      $scope.hShow = false;
      $scope.hotWordShow = false;
      $scope.hShowB = false;
      $scope.emptySearch = false;
      $scope.page = 2;
      $ionicScrollDelegate.scrollTop();
      if ($scope.front == 0) {
        GoodsSearchService.myStoreSearch('1', '5', memberId, $scope.searchGoodsName.name, searchType, provinceId, cityId, districtId, streetId, 2, $scope.filterParams, false, $scope.qs)
          .success(function (response, status, headers, config) {
            $scope.productIds = response.data.productCateIds?response.data.productCateIds:'';
            console.log($scope.productIds);
            if (response.data.productList.length <= 0) {
              $scope.emptySearch = true;
              $scope.hShow = true;
              $scope.hotWordShow = true;
              $scope.hShowB = false;
              $scope.showTab = false;
              $scope.filterParams = '';
            } else {
              $scope.emptySearch = false;
              $scope.searchData = response.data.productList;
              $scope.showTab = true;
              $scope.hasmore = true;
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
          })
      } else if ($scope.front == 1) {
        GoodsSearchService.myStoreSearch('1', '5', memberId, $scope.searchGoodsName.name, searchType, provinceId, cityId, districtId, streetId, 1, $scope.filterParams, false, $scope.qs)
          .success(function (response, status, headers, config) {
            $scope.productIds = response.data.productCateIds?response.data.productCateIds:'';
            console.log($scope.productIds);
            if (response.data.productList.length <= 0) {
              $scope.emptySearch = true;
              $scope.hShow = true;
              $scope.hotWordShow = true;
              $scope.hShowB = false;
              $scope.showTab = false;
              $scope.filterParams = '';
            } else {
              $scope.emptySearch = false;
              $scope.searchData = response.data.productList;
              $scope.showTab = true;
              $scope.hasmore = true;
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
          })
      }
    }

    //改变搜索商品是否添加至购物车状态
    $scope.changeState = function (productId, sta, index) {
      if (sta == 1) {
        GoodsSearchService.changeChooseStateJia(productId, '1')
          .success(function (response, status, headers, config) {
            if (response.success == true) {
              $scope.searchData[index].onShelf = true;
              $scope.showPopup('从店铺上架');
            }
          });
      } else {
        GoodsSearchService.changeChooseStateDui(productId)
          .success(function (response, status, headers, config) {
            if (response.success == true) {
              $scope.searchData[index].onShelf = false;
              $scope.showPopup('从店铺下架');
            }
          });
      }
    };
    //上拉加载
    $scope.loadMore = function () {
      if ($scope.front == 0) {
        GoodsSearchService.myStoreSearch($scope.page, '5', memberId, $scope.searchGoodsName.name, searchType, provinceId, cityId, districtId, streetId, 2, $scope.filterParams, true,$scope.qs)
          .success(function (response, status, headers, config) {
            // (response.data.productList != undefined) && (response.data.productList.length != 0)
            if (response.data.productList.length != 0) {
              $scope.searchData = $scope.searchData?$scope.searchData.concat(response.data?response.data.productList:[]):[]; //yl
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.page += 1;
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
            } else {
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.hasmore = false;
            }
          });
      } else if ($scope.front == 1) {
        GoodsSearchService.myStoreSearch($scope.page, '5', memberId, $scope.searchGoodsName.name, searchType, provinceId, cityId, districtId, streetId, 1, $scope.filterParams, true,$scope.qs)
          .success(function (response, status, headers, config) {
            if (response.data.productList.length != 0) {
              $scope.searchData = $scope.searchData?$scope.searchData.concat(response.data?response.data.productList:[]):[]; //yl
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.page += 1;
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
            } else {
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.hasmore = false;
            }
          });
      }
    };

    $scope.type = {
      "choose": [{
          "text": "商品"
        },
        {
          "text": "店名"
        },
        {
          "text": "店铺码"
        }
      ],
      'typeId': ['0', '1', '2']
    };
    var placeholderList = [
      '请填入名字或型号等关键字',
      '请搜索店铺名称关键字',
      '请搜索店铺码'
    ];
    //更改搜索类型
    $scope.chooseType = function (index) {
      $scope.isShowUp = !$scope.isShowUp;
      if (index || index == 0) {
        $scope.searchGoodsName = {
          name: ''
        };
        $scope.hasmore = false; //上拉加载时能标志
        $scope.searchData = null; //商品列表
        $scope.xyzShData = null; //商品列表
        $scope.page = 2; //上拉加载起始页
        $scope.typeChoose = $scope.type.choose[index].text;
        searchType = $scope.type.typeId[index];
        $scope.gsPlaceholder = placeholderList[index];
      }
    };

    //信息提示封装
    $scope.showPopup = function (message) {
      var myPopup = $ionicPopup.show({
        template: message
      });
      $timeout(function () {
        myPopup.close();
      }, 1000);
    };

    //点击 搜索结果筛选类别
  $scope.chooseTab = function (index) {
      if($scope.chooseIndex == index&&index==3){
        return;
      }
      if (index == 2) {
        $scope.filter_index = 1;//筛选数组下标
        $scope.chooseIndex = index;
        $scope.comprehensive_index = 0;//综合箭头数组下标
        $scope.commission_index = 0;//佣金 箭头数组 下标
        $scope.price_index = 0;//价格 箭头数组 下标
        $scope.filter_index = 1;//筛选数组下标
        $scope.showComprehensiveSub = false;
        $scope.openFilterModal();
      } else {
      	//点击筛选以外的按钮 筛选需要重置
      	// $scope.resetFilter();
        //切换时 先把页面滚动到顶部
        $ionicScrollDelegate.scrollTop();
         $scope.page = 2;
        // $scope.chooseIndex = index;
        //如果是 综合
        if(index == 0){
          $scope.showComprehensiveSub = !$scope.showComprehensiveSub;//综合 子选项的显示开关
          if($scope.showComprehensiveSub){
            if(ionic.Platform.platform().indexOf('ios') != -1 && window.cordova){
              $scope.comprehensiveSubHeight = {
              "height":window.innerHeight-44+"px",
              "top":"108px"
              }
            }else{
              $scope.comprehensiveSubHeight = {
              "height":window.innerHeight-44+"px",
              "top":"88px"
              }
            }
          }else{

            if(ionic.Platform.platform().indexOf('ios') != -1 && window.cordova){
              $scope.comprehensiveSubHeight = {
              "height":"auto",
              "top":"108px"
              }
            }else{
              $scope.comprehensiveSubHeight = {
              "height":"auto",
              "top":"88px"
              }
            }
          }
          // $scope.comprehensive_index = 1;//综合 数组下标变化 0 1 之间变化
          return;
        }else if(index == 1){//如果是 佣金
          $scope.lianXC = false;
          $scope.chooseIndex = index;
          $scope.showComprehensiveSub = false;
          var commission_index = $scope.commission_index == 1 ? 0 : 1; //佣金图片下标 临时变量
          $scope.commission_index = $scope.commission_index == 1 ? 2 : 1; //佣金 箭头数组 下标
          // $scope.filterParams = '' //请求接口的 参数 佣金
          $scope.comprehensive_index = 0; //综合 数组下标变化
          $scope.price_index = 0; //价格 箭头数组 下标
          $scope.filter_index = 0; //筛选数组下标
          $scope.searchData = [];
          $scope.xyzShData = [];
          $scope.qs = tabState[1][commission_index];
        } else if (index == 3) { //如果是 销量
          $scope.lianXC = false;
          $scope.chooseIndex = index;
          $scope.showComprehensiveSub = false;
          // $scope.filterParams = ''; //请求接口的 参数 销量
          $scope.price_index = 0; //价格 箭头数组 下标
          $scope.commission_index = 0; //佣金 箭头数组 下标
          $scope.comprehensive_index = 0; //综合 数组下标变化
          $scope.filter_index = 0; //筛选数组下标
          $scope.searchData = [];
          $scope.xyzShData = [];
          $scope.qs = 'saleDesc'
        } else if (index == 4) { //如果是 价格
          $scope.lianXC = false;
          $scope.chooseIndex = index;
          $scope.showComprehensiveSub = false;
          var price_index = $scope.price_index == 1 ? 0 : 1; //价格下标 临时变量
          $scope.price_index = $scope.price_index == 1 ? 2 : 1; //价格 箭头数组 下标
          // $scope.filterParams = '' //请求接口的 参数 价格
          $scope.filter_index = 0; //筛选数组下标
          $scope.commission_index = 0; //佣金 箭头数组 下标
          $scope.comprehensive_index = 0; //综合 数组下标变化
          $scope.searchData = [];
          $scope.xyzShData = [];
          $scope.qs = tabState[4][price_index];
        }
        GoodsSearchService.myStoreSearch('1', '5', memberId, $scope.searchGoodsName.name, searchType, provinceId, cityId, districtId, streetId, $scope.front == 1 ? 1 : 2, $scope.filterParams, false,$scope.qs)
          .success(function (response, status, headers, config) {
            $scope.productIds = response.data.productCateIds?response.data.productCateIds:'';
            console.log($scope.productIds);
            if (response.data.productList.length <= 0) {
              $scope.emptySearch = true;
              $scope.hShow = true;
              $scope.hotWordShow = true;
              $scope.hShowB = false;
              $scope.showTab = false;
            } else {
              $scope.emptySearch = false;
              $scope.searchData = response.data.productList;
              $scope.showTab = true;
              $scope.hasmore = true;
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
          })
      }
    };
    //关闭综合子选项
    $scope.closeComprehensiveSub = function(){
      $scope.showComprehensiveSub = !$scope.showComprehensiveSub;
    }
    //选择综合 子选项
    $scope.selectComprehensiveSub = function(index,$event){
      $event.stopPropagation();
      if(index == 0){
        $scope.qs = 'isHotDesc';//请求接口的 参数 人气优先
      }
      $scope.lianXC = false;
      $scope.selectComprehensiveSubIndex = index;
      $scope.showComprehensiveSub = !$scope.showComprehensiveSub;
      $scope.chooseIndex = 0;
      $scope.productList = [];
      $scope.comprehensive_index = 1; //综合 数组下标变化 0 1
      $scope.commission_index = 0; //佣金 箭头数组 下标
      $scope.price_index = 0; //价格 箭头数组 下标
      $scope.filter_index = 0; //筛选数组下标
      GoodsSearchService.myStoreSearch('1', '5', memberId, $scope.searchGoodsName.name, searchType, provinceId, cityId, districtId, streetId, $scope.front == 1 ? 1 : 2, $scope.filterParams, false,$scope.qs)
        .success(function (response, status, headers, config) {
          $scope.productIds = response.data.productCateIds?response.data.productCateIds:'';
            console.log($scope.productIds);
          if (response.data.productList.length <= 0) {
            $scope.emptySearch = true;
            $scope.hShow = true;
            $scope.hotWordShow = true;
            $scope.hShowB = false;
            $scope.showTab = false;
          } else {
            $scope.emptySearch = false;
            $scope.searchData = response.data.productList;
            $scope.showTab = true;
            $scope.hasmore = true;

            $scope.comprehensive_index = 1;
            $scope.chooseIndex = 0;
            $scope.showComprehensiveSub = false;
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
        })
    }
    /******************筛选功能相关方法处理start****************/
    //筛选modal
    $ionicModal.fromTemplateUrl('templates/product/SearchFilterModal.html', {
      scope: $scope,
      animation: 'slide-in-left',
      backdropClickToClose: false
    }).then(function (modal) {
      $scope.filterModal = modal;
    });

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
    };

    //选择品牌 --支持多选
    $scope.chooseBrand = function (index, brand) {
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
      //var firstParams = $scope.filterParameterArr.join("@");
      //var secondParams = $scope.filterOtherPatam.join(';');
      //$scope.filterArray = firstParams + '@' + secondParams;
      //tabState[2] = $scope.filterArray;
      //$scope.chooseIndex = 2;
      //$scope.page = 1;
      //$scope.productList = [];
      $scope.searchData = null;
      $scope.xyzShData = null;
      $scope.filterModal.hide();
      $scope.lianXC = false;
      searchStartNew();
      $scope.chooseIndex = 2;
      $scope.filter_index = 1;//筛选数组下标
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
    $scope.closeModal = function () {
      $scope.filterModal.hide();
    };
    //打开筛选modal
    $scope.openFilterModal = function () {
      $scope.filterModal.show();
      console.log($scope.filterParameterArr)
      
      //$scope.resetFilter();
      //$scope.filterParameterArr = ['hasStock', 'all', '0'];
      //防止多次加载
      console.log($scope.productIds);
   
        
        GoodsService.getFilterData($scope.productIds)
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

      
    };
    $scope.$on('$destroy', function () {
      $scope.filterModal.remove();
    });
    /******************筛选功能相关方法处理end****************/
  }
]);


APP.service('GoodsSearchService', ['$http', 'UrlService', function ($http, UrlService) {
  //筛选支持多选搜索
  this.wdCommonSearchNew = function (pageIndex, pageSize, memberId, keyword, searchType, provinceId, cityId, districtId, streetId, fromType, filterData, noLoading, qs) {
    var params = {
      'pageIndex': pageIndex,
      'pageSize': pageSize,
      'memberId': memberId,
      'keyword': keyword,
      'searchType': searchType,
      'provinceId': provinceId,
      'cityId': cityId,
      'districtId': districtId,
      'streetId': streetId,
      'fromType': fromType,
      'filterData': filterData,
      'qs': qs,
      'noLoading': noLoading
    };
    //WDCOMMONSEARCHNEW
    return $http.get(UrlService.getUrl('WDCOMMONSEARCHNEW'), params);
  }
  //选品页搜索
  this.selectionSearch = function (pageIndex, pageSize, memberId, keyword, searchType, provinceId, cityId, districtId, streetId, noLoading, qs) {
    var params = {
      'pageIndex': pageIndex,
      'pageSize': pageSize,
      'memberId': memberId,
      'keyword': keyword,
      'searchType': searchType,
      'provinceId': provinceId,
      'cityId': cityId,
      'districtId': districtId,
      'streetId': streetId,
      'noLoading': noLoading,
      'qs': qs,
    };
    //SEARCHGOODS_INIT
    return $http.get(UrlService.getUrl('WDCOMMONSEARCHNEW'), params);
  };
  //店铺预览页搜索
  this.myStoreSearch = function (pageIndex, pageSize, memberId, keyword, searchType, provinceId, cityId, districtId, streetId, fromType, filterData, noLoading, qs) {
    var params = {
      'pageIndex': pageIndex,
      'pageSize': pageSize,
      'memberId': memberId,
      'keyword': keyword,
      'searchType': searchType,
      'provinceId': provinceId,
      'cityId': cityId,
      'districtId': districtId,
      'streetId': streetId,
      'fromType': fromType,
      'filterData': filterData,
      'noLoading': noLoading,
      'qs': qs,
    };
    //SEARCH_GOODS
    return $http.get(UrlService.getUrl('WDCOMMONSEARCHNEW'), params);
  };
  //商品是否添加至店铺
  this.changeChooseStateJia = function (productId, onShelf) {
    var params = {
      'productId': productId,
      'onShelf': onShelf,
      'noLoading': true
    };
    return $http.get(UrlService.getUrl('CHANGECHOOSESTATEJIA_INIT'), params);
  };
  //商品是否添加至店铺
  this.changeChooseStateDui = function (productId) {
    var params = {
      'productId': productId,
      'noLoading': true
    };
    return $http.get(UrlService.getUrl('CHANGECHOOSESTATEDUI_INIT'), params);
  };
  //热门词搜索
  this.hotWords = function () {
    var params = {
      'platform': 3
    };
    return $http.get(UrlService.getUrl('HOT_WORDS'), params);
  }
  //默认词
  this.defaultSearch = function () {
    var params = {
      'platform': 3
    };
    return $http.get(UrlService.getUrl('DEFAULTSEARCH_WORDS'), params);
  }
  //联想k词搜索
  this.associationalWords = function (searchKey) {
    var params = {
      'searchKey': searchKey,
      'platform': 3
    };
    return $http.get(UrlService.getUrl('ASSOCIATIONAL_WORDS'), params);
  }
}]);
