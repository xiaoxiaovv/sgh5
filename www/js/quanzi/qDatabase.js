/**
 * creator:feng.jiang@dhc.com.cn
 * create time:2016/10/11
 * describe：TopicController 测试控制器
 **/

APP.controller('QdatabaseController', ['$scope', '$rootScope', '$ionicHistory', 'QdatabaseService', '$http', '$ionicSlideBoxDelegate','$timeout',
    '$state',
    function ($scope, $rootScope, $ionicHistory, QdatabaseService, $http, $ionicSlideBoxDelegate,$timeout,$state) {
        //    初始化参数
        $scope.quanlist = '';//圈子列表
        $scope.isshow = false;//消息显示
        $scope.topshow = false;//消息小红点
        $scope.xxshow = false;//消息显示隐藏
        $scope.sshow = false;//搜索框显示
        $rootScope.xiaoxis=false;//消息显示隐藏
        $scope.shuxiaoxi = false;//显示消息
        $scope.userlist = '';//用户信息
        $scope.count = 0;//消息数据
        $scope.ziliaolist = '';//资料内容
        $rootScope.msgCount='';//消息数
        $scope.totalCount=0;//帖子总数
        $scope.nogengduo = "没有更多数据";//没有更多
        $scope.storyName = {
            name: ''
        };//搜索内容
        $scope.storyType = "";//标签内容

        /*   右上角菜单 代码  开始*/
        $rootScope.showRightTop = false;//是否显示右上角 菜单
        //$rootScope.msgCount = '' ;//未读消息数
        //显示隐藏右上角菜单
        $scope.toggleMenu = function(){
            $rootScope.showRightTop = !$rootScope.showRightTop;
            $rootScope.xiaoxis=!$rootScope.xiaoxis;
        };
        /*  右上角 菜单代码 结束 */

        //返回
        $scope.goBack = function () {
            $scope.$ionicGoBack();
        };
        //搜索框
        $scope.soushow = function () {
            $scope.sshow = !$scope.sshow;
        };
        //跳转消息
        $scope.gotoxiaoxi = function () {
            $state.go('qzMessageCenter');
            $rootScope.xiaoxis=false;
        };
        //跳转消息
        $scope.toMsgCenter=function(){
            $state.go('qzMessageCenter');
        };
        //点击帖子跳转
        $scope.gototiezi = function (item) {
            $state.go('topicdetails', {noteId: item.id,isShortStory:item.isShortStory});
        };
        //筛选
        $scope.inputclass=function(item){
            $scope.storyType=item.id;
            $scope.init();
        };
         //输入绑定
        $scope.inputname=function(item){
            $scope.storyType='';
            console.log($scope.storyName.name);
            $scope.init();
            $scope.sshow=false;
        };
        //拉动加载数据
        $scope.initdata = function () {
            //数据初始化
            $scope.pageSize = 5;//每页加载的数据条数。
            $scope.pageIndex = 1;//当前页码。
            var config =
            {
                pageSize: $scope.pageSize,
                pageIndex: $scope.pageIndex,
                storyName: $scope.storyName.name,
                storyType: $scope.storyType
            };
            console.log('输入内容'+$scope.storyName.name);
            $timeout(function () {
                QdatabaseService.getziliaolist(config)
                    .success(function (response, status, headers, config) {
                        $scope.ziliaolist = response.data.list;
                        console.log($scope.ziliaolist);
                    $scope.totalCount = response.totalCount;
                    console.log('第几页--'+$scope.pageIndex);
                    console.log('总条数' + $scope.totalCount);
                    return response;
                }).error(function () {
                    console.log('获取数据失败');
                });
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$broadcast('scroll.infiniteScrollComplete');
            },200);
            $scope.isjiazai = $scope.pageSize * $scope.pageIndex;
            $scope.hasMore = $scope.isjiazai > $scope.totalCount;
        };

        $scope.loadData = function () {
            $timeout(function () {
                var isadd=$scope.isjiazai <= $scope.totalCount;
                $scope.isjiazai = $scope.pageIndex  * $scope.pageSize;
                console.log($scope.totalCount);
                console.log($scope.isjiazai);
                $scope.pageIndex = $scope.pageIndex+1;
                console.log('第几页1--'+$scope.pageIndex);
                console.log(isadd);
                if (isadd) {  //修改加载条数
                    console.log('if成立'+$scope.totalCount);
                    var config =
                    {
                        pageSize: $scope.pageSize,
                        pageIndex: $scope.pageIndex
                    };
                    QdatabaseService.getziliaolist(config)
                        .success(function (response, status, headers, config) {
                            $scope.ziliaolist = $scope.ziliaolist.concat(response.data.list);
                            console.log($scope.ziliaolist);
                            $scope.totalCount = response.totalCount;
                        return response;
                    }).error(function () {
                        console.log("查询失败");
                    });
                    $scope.hasMore = isadd;
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    console.log('第几页2--'+$scope.pageIndex);
                    return
                }else {
                    $scope.nogengduo = "没有更多数据";
                    console.log($scope.nogengduo);
                    $scope.hasMore = isadd;
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$broadcast('scroll.infiniteScrollComplete');
            },1000);
        };

        $scope.init = function () {
            //获取分类标签
            QdatabaseService.gettopic()
                .success(function (response, status, headers, config) {
                    $scope.quanlist = response.data;
                    console.log($scope.quanlist);
                    return response;
                });
            //获取消息
            QdatabaseService.getxiaoxi().success(function (response, status, headers, config) {
                $rootScope.msgCount=response.data;
                $scope.topshow = ($rootScope.msgCount!=0);
                console.log('消息数量'+$rootScope.msgCount);
            }).error(function(){
                console.log('获取数据失败');
            });
            //下拉刷新
            $scope.dataList = [];//数据集合
            $scope.hasMore = true;//控制知否加载更多的开关。
            $scope.pageSize = 5;//每页加载的数据条数。
            $scope.pageIndex = 1;//当前页码。
            $scope.isjiazai = 0;
            $scope.totalCount = '';
            $scope.initdata();
        };
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.init();
        })
    }]);


APP.service('QdatabaseService', ['$http', 'UrlService', function ($http, UrlService) {
    //获取消息
    this.getxiaoxi = function () {
        return $http.get(UrlService.getUrl('UNRED_MESSAGE'));
    };
    //获取标签
    this.gettopic = function () {
        return  $http.get('./data/fenlei.json');
    };
    //获取资料库信息
    this.getziliaolist = function (config) {
        return $http.post(UrlService.getUrl('GETUPDATELIST'), config);
    };

}]);
