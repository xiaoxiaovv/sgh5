//二级店铺控制器 刘成杰 2017-11-16
APP.controller('secondLevelStoreController', ['UrlService', 'UserService', 'CreditService', 'PopupService', '$stateParams', 'secondLevelStoreService', 'CartService', 'HomePageService', 'GoodsService', '$q', '$localstorage', '$scope', '$state', 'LoginService', '$rootScope', '$ionicModal', 'BranchTypeDetailService', '$ionicScrollDelegate', '$ionicHistory',
  function (UrlService, UserService, CreditService, PopupService, $stateParams, secondLevelStoreService, CartService, HomePageService, GoodsService, $q, $localstorage, $scope, $state, LoginService, $rootScope, $ionicModal, BranchTypeDetailService, $ionicScrollDelegate, $ionicHistory) {
    //是否是app
    if (window.cordova) {
      $scope.isApp = true;
    } else {
      $scope.isApp = false;
    }
    //ios APP特有样式
    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
      $scope.iosAppHeight = {
        "height": "64px",
        "paddingTop":"20px"
      }
      $scope.iosAppPadding = {
        "paddingTop": "64px"
      }
    } else {//其他情况的样式
      $scope.iosAppHeight = {
        "height": "44px",
        "paddingTop":"2px"
      }
      $scope.iosAppPadding = {
        "paddingTop": "44px"
      }
    }
    //判断用户角色信息；0为买家；1为卖家
    $scope.isBuyer = LoginService.getRole();
    $scope.isShowMoreInfo = false;
    $scope.lookMoreImg = $scope.isShowMoreInfo ? "ic_lookMoreActive.png" : "ic_lookMore.png";
    $scope.filterData = ""; //筛选条件
    $scope.productCateIdType = '0';
    $scope.switch = true; //筛选接口查询开关，防止多次请求筛选；
    $scope.filter_index = 0; //筛选数组下标
    $scope.pageIndex = '1'; //分页默认第一页
    $scope.pageSize = '6'; //每页显示几条数据
    //地理位置默认值或者获取失败;
    $scope.pholder = "1";
    $scope.provinceId = '16'; //省分Id  山东
    $scope.cityId = '173'; //市Id   青岛
    $scope.districtId = '2450'; //区Id   崂山
    $scope.streetId = '12036596'; //街道Id  中韩街道
    $scope.hasmore = false; //上拉加载时能标志
    $scope.settingsList = '';//是否显示佣金本地存储
    $scope.checkedIndex = 0;
    $scope.tempList = [];
    $scope.productList = [];
    //佣金和价格 箭头数组
    $scope.arrowState = ['img/ic_sort_state_0.png', 'img/ic_sort_state_1.png', 'img/ic_sort_state_2.png'];
    //佣金 箭头数组 下标
    $scope.commission_index = 0;
    //价格 箭头数组 下标
    $scope.price_index = 0;
    //筛选 图片数组
    $scope.filterState = ['img/ic_screen_state_0.png', 'img/ic_screen_state_1.png'];
    //筛选数组下标
    $scope.filter_index = 0;
    //筛选 接口需要传递的参数 数组
    var tabState = ['', ['commission', 'commissionDesc'], '', 'saleDesc', ['price', 'priceDesc']];
    $scope.filterData = "";
    //默认以销量排序
    $scope.chooseIndex = 3;
    /******************筛选功能相关变量定义start****************/
    $scope.iSPrice = true; //价格展开标志
    $scope.brand = true; //品牌展开标志
    $scope.brandName = ''; //品牌选中项，默认：全部
    $scope.brandList = []; //筛选品牌列表
    //$scope.otherList = [];  //其他筛选列表
    $scope.filterParameterArr = ['hasStock', 'all', '0']; //筛选参数数组
    //$scope.filterOtherPatam = [];//筛选条件中其他参数暂存数组
    //$scope.isCurrent = [[true], [true]];     //其他条件是否选中标识
    $scope.qs = 'saleDesc';
    $scope.StockStateArr = ['all', 'hasStock']; //库存状态数组
    $scope.filterPrice = {
      min: null, //筛选最低价格
      max: null //筛选最高价格
    };
    $scope.filterParams = ''; //请求接口筛选条件参数
    $scope.lstAttributes = []; //筛选属性列表；

    /******************筛选功能相关变量定义end****************/
    //获取地址
    function getAddress() {
      var deferred = $q.defer();
      GoodsService.getAddress()
        .success(function (res) {
          var obj = eval(res.data);
          var regionIndex = obj[0].regionName.indexOf('/');
          $scope.region = obj[0].regionName.substr(0, regionIndex);
          deferred.resolve(obj[0]);
        })
      return deferred.promise;
    }
    //返回上一页
    $scope.goBack = ionic.Utils.debounce(function () {
      $ionicHistory.goBack();
    }, 300);
    //右上角点击三个点
    $scope.showMoreInfo = function () {
      $scope.isShowMoreInfo = !$scope.isShowMoreInfo;
      $scope.lookMoreImg = $scope.isShowMoreInfo ? "ic_lookMoreActive.png" : "ic_lookMore.png";
    }
    //  取消分享
    $scope.cancelShare = function () {
      $scope.showShare = !$scope.showShare;
    }
    //  去分享
    $scope.goToShare = function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (!UserService.getUser().mid) {
        $state.go('login');
        return;
      }
      $scope.showShare = !$scope.showShare;
      $scope.isShowMoreInfo = !$scope.isShowMoreInfo;
      $scope.lookMoreImg = $scope.isShowMoreInfo ? "ic_lookMoreActive.png" : "ic_lookMore.png";
    }
    //点击二级类别
    $scope.clickSecondLevel = function (index) {
      $scope.checkedIndex = index;
      $scope.productCateId = $scope.secTypeList[index].cId;//类目id
      $scope.tempList = [];
      $scope.productList = [];
      $scope.pageIndex = 1; //分页默认第一页
      $scope.pageSize = 6; //每页显示几条数据
      $scope.resetFilter();
      $scope.filterData="";
      getProductList();
    }
    //  跳转到商品详情页
    $scope.goProductDetail = function (pId) {
      $state.go('productDetail', {
        fromType: '',
        fromUrl: '',
        o2oType: 0,
        productId: pId,
        storeId: $scope.storeId
      })
    };
    // 点击底下的模板关闭右上角的更多内容
    $scope.hideMoreDetail = function () {
      $scope.isShowMoreInfo = false;
      $scope.lookMoreImg = $scope.isShowMoreInfo ? "ic_lookMoreActive.png" : "ic_lookMore.png";
    }
    //分享
    $scope.shareToPlatform = function (index) {
      var title = $scope.secTitle,
        content = "找特产，来顺逛，质量更可靠，价格更亲民，特产汇欢迎您的到来~",
        pic = $scope.sPic,
        url = UrlService.getShareLinkHeader() + 'secondLevelStore/' + $stateParams.cityId + '/' + $scope.storeId;
      if (window.umeng) {
        if (index == 0) {
          window.umeng.shareToSina(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
        } else if (index == 1) {
          window.umeng.shareToWechatSession(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
        } else if (index == 2) {
          window.umeng.shareToWechatTimeline(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
        } else if (index == 3) {
          window.umeng.shareToQQ(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
          CreditService.qqShare();
        } else if (index == 4) {
          window.umeng.shareToQzone(title, content, pic, url, 0, null, CreditService.shareSuccessCallback);
          CreditService.qqShare();
        }
        if (index == 5) {
          $scope.copeText(url);
        } else {
          CreditService.successShare();
        }
      } else {
        alert('umeng undefined 只能在app分享');
      }

      $scope.showShare = false;
    };
    //复制
    $scope.copeText = function (text) {
      if (window.cordova) {
        cordova.plugins.clipboard.copy(text);
        PopupService.showToastShort('复制成功');
        $scope.isShowCopyButton = false;
      } else {
        PopupService.showToast('请下载APP执行此操作');
      }
    };
    /* 客服--调插件*/
    $scope.customerServe = function () {
      var chatparams = {
        goods_id: '-1',//二级店铺页等其他页面商品id固定传-1  单品页传商品id正常传  订单传商品id正常传
        clientGoods_type: '1',//传1
        //0:客服端不展示商品信息;1：客服端以商品ID方式获取商品信息(goods_id:商品ID，clientGoods_type = 1时goods_id参数传值不能为空)
        appGoods_type: '0'//单品页传1  订单传3 并吧三下面的四个参数传递过来
      };
      if (window.xneng) {
        window.xneng.NTalkerStartChat('hg_1000_1508927913371', '普通客服组', chatparams, function (success) {
        }, function (error) {
        });
      }
      else {
        window.open('http://m.ehaier.com/v2/h5/sg/common/customService.html' + '?flag=' + $localstorage.get('sg_login_token_secret').substring(6), '_blank', 'location=no');
      }
    };

    //  销量 佣金 价格 筛选 点击事件
    $scope.chooseTab = function (index) {
      //  佣金1  销量3  价格4  筛选2
      if ($scope.chooseIndex == index && index == 3) {
        return;
      }
      if (index == 2) {
        $scope.filter_index = 1; //筛选数组下标
        $scope.chooseIndex = index;
        $scope.commission_index = 0; //佣金 箭头数组 下标
        $scope.price_index = 0; //价格 箭头数组 下标
        $scope.filter_index = 1; //筛选数组下标
        $scope.openFilterModal();
      } else {
        //点击筛选以外的按钮重置筛选
        // $scope.resetFilter();
        $scope.page = 2;
        if (index == 1) { //如果是 佣金
          $scope.chooseIndex = index;
          var commission_index = $scope.commission_index == 1 ? 0 : 1; //佣金图片下标 临时变量
          $scope.commission_index = $scope.commission_index == 1 ? 2 : 1; //佣金 箭头数组 下标
          $scope.filterParams = tabState[1][commission_index]; //请求接口的 参数 佣金
          $scope.price_index = 0; //价格 箭头数组 下标
          $scope.filter_index = 0; //筛选数组下标
          $scope.searchData = [];
          if (commission_index == 1) {
            $scope.qs = "commission"; //佣金倒序
          } else {
            $scope.qs = "commissionDesc"; //佣金正序
          }

        } else if (index == 3) { //如果是 销量
          $scope.chooseIndex = index;
          $scope.filterParams = 'saleDesc'; //请求接口的 参数 销量
          $scope.price_index = 0; //价格 箭头数组 下标
          $scope.commission_index = 0; //佣金 箭头数组 下标
          $scope.filter_index = 0; //筛选数组下标
          $scope.searchData = [];
          $scope.qs = "saleDesc"; //销量
        } else if (index == 4) { //如果是 价格
          $scope.chooseIndex = index;
          var price_index = $scope.price_index == 1 ? 0 : 1; //价格下标 临时变量
          $scope.price_index = $scope.price_index == 1 ? 2 : 1; //价格 箭头数组 下标
          $scope.filterParams = tabState[4][price_index]; //请求接口的 参数 价格
          $scope.filter_index = 0; //筛选数组下标
          $scope.commission_index = 0; //佣金 箭头数组 下标
          $scope.searchData = [];
          if (price_index == 1) {
            $scope.qs = "price"; //价格倒序
          } else {
            $scope.qs = "priceDesc"; //价格正序
          }
        }
        $scope.pageIndex = 1;
        $scope.hasmore = false;

        //页面加载列表--待请求成功清除list
        $scope.tempList = [];
        $scope.productList = [];
        getProductList();
      }
    };

    /******************筛选功能相关方法处理start****************/
    //筛选modal
    $ionicModal.fromTemplateUrl('templates/product/branchTypeDetailModal.html', {
      scope: $scope,
      animation: 'slide-in-left',
      backdropClickToClose: false
    }).then(function (modal) {
      $scope.filterModal = modal;
    });

    //选择品牌
    $scope.changeBrand = function () {
      $scope.brand = !$scope.brand;
    };
    //价格折叠
    $scope.changePrice = function () {
      $scope.iSPrice = !$scope.iSPrice;
    };
    //库存状态筛选方法
    $scope.chooseStockState = function (index) {
      $scope.filterParameterArr[0] = $scope.StockStateArr[index];
    };
    //选择品牌
    $scope.chooseBrand = function (index, item, brandList) {
      var length = brandList.length - 1;
      var n = 0;
      if (item.id != 0) {
        if (item.active == "false") {
          item.active = 'true';
        } else {
          item.active = 'false';
        };
        for (var i = 0; i < brandList.length; i++) {

          if (i > 0 && brandList[i].active == "true") {
            brandList[0].active = 'false';
            n++;
          }
        };
        if (n == length || n == 0) {
          for (var i = 0; i < brandList.length; i++) {
            if (i > 0) {
              brandList[i].active = 'false';
            }
          };
          brandList[0].active = 'true';
        };

      } else {
        //全选反选
        if (item.active == "false") {
          item.active = "true";
          for (var i = 0; i < brandList.length; i++) {
            if (i > 0) {
              brandList[i].active = "false";
            }
          }
        }
      }

    };
    //筛选确定
    $scope.filterEnsure = function () {
      //解决 最小值和最大值输入负数问题
      if ($scope.filterPrice.min < 0 || $scope.filterPrice.max < 0) {
        PopupService.showToast('价格不能为负数');
        return;
      } else if (isNaN($scope.filterPrice.min) || isNaN($scope.filterPrice.max)) {
        PopupService.showToast('价格为数字');
        return;
      }
      if ($scope.filterPrice.min == null && $scope.filterPrice.max == null) {
        $scope.filterParameterArr[2] = '0';
      } else if ($scope.filterPrice.min == null && $scope.filterPrice.max != '') {
        $scope.filterParameterArr[2] = 'Undefined' + ';' + $scope.filterPrice.max;
      } else if ($scope.filterPrice.min == null && $scope.filterPrice.max == '0') {
        $scope.filterParameterArr[2] = 'Undefined' + ';' + $scope.filterPrice.max;
      } else if ($scope.filterPrice.min != '' && $scope.filterPrice.max == null) {
        $scope.filterParameterArr[2] = $scope.filterPrice.min + ';' + 'Undefined';
      } else if ($scope.filterPrice.min == '0' && $scope.filterPrice.max == null) {
        $scope.filterParameterArr[2] = $scope.filterPrice.min + ';' + 'Undefined';
      } else if ($scope.filterPrice.min > $scope.filterPrice.max) {
        PopupService.showToast('最低价不能高于最高价');
        return;
      } else {
        $scope.filterParameterArr[2] = $scope.filterPrice.min + ';' + $scope.filterPrice.max;
      }
      //品牌值拼接
      var brandListData = ""; //品牌
      if ($scope.brandList[0].active == "true") {
        brandListData = "all;";
      } else {
        for (var i = 1; i < $scope.brandList.length; i++) {
          if ($scope.brandList[i].active == "true") {
            brandListData += $scope.brandList[i].id + ';';
          }
        }
      }
      brandListData = brandListData.substring(0, brandListData.length - 1);
      $scope.filterParameterArr[1] = brandListData;

      //属性值拼接
      var lstAttributes = "";
      for (var i = 0; i < $scope.lstAttributes.length; i++) {
        for (var j = 0; j < $scope.lstAttributes[i].lstAttributeOptions.length; j++) {
          if ($scope.lstAttributes[i].lstAttributeOptions[0].active == "true") {
            lstAttributes += '0;';
            break;
          } else {
            if ($scope.lstAttributes[i].lstAttributeOptions[j].active == "true") {
              lstAttributes += $scope.lstAttributes[i].lstAttributeOptions[j].id + ';';
            }
          }
        }
        lstAttributes += ",";
      }

      lstAttributes = lstAttributes.replace(/;,/g, ',')
      $scope.filterParams = $scope.filterParameterArr.join("@");
      $scope.filterParams = $scope.filterParams + '@' + lstAttributes;
      $scope.filterData = $scope.filterParams;
      $scope.searchData = null;
      $scope.filterModal.hide();
      $scope.lianXC = false;
      $scope.pageIndex = 1;
      $scope.hasmore = false;
      $scope.tempList = [];
      $scope.productList = [];
      getProductList();//重新获取筛选后的数据
      $scope.chooseIndex = 2;
      $scope.filter_index = 1; //筛选数组下标
    };
    //筛选条件重置方法
    $scope.resetFilter = function () {
      $scope.brand = true;
      $scope.brandName = '全部';
      $scope.isBrand = [true, false, false, false, false, false, false, false, false];
      //$scope.otherName = ['全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部','全部', '全部'];//其他筛选条件选中项，默认：全部
      $scope.filterParameterArr = ['hasStock', 'all', '0'];
      $scope.filterPrice = {
        min: null,
        max: null
      };
      //重置重新获取列表
      var params = '';
      if ($scope.productCateIdType != 1) {
        //类目  属性
        params = $scope.productCateId;
      };
      $scope.ResGetFilterDataLists(params);
      $ionicScrollDelegate.resize();
    };
    $scope.closeModal = function () {
      $scope.filterModal.hide();
    };
    //打开筛选modal
    $scope.openFilterModal = function () {
      //$scope.resetFilter();
      var params = '';
      if ($scope.productCateIdType != 1) {
        //类目  属性
        params = $scope.productCateId;
      };
      $scope.filterModal.show();
      if ($scope.switch) {
        $scope.switch = false; //防止多次请求
        $scope.getFilterDataLists(params);
      }
    };
    //获取筛选列表
    $scope.getFilterDataLists = function (params) {
      BranchTypeDetailService.getFilterData(params).success(function (response) {
        if (response.success) {
          //判断是否是品牌id
          if ($scope.brandId) {
            for (var i = 0; i < response.data.brandList.length; i++) {
              if ($scope.brandId == response.data.brandList[i].id) {
                response.data.brandList[i].active = 'true';
              } else {
                response.data.brandList[i].active = 'false';
              }
            }
          } else {
            for (var i = 0; i < response.data.brandList.length; i++) {
              if (i == 0) {
                response.data.brandList[i].active = 'true';
              } else {
                response.data.brandList[i].active = 'false';
              }
            }
          }
          $scope.brandList = response.data.brandList;
          //类目 和 属性
          if (response.data.filterMap != null) {
            //类目
            if ($scope.productCateIdType == 0) {
              var arr = response.data.filterMap.lstAttributes;
              var arr2 = [];
              for (var i = 0; i < arr.length; i++) {
                if (arr[i] != null) {
                  if (arr[i].lstAttributeOptions.length) {
                    arr[i].down = 'true';
                    for (var j = 0; j < arr[i].lstAttributeOptions.length; j++) {
                      //默认全部是选中状态
                      if (j == 0) {
                        arr[i].lstAttributeOptions[j].active = 'true';
                      } else {
                        arr[i].lstAttributeOptions[j].active = 'false';
                      }
                    }
                    arr2.push(arr[i]);
                  }
                }
              }
              $scope.lstAttributes = arr2;
            }
            //属性
            if ($scope.productCateIdType == 2) {
              var arr = response.data.filterMap.lstAttributes;
              var arr2 = [];
              for (var i = 0; i < arr.length; i++) {

                if (arr[i] != null) {
                  if (arr[i].lstAttributeOptions.length) {
                    arr[i].down = 'true';
                    for (var j = 0; j < arr[i].lstAttributeOptions.length; j++) {
                      //默认全部是选中状态
                      if (arr[i].lstAttributeOptions[j].id == $scope.attributeId) {
                        arr[i].lstAttributeOptions[j].active = 'true';
                        arr[i].lstAttributeOptions[0].active = 'false';
                      } else {
                        if (j == 0) {
                          arr[i].lstAttributeOptions[j].active = 'true';
                        } else {
                          arr[i].lstAttributeOptions[j].active = 'false';
                        }
                      }
                    }
                    arr2.push(arr[i]);
                  }
                }
              }
              $scope.lstAttributes = arr2;
            }
          }
        }
      });
    };
    //获取筛选列表-重置
    $scope.ResGetFilterDataLists = function (params) {
      BranchTypeDetailService.getFilterData(params).success(function (response) {
        if (response.success) {
          //判断是否是品牌id
          for (var i = 0; i < response.data.brandList.length; i++) {
            if (i == 0) {
              response.data.brandList[i].active = 'true';
            } else {
              response.data.brandList[i].active = 'false';
            }
          }
          $scope.brandList = response.data.brandList;
          //类目 和 属性 $scope.attributeId
          if (response.data.filterMap != null) {
            if ($scope.productCateIdType == 0 || 2) {
              var arr = response.data.filterMap.lstAttributes;
              var arr2 = [];
              for (var i = 0; i < arr.length; i++) {
                if (arr[i] != null) {
                  if (arr[i].lstAttributeOptions.length) {
                    arr[i].down = 'true';
                    for (var j = 0; j < arr[i].lstAttributeOptions.length; j++) {
                      //默认全部是选中状态
                      if (j == 0) {
                        arr[i].lstAttributeOptions[j].active = 'true';
                      } else {
                        arr[i].lstAttributeOptions[j].active = 'false';
                      }
                    }
                    arr2.push(arr[i]);
                  }
                }
              }
              $scope.lstAttributes = arr2;
            }
          }
        }
      });
    };

    //收起展开
    $scope.changeDown = function (item) {
      item.down = !item.down;
    };
    //全选 单选
    $scope.ClickAttributes = function (item, itemParent) {
      var length = itemParent.lstAttributeOptions.length - 1;
      var n = 0;
      if (item.id != 0) {
        if (item.active == "false") {
          item.active = 'true';
        } else {
          item.active = 'false';
        };
        for (var i = 0; i < itemParent.lstAttributeOptions.length; i++) {
          if (i > 0 && itemParent.lstAttributeOptions[i].active == "true") {
            itemParent.lstAttributeOptions[0].active = 'false';
            n++;
          }
        };
        if (n == length || n == 0) {
          for (var i = 0; i < itemParent.lstAttributeOptions.length; i++) {
            if (i > 0) {
              itemParent.lstAttributeOptions[i].active = 'false';
            }
          };
          itemParent.lstAttributeOptions[0].active = 'true';
        };

      } else {
        //全选反选
        if (item.active == "false") {
          item.active = "true";
          for (var i = 0; i < itemParent.lstAttributeOptions.length; i++) {
            if (i > 0) {
              itemParent.lstAttributeOptions[i].active = "false";
            }
          }
        }
      }
    };
    function sortById(obj1, obj2) {
      return obj1.sort - obj2.sort;
    }
    //判断本地是否显示佣金;
    function GetSwitchChecked() {
      $scope.memberId = UserService.getUser().mid;
      var setSwitch = JSON.parse(localStorage.getItem('setSwitch'));
      var isExist = false;
      for (var i = setSwitch.length - 1; i >= 0; i--) {
        if (setSwitch[i].id == $scope.memberId) {
          $scope.settingsList = setSwitch[i].list;
          isExist = true;

        }
      }
      console.log($scope.settingsList);
    }

      //获取商品列表
    function getProductList() {
      secondLevelStoreService.getSecondLevelProduct($scope.storeId, $scope.pageIndex, $scope.pageSize, $scope.filterData, $scope.productCateId, $scope.provinceId, $scope.cityId, $scope.districtId, $scope.streetId, $scope.regionId,$scope.qs)
        .success(function (res) {
          if (res.success) {
            if (res.data.productList) {
              var data=res.data.productList;
              $scope.productList = $scope.productList.concat(res.data.productList);
              if (res.data.isCanSyncGetPrice) {
                GoodsService.asyncPrice(res.data.traceId).success(function (res) {
                  if (res.success) {
                    for(var i=0,l=data.length;i<l;i++){
                      var product=data[i];
                      for(var j=0,m=res.products.length;j<m;j++){
                        var price=res.products[j];
                        if(product.sku==price.sku){
                          product["finalPrice"]=price["finalPrice"];
                          product["commission"]=price["commission"];
                        }
                      }
                    }
                  }
                });
              }
            }
            if ($scope.pageIndex * 6 <= res.totalCount) {
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.hasmore = true;
            } else {
              $scope.hasmore = false;
            }
          } else {
            $scope.productList = [];
            PopupService.showToast(res.message);
          }
        })
    }
    //初始化
    $scope.init = function () {
      var deferCateId = $q.defer();
      var deferAddress = $q.defer();
      var deferAll = $q.all([
        deferCateId.promise,
        deferAddress.promise
      ]);
      $scope.tempList = [];
      $scope.productList = [];
      //佣金 箭头数组 下标
      $scope.commission_index = 0;
      //价格 箭头数组 下标
      $scope.price_index = 0;
      //筛选数组下标
      $scope.filter_index = 0;
      GetSwitchChecked();
      $scope.isBuyer = LoginService.getRole();
      $scope.cartTotalNum = 0;//购物车数量
      $scope.filterParams = ''; //请求接口筛选条件参数
      $scope.regionId = $stateParams.cityId;
      $scope.pageIndex = 1;
      $scope.pageSize = 6;
      $scope.checkedIndex = 0;
      $scope.chooseIndex = 3;
      secondLevelStoreService.getSecTypeList($scope.regionId)
        .success(function (res) {
          if (res.success) {
            $scope.secTitle = res.data.pathName;
            $scope.sPic = res.data.sPic;
            $scope.secTypeList = JSON.parse(res.data.classify).sort(sortById);//按sort从小到大排序
            $scope.productCateId = $scope.secTypeList[0].cId;//默认类目id 选择第一个类目的id
            deferCateId.resolve();
          }
        })
      getAddress()
        .then(function (res) {
          $scope.provinceId = res.provinceId;
          $scope.cityId = res.cityId;
          $scope.areaId = res.areaId;
          $scope.districtId = res.areaId;
          $scope.streetId = res.streetId;

          $scope.page = 1;
          //页面加载获取列表
          deferAddress.resolve();
        });
        deferAll.then(function(){
          $scope.filterData = '';
        getProductList();
      })
      CartService.getNumber()
        .success(function (res) {
          if (res.success) {
            $scope.cartTotalNum = res.data;
          } else {
            $scope.cartTotalNum = 0;
          }
        });
    };
    //上拉加载
    $scope.loadMore = function () {
      $scope.pageIndex = $scope.pageIndex + 1;
      getProductList();
    }

    /******************筛选功能相关方法处理end****************/
    $scope.$on('$ionicView.beforeLeave', function (e, v) {
      //点击筛选以外的按钮重置筛选
      $scope.resetFilter();
      $scope.hideMoreDetail();
    })
    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      if (v.direction == 'back') {
        CartService.getNumber()
          .success(function (res) {
            if (res.success) {
              $scope.cartTotalNum = res.data;
            } else {
              $scope.cartTotalNum = 0;
            }
          });
        return;
      } else {
         if($stateParams.shareId){
          $rootScope.shareId = $stateParams.shareId;
        }
        $scope.storeId = $localstorage.get('storeId', $rootScope.globalConstant.storeId);
        $scope.init();
      }
    })
  }]);

//二级店铺服务 刘成杰 2017-11-16
APP.service('secondLevelStoreService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getSecondLevelProduct = function (storeMemberId, pageIndex, pageSize, filterData, productCateId, provinceId, cityId, districtId, streetId, pageId,qs) {
    var params = {
      storeMemberId: storeMemberId,
      pageIndex: pageIndex,
      pageSize: pageSize,
      filterData: filterData,   //筛选选项
      qs: qs||'',
      productCateId: productCateId,  //类目id
      provinceId: provinceId,
      cityId: cityId,
      districtId: districtId,
      streetId: streetId,
      pageId: pageId   //场馆Id
    }
    return $http.get(UrlService.getUrl("SECONDLEVEL_PRODUCTLIST"), params)
  }
  this.getSecTypeList = function (regionId) {
    var params = {
      regionId: regionId
    }
    return $http.get(UrlService.getNewUrl("SECONDLEVEL_SECTYPELIST"), params)
  }
}]);
