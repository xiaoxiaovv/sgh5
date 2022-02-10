/**
 * Created by apple on 16/12/9.
 */
APP.controller('AllMembersController', ['$scope', '$state', '$stateParams', 'AllMembersService', '$ionicScrollDelegate','PopupService','anchorScroll',
  function ($scope, $state, $stateParams, AllMembersService, $ionicScrollDelegate,PopupService,anchorScroll) {
    /** 变量定义 **/
    $scope.mainuserlist = '';//楼主信息
    $scope.userlist = '';//成员信息
    $scope.topicId = '';//传参搜索
    $scope.input = {
      isinput: ''//绑定输入内容
    };
    $scope.aList=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','#']

    $scope.noDisplay=function(){
      $scope.isDisplay=false;
    }
    //返回
    $scope.toAnchor=function(id){
      $scope.isDisplay=false;
      if(id=='#'){
        anchorScroll.toView('#toOther', true);
      }else{
        anchorScroll.toView('#'+id, true);
      }
    }
    $scope.goBack = function () {
      $state.go('circlePage', {circleId: $scope.topicId});
      $scope.input = {
        isinput: ''//绑定输入内容
      };
    };
    //进入个人主页
    $scope.inPersonalPage = function (code) {
      $scope.isDisplay=false;
      $state.go('personalHomepageHe', {othersId: code});
    };
    //搜索
    $scope.search = function (param) {
      $scope.isDisplay=false;
      var user = {
        'topicId': $scope.topicId,
        'userName': param.target.value
      };
      AllMembersService.getuserlist(user).success(function (response, status, headers, config) {
        $scope.userNum = response.totalCount;
        if (window.cordova) {
          cordova.plugins.Keyboard.close();
        }
        console.log(response)
        $scope.userlist = response.data.list;
        for(var i=0;i<$scope.userlist.length;i++){
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
    $scope.isClick=function(){
      if($scope.isDisplay){
        $scope.isDisplay=false;
      }else{
        $scope.isDisplay=true;
      }
    }
    $scope.toSetAdmin=function(){
      if($scope.isHost=='true'||$scope.superAdmin=='true'){
        $state.go('CircleSetAdmin',{topicId:$scope.topicId})
      }else{
        $scope.isDisplay=false;
        PopupService.showToast('您不是圈主，不能进行此操作');
      }
    }
    $scope.toManageUser=function(){
      if($scope.isAdmin=='true'||$scope.isHost=='true'||$scope.superAdmin=='true'){
        $state.go('manageUser',{topicId:$scope.topicId})
      }else{
         $scope.isDisplay=false;
        PopupService.showToast('您不是圈主或管理员，不能进行此操作');
      }
    }

    /** init方法 **/
    $scope.init = function () {
      $scope.isDisplay=false;
      $scope.aList=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','#']
      $scope.hasmore = false;
      //    获取成员信息
      var user = {
        topicId: $scope.topicId,
        pageSize: 20,
        pageIndex: 1
      };
      $scope.pageIndex = 1;
      $scope.input = {
        isinput: ''//绑定输入内容
      };
      AllMembersService.getuserlist(user).success(function (response) {
        console.log(response)
        $scope.isAdmin=response.data.ifAdmin;
        $scope.isHost=response.data.ifHost;
        $scope.superAdmin=response.data.isManager;
        console.log($scope.isAdmin)
        console.log($scope.isHost)
        $scope.mainuserlist = response.data.list1;
        $scope.mainuser2list = response.data.list2;
        $scope.userNum = response.totalCount;
        $scope.userlist = response.data.list;
        if($scope.userNum>20){
          $scope.hasmore = true;
        }
        // for(var i=0;i<$scope.userlist.length;i++){
        //   if($scope.userlist[i].categoryName=='#'){
        //     $scope.userlist[i].categoryName='toOther';
        //   }
        // }
        // console.log($scope.userlist)
      }).error(function () {
        console.log('获取数据失败');
      });
    };

    //加载更多消息列表
    $scope.loadMoreMember = function () {
      console.log('执行加载');
      $scope.pageIndex += 1;
      var user = {
        topicId: $scope.topicId,
        pageSize: 20,
        pageIndex: $scope.pageIndex
      };
      AllMembersService.getuserlist(user)
        .success(function (response) {
          $scope.mainuserlist = response.data.list1;
          $scope.userNum = response.totalCount;
          if (response.data.list && response.data.list.length != 0) {
            $scope.userlist = $scope.userlist.concat(response.data.list);
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

    /** on 方法 **/
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.topicId = $stateParams.topicId;
      $scope.init();
    });

  }]);

APP.service('AllMembersService', ['$http', 'UrlService', function ($http, UrlService) {
  //获取成员信息
  this.getuserlist = function (config) {
    return $http.post(UrlService.getUrl('GETLISTBYCODE'), config);
  };
}]);
APP.factory('anchorScroll', function () {
    function toView(element, top, height) {
        var winHeight = $(window).height();

        element = $(element);
        height = height > 0 ? height : winHeight / 10;
        $('html, body').animate({
            scrollTop: top ? (element.offset().top - height) : (element.offset().top + element.outerHeight() + height - winHeight)
        }, {
            duration: 200,
            easing: 'linear',
            complete: function () {
                if (!inView(element)) {
                    element[0].scrollIntoView( !! top);
                }
            }
        });
    }

    function inView(element) {
        element = $(element);

        var win = $(window),
            winHeight = win.height(),
            eleTop = element.offset().top,
            eleHeight = element.outerHeight(),
            viewTop = win.scrollTop(),
            viewBottom = viewTop + winHeight;

        function isInView(middle) {
            return middle > viewTop && middle < viewBottom;
        }

        if (isInView(eleTop + (eleHeight > winHeight ? winHeight : eleHeight) / 2)) {
            return true;
        } else if (eleHeight > winHeight) {
            return isInView(eleTop + eleHeight - winHeight / 2);
        } else {
            return false;
        }
    }

    return {
        toView: toView,
        inView: inView
    };
})
