/**
 * 个人主页-设置页面
 * 业务逻辑
 * Created by shantao.wang on 2016/10/12.
 */
APP.controller('mySettingsCtrl', ['$scope','$state', '$ionicPopup', 'mySettingsService', 'personalHomepageMeService','NoteDetailsService',
    function ($scope,$state, $ionicPopup, mySettingsService, personalHomepageMeService,NoteDetailsService) {
        /**
         * 声明变量
         */
        $scope.messageNum=undefined;
        $scope.ifRed=undefined;
        $scope.isDisplay=undefined;
        $scope.myInfo = {};
        $scope.data = {};
        $scope.userId="";
        /**
         * 消息弹窗
         */
        $scope.show=function () {
            $scope.isDisplay=!$scope.isDisplay;
        };
        /**
         * 点击空白消息弹窗消失
         */
        $scope.disappear=function () {
            $scope.isDisplay = false;
        };
        /**
         * 页面跳转方法
         */
        $scope.jumpMsg=function () {
            $state.go('qzMessageCenter');
        };
        $scope.creditDetails = function () {
            $state.go('shop');
        };
        $scope.viewCredit = function () {
            $state.go('quanziRecommend');
        };
        /**
         * 页面初始化方法
         */
        $scope.init = function () {
            $scope.userId="1";
            $scope.isDisplay=false;
            //获取未读消息消息数量
           /* NoteDetailsService.getxiaoxi()
                .success(function (response, status, headers, config) {
                    $scope.messageNum=response.data.count;
                    $scope.ifRed=parseInt(response.data.count);
                })
                .error(function (response, status, headers, config) {
                    alert("网络失败！");
                });*/
            //使用用户信息接口数据
            personalHomepageMeService.getUserData('2', $scope.userId)
                .success(function (response, status, headers, config) {
                    if(response.success==true) {
                        $scope.myInfo = response.data;
                    } else {
                        console.log(response.message);
                    }
                })
                .error(function (response, status, headers, config) {
                    alert("网络失败！");
                });
        };
        /**
         * 申请成为讲师方法
         */
        $scope.apply=function () {
            window.alert('接口还没出来，你申请也没用，略略略……');
        };
        /*$scope.applyForLecturer = function () {
         $scope.data = {};
         var myPopup = $ionicPopup.show({
         template: '<p>讲师自我介绍：</p>' +
         '<textarea ng-model="data.selfIntroduction"></textarea>',
         title: '讲师申请',
         subTitle: '我在哪里',
         scope: $scope,
         buttons: [
         {text: '取消'},
         {
         text: '提交申请',
         type: 'button-positive',
         onTap: function (e) {
         if (!$scope.data.selfIntroduction) {
         e.preventDefault();
         } else {
         return $scope.data.selfIntroduction;
         }
         }
         }
         ]
         });
         myPopup.then(function (res) {
         console.log('Tapped!', res);
         console.log($scope.data.selfIntroduction);
         });
         };*/
        /**
         * 加载该页面前调用页面初始化方法
         */
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.init();
        });

    }]);
/**
 * 个人主页-设置页面服务
 * 获取数据
 */
APP.service('mySettingsService', function () {

});

