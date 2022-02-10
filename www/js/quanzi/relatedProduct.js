/**
 * Created by 峂峂 on 2016/3/16.
 */

APP.controller('relatedProductController', ['$ionicHistory','$http', '$scope', 'relatedProductsService', '$stateParams',
  '$state', '$cookieStore', '$ionicPopup', '$timeout',
  'LoginService', '$rootScope','$ionicModal',
  '$localstorage', 'PopupService',
  function ($ionicHistory,$http ,$scope, relatedProductsService, $stateParams, $state,
            $cookieStore, $ionicPopup, $timeout, LoginService, $rootScope, $ionicModal,
            $localstorage, PopupService) {

   $scope.provinceId = 0;
   $scope.cityId = 0;
   $scope.regionId = 0;
   $scope.streetId = 0;
   $scope.productList=[];
   $scope.imgimg=[];
   $rootScope.image = [];
   
   $scope.isAreadyShop=false;
   $scope.prolist=[];
   $scope.searchGoodsName='';
   $scope.gsPlaceholder='搜索商品';
   $scope.isShop=true;
   $scope.shop0=true;
    $scope.shop1=false;
    $scope.shop2=false;
    $scope.shop3=false;
    $scope.search=false;
  
    //商品上拉刷新
    $scope.page = 1;
    $scope.loadMore = function () {
      
        $scope.page += 1;
        if($scope.selectedIndex==0){
          console.log(22);
          if($scope.searchOK){
            $scope.searchGoods($scope.searchName.searchShop,$scope.page, 5,$scope.provinceId, $scope.cityId, $scope.regionId, $scope.streetId,2)
          }else{
            $scope.loadMoreProducts($scope.provinceId, $scope.cityId, $scope.regionId, $scope.streetId, $scope.page, 5)
          }
        }else if($scope.selectedIndex==1){
          $scope.areadyPage+=1;
          $scope.areadyShop($scope.areadyPage, 5);
        }else if($scope.selectedIndex==3){
          $scope.searchGoods($scope.searchName.searchAll,$scope.page, 5,$scope.provinceId, $scope.cityId, $scope.regionId, $scope.streetId,1)
        }
        
      
    };
    //selectedIndex
    $scope.onTabSelected=function(param){
      $scope.selectedIndex=param;
      $scope.page = 1;
      $scope.searchName={
        searchShop:'',
        searchHold:'',
        searchAll:''
      }
      $scope.searchOK=false;
      if(param==0){
        $scope.shop0=true;
        $scope.shop1=false;
        $scope.shop2=false;
        $scope.shop3=false;
        $scope.isShop=true;
        $scope.search=false;
        $scope.productList=[];
        $scope.loadMoreProducts($scope.provinceId, $scope.cityId, $scope.regionId, $scope.streetId, $scope.page, 5);
      }else if(param==1){
        $scope.shop0=false;;
        $scope.shop1=true;
        $scope.shop2=false;
        $scope.shop3=false;
        $scope.isShop=true;
        $scope.search=false;
        $scope.areadyPage=0;
        $scope.productList=[];
        $scope.areadyShop($scope.areadyPage, 5);
      }else if(param==2){
        $scope.shop0=false;
        $scope.shop1=false;
        $scope.shop2=true;
        $scope.shop3=false;
        $scope.isShop=true;
        $scope.search=false;
        $scope.productList=[];
        $scope.holdPro();
      }else if(param==3){
        $scope.shop0=false;
        $scope.shop1=false;
        $scope.shop2=false;
        $scope.shop3=true;
        $scope.isShop=false;
        $scope.search=true;
        $scope.productList=[];
        
      }
    }
    //加载商品列表
    $scope.loadMoreProducts = function (provinceId, cityId, districtId, streetId, pageIndex, pageSize) {
      // console.log(pageSize);
      relatedProductsService.loadMoreProducts(provinceId, cityId, districtId, streetId, pageIndex, pageSize)
        .success(function (response) {
          console.log(response);
          if (response.productsList != null && response.productsList != undefined && response.productsList.length != 0) {
            console.log(response);
            $scope.productList = $scope.productList.concat(response.productsList);
            $scope.$broadcast('scroll.infiniteScrollComplete');
            var len = $scope.productList.length;
            $scope.hasmore = !(len === response.storeItemsCounts);
            for (var i = 0; i < $scope.productList.length; i++) {
              if($rootScope.image[$scope.productList[i].productId]==$rootScope.imgBaseURL+'img/ic_select.png'){
                $rootScope.image[$scope.productList[i].productId]==$rootScope.imgBaseURL+'img/ic_select.png'
              }else{
                $rootScope.image[$scope.productList[i].productId] = $rootScope.imgBaseURL+"img/ic_check.png";
              }

              
            }

          } else {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.hasmore = false;
            PopupService.showToast('没有更多商品了');
            // $scope.productList = [];
            //$scope.showPopup('没有更多商品了');
          }
        })
        $scope.imgimg=$rootScope.image;
    };
    //购买过的商品加载更多
    $scope.areadyShop = function (pageIndex,  pageSize) {
      relatedProductsService.areadyShop(pageIndex,  pageSize)
      .success(function(response){
         console.log(response);
         if (response.productList != null && response.productList != undefined && response.productList.length != 0) {

            $scope.productList = $scope.productList.concat(response.productList);
            console.log($scope.productList);
            $scope.$broadcast('scroll.infiniteScrollComplete');
            var len = $scope.productList.length;
            $scope.hasmore = !(len === response.productTotal);
            for (var i = 0; i < $scope.productList.length; i++) {
              if($rootScope.image[$scope.productList[i].productId]==$rootScope.imgBaseURL+'img/ic_select.png'){
                $rootScope.image[$scope.productList[i].productId]==$rootScope.imgBaseURL+'img/ic_select.png'
              }else{
                $rootScope.image[$scope.productList[i].productId] = $rootScope.imgBaseURL+"img/ic_check.png";
              }

              
            }
          } else {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.hasmore = false;
            PopupService.showToast('没有更多商品了');
            // $scope.productList = [];
            // $scope.showPopup('没有更多商品了');
          }
         

        //  for(var i=0;i<response.data.orders.length;i++){
        //    for(var j=0;j<response.data.orders[i].OrderProducts.length;j++){
        //       $scope.prolist.push(response.data.orders[i].OrderProducts[j]);
        //       var len = $scope.productList.length;
        //     $scope.hasmore = !(len === response.data.countResult);
        //     // console.log($scope.hasmore)
        //     for (var i = 0; i < $scope.prolist.length; i++) {
        //       // console.log()
        //       if($rootScope.image[$scope.prolist[i].productId]=='img/ic_select.png'){
        //         $rootScope.image[$scope.prolist[i].productId]=='img/ic_select.png'
        //       }else{
        //         $rootScope.image[$scope.prolist[i].productId] = "img/ic_check.png";
        //       }
        //     }
          //  console.log($scope.prolist);
        //    }
           
        //  }
       })
       $scope.imgimg=$rootScope.image;
    }
    $scope.holdPro=function(){
      relatedProductsService.holdPro()
       .success(function(response){
         if (response.data != null && response.data != undefined && response.data.length != 0) {

            $scope.productList = $scope.productList.concat(response.data);
            $scope.hasmore = false;
            for (var i = 0; i < $scope.productList.length; i++) {
              if($rootScope.image[$scope.productList[i].productId]==$rootScope.imgBaseURL+'img/ic_select.png'){
                $rootScope.image[$scope.productList[i].productId]==$rootScope.imgBaseURL+'img/ic_select.png'
              }else{
                $rootScope.image[$scope.productList[i].productId] = $rootScope.imgBaseURL+"img/ic_check.png";
              }
            }
          } else {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.hasmore = false;
            PopupService.showToast('没有更多商品了');
            // $scope.productList = [];
            //$scope.showPopup('没有更多商品了');
          }
       })
       $scope.imgimg=$rootScope.image;
    }
    $scope.searchHold=function(){
      // $scope.page = 1;
      $scope.productList=[];
      
      // console.log($scope.searchGoodsName)
      if ($scope.searchName.searchHold == ''&&!$scope.gsPlaceholder) {
        PopupService.showToast('请填写搜索内容');
        return;
      }
      else if ($scope.searchName.searchHold != '') {
        $scope.searchGoodsHold($scope.searchName.searchHold)
      }
    }

    $scope.searchGoodsHold = function (keyword) {
      relatedProductsService.searchHoldPro(keyword)
        .success(function (response) {
          if (response.data != null && response.data != undefined && response.data.length != 0) {

            $scope.productList = $scope.productList.concat(response.data);
            $scope.hasmore = false;
            for (var i = 0; i < $scope.productList.length; i++) {
              if($rootScope.image[$scope.productList[i].productId]==$rootScope.imgBaseURL+'img/ic_select.png'){
                $rootScope.image[$scope.productList[i].productId]==$rootScope.imgBaseURL+'img/ic_select.png'
              }else{
                $rootScope.image[$scope.productList[i].productId] = $rootScope.imgBaseURL+"img/ic_check.png";
              }
            }
          } else {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.hasmore = false;
            PopupService.showToast('没有更多商品了');
            // $scope.productList = [];
            //$scope.showPopup('没有更多商品了');
          }
        })
        $scope.imgimg=$rootScope.image;
    };
    // $scope.getproname=function(a){
    //   $scope.searchGoodsName=a;
    // }
    $scope.searchName={
      searchShop:'',
      searchHold:'',
      searchAll:''
    }

    $scope.todoSomething=function($event,index){
    if($event.keyCode==13){//回车
        // console.log('1');
        $scope.searchProduct(index);
        Focus.blur();
        }
    };
    //搜索商品
    $scope.searchProduct = function (index) {
      $scope.searchOK=true;
      $scope.page = 1;
      $scope.productList=[];
      if(index==1){
        if ($scope.searchName.searchAll == ''&&!$scope.gsPlaceholder) {
          PopupService.showToast('请填写搜索内容');
          return;
        }
        else if ($scope.searchName.searchAll != '') {
          $scope.searchGoods($scope.searchName.searchAll,$scope.page, 5,$scope.provinceId, $scope.cityId, $scope.regionId, $scope.streetId,index)
        }
      }else if(index==2){
        if ($scope.searchName.searchShop == ''&&!$scope.gsPlaceholder) {
          PopupService.showToast('请填写搜索内容');
          return;
        }
        else if ($scope.searchName.searchShop != '') {
          $scope.searchGoods($scope.searchName.searchShop,$scope.page, 5,$scope.provinceId, $scope.cityId, $scope.regionId, $scope.streetId,index)
        }
      }

    };

    $scope.searchGoods = function (keyword, pageIndex, pageSize,provinceId, cityId, districtId, streetId,fromType) {
      relatedProductsService.searchGoods(keyword, pageIndex, pageSize,provinceId, cityId, districtId, streetId,fromType)
        .success(function (response) {
          console.log(response);
          $scope.isShop=true;
          if (response.productsList != null && response.productsList != undefined && response.productsList.length != 0) {

            $scope.productList = $scope.productList.concat(response.productsList);
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.hasmore = !(response.productsList<5);
            console.log($scope.hasmore);
            console.log($scope.productList)
            for (var i = 0; i < $scope.productList.length; i++) {
              if($rootScope.image[$scope.productList[i].productId]==$rootScope.imgBaseURL+'img/ic_select.png'){
                $rootScope.image[$scope.productList[i].productId]==$rootScope.imgBaseURL+'img/ic_select.png'
              }else{
                $rootScope.image[$scope.productList[i].productId] = $rootScope.imgBaseURL+"img/ic_check.png";
              }
            }
          } else {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.hasmore = false;
            PopupService.showToast('没有更多商品了');
          }
        })
        $scope.imgimg=$rootScope.image;
    };

    // $scope.changePadding = function(){
    //   if(Focus.value.length>0){
    //     $scope.inputPadding = {
    //       "padding-right":"30px"
    //     }
    //   }else{
    //     $scope.inputPadding = {
    //       "padding-right":"0px"
    //     }
    //   }
    // };
    $scope.productOK=function(){
      $ionicHistory.goBack();
      $rootScope.nextPageBefore = 'relatedProduct';
      // $scope.$ionicGoBack();
    }
    

    $scope.selectOrderAddress = function(goods){
        if($rootScope.productId.length < 5){
        //如果是没被选中
          if($rootScope.image[goods.productId].indexOf('check')!=-1){
            $rootScope.productId.push(goods);
            $rootScope.image[goods.productId] = $rootScope.imgBaseURL+"img/ic_select.png";
            $scope.isChooseOrder = true;
          }else{
            for(var i=0; i<$rootScope.productId.length; i++) {
              if($rootScope.productId[i].productId == goods.productId) {
                $rootScope.productId.splice(i, 1);
                break;
              }
            }
            // $rootScope.productId.pop(productId);
            $rootScope.image[goods.productId] = $rootScope.imgBaseURL+"img/ic_check.png";
          }
        }else if($rootScope.productId.length == 5){
        //如果是没被选中
          if($rootScope.image[goods.productId].indexOf('check')!=-1){
            PopupService.showToast('最多能选择5个');
          }else{
            for(var i=0; i<$rootScope.productId.length; i++) {
              if($rootScope.productId[i].productId == goods.productId) {
                $rootScope.productId.splice(i, 1);
                break;
              }
            }
            $rootScope.image[goods.productId] = $rootScope.imgBaseURL+"img/ic_check.png";
          }
        }else{
          PopupService.showToast('最多能选择5个');
        }
        $scope.imgimg=$rootScope.image;
        console.log($rootScope.productId);
    }

    

    

    // 初始化
    $scope.init = function () {
      $scope.searchName={
      searchShop:'',
      searchHold:'',
      searchAll:''
    }
    $scope.selectedIndex=0;
      $scope.hasmore = false;
      $scope.shop0=true;
      $scope.shop1=false;
      $scope.shop2=false;
      $scope.shop3=false;
      $scope.search=false;
      $scope.productList=[];
      // console.log($rootScope.productId.length);
      relatedProductsService.getAddress()
        .success(function (response) {
          var obj = eval(response.data);
          $scope.provinceId = obj[0].provinceId;
          $scope.cityId = obj[0].cityId;
          $scope.regionId = obj[0].areaId;
          $scope.streetId = obj[0].streetId;
          // console.log($scope.provinceId);
          $scope.initPro();
        });
      
    };
    $scope.initPro=function(){
      $scope.page = 1;
      // console.log($scope.provinceId);
      $scope.loadMoreProducts($scope.provinceId, $scope.cityId, $scope.regionId, $scope.streetId, $scope.page, 5)
    }


    
    $scope.goBack = function () {
      $scope.$ionicGoBack();
    };
    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      $scope.isIOS = ionic.Platform.isIOS()?true:false;
     $scope.init();
    });

    $scope.$on('$destroy', function () {
      $scope.filterModal.remove();
      $scope.addressModal.remove();
    });
  }]);


