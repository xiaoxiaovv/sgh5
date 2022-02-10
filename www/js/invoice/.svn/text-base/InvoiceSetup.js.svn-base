/**
 * Created by xy on 2016/3/24.
 */
APP.controller('InvoiceSetupController', ['$scope', '$state', '$stateParams', '$rootScope', '$ionicScrollDelegate', 'InvoiceService', '$ionicPopup', '$ionicHistory', '$ionicModal','PopupService','ADDADDRESSService','CommonAddressService','$http','$ionicPlatform',
  function ($scope, $state, $stateParams, $rootScope, $ionicScrollDelegate, InvoiceService, $ionicPopup, $ionicHistory, $ionicModal,PopupService,ADDADDRESSService,CommonAddressService,$http,$ionicPlatform) {
    /** 变量声明 **/
    $scope.htmlContent = $stateParams.content;
    $scope.enterPage = $stateParams.enterPage;
    $scope.title = $stateParams.title;
    $scope.invoiceModel = {};
    $scope.addressback='';
    $scope.normalInvoiceType = 1;//普通发票类型 1：个人 2：企业
    $scope.normalInvoice = {
      TaxpayerNumber : ''//普通发票纳税人识别号
    };
    var tempNormalInvoiceType = '';//缓存普通发票类型
    var temp = {//缓存变量
      invoiceHead:'',//发票抬头
      TaxpayerNumber:''//纳税人识别号
    };
    $scope.faPiao = {
      'faPiaoTaiTou': '',
      'gongSiMingCheng': '',
      'shiBieHao': '',
      'zhuCeDiZhi': '',
      'zhuCeDianHua': '',
      'kaiHuYinHang': '',
      'kaiHuZhangHao': ''
    };
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
    $scope.positionAddress = {  //定位地址
      'provinceId':0, //省
      'cityId':0,  //市
      'areaId':0, //区
      'streetId':0, //街道
      'pca':'', //省市区
      'regionName':'' //省市区街道
    };
    $scope.receipt = {
      'consignee': '',
      'address': '',
      'zipcode': '',
      'mobile': ''
    };
    $scope.isChoose=undefined;//是否显示选择按钮
    $scope.invoiceType;
    //电子发票默认选中
    //$scope.dzActive=true;
    ////增值税发票默认未选中
    //$scope.zzActive=false;
    $scope.whichActive;
    /** 方法 **/
    $scope.init = function () {
      $scope.addressRegionName = '邮寄地址所在地区:';
      $scope.addressStreet = "街道:";
      $scope.invoiceType = $stateParams.invoiceType;
      $scope.htmlContent = $stateParams.content;
      $scope.title = $stateParams.title;
      // $scope.faPiao.faPiaoTaiTou = $stateParams.invoiceHead; //yl
      //获取发票数据
      InvoiceService.loadData()
        .success(function (response, status, headers, config) {
          if (response.success) {
            console.log(response);
            //$scope.payment = response.data.ordersCommitWrapM.order.paymentCode;
            $scope.faPiao.gongSiMingCheng = response.data.bc;
            if($scope.invoiceType == '2'){
              $scope.normalInvoice.TaxpayerNumber = response.data.tpn;
            }else if($scope.invoiceType == '1'){
              $scope.faPiao.shiBieHao = response.data.tpn;
            }
            tempNormalInvoiceType = response.data.nit;
            temp = {
              invoiceHead : response.data.iti,
              TaxpayerNumber : response.data.tpn
            };
            $scope.faPiao.faPiaoTaiTou = response.data.iti; 
            $scope.normalInvoiceType = response.data.nit;
            $scope.faPiao.zhuCeDiZhi = response.data.rga;
            $scope.faPiao.zhuCeDianHua = response.data.rgp;
            $scope.faPiao.kaiHuYinHang = response.data.bn;
            $scope.faPiao.kaiHuZhangHao = response.data.cbn;
            $scope.addressRegionName = response.data.rca?response.data.rca.substring(0,response.data.rca.indexOf(',')):'邮寄地址所在地区:';
            $scope.addressStreet = response.data.rca?response.data.rca.substring(response.data.rca.indexOf(',')+1,response.data.rca.lastIndexOf(',')):'街道:';
            $scope.receipt.address = response.data.rca?response.data.rca.substring(response.data.rca.lastIndexOf(',')+1):'';
            $scope.receipt.consignee = response.data.rcc;
            $scope.receipt.zipcode = response.data.rcz
            $scope.receipt.mobile = response.data.rcm;
          }
        });
      //获取增值税发票数据
      InvoiceService.loadList()
        .success(function (response, status, headers, config) {
          if (response.success) {
            $scope.invoiceList = response.data;
            if($scope.invoiceList.length==0){
              $scope.isChoose=false;
            }else{
              $scope.isChoose=true;
            }
          }
        });
    };
    // 选择街道
    $scope.StreetTop=function () {
      // $scope.streetTextColor = "color-text-s";
      $scope.provinceTop=0;
      $scope.nowLevel=0;
      $scope.nowLevelIndex=[-1,-1,-1];
      $scope.provinceDis=false;
      $scope.cityDis=false;
      $scope.areaDis=false;
      $scope.dataAdd=null;
      $scope.defaultValue=null;
      $scope.selectProvince='';
      $scope.selectCity='';
      $scope.selectArea='';
      if($scope.addressRegionName != '邮寄地址所在地区:'){
        $scope.addressModalStreet.show();
      }else{
        PopupService.showToast('请选择所在地');
        $scope.addressStreet='街道:';
      }

    };
    //地址窗口
    $scope.addressTop = function(){
      $scope.addressTipFlag=false;
      $scope.provinceTop=0;
      $scope.nowLevel=0;
      $scope.nowLevelIndex=[-1,-1,-1];
      $scope.provinceDis=false;
      $scope.cityDis=false;
      $scope.areaDis=false;
      $scope.addressModal.show();
      $scope.dataAdd=null;
      $scope.defaultValue=null;
      $scope.selectProvince='';
      $scope.selectCity='';
      $scope.selectArea='';
      $scope.addressInit($scope.dataAdd,$scope.defaultValue,'CHANGEADDRESS_LOCATION',0);
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
        $scope.dataAdd="";
        //第一次取全国的省直辖市信息
        ADDADDRESSService.getLocationList('', 0).success(function (response) {
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
      'border-bottom':"2px solid red"
    }
    $scope.provinceFlag=false;
    $scope.cityFlag=false;
    $scope.areaFlag=false;
    $scope.selectFlag=true;
    $scope.provinceDis=false;
    $scope.cityDis=false;
    $scope.areaDis=false;
    //返回重新选择省
    $scope.provinceSel = function(){
      $scope.addressInit(null,null,'CHANGEADDRESS_LOCATION',0);
      $scope.selectCity='';
      $scope.selectArea='';
      $scope.provinceFlag=true;
      $scope.selectFlag=false;
      $scope.provinceDis=true;
      $scope.cityDis=false;
      $scope.areaDis=false;
    };
    $scope.goSelectStreet=ionic.Utils.debounce(function (index,item) {

      $scope.level = $scope.level - 1;//-1,下一个 为 －2 ，
      $scope.addressStreet = item.text;
      $scope.streetMsg = item.text;
    //  $scope.address.streetId = item.value;
      /*勿动*/
      $scope.isChangeOrDefault =3; //只修改街道
      $scope.isDef = true;
      // 地址更改存放
      $scope.addChangeAddress.regionName = $scope.addChangeAddress.pca+' '+$scope.addressStreet; //省市区街道
      $scope.addChangeAddress.streetId = item.value;
      //定位
      $scope.positionAddress.streetId = item.value;
      $scope.positionAddress.regionName = $scope.positionAddress.pca+' '+$scope.addressStreet; //省市区街道
      /*勿动*/
      $scope.addressModalStreet.hide();
      if($scope.addressStreet == '街道'){
        $scope.streetTextColor = "color-text-s";
      }else{
        $scope.streetTextColor = "color-text-l";
      }

    });
    //地址
    var isGoing = false;
    $scope.goSelect = ionic.Utils.debounce(function (index,item) {
      for(var i=0;i<$scope.nowLevelIndex.length;i++){
        if(i>$scope.nowLevel){
          $scope.nowLevelIndex[i]=-1;
        }
    }
      $scope.nowLevelIndex[$scope.nowLevel]=index;
      var item = arguments[1];
      var index = arguments[0];
      $scope.level = $scope.level - 1;//-1,下一个 为 －2 ，
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
        ADDADDRESSService.getLocationList(item.value, ah).success(function (response) {
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
          ADDADDRESSService.getLocationList(areaValueCity, 1).success(function (response) {
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
      }else if ($scope.level > -4   && $scope.level!=-3) {//xyz添加远端获取
        $scope.selectCity = $scope.defaultValue['text-2'];
        $scope.provinceFlag=false;
        $scope.cityFlag=false;
        $scope.selectFlag=true;
        $scope.provinceDis=true;
        $scope.cityDis=true;
        $scope.areaDis=false;
        $scope.selectArea= item.text;
        $scope.addressStreet = "街道";
        $scope.textColor = "color-text-l";
        $scope.cityTop=$ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
        ah = $scope.level*-1;
        $scope.addressTip='正在获取地址信息...';
        $scope.addressTipFlag=true;
        ADDADDRESSService.getLocationList(item.value,ah).success(function (response) {
          $scope.dataAdd = response.data;
          $scope.addressTipFlag=false;
          if(ah==2){
          areaValue=item.value;
        }
          var defaultValueFy=JSON.stringify($scope.defaultValue);
          var dataAddFy=JSON.stringify($scope.dataAdd);

          $scope.addressInit(defaultValueFy,dataAddFy,$scope.flag,$scope.level);
        }).error(function (err) {
          PopupService.showToast('获取地址信息失败！');
        });
        $scope.levelArea=$scope.level;
        $scope.levelArea=$scope.levelArea+1;
        //重选区
         $scope.areaSel = function(){
            $scope.addressTip='正在获取地址信息...';
            $scope.addressTipFlag=true;
            $scope.level=$scope.levelArea;
            ADDADDRESSService.getLocationList(areaValue,2).success(function (response) {
            $scope.dataAdd = response.data;
            $scope.addressTipFlag=false;
            var defaultValueFy=JSON.stringify($scope.defaultValue);
            var dataAddFy=JSON.stringify($scope.dataAdd);

            $scope.addressInit(defaultValueFy,dataAddFy,$scope.flag,$scope.level);
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0,$scope.areaTop);
            $scope.areaFlag=true;
            $scope.selectFlag=false;
            $scope.provinceDis=true;
            $scope.cityDis=true;
            $scope.areaDis=true;
          }).error(function (err) {
            PopupService.showToast('获取地址信息失败！');
          });
          }
    }else if($scope.level == -3){
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
        $scope.address.provinceId=$scope.defaultValue['value-1'];
        $scope.address.cityId=$scope.defaultValue['value-2'];
        $scope.address.areaId=$scope.defaultValue['value-3'];
        $scope.address.regionName = $scope.textOne+' ' + $scope.textTwo +' ' + $scope.textThree;
        $scope.addressRegionName = $scope.textOne+' ' + $scope.textTwo +' ' + $scope.textThree;
        $scope.addChangeAddress = {    //变动后地址存储
          'provinceId':$scope.defaultValue['value-1'], //省
          'cityId':$scope.defaultValue['value-2'],  //市
          'areaId':$scope.defaultValue['value-3'], //区
          'streetId':0,
          'pca':$scope.textOne+' ' + $scope.textTwo +' ' + $scope.textThree, //省市区
          'regionName': '' //省市区街道
        };

        $scope.selectArea= item.text;
        $scope.cityFlag=false;
        $scope.areaFlag=false;
        $scope.selectFlag=true;
        $scope.provinceDis=true;
        $scope.cityDis=true;
        $scope.areaDis=true;
        $scope.areaTop=$ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
        ah = $scope.level*-1;
        ADDADDRESSService.getLocationList(item.value,ah).success(function (response) {
          $scope.dataAddStreet = response.data;
          if(ah==2){
            areaValue=item.value;
          }
          var defaultValueFy=JSON.stringify($scope.defaultValue);
          var dataAddFy=JSON.stringify($scope.dataAdd);

          $scope.addressInit(defaultValueFy,dataAddFy,$scope.flag,$scope.level);
        }).error(function (err) {
          PopupService.showToast('获取地址信息失败！');
        });
        $scope.levelArea=$scope.level;
        $scope.levelArea=$scope.levelArea+1;
      }
    else {
        if (isGoing) {
          return;
        }
        $timeout(function () {
          isGoing = false;
        }, 1500);
        $rootScope.$broadcast($scope.flag, $scope.defaultValue);
        isGoing = true;
//      $scope.$ionicGoBack($scope.level);
        $scope.closeAddressModal();
      }
    }, 300);
//自动定位
    $scope.getPosition = function () {
      if ($rootScope.globalConstant.autoPosition == '定位中···') {
        return;
      }

      addressMessage = CommonAddressService.getAddressInfo();
      var detailAddress = addressMessage.regionName + '/' + addressMessage.streetName;
      ADDADDRESSService.addAddress(addressMessage.provinceId, addressMessage.cityId, addressMessage.areaId, detailAddress, addressMessage.streetId)
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
          ADDADDRESSService.getLocationList(addressMessage.areaId,3).success(function (response) {
            $scope.dataAddStreet = response.data;
            var defaultValueFy=JSON.stringify($scope.defaultValue);
            var dataAddFy=JSON.stringify($scope.dataAdd);

            $scope.addressInit(defaultValueFy,dataAddFy,$scope.flag,$scope.level);
          }).error(function (err) {
            PopupService.showToast('获取地址信息失败！');
          });
          $scope.positionAddress = {  //定位地址
            'provinceId':addressMessage.provinceId, //省
            'cityId':addressMessage.cityId,  //市
            'areaId':addressMessage.areaId, //区
            'streetId':0, //街道
            'pca':addressMessage.provinceName+' '+addressMessage.cityName+' '+addressMessage.regionName, //省市区
            'regionName':'' //省市区街道
          };

          $scope.isPosition = true;
          $rootScope.$broadcast($scope.flag, autoAddress);
          $scope.streetTextColor = "color-text-s";
          $scope.addressModal.hide();
          $scope.addressRegionName = $scope.positionAddress.pca;
          $scope.addressStreet = '街道:'
        })

    };
    //窗口modal
    $ionicModal.fromTemplateUrl('templates/common/CommonLocation.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.addressModal = modal;
    });
    $ionicModal.fromTemplateUrl('templates/common/CommonLocationStreet.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.addressModalStreet = modal;
    });
    // CommonLocationStreet
    $scope.closeAddressModal = function () {
      $scope.addressModal.hide();
      $scope.addressModalStreet.hide();
    };
    $scope.preservation=function () {

      $scope.positionCommonFun =function () { //定位函数
        $scope.address.provinceId = $scope.positionAddress.provinceId;
        $scope.address.cityId = $scope.positionAddress.cityId;
        $scope.address.areaId = $scope.positionAddress.areaId;
        $scope.address.streetId = $scope.positionAddress.streetId;
        $scope.address.regionName = $scope.positionAddress.regionName;
      };
    // 新增地址
        if($scope.isPosition){ //定位地址
          $scope.positionCommonFun();
        }
      //调用添加新地址接口
      ADDADDRESSService.doInit($scope.address)
        .success(function (response, status, headers, config) {
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
            $rootScope.addressDefaultMsg = {
              'provinceId': '',
              'cityId': '',
              'regionId': '',
              'streetId': '',
              'provinceName': '',
              'cityName': '',
              'pcrName': '',
            };
            $rootScope.addressStr = undefined;
            $scope.isChangeOrDefault = 0; //区别是否修改
            $scope.positionAddress = {  //定位地址
              'provinceId':0, //省
              'cityId':0,  //市
              'areaId':0, //区
              'streetId':0, //街道
              'pca':'', //省市区
              'regionName':'' //省市区街道
            };

            $scope.panGoOn = false;
            if($scope.fromOrder){
              $scope.$ionicGoBack(-2);//如果从订单页 新增地址 直接 返回订单有

            }else{
              $scope.$ionicGoBack();
            }

          }
        });
    };
    //选择普通发票类型
    $scope.chooseNormalType = function(index){
      if (index == $scope.normalInvoiceType)return;
      $scope.normalInvoiceType = index;
      if($scope.normalInvoiceType != tempNormalInvoiceType){
        $scope.faPiao.faPiaoTaiTou = '';
        $scope.normalInvoice.TaxpayerNumber = '';
      }else{
        $scope.faPiao.faPiaoTaiTou = temp.invoiceHead;
        $scope.normalInvoice.TaxpayerNumber = temp.TaxpayerNumber;
      }
    };
    //电子发票选中
    $scope.dzClick = function () {
      $scope.faPiao.shiBieHao = '';
      $scope.whichActive = 0;
      $scope.invoiceType = '2';
    };

    //增值税发票选中
    $scope.zzClick = function () {
      $scope.faPiao.shiBieHao = '';
      $scope.whichActive = 1;
      $scope.invoiceType = '1';
    };

    $scope.dianZiQueDing = function () {
      if (!( /^.[^&<>]{1,}$/.test($scope.faPiao.faPiaoTaiTou))) {
        $scope.errMessage = '发票抬头必填,且不能包含特殊字符'
      }else{
        if($scope.normalInvoiceType==2){
          if (!(/^[0-9A-Za-z]{18}$|^[0-9A-Za-z]{15}$|^[0-9A-Za-z]{20}$/.test($scope.normalInvoice.TaxpayerNumber))) {
            $scope.errMessage = '识别号为15位或18位或20位的数字或字母';
            $ionicScrollDelegate.scrollTop([shouldAnimate = true]);
          } else {
            $scope.errMessage = '';
            $scope.toSubmit($scope.invoiceType, $scope.faPiao.faPiaoTaiTou, $scope.faPiao.gongSiMingCheng, $scope.normalInvoice.TaxpayerNumber, $scope.faPiao.zhuCeDiZhi, $scope.faPiao.zhuCeDianHua, $scope.faPiao.kaiHuYinHang, $scope.faPiao.kaiHuZhangHao, $scope.receipt.consignee, $scope.receipt.address, $scope.receipt.zipcode, $scope.receipt.mobile, $scope.normalInvoiceType)
          }
        }else {
          $scope.errMessage = null;
          $scope.normalInvoice.TaxpayerNumber = '';
          //表单验证通过
          $scope.toSubmit($scope.invoiceType, $scope.faPiao.faPiaoTaiTou, $scope.faPiao.gongSiMingCheng, $scope.normalInvoice.TaxpayerNumber, $scope.faPiao.zhuCeDiZhi, $scope.faPiao.zhuCeDianHua, $scope.faPiao.kaiHuYinHang, $scope.faPiao.kaiHuZhangHao, $scope.receipt.consignee, $scope.receipt.address, $scope.receipt.zipcode, $scope.receipt.mobile,$scope.normalInvoiceType)
        }
      }
    };

    $scope.naShuiQueDing = function () {
      if (!( /^.[^&<>]{1,}$/.test($scope.faPiao.gongSiMingCheng)) || (!$scope.faPiao.gongSiMingCheng)) {
        $scope.errMessage = '公司名称必填,且不能包含特殊字符';
        $ionicScrollDelegate.scrollTop([shouldAnimate = true]);
      } else if (!(/^[0-9A-Za-z]{18}$|^[0-9A-Za-z]{15}$|^[0-9A-Za-z]{20}$/.test($scope.faPiao.shiBieHao))) {
        $scope.errMessage = '识别号为15位或18位或20位的数字或字母';
        $ionicScrollDelegate.scrollTop([shouldAnimate = true]);
      } else if (!( /^.[^&<>]{4,}$/.test($scope.faPiao.zhuCeDiZhi)) || (!$scope.faPiao.zhuCeDiZhi)) {
        $scope.errMessage = '注册地址至少5个字符，且不能包含特殊字符';
        $ionicScrollDelegate.scrollTop([shouldAnimate = true]);
      } else if (($scope.faPiao.zhuCeDianHua&&$scope.faPiao.zhuCeDianHua.length < 8) || (!$scope.faPiao.zhuCeDianHua)) {
        $scope.errMessage = '注册电话格式：0532-12345678';
        $ionicScrollDelegate.scrollTop([shouldAnimate = true]);
      } else if (!$scope.faPiao.kaiHuYinHang) {
        $scope.errMessage = '开户银行为必填';
        $ionicScrollDelegate.scrollTop([shouldAnimate = true]);
      } else if (!$scope.faPiao.kaiHuZhangHao) {
        $scope.errMessage = '开户账号为必填';
        $ionicScrollDelegate.scrollTop([shouldAnimate = true]);
      } else if(!($scope.addressRegionName=='邮寄地址所在地区:'&&($scope.addressStreet=='街道:' || $scope.addressStreet=='街道')&&(!$scope.receipt.address))){
        if($scope.addressRegionName=='邮寄地址所在地区:'){
          $scope.errMessage = '请选择所在地区';
        $ionicScrollDelegate.scrollTop([shouldAnimate = true]);
        } else if($scope.addressStreet=='街道:'|| $scope.addressStreet=='街道'){
          $scope.errMessage = '请选择所在街道';
        $ionicScrollDelegate.scrollTop([shouldAnimate = true]);
        }else if(!$scope.receipt.address){
          $scope.errMessage = '请填写详细地址';
        $ionicScrollDelegate.scrollTop([shouldAnimate = true]);
        }else{
          $scope.preservation();
        $scope.errMessage = null;
        //表单验证通过
        if($scope.receipt.address){
          $scope.addressback = $scope.addressRegionName +','+ $scope.addressStreet +','+ $scope.receipt.address;
        } 
        $scope.toSubmit($scope.invoiceType, $scope.faPiao.faPiaoTaiTou, $scope.faPiao.gongSiMingCheng, $scope.faPiao.shiBieHao, $scope.faPiao.zhuCeDiZhi, $scope.faPiao.zhuCeDianHua, $scope.faPiao.kaiHuYinHang, $scope.faPiao.kaiHuZhangHao, $scope.receipt.consignee, $scope.addressback, $scope.receipt.zipcode, $scope.receipt.mobile)
        }
      }else {
          $scope.preservation();
        $scope.errMessage = null;
        //表单验证通过
        if($scope.receipt.address){
          $scope.addressback = $scope.addressRegionName +','+ $scope.addressStreet +','+ $scope.receipt.address;
        } 
        $scope.toSubmit($scope.invoiceType, $scope.faPiao.faPiaoTaiTou, $scope.faPiao.gongSiMingCheng, $scope.faPiao.shiBieHao, $scope.faPiao.zhuCeDiZhi, $scope.faPiao.zhuCeDianHua, $scope.faPiao.kaiHuYinHang, $scope.faPiao.kaiHuZhangHao, $scope.receipt.consignee, $scope.addressback, $scope.receipt.zipcode, $scope.receipt.mobile)
      }
    };

    $scope.toSubmit = function (invoiceType, billCompany, invoiceTitle, taxPayerNumber, registerAddress, registerPhone, bankName, bankCardNumber, receiptConsignee, receiptAddress, receiptZipcode, receiptMobile,normalInvoiceType) {
      console.log(receiptAddress)
      if ($scope.enterPage == 0) {
        // InvoiceService.submitInvoice(invoiceType, billCompany, invoiceTitle, taxPayerNumber, registerAddress, registerPhone, bankName, bankCardNumber, receiptConsignee, receiptAddress, receiptZipcode, receiptMobile,normalInvoiceType)
        //   .success(function (response, status, headers, config) {
        //     if (response.success) {
        //       $rootScope.isInvoice = true;
        //       $ionicHistory.goBack();
        //     }
        //   });
        // yl     bc 和iti 字段接口交换
        InvoiceService.submitInvoice(invoiceType, invoiceTitle, billCompany, taxPayerNumber, registerAddress, registerPhone, bankName, bankCardNumber, receiptConsignee, receiptAddress, receiptZipcode, receiptMobile,normalInvoiceType)
          .success(function (response, status, headers, config) {
            if (response.success) {
              $rootScope.isInvoice = true;
              $ionicHistory.goBack();
            }
          });
      } else if ($scope.enterPage == 1) {
        // InvoiceService.submitInvoiceSeckill(payment, invoiceType, invoiceTitle, billCompany, taxPayerNumber, registerAddress, registerPhone, bankName, bankCardNumber, receiptConsignee, receiptAddress, receiptZipcode, receiptMobile,normalInvoiceType)
        //   .success(function (response, status, headers, config) {
        //     if (response.success) {
        //       $ionicHistory.goBack();
        //     }
        //   });
        // yl bc 和iti 字段接口交换
          InvoiceService.submitInvoiceSeckill(payment, invoiceType,billCompany, invoiceTitle, taxPayerNumber, registerAddress, registerPhone, bankName, bankCardNumber, receiptConsignee, receiptAddress, receiptZipcode, receiptMobile,normalInvoiceType)
          .success(function (response, status, headers, config) {
            if (response.success) {
              $ionicHistory.goBack();
            }
          });
      }
    };

    $scope.popMessage = function () {
      $ionicPopup.alert({
        templateUrl: "http://www.ehaier.com/mstatic/test/wd/activity/invoiceRule.html",
        cssClass: ''
      });

    };

    $scope.choose = function () {
      $state.go('invoiceList');
    };

    $ionicModal.fromTemplateUrl('templates/invoice/InvoiceList.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function () {
      $scope.modal.show();
      //获取发票数据
      InvoiceService.loadList()
        .success(function (response, status, headers, config) {
          if (response.success) {
            $scope.invoiceList = response.data;
          }
        });
    };

    $scope.closeModal = function () {
      $scope.modal.hide();
    };

    $scope.listClick = function (index) {
      $scope.closeModal();
      //获取发票数据
      InvoiceService.loadList()
        .success(function (response, status, headers, config) {
          if (response.success) {
            $scope.invoiceList = response.data;
            $scope.faPiao.gongSiMingCheng = $scope.invoiceList[index].invoiceTitle;
            $scope.faPiao.shiBieHao = $scope.invoiceList[index].taxPayerNumber;
            $scope.faPiao.zhuCeDiZhi = $scope.invoiceList[index].registerAddress;
            $scope.faPiao.zhuCeDianHua = $scope.invoiceList[index].registerPhone;
            $scope.faPiao.kaiHuYinHang = $scope.invoiceList[index].bankName;
            $scope.faPiao.kaiHuZhangHao = $scope.invoiceList[index].bankCardNumber;
          }
        });
    };

    $scope.note = function(){
      PopupService.showAlert('','\<div style="text-align:left;color:#666;">普通发票分为电子发票与纸质发票两种，以实际开票为准，不支持更换选择，订单确认后可在订单详情-发票信息模块查看具体信息；\<br\>\<br\>' +
          '电子发票是经过国家税务局机关认可的有效凭证,同样具有保修与财务报销的效力。相关内容您可以咨询海尔商城在线客服,或拨打海尔商城服务热线4006 999 999,同时您也可以拨打税务热线12366进行咨询。电子发票相关政策您还可以查看《青岛市国家税务局电子发票管理办法（试行）》,或登录青岛市电子发票服务平台www.chinaeinv.com查询。\<br\>\<br\>' +
          '纸质发票是由顺逛官方授权店进行开具。\<br\>\<br\>' +
        '增值税专用发票需自行选择，并详细填写公司名称、税号、地址、电话、开户银行和帐号，并注意所填的内容须与纳税信息一致。\<br\>另外需提供一般纳税人认证资料（营业执照副本、税务登记证副本、一般纳税人资格证书、银行开户许可证复印件）及顺逛订单号发送邮件至fapiao@ehaier.com，我们会根据您提供的资料进行资质审核，审核无误后将在订单完成关闭1-2周左右的时间为您开具发票并安排邮寄。\<\/div\>')
    };
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    })
  }]);


