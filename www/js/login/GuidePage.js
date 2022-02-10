/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016/5/12
 * describe：引导页Controller
 **/

APP.controller('GuidePageController', ['$scope', 'UserService', '$state', 'LoginService', '$localstorage',
    function($scope, UserService, $state, LoginService, $localstorage) {

    $scope.$on('$ionicView.beforeEnter', function () {

            // 设置为游客 ROLE_INFO =undefined;
            //$localstorage.set('ROLE_INFO', 'undefined');  //退出登录才重置用户身份

      //if (UserService.isUserLogin()) {
      //  $scope.isBuyer = LoginService.getRole();
      //  if ($scope.isBuyer == "0") {
      //    $state.go('directPurchase');
      //  } else {
      //    $state.go('shop')
      //  }
      //}
    });
  }]);

