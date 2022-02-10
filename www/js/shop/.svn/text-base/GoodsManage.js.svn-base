/**
 * creator:feng.jiang@dhc.com.cn
 * create time:16/3/15
 * describe：GoodsManageController 商品管理控制器
 **/
APP.controller('GoodsManageController', ['$scope', 'GoodsManageService', '$ionicModal', 'UserService', 'GoodsService',
  function ($scope, GoodsManageService, $ionicModal, UserService, GoodsService) {

    /** 变量声明 **/
    $scope.flag = [];//控制列表底部按钮是否显示标识
    $scope.isShowOnFooter = false;//控制底部在售商品批量操作footer是否显示标识
    $scope.isShowOffFooter = false;//控制底部下架商品批量操作footer是否显示标识
    $scope.moreOrCheck = false; //表单右下角显示更多还是复选框标识
    $scope.goodsList = [];  //商品列表数组
    $scope.onSaleAmount;   //在售商品数量
    $scope.offSaleAmount;  //下架商品数量
    $scope.searchGoodsList = [];  //搜索后的商品列表
    var selectedGoodsList = [];  //选中的商品列表数组
    var isAllSelected = false;  //是否全选标识
    var isOnSale = true;  //区分当前列表为上架还是下架
    //请求参数
    var memberId,
      onShelf = 1,
      provinceId = 20,
      cityId = 242,
      districtId = 3466,
      pageIndex = 1,
      pageSize = 5;
    $scope.keywords = {
      keyword: ''
    };
    /** 方法 **/
    $scope.init = function () {
      $scope.loadData(memberId, onShelf, provinceId, cityId, districtId);
      GoodsManageService.getGoodsList(memberId, 0, provinceId, cityId, districtId)
        .success(function (response, status, headers, config) {
          if (response.productsList && response.productsList.length > 0) {
            $scope.offSaleAmount = response.productsList.length;
          } else {
            $scope.offSaleAmount = 0
          }
        })
    };
    $scope.loadData = function (memberId, onShelf, provinceId, cityId, districtId) {
      GoodsManageService.getGoodsList(memberId, onShelf, provinceId, cityId, districtId)
        .success(function (response, status, headers, config) {
          for (var i = 0, length = response.productsList.length; i < length; i++) {//清除选中状态
            response.productsList[i].isSelected = false;
          }
          $scope.goodsList = response.productsList;
          if (onShelf == 1) {//计算在售商品数量
            if (response.productsList && response.productsList.length > 0) {
              $scope.onSaleAmount = response.productsList.length;
            } else {
              $scope.onSaleAmount = 0
            }
          } else if (onShelf == 0) {//计算下架商品数量
            if (response.productsList && response.productsList.length > 0) {
              $scope.offSaleAmount = response.productsList.length;
            } else {
              $scope.offSaleAmount = 0
            }
          }
          console.log('goodsList:', $scope.goodsList);
        });
    };

    //搜索商品
    $scope.searchGoods = function () {
      pageIndex = 1;
      //if(!$scope.keywords.keyword)
      //  return;
      GoodsManageService.searchGoods(pageIndex, pageSize, memberId, $scope.keywords.keyword, provinceId, cityId, districtId).
        success(function (response, status, headers, config) {
          $scope.searchGoodsList = response.productsList;
          console.log('searchGoodsList:', $scope.searchGoodsList);
        });
    };
    $scope.searchMore = function () {
      pageIndex = pageIndex + 1;
      GoodsManageService.searchGoods(pageIndex, pageSize, memberId, $scope.keywords.keyword, provinceId, cityId, districtId).
        success(function (response, status, headers, config) {
          $scope.searchGoodsList = $scope.searchGoodsList.concat(response.productsList);
          console.log('searchGoodsList:', $scope.searchGoodsList);
        });
    };

    //在售商品statusBar点击方法
    $scope.onSale = function () {
      if (!isOnSale) {
        isOnSale = true;
        $scope.flag = [];//清空列表底部按钮是否显示标识
        $scope.moreOrCheck = false;
        $scope.isShowOnFooter = false;
        $scope.isShowOffFooter = false;
        var onSaleStyle = document.getElementById('onSale').style;
        onSaleStyle.color = '#32BEFF';
        var offSaleStyle = document.getElementById('offSale').style;
        offSaleStyle.color = 'black';

        onShelf = 1;
        $scope.loadData(memberId, onShelf, provinceId, cityId, districtId);
      }
    };
    //下架商品statusBar点击方法
    $scope.offSale = function () {
      if (isOnSale) {
        isOnSale = false;
        $scope.flag = [];//清空列表底部按钮是否显示标识
        $scope.moreOrCheck = false;
        $scope.isShowOnFooter = false;
        $scope.isShowOffFooter = false;
        var offSaleStyle = document.getElementById('offSale').style;
        offSaleStyle.color = '#32BEFF';
        var onSaleStyle = document.getElementById('onSale').style;
        onSaleStyle.color = 'black';

        onShelf = 0;
        $scope.loadData(memberId, onShelf, provinceId, cityId, districtId);
      }
    };

    //是否显示列表底部按钮
    $scope.showBtn = function (index) {
      if (isOnSale) {
        var btnOn = document.getElementsByClassName('sm-bottom-btn-on');
        angular.forEach(btnOn, function (data, num) {
          if (num == index) {
            data.style.display = 'inline-block';
          } else {
            data.style.display = 'none';
          }
        });
      } else {
        var btnOff = document.getElementsByClassName('sm-bottom-btn-off');
        angular.forEach(btnOff, function (data, num) {
          if (num == index) {
            data.style.display = 'inline-block';
          } else {
            data.style.display = 'none';
          }
        });
      }

    };

    //批量操作菜单显示
    $scope.batchOperate = function () {
      var btnOn = document.getElementsByClassName('sm-bottom-btn-on');
      var btnOff = document.getElementsByClassName('sm-bottom-btn-off');
      for (var i = 0, length = $scope.goodsList.length; i < length; i++) {
        btnOn[i].style.display = 'none';
        btnOff[i].style.display = 'none';
      }
      if (isOnSale) {
        $scope.isShowOnFooter = !$scope.isShowOnFooter;
      } else {
        $scope.isShowOffFooter = !$scope.isShowOffFooter;
      }
      $scope.moreOrCheck = !$scope.moreOrCheck;
    };

    //删除商品方法
    $scope.deleteGoods = function (index) {
      var sku = $scope.goodsList[index].sku;
      //GoodsManageService.deleteGoods(memberId,sku)
      //  .success(function(response){
      //  });
      $scope.flag[index] = !$scope.flag[index];
      if (isOnSale) {
        $scope.onSaleAmount = $scope.onSaleAmount - 1;
      } else {
        $scope.offSaleAmount = $scope.offSaleAmount - 1;
      }
      $scope.goodsList.splice(index, 1);
    };

    //下架单个商品方法
    $scope.soldOut = function (index) {
      var sku = $scope.goodsList[index].sku;
      GoodsManageService.updateGoods(memberId, sku, 1)
        .success(function (response) {
          console.log(response);
        });
      $scope.flag[index] = !$scope.flag[index];
      $scope.onSaleAmount = $scope.onSaleAmount - 1;
      $scope.offSaleAmount = $scope.offSaleAmount + 1;
      $scope.goodsList.splice(index, 1);
    };

    //上架单个商品方法
    $scope.putAway = function (index) {
      var sku = $scope.goodsList[index].sku;
      GoodsManageService.updateGoods(memberId, sku, 0)
        .success(function (response) {
        });
      $scope.flag[index] = !$scope.flag[index];
      $scope.offSaleAmount = $scope.offSaleAmount - 1;
      $scope.onSaleAmount = $scope.onSaleAmount + 1;
      $scope.goodsList.splice(index, 1);
    };

    //批量上架商品方法
    $scope.putAwayBatch = function () {
      var skuStr = selectedGoodsList.join('@');
      GoodsManageService.updateGoodsBatch(skuStr, 0)
        .success(function (response, status, headers, configs) {

        });
      $scope.loadData(memberId, 0, provinceId, cityId, districtId);
      selectedGoodsList = [];
    };
    //批量下架商品方法
    $scope.soldOutBatch = function () {
      var skuStr = selectedGoodsList.join('@');
      GoodsManageService.updateGoodsBatch(skuStr, 1)
        .success(function (response, status, headers, configs) {

        });
      $scope.loadData(memberId, 1, provinceId, cityId, districtId);
      selectedGoodsList = [];
    };

    //批量删除商品
    $scope.deleteGoodsBatch = function () {
      var skuStr = selectedGoodsList.join('@');
      //GoodsManageService.deleteGoodsBatch(skuStr)
      //  .success(function(response,status,header,config){

      //  });
      if (isOnSale) {
        $scope.loadData(memberId, 1, provinceId, cityId, districtId);
      } else {
        $scope.loadData(memberId, 0, provinceId, cityId, districtId);
      }
      selectedGoodsList = [];
    };
    //选中商品or不选中商品
    $scope.selectGoods = function (index) {
      if ($scope.goodsList[index].isSelected == false) {//当前状态未选中
        $scope.goodsList[index].isSelected = true;//置为选中
        selectedGoodsList.push($scope.goodsList[index].sku);//将选中的商品Id加入到选中商品数组
      } else {
        $scope.goodsList[index].isSelected = false;
        if (selectedGoodsList && selectedGoodsList.length >= 0) {
          var _index = selectedGoodsList.indexOf($scope.goodsList[index].sku);//获取商品Id在选中列表的索引
          selectedGoodsList.splice(_index, 1);//剔除取消勾选的商品
        }
      }
      isAllSelected = selectedGoodsList.length == $scope.goodsList.length;//商品全部勾选，全选为true
    };

    //全选or不全选
    $scope.selectAll = function () {
      if (!isAllSelected) {
        angular.forEach($scope.goodsList, function (goodsData) {
          goodsData.isSelected = true;
        });
        isAllSelected = true;
      } else {
        angular.forEach($scope.goodsList, function (goodsData) {
          goodsData.isSelected = false;
        });
        isAllSelected = false;
      }
    };
    /******************搜索相关**********************/
    $ionicModal.fromTemplateUrl('templates/shop/GoodsSearch.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.searchModal = modal;
    });

    $scope.openSearchModal = function () {
      $scope.searchModal.show();
    };

    $scope.closeSearchModal = function () {
      $scope.searchModal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.searchModal.remove();
    });

    //将筛选出的商品从商品管理中的商品移除
    $scope.removeProduct = function (index) {
      var sku = $scope.searchGoodsList[index].sku;
      $scope.searchGoodsList[index].onShelf = !$scope.searchGoodsList[index].onShelf;
      GoodsService.changeChooseStateDui(sku).
        success(function (response, status, headers, config) {
        });
    };

    //将筛选出的商品添加到商品管理中
    $scope.addProduct = function (index) {
      var sku = $scope.searchGoodsList[index].sku;
      $scope.searchGoodsList[index].onShelf = !$scope.searchGoodsList[index].onShelf;
      GoodsService.changeChooseStateJia(sku, '1').
        success(function (response, status, headers, config) {
        });
    };

    $scope.$on('$ionicView.beforeEnter', function () {
      memberId = UserService.getUser().mid;
      $scope.init();
    })

  }]);


