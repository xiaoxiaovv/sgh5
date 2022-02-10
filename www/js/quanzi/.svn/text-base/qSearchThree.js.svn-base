/**
 * creator:feng.jiang@dhc.com.cn
 * create time:2016/12/9
 * describe：TopicController 测试控制器
 **/

APP.controller('qSearchThreeController', ['$scope', '$rootScope', '$ionicHistory', 'qSearchThreeService', '$http', '$ionicSlideBoxDelegate', '$state',
    '$timeout','UserService','$stateParams','PopupService','$ionicScrollDelegate',
    function ($scope, $rootScope, $ionicHistory, qSearchThreeService, $http, $ionicSlideBoxDelegate, $state,$timeout,
              UserService,$stateParams,PopupService,$ionicScrollDelegate) {
        //    初始化参数
        $scope.userlist='';//用户列表
        $scope.topiclist='';//圈子列表
        $scope.huatilist='';//话题列表
        $scope.pageIndex='';//请求页数
        $scope.pageSize=3;//请求每页的条数
        $scope.showmore='';//空内容改善
        $scope.usershow='';//用户加载更多
        $scope.topicshow='';//圈子加载更多
        $scope.tiezishow='';//帖子加载更多
        $scope.input={
            isinput:''
        };//大家都在搜
        $scope.keywords =$scope.input.isinput;//接受上一页的内容



        //返回
        $scope.goBack = function () {
            $scope.input.isinput='';
            $state.go('qSearch');
        };
        //跳转别人主页
        $scope.gotoothers = function (item) {
            console.log('跳转他人主页code'+item.memberId);
            $state.go('personalHomepageHe', {othersId: item.memberId});
        };
        //跳转别人主页
        $scope.storygotoothers = function (item) {
            console.log('跳转他人主页code'+item.userCode);
            $state.go('personalHomepageHe', {othersId: item.userCode});
        };
        //点击帖子跳转
        $scope.gototiezi = function (item) {
            //$state.go('topicdetails', {huatiid: item.id});
            $state.go('noteDetails', {noteId: item.id,isShortStory:item.isShortStory});
        };
        //跳转到圈子
        $scope.gotoquanezi=function(item){
            $state.go('circlePage', {circleId:item.id});
        };
        //跳转到标签搜索
        $scope.goqSearchBiao= function () {
            $scope.keywords = $scope.input.isinput;
                $state.go('qSearchBiao',{keywords: $scope.keywords});
        };
         //跳转到用户搜索
        $scope.BgoqSearchUser = function () {
            $scope.keywords =$scope.input.isinput;
                $state.go('qSearchUser',{keywords: $scope.keywords});
        };
        //键盘搜索
        $scope.search=function(param){
          if(window.cordova){
            cordova.plugins.Keyboard.close();
          }
            $scope.input.isinput=param.target.value;
            $scope.init();
        };
         //跳转到话题搜索
        $scope.BgoqSearchTie= function () {
            //$cordovaKeyboard.close();
            $scope.keywords =$scope.input.isinput;
                $state.go('qSearchTie',{keywords: $scope.keywords});
        };
        //加入圈子
        $scope.joinCircle = function (item) {
            $scope.itemTopicName = item.topicName;
            var ids = {
                ids: item.id
            };
            qSearchThreeService.joinTopic(ids)
                .success(function (response) {
                    if (response.success == true) {
                        item.isJoin = 1;
                        $scope.init();
                        $scope.inCircle = true;
                        $timeout(function () {
                            $scope.inCircle = false;
                        }, 1000);
                    } else if (response.errorCode==-2000){
              PopupService.showToast(response.message);
              $rootScope.loginIsAccord2 = true;
            }
                }).error(function(){
                    PopupService.showToast('加入失败');
                });
        };
        /**
         *   页面初始化数据
         **/
        $scope.init = function () {
            $scope.keywords = $scope.input.isinput;
            $scope.pageIndex=1;//请求页数
            $scope.pageSize=3;//请求每页的条数
            //获取用户信息
            var user={
                pageSize: $scope.pageSize,
                pageIndex: $scope.pageIndex,
                keywords:$scope.keywords
            };
            console.log($scope.keywords);
            qSearchThreeService.getuser(user).success(function(response, status, headers, config){
                    $scope.userlist = response.data.list;
                $scope.usershow=(response.totalCount>3);
                    console.log($scope.userlist);
                return response;
            }).error(function () {
                console.log('获取数据失败');
            });
            //获取圈子信息
            var topic={
                pageSize: $scope.pageSize,
                pageIndex: $scope.pageIndex,
                keywords:$scope.keywords
            };
            console.log($scope.keywords);
            qSearchThreeService.gettopic(topic).success(function(response, status, headers, config){
                    $scope.topiclist = response.data.list;
                $scope.topicshow=(response.totalCount>3);
                    console.log($scope.topiclist);
                return response;
            }).error(function () {
                console.log('获取数据失败');
            });
            //获取话题信息
            var huati={
                pageSize: $scope.pageSize,
                pageIndex: $scope.pageIndex,
                keywords:$scope.keywords
            };
            console.log($scope.keywords);
            qSearchThreeService.gethuati(huati).success(function(response, status, headers, config){
                    $scope.huatilist = response.data.list;
                $scope.tiezishow=(response.totalCount>3);
                    console.log($scope.huatilist);
                return response;
            }).error(function () {
                console.log('获取数据失败');
            });
            $ionicScrollDelegate.scrollTop();
        };
        /**
         *   on方法
         **/
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.showmore=false;
            $scope.input={
                isinput:$stateParams.keywords
            };
            $scope.keywords = $scope.input.isinput;
            console.log($scope.keywords);
            $scope.init();
            $scope.showmore=true;
        });

    }]);


APP.service('qSearchThreeService', ['$http', 'UrlService', function ($http, UrlService) {
    //获取用户信息
    this.getuser= function (config) {
        return $http.post(UrlService.getUrl('GETUSERBYCONDITION'),config);
    };
    //获取圈子信息
    this.gettopic= function (config) {
        return $http.post(UrlService.getUrl('GETTOPICBYCONDITION'),config);
    };
    //获取话题信息
    this.gethuati = function (config) {
        return $http.post(UrlService.getUrl('GETSTORYBYCONDITION'),config);
    };
    //加入圈子方法
    this.joinTopic = function (param) {
        return $http({
            method: 'POST',
            url: UrlService.getUrl('JOIN_TOPIC'),
            data: param
        });
    };

}]);
