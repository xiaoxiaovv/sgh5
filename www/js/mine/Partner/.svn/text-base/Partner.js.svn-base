APP.controller('PartnerController', ['$ionicHistory','$scope','$state', 'PartnerService', '$ionicPopup', '$timeout',
  '$ionicActionSheet', 'UserService', 'MyStoreService', 'CommonAddressService', '$stateParams', '$localstorage', '$rootScope',
  'PopupService', 'LoginService','$ionicScrollDelegate','$ionicModal','GoodsService',
  function ($ionicHistory,$scope,$state, PartnerService, $ionicPopup, $timeout, $ionicActionSheet, UserService, MyStoreService,
            CommonAddressService, $stateParams, $localstorage, $rootScope, PopupService, LoginService,$ionicScrollDelegate,$ionicModal,GoodsService) {
    // 返回
    $scope.goBack = function() {
      $scope.$ionicGoBack();
    }
    
    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) { //只有ios app 特有的样式
      $scope.paddingtopClass = {
        "margin-top": "16px"
      };
      $scope.paddingtopClasscontent = {
        "top": "60px"
      }
    } else {
      $scope.paddingtopClass = {
        "margin-top": "0px"
      };
      $scope.paddingtopClasscontent = {
        "top": "44px"
      }
    }

    $scope.arrowState = [$rootScope.imgBaseURL+'img/Group@2x.png',$rootScope.imgBaseURL+'img/Group1@2x.png',$rootScope.imgBaseURL+'img/Group4@2x.png'];//开店时间 箭头数组
    $scope.openStoreTime_index = 1;
    tabState = [['asc','desc'],'asc', 'asc'];//筛选 接口需要传递的参数 数组
    $scope.title = $stateParams.title == 'partner'?'合伙人':'团队';
    // class控制
    $scope.authenIndex = 0;
    
    //变量定义
    $scope.hasmore = false;
    $scope.front = $stateParams.front;//0:从店铺预览页跳转，  1：从选品页跳转
    $scope.shareStoreId = $stateParams.shareStoreId;
    $scope.isBuyer = LoginService.getRole();//判断用户角色信息；0为买家；1为卖家
    $scope.userId = UserService.getUser().mid;//用户Id
    var memberId = '';//用户Id
    var searchType = '0';
    
    $scope.pagesort = 'startTime';
    $scope.order = 'asc';
    $scope.memberId = $stateParams.memberId;
    // 合伙人 false 团队 true
    $scope.cascade = $stateParams.title == 'partner'?false: true;
    //已认证 true 未认证 false
    $scope.isAuthenticated = true;
    $scope.init = function () {
      $scope.pageNumber = 1;
      $scope.pageSize = 10;
      getPartnerTeam($scope.memberId, $scope.cascade, $scope.pageNumber, $scope.pageSize, $scope.pagesort, $scope.order, false);
    }
    $scope.authInit = function() {
      $scope.authpageNumber = 1;
      $scope.pageSize = 10;
      getAuthen($scope.memberId, $scope.cascade, $scope.isAuthenticated, $scope.authpageNumber, $scope.pageSize, $scope.pagesort, $scope.order, false);
    }

    $scope.$on('$ionicView.beforeEnter', function (e,v) {
      $ionicScrollDelegate.scrollTop();
      $scope.chooseIndex = 0;
      $scope.partnerChildren = [];
      $scope.openStoreTime_index = 1;
      $scope.authenIndex = 0;
      $scope.memberId = $stateParams.memberId;
      $scope.init();
      // $scope.authInit();
    });
    // 获取数据  @zyr
    function getPartnerTeam(memberId, cascade, pageNumber, pageSize, sort, order, noLoading) {
      PartnerService.partnerTeamSearch({memberId: memberId, cascade: cascade, pageNumber: pageNumber, pageSize: pageSize, sort: sort, order: order, noLoading: noLoading}).success(function(response){
        if (response.success == true) {
          console.log(response.data);
          if (response.data.children != null && response.data.children != undefined && response.data.children.length != 0) {
            // 列表
            $scope.partnerChildren = $scope.partnerChildren.concat(response.data.children);
            // // 已认证 人数
            // $scope.authenticatedNum = response.data.authenticatedNum;
            // // 未认证 人数
            // $scope.UnAuthenticatedNum = response.data.total - response.data.authenticatedNum;
            $scope.$broadcast('scroll.infiniteScrollComplete');
            var len = $scope.partnerChildren.length;
            console.log(len);
            $scope.hasmore = !(len === response.data.total);
            console.log('是不是真的'+ $scope.hasmore);
            $scope.pageNumber += 1;
          } else {
            console.log('走的这')
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.hasmore = false;
             $scope.partnerChildren = [];
            //$scope.showPopup('没有更多商品了');
          }
        }
      })
    }
    // 实名认证
    function getAuthen(memberId, cascade, isAuthenticated, pageNumber, pageSize, sort, order, noLoading) {
      PartnerService.anthenSearch({memberId: memberId, cascade: cascade, isAuthenticated: isAuthenticated, pageNumber: pageNumber, pageSize: pageSize, sort: sort, order: order, noLoading: noLoading}).success(function(response){
        if (response.success == true) {
          console.log(response.data);
          if (response.data.children != null && response.data.children != undefined && response.data.children.length != 0) {
            // 列表
            $scope.partnerChildren = $scope.partnerChildren.concat(response.data.children);
            // 已认证 人数
            $scope.authenticatedNum = response.data.authenticatedNum;
            // 未认证 人数
            $scope.UnAuthenticatedNum = response.data.unAuthenticatedNum;
            $scope.$broadcast('scroll.infiniteScrollComplete');
            var len = $scope.partnerChildren.length;
            console.log(len);
            $scope.hasmore = !(len === response.data.total);
            console.log('是不是真的'+ $scope.hasmore);
            $scope.authpageNumber += 1;
          } else {
            console.log('走的这')
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.hasmore = false;
            $scope.partnerChildren = [];
            //$scope.showPopup('没有更多商品了');
          }
        }
      })
    }
    //上拉加载
    $scope.loadMore = function () {
      if ($scope.chooseIndex ==1 ) {
         getAuthen($scope.memberId, $scope.cascade, $scope.isAuthenticated, $scope.authpageNumber, $scope.pageSize, $scope.pagesort, $scope.order, true);
       } else {
        getPartnerTeam($scope.memberId, $scope.cascade, $scope.pageNumber, $scope.pageSize, $scope.pagesort, $scope.order, true);
       }
    };

    //点击 开店时间，实名认证，盟主舵主 tab
  $scope.chooseTab = function (index) {
    if(($scope.chooseIndex == index&&index==1)||($scope.chooseIndex == index&&index==2)){
      console.log(index);
      return;
    }
    //切换时 先把页面滚动到顶部
    $ionicScrollDelegate.scrollTop();
     $scope.page = 2;
    // $scope.chooseIndex = index;
    //如果是 开店时间
    if(index == 0){  
      console.log(index);
      $scope.chooseIndex = index;
       var openStoreTime_index = $scope.openStoreTime_index==1?0:1;// 开店时间图标的 index
      $scope.openStoreTime_index = $scope.openStoreTime_index==1?2:1;//开店时间 图标
      $scope.partnerChildren = [];
      // 开店时间
      $scope.pagesort = 'startTime';
      $scope.order = $scope.openStoreTime_index==1?'asc':'desc';
      $scope.init();
    }else if(index == 1){//如果是 实名认证
      console.log(index);
      $scope.authenIndex = 0;
      $scope.lianXC = false;
      $scope.chooseIndex = index;
      $scope.openStoreTime_index = 0;
      $scope.partnerChildren = [];
      $scope.order = $scope.openStoreTime_index==0?'asc':'desc';
      // 是否认证
      // $scope.order = 'asc';
      $scope.pagesort = 'isAuthenticated';
      $scope.isAuthenticated = true;
      $scope.authInit();

    }else if(index == 2){//如果是 盟主舵主
      console.log(index);
      $scope.openStoreTime_index = 0;
      $scope.lianXC = false;
      $scope.chooseIndex = index;
      // $scope.showComprehensiveSub = false;
      $scope.partnerChildren = [];
      $scope.filterParams = 'saleDesc';
      $scope.order = $scope.openStoreTime_index==0?'desc':'asc';
       // 盟主舵主
      // $scope.order = 'desc';
      $scope.pagesort = 'teamLevelOrder';
      $scope.init();
    }
    //请求
    
  }
  // 认证和 未认证 切换
  $scope.chooseAnthen = function(type) {
    if (type == 0) {
      //已认证
      $scope.isAuthenticated = true;
      $scope.pagesort = 'isAuthenticated';
      $scope.authenIndex = 0;
      $scope.partnerChildren = [];
      $scope.authInit();
    } else if (type == 1) {
      // 未认证
      $scope.isAuthenticated = false;
      $scope.pagesort = 'isAuthenticated';
      $scope.authenIndex = 1;
      $scope.partnerChildren = [];
      $scope.authInit();
    }
  }
}]);


APP.service('PartnerService', ['$http', 'UrlService', function ($http, UrlService) {
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
  // 查询
  this.partnerTeamSearch = function(params) {
    var url = UrlService.getUrl('GET_PARTNER_TEAM');
    return $http.get(url,params);
  }
  // 实名认证 查询
  this.anthenSearch = function(params) {
    var url = UrlService.getUrl('GET_PARTNER_TEAM');
    return $http.get(url,params);
  }
}]);
