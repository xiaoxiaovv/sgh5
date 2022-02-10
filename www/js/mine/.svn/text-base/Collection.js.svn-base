/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016/3/16
 * describe：CollectionController 测试控制器
 **/
APP.controller('CollectionController', ['$rootScope','$scope', 'CollectionService', '$timeout','UserService','GoodsService','CommonAddressService','HomePageService',
  function ($rootScope,$scope, CollectionService, $timeout,UserService,GoodsService,CommonAddressService,HomePageService) {
    /** 变量声明 **/
    $scope.items = [];
    $scope.typeArr = ['商品','店铺/场馆'];
    $scope.updateResult = true;
    $scope.updateContent = '';
    $scope.storeId = UserService.getUser().mid;
    $scope.flagNum = false;
    $scope.messageImgUrl = $rootScope.imgBaseURL+"img/message_gray@2x.png";
    var provinceId = 16,
        cityId = 173,
        districtId = 2450,
        streetId = 12036596;
    /** 方法 **/
      //页面修改显示
    $scope.init = function () {
      $scope.collectionType = "product";
      $scope.storePage = 1;
      $scope.storePageSize = 5;
      $scope.hasMore = false;
      $scope.items = [];
      getCollectionProduct();
    };
//    获取 收藏的商品列表
    function getCollectionProduct() {
      GoodsService.getAddress()
        .success(function(response){
          if(response.success){
            var addr = eval(response.data);
            provinceId = addr[0].provinceId;
            cityId = addr[0].cityId;
            districtId = addr[0].areaId;
            streetId = addr[0].streetId;
            CollectionService.showCollection(provinceId,cityId,districtId,streetId)
              .success(function (response, status, headers, config) {
                if (response.success) {
                  $scope.items = response.data.productsList;
                }
              });
          }else{
            alert('获取收藏失败');
          }
        })
        .error(function(err){
          var addressInfo = CommonAddressService.getAddressInfo();
          CollectionService.showCollection(addressInfo.provinceId,addressInfo.cityId,addressInfo.areaId,addressInfo.streetId)
            .success(function (response, status, headers, config) {
              if (response.success) {
                $scope.items = response.data.productsList;
              }
            });
        });
        HomePageService.getUnReadMsg()
          .success(function (res) {
            if (res.data > 0) {
              $scope.flagNum = true;
            } else {
              $scope.flagNum = false;
            }
          });    }
//    获取 收藏的店铺、场馆列表
    function getCollectionStoreList() {
      GoodsService.getAddress()
        .success(function(response){
          if(response.success){
            var addr = eval(response.data);
            provinceId = addr[0].provinceId;
            cityId = addr[0].cityId;
            districtId = addr[0].areaId;
            streetId = addr[0].streetId;
            $scope.streetId = streetId;
            CollectionService.getStoreCollection($scope.storePage,$scope.storePageSize)
              .success(function (response, status, headers, config) {
                if (response.success) {
                  $scope.items = $scope.items.concat(response.data);
                  if($scope.items.length<response.totalCount){
                    $scope.hasMore = true;
                  }else{
                    $scope.hasMore = false;
                  }
                }
              });
          }else{
            alert('获取收藏失败');
          }
        })
        .error(function(err){
          var addressInfo = CommonAddressService.getAddressInfo();
          CollectionService.getStoreCollection($scope.storePage,$scope.storePageSize)
            .success(function (response, status, headers, config) {
              if (response.success) {
                $scope.items = $scope.items.concat(response.data);
                if($scope.items.length<response.totalCount){
                  $scope.hasMore = true;
                }else{
                  $scope.hasMore = false;
                }
              }
            });
        });
    }
//    上拉加载更多
    $scope.loadMore = function () {
      $scope.storePage+=1;
      getCollectionStoreList();
    };
//    选择类别
    $scope.checkType = function (index) {
      if(index==0){
        $scope.collectionType = "product";
        getCollectionProduct();
        $(".collection_type>div:nth-child(1)").css('color','#2979FF');
        $(".collection_type>div:nth-child(1) div").css('borderBottom','2px solid #2979FF');
        $(".collection_type>div:nth-child(2)").css('color','#666666');
        $(".collection_type>div:nth-child(2) div").css('borderBottom','0px');
      }else{
        $scope.collectionType = "store";
        $scope.items = [];
        getCollectionStoreList();
        $(".collection_type>div:nth-child(2)").css('color','#2979FF');
        $(".collection_type>div:nth-child(2) div").css('borderBottom','2px solid #2979FF');
        $(".collection_type>div:nth-child(1)").css('color','#666666');
        $(".collection_type>div:nth-child(1) div").css('borderBottom','0px');
      }
    }
//viewWillAppear
    $scope.$on('$ionicView.beforeEnter', function (e,v) {
      if(v.direction=='back'){
        $scope.direction = 'back';
      }else{
        $scope.storeId = UserService.getUser().mid;
        $scope.direction = 'forword';
        $scope.init();
      }
    });
    $scope.$on("$ionicView.enter",function () {
      if($scope.direction == 'back'){

      }else{
        $(".collection_type>div:nth-child(1)").css('color','#2979FF');
        $(".collection_type>div:nth-child(1) div").css('borderBottom','2px solid #2979FF');
        $(".collection_type>div:nth-child(2)").css('color','#666666');
        $(".collection_type>div:nth-child(2) div").css('borderBottom','0px');
      }
    })

//删除收藏内容
    $scope.delete = function (index) {
      CollectionService.deleteCollection($scope.items[index].productId)
        .success(function (response, status, headers, config) {
          if (response.success) {
            $scope.showResult('删除成功');
            $scope.init();
          } else {
            $scope.showResult('删除失败');
          }
        });
    };

//显示修改结果提示
    $scope.showResult = function (result) {
      $scope.updateContent = result;
      $scope.updateResult = false;
      $timeout(function () {
        $scope.updateResult = true;
      }, 1000);
    };


  }])
;
/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016-3-24
 * describe：我的收藏
 **/
APP.service('CollectionService', ['$http', 'UrlService', function ($http, UrlService) {
  //显示收藏
  this.showCollection = function (provinceId,cityId,districtId,streetId) {
    var params = {
      provinceId:provinceId,
      cityId:cityId,
      districtId:districtId,
      streetId:streetId
    };
    return $http.get(UrlService.getUrl('COLLECTION_LIST'),params);
  };
  //删除收藏
  this.deleteCollection = function (productId) {
    console.log(productId);
    var params = {
      'productId': productId
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('DELETECOLLECTION_INIT'),
      params: params
    });
  }
  this.getStoreCollection =  function (page,pageSize) {
    var params = {
      page:page,
      pageSize:pageSize
    };
    return $http.get(UrlService.getUrl('STORE_COLLECTIONLIST'),params);
  }
}]);
