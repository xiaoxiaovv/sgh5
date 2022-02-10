/**
 * Created by apple on 16/12/9.
 */
APP.controller('selectAdminController', ['$scope', '$state', '$stateParams', 'selectAdminService', '$ionicScrollDelegate','PopupService','anchorScroll',
  function ($scope, $state, $stateParams, selectAdminService, $ionicScrollDelegate,PopupService,anchorScroll) {
    /** 变量定义 **/
    $scope.mainuserlist = '';//楼主信息
    $scope.userlist = '';//成员信息
    $scope.topicId = '';//传参搜索
    $scope.input = {
      isinput: ''//绑定输入内容
    };
    $scope.aList=[];
    $scope.toAnchor=function(id){
      $scope.isDisplay=false;
      if(id=='#'){
        anchorScroll.toView('#toOther', true);
      }else{
        anchorScroll.toView('#'+id, true);
      }
    }
    $scope.goBack = function () {
      $state.go('CircleSetAdmin',{topicId:$scope.topicId})
    };
    //进入个人主页
    $scope.inPersonalPage = function (code) {
      $state.go('personalHomepageHe', {othersId: code});
    };
    //增加管理员
    $scope.selectUser=function(item){
        for(var i=0;i<$scope.userlist.length;i++){
                if(item.id==$scope.userlist[i].id){
                    if($scope.userlist[i].ischeck=="img/ic_select.png"){
                        $scope.userlist[i].ischeck="img/ic_check.png";
                        $scope.userCode='';
                    }else{
                        $scope.userlist[i].ischeck="img/ic_select.png";
                        $scope.userCode=item.userCode;
                    }
                }else{
                    $scope.userlist[i].ischeck="img/ic_check.png";
                }
        }
    }
    $scope.search = function (param) {
      $scope.isDisplay=false;
      var user = {
        'topicId': $scope.topicId,
        'userName': param.target.value
      };
      selectAdminService.getuserlist(user).success(function (response, status, headers, config) {
        $scope.userNum = response.totalCount;
        if (window.cordova) {
          cordova.plugins.Keyboard.close();
        }
        console.log(response)
        $scope.userlist = response.data.list;
        for(var i=0;i<$scope.userlist.length;i++){
            $scope.userlist[i].ischeck="img/ic_check.png";
        }
        // for(var i=0;i<$scope.userlist.length;i++){
        //   if($scope.userlist[i].categoryName=='#'){
        //     console.log($scope.userlist[i].categoryName)
        //     $scope.userlist[i].categoryName='toOther';
        //   }
        // }
        $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();//返回到此页回滚到顶部
      }).error(function () {
        console.log('获取数据失败');
      });
    };
    $scope.yes=function(){
        if($scope.userCode.length>0){
            var user={
                topicId: $scope.topicId,
                userCode:$scope.userCode,
                indentityStatus:1
            }
            selectAdminService.setAdmin(user).success(function (response) {
                if(response.success){
                    $state.go('CircleSetAdmin',{topicId:$scope.topicId})
                }else{
                    PopupService.showToast(response.message);
                }
            }).error(function () {
                console.log('获取数据失败');
            });
        }else{
            PopupService.showToast('请选择管理员');
        }
        
    }
    //加载更多消息列表
    $scope.loadMoreMember = function () {
      console.log('执行加载');
      $scope.pageIndex += 1;
      var user = {
        topicId: $scope.topicId,
        pageSize: 20,
        pageIndex: $scope.pageIndex
      };
      selectAdminService.getuserlist(user)
        .success(function (response) {
          $scope.userNum = response.totalCount;
          if (response.data.list && response.data.list.length != 0) {
            $scope.userlist = $scope.userlist.concat(response.data.list);
            for(var i=0;i<$scope.userlist.length;i++){
              $scope.userlist[i].ischeck="img/ic_check.png";
            }
            console.log($scope.listData);
            $scope.$broadcast('scroll.infiniteScrollComplete');
            var len = $scope.userlist.length;
            $scope.hasmore = !(len === response.totalCount);
          } else {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.hasmore = false;
            PopupService.showToast('没有更多消息了');
          }
        })
        .error(function () {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
    };


    /** init方法 **/
    $scope.init = function () {
      $scope.aList=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','#']
      $scope.userCode='';
      var user = {
        topicId: $scope.topicId,
        pageSize: 20,
        pageIndex: 1
      };
      $scope.pageIndex = 1;
      $scope.input = {
        isinput: ''//绑定输入内容
      };
      selectAdminService.getuserlist(user).success(function (response) {
        console.log(response)
        $scope.datalist=response;
        $scope.userlist=response.data.list;
        for(var i=0;i<$scope.userlist.length;i++){
            $scope.userlist[i].ischeck="img/ic_check.png";
        }
        $scope.userNum = response.totalCount;
        if($scope.userNum>20){
          $scope.hasmore = true;
        }
        // for(var i=0;i<$scope.userlist.length;i++){
        //   if($scope.userlist[i].categoryName=='#'){
        //     console.log($scope.userlist[i].categoryName)
        //     $scope.userlist[i].categoryName='toOther';
        //   }
        // }
      }).error(function () {
        console.log('获取数据失败');
      });
    };

    /** on 方法 **/
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.topicId = $stateParams.topicId;
      $scope.init();
    });

  }]);

APP.service('selectAdminService', ['$http', 'UrlService', function ($http, UrlService) {
  //获取成员信息
  this.getuserlist = function (config) {
    return $http.post(UrlService.getUrl('GETLISTBYCODE'), config);
  };
  //设置管理员
  this.setAdmin = function (config) {
    return $http.post(UrlService.getUrl('CIRCLE_SET_ADMIN'), config);
  };
}]);

