/**
 * Created by DHC on 17/1/12.
 */
APP.controller('TestPageController', ['$scope', '$rootScope', '$state', '$stateParams', 'TestPageService', 'PopupService', '$timeout',
    function ($scope, $rootScope, $state, $stateParams, TestPageService, PopupService, $timeout) {

        /** 变量定义 **/
        $scope.essentialInfo = {};

        /** 方法定义 **/

        $scope.init = function () {
            $scope.getEssentialInfo();
        };
        //跳到答题页
        $scope.toTestDetails = function () {
          $state.go('testDetails');
        };
        //获取考试基本信息
        $scope.getEssentialInfo = function () {
            var param = {
                courseId:1
            };
            TestPageService.getEssentialInfo(param)
                .success(function (response) {
                    $scope.essentialInfo = response.data.list;
                })
        };
        //返回
        $scope.goBack = function () {
            $scope.$ionicGoBack();
        };

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.init();
        });

    }]);

APP.service('TestPageService', ['$http', 'UrlService', function ($http, UrlService) {
    //获取考试基本信息
    this.getEssentialInfo = function (param) {
        return $http({
            method: 'POST',
            url: UrlService.getUrl('TEST_ESSENTIAL_INFORMATION'),
            data: param
        });
    };
}]);