/**
 * creator:feng.jiang@dhc.com.cn
 * create time:16/3/21
 * describe：商品管理服务
 **/
APP.service('GoodsManageService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getGoodsList = function (memberId, onShelf, provinceId, cityId, districtId) {//获取商品列表
    var params = {
      memberId: memberId,
      onShelf: onShelf,
      provinceId: provinceId,
      cityId: cityId,
      districtId: districtId
    };
    return $http.get(UrlService.getUrl('GOODS_LIST'), params);
  };
  this.deleteGoods = function (memberId, sku) {//删除单个商品
    var params = {
      memberId: memberId,
      sku: sku
    };
    return $http.get(UrlService.getUrl('DELETE_GOODS'), params);
  };
  this.updateGoods = function (memberId, sku, onShelf) {//上\下架单个商品
    var params = {
      memberId: memberId,
      sku: sku,
      onShelf: onShelf
    };
    return $http.get(UrlService.getUrl('UPDATE_GOODS'), params);
  };
  this.searchGoods = function (pageIndex, pageSize, memberId, keyword, provinceId, cityId, districtId) {//搜索商品
    var params = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      memberId: memberId,
      keyword: keyword,
      provinceId: provinceId,
      cityId: cityId,
      districtId: districtId
    };
    return $http.get(UrlService.getUrl('SEARCH_GOODS'), params);
  };
  this.updateGoodsBatch = function (skuStr, onShelf) {//批量上\下架商品
    var params = {
      skuStr: skuStr,
      onShelf: onShelf
    };
    return $http.post(UrlService.getUrl('UPDATE_GOODS_BATCH'), params);
  };
  this.deleteGoodsBatch = function (skuStr) {//批量删除商品
    var params = {
      skuStr: skuStr
    };
    return $http.post(UrlService.getUrl('DELETE_GOODS_BATCH'), params);
  };
}]);
