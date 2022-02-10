/**
 * Created by xy on 2016/3/22.
 */
APP.controller('choiceOfGiftsController', ['spacificationsService','$ionicModal','$scope', '$stateParams', '$rootScope', '$state', '$ionicPopup', '$timeout', 'PopupService', 'LoginService', '$http', '$ionicHistory', '$ionicScrollDelegate', '$ionicLoading','UrlService','choiceOfGiftsService',
  function (spacificationsService,$ionicModal,$scope, $stateParams, $rootScope, $state, $ionicPopup, $timeout, PopupService, LoginService, $http, $ionicHistory, $ionicScrollDelegate, $ionicLoading,UrlService,choiceOfGiftsService) {
    /** 变量声明 **/

    $scope.clientSideList = [];
    $scope.isGoBack = false;
    $scope.data = [];
    $scope.postArr = [];
    $scope.num = 0;

    $scope.goBack = function() {

      if($scope.num>0){
        $scope.isGoBack = true;
     //   $ionicHistory.goBack();
      }else{
        $scope.isGoBack = false;
        $ionicHistory.goBack();
      }

    };
    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {//只有ios app 特有的样式
      $scope.paddingtopClass = {
        "margin-top": "16px"
      };
      $scope.paddingtopClasscontent = {
        "top": "60px"
      }
    }else{
      $scope.paddingtopClass = {
        "margin-top": "0px"
      };
      $scope.paddingtopClasscontent = {
        "top": "44px"
      }
    }


    $scope.init = function () {
      choiceOfGiftsService.doInit()
        .success(function (res) {
          if(res.success && res.result!=null){
           // console.log(res)
            $scope.clientSideList = res.result;
          }else{
             PopupService.showToast('获取数据为空或者失败');
          }
        })
    };
    // 修改选项
    $scope.changeType = function (arr,isDefault,index) {
      if(isDefault == 1){
       // console.log('你选了别选了')
        PopupService.showToast('您已选择了此商品');
      }else{
        $scope.num++;
        for(var i=0; i<arr.length; i++) {
          arr[i].isDefault = "0";
        }
        arr[index].isDefault = "1";

      }
    };
    // 返回修改
    $scope.goBackFill = function () {
      $scope.isGoBack = false;
    };
    // 确认
    $scope.clickOk =function () {
      $scope.isGoBack = false;
      $ionicHistory.goBack();
    };
    // 商品规格
    $scope.showDetailInfo = function (pid) {
      $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
      $scope.StoreModal.show();
      spacificationsService.doInit(pid)
        .success(function (response, status, headers, config) {
        //  console.log(response.data);
          if(response.data == null){
            $scope.data = [];
          } else {
            $scope.data = response.data.productAttrs;
          }
        });
    };
   //保存修改
    $scope.preservation = function () {
      $scope.postArr= [];
      for(var i=0;i<$scope.clientSideList.length;i++){
        for(var j=0;j<$scope.clientSideList[i].length;j++){
           if($scope.clientSideList[i][j].isDefault == 1){
            $scope.postArr.push({
              "g":$scope.clientSideList[i][j].group,
              "s":$scope.clientSideList[i][j].spu,
            })
           }
        }
      }
   //   console.log($scope.postArr)
      choiceOfGiftsService.toSubmit($scope.postArr)
        .success(function (res) {
          if(res.success && res.result){
            PopupService.showToast(res.message);
            $ionicHistory.goBack();
          }else{
            PopupService.showToast(res.message);
          }
        })
    };
    // 硬装modal
    $ionicModal.fromTemplateUrl('templates/common/commonGifts.html', {
      scope: $scope,
      animation: 'slide-in-up',
    }).then(function (modal) {
      $scope.StoreModal = modal;
    });

    $scope.closeStoreModal = function () {
      $scope.StoreModal.hide();
    };

    var screenHeight = window.innerHeight;
    var topHeight = 250 + 120;
    var topDis = 87;
    var contentHeight = screenHeight - topHeight + 'px';
    var topDisHeight = topDis + 'px';
    $scope.storeContentHeight = {
      'height': 'auto'
    }
    $scope.contentHeight = {
      'height': contentHeight
      //      'top':topDisHeight
    }

    var storeTop = screenHeight -topHeight +50 +'px' ;
    $scope.storeMsgTop = {
      'top': storeTop
    };
    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      $scope.isGoBack = false;
      $scope.clientSideList = [];
      $scope.data = [];
      $scope.postArr = [];
      $scope.num = 0;
      $scope.init();

    });



  }]);
APP.service('choiceOfGiftsService', ['$http', 'UrlService', function ($http, UrlService) {

  this.doInit = function () {
    return $http({
      method: 'POST',
      url: UrlService.getUrl('GET_GIFTS'),
    });
  };

  this.toSubmit = function (arr) {
   var params ={
     "p":arr
   };
   var url =UrlService.getUrl('PRESERVATION_GIFTS',params);

    return $http({
      headers:{
      },
      method: 'POST',
      url: url,
      data:params,
    });
  };

}]);
