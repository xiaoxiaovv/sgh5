APP.controller('batchDeleteOrderController', ['$ionicHistory','$ionicPopup', '$scope', 'PopupService', 'OrderManageService', 'BatchOrderService', '$ionicScrollDelegate', '$state', '$ionicViewSwitcher','$rootScope',
  function ($ionicHistory,$ionicPopup, $scope, PopupService, OrderManageService, BatchOrderService, $ionicScrollDelegate,$state,$ionicViewSwitcher,$rootScope) {
    /** 变量声明 **/
    $scope.hasMoreData = false;//默认不加载下拉刷新
    $scope.closeOrderData = [];
    var pageIndex = 0;//分页页数
    var pageSize = 5;//每页显示条数
    $scope.goBack = function(){
      $ionicViewSwitcher.nextDirection('enter');
      $state.go('orderManage');
    }

    // 加载数据、
    $scope.loadData = function(){
      pageIndex = 0;
      OrderManageService.getOrderList(1,'closed',0,5,'')
      .success(function(response){
        if(response.success){
          $ionicScrollDelegate.scrollTop();//滚动到顶部
          $scope.isSelectAllOrder = false;
          $scope.closeOrderData = response.data.orders;
          $scope.hasMoreData = (response.data.countResult>$scope.closeOrderData.length)?true:false;
          $scope.image = [];
          // 染地址列表的数组
          for (var i = 0; i < $scope.closeOrderData.length; i++) {
            $scope.image[i] = "img/ic_check.png";
          }
        }
      })
    }

    // 上拉加载数据
    $scope.loadMore = function () {
      pageIndex++;
      OrderManageService.getOrderList(1,'closed',pageIndex,pageSize,'')
      .success(function(response){
        if(response.success){
          for (var i = $scope.closeOrderData.length; i < response.data.orders.length+$scope.closeOrderData.length; i++) {
              $scope.image[i] = "img/ic_check.png";
              $scope.isSelectAllOrder = false;
            }
          $scope.closeOrderData = $scope.closeOrderData.concat(response.data.orders);
          $scope.hasMoreData = (response.data.countResult>$scope.closeOrderData.length)?true:false;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      })
    };

    //选择要删除订单的方法
    $scope.selectOrderAddress = function(index){
        $scope.chooseOrderNum = 0;
        //如果是没被选中
        if($scope.image[index].indexOf('check')!=-1){
          $scope.image[index] = "img/ic_select.png";
          $scope.chooseOrderNum++;
          $scope.isChooseOrder = true;
        }else{
          $scope.image[index] = "img/ic_check.png";
          $scope.chooseOrderNum--;
        }
        if($scope.chooseOrderNum==$scope.image.length){
          $scope.isSelectAllOrder = true;
        }else{
          $scope.isSelectAllOrder = false;
        }
    }

    //全选订单
    $scope.selectAllOrder = function(){
      //如果是全选状态
      if($scope.isSelectAllOrder){
        for (var i = 0,length = $scope.closeOrderData.length; i < length; i++) {
        $scope.image[i] = "img/ic_check.png";
      }
      $scope.chooseOrderNum = 0;
      $scope.isSelectAllOrder = false;
      }else{
        for (var i = 0,length = $scope.closeOrderData.length; i < length; i++) {
        $scope.image[i] = "img/ic_select.png";
      }
      $scope.isSelectAllOrder = true;
      $scope.chooseOrderNum = $scope.image.length;
      }
    }

    //订单删除
    $scope.batchDelete = function(){
      $scope.isChooseOrder = false;
      for(var i = 0; i < $scope.image.length; i++){
        if($scope.image[i].indexOf('select')!=-1){
          $scope.isChooseOrder = true;
        }
      }
      if(!$scope.isChooseOrder){
        PopupService.showToast("请选择要删除的订单");
        return;
      }
      var confirmPopup = $ionicPopup.confirm({
        template: '您确认要删除吗?',
        cancelText: '否',
        cssClass:'confirmDelete',
        okText: '是'
      });
      confirmPopup.then(function(res) {
        console.log(res);
        if(res) {
          var orderIds = '';//删除订单的 id 多个地址的话 id用 逗号 分开
          var orderIdsArray = [];
          for(var i = 0,length = $scope.image.length; i < length; i++){
            //如果是被选中的地址
            if($scope.image[i].indexOf('select')!=-1){
              orderIdsArray.push($scope.closeOrderData[i].orderId);
            }
          }
          orderIds = orderIdsArray.join(',');
          var params = {
            orderIds:orderIds
          };
          BatchOrderService.batchDelete(params)
            .success(function(response){
              if(response.success){
                console.log('删除地址成功');
                //如果所有的地址都删除后 返回到上一个页面
                if($scope.isSelectAllOrder&&!$scope.hasMoreData){
                  $ionicViewSwitcher.nextDirection('enter');
                  $state.go('orderManage');
                  return;
                }
                $scope.loadData();
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
      $ionicScrollDelegate.scrollTop();//滚动到顶部
      pageIndex = 0;//重置第一页
      $scope.image= [];//存放 是否选中地址的图片
      $scope.chooseOrderNum = 0;//已选择的 要删除的订单数量
      $scope.isChooseOrder = false;//是否选择了要删除的订单
      $scope.isSelectAllOrder = false;//默认全不选
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
      $scope.loadData();
    });
  }]);

  APP.service('BatchOrderService', ['$http', 'UrlService', function ($http, UrlService) {
    this.batchDelete = function(params){
      return $http.get(UrlService.getUrl('BATCH_DELETE_ORDER'),params);
    }
  }]);
