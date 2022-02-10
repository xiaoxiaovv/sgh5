/**
 * Created by lizhi@camelotchina.com on 2017/7/15.
 *
 * 参数说明：
 *
 */
APP.controller('BranchTypeController', ['HomePageService', '$http', '$scope', 'BranchTypeService', '$stateParams', '$ionicSlideBoxDelegate',
  '$state', '$ionicSideMenuDelegate', '$cookieStore', 'UserService', '$ionicPopup', '$timeout',
  'LoginService', '$rootScope', '$ionicScrollDelegate', '$ionicModal', 'CommonAddressService', 'BannerThemeService',
  '$localstorage', 'VersionService', 'PopupService', 'ShopService', 'ProductDetailService',
  function (HomePageService, $http, $scope, BranchTypeService, $stateParams, $ionicSlideBoxDelegate, $state, $ionicSideMenuDelegate,
    $cookieStore, UserService, $ionicPopup, $timeout, LoginService, $rootScope, $ionicScrollDelegate,
    $ionicModal, CommonAddressService, BannerThemeService, $localstorage, VersionService, PopupService, ShopService, ProductDetailService) {

    if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
      $scope.isIosApp = true;
    } else {
      $scope.isIosApp = false;
    }
    $scope.flagNum = false;
    /*******头部图标**********/
        $scope.locationImgUrl = $rootScope.imgBaseURL+"img/location_gray@2x.png"; //地理位置
        $scope.messageImgUrl = $rootScope.imgBaseURL+"img/message_gray@2x.png"; //客服消息

    /*数据默认值 */
    $scope.leftDataList = ''; //左侧list数据
    $scope.rightDataList = ''; //右list数据
    $scope.leftDataListIndex = "0"; //左侧默认选中
    $scope.ParentParentId = "0"; //父分类的编号-默认是0；
    $scope.isListNull = false; //右侧列表数据为空时
    $scope.gsPlaceholder = ""; //关键词
    $scope.iSDataLeftRight = false //左侧一级数据；默认false， 当没有数据true；
    //初始化左侧列表
    $scope.inntDataList = function () {
      $scope.tabNav = 'homePage';
      ProductDetailService.getCartNum().success(function(res){
        if(res.success){
          $rootScope.BottomCartNum = res.data;
        };
      });
      BranchTypeService.GetLeftDataList($scope.ParentParentId).success(function (res) {
        if (res.success && res.data.length > 0) {
          $scope.leftDataList = res.data;
          getThreeTwoCategory(res.data[$scope.leftDataListIndex].id); //默认取数据的第一个
        } else {
          $scope.leftDataList = ''; //左侧list数据
          $scope.rightDataList = ''; //右list数据
          $scope.iSDataLeftRight = true; //左侧没有数据
        }
      });
    };
    //关键词
    BranchTypeService.defaultSearch().success(function (response) {
      $scope.gsPlaceholder = response.data.hot_word;
    });

    $scope.$watch("slideImage", function () {
      $ionicSlideBoxDelegate.update();
    })
    //了解热水器(只有H5有这个入口)
    $scope.learnRsq = function () {
      var rsqEntryUrl = 'http://m.ehaier.com/mobile/heater/index.html';//热水器入口url
      window.open(rsqEntryUrl, '_blank', 'location=yes');
    }

    //通过一级获取二三级数据
    function getThreeTwoCategory(parentId) {
      $ionicSlideBoxDelegate.slide(0);
      BranchTypeService.GetLeftDataList(parentId).success(function (res) {
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
          console.log($scope.slideImage);
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


    //**********右下角选项按钮*************//
    $scope.isButtonShow = function () {
      $scope.buttonShow = !$scope.buttonShow;
    };

    //*************轮播图*************//
    $scope.showSlideImage = true; //展示轮播图
    $scope.slideImage = []; //轮播图列表


    //点击轮播图执行方法
    $scope.bannerClick = function (imageItem) {
      var relationId = imageItem.bannerId;
      var link = imageItem.url;
      var tempArr = link.split('&');
      switch (imageItem.linkType) {
        case -1: //日常活动
          BannerThemeService.getBannerTheme(relationId)
            .success(function (response) {
              console.log(response);
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
                console.log(response);
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

    /***************TAB切换**********************/
    $scope.isFindTab = true; //发现tab是否显示
    //商品分类(滚动条)状态切换
    $scope.selectTab = function (parentId, index) {
      $scope.leftDataListIndex = index;
      getThreeTwoCategory(parentId); //更新右边内容
      $ionicScrollDelegate.$getByHandle('branchtype-right-scroll').scrollTop(); //右侧滚动到顶部
      //$ionicScrollDelegate.scrollTop();
    };
    //跳转到分类子页面
    $scope.brenchToChild = function (path) {
      //模拟跳转
      $state.go('branchTypeDetail');
    }

    //*************头部地理位置******************//
    //地址选择框高度
    var screenHeight = window.innerHeight;
    var topHeight = 250 + 123;
    var contentHeight = screenHeight - topHeight + 'px';
    $scope.contentHeight = {
      'height': contentHeight
    }
    $scope.memberId = '';
    var sgWeidianMid = 20219251;
    $scope.storeId = $localstorage.get('storeId', sgWeidianMid);
    $scope.provinceId = '16';
    $scope.cityId = '173';
    $scope.region = '崂山区';
    $scope.regionId = 2450;
    $scope.streetId = 12036596; //中韩街道
    $scope.panAddressSel = false;
    $scope.hasmore = false; //是否有更多数据
    /** 地址变量声明 **/
    $scope.addressTitle = '选择地区';
    $scope.dataAdd = null;
    $scope.flag = 'SELECTION_LOCATION';
    $scope.defaultValue = null;
    $scope.level = 0;
    var addressMessage = {}; //自动定位地址信息
    var areaValue;
    $scope.data = {};
    $scope.tabNav = 'branchType';
    //地址窗口
    $scope.addressTop = function () {
      $scope.addressTipFlag=false;
      $scope.provinceTop = 0;
      $scope.nowLevel = 0;
      $scope.nowLevelIndex = [-1, -1, -1, -1];
      $scope.provinceDis = false;
      $scope.cityDis = false;
      $scope.areaDis = false;
      $scope.addressModal.show();
      $scope.dataAdd = null;
      $scope.defaultValue = null;
      $scope.selectProvince = '';
      $scope.selectCity = '';
      $scope.selectArea = '';
      $scope.addressInit($scope.dataAdd, $scope.defaultValue, 'SELECTION_LOCATION', 0);
    }


    function initNew() {
      $scope.selectedIndex = 0;
      $scope.hasmore = false;
      $scope.isFind = true;
      $scope.isTab = false;
      //未读消息数量
      HomePageService.getUnReadMsg()
        .success(function (res) {
          if (res.data > 0) {
            $scope.flagNum = true;
          } else {
            $scope.flagNum = false;
          }
        })
      BranchTypeService.getAddress()
        .success(function (response) {
          var obj = eval(response.data);
          $scope.provinceId = obj[0].provinceId;
          $scope.cityId = obj[0].cityId;
          $scope.regionId = obj[0].areaId;
          $scope.streetId = obj[0].streetId;
          var regionIndex = obj[0].regionName.indexOf('/');
          $scope.region = obj[0].regionName.substr(0, regionIndex);
          //getProductList($scope.memberId, $scope.provinceId, $scope.cityId, $scope.regionId, $scope.streetId, $scope.page, 5, 1, 'saleDesc', 'all', false);
        });
    }


    //地址初始化
    $scope.addressInit = function (defaultValue, data, flag, level) {
      $scope.addressTipFlag=false;
      $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
      $scope.addressTitle = '选择地区';
      if (defaultValue) {
        $scope.defaultValue = JSON.parse(defaultValue);
      } else {
        $scope.defaultValue = {};
      }
      $scope.level = level;
      if (data) {
        $scope.dataAdd = JSON.parse(data);
        $scope.nowLevel = $scope.level;
        $scope.nowLevel = $scope.nowLevel * (-1);
        for (var i = 0; i < $scope.nowLevelIndex.length; i++) {
          if (i > $scope.nowLevel) {
            $scope.nowLevelIndex[i] = -1;
          }
        }
      } else {
        $scope.finish = false;
        $scope.addressTip='正在获取地址信息...';
        $scope.addressTipFlag=true;
        $scope.dataAdd="";
        //第一次取全国的省直辖市信息
        BranchTypeService.getLocationList('', 0).success(function (response) {
            $scope.dataAdd = response.data;
            $scope.addressTipFlag=false;
            $scope.finish = true;
            $scope.nowLevel = $scope.level;
            $scope.nowLevel = $scope.nowLevel * (-1);
            var defaultValueFy = JSON.stringify($scope.defaultValue);
            var dataAddFy = JSON.stringify($scope.dataAdd);
            //  $scope.addressInit(defaultValueFy,dataAddFy,$scope.flag,$scope.level)
            console.log($scope.nowLevel);
            for (var i = 0; i < $scope.nowLevelIndex.length; i++) {
              if (i > $scope.nowLevel) {
                $scope.nowLevelIndex[i] = -1;
              }
            }
          })
            .error(function (err) {
              PopupService.showToast('获取地址信息失败！');
            })
        }
      }
    //重新选择的下边框
    $scope.bottomBorder = {
      'border-bottom': "2px solid red"
    }
    $scope.provinceFlag = false;
    $scope.cityFlag = false;
    $scope.areaFlag = false;
    $scope.selectFlag = true;
    $scope.provinceDis = false;
    $scope.cityDis = false;
    $scope.areaDis = false;
    //返回重新选择省
    $scope.provinceSel = function () {
      $scope.addressInit(null, null, 'SELECTION_LOCATION', 0);
      $scope.selectCity = '';
      $scope.selectArea = '';
      $scope.provinceFlag = true;
      $scope.selectFlag = false;
      $scope.provinceDis = true;
      $scope.cityDis = false;
      $scope.areaDis = false;
    }
    //地址
    var isGoing = false;
    $scope.goSelect = ionic.Utils.debounce(function (index, item) {

      for (var i = 0; i < $scope.nowLevelIndex.length; i++) {
        if (i > $scope.nowLevel) {
          $scope.nowLevelIndex[i] = -1;
        }
      }
      $scope.dataAdd="";
      $scope.nowLevelIndex[$scope.nowLevel] = index;
      var item = arguments[1];
      var index = arguments[0];
      $scope.level = $scope.level - 1; //-1,下一个 为 －2 ，
      $scope.defaultValue['text' + $scope.level] = item.text;
      $scope.defaultValue['value' + $scope.level] = item.value;
      if ($scope.level > -2) { //xyz修改2级本地获取
        console.log($scope.level);
        if ($scope.level == -1) { //省
          $scope.selectProvince = item.text;
          $scope.provinceIndex = index;
          $scope.provinceFlag = false;
          $scope.selectFlag = true;
          $scope.provinceDis = true;
          $scope.provinceTop = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
          $scope.nowLevel = $scope.level;
          $scope.nowLevel = $scope.nowLevel * (-1);
          console.log($scope.nowLevel);
        } else {
          //$scope.dataAdd = $scope.dataAdd[index].children;
        }
        ah = $scope.level * -1;
        $scope.addressTip='正在获取地址信息...';
        $scope.addressTipFlag=true;
        BranchTypeService.getLocationList(item.value, ah).success(function (response) {
          if (ah == 1) {
            areaValueCity = item.value;
          }
          $scope.dataAdd = response.data;
          console.log($scope.dataAdd);
          $scope.addressTipFlag=false;
          var defaultValueFy = JSON.stringify($scope.defaultValue);
          var dataAddFy = JSON.stringify($scope.dataAdd);
          $scope.addressInit(defaultValueFy, dataAddFy, $scope.flag, $scope.level);
        }).error(function (err) {
          PopupService.showToast('获取地址信息失败！');
        });
        $scope.levelArea = $scope.level;
        $scope.levelArea = $scope.levelArea + 1;
        //重选市
        $scope.citySel = function () {
          $scope.level = $scope.levelArea;
          $scope.addressTip='正在获取地址信息...';
          $scope.addressTipFlag=true;
          $scope.dataAdd="";
          BranchTypeService.getLocationList(areaValueCity, 1).success(function (response) {
            $scope.dataAdd = response.data;
            $scope.addressTipFlag=false;
            var defaultValueFy = JSON.stringify($scope.defaultValue);
            var dataAddFy = JSON.stringify($scope.dataAdd);

            $scope.addressInit(defaultValueFy, dataAddFy, $scope.flag, -1);
            $scope.selectArea = '';
            $scope.cityFlag = true;
            $scope.selectFlag = false;
            $scope.provinceDis = true;
            $scope.cityDis = true;
            $scope.areaDis = false;
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0, $scope.cityTop);
          }).error(function (err) {
            PopupService.showToast('获取地址信息失败！');
          });
        }
      } else if ($scope.level > -4) { //xyz添加远端获取     市区
        $scope.selectCity = $scope.defaultValue['text-2'];
        $scope.provinceFlag = false;
        $scope.cityFlag = false;
        $scope.selectFlag = true;
        $scope.provinceDis = true;
        $scope.cityDis = true;
        $scope.areaDis = false;
        if ($scope.level == -3) { //区
          $scope.selectArea = item.text;
          $scope.cityFlag = false;
          $scope.areaFlag = false;
          $scope.selectFlag = true;
          $scope.provinceDis = true;
          $scope.cityDis = true;
          $scope.areaDis = true;
          $scope.areaTop = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
        } else { //市
          $scope.cityTop = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
        }
        ah = $scope.level * -1;
        $scope.addressTip='正在获取地址信息...';
        $scope.addressTipFlag=true;
        BranchTypeService.getLocationList(item.value, ah).success(function (response) {
          $scope.dataAdd = response.data;
          $scope.addressTipFlag=false;
          if (ah == 2) {
            areaValue = item.value;
          }
          var defaultValueFy = JSON.stringify($scope.defaultValue);
          var dataAddFy = JSON.stringify($scope.dataAdd);
          $scope.addressInit(defaultValueFy, dataAddFy, $scope.flag, $scope.level);
        }).error(function (err) {
          PopupService.showToast('获取地址信息失败！');
        });
        $scope.levelArea = $scope.level;
        $scope.levelArea = $scope.levelArea + 1;
        //重选区
        $scope.areaSel = function () {
          $scope.level = $scope.levelArea;
          $scope.addressTip='正在获取地址信息...';
          $scope.addressTipFlag=true;
          $scope.dataAdd="";
          BranchTypeService.getLocationList(areaValue, 2).success(function (response) {
            $scope.dataAdd = response.data;
            $scope.addressTipFlag=false;
            var defaultValueFy = JSON.stringify($scope.defaultValue);
            var dataAddFy = JSON.stringify($scope.dataAdd);

            $scope.addressInit(defaultValueFy, dataAddFy, $scope.flag, $scope.level);
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0, $scope.areaTop);
            $scope.areaFlag = true;
            $scope.selectFlag = false;
            $scope.provinceDis = true;
            $scope.cityDis = true;
            $scope.areaDis = true;
          }).error(function (err) {
            PopupService.showToast('获取地址信息失败！');
          });
        }
      } else {
        if (isGoing) {
          return;
        }
        $timeout(function () {
          isGoing = false;
        }, 1500);
        $rootScope.$broadcast($scope.flag, $scope.defaultValue);
        isGoing = true;
        //$scope.$ionicGoBack($scope.level);
        $scope.closeAddressModal();
      }
    }, 300);

    $scope.getPosition = function () {
      if ($rootScope.globalConstant.autoPosition == '定位中···') {
        return;
      }
      addressMessage = CommonAddressService.getAddressInfo();
      var detailAddress = addressMessage.regionName + '/' + addressMessage.streetName;
      BranchTypeService.addAddress(addressMessage.provinceId, addressMessage.cityId, addressMessage.areaId, detailAddress, addressMessage.streetId)
        .success(function () {
          var autoAddress = {
            'text-1': addressMessage.provinceName,
            'text-2': addressMessage.cityName,
            'text-3': addressMessage.regionName,
            'text-4': addressMessage.streetName,
            'value-1': addressMessage.provinceId,
            'value-2': addressMessage.cityId,
            'value-3': addressMessage.areaId,
            'value-4': addressMessage.streetId
          };
          $rootScope.$broadcast($scope.flag, autoAddress);
          //        $scope.addressSuccess=true;
        }).error(function () {
          //      	$scope.addressSuccess=false;
        })
      $scope.addressModal.hide();
    };
    $scope.goBack = function () {
      $scope.$ionicGoBack();
    };


    $scope.getAddress = function () {
      BranchTypeService.getAddress().
      success(function (response, status, headers, config) {
        if (response.data == null) {
          getCurrentPosition();
          $scope.findInit();
        } else {
          var obj = eval(response.data);
          $scope.provinceId = obj[0].provinceId;
          $scope.cityId = obj[0].cityId;
          $scope.regionId = obj[0].areaId;
          $scope.streetId = obj[0].streetId;
          var regionIndex = obj[0].regionName.indexOf('/');
          $scope.region = obj[0].regionName.substr(0, regionIndex);
          $scope.findInit();
        }
      });
    };

    //alert效果函数
    $scope.showPopup = function (message) {
      var myPopup = $ionicPopup.show({
        template: message
      });
      $timeout(function () {
        myPopup.close();
      }, 1000);
    };



    $scope.closeModal = function () {
      $scope.filterModal.hide();
    };

    //窗口modal---地理位置
    $ionicModal.fromTemplateUrl('templates/common/CommonLocation.html', {
      scope: $scope,
      animation: 'slide-in-up',
    }).then(function (modal) {
      $scope.addressModal = modal;
    });
    $scope.closeAddressModal = function () {
      $scope.addressModal.hide();
    };

    //修改地址广播回调
    $rootScope.$on('SELECTION_LOCATION', function (event, data) {
      $scope.region = data['text-3'];
      $scope.streetName = data['text-4'];
      var detailAddress = $scope.region + '/' + $scope.streetName;
      $scope.provinceId = data['value-1'];
      $scope.cityId = data['value-2'];
      $scope.regionId = data['value-3'];
      $scope.streetId = data['value-4'];
      $scope.panAddressSel = true;
      $scope.page = 1;
      BranchTypeService.addAddress($scope.provinceId, $scope.cityId, $scope.regionId, detailAddress, $scope.streetId)
        .success(function (response, status, headers, config) {
          if (response.success) {
            // getProductList($scope.memberId, $scope.provinceId, $scope.cityId, $scope.regionId, $scope.streetId, $scope.page, 5, 1, 'saleDesc', 'all', false);
            //$scope.selectTab($scope.selectedIndex);
          }
        });
    });

    function getCurrentPosition() { //获取定位地址
      var addressMessage = CommonAddressService.getAddressInfo();
      if (addressMessage) {
        $scope.provinceId = addressMessage.provinceId;
        $scope.cityId = addressMessage.cityId;
        $scope.regionId = addressMessage.areaId;
        $scope.streetId = addressMessage.streetId;
        $scope.region = addressMessage.regionName;
      } else {
        $scope.provinceId = '16';
        $scope.cityId = '173';
        $scope.region = '崂山区';
        $scope.regionId = '2450';
        $scope.streetId = '12036596'
      }
    }

    function getProductList(memberId, provinceId, cityId, districtId, streetId, pageIndex, pageSize, fromType, filterData, productCateStr, noLoading) {
      BranchTypeService.getSelectionProducts(memberId, provinceId, cityId, districtId, streetId, pageIndex, pageSize, fromType, filterData, productCateStr, noLoading)
        .success(function (response) {
          if (response.data.is_show_find) {
            $scope.isFind = true;
            $scope.isTab = false;
            $scope.isFindTab = true;
            $scope.hasmore = false;
            $scope.hasFindData = true;
            $scope.selectedIndex = 0;
            $ionicScrollDelegate.scrollTop();
            $scope.data = response.data;
          } else {
            $scope.isFind = false;
            $scope.isTab = true;
            $scope.isFindTab = false;
            $scope.hasmore = false;
            $scope.selectedIndex = 1;
            $scope.chooseIndex = 0;
            if (response.data.productsList != null && response.data.productsList != undefined && response.data.productsList.length != 0) {
              $scope.productList = response.data.productsList;
              $scope.$broadcast('scroll.infiniteScrollComplete');
              var len = $scope.productList.length;
              $scope.hasmore = !(len === response.data.storeItemsCounts);
            } else {
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.hasmore = false;
              $scope.productList = [];
            }
          }
        });
    }

    /**swper轮播图**/
    // $scope.swiper;
    // $scope.$watch("slideImage",function(newValue,oldValue, scope) {
    //   if(typeof $scope.swiper != 'undefined'){
    //     $scope.swiper.destroy();
    //   }
    //   if(newValue != oldValue){
    //     $timeout(function(){
    //       $scope.swiper = new Swiper('#swpcontainer-branchType-1', {   //轮播图绑定样式名
    //         pagination: '#swpcontainer-branchType-1 #swppagination-branchType-1', //轮播小圆点
    //         paginationClickable: true, //点击小圆点可以滚动
    //         autoplay: 5000, //滚动间隔时间
    //         loop: false,//无缝滚动
    //         observer:true, //更新自动重置
    //         observeParents:true, //更新自动重置
    //         autoplayDisableOnInteraction:false,//解决滑动后轮播停止
    //       });
    //       $scope.swiper.update();
    //     },100)
    //   }
    // })

    //局部刷新
    $scope.$on('$ionicView.beforeEnter', function (e, v) {
      // 初始化页面
      $scope.inntDataList();
      //更新轮播
      $ionicSlideBoxDelegate.$getByHandle('selection_slider').update();
      $ionicSlideBoxDelegate.$getByHandle('selection_slider').loop(true);
      $ionicSlideBoxDelegate.$getByHandle('selection_slider').start();
      //是否展示 综合 子选项
      $scope.showComprehensiveSub = false;

      $scope.nowLevel = 0;
      $scope.nowLevelIndex = [-1, -1, -1, -1];
      $scope.provinceTop = 0;
      $scope.cityTop = 0;
      $scope.areaTop = 0;
      $scope.finish = false;
      $scope.watch = $scope.$watch('finish', function (newValue, oldValue) {
        if (newValue) {
          $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0, $scope.provinceTop);
        }
      });

      $scope.isIos = ionic.Platform.isIOS() ? true : false;
      if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
        $scope.isIos1 = true;
      } else {
        $scope.isIos1 = false;
      };
      if (v.direction == 'back') {
        HomePageService.getUnReadMsg()
          .success(function (res) {
            if (res.data > 0) {
              $scope.flagNum = true;
            } else {
              $scope.flagNum = false;
            }
          })
        return;
      }
      $scope.storeId = $localstorage.get('storeId', $rootScope.globalConstant.storeId); //获取用户信息
      $scope.memberId = UserService.getUser().mid;
      $scope.buttonShow = false; //右下角展开图标不打开
      $scope.page = 1;
      $scope.hasmore = false;
      /*************add by wangshuang     STARTA******************/
      $scope.buttonBuyerShow = false; //买家中心图标初始化
      $scope.isBuyer = LoginService.getRole(); //判断用户角色信息；0为买家；1为卖家
      $scope.isWdHost = $scope.isBuyer; //设置底部 1位市场  0 为分类；
      /*************add by wangshuang     END******************/

      $scope.dataAdd = null;
      $scope.defaultValue = null;
      //$scope.getSlideImage(); //获取轮播图信息
      initNew();
      //地址
      $scope.addressInit($scope.dataAdd, $scope.defaultValue, 'SELECTION_LOCATION', 0);
    });

    $scope.$on('$destroy', function () {
      if ($scope.filterModal) {
        $scope.filterModal.remove();
      };
      if ($scope.addressModal) {
        $scope.addressModal.remove();
      }
    });
  }
]);


APP.service('BranchTypeService', ['$http', 'UrlService', function ($http, UrlService) {
  //商品分类(滚动条)切换
  this.changeSuccess = function (type) {
    var params = {
      'type': type
    };
    return $http.get(UrlService.getUrl('CHANGESUCCESS_INIT'), params);
  };
  //获取列表数据
  this.GetLeftDataList = function (parentId) {
    var params = {
      parentId: parentId,
      timer: new Date().getTime()
    };
    //http://mobiletest.ehaier.com:38081/sg/cms/navigation/getNavigations.json
    return $http.get(UrlService.getZCUrl('GETNAVIGATIONS'), params);
  }

  // //获取轮播图信息
  // this.getSlideImage = function() {
  //     var params = {
  //         'page': 'app_home',
  //         'isBack': 0
  //     };
  //     return $http.get(UrlService.getUrl('GET_SELECTION_IMAGE'), params);
  // };

  //添加地址信息
  this.addAddress = function (provinceId, cityId, areaId, regionName, streetId) {
    var params = {
      'provinceId': provinceId,
      'cityId': cityId,
      'areaId': areaId,
      'regionName': regionName,
      'streetId': streetId,
      'noLoading': true
    };
    return $http.get(UrlService.getUrl('ADDADDRESSSELECTION_INIT'), params);
  };
  //获取地址信息
  this.getAddress = function () {
    return $http.get(UrlService.getUrl('GET_POSITION_FROM_COOLIE'));
  };
  //获取省市区Id
  this.getAddressId = function (provinceName, cityName, regionName, streetName, gbCode) {
    var params = {
      'provinceName': provinceName,
      'cityName': cityName,
      'regionName': regionName,
      'streetName': streetName,
      'gbCode': gbCode,
      'noLoading': true
    };
    return $http.get(UrlService.getUrl('GET_ADDRESS_ID'), params);
  };

    this.getSelectionProducts = function(memberId, provinceId, cityId, districtId, streetId, pageIndex, pageSize, fromType, filterData, productCateStr, noLoading) {
        var params = {
            memberId: memberId,
            provinceId: provinceId,
            cityId: cityId,
            districtId: districtId,
            streetId: streetId,
            pageIndex: pageIndex,
            pageSize: pageSize,
            fromType: fromType,
            filterData: filterData,
            productCateStr: productCateStr,
            flag: '',
            productCateId: '',
            noLoading: noLoading
        };
        return $http.get(UrlService.getUrl('GET_SELECTION_PRODUCTS'), params);
    };
    //地址
    this.getLocationList = function(parentId, regionType) {
        var params = {
            parentId: parentId,
            regionType: regionType
        };
        return $http.get(UrlService.getUrl('GET_REGION_BY_ID_TYPE'), params);
    };
    //默认词
    this.defaultSearch = function() {
        var params = {
            'platform': 3
        };
        return $http.get(UrlService.getUrl('DEFAULTSEARCH_WORDS'), params);
    };
}]);
