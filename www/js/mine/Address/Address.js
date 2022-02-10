/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016/3/16
 * describe：AddressController 测试控制器
 **/
APP.controller('AddressController', ['$ionicHistory', '$ionicPopup', 'ChangeAddressService', '$scope', 'AddressService', '$state', '$stateParams', '$timeout', 'PopupService', '$rootScope', '$ionicScrollDelegate',
  function ($ionicHistory, $ionicPopup, ChangeAddressService, $scope, AddressService, $state, $stateParams, $timeout, PopupService, $rootScope, $ionicScrollDelegate) {
    /** 变量声明 **/
    $scope.image = [];
    $scope.keywords = {
      keyword:''
    }
    $scope.addressMap = [];
    $scope.myData = [];
    $scope.updateResult = true;
    $scope.updateContent = '';
    $scope.goBack = function(){
      $ionicHistory.goBack();
      return;
    }
    /** 方法 **/
      //页面初始化
    $scope.init = function () {
      AddressService.getAddressList(undefined)
        .success(function (response, status, headers, config) {
          if (response.success) {
            $scope.myData = response.data;
            //  背景颜色
            if ($scope.myData.length == 0) {
              $scope.iosStyleOne = {
                backgroundColor: '#fff'
              };
            } else {
              $scope.iosStyleOne = {
              };
            };
            //默认地址第一位排序处理
            var defaultIndex = 0;
            var array = [];
            var haveDefault = false;
            for (var j = 0; j < response.data.length; j++) {
              if (response.data[j].de == '1') {
                defaultIndex = j;
                haveDefault = true;
                break;
              }
            }
            array[0] = response.data[defaultIndex];
            for (var x = 0; x < defaultIndex; x++) {
              array[x + 1] = response.data[x];
            }
            for (var y = defaultIndex + 1; y < response.data.length; y++) {
              array[y] = response.data[y];
            }
            $scope.addressMap = array;
            for (var i = 0; i < $scope.addressMap.length; i++) {
              $scope.image[i] = "img/ic_check.png";
            }
            if (haveDefault) {
              $scope.image[0] = "img/ic_select.png";
            }
          }
        });
    };

    //设置默认地址xyz添加
    $scope.setDefault = function (data) {
      var xyzStr = $scope.addressMap[data];
      ChangeAddressService.setDefaultAddr(xyzStr.id)
        .success(function (response, status, headers, config) {
          if (response.success == true) {
            $scope.init();
          }
          else {
            $scope.showResult('修改失败');
          }
        });
    };

    $scope.searchDataList = function(){
      if ($scope.keywords.keyword.length==0){
        PopupService.showToast("请输入要搜索的关键字");
        return;
      }
      AddressService.getAddressList($scope.keywords.keyword)
        .success(function (response, status, headers, config) {
          if (response.success) {
            $scope.myData = response.data;
            //  背景颜色
            if ($scope.myData.length == 0) {
              $scope.iosStyleOne = {
                backgroundColor: '#fff'
              };
            }else{
              $scope.iosStyleOne = {
              };
            };
            //默认地址第一位排序处理
            var defaultIndex = 0;
            var array = [];
            var haveDefault = false;
            for (var j = 0; j < response.data.length; j++) {
              if (response.data[j].de == '1') {
                defaultIndex = j;
                haveDefault = true;
                break;
              }
            }
            array[0] = response.data[defaultIndex];
            for (var x = 0; x < defaultIndex; x++) {
              array[x + 1] = response.data[x];
            }
            for (var y = defaultIndex + 1; y < response.data.length; y++) {
              array[y] = response.data[y];
            }
            $scope.addressMap = array;
            for (var i = 0; i < $scope.addressMap.length; i++) {
              $scope.image[i] = "img/ic_check.png";
            }
            if (haveDefault) {
              $scope.image[0] = "img/ic_select.png";
            }
          }
        });
    }
    $scope.cleanSearchData = function () {
      $scope.keywords.keyword = '';
      $scope.init();
    }

    //viewWillAppear
    $scope.$on('$ionicView.beforeEnter', function () {
      $ionicScrollDelegate.scrollTop();
      $scope.keywords.keyword = '';
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
      $scope.init();
    });

    //编辑
    $scope.goToChange = function (data) {
      var str = JSON.stringify($scope.addressMap[data]);
      $state.go('changeAddress', {'addressData': str})
    };




    //删除
    // 一个确认对话框xyz添加
    $scope.goToDelete = function (data) {
      var confirmPopup = $ionicPopup.confirm({
        template: '您确认要删除吗?',
        cancelText: '否',
        cssClass:'confirmDelete',
        okText: '是'
      });
      confirmPopup.then(function(res) {
        if(res) {
          var ind = $scope.addressMap[data].id;
          AddressService.deleteAddr(ind)
            .success(function (response, status, headers, config) {
              if (response.success) {
                // $scope.showResult('删除成功');
                PopupService.showToast("删除成功");
                setTimeout(function(){
                  $scope.init();
                },1000)
              } else {
                // $scope.showResult('删除失败');
                PopupService.showToast("删除失败");
              }
            });
        } else {
          console.log('You are not sure');
        }
      });
    };

    //******************ZXT--跳转到填写订单******************
    $scope.goToConfirm = function (item) {
      //alert(index);
      //alert($scope.myData[index].id);
      if ($stateParams.comeFromOrder == 'YES') {
        AddressService.chooseLocation(item.id)
          .success(function (response, status, headers, config) {
            if (response.success == true) {
              $scope.$ionicGoBack();
            } else {
              PopupService.showToast('更改收货物地址失败,请重新选择');
            }
          });
      }
    };
    //******************ZXT--跳转到填写订单*******************
  }]);
/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016-3-24
 * describe：AddressService
 **/
APP.service('AddressService', ['$http', 'UrlService', function ($http, UrlService) {

  //获取地址信息
  this.getAddressList = function (k) {
    var params = {
      k: k
    };
    return $http({
      method:'POST',
      url:UrlService.getUrl('ADDRESS_INIT'),
      params: params
    });
  };

  //删除地址
  this.deleteAddr = function (deleteIndex) {
    return $http({
      method:'POST',
      url:UrlService.getUrl('DETELEADDR_INIT'),
      params:{"m":deleteIndex}
    });
  };

  //******************ZXT--跳转到填写订单******************
  this.chooseLocation = function (addrId) {
    var params = {
      'address': addrId
    };
    return $http({
      method:'POST',
      url:UrlService.getUrl('CHOOSE_ADDR'),
      params:params
    });
  };
  //******************ZXT--跳转到填写订单******************
}]);
