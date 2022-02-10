/**
 * Created by apple on 16/12/9.
 */
APP.controller('CircleSetAdminController', ['$scope', '$state', '$stateParams', 'CircleSetAdminService', '$ionicScrollDelegate','PopupService',
  function ($scope, $state, $stateParams, CircleSetAdminService, $ionicScrollDelegate,PopupService) {
    /** 变量定义 **/
    $scope.mainuserlist = '';//楼主信息
    $scope.userlist = '';//成员信息
    $scope.topicId = '';//传参搜索
    $scope.input = {
      isinput: ''//绑定输入内容
    };

    $scope.goBack = function () {
      $state.go('allMembers', {topicId:$scope.topicId});
      $scope.input = {
        isinput: ''//绑定输入内容
      };
    };
    //进入个人主页
    $scope.inPersonalPage = function (code) {
      $state.go('personalHomepageHe', {othersId: code});
    };
    //增加管理员
    $scope.addAdmin=function(userCode){
        $state.go('selectAdmin',{topicId:$scope.topicId})
        // var user={
        //     topicId: $scope.topicId,
        //     userCode:userCode,
        //     indentityStatus:1
        // }
        // CircleSetAdminService.setAdmin(user).success(function (response) {
        //     console.log(response)
        //     $scope.datalist=response;
        //     $scope.userlist=response.data.list;
        //     $scope.mainuser2list = response.data.list2;
        //     console.log($scope.mainuser2list)
        // }).error(function () {
        //     console.log('获取数据失败');
        // });
    }
    //搜索
    $scope.search = function (param) {
      $scope.isDisplay=false;
      var user = {
        'topicId': $scope.topicId,
        'userName': param.target.value
      };
      CircleSetAdminService.getuserlist(user).success(function (response, status, headers, config) {
        $scope.userNum = response.totalCount;
        if (window.cordova) {
          cordova.plugins.Keyboard.close();
        }
        $scope.datalist=response;
        console.log(response);
        $scope.userlist=response.data.list;
        $scope.mainuser2list = response.data.list2;
        for(var i=0;i<$scope.userlist.length;i++){
          console.log($scope.userlist[i].categoryName)
          if($scope.userlist[i].categoryName=='#'){
            console.log($scope.userlist[i].categoryName)
            $scope.userlist[i].categoryName='toOther';
          }
        }
        $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();//返回到此页回滚到顶部
      }).error(function () {
        console.log('获取数据失败');
      });
    };
    //减去管理员
    $scope.decAdmin=function(userCode){
        var user={
            topicId: $scope.topicId,
            userCode:userCode,
            indentityStatus:0
        }
        CircleSetAdminService.setAdmin(user).success(function (response) {
            if(response.success){
                $scope.getCircleUser();
            }
        }).error(function () {
            console.log('获取数据失败');
        });
    }

    //圈子成员列表
    $scope.getCircleUser=function(){
        var user = {
            topicId: $scope.topicId,
        };
        CircleSetAdminService.getuserlist(user).success(function (response) {
            console.log(response)
            $scope.datalist=response;
            $scope.userlist=response.data.list;
            $scope.mainuser2list = response.data.list2;
            console.log($scope.mainuser2list)
        }).error(function () {
            console.log('获取数据失败');
        });
    }

    /** init方法 **/
    $scope.init = function () {
      //    获取成员信息
      $scope.pageIndex = 1;
      $scope.input = {
        isinput: ''//绑定输入内容
      };
      $scope.getCircleUser();
      
    };



    /** on 方法 **/
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.topicId = $stateParams.topicId;
      $scope.init();
    });

  }]);

APP.service('CircleSetAdminService', ['$http', 'UrlService', function ($http, UrlService) {
  //获取成员信息
  this.getuserlist = function (config) {
    return $http.post(UrlService.getUrl('CIRCLE_CIRCLEPERSON'), config);
  };
  //设置管理员
  this.setAdmin = function (config) {
    return $http.post(UrlService.getUrl('CIRCLE_SET_ADMIN'), config);
  };
}]);