APP.service('relatedProductsService', ['$http', 'UrlService', function ($http, UrlService) {
  //上拉加载商品
  this.loadMoreProducts = function (provinceId, cityId, districtId, streetId, pageIndex, pageSize) {
    var params = {
      'provinceId': provinceId,
      'cityId': cityId,
      'districtId': districtId,
      'streetId': streetId,
      'pageIndex':pageIndex,
      'pageSize':pageSize
    };
     return $http.get(UrlService.getUrl('GET_RELATEDSHOP'), params);
  };
  //购买过的商品
  this.areadyShop = function (pageIndex,  pageSize) {
    var params = {
       'start':pageIndex,
       'offset':5,
    };
     return $http.get(UrlService.getUrl('GET_AREADYSHOP'), params);
  };
  //收藏的商品
  this.holdPro = function () {
    
     return $http.get(UrlService.getUrl('GET_HOLDPRO'));
  };
  this.searchHoldPro = function (keyword) {
    var params={
      'keyword':keyword,
    }
     return $http.get(UrlService.getUrl('SEARCH_HOLDPRO'),params);
  };
  //搜索商品
  this.searchGoods = function (keyword,pageIndex, pageSize,provinceId, cityId, districtId, streetId,fromType) {
    var params = {
      'keyword':keyword,
      'pageIndex':pageIndex,
      'pageSize':pageSize,
      'provinceId': provinceId,
      'cityId': cityId,
      'districtId': districtId,
      'streetId': streetId,
      'fromType':fromType
      
    };
     return $http.get(UrlService.getUrl('SEARCH_GOODS_CIRCLE'), params);
  };


  //获取地址信息
  this.getAddress = function () {
    return $http.get(UrlService.getUrl('GET_POSITION_FROM_COOLIE'));
  };
  
  //获取筛选列表
  this.getFilterData = function () {
    return $http.get(UrlService.getUrl('GET_FILTER_DATA'));
  };
  
}]);