APP.service('InvoiceService', ['$http', 'UrlService', function ($http, UrlService) {
  this.loadData = function () {
    return $http({
      method:'POST',
      url:UrlService.getUrl('ORDER_INVOICE')
    });
  };

  this.loadList = function (params) {
    params = {
      //memberId: 13823483  去掉memberId
    };
    return $http.get(UrlService.getUrl('ORDER_INVOICE_LIST'), params);
  };
  this.submitInvoice = function (invoiceType, billCompany, invoiceTitle, taxPayerNumber, registerAddress, registerPhone, bankName, bankCardNumber, receiptConsignee, receiptAddress, receiptZipcode, receiptMobile,normalInvoiceType) {
    var params = {
      it: invoiceType,
      bc: billCompany,
      iti: invoiceTitle,
      tpn: taxPayerNumber,
      rga: registerAddress,
      rgp: registerPhone,
      bn: bankName,
      cbn: bankCardNumber,
      rcc: receiptConsignee,
      rca: receiptAddress,
      rcz: receiptZipcode,
      rcm: receiptMobile,
      nit:normalInvoiceType
    };

    return $http({
      method: 'POST',
      url: UrlService.getUrl('SUBMIT_INVOICE'),
      data: params
      //headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });


  };

  this.submitInvoiceSeckill = function (payment, invoiceType, billCompany, invoiceTitle, taxPayerNumber, registerAddress, registerPhone, bankName, bankCardNumber, receiptConsignee, receiptAddress, receiptZipcode, receiptMobile) {
    var params = {
      payment: payment,
      invoiceType: invoiceType,
      billCompany: billCompany,
      invoiceTitle: invoiceTitle,
      taxPayerNumber: taxPayerNumber,
      registerAddress: registerAddress,
      registerPhone: registerPhone,
      bankName: bankName,
      bankCardNumber: bankCardNumber,
      receiptConsignee: receiptConsignee,
      receiptAddress: receiptAddress,
      receiptZipcode: receiptZipcode,
      receiptMobile: receiptMobile
    };

    return $http({
      method: 'POST',
      url: UrlService.getUrl('SUBMIT_INVOICE_SECKILL'),
      params: params
      //headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });


  };

  this.pageSubmit = function () {
    var param = {isFromInvoices: 1}
    return $http.get(UrlService.getUrl('CONFIRM_ORDER'), param);

  };
}]);
