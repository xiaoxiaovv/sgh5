/**
 * Created by lenovo on 2017-7-27.
 */

APP.controller('userSearchController', ['$rootScope','$scope', 'userSearchService', 'UserService', 'UrlService','PopupService','$state','$stateParams',
  function ($rootScope,$scope, userSearchService, UserService, UrlService, PopupService,$state,$stateParams) {

    $scope.memberId = UserService.getUser().mid; // id
    $scope.page=1;       //默认页数
    $scope.pageSize=20;  //默认条数 用户
    $scope.pageNum=10;  //默认条数  团队

    $scope.searchValue='';  //用户名称
    $scope.selectedIndex=$stateParams.selectedIndex;  //合伙人 用户


    $scope.Reps=function (str) {
      if(str){
        return str.substring(0,1);
      }
    };


    //回退
    $scope.backToLastView = function(){
      $scope.$ionicGoBack();
    }
    var Focus = document.querySelector('#focus');

    //时间戳转时间
    $scope.timeFun=function(nS) {
      return new Date(parseInt(nS) * 1000).toLocaleString().replace(/\//g, "-").replace(/日/g, " ");
    };
    $scope.commonFun=function (cascade) {
      userSearchService.teamSearch($scope.memberId,$scope.searchValue,cascade,$scope.page,$scope.pageNum)
        .success(function (response) {
          console.log(response)
          if(response.success){
            $scope.searchResults = response.data.children;
            if($scope.searchResults.length==0){
              $scope.noSearchResults = true;
            }else{
              $scope.noSearchResults = false;
            }
            $scope.hasMore = $scope.searchResults.length < response.data.total;
          }else{
            console.log('拿不到数据')
          }
        });
    };
    // 点击搜索
    $scope.searchConnection = function(){
      if($scope.searchValue == ''){
        PopupService.showToast('请填写搜索内容');
        return;
      }else{
        if($scope.selectedIndex==0){ // 合伙人
          console.log('搜1')
          $scope.cascade=false;
          $scope.commonFun($scope.cascade);
        }
        if($scope.selectedIndex==1){ // 团队
          console.log('搜2')
          $scope.cascade=true;
          $scope.commonFun($scope.cascade);
         /* userSearchService.teamSearch($scope.memberId,$scope.searchValue,$scope.cascade,$scope.page,$scope.pageNum)
            .success(function (response) {
              if(response.success){
                $scope.searchResults = response.data.children;
                console.log(response)
                if($scope.searchResults.length==0){
                  $scope.noSearchResults = true;
                }else{
                  $scope.noSearchResults = false;
                }
                $scope.hasMore = $scope.searchResults.length < response.data.total;
              }else{
                 console.log('拿不到数据')
              }

            });*/
        }
        if($scope.selectedIndex==2){ //用户
          console.log('搜3')
          userSearchService.getSearchResults($scope.memberId,$scope.page,$scope.pageSize,$scope.searchValue)
            .success(function(response){
              if(response.success){
                $scope.searchResults = response.data.rows;
                if($scope.searchResults.length==0){
                  $scope.noSearchResults = true;
                }else{
                  $scope.noSearchResults = false;
                }
                $scope.hasMore = $scope.searchResults.length < response.data.total;
              }else{
                console.log('拿不到数据')
              }

            });
        }

      }
    };
    //上拉时加载更多
    $scope.loadMore = function(){
      console.log('上拉了')
      $scope.page++;
      userSearchService.getSearchResults($scope.memberId,$scope.page,$scope.pageSize,$scope.searchValue)
        .success(function(response){
          if(response.success){
            if($scope.searchResults.length < response.data.total){
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.hasMore = true;//没有更多的数据了 无法上拉加载更多数据
              $scope.searchResults = $scope.searchResults.concat(response.data.rows);
            }else{
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.hasMore = false;
            }

          }
        })
    }
    $scope.$on('$ionicView.enter', function() {
      if($scope.direction=='back'){
        Focus.blur();
      }else{
        $scope.searchValue = '';
        $scope.searchResults = [];
        setTimeout(
          function(){
            try{
              Focus.focus();
            }
            catch(e){

            }
          }, 200);
      }
    });

    $scope.$on('$ionicView.beforeEnter', function (e,v) {
      $scope.direction = v.direction;
      //合伙人或人脉的 页数
      $scope.page = 1;
      //合伙人或人脉 每页的展示人数
      $scope.pageSize = 20;  //用户
      $scope.pageNum = 10;   //团队
      $scope.hasMore = true;
      $scope.placeHolder = '请输入用户名称';

    })
  }]);

APP.service('userSearchService', ['$http', 'UrlService','CalculateStrLength', function ($http, UrlService,CalculateStrLength) {
  this.getSearchResults = function(memberId,page,pageSize,searchValue){
    var param = {
      memberId:memberId,
      pageNumber:page,
      pageSize:pageSize,
      userName:searchValue,
      noLoading: true
    }
    return $http.get(UrlService.getUrl('TEAM_USERS'),param);
  };

  this.teamSearch=function (memberId,keyword,cascade,page,pageSize) {
    var param = {
      memberId:memberId,
      keyword:keyword,
      cascade:cascade,
      pageNumber:page,
      pageSize:pageSize,
      noLoading: true
    }
    return $http.get(UrlService.getUrl('TEAM_SUPERVISE'),param);
  }



}]);
