APP.controller('AddPrizeAddressController', ['$ionicPlatform', '$ionicPopup', '$scope', '$stateParams', '$rootScope', 'AddressPrizeService', 'CommonAddressService', 'PopupService', '$timeout', '$ionicHistory', '$state', '$ionicModal', '$http', '$ionicScrollDelegate','GoodsService',
  function($ionicPlatform, $ionicPopup, $scope, $stateParams, $rootScope, AddressPrizeService, CommonAddressService, PopupService, $timeout, $ionicHistory, $state, $ionicModal, $http, $ionicScrollDelegate,GoodsService) {
    /** 变量声明 **/
    $scope.textOne = '';
    $scope.textTwo = '';
    $scope.textThree = '';
    $scope.textFour = '';
    $scope.address = {
      'consignee': '',
      'provinceId': '',
      'cityId': '',
      'areaId': '',
      'streetId': '',
      'regionName': '',
      'mobile': '',
      'address': '',
      'isDefault': '0'
    };
    $scope.textColor = "color-text-s";
    $scope.streetTextColor = "color-text-s";
    $scope.defaultImage = "img/ic_select.png";
    $scope.defaultHide = true;
    $scope.panGoOn = false;
    $scope.panOrgoOn = false;
    $scope.updateResult = true;
    $scope.conserve = false; // 是否保存
    $scope.regionTrue = false;
    $scope.updateContent = '';
    $scope.isNotDistinguish = false;
    $scope.isPosition = false;

    /*勿动 start*/
    $scope.isChangeOrDefault = 0; //区别是否修改
    $scope.isDef = false;
    $scope.addChangeAddress = { //变动后地址存储
      'provinceId': 0, //省
      'cityId': 0, //市
      'areaId': 0, //区
      'streetId': 0, //街道
      'pca': '', //省市区
      'regionName': '' //省市区街道
    };
    $scope.positionAddress = { //定位地址
      'provinceId': 0, //省
      'cityId': 0, //市
      'areaId': 0, //区
      'streetId': 0, //街道
      'pca': '', //省市区
      'regionName': '' //省市区街道
    };

    /*勿动 end*/

    //地址选择框高度
    var screenHeight = window.innerHeight;
    var topHeight = 250 + 123;
    var topDis = 87;
    var contentHeight = screenHeight - topHeight + 'px';
    var topDisHeight = topDis + 'px';
    $scope.contentHeight = {
      'height': contentHeight
    };
    var topHeightStreet = 250;
    var contentHeights = screenHeight - topHeightStreet + 'px';
    $scope.contentHeightStreet = {
      'height': contentHeights
    };
    /** 地址变量声明 **/
    $scope.addressTitle = '配送至';
    $scope.dataAdd = null;
    $scope.dataAddStreet = null;
    $scope.flag = 'CHANGEADDRESS_LOCATION';
    $scope.defaultValue = null;
    $scope.hasChanged = false;
    $scope.level = 0;
    $scope.adsMsgChange = {};
    $scope.adsMsg = {};
    /** 方法 **/
    //页面初始化
    $scope.init = function() {
      $scope.conserve = false;
      // $scope.address.regionName = '所在地区';
      $scope.addressRegionName = '所在地区';
      $scope.addressStreet = "街道";
      if ($scope.panGoOn == false) {
        $scope.addressRegionName = '所在地区';
        $scope.defaultImage = "img/ic_select.png";
        $scope.defaultHide = true;
        $scope.textColor = "color-text-s";
        $scope.streetTextColor = "color-text-s";
      } else {
        $scope.textColor = "color-text-l";
        $scope.addressRegionName = $scope.textOne + ' ' + $scope.textTwo + ' ' + $scope.textThree;
        $scope.address.regionName = $scope.textOne + ' ' + $scope.textTwo + ' ' + $scope.textThree;
      }
      $scope.panGoOn = false;

    };
    $scope.$on('$ionicView.beforeLeave', function(e, v) {
      $scope.watch();
    });
    //viewWillAppear
    $scope.$on('$ionicView.beforeEnter', function() {
      $scope.gameId = $stateParams.gameId;
      $scope.uuid = $stateParams.uuid;
      $scope.prizeId = $stateParams.prizeId;
      $scope.isPosition = false;
      $scope.isNotDistinguish = false;
      $scope.isChangeOrDefault = 0;
      $scope.address.address = '';
      $scope.dataAddStreet = [];
      $scope.nowLevel = 0;
      $scope.nowLevelIndex = [-1, -1, -1];
      $scope.provinceTop = 0;
      $scope.cityTop = 0;
      $scope.areaTop = 0;
      $scope.finish = false;
      $scope.textColor = "color-text-s";
      $scope.streetTextColor = "color-text-s";
      $scope.address.consignee = ''; // 姓名
      $scope.address.mobile = ''; // 电话
      $scope.watch = $scope.$watch('finish', function(newValue, oldValue) {
        if (newValue) {
          $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0, $scope.provinceTop);
        }
      });
      $scope.isIos = ionic.Platform.isIOS() ? true : false;
      $scope.init();
      //地址
      $scope.addressInit($scope.dataAdd, $scope.defaultValue, 'CHANGEADDRESS_LOCATION', 0);
      $scope.$on('$destroy', function() {
        $scope.addressModal.remove();
        $scope.addressModalStreet.remove();
      });


    });
    $ionicPlatform.on('resume', function() {
      $scope.addressModal.hide();
      $scope.addressModalStreet.hide();
    });

    $scope.goBack = function() {
      $scope.panGoOn = false;
      $ionicHistory.goBack();
    };

    $scope.$watch('address', function() {
      $scope.address.mobile = $scope.address.mobile.replace(/([^0-9])|(-)/g, "");
    }, true);

    // 选择联系人 {"name":"大A","number":"18888889767"}
    $scope.selectPhone = function() {
      if (window.cordova) {
        window.emc.addAddressBook(function(response) { //成功回调
          var res = JSON.parse(response);
          $scope.$apply(function() {
            $scope.address.consignee = res.name; // 姓名
            $scope.address.mobile = res.number.replace(/([^0-9])|(-)/g, ""); // 电话
          });
        }, function() { // 失败回调
          $ionicPopup.alert({
            template: '获取通讯录失败',
            okText: '知道了'
          });
        });

      } else {
        $ionicPopup.alert({
          template: '请下载客户端APP实现此功能！',
          okText: '知道了'
        });
      }


    };
    // 选择街道
    $scope.StreetTop = function() {
      $scope.provinceTop = 0;
      $scope.nowLevel = 0;
      $scope.nowLevelIndex = [-1, -1, -1];
      $scope.provinceDis = false;
      $scope.cityDis = false;
      $scope.areaDis = false;
      $scope.dataAdd = null;
      $scope.defaultValue = null;
      $scope.selectProvince = '';
      $scope.selectCity = '';
      $scope.selectArea = '';
      if ($scope.addressRegionName != '所在地区') {
        $scope.addressModalStreet.show();
      } else {
        PopupService.showToast('请选择所在地');
        $scope.addressStreet = '街道';
        $scope.streetTextColor = "color-text-s";
      }
    };

    //地址窗口
    $scope.addressTop = function() {
        $scope.addressTipFlag = false;
        $scope.provinceTop = 0;
        $scope.nowLevel = 0;
        $scope.nowLevelIndex = [-1, -1, -1];
        $scope.provinceDis = false;
        $scope.cityDis = false;
        $scope.areaDis = false;
        $scope.addressModal.show();
        $scope.dataAdd = null;
        $scope.defaultValue = null;
        $scope.selectProvince = '';
        $scope.selectCity = '';
        $scope.selectArea = '';
        $scope.addressInit($scope.dataAdd, $scope.defaultValue, 'CHANGEADDRESS_LOCATION', 0);
      };
      //地址初始化
      $scope.addressInit = function (defaultValue,data,flag,level) {
        $scope.addressTipFlag=false;
        $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
        $scope.addressTitle = '配送至';
        if (defaultValue) {
          $scope.defaultValue = JSON.parse(defaultValue);
        } else {
          $scope.defaultValue = {};
        }
        $scope.level = level;
        if (data) {
          $scope.dataAdd = JSON.parse(data);
          $scope.nowLevel=$scope.level;
          $scope.nowLevel=$scope.nowLevel*(-1);
          for(var i=0;i<$scope.nowLevelIndex.length;i++){
            if(i>$scope.nowLevel){
              $scope.nowLevelIndex[i]=-1;
            }
          }
        } else {
          $scope.finish=false;
         //第一次取全国的省直辖市信息
          AddressPrizeService.getLocationList('', 0).success(function (response) {
            $scope.dataAdd = response.data;
            $scope.addressTipFlag=false;
            $scope.finish = true;
            $scope.nowLevel = $scope.level;
            $scope.nowLevel = $scope.nowLevel * (-1);
            var defaultValueFy = JSON.stringify($scope.defaultValue);
            var dataAddFy = JSON.stringify($scope.dataAdd);
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
    };
    $scope.provinceFlag = false;
    $scope.cityFlag = false;
    $scope.areaFlag = false;
    $scope.selectFlag = true;
    $scope.provinceDis = false;
    $scope.cityDis = false;
    $scope.areaDis = false;
    //返回重新选择省
    $scope.provinceSel = function() {
      $scope.addressInit(null, null, 'CHANGEADDRESS_LOCATION', 0);
      $scope.selectCity = '';
      $scope.selectArea = '';
      $scope.provinceFlag = true;
      $scope.selectFlag = false;
      $scope.provinceDis = true;
      $scope.cityDis = false;
      $scope.areaDis = false;
    };
    $scope.goSelectStreet = ionic.Utils.debounce(function(index, item) {

      $scope.level = $scope.level - 1; //-1,下一个 为 －2 ，
      $scope.addressStreet = item.text;
      $scope.streetMsg = item.text;
      /*勿动*/
      $scope.isChangeOrDefault = 3; //只修改街道
      $scope.isDef = true;
      // 地址更改存放
      $scope.addChangeAddress.regionName = $scope.addChangeAddress.pca + ' ' + $scope.addressStreet; //省市区街道
      $scope.addChangeAddress.streetId = item.value;
      //定位
      $scope.positionAddress.streetId = item.value;
      $scope.positionAddress.regionName = $scope.positionAddress.pca + ' ' + $scope.addressStreet; //省市区街道
      /*勿动*/
      $scope.addressModalStreet.hide();
      if ($scope.addressStreet == '街道') {
        $scope.streetTextColor = "color-text-s";
      } else {
        $scope.streetTextColor = "color-text-l";
      }

    });
    //地址
    var isGoing = false;
    $scope.goSelect = ionic.Utils.debounce(function(index, item) {
      for (var i = 0; i < $scope.nowLevelIndex.length; i++) {
        if (i > $scope.nowLevel) {
          $scope.nowLevelIndex[i] = -1;
        }
      }
      $scope.dataAdd = "";
      $scope.nowLevelIndex[$scope.nowLevel] = index;
      var item = arguments[1];
      var index = arguments[0];
      $scope.level = $scope.level - 1; //-1,下一个 为 －2 ，
      $scope.defaultValue['text' + $scope.level] = item.text;
      $scope.defaultValue['value' + $scope.level] = item.value;
      $scope.hasChangeArr = $scope.defaultValue;
      if ($scope.level > -2) {//xyz修改2级本地获取
        if ($scope.level == -1) { //省
          $scope.selectProvince = item.text;
          $scope.provinceIndex = index;
          $scope.provinceFlag = false;
          $scope.selectFlag = true;
          $scope.provinceDis = true;
          $scope.provinceTop = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
          $scope.nowLevel = $scope.level;
          $scope.nowLevel = $scope.nowLevel * (-1);
        } else {
          //$scope.dataAdd = $scope.dataAdd[index].children;
        }
        ah = $scope.level * -1;
        $scope.addressTip='正在获取地址信息...';
        $scope.addressTipFlag=true;
        AddressPrizeService.getLocationList(item.value, ah).success(function (response) {
          if (ah == 1) {
            areaValueCity = item.value;
          }
          $scope.dataAdd = response.data;
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
          AddressPrizeService.getLocationList(areaValueCity, 1).success(function (response) {
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
      } else if ($scope.level > -4 && $scope.level != -3) { //xyz添加远端获取
        $scope.selectCity = $scope.defaultValue['text-2'];
        $scope.provinceFlag = false;
        $scope.cityFlag = false;
        $scope.selectFlag = true;
        $scope.provinceDis = true;
        $scope.cityDis = true;
        $scope.areaDis = false;
        $scope.selectArea = item.text;
        $scope.addressStreet = "街道";
        $scope.textColor = "color-text-l";
        $scope.cityTop = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
        ah = $scope.level * -1;
        $scope.addressTip = '正在获取地址信息...';
        $scope.addressTipFlag = true;
        AddressPrizeService.getLocationList(item.value, ah).success(function(response) {
          $scope.dataAdd = response.data;
          $scope.addressTipFlag = false;
          if (ah == 2) {
            areaValue = item.value;
          }
          var defaultValueFy = JSON.stringify($scope.defaultValue);
          var dataAddFy = JSON.stringify($scope.dataAdd);

          $scope.addressInit(defaultValueFy, dataAddFy, $scope.flag, $scope.level);
        }).error(function(err) {
          PopupService.showToast('获取地址信息失败！');
        });
        $scope.levelArea = $scope.level;
        $scope.levelArea = $scope.levelArea + 1;
        //重选区
        $scope.areaSel = function() {
          $scope.addressTip = '正在获取地址信息...';
          $scope.addressTipFlag = true;
          $scope.dataAdd = "";
          $scope.level = $scope.levelArea;
          AddressPrizeService.getLocationList(areaValue, 2).success(function(response) {
            $scope.dataAdd = response.data;
            $scope.addressTipFlag = false;
            var defaultValueFy = JSON.stringify($scope.defaultValue);
            var dataAddFy = JSON.stringify($scope.dataAdd);

            $scope.addressInit(defaultValueFy, dataAddFy, $scope.flag, $scope.level);
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0, $scope.areaTop);
            $scope.areaFlag = true;
            $scope.selectFlag = false;
            $scope.provinceDis = true;
            $scope.cityDis = true;
            $scope.areaDis = true;
          }).error(function(err) {
            PopupService.showToast('获取地址信息失败！');
          });
        }
      } else if ($scope.level == -3) {
        $scope.addressModal.hide();
        $scope.regionTrue = true;
        $scope.isChangeOrDefault = 4; //修改了省市区
        $scope.streetTextColor = "color-text-s";
        $scope.streetTrue = true;
        $scope.panGoOn = true;
        $scope.panOrgoOn = true;
        $scope.textOne = $scope.defaultValue['text-1'];
        $scope.textTwo = $scope.defaultValue['text-2'];
        $scope.textThree = $scope.defaultValue['text-3'];
        $scope.address.provinceId = $scope.defaultValue['value-1'];
        $scope.address.cityId = $scope.defaultValue['value-2'];
        $scope.address.areaId = $scope.defaultValue['value-3'];
        $scope.address.regionName = $scope.textOne + ' ' + $scope.textTwo + ' ' + $scope.textThree;
        $scope.addressRegionName = $scope.textOne + ' ' + $scope.textTwo + ' ' + $scope.textThree;
        $scope.addChangeAddress = { //变动后地址存储
          'provinceId': $scope.defaultValue['value-1'], //省
          'cityId': $scope.defaultValue['value-2'], //市
          'areaId': $scope.defaultValue['value-3'], //区
          'streetId': 0,
          'pca': $scope.textOne + ' ' + $scope.textTwo + ' ' + $scope.textThree, //省市区
          'regionName': '' //省市区街道
        };
        $scope.selectArea = item.text;
        $scope.cityFlag = false;
        $scope.areaFlag = false;
        $scope.selectFlag = true;
        $scope.provinceDis = true;
        $scope.cityDis = true;
        $scope.areaDis = true;
        $scope.areaTop = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
        ah = $scope.level * -1;
        AddressPrizeService.getLocationList(item.value, ah).success(function(response) {
          $scope.dataAddStreet = response.data;
          if (ah == 2) {
            areaValue = item.value;
          }
          var defaultValueFy = JSON.stringify($scope.defaultValue);
          var dataAddFy = JSON.stringify($scope.dataAdd);

          $scope.addressInit(defaultValueFy, dataAddFy, $scope.flag, $scope.level);
        }).error(function(err) {
          PopupService.showToast('获取地址信息失败！');
        });
        $scope.levelArea = $scope.level;
        $scope.levelArea = $scope.levelArea + 1;
      } else {
        if (isGoing) {
          return;
        }
        $timeout(function() {
          isGoing = false;
        }, 1500);
        $rootScope.$broadcast($scope.flag, $scope.defaultValue);
        isGoing = true;
        //      $scope.$ionicGoBack($scope.level);
        $scope.closeAddressModal();
      }
    }, 300);
    //窗口modal
    $ionicModal.fromTemplateUrl('templates/common/CommonLocation.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.addressModal = modal;
    });
    $ionicModal.fromTemplateUrl('templates/common/CommonLocationStreet.html', {
      scope: $scope,
      animation: 'slide-in-up',
    }).then(function(modal) {
      $scope.addressModalStreet = modal;
    });
    // CommonLocationStreet
    $scope.closeAddressModal = function() {
      $scope.addressModal.hide();
      $scope.addressModalStreet.hide();
    };
    //保存 弹窗
    $scope.preservation = function() {
      $scope.positionCommonFun = function() { //定位函数
        $scope.address.provinceId = $scope.positionAddress.provinceId;
        $scope.address.cityId = $scope.positionAddress.cityId;
        $scope.address.areaId = $scope.positionAddress.areaId;
        $scope.address.streetId = $scope.positionAddress.streetId;
        $scope.address.regionName = $scope.positionAddress.regionName;
      };
      $scope.newAddAddress = function() { //修改
        $scope.address.provinceId = $scope.addChangeAddress.provinceId;
        $scope.address.cityId = $scope.addChangeAddress.cityId;
        $scope.address.areaId = $scope.addChangeAddress.areaId;
        $scope.address.streetId = $scope.addChangeAddress.streetId;
        $scope.address.regionName = $scope.addChangeAddress.regionName;
      };
      if ($scope.isPosition) { //定位地址
        $scope.positionCommonFun();
      } else {
        $scope.newAddAddress();
      }

      //调用添加新地址接口
      AddressPrizeService.doInit($scope.address,$scope.gameId,$scope.uuid,$scope.prizeId)
        .success(function(response, status, headers, config) {
          if (response.success == true) {
            $scope.address = {
              'consignee': '',
              'provinceId': '',
              'cityId': '',
              'areaId': '',
              'streetId': '',
              'regionName': '',
              'mobile': '',
              'address': '',
              'isDefault': '0'
            };
            $scope.addressRegionName = '';
            $rootScope.addressStr = undefined;
            $scope.isChangeOrDefault = 0; //区别是否修改
            $scope.addChangeAddress = { //变动后地址存储
              'provinceId': 0, //省
              'cityId': 0, //市
              'areaId': 0, //区
              'streetId': 0, //街道
              'pca': '', //省市区
              'regionName': '' //省市区街道
            };
            $scope.positionAddress = { //定位地址
              'provinceId': 0, //省
              'cityId': 0, //市
              'areaId': 0, //区
              'streetId': 0, //街道
              'pca': '', //省市区
              'regionName': '' //省市区街道
            };

            $scope.panGoOn = false;
            PopupService.showToast('添加成功');
            setTimeout(function(){
              $scope.$ionicGoBack();
            },1000)
          } else {
            if (!$scope.isNotDistinguish) {
              $scope.showResult('添加失败');
            }

          }
        });
    };
    //保存
    $scope.doChange = function() {

      if ($scope.address.consignee == "") {
        PopupService.showToast('收货人不能为空');
        return;
      }
      var pattern = /^([\u4E00-\u9FA5]|\w)*$/;
      if (!pattern.exec($scope.address.consignee)) {
        PopupService.showToast('收货人不能包括特殊字符');
        return;
      }
      if ($scope.address.consignee.length > 10 || $scope.address.consignee.length < 2) {
        PopupService.showToast('收货人为2-10个字符');
        return;
      }
      if ($scope.address.mobile == "") {
        PopupService.showToast('手机号码不能为空');
        return;
      }
      var patternMobile = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
      if (!patternMobile.exec($scope.address.mobile)) {
        PopupService.showToast('手机号码不正确');
        return;
      }
      if ($scope.addressRegionName == '所在地区') {
        PopupService.showToast('请选择所在地区');
        return;
      }
      if ($scope.addressStreet == '请选择街道') {
        PopupService.showToast('请选择街道');
        return;
      }
      var addressDetail = /^.[^&<>]{2,29}$/;
      if (!addressDetail.exec($scope.address.address)) {
        PopupService.showToast('详细地址为3～30个字符，且不能包含特殊字符！');
        return;
      }
      if ($scope.conserve) {
        $scope.preservation();
      } else {
        if ($scope.addressStreet == '街道') {
          AMap.plugin('AMap.Geocoder', function () {
            var geocoder = new AMap.Geocoder({
              city: "全国"//城市，默认：“全国”
            });
            $scope.allAddress = $scope.address.regionName +   $scope.address.address;
            geocoder.getLocation($scope.allAddress, function (status, result) {
              if (status == 'complete' && result.geocodes.length) {
                var lat = result.geocodes[0].location.lat;
                var lng = result.geocodes[0].location.lng;
                var lnglatXY = [lng, lat];
                geocoder.getAddress(lnglatXY, function (status, result) {
                  if (status === 'complete' && result.info === 'OK') {
                    var position = result.regeocode.addressComponent;
                    if($scope.textThree==position.district){
                      GoodsService.getAddressId(position.province, position.city, position.district, position.township,position.adcode)
                        .success(function(response){
                          if (response.data != null && response.data != undefined && response.data.length != 0) {
                            $scope.township = position.township;
                            $scope.addressStreet = $scope.township;
                            $scope.addChangeAddress.streetId = response.data.streetId;
                            $scope.addChangeAddress.regionName = $scope.addChangeAddress.pca + ' ' + $scope.addressStreet;
                            //定位
                            $scope.positionAddress.streetId = response.data.streetId;
                            $scope.positionAddress.regionName = $scope.positionAddress.pca + ' ' + $scope.addressStreet; //省市区街道

                            var confirmPopup = $ionicPopup.confirm({
                              template: '根据国家最新行政区域划分，我们识别到您的地址对应街道为' + "'" + $scope.township + "'" + ',是否保存?',
                              cancelText: '修改',
                              okText: '保存'
                            });
                            confirmPopup.then(function (res) {
                              if (res) { // 保存
                                $scope.conserve = false;
                                $scope.isOkChange = true;
                                $scope.addressStreet = $scope.township;
                                $scope.preservation();
                              } else { //修改
                                $scope.isOkChange = false;
                                $scope.conserve = true;
                                console.log('You are not sure');
                              }
                            });
                          }else{
                            $scope.$apply(function () {
                              $scope.streetTextColor = 'text-red';
                              $scope.addressStreet = '请选择街道';
                            });
                          }
                        })
                        .error(function(error){
                          $scope.$apply(function () {
                            $scope.streetTextColor = 'text-red';
                            $scope.addressStreet = '请选择街道';
                          });
                        });
                    }else{
                      $scope.$apply(function () {
                        $scope.streetTextColor = 'text-red';
                        $scope.addressStreet = '请选择街道';
                      });
                    }

                  } else {
                    //获取地址失败
                    $ionicPopup.alert({
                      template: '获取地址失败，请稍后重试！',
                      okText: '确定'
                    });
                  }
                });
              } else {
                $scope.$apply(function () {
                  $scope.streetTextColor = 'text-red';
                  $scope.addressStreet = '请选择街道';
                });
                console.log('高德返回结果失败');
              }
            })
          });
        } else {
          $scope.preservation();
        }
      }
    };

    //修改地址回调
    $rootScope.$on('CHANGEADDRESS_LOCATION', function(event, data) {
      $scope.panGoOn = true;
      $scope.panOrgoOn = true;
      $scope.textOne = data['text-1'];
      $scope.textTwo = data['text-2'];
      $scope.textThree = data['text-3'];
      $scope.textFour = data['text-4'];
      $scope.address.provinceId = data['value-1'];
      $scope.address.cityId = data['value-2'];
      $scope.address.areaId = data['value-3'];
      $scope.address.streetId = data['value-4'];
      $scope.textColor = "color-text-l";
      $scope.streetTextColor = "color-text-l";
      $scope.init();
    });

    //显示修改内容
    $scope.showResult = function(result) {
      $scope.updateContent = result;
      $scope.updateResult = false;
      $timeout(function() {
        $scope.updateResult = true;
      }, 1000);
    };

  }
]);
/**
 * creater:zhiqiang.zhao@dhc.com.cn
 * create time:2016-3-24
 * describe：添加地址
 **/
APP.service('AddressPrizeService', ['$http', 'UrlService', function($http, UrlService) {
  this.doInit = function(address,gameId,uuid,prizeId) {
    var params = {
      'consignee': address.consignee,
      'provinceId': address.provinceId,
      'cityId': address.cityId,
      'regionId': address.areaId,
      'streetId': address.streetId,
      'regionName': address.regionName,
      'mobile': address.mobile,
      'address': address.address,
      'gameId':gameId,
      'uuid':uuid,
      'prizeId':prizeId
    };
    return $http({
      method: 'POST',
      url: UrlService.getGameUrl('GAME_HAVE_PRIZE'),
      params: params
    });
  };
  //地址
  this.getLocationList = function(parentId, regionType) {
    var params = {
      parentId: parentId,
      regionType: regionType
    };
    return $http.get(UrlService.getUrl('GET_REGION_BY_ID_TYPE'), params);
  };
}]);
