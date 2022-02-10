/**
 *  start @ zyr 2017.08.02
 */
APP.controller('VisiBroHisController', ['$http', '$scope', '$cacheFactory', 'VisiBroHisService', '$stateParams', '$ionicSlideBoxDelegate',
  '$state', '$ionicSideMenuDelegate', '$cookieStore', 'UserService', '$ionicPopup', '$timeout',
  'LoginService', '$rootScope', '$ionicScrollDelegate', '$ionicModal', 'BannerThemeService',
  '$localstorage', 'VersionService', 'PopupService', 'storeTeamOwnerService',
  function ($http ,$scope, $cacheFactory, VisiBroHisService, $stateParams, $ionicSlideBoxDelegate, $state, $ionicSideMenuDelegate,
            $cookieStore, UserService, $ionicPopup, $timeout, LoginService, $rootScope, $ionicScrollDelegate,
            $ionicModal, BannerThemeService, $localstorage, VersionService, PopupService, storeTeamOwnerService) {
    
    $scope.chooseIndex = 0;
    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
      //只有ios app 特有的样式
      $scope.paddingtopClass = {
        "margin-top": "16px"
      };
      $scope.paddingtopClasscontent = {
        "top": "60px"
      };
    } else {
      $scope.paddingtopClass = {
        "margin-top": "0px"
      };
      $scope.paddingtopClasscontent = {
        "top": "44px"
      };
    }
    //页面的 初始化
    $scope.init = function () {
      // memberId
      $scope.memberId = UserService.getUser().mid;
      // userId
      // $scope.userId = UserService.getUser().userId;  //undefined
      $scope.userId = 27483685;
      $scope.userId = $stateParams.userId;
      $scope.daysType = $stateParams.daysType;
      $scope.hasmore = false;
      // 加载访问记录
      VisiBroHisService.getVisitorBrowHis($scope.userId, $scope.daysType).success(function(response) {
        console.log(response);
        if (response.success==true) {
          $scope.productList = response.data;
        }
        response.data.productsList;
      }).error(function(error) {
        console.log(error);
      })
    };
    $scope.goBack = function () {
      $scope.$ionicGoBack();
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

    $scope.$on('$ionicView.beforeLeave', function (e, v) {
      $scope.watch();
    })

    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      //接受上个页面参数
      $scope.userInfo = storeTeamOwnerService.visitorInfo;
      // 初始化
      $scope.init();
      //是否展示 综合 子选项
      $scope.showComprehensiveSub = false;

     $scope.nowLevel=0;
     $scope.nowLevelIndex=[-1,-1,-1,-1];
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
      $scope.storeId = $localstorage.get('storeId', $rootScope.globalConstant.storeId);//获取用户信息
      $scope.memberId = UserService.getUser().mid;
      $scope.buttonShow = false;//右下角展开图标不打开
      $scope.page = 1;
      $scope.hasmore = false;
    });
  }]);


APP.service('VisiBroHisService', ['$http', 'UrlService', function ($http, UrlService) {
  // 加载浏览记录
  this.getVisitorBrowHis = function (userId, daysType) {
    var params = {
      'userId': userId,
      'daysType': daysType
    };
    return $http.get(UrlService.getUrl('GET_VISI_BROW_HIS'), params);
  };
}]);
