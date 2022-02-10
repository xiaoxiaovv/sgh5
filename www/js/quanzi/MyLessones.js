/**
 * Created by DHC on 2017/2/5.
 */
APP.controller('MyLessonesController', ['$scope', '$state','MyCirclePagesService',
    function ($scope,$state,MyCirclePagesService) {
        /**
         * 变量声明
         */

        /** 方法 **/

        //返回
        $scope.goBack = function () {
            $scope.$ionicGoBack();
        };
        $scope.init = function () {

        };

        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.init();
        });

    }
]);

APP.service('MyLessonesService', ['$http', 'UrlService', function ($http, UrlService) {
    //我的圈子接口
    this.getMyTopics = function (params) {
        return $http({
            method: 'post',
            url: UrlService.getUrl('GETMYTOPICLIST'),
            data: params
        });
    };
}]);
