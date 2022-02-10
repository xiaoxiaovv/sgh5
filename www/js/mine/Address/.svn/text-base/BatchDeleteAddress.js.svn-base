/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016/3/16
 * describe：AddressController 测试控制器
 **/
APP.controller('BatchDeleteAddressController', ['BatchAddressService','$ionicHistory','$ionicPopup', '$scope', 'PopupService', '$rootScope',
  function (BatchAddressService,$ionicHistory,$ionicPopup, $scope, PopupService, $rootScope) {
    /** 变量声明 **/
    $scope.goBack = function(){
      $ionicHistory.goBack();
      return;
    }
    $scope.init = function () {
      $scope.image= [];//存放 是否选中地址的图片
      $scope.chooseAddressNum = 0;//已选择的 要删除的地址数量
      BatchAddressService.getAddressList()
        .success(function (response, status, headers, config) {
          if (response.success) {
            console.log(response);
            $scope.addressArray = response.data;//渲染地址列表的数组
            for (var i = 0,length = $scope.addressArray.length; i < length; i++) {
              $scope.image[i] = "img/ic_check.png";
            }
          }
        });
    };
    //单独选择删除地址
    $scope.selectDeleteAddress = function(index){
      //如果是没被选中
      if($scope.image[index].indexOf('check')!=-1){
        $scope.image[index] = "img/ic_select.png";
        $scope.chooseAddressNum++;
        // $scope.isChooseAddress = true;
      }else{
        $scope.image[index] = "img/ic_check.png";
        $scope.chooseAddressNum--;
      }
      if($scope.chooseAddressNum==$scope.image.length){
        $scope.isSelectAllAddress = true;
      }else{
        $scope.isSelectAllAddress = false;
      }
    };
    //全选地址
    $scope.selectAllAddress = function(){
      //如果是全选状态
      if($scope.isSelectAllAddress){
        for (var i = 0,length = $scope.addressArray.length; i < length; i++) {
        $scope.image[i] = "img/ic_check.png";
      }
      $scope.chooseAddressNum = 0;
      $scope.isSelectAllAddress = false;
      }else{
        for (var i = 0,length = $scope.addressArray.length; i < length; i++) {
        $scope.image[i] = "img/ic_select.png";
      }
      $scope.isSelectAllAddress = true;
      $scope.chooseAddressNum = $scope.image.length;
      }
    }
    //点击删除按钮
    $scope.batchDelete = function(){
      // for(var i = 0,length = $scope.image.length; i < length; i++){
      //   if($scope.image[i].indexOf('select')!=-1){
      //     $scope.isChooseAddress = true;
      //   }
      // }
      if($scope.chooseAddressNum==0){
        PopupService.showToast("请选择要删除的地址");
        return;
      }
      var confirmPopup = $ionicPopup.confirm({
        template: '您确认要删除吗?',
        cancelText: '否',
        cssClass:'confirmDelete',
        okText: '是'
      });
      confirmPopup.then(function(res) {
        if(res) {
          var addrIds = '';//删除地址的 id 多个地址的话 id用 逗号 分开
          var addrIdsArray = [];
          for(var i = 0,length = $scope.image.length; i < length; i++){
            //如果是被选中的地址
            if($scope.image[i].indexOf('select')!=-1){
              addrIdsArray.push($scope.addressArray[i].id);
            }
          }
          addrIds = addrIdsArray.join(',');
          var params = {
            m:addrIds
          };
          BatchAddressService.batchDelete(params)
            .success(function(response){
              if(response.success){
                console.log('删除地址成功');
                //如果所有的地址都删除后 返回到上一个页面
                if($scope.isSelectAllAddress){
                  $ionicHistory.goBack();
                  return;
                }
                $scope.init();
              }else{
                console.log('删除地址失败');
              }
            })
        } else {
          console.log('You are not sure');
        }
      });
    }
    $scope.$on('$ionicView.beforeEnter', function () {
      if(window.cordova&&ionic.Platform.platform().indexOf('ios') != -1){
        $scope.isIosAndInApp = true;
      }else{
        $scope.isIosAndInApp = false;
      }
      if(window.cordova){
        $scope.isApp = true;
      }else{
        $scope.isApp = false;
      }
      //  ios APP样式
      if($scope.isIosAndInApp){
        $scope.iosStyleOne = {
          "padding":"64px 0 90px 0"
        };
        $scope.iosStyleTwo = {
          "top":"20px"
        }
      };
      //app 里的样式
      if($scope.isApp){
        $scope.bottomDivHeight = {
          "height":"40px"
        }
      }else{
        $scope.bottomDivHeight = {
          "height":"120px"
        }
      }
      // $scope.isChooseAddress = false;//是否选择了要删除的地址
      $scope.chooseAddressNum = 0;//已选择的地址数量
      $scope.isSelectAllAddress = false;//是否选择了全部的地址
      $scope.init();
    });
  }]);

APP.service('BatchAddressService', ['$http', 'UrlService', function ($http, UrlService) {

  this.getAddressList = function () {
    return $http({
      method:'POST',
      url:UrlService.getUrl('ADDRESS_INIT')
    });
  };
  this.batchDelete = function(params){
    return $http({
      method:'POST',
      url:UrlService.getUrl('BATCH_DELETE_ADDRESS'),
      params:params
    });
  }
}]);
