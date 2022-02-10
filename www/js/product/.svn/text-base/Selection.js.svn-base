/**
 * Created by 峂峂 on 2016/3/16.
 */
APP.controller('SelectionController', ['GoodsSearchService', '$http', '$scope', 'GoodsService', '$stateParams', '$ionicSlideBoxDelegate',
  '$state', '$ionicSideMenuDelegate', '$cookieStore', 'UserService', '$ionicPopup', '$timeout',
  'LoginService', '$rootScope', '$ionicScrollDelegate', '$ionicModal', 'CommonAddressService', 'BannerThemeService',
  '$localstorage', 'VersionService', 'PopupService','ShopService',
  function (GoodsSearchService, $http ,$scope, GoodsService, $stateParams, $ionicSlideBoxDelegate, $state, $ionicSideMenuDelegate,
            $cookieStore, UserService, $ionicPopup, $timeout, LoginService, $rootScope, $ionicScrollDelegate,
            $ionicModal, CommonAddressService, BannerThemeService, $localstorage, VersionService, PopupService, ShopService) {

    $scope.rightC = {
      'position': 'absolute',
      'content': ' ',
      'height': '8px',
      'width': '8px',
      'border-radius': '100%',
      'background-color': 'red',
      'top': '11px',
      'right': '8px'
    };
    $scope.rightCd = {
      'position': 'absolute',
      'content': ' ',
      'height': '8px',
      'width': '8px',
      'border-radius': '100%',
      'background-color': 'red',
      'top': '31px',
      'right': '8px'
    };

    $scope.iosCss = {
      'width':'52px'
    };

    //地址选择框高度
    var screenHeight=window.innerHeight;
    var topHeight=250+123;
    var contentHeight=screenHeight-topHeight+'px';
    $scope.contentHeight = {
      'height':contentHeight
    }

    /** 变量声明 **/
    // daba STARTA
    $scope.comprehensive = [$rootScope.imgBaseURL+'img/comprehensive_black.png',$rootScope.imgBaseURL+'img/comprehensive_white.png'];//综合 箭头数组
    $scope.comprehensive_index = 1;//综合箭头数组下标
    $scope.arrowState = [$rootScope.imgBaseURL+'img/arrow_state_0.png',$rootScope.imgBaseURL+'img/arrow_state_1.png',$rootScope.imgBaseURL+'img/arrow_state_2.png'];//佣金和价格 箭头数组
    $scope.commission_index = 0;//佣金 箭头数组 下标
    $scope.price_index = 0;//价格 箭头数组 下标
    $scope.filterState = [$rootScope.imgBaseURL+'img/filter_state_0.png',$rootScope.imgBaseURL+'img/filter_state_1.png'];//筛选 图片数组
    $scope.filter_index = 0;//筛选数组下标
    var tabState = ['isHotDesc',['commission','commissionDesc'],'','saleDesc', ['priceDesc','price']];//筛选 接口需要传递的参数 数组
    $scope.comprehensiveSub = ['人气优先'];//综合 子选项数组
    $scope.selectComprehensiveSubIndex = 0;//综合 子选项数组 默认下标
    //daba END
    $scope.gsPlaceholder = '请搜索名字、型号等关键字';
    $scope.memberId = '';
    var sgWeidianMid = 20219251;
    $scope.storeId = $localstorage.get('storeId', sgWeidianMid);
    $scope.provinceId = '16';
    $scope.cityId = '173';
    $scope.region = '';
    $scope.regionId = 2450;
    $scope.streetId = 12036596;//中韩街道
    $scope.panAddressSel = false;
    $scope.hasmore = false;  //是否有更多数据

    /** 地址变量声明 **/
    $scope.addressTitle = '选择地区';
    $scope.dataAdd = null;
    $scope.flag = 'SELECTION_LOCATION';
    $scope.defaultValue = null;
    $scope.level = 0;
    var addressMessage = {};//自动定位地址信息
    var areaValue;
    var areaValueCity;
    //轮播图列表
    $scope.slideImage = [];
    //$scope.typeNameList = ['发现','全部','冰箱','洗衣机','空调','彩电','热水器','厨房电器','冰柜','智能产品','生活家电','水家电','冰吧酒柜','家庭医疗','家用中央空调']
    var typeList = ['faxian', 'all', 'bx', 'xyj', 'kt', 'cd', 'rsq', 'cfdq', 'bg', 'zncp', 'shjd', 'sjd', 'bbjg', 'jtbj', 'sykt', 'sgch','jkqc','sm','shfw'];
    // var tabState = ['saleDesc', 'isHotDesc', '', 'commissionDesc'];
    $scope.data = {};
    $scope.tabNav = 'selection';
    $scope.productList = [];//商品列表
    $scope.brandList = [];  //筛选品牌列表
    $scope.otherList = [];  //其他筛选列表
    $scope.otherState = [false, false];  //其他筛选条件切换状态
    $scope.isCurrent = [[true], [true]];     //其他条件是否选中标识
    $scope.selectedIndex = 0;
    $scope.isFind = true;
    $scope.hasFindData = false;  //发现数据是否获取到本地
    $scope.brandName = '全部';//品牌选中项，默认：全部
    $scope.priceName = '全部';//价格选中项，默认全部：全部
    $scope.otherName = ['全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部','全部', '全部'];//其他筛选条件选中项，默认：全部
    $scope.isFindTab = true;//发现tab是否显示
    //右侧菜单
    $scope.filterParameterArr = ['hasStock', 'all', '0'];//筛选参数数组
    $scope.filterOtherPatam = [];//筛选条件中其他参数暂存数组
    $scope.filterArray = '';
    $scope.filterPrice = {
      min:'',//筛选最低价格
      max:''//筛选最高价格
    };
    $scope.toggleLeft = function () {
      $ionicSideMenuDelegate.toggleLeft();
    };
    //品牌展开状态
    $scope.brand = true;//品牌
    //选择品牌
    $scope.changeBrand = function () {
      $scope.brand = !$scope.brand;
    };
    //选择价格区间
    $scope.changePriceRange = function () {
      $scope.priceRange = !$scope.priceRange;
    };
    //选择其他筛选条件
    $scope.changeOther = function (index) {
      $ionicScrollDelegate.resize();
      $scope.otherState[index] = !$scope.otherState[index];
    };
    //右侧三栏
    //1
    $scope.StockStateArr = ['all', 'hasStock'];//库存状态数组
    $scope.chooseStockState = function (index) {
      $scope.filterParameterArr[0] = $scope.StockStateArr[index];
    };

    //2
    $scope.isBrand = [true, false, false, false, false, false, false, false, false];
    $scope.chooseBrand = function (index) {
      $scope.isBrand = [false, false, false, false, false, false, false, false, false];
      $scope.isBrand[index] = true;
      $scope.filterParameterArr[1] = $scope.brandList[index].id != 0 ? $scope.brandList[index].id : 'all';
      $scope.brandName = $scope.brandList[index].brandName;
    };

    //3
    $scope.isPriceRange = [true, false, false, false, false, false, false];
    $scope.choosePriceRange = function (index) {
      $scope.isPriceRange = [false, false, false, false, false, false, false];
      $scope.isPriceRange[index] = true;
      $scope.filterParameterArr[2] = index;
      switch (index) {
        case 0:
          $scope.priceName = '全部';
          break;
        case 1:
          $scope.priceName = '0～1000';
          break;
        case 2:
          $scope.priceName = '1001～2000';
          break;
        case 3:
          $scope.priceName = '2001～3000';
          break;
        case 4:
          $scope.priceName = '3001～4000';
          break;
        case 5:
          $scope.priceName = '4001～5000';
          break;
        case 6:
          $scope.priceName = '5000以上';
          break;
      }
    };
    //other
    $scope.chooseOtherItem = function (outIndex,index, len) {
      for (var i = 0; i < len; i++) {
        $scope.isCurrent[outIndex][i] = (i === index);
      }
      $scope.filterOtherPatam[outIndex] = $scope.otherList[outIndex].lstAttributeOptions[index].id;
      $scope.otherName[outIndex] = $scope.otherList[outIndex].lstAttributeOptions[index].optionValue;
    };

    //右边栏确定
    $scope.filterEnsure = function () {
      $scope.price_index = 0;//价格 箭头数组 下标
      $scope.commission_index = 0;//佣金 箭头数组 下标
      $scope.comprehensive_index = 0;//综合 数组下标
      if ($scope.filterPrice.min == '' && $scope.filterPrice.max == '') {
        $scope.filterParameterArr[2] = '0';
      } else if ($scope.filterPrice.min == '' && $scope.filterPrice.max != '') {
        $scope.filterParameterArr[2] = 'Undefined' + ';' + $scope.filterPrice.max;
      } else if ($scope.filterPrice.min != '' && $scope.filterPrice.max == '') {
        $scope.filterParameterArr[2] = $scope.filterPrice.min + ';' + 'Undefined';
      } else if ($scope.filterPrice.min > $scope.filterPrice.max && $scope.filterPrice.max != '') {
        PopupService.showToast('最低价不能高于最高价');
        return;
      } else {
        $scope.filterParameterArr[2] = $scope.filterPrice.min + ';' + $scope.filterPrice.max;
      }
      var firstParams = $scope.filterParameterArr.join("@");
      var secondParams = $scope.filterOtherPatam.join(';');
      $scope.filterArray = firstParams + '@' + secondParams;
      tabState[2] = $scope.filterArray;
      $scope.chooseIndex = 2;
      $scope.page = 1;
      $scope.filterModal.hide();
      $scope.productList = [];
      $scope.init();
    };
    //筛选条件重置方法
    $scope.resetFilter = function(){
      $scope.brand = true;
      $scope.brandName = '全部';
      $scope.isBrand = [true, false, false, false, false, false, false, false, false];
      $scope.otherName = ['全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部','全部', '全部'];//其他筛选条件选中项，默认：全部
      $scope.filterParameterArr = ['hasStock', 'all', '0'];
      $scope.filterPrice = {min:'',max:''};
      $scope.otherState = [false, false];
      var len = $scope.otherList.length;
      for (var i = 0; i < len; i++) {
        $scope.filterOtherPatam[i] = 0;
        $scope.isCurrent[i] = [true,false];
      }
      $ionicScrollDelegate.resize();
    };

    //右下角选项按钮
    $scope.isButtonShow = function () {
      $scope.buttonShow = !$scope.buttonShow;
    };

    //发现页前三个商品是否添加到店铺状态
    $scope.changeStateFind = function (sku, sta, index) {
      if (sta == 1) {
        GoodsService.changeChooseStateJia($scope.memberId, sku, '1')
          .success(function (response, status, headers, config) {
            if (response.success == true) {
              if (index == 0) {
                //第一件商品
                $scope.data.firstVo.onShelf = !$scope.data.firstVo.onShelf;
                $scope.showPopup('从店铺上架');
              } else {
                //第二三件商品
                $scope.data.secondList[index - 1].onShelf = !$scope.data.secondList[index - 1].onShelf;
                $scope.showPopup('从店铺上架');
              }
            } else {
              $scope.data.firstVo.onShelf = !$scope.data.firstVo.onShelf;
              $scope.showPopup(response.message);
            }
          });
      } else {
        GoodsService.changeChooseStateDui($scope.memberId, sku)
          .success(function (response, status, headers, config) {
            if (response.success == true) {
              if (index == 0) {
                $scope.data.firstVo.onShelf = !$scope.data.firstVo.onShelf;
                $scope.showPopup('从店铺下架');
              } else {
                $scope.data.secondList[index - 1].onShelf = !$scope.data.secondList[index - 1].onShelf;
                $scope.showPopup('从店铺下架');
              }
            } else {
              $scope.data.firstVo.onShelf = !$scope.data.firstVo.onShelf;
              $scope.showPopup(response.message);
            }
          });
      }
    };


    //发现页面repeat商品添加到店铺状态
    $scope.changeStateFindNormal = function (sku, sta, index) {
      if (sta == 1) {
        GoodsService.changeChooseStateJia(sku, '1')
          .success(function (response, status, headers, config) {
            //$scope.findInit();
            if (response.success == true) {
              $scope.data.normalList[index].onShelf = !$scope.data.normalList[index].onShelf;
              $scope.showPopup('从店铺上架');
            } else {
              $scope.data.normalList[index].onShelf = !$scope.data.normalList[index].onShelf;
              $scope.showPopup(response.message);
            }
          });
      } else {
        GoodsService.changeChooseStateDui(sku)
          .success(function (response, status, headers, config) {
            if (response.success == true) {
              $scope.data.normalList[index].onShelf = !$scope.data.normalList[index].onShelf;
              $scope.showPopup('从店铺下架');
            } else {
              $scope.data.normalList[index].onShelf = !$scope.data.normalList[index].onShelf;
              $scope.showPopup(response.message);
            }
          });
      }
    };


    $scope.showSlideImage = true;//展示轮播图
    //改变添加到店铺状态
    $scope.changeState = function (productId, sta, index) {
      if (sta == 1) {
        GoodsService.changeChooseStateJia(productId, '1')
          .success(function (response, status, headers, config) {
            if (response.success == true) {
              $scope.productList[index].onShelf = true
            }
          });
      } else {
        GoodsService.changeChooseStateDui(productId)
          .success(function (response, status, headers, config) {
            if (response.success == true) {
              $scope.productList[index].onShelf = false
            }
          });
      }
    };
    //商品分类(滚动条)状态切换
    $scope.selectTab = function (index) {
      GoodsService.changeSuccess(typeList[index])
        .success(function (response, status, headers, config) {
          if (response.success == true) {
            GoodsService.getFilterData()
              .success(function (response) {
                if (response.success) {
                  $scope.brandList = response.data.brandList;
                  if (response.data.filterMap != undefined) {
                    $scope.otherList = response.data.filterMap.lstAttributes;
                    $scope.resetFilter();
                  } else {
                    $scope.otherList = [];
                    $scope.resetFilter();
                  }
                }
              });
            $scope.page = 1;
            $scope.selectedIndex = index;
            if ($scope.selectedIndex != 0) {
              $scope.comprehensive_index = 1;//综合箭头数组下标
              $scope.commission_index = 0;//佣金 箭头数组 下标
              $scope.price_index = 0;//价格 箭头数组 下标
              $scope.filter_index = 0;//筛选数组下标
              $scope.showComprehensiveSub = false;
              $scope.chooseIndex = 0;
              $scope.comprehensive_index = 1;//综合 数组下标变化
              $scope.isFind = false;
              $scope.isTab = true;
              $scope.productList = [];
              $scope.requestParam = 'isHotDesc';//请求接口的 参数 默认是 综合下面的 人气优先
              $scope.init();
            } else {
              $scope.isFind = true;
              $scope.isTab = false;
              $scope.findInit();
            }
          }
        });
    };
    //右侧边栏(筛选按钮)触发函数
    $scope.toggleRight = function () {
      $ionicSideMenuDelegate.toggleRight();
    };
    //销量,人气,筛选切换
    $scope.chooseIndex = 0;
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
        $scope.filterModal.show();
        GoodsService.getFilterData()
          .success(function (response) {
            if (response.success) {
              $scope.brandList = response.data.brandList;
              if (response.data.filterMap != undefined) {
                $scope.otherList = response.data.filterMap.lstAttributes;
              } else {
                $scope.otherList = [];
              }
            }
          })
      } else {
        $scope.page = 1;
        $scope.resetFilter();
        // $scope.chooseIndex = index;
        //如果是 综合
        if(index == 0){
          $scope.showComprehensiveSub = !$scope.showComprehensiveSub;//综合 子选项的显示开关
          if($scope.showComprehensiveSub){
            if(ionic.Platform.platform().indexOf('ios') != -1 && window.cordova){
              $scope.comprehensiveSubHeight = {
              "height":window.innerHeight-278+"px",
              "top":"291px"
              }
            }else{
              $scope.comprehensiveSubHeight = {
              "height":window.innerHeight-44+"px",
              "top":"271px"
              }
            }
          }else{
            if(ionic.Platform.platform().indexOf('ios') != -1 && window.cordova){
              $scope.comprehensiveSubHeight = {
              "height":"auto",
              "top":"291px"
              }
            }else{
              $scope.comprehensiveSubHeight = {
              "height":"auto",
              "top":"271px"
              }
            }
          }
          // $scope.comprehensive_index = 1;//综合 数组下标变化 0 1 之间变化
          return;
        }else if(index == 1){//如果是 佣金
          $scope.chooseIndex = index;
          $scope.showComprehensiveSub = false;
          var commission_index = $scope.commission_index==1?0:1;//佣金图片下标 临时变量
          $scope.commission_index = $scope.commission_index==2?1:2;//佣金 箭头数组 下标
          $scope.requestParam = tabState[1][commission_index];//请求接口的 参数 佣金
          console.log($scope.requestParam);
          $scope.comprehensive_index = 0;//综合 数组下标变化
          $scope.price_index = 0;//价格 箭头数组 下标
          $scope.filter_index = 0;//筛选数组下标
          $scope.productList = [];
        }else if(index == 3){//如果是 销量
          $scope.chooseIndex = index;
          $scope.showComprehensiveSub = false;
          $scope.requestParam = 'saleDesc';//请求接口的 参数 销量
          $scope.price_index = 0;//价格 箭头数组 下标
          $scope.commission_index = 0;//佣金 箭头数组 下标
          $scope.comprehensive_index = 0;//综合 数组下标变化
          $scope.filter_index = 0;//筛选数组下标
          $scope.productList = [];
        }else if(index == 4){//如果是 价格
          $scope.chooseIndex = index;
          $scope.showComprehensiveSub = false;
          var price_index = $scope.price_index==1?0:1;//价格下标 临时变量
          $scope.price_index = $scope.price_index==1?2:1;//价格 箭头数组 下标
          $scope.requestParam = tabState[4][price_index];//请求接口的 参数 价格
          $scope.filter_index = 0;//筛选数组下标
          $scope.commission_index = 0;//佣金 箭头数组 下标
          $scope.comprehensive_index = 0;//综合 数组下标变化
          $scope.productList = [];
        }
        $scope.init();
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
      $scope.addressInit($scope.dataAdd,$scope.defaultValue,'SELECTION_LOCATION',0);
    }
    //商品上拉刷新
    $scope.page = 1;
    $scope.loadMore = function () {
      if ($scope.selectedIndex == 0) {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      } else {
        $scope.page += 1;
        $scope.loadMoreProducts('1', $scope.provinceId, $scope.cityId, $scope.regionId, $scope.streetId, $scope.page, 5, typeList[$scope.selectedIndex], $scope.memberId, $scope.chooseIndex == 2 ? $scope.filterArray : $scope.requestParam, 1, true)
      }
    };
    //加载商品列表
    $scope.loadMoreProducts = function (pholder, provinceId, cityId, districtId, streetId, pageIndex, pageSize, productCateStr, memberId, filterData, fromType, noLoading) {
      GoodsService.loadMoreProducts(pholder, provinceId, cityId, districtId, streetId, pageIndex, pageSize, productCateStr, memberId, filterData, fromType, noLoading)
        .success(function (response, status, headers, config) {
          console.log(response);
          if (response.data.productsList != null && response.data.productsList != undefined && response.data.productsList.length != 0) {

            $scope.productList = $scope.productList.concat(response.data.productsList);
            $scope.$broadcast('scroll.infiniteScrollComplete');
            var len = $scope.productList.length;
            $scope.hasmore = !(len === response.data.storeItemsCounts);
          } else {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.hasmore = false;
            $scope.productList = [];
            //$scope.showPopup('没有更多商品了');
          }
        })
    };

    //发现页面 初始化
    $scope.findInit = function () {
      $scope.selectedIndex = 0;
      $scope.hasmore = false;
      $scope.isFind = true;
      $scope.isTab = false;
      //var SeData = JSON.parse(window.localStorage.getItem('SeData'));
      //if(SeData){
      //  $scope.data = {};
      //  $scope.hasFindData = true;
      //  $scope.data = SeData;
      //  $scope.$broadcast('scroll.infiniteScrollComplete');
      //  return;
      //}
      GoodsService.doInitFaxian(1, $scope.provinceId, $scope.cityId, $scope.regionId, $scope.streetId, $scope.storeId, false)
        .success(function (response, status, headers, config) {
          $scope.data = {};
          $scope.hasFindData = true;
          $scope.data = response;
          $scope.$broadcast('scroll.infiniteScrollComplete');
          //window.localStorage.setItem('SeData',JSON.stringify(res));
        });
    };


    function initNew() {
      $scope.selectedIndex = 0;
      $scope.hasmore = false;
      $scope.isFind = true;
      $scope.isTab = false;
      GoodsService.getAddress()
        .success(function (response) {
          var obj = eval(response.data);
          $scope.provinceId = obj[0].provinceId;
          $scope.cityId = obj[0].cityId;
          $scope.regionId = obj[0].areaId;
          $scope.streetId = obj[0].streetId;
          var regionIndex = obj[0].regionName.indexOf('/');
          $scope.region = obj[0].regionName.substr(0, regionIndex);
          getProductList($scope.memberId, $scope.provinceId, $scope.cityId, $scope.regionId, $scope.streetId, $scope.page, 5, 1, 'saleDesc', 'all', false);
        });
    }


    //除了发现页面的 初始化
    $scope.init = function () {
      $scope.hasmore = false;
      $scope.page = 1;
      $scope.loadMoreProducts('1', $scope.provinceId, $scope.cityId, $scope.regionId, $scope.streetId, $scope.page, 5, typeList[$scope.selectedIndex], $scope.memberId, $scope.chooseIndex == 2 ? $scope.filterArray : $scope.requestParam, 1, false)
    };

    //地址初始化
    $scope.addressInit = function (defaultValue,data,flag,level) {
      $scope.addressTipFlag=false;
      $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
      $scope.addressTitle = '选择地区';
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
        console.log($scope.nowLevelIndex);
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
           console.log($scope.nowLevel);
         })
        .error(function (err) {
          PopupService.showToast('获取地址信息失败！');
        })
      }
    }
    //重新选择的下边框
    $scope.bottomBorder = {
      'border-bottom':"2px solid red"
    }
    $scope.provinceFlag=false;
    $scope.cityFlag=false;
    $scope.areaFlag=false;
    $scope.selectFlag=true;
    $scope.provinceDis=false;
    $scope.cityDis=false;
    $scope.areaDis=false;
    //返回重新选择省
    $scope.provinceSel = function(){
      $scope.addressInit(null,null,'SELECTION_LOCATION',0);
      $scope.selectCity='';
      $scope.selectArea='';
      $scope.provinceFlag=true;
      $scope.selectFlag=false;
      $scope.provinceDis=true;
      $scope.cityDis=false;
      $scope.areaDis=false;
    }
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
		      $scope.level= $scope.levelArea;
          $scope.addressTip='正在获取地址信息...';
          $scope.addressTipFlag=true;
          $scope.dataAdd="";
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
      }else if ($scope.level > -4) {//xyz添加远端获取     市区
        $scope.selectCity = $scope.defaultValue['text-2'];
        $scope.provinceFlag=false;
        $scope.cityFlag=false;
        $scope.selectFlag=true;
        $scope.provinceDis=true;
        $scope.cityDis=true;
        $scope.areaDis=false;
        if($scope.level == -3){ //区
          $scope.selectArea= item.text;
          $scope.cityFlag=false;
          $scope.areaFlag=false;
          $scope.selectFlag=true;
          $scope.provinceDis=true;
          $scope.cityDis=true;
          $scope.areaDis=true;
          $scope.areaTop=$ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
        }else{//市
          $scope.cityTop=$ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
        }
        ah = $scope.level*-1;
        $scope.addressTip='正在获取地址信息...';
        $scope.addressTipFlag=true;
        GoodsService.getLocationList(item.value,ah).success(function (response) {
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
            GoodsService.getLocationList(areaValue,2).success(function (response) {
            $scope.dataAdd = response.data;
            $scope.addressTipFlag=false;
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

    $scope.getPosition = function () {
      if ($rootScope.globalConstant.autoPosition == '定位中···') {
        return;
      }
      addressMessage = CommonAddressService.getAddressInfo();
      var detailAddress = addressMessage.regionName + '/' + addressMessage.streetName;
      GoodsService.addAddress(addressMessage.provinceId, addressMessage.cityId, addressMessage.areaId, detailAddress, addressMessage.streetId)
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
          // $scope.$ionicGoBack($scope.level - 1);
        })
        $scope.addressModal.hide();
    };
    $scope.goBack = function () {
      $scope.$ionicGoBack();
    };


    $scope.getSlideImage = function () {
      //获取轮播图信息
      GoodsService.getSlideImage().
        success(function (response, status, headers, config) {
          $scope.slideImage = [{}, {}, {}];
          $scope.slideImage = response.data.bannersList;
          $scope.memberId = response.data.memberId;
          $scope.storeId = response.data.storeId;
          $ionicSlideBoxDelegate.$getByHandle('selection_slider').update();
        });
    };

    //点击轮播图执行方法
    $scope.slideImageClick = function (index) {
      if ($scope.slideImage[index].type == '1') {
        if ($scope.slideImage[index].activityType == '主题活动') {
          $state.go('bannerTheme', {bannerId: $scope.slideImage[index].bannerId,platformType:$scope.slideImage[index].platformType});
        } else if ($scope.slideImage[index].activityType == '日常活动') {
          BannerThemeService.getBannerTheme($scope.slideImage[index].bannerId,$scope.slideImage[index].platformType)
            .success(function (response) {
              $state.go('bannerDaily', {bannerId: $scope.slideImage[index].bannerId, layout: response.data.layout,platformType:$scope.slideImage[index].platformType});
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
    $scope.getAddress = function () {
      GoodsService.getAddress().
        success(function (response, status, headers, config) {
          if (response.data == null) {
            getCurrentPosition();
            $scope.findInit();
          }
          else {
            var obj = eval(response.data);
            $scope.provinceId = obj[0].provinceId;
            $scope.cityId = obj[0].cityId;
            $scope.regionId = obj[0].areaId;
            $scope.streetId = obj[0].streetId;
            var regionIndex = obj[0].regionName.indexOf('/');
            $scope.region = obj[0].regionName.substr(0, regionIndex);
            $scope.findInit();
          }
        });
    };
    //alert效果函数
    $scope.showPopup = function (message) {
      var myPopup = $ionicPopup.show({
        template: message
      });
      $timeout(function () {
        myPopup.close();
      }, 1000);
    };

    //筛选modal
    $ionicModal.fromTemplateUrl('templates/product/SelectionFilterModal.html', {
      scope: $scope,
      animation: 'slide-in-left',
      backdropClickToClose: false
    }).then(function (modal) {
      $scope.filterModal = modal;
    });

    $scope.closeModal = function () {
      $scope.filterModal.hide();
    };

    //窗口modal
    $ionicModal.fromTemplateUrl('templates/common/CommonLocation.html', {
      scope: $scope,
      animation: 'slide-in-up',
    }).then(function(modal) {
      $scope.addressModal = modal;
    });
    $scope.closeAddressModal = function () {
      $scope.addressModal.hide();
    };

    //修改地址广播回调
    $rootScope.$on('SELECTION_LOCATION', function (event, data) {
      console.log(typeList[$scope.selectedIndex]);
      $scope.region = data['text-3'];
      $scope.streetName = data['text-4'];
      var detailAddress = $scope.region + '/' + $scope.streetName;
      $scope.provinceId = data['value-1'];
      $scope.cityId = data['value-2'];
      $scope.regionId = data['value-3'];
      $scope.streetId = data['value-4'];
      $scope.panAddressSel = true;
      $scope.page = 1;
      GoodsService.addAddress($scope.provinceId, $scope.cityId, $scope.regionId, detailAddress, $scope.streetId)
        .success(function (response, status, headers, config) {
          if (response.success) {
            // getProductList($scope.memberId, $scope.provinceId, $scope.cityId, $scope.regionId, $scope.streetId, $scope.page, 5, 1, 'saleDesc', 'all', false);
            $scope.selectTab($scope.selectedIndex);
          }
        });
    });
    function getCurrentPosition() {//获取定位地址
      var addressMessage = CommonAddressService.getAddressInfo();
      if (addressMessage) {
        $scope.provinceId = addressMessage.provinceId;
        $scope.cityId = addressMessage.cityId;
        $scope.regionId = addressMessage.areaId;
        $scope.streetId = addressMessage.streetId;
        $scope.region = addressMessage.regionName;
      } else {
        $scope.provinceId = '16';
        $scope.cityId = '173';
        $scope.region = '崂山区';
        $scope.regionId = '2450';
        $scope.streetId = '12036596'
      }
    }

    function getProductList(memberId, provinceId, cityId, districtId, streetId, pageIndex, pageSize, fromType, filterData, productCateStr, noLoading) {
      GoodsService.getSelectionProducts(memberId, provinceId, cityId, districtId, streetId, pageIndex, pageSize, fromType, filterData, productCateStr, noLoading)
        .success(function (response) {
          if (response.data.is_show_find) {
            $scope.isFind = true;
            $scope.isTab = false;
            $scope.isFindTab = true;
            $scope.hasmore = false;
            $scope.hasFindData = true;
            $scope.selectedIndex = 0;
            $ionicScrollDelegate.scrollTop();
            $scope.data = response.data;
          } else {
            $scope.isFind = false;
            $scope.isTab = true;
            $scope.isFindTab = false;
            $scope.hasmore = false;
            $scope.selectedIndex = 1;
            $scope.chooseIndex = 0;
            if (response.data.productsList != null && response.data.productsList != undefined && response.data.productsList.length != 0) {
              $scope.productList = response.data.productsList;
              $scope.$broadcast('scroll.infiniteScrollComplete');
              var len = $scope.productList.length;
              $scope.hasmore = !(len === response.data.storeItemsCounts);
            } else {
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.hasmore = false;
              $scope.productList = [];
            }
          }
        });
    }

    $scope.$on('$ionicView.beforeLeave', function (e, v) {
      $scope.watch();
    })

    //关闭综合子选项
    $scope.closeComprehensiveSub = function(){
      $scope.showComprehensiveSub = !$scope.showComprehensiveSub;
    }
    //选择综合 子选项
    $scope.selectComprehensiveSub = function(index,$event){
      $event.stopPropagation();
      // if($scope.selectComprehensiveSubIndex != index&&index == 0){
      //   $scope.requestParam = 'isHotDesc';//请求接口的 参数 人气优先
      // }else if($scope.selectComprehensiveSubIndex != index&&index == 1){
      //   $scope.requestParam = '';//请求接口的 参数 热评
      // }
      if(index == 0){
        $scope.requestParam = 'isHotDesc';//请求接口的 参数 人气优先
      }
      $scope.selectComprehensiveSubIndex = index;
      $scope.showComprehensiveSub = !$scope.showComprehensiveSub;
      $scope.chooseIndex = 0;
      $scope.productList = [];
      $scope.comprehensive_index = 1;//综合 数组下标变化 0 1
      $scope.commission_index = 0;//佣金 箭头数组 下标
      $scope.price_index = 0;//价格 箭头数组 下标
      $scope.filter_index = 0;//筛选数组下标
      $scope.init();
    }

    $scope.$on('$ionicView.beforeLeave', function (e, v) {
      $scope.watch();
    })

    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      //是否展示 综合 子选项
      $scope.showComprehensiveSub = false;

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

      $scope.isIos = ionic.Platform.isIOS()?true:false;
      if(ionic.Platform.platform().indexOf('ios') != -1 && window.cordova){
        $scope.isIos1 = true;
      }else{
        $scope.isIos1 = false;
      };
      GoodsSearchService.defaultSearch()
      .success(function (response) {
          $scope.gsPlaceholder = response.data.hot_word;
      });

     //未读消息数量和最新消息
      ShopService.getMessage()
        .success(function(response){
          if(response.data.count>0){
            $scope.flagNum=true;
          }else{
            $scope.flagNum=false;
          }
        })
      if(v.direction=='back'){
        return;
      }
      $scope.storeId = $localstorage.get('storeId', $rootScope.globalConstant.storeId);//获取用户信息
      $scope.memberId = UserService.getUser().mid;
      $scope.buttonShow = false;//右下角展开图标不打开
      $scope.page = 1;
      $scope.hasmore = false;
      /*************add by wangshuang     STARTA******************/
      $scope.buttonBuyerShow = false;//买家中心图标初始化
      $scope.isBuyer = LoginService.getRole();//判断用户角色信息；0为买家；1为卖家
      /*************add by wangshuang     END******************/
      $scope.getSlideImage();//获取轮播图信息
      initNew();
      //地址
      $scope.addressInit($scope.dataAdd,$scope.defaultValue,'SELECTION_LOCATION',0);
      //if ($scope.panAddressSel == false) {
      //  $scope.storeId = $localstorage.get('storeId', $rootScope.globalConstant.storeId);//获取用户信息
      //  $scope.memberId = UserService.getUser().mid;
      //  $scope.buttonShow = false;//右下角展开图标不打开
      //  /*************add by wangshuang   买家中心图标初始化  STARTA******************/
      //  $scope.buttonBuyerShow = false;
      //  /*************add by wangshuang   买家中心图标初始化  END******************/
      //  $scope.getSlideImage();//获取轮播图信息
      //  if ($scope.selectedIndex == 0) { //初始化时是否为发现页面
      //    $scope.isFind = true;
      //    $scope.isTab = false;
      //    $scope.getAddress();
      //    $scope.page = 1;
      //    $scope.hasmore = false;
      //  }
      //} else {
      //  if ($scope.selectedIndex != 0) {
      //    $ionicScrollDelegate.scrollTop();
      //    $scope.isFind = false;
      //    $scope.page = 1;
      //    $scope.init();
      //  }
      //}
      //$scope.panAddressSel = false;
      //VersionService.checkVersion();
      //
      ///*************add by wangshuang   判断用户角色  STARTA******************/
      //$scope.isBuyer = LoginService.getRole();//判断用户角色信息；0为买家；1为卖家
      ///*************add by wangshuang   判断用户角色  END******************/
    });

    $scope.$on('$destroy', function () {
      $scope.filterModal.remove();
      $scope.addressModal.remove();
    });
  }]);
