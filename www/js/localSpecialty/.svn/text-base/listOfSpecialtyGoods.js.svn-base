APP.controller('ListOfSpecialtyGoodsController', ['CartService','$ionicPlatform','$ionicHistory','UrlService', 'trueAuthenticationService', '$localstorage', 'GoodsSearchService', 'RegisterService', '$ionicModal', 'ShopService', '$q', 'GoodsService', 'CalculateStrLength', '$interval', '$http', '$scope', '$stateParams', '$ionicSlideBoxDelegate',
  '$state', 'UserService', '$timeout', '$rootScope', '$ionicScrollDelegate', 'CommonAddressService', 'BannerThemeService', 'PopupService', 'localSpecialtyHomePageService','ListOfSpecialtyGoodsControllerService', 'LoginService','HomePageService', 'CreditService', 'BannerThemeService', 'CommonAddressService',
  function (CartService,$ionicPlatform,$ionicHistory,UrlService, trueAuthenticationService, $localstorage, GoodsSearchService, RegisterService, $ionicModal, ShopService, $q, GoodsService, CalculateStrLength, $interval, $http, $scope, $stateParams, $ionicSlideBoxDelegate, $state, UserService, $timeout, $rootScope, $ionicScrollDelegate, CommonAddressService, BannerThemeService, PopupService, localSpecialtyHomePageService, ListOfSpecialtyGoodsControllerService,LoginService,HomePageService,CreditService,BannerThemeService,CommonAddressService) {
    $scope.isDisplay = false;
    $scope.menuImg = $rootScope.imgBaseURL + 'img/ic_lookMore.png';
    $scope.priceArr = [];

    $scope.showShare = false;
    $scope.canLoadMore = true;
    $scope.chooseIndex = 3;
    $scope.switch = true;
    $scope.filterData = '';
    $scope.qs = 'saleDesc'; //新添加排序字段  price priceDesc commission commissionDesc saleDesc


    // console.log( $scope.isBuyer);

    $scope.storeId = $localstorage.get('storeId', $rootScope.globalConstant.storeId);
    // $scope.enabledLoadMore = true;

    $scope.pageIndex = 1;
    $scope.midCommList = [];

    $scope.iSPrice = true; //价格展开标志
    $scope.brand = true; //品牌展开标志
    $scope.brandName = ''; //品牌选中项，默认：全部
    $scope.brandList = []; //筛选品牌列表
    //$scope.otherList = [];  //其他筛选列表
    $scope.filterParameterArr = ['hasStock', 'all', '0']; //筛选参数数组
    //$scope.filterOtherPatam = [];//筛选条件中其他参数暂存数组
    //$scope.isCurrent = [[true], [true]];     //其他条件是否选中标识
    $scope.StockStateArr = ['all', 'hasStock']; //库存状态数组
    $scope.filterPrice = {
      min: null, //筛选最低价格
      max: null //筛选最高价格
    };
    $scope.filterParams = ''; //请求接口筛选条件参数
    $scope.lstAttributes = []; //筛选属性列表；


    $scope.arrowState = [$rootScope.imgBaseURL + 'img/ic_sort_state_0.png', $rootScope.imgBaseURL + 'img/ic_sort_state_1.png', $rootScope.imgBaseURL + 'img/ic_sort_state_2.png']; //佣金和价格 箭头数组
    $scope.commission_index = 0; //佣金 箭头数组 下标
    $scope.price_index = 0; //价格 箭头数组 下标
    $scope.filterState = [$rootScope.imgBaseURL + 'img/ic_screen_state_0.png', $rootScope.imgBaseURL + 'img/ic_screen_state_1.png']; //筛选 图片数组
    $scope.filter_index = 0;






    $scope.iSDataLeftRight = false;
    $scope.isListNull = false;
    $scope.leftDataListIndex = 1;
    $scope.leftDataList = [{navigationName:'全部',id:''}];
    $scope.rightDataList = [];
    // $scope.pageId = $stateParams.pageId;

    $scope.listModal = null;
    $ionicModal.fromTemplateUrl('templates/localSpecialty/specialClassificationSelection.html', {
      scope: $scope,
      animation: 'slide-in-left',
      backdropClickToClose: false
    }).then(function(modal) {
      $scope.listModal = modal;

    });

    $scope.closeListModal = function () {
      // $ionicHistory.goBack();
      $scope.listModal.hide();
      $scope.leftDataList = [{navigationName:'全部',id:''}];
    }

    $scope.getQueryString = function(name, str) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = str.substr(0).match(reg);
      if (r != null) return r[2]; return '';
    }
    $scope.backToList = function (item) {
      console.log(item.url);
      // $scope.reset
      // console.log(item);
      $scope.midCommList = [];
       $scope.priceArr = [];
      var productCateId = $scope.getQueryString('productCateId', item.url);
      // console.log(productCateId);
      var brandId = $scope.getQueryString('brandId', item.url);
      // console.log(brandId);
      if (brandId != '') {
        $scope.filterData = 'hasStock@' + brandId + '@0';
      } else {
          // $scope.filterData = 'saleDesc';
          $scope.qs = 'saleDesc';
      }
      // $scope.resetFilter();
      $scope.filter_index = 0;
      $scope.chooseIndex = 3;
      $scope.title = item.navigationName;
      $scope.productCateId = productCateId;
      $scope.listModal.hide();
      $scope.getListData();
      $ionicScrollDelegate.scrollTop();
      // console.log(arr);
      // $state.go('ListOfSpecialtyGoods', {
      //   productCateId:productCateId,
      //   pageId:$scope.pageId,
      //   title: item.navigationName
      // });

    }
    var parentId = '0';
    // var parentId = '0';
    $scope.getList = function() {
      //更新轮播
      // $ionicSlideBoxDelegate.$getByHandle('selection_slider').update();
      // $ionicSlideBoxDelegate.$getByHandle('selection_slider').loop(true);
      // $ionicSlideBoxDelegate.$getByHandle('selection_slider').start();

      ListOfSpecialtyGoodsControllerService.getLeftList($scope.pageId).success(function (res) {
        // console.log(res);
        if (res.success && res.data.length>0) {
          // $scope.leftDataList = res.data;
          $scope.leftDataList = [{navigationName:'全部',id:''}];
          for (var i = 0; i < res.data.length; i ++) {
            $scope.leftDataList.push(res.data[i]);
          }
          // var leftId = res.data[0].id;
          parentId = res.data[0].id;
          ListOfSpecialtyGoodsControllerService.getRightList($scope.leftDataList[$scope.leftDataListIndex].id,$scope.pageId).success(function (res) {
            // console.log(res);
            // if (res.success) {
            //   $scope.rightDataList = res.data
            //   if ($scope.rightDataList.length ==0) {
            //     $scope.isListNull =true;
            //   }
            // }

            if (res.success) {
              if (res.data.length == 0) {
                $scope.isListNull = true;
              } else {
                $scope.isListNull = false;
              }
              //改装后台数据二三级对应关系;
              var arr = [];
              var slideList = []; //轮播图数组
              for (var i = 0; i < res.data.length; i++) {
                // console.log(res.data[i].parentId,parentId)
                if (res.data[i].parentId == parentId && res.data[i].levels == 2) {

                  res.data[i].children = []; //加一个三级数组
                  arr.push(res.data[i]);
                } else if (res.data[i].levels == 1) {
                  slideList.push(res.data[i]);
                }
              }
              for (var i = 0; i < res.data.length; i++) {
                for (var j = 0; j < arr.length; j++) {
                  if (res.data[i].parentId == arr[j].id) {
                    arr[j].children.push(res.data[i]);
                  }
                }
              }
              $scope.rightDataList = arr;
              $scope.slideImage = slideList;
              // console.log($scope.rightDataList);
              //同步更新轮播视图
              $ionicSlideBoxDelegate.$getByHandle('classify_slider').update();
              // $ionicSlideBoxDelegate.$getByHandle('selection_slider').update();
              $ionicSlideBoxDelegate.$getByHandle('classify_slider').loop(true);
              $ionicSlideBoxDelegate.$getByHandle('classify_slider').start();

            } else {
              $scope.isListNull = true;
              // $ionicSlideBoxDelegate.update();
              $ionicSlideBoxDelegate.$getByHandle('classify_slider').update();
              $ionicSlideBoxDelegate.$getByHandle('classify_slider').loop(true);
              $ionicSlideBoxDelegate.$getByHandle('classify_slider').start();
            }
          })
        } else {
          $scope.iSDataLeftRight = true;
        }
      })

    };
    //获取数量
    $scope.getCartNum = function () {
      CartService.getNumber()
        .success(function (res) {
          if(res.success){
            $scope.cartTotalNum = res.data;
          }else{
            $scope.cartTotalNum = 0;
          }
        })
    };
    $scope.selectTab = function (id, index) {
      // console.log(index);
      parentId = id;
      // console.log(id);


      if (index == 0) {
        $scope.productCateId = 0;
        $scope.title = '全部商品';
        $scope.listModal.hide();
        $scope.commission_index = 0;
        $scope.price_index = 0;
        // $scope.filterData = 'saleDesc';
        // $scope.getListData();
        $scope.chooseTab(3);
        return;
      }
      if (index == $scope.leftDataListIndex) {
        return;
      }
      $scope.leftDataListIndex = index;
      ListOfSpecialtyGoodsControllerService.getRightList(id, $scope.pageId).success(function (res) {
        // console.log(res);
        // if (res.success) {
        //   $scope.rightDataList = res.data
        // }
        if (res.success) {
          if (res.data.length == 0) {
            $scope.isListNull = true;
          } else {
            $scope.isListNull = false;
          }
          //改装后台数据二三级对应关系;
          var arr = [];
          var slideList = []; //轮播图数组
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].parentId == id && res.data[i].levels == 2) {
              res.data[i].children = []; //加一个三级数组
              arr.push(res.data[i]);
            } else if (res.data[i].levels == 1) {
              slideList.push(res.data[i]);
            }
          }
          for (var i = 0; i < res.data.length; i++) {
            for (var j = 0; j < arr.length; j++) {
              if (res.data[i].parentId == arr[j].id && res.data[i].levels != '1') {
                // console.log(res.data[i]);
                arr[j].children.push(res.data[i]);
              }
            }
          }
          $scope.rightDataList = arr;
          $scope.slideImage = slideList;
          // console.log($scope.slideImage);
          //同步更新轮播视图
          $ionicSlideBoxDelegate.update();
          $ionicSlideBoxDelegate.$getByHandle('selection_slider').update();
          $ionicSlideBoxDelegate.$getByHandle('selection_slider').loop(true);
          $ionicSlideBoxDelegate.$getByHandle('selection_slider').start();

        } else {
          $scope.isListNull = true;
          $ionicSlideBoxDelegate.update();
          $ionicSlideBoxDelegate.$getByHandle('selection_slider').update();
          $ionicSlideBoxDelegate.$getByHandle('selection_slider').loop(true);
          $ionicSlideBoxDelegate.$getByHandle('selection_slider').start();
        }
      })
    }


    //点击轮播图执行方法
    $scope.bannerClick = function (imageItem) {
      // console.log(2232132);
      $scope.listModal.hide();
      var relationId = imageItem.bannerId;
      var link = imageItem.url;
      var tempArr = link.split('&');
      switch (imageItem.linkType) {
        case -1: //日常活动
          BannerThemeService.getBannerTheme(relationId)
            .success(function (response) {
              // console.log(response);
              $state.go('bannerDaily', {
                bannerId: relationId,
                layout: response.data.layout
              });
            });
          break;
        case 0: //主体活动
          $state.go('bannerTheme', {
            bannerId: relationId
          });
          break;
        case 1: //单品页
          var productId = tempArr[0].slice(tempArr[0].indexOf('=') + 1);
          $state.go('productDetail', {
            fromType: '',
            fromUrl: '',
            o2oType: 0,
            productId: productId,
            storeId: $scope.memberId
          });
          break;
        case 2: //领券中心/优惠券详情页
          if (!link) {
            $state.go('getCouponsList');
          } else {
            var couponsId = link.slice(link.indexOf('=' + 1));
            $state.go('couponsDetail', {
              cId: couponsId,
              userID: $scope.memberId,
              type: 2
            });
          }
          break;
        case 3: //游戏页
          var gameId = link.split('=')[1];
          $state.go('game', {
            gameId: gameId
          });
          break;
        case 4: //活动页
          if (tempArr[0].slice(tempArr[0].indexOf('=') + 1) == '日常活动') {
            BannerThemeService.getBannerTheme(tempArr[1].slice(tempArr[1].indexOf('=') + 1))
              .success(function (response) {
                // console.log(response);
                $state.go('bannerDaily', {
                  bannerId: tempArr[1].slice(tempArr[1].indexOf('=') + 1),
                  layout: response.data.layout
                });
              });
          } else if (tempArr[0].slice(tempArr[0].indexOf('=') + 1) == '主题活动') {
            $state.go('bannerTheme', {
              bannerId: tempArr[1].slice(tempArr[1].indexOf('=') + 1)
            });
          }
          break;
        case 5: //自定义类型页
          if (window.cordova) {
            /**
             * H5跳转原生webView页面
             * @param resultUrl {String} 链接url
             * @param title {String} 标题
             *
             */
            if(link.indexOf('m.ehaier.com/www/index.html')!=-1){
              var url = link.slice(link.indexOf('#/'));
              window.location.hash=url;
            }else{
              window.emc.presentH5View(link, "");
            }
          } else {
            window.open(link, '_blank', 'location=yes');
          }
          break;
        case 6: //众筹
          $state.go('crowdFunding');
          break;
        case 7: //新品
          if (!link) {
            $state.go('newSend');
          } else {
            $state.go('productDetail', {
              fromType: '',
              fromUrl: '',
              o2oType: 0,
              productId: link,
              storeId: $scope.memberId
            });
          }
          break;
        case 8: //社群
          if (!link) {
            $state.go('topic.qhot');
          } else {
            $state.go('noteDetails', {
              noteId: tempArr[0].slice(tempArr[0].indexOf('=') + 1),
              isShortStory: tempArr[1].slice(tempArr[1].indexOf('=') + 1)
            })
          }
          break;
      }
    };








    /*头部*/
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
    };

    var provinceId;
    var cityId;
    var districtId;
    var streetId;
    $scope.$on('$ionicView.beforeEnter', function(event,data) {

      if(data.direction == 'back'){
          $scope.isBuyer = LoginService.getRole();
          // ListOfSpecialtyGoodsControllerService.getShareImgUrl($scope.pageId).success(function(res){
          //     if (res.success) {
          //         $scope.shareImgUrl = res.data.sPic;
          //     }
          // })
          HomePageService.isWdHost().success(function (res) {
              $rootScope.isWdHost = res.data.isHost;
          })
          $scope.getCartNum();
          GetSwitchChecked();console.log(1234567);

        return;
      }
      $scope.title = '全部商品';
      $scope.chooseIndex = 3;
      $scope.commission_index = 0;
      $scope.filter_index = 0;
      $scope.price_index = 0;
      // console.log('buyer',$scope.isBuyer);
      // 获取地址id
      $scope.pageId = $stateParams.pageId;
      $scope.productCateId = $stateParams.productCateId;
      // $scope.filterData = 'saleDesc';
      $scope.qs = 'saleDesc';
      ListOfSpecialtyGoodsControllerService.getPositionId().success(function (res) {
        // console.log(11111,res);
        if (res.success) {
          var data = eval(res.data)[0];
          provinceId = data.provinceId;
          cityId = data.cityId;
          districtId = data.areaId;
          streetId = data.streetId;
          // console.log(data);
          //provinceId=16&cityId=173&districtId=2450&streetId=12036596&pageIndex=1&pageSize=5&storeMemberId=138990972&filterData=all@all@0@&pageId=4
          if (provinceId != undefined && cityId != undefined && districtId != undefined && streetId != undefined) {
            $scope.getListData();
          } else {
            var addressData = CommonAddressService.getAddressInfo();
            provinceId = addressData.provinceId;
            cityId = addressData.cityId;
            districtId = addressData.areaId;
            streetId = addressData.streetId;
            $scope.getListData();
          }
        } else {
          var addressData = CommonAddressService.getAddressInfo();
            provinceId = addressData.provinceId;
            cityId = addressData.cityId;
            districtId = addressData.areaId;
            streetId = addressData.streetId;
            $scope.getListData();
        }
      })
        $scope.isBuyer = LoginService.getRole();
        // ListOfSpecialtyGoodsControllerService.getShareImgUrl($scope.pageId).success(function(res){
        //     if (res.success) {
        //         $scope.shareImgUrl = res.data.sPic;
        //     }
        // })
        HomePageService.isWdHost().success(function (res) {
            $rootScope.isWdHost = res.data.isHost;
        })
        $scope.getCartNum();
        GetSwitchChecked();
    });
    $scope.settingsList = '';//是否显示佣金本地存储
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
    }
    $scope.getListData = function () {
      ListOfSpecialtyGoodsControllerService.getProductsList( $scope.pageIndex, $scope.filterData, $scope.productCateId,provinceId, cityId, districtId, streetId, $scope.pageId, $scope.qs).success(function (res) {
        // console.log(res);
        if (res.success) {
          $scope.midCommList = res.data.productList;
          // console.log(res.totalCount);
          if (res.totalCount > $scope.midCommList.length) {
            $scope.canLoadMore = true;
          } else {
            $scope.canLoadMore = false;
          }
          // console.log($scope.canLoadMore);
          if (res.data.isCanSyncGetPrice) {
            ListOfSpecialtyGoodsControllerService.getAsyncPrice(res.data.traceId).success(function (response) {
              // console.log(response);
              if (response.success) {
                $scope.priceArr = response.products;

                // console.log($scope.priceArr);
              }


            })
          }
        }

      })
    }
    $scope.$on('$ionicView.beforeLeave', function () {
      //点击筛选以外的按钮重置筛选
      $scope.resetFilter();
      $scope.isDisplay = false;
      $scope.menuImg = $rootScope.imgBaseURL + 'img/ic_lookMore.png';
    });

    $ionicModal.fromTemplateUrl('templates/product/branchTypeDetailModal.html', {
      scope: $scope,
      animation: 'slide-in-left',
      backdropClickToClose: true
    }).then(function(modal) {
      
      $scope.filterModal = modal;
    });
    $scope.closeModal = function () {
      $scope.filterModal.hide();
    }
    $scope.goClassification = function () {
      // $state.go('specialClassificationSelection', {'pageId':$scope.pageId})
      // $state.listModal.show();
      // console.log($scope.listModal);
      $scope.pageIndex = 1;
      $scope.listModal.show();

      $scope.getList();
      $scope.leftDataListIndex = 1;
    }


    $scope.chooseTab = function (index) {
      // console.log(index);
      // $scope.chooseIndex = index;
      // if (index == 2) {
      //   $scope.filterModal.show();
      // }
      // console.log(index);
      // // $scope.chooseIndex
      // // == index;
      // switch (index) {
      //   case 1:
      //     $scope.commission_index = 1;
      //     $scope.price_index = 0;
      //     $scope.filter_index = 0;
      //     break;
      //   case 2:
      //     $scope.commission_index = 0;
      //     $scope.price_index = 0;
      //     $scope.filter_index = 1;
      //     break;
      //   case 3:
      //     $scope.commission_index = 0;
      //     $scope.price_index = 0;
      //     $scope.filter_index = 0;
      //     break;
      //   case 4:
      //     $scope.commission_index = 0;
      //     $scope.price_index = 1;
      //     $scope.filter_index = 0;
      //     break;
      //
      // }
      $ionicScrollDelegate.scrollTop();
      //综合0  佣金1  销量3  价格4  筛选2
      // if ($scope.chooseIndex == index && index == 3) {
      //   return;
      // }
      if (index == 2) {
        if  ($scope.productCateId == null || $scope.productCateId == '' || $scope.productCateId == undefined) {
          $scope.title = '全部商品';
        }
        $scope.filter_index = 1; //筛选数组下标
        $scope.chooseIndex = index;
        $scope.comprehensive_index = 0; //综合箭头数组下标
        $scope.commission_index = 0; //佣金 箭头数组 下标
        $scope.price_index = 0; //价格 箭头数组 下标
        $scope.filter_index = 1; //筛选数组下标
        $scope.showComprehensiveSub = false;
        $scope.filterModal.show();
        // if ($scope.switch) {
          // $scope.switch = false; //防止多次请求
          var params = {
            productCateId: $scope.productCateId
          }
          $scope.getFilterDataLists(params);
        // }
      } else {
        //点击筛选以外的 重置筛选选项
        // $scope.resetFilter();
        //切换时 先把页面滚动到顶部
        $ionicScrollDelegate.scrollTop();
        $scope.page = 2;
        // $scope.chooseIndex = index;
        //如果是 综合
        if (index == 0) {
          $scope.showComprehensiveSub = !$scope.showComprehensiveSub; //综合 子选项的显示开关
          if ($scope.showComprehensiveSub) {
            if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
              $scope.comprehensiveSubHeight = {
                "height": window.innerHeight - 44 + "px",
                "top": "108px"
              }
            } else {
              $scope.comprehensiveSubHeight = {
                "height": window.innerHeight - 44 + "px",
                "top": "88px"
              }
            }
          } else {

            if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
              $scope.comprehensiveSubHeight = {
                "height": "auto",
                "top": "108px"
              }
            } else {
              $scope.comprehensiveSubHeight = {
                "height": "auto",
                "top": "88px"
              }
            }
          }
          // $scope.comprehensive_index = 1;//综合 数组下标变化 0 1 之间变化
          return;
        } else if (index == 1) { //如果是 佣金
          $scope.lianXC = false;
          $scope.chooseIndex = index;
          $scope.showComprehensiveSub = false;
          var commission_index = $scope.commission_index == 1 ? 0 : 1; //佣金图片下标 临时变量
          $scope.commission_index = $scope.commission_index == 1 ? 2 : 1; //佣金 箭头数组 下标
          // $scope.filterParams = tabState[1][commission_index]; //请求接口的 参数 佣金
          $scope.comprehensive_index = 0; //综合 数组下标变化
          $scope.price_index = 0; //价格 箭头数组 下标
          $scope.filter_index = 0; //筛选数组下标
          $scope.searchData = [];
          if (commission_index == 1) {
            // $scope.filterData = "commission"; //佣金倒序
            $scope.qs = "commission";
          } else {
            // $scope.filterData = "commissionDesc"; //佣金正序
            $scope.qs = "commissionDesc";
          }

        } else if (index == 3) { //如果是 销量
          $scope.lianXC = false;
          $scope.chooseIndex = index;
          $scope.showComprehensiveSub = false;
          // $scope.filterParams = 'saleDesc'; //请求接口的 参数 销量
          $scope.price_index = 0; //价格 箭头数组 下标
          $scope.commission_index = 0; //佣金 箭头数组 下标
          $scope.comprehensive_index = 0; //综合 数组下标变化
          $scope.filter_index = 0; //筛选数组下标
          $scope.searchData = [];
          // $scope.filterData = "saleDesc"; //销量
          $scope.qs = "saleDesc";
        } else if (index == 4) { //如果是 价格
          $scope.lianXC = false;
          $scope.chooseIndex = index;
          $scope.showComprehensiveSub = false;
          var price_index = $scope.price_index == 1 ? 0 : 1; //价格下标 临时变量
          $scope.price_index = $scope.price_index == 1 ? 2 : 1; //价格 箭头数组 下标
          // $scope.filterParams = tabState[4][price_index]; //请求接口的 参数 价格
          $scope.filter_index = 0; //筛选数组下标
          $scope.commission_index = 0; //佣金 箭头数组 下标
          $scope.comprehensive_index = 0; //综合 数组下标变化
          $scope.searchData = [];
          if (price_index == 1) {
            // $scope.filterData = "price"; //价格倒序
            $scope.qs = "price";
          } else {
            // $scope.filterData = "priceDesc"; //价格正序
            $scope.qs = "priceDesc";
          }
        }
        $scope.pageIndex = 1;
        $scope.canLoadMore = false;
        $scope.ResGetList(); //获取列表数据--刷新
      }

    }
    $scope.ResGetList = function () {
      console.log($scope.productCateId);
      ListOfSpecialtyGoodsControllerService.getProductsList($scope.pageIndex, $scope.filterData, $scope.productCateId,provinceId, cityId, districtId, streetId, $scope.pageId, $scope.qs).success(function (res) {
        // console.log(res);
        if (res.success) {
          // for (var i = 0; i < res.data.productList.length; i++) {
          //   $scope.midCommList.push(res.data.productList[i]);
          // }
          $scope.midCommList = res.data.productList;
          // console.log(res.totalCount);
          if (res.totalCount > $scope.midCommList.length) {
            $scope.canLoadMore = true;
          } else {
            $scope.canLoadMore = false;
          }
          // $scope.$broadcast('scroll.infiniteScrollComplete');
          if (res.data.isCanSyncGetPrice) {
            ListOfSpecialtyGoodsControllerService.getAsyncPrice(res.data.traceId).success(function (response) {
              // console.log(response);
              if (response.success) {
                $scope.priceArr = response.products;
                // for  (var i = 0; i < res.data.products.length; i ++) {
                //   $scope.priceArr.push(res.data.products[i]);
                // }
              }



            })
          }

        }
      })

    }


    //获取筛选列表
    $scope.getFilterDataLists = function(params) {
      ListOfSpecialtyGoodsControllerService.getFilterData(params).success(function(response) {
        // console.log(response);
        if (response.success) {
          //判断是否是品牌id
          for (var i = 0; i < response.data.brandList.length; i++) {
            if($scope.filterParameterArr && $scope.filterParameterArr[1] && $scope.filterParameterArr[1] != 'all'){ // 已选择的品牌项
              if(($scope.filterParameterArr[1].indexOf(response.data.brandList[i].id)> -1)){
                if(i>0){
                  response.data.brandList[i].active = 'true';
                }
              }else {
                response.data.brandList[i].active = 'false';
              }
            }else{
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
    $scope.ResGetFilterDataLists = function(params) {
      ListOfSpecialtyGoodsControllerService.getFilterData(params).success(function(response) {
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


    //选择品牌
    $scope.changeBrand = function() {
      $scope.brand = !$scope.brand;
    };
    //价格折叠
    $scope.changePrice = function() {
      $scope.iSPrice = !$scope.iSPrice;
    };
    //库存状态筛选方法
    $scope.chooseStockState = function(index) {
      $scope.filterParameterArr[0] = $scope.StockStateArr[index];
    };
    //选择品牌
    $scope.chooseBrand = function(index, item, brandList) {
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
    $scope.filterEnsure = function() {
      if  ($scope.productCateId == null || $scope.productCateId == '' || $scope.productCateId == undefined) {
        $scope.title = '全部商品';
      }
      //解决 最小值和最大值输入负数问题
      if ($scope.filterPrice.min < 0 || $scope.filterPrice.max < 0) {
        PopupService.showToast('价格不能为负数');
        return;
      } else if (isNaN($scope.filterPrice.min) || isNaN($scope.filterPrice.max)) {
        PopupService.showToast('价格为数字');
        return;
      }
      $ionicScrollDelegate.scrollTop();
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
      $scope.contentDataList = [];
      $scope.contentDataListxyz = [];
      $scope.ResGetList(); //获取列表数据--刷新
      $scope.chooseIndex = 2;
      $scope.filter_index = 1; //筛选数组下标
    };

    //筛选条件重置方法
    $scope.resetFilter = function() {
      // console.log(213123)
      $ionicScrollDelegate.scrollTop();
      $scope.brand = true;
      $scope.brandName = '全部';
      $scope.isBrand = [true, false, false, false, false, false, false, false, false];
      //$scope.otherName = ['全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部', '全部','全部', '全部'];//其他筛选条件选中项，默认：全部
      $scope.filterParameterArr = ['hasStock', 'all', '0'];
      $scope.filterPrice = { min: null, max: null };
      //重置重新获取列表
      var params = '';
      if ($scope.productCateIdType != 1) {
        //类目  属性
        params = $scope.productCateId;
      };
      $scope.ResGetFilterDataLists(params);
      $ionicScrollDelegate.resize();
    };

    $scope.loadMore = function () {
      $scope.pageIndex ++;
      ListOfSpecialtyGoodsControllerService.getProductsList( $scope.pageIndex, $scope.filterData, $scope.productCateId,provinceId, cityId, districtId, streetId, $scope.pageId, $scope.qs).success(function (res) {
        // console.log(res);
        if (res.success) {
          for (var i = 0; i < res.data.productList.length; i++) {
            $scope.midCommList.push(res.data.productList[i]);
          }
          // $scope.midCommList = res.data.productList;
          // console.log(res.totalCount);


          if (res.data.isCanSyncGetPrice) {
            ListOfSpecialtyGoodsControllerService.getAsyncPrice(res.data.traceId).success(function (response) {
              // console.log(response);
              if (response.success) {
                // console.log();
                // $scope.priceArr = res.data.products;
                for  (var i = 0; i < response.products.length; i ++) {
                  $scope.priceArr.push(response.products[i]);
                }
              }
              if (res.totalCount > $scope.midCommList.length) {
                $scope.canLoadMore = true;
              } else {
                $scope.canLoadMore = false;
              }
              $scope.$broadcast('scroll.infiniteScrollComplete');


            })
          }

        }
      })

    }
    /*返回*/
    $scope.goBack = function() {
      $scope.pageIndex = 1;
      $ionicHistory.goBack();
      // $state.go('SpecialtyVenueHome', {
      //   regionId:$scope.pageId
      //
      // });
    }

    $scope.showMenu = function () {
      if ($scope.isDisplay) {
        $scope.isDisplay = false;
        $scope.menuImg = $rootScope.imgBaseURL + 'img/ic_lookMore.png'
      } else {
        $scope.isDisplay = true;
        $scope.menuImg = $rootScope.imgBaseURL + 'img/ic_lookMoreActive.png'
      }
    }
    $scope.hideMenu = function () {
      $scope.isDisplay = false;
      $scope.menuImg = $rootScope.imgBaseURL + 'img/ic_lookMore.png'
    }
    $scope.cancelShare = function () {
      $scope.showShare = false;
    }
    // $scope.showHomePageTipImg = false;
    // $scope.showHomePageTipImg = false;
    $scope.toShare = function () {
      $scope.isDisplay = false;
      $scope.menuImg = $rootScope.imgBaseURL + 'img/ic_lookMore.png';

      if (!window.cordova) {

            $scope.showPopup('请下载APP执行此操作');
            return;
        }
      if (!UserService.isUserLogin()) {
        $state.go('login');
        return;
      }
      $scope.showShare = true;

      if (window.device) {

        // if (!$scope.productModel) {
        //   $scope.showPopup('网络连接失败，请稍后分享');
        //   return;
        // }
        $scope.shareToPlatform();
        //新分享样式
        $scope.showShare = !$scope.showShare;
        /*********************分享标签－whiteBird end*********************/
      }
    }
    $scope.showPopup = function (message) {
      // console.log(message);
      var myPopup = $ionicPopup.show({
        template: message
      });
      $timeout(function () {
        myPopup.close();
      }, 1000);
    };
    $scope.toHomePage = function () {
      $scope.isDisplay = false;
      $state.go('homePage');
    }
    $scope.contactCustomer = function () {
      $scope.isDisplay = false;
      if (UserService.isUserLogin()) { //如果没有登录 跳转到登录页面
        // $state.go('login');
        var chatparams = {
          goods_id:'-1',//消息页等其他页面商品id固定传-1  单品页传商品id正常传  订单传商品id正常传
          clientGoods_type:'1',//传1
          //0:客服端不展示商品信息;1：客服端以商品ID方式获取商品信息(goods_id:商品ID，clientGoods_type = 1时goods_id参数传值不能为空)
          appGoods_type:'0'//单品页传1  订单传3 并吧三下面的四个参数传递过来
        };
        if (window.xneng) {
          window.xneng.NTalkerStartChat('hg_1000_1508927913371','普通客服组',chatparams,function(success){
            // console.log('小能调起成功');
          },function(error){
            // console.log(error);
          });
        }
        else {
          window.open('http://m.ehaier.com/v2/h5/sg/common/customService.html'+'?flag='+$localstorage.get('sg_login_token_secret').substring(6), '_blank', 'location=no');
        }
      } else {
        $state.go('login');
      }
    }
    $scope.shareToPlatform = function (index) {
      if (!UserService.getUser().mid) {
        $state.go('login');
        return;
      }
      var storeId = $localstorage.get('storeId', $rootScope.globalConstant.storeId);
      var title = '顺逛•特产惠 汇集全国优质特产',
        content = '找特产，来顺逛，质量可靠价格亲民，特产惠欢迎您的到来～',
        pic = $scope.shareImgUrl, //product 里只有这个img

        url = UrlService.getShareLinkHeader() + 'ListOfSpecialtyGoods/' + $scope.productCateId + '/' + $scope.pageId + '/' + storeId;//分享链接里的id 拿 用户ID
      // console.log(url);
      var param={};
      var callbackWarpper=function(platform){
        CreditService.shareSuccessCallback(platform,param);
      };
      if (window.umeng) {
        if (index == 0) {
          window.umeng.shareToSina(title, content, pic, url, 0, null, callbackWarpper);
        } else if (index == 1) {
          window.umeng.shareToWechatSession(title, content, pic, url, 0, null, callbackWarpper);
        } else if (index == 2) {
          window.umeng.shareToWechatTimeline(title, content, pic, url, 0, null, callbackWarpper);
        } else if (index == 3) {
          window.umeng.shareToQQ(title, content, pic, url, 0, null, callbackWarpper);
          CreditService.qqShare();
        } else if (index == 4) {
          window.umeng.shareToQzone(title, content, pic, url, 0, null, callbackWarpper);
          CreditService.qqShare();
        }
        if (index == 5) {
          $scope.copeText(url);
        }else {
          CreditService.successShare();
        }
      } else {
        alert('umeng undefined 只能在app分享');
      }

      $scope.showShare = false;
    };
    /*********************分享标签－whiteBird end*********************/
    // $scope.showQRImg = function () {
    //   ProductDetailService.getMergeImage($scope.productId, $scope.productModel.storeId)
    //     .success(function (response) {
    //       $scope.qrcodeImageUrl = response.data;
    //       $scope.showShare = false;
    //       $scope.showQRimg = true;
    //     });
    // };
    // $scope.hideQRImg = function () {
    //   $scope.showQRimg = false;
    // };
    //
    // $scope.saveImg = function () {
    //   var imageUrl = $scope.qrcodeImageUrl;
    //   if ($rootScope.isIOS) { //iOS 系统
    //     cordova.plugins.saveToPhotoAlbum.save(imageUrl, function (nativeURL) {
    //       PopupService.showToast('图片已保存到本地相册');
    //     }, function (err) {
    //       PopupService.showToast('图片保存失败，请重新保存');
    //     });
    //   } else {
    //     var fileTransfer = new FileTransfer();
    //     var uri = encodeURI(imageUrl);
    //     fileTransfer.download(
    //       uri,
    //       cordova.file.externalRootDirectory + 'DCIM/Camera/' + $scope.productModel.product.productId + $scope.productModel.storeId + ".jpg",
    //       function (entry) {
    //         PopupService.showToast('图片已保存到本地相册');
    //       },
    //       function (error) {
    //         PopupService.showToast('图片保存失败，请重新保存');
    //       },
    //       false, {
    //         headers: {
    //           "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
    //         }
    //       }
    //     );
    //   }
    // };
    $scope.copeText = function (text) {
      if (window.cordova) {
        cordova.plugins.clipboard.copy(text);
        PopupService.showToastShort('复制成功');
        $scope.isShowCopyButton = false;
      } else {
        PopupService.showToast('请下载APP执行此操作');
      }
    };
    // $scope.hideblackCover = function () {
    //   $scope.showShare = false;
    // };

  }]);


APP.service('ListOfSpecialtyGoodsControllerService', ['$http', 'UrlService','UserService', function ($http, UrlService,UserService) {
  //ASYNC_ACCESS_PRICE
  this.getProductsList = function (pageIndex,filterData,productCateId,provinceId,cityId,districtId,streetId,pageId,qs) {
    var storeMemberId = UserService.getUser().mid || '20219251';
    var params = {
      'storeMemberId': storeMemberId,
      'pageIndex':pageIndex,
      'pageSize':10,
      'filterData':filterData,
      'qs': qs,
      'productCateId':productCateId,
      'provinceId':provinceId,
      'cityId':cityId,
      'districtId':districtId,
      'streetId':streetId,
      'pageId':pageId,
      'noLoading':'true'
    }
    return $http.get(UrlService.getUrl('SPECIALY_PRODUCTS_LIST'), params);
  }
  // this.getAsyncPrice = function (params) {
  //   return $http.post(UrlService.getUrl('ASYNC_ACCESS_PRICE'), params);
  // }
  this.getAsyncPrice = function (newdata) {
    var param = {
      traceId: newdata,
    }
    return $http({
      method: 'POST',
      url: UrlService.getUrl('ASYNC_ACCESS_PRICE'),
      params: param,
    });
  }
  this.getFilterData = function (params) {

    return $http.get(UrlService.getUrl('GET_FILTER_DATA'), params);
  }
  this.getPositionId = function () {
    return $http.get(UrlService.getUrl('GET_POSITION_FROM_COOLIE'));
  }
  this.getLeftList = function (regionId) {
    var params = {
      'module':2,
      'parentId':0,
      'regionId':regionId
    }
    return $http.get(UrlService.getZCUrl('GETNAVIGATIONS'), params);
  }
  this.getRightList = function (parentId,regionId) {
    var params = {
      'module':2,
      'parentId':parentId,
      'regionId':regionId
    }
    return $http.get(UrlService.getZCUrl('GETNAVIGATIONS'), params);
  }
  // this.getShareImgUrl = function (regionId) {
  //   var params = {
  //     regionId:regionId
  //   }
  //   return $http.get(UrlService.getUrl('GET_SHARE_IMG_URL'), params)
  // }
}]);
