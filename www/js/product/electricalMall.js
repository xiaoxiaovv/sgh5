/**
 * creater:刘成杰
 * create time:2017/8/4
 * describe：更多
 **/
APP.controller('ElectricalMallController', ['BannerThemeService','$ionicHistory', '$interval', 'ElectricalMallService', '$ionicSlideBoxDelegate', '$ionicScrollDelegate', 'HomePageService', 'GoodsService', 'BranchTypeDetailService', '$q', '$ionicModal', 'CalculateStrLength', 'InAppBrowserService', 'CreditService', 'ShopService', '$scope', '$timeout', 'UserService', '$state', 'LoginService', '$localstorage', '$rootScope', '$stateParams', '$ionicPopup','PopupService', function (BannerThemeService,$ionicHistory, $interval, ElectricalMallService, $ionicSlideBoxDelegate, $ionicScrollDelegate, HomePageService, GoodsService, BranchTypeDetailService, $q, $ionicModal, CalculateStrLength, InAppBrowserService, CreditService, ShopService, $scope, $timeout, UserService, $state, LoginService, $localstorage, $rootScope, $stateParams, $ionicPopup,PopupService) {
  /** 变量声明 **/
  // daba STARTA
  $scope.productCateId = '2729'; //类目id
  $scope.filterData = ''; //筛选条件
  $scope.qs = ''; //筛选条件 darcy
  $scope.switch = true; //筛选接口查询开关，防止多次请求筛选；
  $scope.isListNull = false; //判断列表是否为空
  $scope.chooseIndex = '0'; //筛选选中
  $scope.filter_index = 0; //筛选数组下标
  $scope.productCateIdType = '0';
  // $scope.filterData = "isHotDesc";
  $scope.qs = "isHotDesc";
  $scope.contentDataList = []; //内容区域列表数据
  $scope.conDataListxyz = []; //内容区域列表数据
  $scope.pageIndex = '1'; //分页默认第一页
  $scope.pageSize = '5'; //每页显示几条数据
  //地理位置默认值或者获取失败;
  $scope.pholder = "1";
  $scope.provinceId = '16'; //省分Id  山东
  $scope.cityId = '173'; //市Id   青岛
  $scope.districtId = '2450'; //区Id   崂山
  $scope.streetId = '12036596'; //街道Id  中韩街道
  $scope.flashHour = '';
  $scope.flashText='';
  if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
    $scope.isIosApp = true;
  } else {
    $scope.isIosApp = false;
  }
  $scope.memberId = UserService.getUser().mid; //用户id
  $scope.isBuyer = LoginService.getRole(); //判断用户角色信息；0为买家；1为卖家
  $scope.userId = UserService.getUser().mid; //用户Id
  var memberId = ''; //用户Id
  $scope.storeId = $localstorage.get('storeId', $rootScope.globalConstant.storeId); //获取店铺Id，传递到详情页
  $scope.noLoading = 'false'; //设置loading状态
  $scope.lstAttributes = []; //筛选属性列表；
  $scope.hasmore = false; //上拉加载时能标志
  $scope.settingsList='';//是否显示佣金本地存储
  $scope.flagNum = false;
  $scope.messageImgUrl = "http://cdn09.ehaier.com/shunguang/H5/www/img/message_gray@2x.png";
  //定义图片
  $scope.comprehensive = [$rootScope.imgBaseURL+'img/comprehensive_black.png', $rootScope.imgBaseURL+'img/comprehensive_white.png']; //综合 箭头数组
  $scope.comprehensive_index = 1; //综合箭头数组下标
  $scope.arrowState = [$rootScope.imgBaseURL+'img/arrow_state_0.png', $rootScope.imgBaseURL+'img/arrow_state_1.png', $rootScope.imgBaseURL+'img/arrow_state_2.png']; //佣金和价格 箭头数组
  $scope.commission_index = 0; //佣金 箭头数组 下标
  $scope.price_index = 0; //价格 箭头数组 下标
  $scope.filterState = [$rootScope.imgBaseURL+'img/filter_state_0.png', $rootScope.imgBaseURL+'img/filter_state_1.png']; //筛选 图片数组
  //$scope.filter_index = 0; //筛选数组下标
  var tabState = ['isHotDesc', ['commission', 'commissionDesc'], '', 'saleDesc', ['price', 'priceDesc']]; //筛选 接口需要传递的参数 数组
  $scope.comprehensiveSub = ['人气优先']; //综合 子选项数组
  $scope.selectComprehensiveSubIndex = 0; //综合 子选项数组 默认下标

  $scope.goProductDetail = function (productId) {
    $state.go('productDetail', {
      fromType: '',
      fromUrl: '',
      o2oType: 0,
      productId: productId,
      storeId: $scope.storeId
    })
  };
  /******************筛选功能相关变量定义start****************/
  $scope.iSPrice = true; //价格展开标志
  $scope.brand = true; //品牌展开标志
  $scope.brandName = ''; //品牌选中项，默认：全部
  $scope.brandList = []; //筛选品牌列表
  //$scope.otherList = [];  //其他筛选列表
  $scope.filterParameterArr = ['hasStock', 'all', '0']; //筛选参数数组
  //$scope.filterOtherPatam = [];//筛选条件中其他参数暂存数组
  //$scope.isCurrent = [[true], [true]];     //其他条件是否选中标识
  $scope.StockStateArr = ['all', 'hasStock']; //库存状态数组
  $scope.filterPrice = {
    min: null, //筛选最低价格
    max: null //筛选最高价格
  };
  $scope.filterParams = ''; //请求接口筛选条件参数

  /******************筛选功能相关变量定义end****************/


  //daba END  后台给的类目id数据--格式化成数组;
  $scope.datatypeNameArr = [{
    "productCateId": "2729",
    "name": "空调"
  }, {
    "productCateId": "2725",
    "name": "洗衣机"
  }, {
    "productCateId": "2723",
    "name": "冰箱"
  }, {
    "productCateId": "2743",
    "name": "彩电"

  }, {
    "productCateId": "2741",
    "name": "热水器"

  }, {
    "productCateId": "2742",
    "name": "厨房电器"

  }, {
    "productCateId": "2726",
    "name": "冷柜"

  }, {
    "productCateId": "2973",
    "name": "智能产品"

  }, {
    "productCateId": "2737",
    "name": "生活家电"

  }, {
    "productCateId": "2774",
    "name": "水家电"

  },
    {
    "productCateId": "2736",
    "name": "家庭医疗"

  }, {
    "productCateId": "2811",
    "name": "家用中央空调"

  }];


  $scope.storeId = UserService.getUser().mid;
  $scope.countTime = {}; //倒计时时间
  $scope.dealPrice = CalculateStrLength.dealPrice;
  $scope.selectedIndex = 0; //第一条数据typeNameList
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
        console.log($scope.settingsList);
    }

  //返回上一页
  $scope.goBack = ionic.Utils.debounce(function () {
    $ionicHistory.goBack();
  },300);
  //跳转搜索页
  $scope.goToSearch = function () {
    $state.go('goodsSearch', {
      front: 1
    });
  };
  /******列表Start******/
  //上拉加载
  $scope.loadMore = function () {
    $scope.pageIndex = $scope.pageIndex * 1 + 1;
    $scope.getListInit();
  };

  //刷新获取列表-请求成功在清除list
  $scope.ResGetList = function () {
    BranchTypeDetailService.loadMoreProducts(
      $scope.pholder,
      $scope.provinceId,
      $scope.cityId,
      $scope.districtId,
      $scope.streetId,
      $scope.pageIndex,
      $scope.pageSize,
      $scope.productCateId,
      $scope.memberId,
      $scope.filterData,
      $scope.qs
    ).success(function (res) {
      if (res.success) {
        if (res.message == "list获取商品数据为空" && $scope.pageIndex == 1) {
          $scope.isListNull = true;
          $scope.contentDataList = [];
          $scope.conDataListxyz = [];
        } else {
          $scope.isListNull = false;
        }

        if (res.data.productList) {
          var data = res.data.productList;
          $scope.contentDataList = data;
          if(res.data.isCanSyncGetPrice){
            GoodsService.asyncPrice(res.data.traceId).success(function(res){
              if(res.success){
                for(var i=0,l=data.length;i<l;i++){
                  var product=data[i];
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
        if ($scope.pageIndex * 5 <= res.totalCount) {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.hasmore = true;
        } else {
          $scope.hasmore = false;
        }
      } else {
        $scope.contentDataList = [];
        $scope.conDataListxyz = [];
        $scope.isListNull = true;
        var message = res.message;
        PopupService.showToast(message);
      }
    })
  };

  //页面加载获取列表
  $scope.getListInit = function () {
    BranchTypeDetailService.loadMoreProducts(
      $scope.pholder,
      $scope.provinceId,
      $scope.cityId,
      $scope.districtId,
      $scope.streetId,
      $scope.pageIndex,
      $scope.pageSize,
      $scope.productCateId,
      $scope.memberId,
      $scope.filterData,
      $scope.qs
    ).success(function (res) {
      if (res.success) {
        if (res.message == "list获取商品数据为空" && $scope.pageIndex == 1) {
          $scope.isListNull = true;
        } else {
          $scope.isListNull = false;
        }

        if (res.data.productList) {
          var data = res.data.productList;
          $scope.contentDataList = $scope.contentDataList.concat(data);
          if(res.data.isCanSyncGetPrice){
            GoodsService.asyncPrice(res.data.traceId).success(function(res){
              if(res.success){
                for(var i=0,l=data.length;i<l;i++){
                  var product=data[i];
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
        if ($scope.pageIndex * 5 <= res.totalCount) {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.hasmore = true;
        } else {
          $scope.hasmore = false;
        }
      } else {
        $scope.contentDataList = [];
        $scope.conDataListxyz = [];
        $scope.isListNull = true;
        var message = res.message;
        PopupService.showToast(message);
      }
    })
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
    //综合0  佣金1  销量3  价格4  筛选2
    if ($scope.chooseIndex == index && index == 3) {
      return;
    }
    if (index == 2) {
      $scope.filter_index = 1; //筛选数组下标
      $scope.chooseIndex = index;
      $scope.comprehensive_index = 0; //综合箭头数组下标
      $scope.commission_index = 0; //佣金 箭头数组 下标
      $scope.price_index = 0; //价格 箭头数组 下标
      $scope.filter_index = 1; //筛选数组下标
      $scope.showComprehensiveSub = false;
      $scope.openFilterModal();
    } else {
      //点击筛选以外的按钮重置筛选
      // $scope.resetFilter();
      $scope.page = 2;
      // $scope.chooseIndex = index;
      //如果是 综合
      if (index == 0) {
        $scope.showComprehensiveSub = !$scope.showComprehensiveSub; //综合 子选项的显示开关
        // $scope.comprehensive_index = 1;//综合 数组下标变化 0 1 之间变化
        return;
      } else if (index == 1) { //如果是 佣金
        $scope.lianXC = false;
        $scope.chooseIndex = index;
        $scope.showComprehensiveSub = false;
        var commission_index = $scope.commission_index == 1 ? 0 : 1; //佣金图片下标 临时变量
        $scope.commission_index = $scope.commission_index == 1 ? 2 : 1; //佣金 箭头数组 下标
        $scope.filterParams = tabState[1][commission_index]; //请求接口的 参数 佣金
        $scope.comprehensive_index = 0; //综合 数组下标变化
        $scope.price_index = 0; //价格 箭头数组 下标
        $scope.filter_index = 0; //筛选数组下标
        $scope.searchData = [];
        if (commission_index == 1) {
          // $scope.filterData = "commission"; //佣金倒序
          $scope.qs = "commission"; //darcy
        } else {
          // $scope.filterData = "commissionDesc"; //佣金正序
          $scope.qs = "commissionDesc"; //darcy
        }

      } else if (index == 3) { //如果是 销量
        $scope.lianXC = false;
        $scope.chooseIndex = index;
        $scope.showComprehensiveSub = false;
        $scope.filterParams = 'saleDesc'; //请求接口的 参数 销量
        $scope.price_index = 0; //价格 箭头数组 下标
        $scope.commission_index = 0; //佣金 箭头数组 下标
        $scope.comprehensive_index = 0; //综合 数组下标变化
        $scope.filter_index = 0; //筛选数组下标
        $scope.searchData = [];
        // $scope.filterData = "saleDesc"; //销量
        $scope.qs = "saleDesc"; //darcy
      } else if (index == 4) { //如果是 价格
        $scope.lianXC = false;
        $scope.chooseIndex = index;
        $scope.showComprehensiveSub = false;
        var price_index = $scope.price_index == 1 ? 0 : 1; //价格下标 临时变量
        $scope.price_index = $scope.price_index == 1 ? 2 : 1; //价格 箭头数组 下标
        $scope.filterParams = tabState[4][price_index]; //请求接口的 参数 价格
        $scope.filter_index = 0; //筛选数组下标
        $scope.commission_index = 0; //佣金 箭头数组 下标
        $scope.comprehensive_index = 0; //综合 数组下标变化
        $scope.searchData = [];
        if (price_index == 1) {
          // $scope.filterData = "price"; //价格倒序
          $scope.qs = "price"; //价格倒序
        } else {
          // $scope.filterData = "priceDesc"; //价格正序
          $scope.qs = "priceDesc"; //价格倒序
        }
      }
      $scope.pageIndex = 1;
      $scope.hasmore = false;
      //$scope.contentDataList = [];
      //页面加载列表--待请求成功清除list
      $scope.ResGetList();
    }
  };
  //关闭综合子选项
  $scope.closeComprehensiveSub = function () {
    $scope.showComprehensiveSub = !$scope.showComprehensiveSub;
  };
  //选择综合 子选项
  $scope.selectComprehensiveSub = function (index, $event) {
    $event.stopPropagation();
    if (index == 0) {
      $scope.filterParams = 'isHotDesc'; //请求接口的 参数 人气优先
      // $scope.filterData = 'isHotDesc' //综合
      $scope.qs = 'isHotDesc'; //综合 darcy
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
    $scope.pageIndex = 1;
    $scope.hasmore = false;
    //$scope.contentDataList = [];
    //页面加载获取列表 ---获取成功才清除list
    $scope.ResGetList();

  };
  /******************筛选功能相关方法处理start****************/
  //筛选modal
  $ionicModal.fromTemplateUrl('templates/product/branchTypeDetailModal.html', {
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
  //选择品牌
  $scope.chooseBrand = function (index, item, brandList) {
    var length = brandList.length - 1;
    var n = 0;
    if (item.id != 0) {
      if (item.active == "false") {
        item.active = 'true';
      } else {
        item.active = 'false';
      }
      for (var i = 0; i < brandList.length; i++) {

        if (i > 0 && brandList[i].active == "true") {
          brandList[0].active = 'false';
          n++;
        }
      }
      if (n == length || n == 0) {
        for (var i = 0; i < brandList.length; i++) {
          if (i > 0) {
            brandList[i].active = 'false';
          }
        }
        brandList[0].active = 'true';
      }

    } else {
      //全选反选
      if (item.active == "false") {
        item.active = "true";
        for (var i = 0; i < brandList.length; i++) {
          if (i > 0) {
            brandList[i].active = "false";
          }
        }
      }
    }

  };
  //筛选确定
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
    }
    //品牌值拼接
    var brandListData = ""; //品牌
    if ($scope.brandList[0].active == "true") {
      brandListData = "all;";
    } else {
      for (var i = 1; i < $scope.brandList.length; i++) {
        if ($scope.brandList[i].active == "true") {
          brandListData += $scope.brandList[i].id + ';';
        }
      }
    }
    brandListData = brandListData.substring(0, brandListData.length - 1);
    $scope.filterParameterArr[1] = brandListData;

    //属性值拼接
    var lstAttributes = "";
    for (var i = 0; i < $scope.lstAttributes.length; i++) {
      for (var j = 0; j < $scope.lstAttributes[i].lstAttributeOptions.length; j++) {
        if ($scope.lstAttributes[i].lstAttributeOptions[0].active == "true") {
          lstAttributes += '0;';
          break;
        } else {
          if ($scope.lstAttributes[i].lstAttributeOptions[j].active == "true") {
            lstAttributes += $scope.lstAttributes[i].lstAttributeOptions[j].id + ';';
          }
        }
      }
      lstAttributes += ",";
    }

    lstAttributes = lstAttributes.replace(/;,/g, ',');
    $scope.filterParams = $scope.filterParameterArr.join("@");
    $scope.filterParams = $scope.filterParams + '@' + lstAttributes;
    $scope.filterData = $scope.filterParams;
    $scope.searchData = null;
    $scope.filterModal.hide();
    $scope.lianXC = false;
    $scope.pageIndex = 1;
    $scope.hasmore = false;
    $scope.ResGetList();//获取数据成功才清除list
    $scope.chooseIndex = 2;
    $scope.filter_index = 1; //筛选数组下标
  };
  //筛选条件重置方法
  $scope.resetFilter = function () {
    $scope.brand = true;
    $scope.brandName = '全部';
    $scope.isBrand = [true, false, false, false, false, false, false, false, false];
    //$scope.otherName = ['全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部','全部', '全部'];//其他筛选条件选中项，默认：全部
    $scope.filterParameterArr = ['hasStock', 'all', '0'];
    $scope.filterPrice = {
      min: null,
      max: null
    };
    //重置重新获取列表
    var params = '';
    if ($scope.productCateIdType != 1) {
      //类目  属性
      params = $scope.productCateId;
    }
    $scope.ResGetFilterDataLists(params);
    $ionicScrollDelegate.resize();
  };
  $scope.closeModal = function () {
    $scope.filterModal.hide();
  };
  //打开筛选modal
  $scope.openFilterModal = function () {
    //$scope.resetFilter();
    var params = '';
    if ($scope.productCateIdType != 1) {
      //类目  属性
      params = $scope.productCateId;
    }
    $scope.filterModal.show();
    if ($scope.switch) {
      $scope.switch = false; //防止多次请求
      $scope.getFilterDataLists(params);
    }
  };
  //获取筛选列表
  $scope.getFilterDataLists = function (params) {
    BranchTypeDetailService.getFilterData(params).success(function (response) {
      if (response.success) {
        //判断是否是品牌id
        if ($scope.brandId) {
          for (var i = 0; i < response.data.brandList.length; i++) {
            if ($scope.brandId == response.data.brandList[i].id) {
              response.data.brandList[i].active = 'true';
            } else {
              response.data.brandList[i].active = 'false';
            }
          }
        } else {
          for (var i = 0; i < response.data.brandList.length; i++) {
            if (i == 0) {
              response.data.brandList[i].active = 'true';
            } else {
              response.data.brandList[i].active = 'false';
            }
          }
        }
        $scope.brandList = response.data.brandList;
        //类目 和 属性
        if (response.data.filterMap != null) {
          //类目
          if ($scope.productCateIdType == 0) {
            var arr = response.data.filterMap.lstAttributes;
            var arr2 = [];
            for (var i = 0; i < arr.length; i++) {
              if (arr[i] != null) {
                if (arr[i].lstAttributeOptions.length) {
                  arr[i].down = 'true';
                  for (var j = 0; j < arr[i].lstAttributeOptions.length; j++) {
                    //默认全部是选中状态
                    if (j == 0) {
                      arr[i].lstAttributeOptions[j].active = 'true';
                    } else {
                      arr[i].lstAttributeOptions[j].active = 'false';
                    }
                  }
                  arr2.push(arr[i]);
                }
              }
            }
            $scope.lstAttributes = arr2;
          }
          //属性
          if ($scope.productCateIdType == 2) {
            var arr = response.data.filterMap.lstAttributes;
            var arr2 = [];
            for (var i = 0; i < arr.length; i++) {

              if (arr[i] != null) {
                if (arr[i].lstAttributeOptions.length) {
                  arr[i].down = 'true';
                  for (var j = 0; j < arr[i].lstAttributeOptions.length; j++) {
                    //默认全部是选中状态
                    if (arr[i].lstAttributeOptions[j].id == $scope.attributeId) {
                      arr[i].lstAttributeOptions[j].active = 'true';
                      arr[i].lstAttributeOptions[0].active = 'false';
                    } else {
                      if (j == 0) {
                        arr[i].lstAttributeOptions[j].active = 'true';
                      } else {
                        arr[i].lstAttributeOptions[j].active = 'false';
                      }
                    }
                  }
                  arr2.push(arr[i]);
                }
              }
            }
            $scope.lstAttributes = arr2;
          }
        }
      }
    });
  };
  //获取筛选列表-重置
  $scope.ResGetFilterDataLists = function (params) {
    BranchTypeDetailService.getFilterData(params).success(function (response) {
      if (response.success) {
        //判断是否是品牌id
        for (var i = 0; i < response.data.brandList.length; i++) {
          if (i == 0) {
            response.data.brandList[i].active = 'true';
          } else {
            response.data.brandList[i].active = 'false';
          }
        }
        $scope.brandList = response.data.brandList;
        //类目 和 属性 $scope.attributeId
        if (response.data.filterMap != null) {
          if ($scope.productCateIdType == 0 || 2) {
            var arr = response.data.filterMap.lstAttributes;
            var arr2 = [];
            for (var i = 0; i < arr.length; i++) {
              if (arr[i] != null) {
                if (arr[i].lstAttributeOptions.length) {
                  arr[i].down = 'true';
                  for (var j = 0; j < arr[i].lstAttributeOptions.length; j++) {
                    //默认全部是选中状态
                    if (j == 0) {
                      arr[i].lstAttributeOptions[j].active = 'true';
                    } else {
                      arr[i].lstAttributeOptions[j].active = 'false';
                    }
                  }
                  arr2.push(arr[i]);
                }
              }
            }
            $scope.lstAttributes = arr2;
          }
        }
      }
    });
  };

  //收起展开
  $scope.changeDown = function (item) {
    item.down = !item.down;
  };
  //全选 单选
  $scope.ClickAttributes = function (item, itemParent) {
    var length = itemParent.lstAttributeOptions.length - 1;
    var n = 0;
    if (item.id != 0) {
      if (item.active == "false") {
        item.active = 'true';
      } else {
        item.active = 'false';
      }
      for (var i = 0; i < itemParent.lstAttributeOptions.length; i++) {
        if (i > 0 && itemParent.lstAttributeOptions[i].active == "true") {
          itemParent.lstAttributeOptions[0].active = 'false';
          n++;
        }
      }
      if (n == length || n == 0) {
        for (var i = 0; i < itemParent.lstAttributeOptions.length; i++) {
          if (i > 0) {
            itemParent.lstAttributeOptions[i].active = 'false';
          }
        }
        itemParent.lstAttributeOptions[0].active = 'true';
      }

    } else {
      //全选反选
      if (item.active == "false") {
        item.active = "true";
        for (var i = 0; i < itemParent.lstAttributeOptions.length; i++) {
          if (i > 0) {
            itemParent.lstAttributeOptions[i].active = "false";
          }
        }
      }
    }
  };

  //上下架
  $scope.changeState = function (productId, sta, index) {
    if (sta == 1) {
      //添加
      BranchTypeDetailService.changeChooseStateJia(productId, '1')
        .success(function (response, status, headers, config) {
          if (response.success == true) {
            $scope.contentDataList[index].onShelf = true;
            $scope.showPopup('从店铺上架');
          }
        });
    } else {
      //删除
      BranchTypeDetailService.changeChooseStateDui(productId)
        .success(function (response, status, headers, config) {
          if (response.success == true) {
            $scope.contentDataList[index].onShelf = false;
            $scope.showPopup('从店铺下架');
          }
        });
    }
  };
  /******列表End******/
  $scope.$on('$destroy', function () {
    $scope.filterModal.remove();
  });


  //商品分类(滚动条)状态切换
  $scope.selectTab = function (index) {
  	 //设置为综合
  	$scope.filterParams = 'isHotDesc'; //请求接口的 参数 人气优先
    // $scope.filterData = 'isHotDesc' //综合
    $scope.qs = 'isHotDesc';//综合darcy
    $scope.lianXC = false;
    $scope.selectComprehensiveSubIndex = 0;
    $scope.showComprehensiveSub = false;
    $scope.chooseIndex = 0;
    $scope.productList = [];
    $scope.comprehensive_index = 1; //综合 数组下标变化 0 1
    $scope.commission_index = 0; //佣金 箭头数组 下标
    $scope.price_index = 0; //价格 箭头数组 下标
    $scope.filter_index = 0; //筛选数组下标
    $scope.pageIndex = 1;
    $scope.hasmore = false;

    $scope.pageIndex = '1'; //分页默认第一页
    $scope.selectedIndex = index; //切换选中下标
    $scope.productCateId = $scope.datatypeNameArr[index].productCateId; //设置当前商品id
    //点击筛选以外的按钮重置筛选
    $scope.resetFilter();
    $scope.filterData='';
    BranchTypeDetailService.loadMoreProducts(
      $scope.pholder,
      $scope.provinceId,
      $scope.cityId,
      $scope.districtId,
      $scope.streetId,
      $scope.pageIndex,
      $scope.pageSize,
      $scope.productCateId,
      $scope.memberId,
      $scope.filterData,
      $scope.qs
    ).success(function (res) {
      if (res.success) {
        if (res.message == "list获取商品数据为空" && $scope.pageIndex == 1) {
          $scope.isListNull = true;
          $scope.contentDataList = [];
          $scope.conDataListxyz = [];
        } else {
          $scope.isListNull = false;
        }

        if (res.data.productList) {
          var data=res.data.productList;
          $scope.contentDataList = data;
          if(res.data.isCanSyncGetPrice){
            GoodsService.asyncPrice(res.data.traceId).success(function(res){
              if(res.success){
                for(var i=0,l=data.length;i<l;i++){
                  var product=data[i];
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
        if ($scope.pageIndex * 5 <= res.totalCount) {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.hasmore = true;
        } else {
          $scope.hasmore = false;
        }
      } else {
        $scope.contentDataList = [];
        $scope.conDataListxyz = [];
        $scope.isListNull = true;
        var message = res.message;
        PopupService.showToast(message);
      }
    })
  };

  $scope.bannerClick = function (linkType, link, relationId) {
    console.log(linkType);
    console.log(link);
    var tempArr = link.split('&');
    switch (linkType) {
      case -1:
        BannerThemeService.getBannerTheme(relationId)
          .success(function (response) {
            console.log(response);
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
          storeId: $scope.storeId
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
            storeId: $scope.storeId
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

  function renderCountDown(time) {
    $scope.countTime = {};
    var hours = parseInt((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = parseInt((time % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((time % (1000 * 60)) / 1000);
    $scope.countTime = {
      hours: hours,
      minutes: minutes,
      seconds: seconds
    }
  }

  function getAddress() {
    var deferred = $q.defer();
    GoodsService.getAddress()
      .success(function (res) {
        console.log(res);
        var obj = eval(res.data);
        var regionIndex = obj[0].regionName.indexOf('/');
        $scope.region = obj[0].regionName.substr(0, regionIndex);
        deferred.resolve(obj[0]);
      });
    return deferred.promise;
  }
  $scope.init = function () {
    $scope.contentDataList = [];
    $scope.hasmore = false;
    ElectricalMallService.getTopMsg()
      .success(function (res) {
        $scope.bannerList = res.data.topBannerList;
        $scope.midActivtyList = res.data.midActivtyList;
        //更新轮播
        $timeout(function(){
          $ionicSlideBoxDelegate.update();
          $ionicSlideBoxDelegate.loop(true);
        },200);
      });
    getAddress()
      .then(function (res) {
        console.log(res);
        $scope.provinceId = res.provinceId;
        $scope.cityId = res.cityId;
        $scope.areaId = res.areaId;
        $scope.districtId = res.areaId;
        $scope.streetId = res.streetId;
        getFlashSales();
        ElectricalMallService.getMiddleMsg(res.provinceId, res.cityId, res.areaId, res.streetId, 1)
          .success(function (res) {
            console.log(res);
            $scope.floors = res.data.floors;
            //更新轮播
            $timeout(function(){
              $ionicSlideBoxDelegate.update();
              $ionicSlideBoxDelegate.loop(true);
            },200);
          });
        $scope.page = 1;
        //页面加载获取列表
        $scope.getListInit();
      });
      HomePageService.getUnReadMsg()
        .success(function (res) {
          if (res.data > 0) {
            $scope.flagNum = true;
          } else {
            $scope.flagNum = false;
          }
        })
  };

  function getFlashSales() {
      $interval.cancel($scope.timer);
      $interval.cancel($scope.timer1);
    HomePageService.getFlashSales($scope.provinceId, $scope.cityId, $scope.areaId, $scope.streetId)
      .success(function (res) {
        if (res.data.flashProductList) {
            $scope.flashProductList = res.data.flashProductList;
            $scope.isWd = res.data.isWd;
            $scope.flashTime = res.data.flashTime; //活动开始时间
            $scope.systemTime = res.data.systemTime;//服务器时间
            $scope.preheatingTime = res.data.preheatingTime;//预热时间
            var nowMinute = new Date($scope.flashTime).getMinutes().toString();
            if(nowMinute == '0'){
              $scope.flashHour=new Date($scope.flashTime).getHours()+'点场'
            }else{
              $scope.flashHour=new Date($scope.flashTime).getHours()+'点半场'
            }
            if ($scope.flashProductList.length==0 || ($scope.systemTime - new Date($scope.flashProductList[0].endTime).getTime() > -1000) || ($scope.systemTime<$scope.preheatingTime)) {
              $scope.showFlashSale = false;
            } else {
              $scope.showFlashSale = true;
              if($scope.systemTime - new Date($scope.flashTime).getTime() > -1000){
                $scope.timer = $interval(function () {
                if (new Date($scope.flashProductList[0].endTime).getTime() - $scope.systemTime <1000) {
                  $interval.cancel($scope.timer);
                    getFlashSales();
                }
                renderCountDown(new Date($scope.flashProductList[0].endTime).getTime() - $scope.systemTime);
                $scope.systemTime+=1000;
              }, 1000);
                $timeout(function () {
                  $scope.flashText='结束';
                }, 1000)
              }else{
                $scope.timer1 = $interval(function () {
                if (new Date($scope.flashTime).getTime() - $scope.systemTime <1000) {
                  $interval.cancel($scope.timer1);
                  getFlashSales();
                }
                renderCountDown(new Date($scope.flashTime).getTime() - $scope.systemTime);
                $scope.systemTime+=1000;
              }, 1000);
                $timeout(function () {
                  $scope.flashText='开始';
                }, 1000)
              }
            }
          }else{
            $scope.showFlashSale = false;
          }
      })
  }
  // 格式化
  function Format(a) {
    if (a < 10) {
      a = '0' + a;
    } else {
      a = a;
    }
    return a;
  }
  $scope.backToTop = function(){
    $ionicScrollDelegate.scrollTo(0,$scope.scrollFixedTop,true);
  };
  $scope.onScroll = function () {
    $scope.scrollTop = $ionicScrollDelegate.getScrollPosition().top;
    $scope.scrollFixedTop = $(".scrollFixed")[0].offsetTop;
    $scope.$apply(function () {$scope.showBackToTopImg = $scope.scrollTop>$scope.scrollFixedTop;
    })
  };
  /*swiper轮播*/
  // $scope.swpcontainerMall1,$scope.swpcontainerMall2,$scope.swpcontainerMall3;
  $scope.$on('$ionicView.enter', function (e, v) {
    $(".backToTop").attr("totop",$(".scrollFixed")[0].offsetTop);
    $("go-top").attr("totop",$(".scrollFixed")[0].offsetTop);
    ionic.on('scroll', $scope.onScroll,$scope.$$childHead.scrollCtrl.element)
  });
  //页面加载刷新数据
  $scope.$on('$ionicView.beforeEnter', function (e, v) {
    $scope.showBackToTopImg = false;//滚动到顶部 的 开关
  	GetSwitchChecked();//获取是否显示佣金 本地存储值
    //筛选 排序 tab显示的开关
    $scope.showTab = false;
    $scope.filterParams = '';
    $scope.lianXC = false;
    $scope.storeId = $localstorage.get('storeId', $rootScope.globalConstant.storeId);
    $scope.isBuyer = LoginService.getRole(); //判断用户角色信息；0为买家；1为卖家
    $scope.userId = UserService.getUser().mid; //用户Id
    //更新轮播
    $timeout(function(){
      $ionicSlideBoxDelegate.loop(true);
      $ionicSlideBoxDelegate.start();
      $ionicSlideBoxDelegate.update();
    },200);
    if (v.direction == 'back') {
      //xyz修改
      $scope.hShow = false;
      $scope.hotWordShow = false;
      $scope.hShowB = false;
      HomePageService.getUnReadMsg()
        .success(function (res) {
          if (res.data > 0) {
            $scope.flagNum = true;
          } else {
            $scope.flagNum = false;
          }
        })
    } else {
      $scope.showFlashSale = false;
      var lll = localStorage.getItem("historys");
      if (lll) {
        $scope.hShow = true;
        $scope.hShowB = false;
      } else {
        $scope.hShow = false;
        $scope.hShowB = true;
      }
      $scope.tabNav = 'selection'; //tableBar选中选品
      $scope.hasmore = false; //上拉加载时能标志
      $scope.typeChoose = '商品'; //搜索分类初始选项
      $scope.page = 2; //上拉加载起始页

      //获取用户信息
      if ($stateParams.shareStoreId) {
        memberId = $stateParams.shareStoreId;
      } else {
        memberId = UserService.getUser().mid;
      }

      //进入页面刷新数据， 返回不刷新；
      //获取地理
      BranchTypeDetailService.getAddress().success(function (res) {
        if (res.data != null) {
          var obj = eval(res.data);
          $scope.provinceId = obj[0].provinceId;
          $scope.cityId = obj[0].cityId;
          $scope.regionId = obj[0].areaId;
          $scope.streetId = obj[0].streetId;
          $scope.areaId = obj[0].areaId;
        }
      });
      $scope.init();
      $ionicScrollDelegate.scrollTop();
    }

    //当list有数据
    if ($scope.contentDataList.length > 0) {
        var obj = $scope.contentDataList[0];
        //当商家登录需要刷新页面
        if (LoginService.getRole() == 1 && obj['commission'] == undefined) {
            //获取列表数据--刷新
            $scope.ResGetList();
        }
    }
  });
  $scope.$on('$ionicView.beforeLeave', function (e, v) {
      $interval.cancel($scope.timer);
      $interval.cancel($scope.timer1);
    })
}]);
/**
 * creator:刘成杰
 * create time:2017/8/4
 * describe：更多
 **/
APP.service('ElectricalMallService', ['$http', 'UrlService', function ($http, UrlService) {
  //个人中心
  this.getTopMsg = function () {
    return $http.get(UrlService.getNewUrl('ELECTRICALMALL_TOP'));
  };
  this.getMiddleMsg = function (provinceId, cityId, districtId, street, position) {
    var params = {
      provinceId: provinceId,
      cityId: cityId,
      districtId: districtId,
      street: street,
      position: position
    };
    return $http.get(UrlService.getNewUrl('HOMEPAGE_MIDDLE'), params);
  }
}]);
