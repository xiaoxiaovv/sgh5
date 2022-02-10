APP.controller('TeamController', ['$ionicHistory','$scope', 'TeamService', '$ionicPopup', '$timeout',
  '$ionicActionSheet', 'UserService', 'MyStoreService', 'CommonAddressService', '$stateParams', '$localstorage', '$rootScope',
  'PopupService', 'LoginService','$ionicScrollDelegate','$ionicModal','GoodsService',
  function ($ionicHistory,$scope, TeamService, $ionicPopup, $timeout, $ionicActionSheet, UserService, MyStoreService,
            CommonAddressService, $stateParams, $localstorage, $rootScope, PopupService, LoginService,$ionicScrollDelegate,$ionicModal,GoodsService) {
    // 返回按钮
    $scope.goBack = function() {
      $scope.$ionicGoBack();
    }
    $scope.history = [];
    $scope.hShow = true;
    $scope.hShowB = true;
    var bv = "";
    var bvv = "aicxyz";
    var jl = localStorage.getItem("historys");
    // daba STARTA
    // @zyr $scope.comprehensive = ['img/comprehensive_black.png','img/comprehensive_white.png'];//综合 箭头数组
    // @zyr$scope.comprehensive_index = 0;//综合箭头数组下标
    // @zyr$scope.arrowState = ['img/arrow_state_0.png','img/arrow_state_1.png','img/arrow_state_2.png'];//佣金和价格 箭头数组
    $scope.arrowState = [$rootScope.imgBaseURL+'img/Group@2x.png',$rootScope.imgBaseURL+'img/Group1@2x.png',$rootScope.imgBaseURL+'img/Group4@2x.png'];//开店时间 箭头数组
    $scope.openStoreTime_index = 1;//开店时间 默认下标
    // @zyr$scope.commission_index = 0;//佣金 箭头数组 下标
    // @zyr$scope.price_index = 0;//价格 箭头数组 下标
    // @zyr$scope.filterState = ['img/filter_state_0.png','img/filter_state_1.png'];//筛选 图片数组
    // @zyr$scope.filter_index = 0;//筛选数组下标
    // @zyrvar tabState = ['isHotDesc',['commission','commissionDesc'],'','saleDesc', ['priceDesc','price']];//筛选 接口需要传递的参数 数组
    tabState = [['openTime','openTimeDesc'],'authDesc', 'leaderDesc'];//筛选 接口需要传递的参数 数组
    // @zyr$scope.comprehensiveSub = ['人气优先'];//综合 子选项数组
    // @zyr$scope.selectComprehensiveSubIndex = 0;//综合 子选项数组 默认下标
    //daba END
    //变量定义
    $scope.isShowUp = false;
    $scope.isIos = false;
    $scope.screenWidth = window.screen.width;
    $scope.front = $stateParams.front;//0:从店铺预览页跳转，  1：从选品页跳转
    $scope.shareStoreId = $stateParams.shareStoreId;
    $scope.isBuyer = LoginService.getRole();//判断用户角色信息；0为买家；1为卖家
    $scope.userId = UserService.getUser().mid;//用户Id
    var memberId = '';//用户Id
    var searchType = '0';
    /******************筛选功能相关变量定义start****************/
    $scope.brand = false;//品牌展开标志
    $scope.brandName = '全部';//品牌选中项，默认：全部
    $scope.brandList = [];  //筛选品牌列表
    //$scope.otherList = [];  //其他筛选列表
    $scope.filterParameterArr = ['hasStock', 'all', '0'];//筛选参数数组
    //$scope.filterOtherPatam = [];//筛选条件中其他参数暂存数组
    //$scope.isCurrent = [[true], [true]];     //其他条件是否选中标识
    $scope.StockStateArr = ['all', 'hasStock'];//库存状态数组
    $scope.filterParams = '';//请求接口筛选条件参数
    /******************筛选功能相关变量定义end****************/
    var u = navigator.userAgent;

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
    $scope.clearLocal = function(){
      localStorage.removeItem("historys");
      $scope.hShow = false;
      $scope.hShowB = true;
    };

    $scope.$on('$ionicView.beforeEnter', function (e,v) {
      $ionicScrollDelegate.scrollTop();
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
        $scope.page = 2;//上拉加载起始页
        $scope.front = $stateParams.front;//0:从店铺预览页跳转，  1：从选品页跳转
        //获取用户信息
        if ($stateParams.shareStoreId) {
          memberId = $stateParams.shareStoreId;
        } else {
          memberId = UserService.getUser().mid;
        }
        $scope.searchGoodsName = {
          name: ''
        };
      }
    });
    //上拉加载
    $scope.loadMore = function () {
      if ($scope.front == 0) {
        TeamService.myStoreSearch($scope.page, '5', memberId, $scope.searchGoodsName.name, searchType, provinceId, cityId, districtId, streetId, 2, $scope.filterParams, true)
          .success(function (response, status, headers, config) {
            if ((response.productsList != undefined) && (response.productsList.length != 0)) {
              $scope.searchData = $scope.searchData.concat(response.productsList);
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.page += 1;
            } else {
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.hasmore = false;
            }
          });
      } else if ($scope.front == 1) {
        TeamService.myStoreSearch($scope.page, '5', memberId, $scope.searchGoodsName.name, searchType, provinceId, cityId, districtId, streetId, 1, $scope.filterParams, true)
          .success(function (response, status, headers, config) {
            if ((response.productsList != undefined) && (response.productsList.length != 0)) {
              $scope.searchData = $scope.searchData.concat(response.productsList);
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.page += 1;
            } else {
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.hasmore = false;
            }
          });
      }
    };

    //点击 搜索结果筛选类别
  $scope.chooseTab = function (index) {
      if(($scope.chooseIndex == index&&index==1)||($scope.chooseIndex == index&&index==2)){
        console.log(index);
        return;
      }
        //切换时 先把页面滚动到顶部
        $ionicScrollDelegate.scrollTop();
         $scope.page = 2;
        // $scope.chooseIndex = index;
        //如果是 综合
        if(index == 0){  //开店时间
          // $scope.showComprehensiveSub = !$scope.showComprehensiveSub;//综合 子选项的显示开关
          
          // $scope.comprehensive_index = 1;//综合 数组下标变化 0 1 之间变化

          // $scope.lianXC = false;
          // $scope.chooseIndex = index;
          // var commission_index = $scope.commission_index==1?0:1;//佣金图片下标 临时变量
          // $scope.commission_index = $scope.commission_index==2?1:2;//佣金 箭头数组 下标
          // $scope.filterParams = tabState[1][commission_index];//请求接口的 参数 佣金
          // $scope.comprehensive_index = 0;//综合 数组下标变化
          // $scope.price_index = 0;//价格 箭头数组 下标
          // $scope.filter_index = 0;//筛选数组下标
          // $scope.searchData = [];



          console.log(index);
          $scope.chooseIndex = index;
          var openStoreTime_index = $scope.openStoreTime_index==1?0:1;//佣金图片下标 临时变量
          $scope.openStoreTime_index = $scope.openStoreTime_index==1?2:1;//佣金 箭头数组 下标
          $scope.filterParams = tabState[1][openStoreTime_index];//请求接口的 参数 佣金
          $scope.searchData = [];
          // return;
        }else if(index == 1){//如果是 实名认证
          console.log(index);
          $scope.lianXC = false;
          $scope.chooseIndex = index;
          $scope.openStoreTime_index = 0;
          // $scope.showComprehensiveSub = false;
          // var commission_index = $scope.commission_index==1?0:1;//佣金图片下标 临时变量
          // $scope.commission_index = $scope.commission_index==0?1:0;//佣金 箭头数组 下标
          // $scope.filterParams = tabState[1][commission_index];//请求接口的 参数 佣金
          // $scope.comprehensive_index = 0;//综合 数组下标变化
          // $scope.price_index = 0;//价格 箭头数组 下标
          // $scope.filter_index = 0;//筛选数组下标
          $scope.searchData = [];
        }else if(index == 2){//如果是 销量
          console.log(index);
          $scope.openStoreTime_index = 0;
          $scope.lianXC = false;
          $scope.chooseIndex = index;
          // $scope.showComprehensiveSub = false;
          $scope.filterParams = 'saleDesc';//请求接口的 参数 销量
          // $scope.price_index = 0;//价格 箭头数组 下标
          // $scope.commission_index = 0;//佣金 箭头数组 下标
          // $scope.comprehensive_index = 0;//综合 数组下标变化
          // $scope.filter_index = 0;//筛选数组下标
          $scope.searchData = [];
        }/*else if(index == 4){//如果是 价格
          $scope.lianXC = false;
          $scope.chooseIndex = index;
          $scope.showComprehensiveSub = false;
          var price_index = $scope.price_index==1?0:1;//价格下标 临时变量
          $scope.price_index = $scope.price_index==1?2:1;//价格 箭头数组 下标
          $scope.filterParams = tabState[4][price_index];//请求接口的 参数 价格
          $scope.filter_index = 0;//筛选数组下标
          $scope.commission_index = 0;//佣金 箭头数组 下标
          $scope.comprehensive_index = 0;//综合 数组下标变化
          $scope.searchData = [];
        }*/
        TeamService.myStoreSearch('1', '5', memberId, $scope.searchGoodsName.name, searchType, provinceId, cityId, districtId, streetId, $scope.front == 1?1:2, $scope.filterParams,false)
          .success(function (response, status, headers, config) {
            if (!response.productsList) {
              $scope.emptySearch = true;
              $scope.hShow = true;
              $scope.hotWordShow = true;
              $scope.hShowB = false;
              $scope.showTab = false;
              // $scope.showPopup('无相关搜索');
              // $scope.searchData = response.productsList;
            } else {
              $scope.emptySearch = false;
              $scope.searchData = response.productsList;
              $scope.showTab = true;
              $scope.hasmore = true;
            }
          })
      
    };
    //关闭综合子选项
    $scope.closeComprehensiveSub = function(){
      $scope.showComprehensiveSub = !$scope.showComprehensiveSub;
    }
    //选择综合 子选项
    $scope.selectComprehensiveSub = function(index,$event){
      $event.stopPropagation();
      if(index == 0){
        $scope.filterParams = 'isHotDesc';//请求接口的 参数 人气优先
      }
      $scope.lianXC = false;
      $scope.selectComprehensiveSubIndex = index;
      $scope.showComprehensiveSub = !$scope.showComprehensiveSub;
      $scope.chooseIndex = 0;
      $scope.productList = [];
      $scope.comprehensive_index = 1;//综合 数组下标变化 0 1
      $scope.commission_index = 0;//佣金 箭头数组 下标
      $scope.price_index = 0;//价格 箭头数组 下标
      $scope.filter_index = 0;//筛选数组下标
      TeamService.myStoreSearch('1', '5', memberId, $scope.searchGoodsName.name, searchType, provinceId, cityId, districtId, streetId, $scope.front == 1?1:2, $scope.filterParams,false)
          .success(function (response, status, headers, config) {
            if (!response.productsList) {
              $scope.emptySearch = true;
              $scope.hShow = true;
              $scope.hotWordShow = true;
              $scope.hShowB = false;
              $scope.showTab = false;
              // $scope.showPopup('无相关搜索');
              // $scope.searchData = response.productsList;
            } else {
              console.log(response)
              $scope.emptySearch = false;
              $scope.searchData = response.productsList;
              $scope.showTab = true;
              $scope.hasmore = true;

              $scope.comprehensive_index = 1;
              $scope.chooseIndex = 0;
              $scope.showComprehensiveSub = false;
            }
          })
    }
    //库存状态筛选方法
    $scope.chooseStockState = function (index) {
      $scope.filterParameterArr[0] = $scope.StockStateArr[index];
    };
    $scope.$on('$destroy', function () {
      $scope.filterModal.remove();
    });
    /******************筛选功能相关方法处理end****************/
  }]);


APP.service('TeamService', ['$http', 'UrlService', function ($http, UrlService) {
  //选品页搜索
  this.selectionSearch = function (pageIndex, pageSize, memberId, keyword, searchType, provinceId, cityId, districtId, streetId, noLoading) {
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
      'noLoading': noLoading
    };
    return $http.get(UrlService.getUrl('SEARCHGOODS_INIT'), params);
  };
  //店铺预览页搜索
  this.myStoreSearch = function (pageIndex, pageSize, memberId, keyword, searchType, provinceId, cityId, districtId, streetId, fromType,filterData, noLoading) {
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
      'filterData':filterData,
      'noLoading': noLoading
    };
    return $http.get(UrlService.getUrl('SEARCH_GOODS'), params);
  };
}]);
