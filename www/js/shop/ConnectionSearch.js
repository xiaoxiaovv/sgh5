/**
 靠谱大巴
 2017年04月24日17:02:14
 **/
APP.controller('ConnectionSearchController', ['$scope', 'ConnectionSearchService', 'UserService', 'UrlService','PopupService','$state','$stateParams',
  function ($scope, ConnectionSearchService, UserService, UrlService, PopupService,$state,$stateParams) {

     $scope.backToLastView = function(){
      $scope.$ionicGoBack();
    }
    var Focus = document.querySelector('#focus');
    
    $scope.gotoPartnerDetail = function(memberId,relationshipType){
      if(relationshipType == 1){
        $state.go('partnerDetail',{ownerId:memberId});
      }else{
        $state.go('connectionDetail',{ownerId:memberId});
      }
    }
 //对 数组或对象每一项的某个字段长度 做限制
  function limitArrLength(originalContent,limitLength){
    for (var i in originalContent){
      originalContent[i].storeName = ConnectionSearchService.limitStrLength(originalContent[i].storeName,limitLength);
    }
  }
    $scope.searchConnection = function(){
        if($scope.searchValue == ''){
            PopupService.showToast('请填写搜索内容');
            return;
        }else{
            ConnectionSearchService.getSearchResults($scope.searchType,$scope.searchValue,$scope.pageIndex,$scope.pageNum)
                .success(function(response){
                    $scope.searchResults = response.data.partners;
                    limitArrLength($scope.searchResults,$scope.storeNameListLength);
                    if($scope.searchResults.length==0){
                      $scope.noSearchResults = true;
                    }else{
                      $scope.noSearchResults = false;
                    }
                    console.log($scope.searchResults);
                })
        }
    }
    //上拉时加载更多的合伙人或人脉 信息
    $scope.loadMore = function(){
      $scope.pageIndex++;
      ConnectionSearchService.getSearchResults($scope.searchType,$scope.searchValue,$scope.pageIndex,$scope.pageNum)
        .success(function(response){
          console.log(response);
          if(response.success){
            // $scope.searchResults = response.data.partners;
            if(response.data.partners.length<$scope.pageNum){
              $scope.hasMore = false;//没有更多的数据了 无法上拉加载更多数据
              limitArrLength(response.data.partners,$scope.storeNameListLength);
              $scope.searchResults = $scope.searchResults.concat(response.data.partners);
              $scope.$broadcast('scroll.infiniteScrollComplete');
            }else{
              $scope.hasMore = true;
              limitArrLength(response.data.partners,$scope.storeNameListLength);
              $scope.searchResults = $scope.searchResults.concat(response.data.partners);
              $scope.$broadcast('scroll.infiniteScrollComplete');
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
      $scope.searchType = $stateParams.searchType;//搜索类型 1：合伙人 2：人脉
      $scope.storeNameListLength = Math.floor((window.innerWidth-82)/17*2-1);//合伙人或人脉列表里店铺名称 可以放的字符长度 汉字占两个字符 字母占一个
      //合伙人或人脉的 页数
      $scope.pageIndex = 0;
      //合伙人或人脉 每页的展示人数
      $scope.pageNum = 10;
      $scope.hasMore = true;
      if($scope.searchType==1){
        $scope.placeHolder = '请输入合伙人信息';
      }else{
        $scope.placeHolder = '请输入人脉信息';
      }

    })
  }]);

APP.service('ConnectionSearchService', ['$http', 'UrlService','CalculateStrLength', function ($http, UrlService,CalculateStrLength) {
 this.getSearchResults = function(relationshipType,keyword,pageIndex,pageSize){
   var param = {
     relationshipType:relationshipType,
     keyword:keyword,
     pageIndex:pageIndex,
     pageSize:pageSize
   }
  return $http.get(UrlService.getUrl('CONNECTION_INDEX'),param);
 }
 this.limitStrLength = function(str,limitLength){
  return CalculateStrLength.limitStrLength(str,limitLength);
 }
}]);
