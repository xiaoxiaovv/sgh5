APP.controller('itSoluteDetailController', ['$q','CreditService','$cookies','$stateParams', '$scope', '$rootScope', 'UrlService', 'UserService', '$state', '$http','itSoluteDetailService', '$timeout', '$localstorage', '$ionicSlideBoxDelegate', '$ionicPopup', 'PopupService', 'GoodsService', '$ionicModal', '$ionicScrollDelegate','ProductDetailService','CommonAddressService','CartService','PersonalCenterService',function($q,CreditService,$cookies,$stateParams, $scope, $rootScope, UrlService, UserService, $state, $http,itSoluteDetailService, $timeout, $localstorage, $ionicSlideBoxDelegate, $ionicPopup, PopupService, GoodsService, $ionicModal,$ionicScrollDelegate,ProductDetailService,CommonAddressService,CartService,PersonalCenterService) {
	var confirmPopup;//弹窗定义
  $scope.solutionId = $stateParams.solutionId;//从路由获取
  $scope.soluDetail = {};//方案描述数据
  $scope.productIds = '';//商品列表id
  $scope.productList =[];//商品数据
  $scope.productTotalprice = 0;//清单商品总价
  $scope.selectnumber = 0;//已选数量
  $scope.selectprice = 0;//已选商品总价
  $scope.selectcommsion = 0;//已选商品总佣金
  $scope.detailList = []; //商品
  $scope.obj = {};
  $scope.num =-1; // 记录商品
  $scope.arr= [];
  $scope.productListMore=[]; //更多

  $scope.all = {
      isAllChecked:true//全选标识
    };
  $scope.usermes = {//预约信息
    name:'',
    mobl:''
  }
  //结算所需参数对象json定义
  $scope.orderInitParams = null;
  //位置信息
  $scope.pid = 0;
  $scope.cid = 0;
  $scope.aid = 0;
  //分享
  $scope.shareimg = $rootScope.smartNav?$rootScope.smartNav:'http://cdn09.ehaier.com/shunguang/H5/www/img/share_default.png'; //分享图片路径
  $scope.showShare = false; //分享界面显示隐藏
  $scope.sharedesp = ''; //分享描述
    $scope.init = function(){
      /*********************分享标签－whiteBird start*********************/
    $scope.showQQ = false;
    $scope.showWeChat = false;
    $scope.showShare = false; //分享菜单显示
    //页面数据
    $scope.exportDate = [];//专家团队数据
    $scope.recommend = [];//推荐方案数据
    $scope.housetopic = [];//下方案例
    $scope.housetopictitle = '';//案例标题
    if (window.cordova) {
      $scope.isApp = true;
    } else {
      $scope.isApp = false;
    }
    if (window.cordova) {
      window.umeng.checkAppInstalled('qq', function(data) {

        if (data == false) {
          $scope.showQQ = false;
        } else {
          $scope.showQQ = true;
        }
      });
      window.umeng.checkAppInstalled('wechat', function(data) {
        if (data == false) {
          $scope.showWeChat = false;
        } else {
          $scope.showWeChat = true;
        }
      });
    }
    $scope.$broadcast('scroll.refreshComplete');
    /*********************分享标签－whiteBird end*********************/
      //店铺id
      if($stateParams.shareId){
          $scope.storeId = $stateParams.shareId;
      }else{
        $scope.storeId = $localstorage.get('storeId', $rootScope.globalConstant.storeId);
      }
      if($scope.storeId!=20219251&&$scope.storeId!=''){
          $scope.isLogin = true;
      }else{
          $scope.isLogin = false;
      }
      //数据
      itSoluteDetailService.soluteDetail($scope.solutionId).success(function(res){
        $scope.soluDetail = res.data;
        $scope.sharedesp = res.data.name;
        $scope.productIds = res.data.productsIds;
        $scope.obj = res.data.groupProducts;
        for(var item in $scope.obj){
          $scope.arr.push($scope.obj[item][0].productId);
          $scope.detailList.push($scope.obj[item])
        }
        console.log($scope.detailList)
        //  $scope.productIds =  $scope.arr.join(',');   // 暂时不用

        itSoluteDetailService.productList($scope.productIds,$scope.streetId,$scope.storeId,$scope.cid,$scope.pid,$scope.aid).success(function(response){
          console.log(response);
          $scope.productList = response.data;
          // var list = [];
          // if($scope.productList.length!=0 && $scope.arr.length!=0){
          //   for(var i=0;i<$scope.arr.length;i++){
          //     for(var j=0;j<$scope.productList.length;j++){
          //       if( $scope.arr[i] == $scope.productList[j].id){
          //         list.push($scope.productList[j])
          //         break;
          //       }
          //     }
          //   }
          // }
          // $scope.productList =list;
          //清单商品总价
          for(var i = 0;i<$scope.productList.length;i++){
            $scope.productTotalprice+=$scope.productList[i].price;
            $scope.selectcommsion+=$scope.productList[i].commission;
            $scope.productList[i].checked = true;
            $scope.productList[i].isMore = false;

            if($scope.detailList[i].length>1){
              $scope.productList[i].isMore = true;
            }
          }
          //商品默认全选
          $scope.selectnumber = $scope.productList.length;
          $scope.selectprice = $scope.productTotalprice;
          $scope.all.isAllChecked = true;
        });
      });
    }
    // 更多选择
  $scope.choiceMore = function (index,itemId) {
    $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
    console.log(itemId)
    $scope.num = index;
    $scope.StoreMsgModal.show();
    var id = '';
    var arrId=[];
    for(var i = 0;i<$scope.detailList[index].length;i++){
      arrId.push($scope.detailList[index][i].productId);
    }
    id = arrId.join(',');
    console.log(id)
    console.log($scope.detailList[index])
    itSoluteDetailService.productList(id,$scope.streetId,$scope.storeId,$scope.cid,$scope.pid,$scope.aid)
      .success(function(response){
        console.log(response);
        $scope.productListMore = response.data;
        //清单商品总价
        for(var i = 0;i<$scope.productListMore.length;i++){

          if(itemId == $scope.productListMore[i].id){
            $scope.productListMore[i].checked = true;
          }
        }

        //商品默认全选
        $scope.selectnumber = $scope.productList.length;

      });
  };
  // 硬装modal
  $ionicModal.fromTemplateUrl('templates/common/CommonMoreChoice.html', {
    scope: $scope,
    animation: 'slide-in-up',
  }).then(function (modal) {
    $scope.StoreMsgModal = modal;
  });
  $scope.closeStoreModal = function () {
    $scope.StoreMsgModal.hide();
  };
    //选择商品
    $scope.select = function(item){
      $scope.selectprice = 0;
      $scope.selectnumber = 0;
      $scope.selectcommsion = 0;
       for(var i = 0;i<$scope.productList.length;i++){
            if($scope.productList[i].checked == true){
              $scope.all.isAllChecked = true;
            }else{
              $scope.all.isAllChecked = false;
              break;
            }
          }
         for(var j = 0;j<$scope.productList.length;j++) {
          if($scope.productList[j].checked == true){
            $scope.selectprice += $scope.productList[j].price;
            $scope.selectnumber++;
            $scope.selectcommsion+=$scope.productList[j].commission;
          }
         }
    }
  $scope.choiceSelect = function (item) {
    console.log(item)
    var isCheckedList = '';
    for(var i = 0;i<$scope.productListMore.length;i++){
      $scope.productListMore[i].checked = false;
      if(item.id == $scope.productListMore[i].id){
        $scope.productListMore[i].checked = true;
      }
      if($scope.productListMore[i].checked == true){
        isCheckedList = $scope.productListMore[i];

      }
    }
    $scope.productList[$scope.num] = isCheckedList;
    $scope.productList[$scope.num].isMore = true;
    $scope.selectprice = 0;
    $scope.selectnumber = 0;
    $scope.selectcommsion = 0;
    for(var j = 0;j<$scope.productList.length;j++) {
      if($scope.productList[j].checked == true){
        $scope.selectprice += $scope.productList[j].price;
        $scope.selectnumber++;
        $scope.selectcommsion+=$scope.productList[j].commission;
      }
    }
    $scope.productTotalprice = $scope.selectprice;
    $scope.StoreMsgModal.hide();
  };
    //全选
    $scope.selectall = function(){
        if($scope.all.isAllChecked){
          $scope.selectnumber = $scope.productList.length;
          $scope.selectprice = $scope.productTotalprice;
          for(var i = 0;i<$scope.productList.length;i++){
            $scope.productList[i].checked = true;
            $scope.selectcommsion+=$scope.productList[i].commission;
          }
        }else{
          $scope.selectnumber = 0;
          $scope.selectprice = 0;
          $scope.selectcommsion = 0;
          for(var i = 0;i<$scope.productList.length;i++){
            $scope.productList[i].checked = false;
          }
        }

    }
    $scope.placeorder = function () {
      if (!UserService.getUser().mid) {
         $state.go('login');
          return;
         }
      var proList = [];
      for(var i = 0;i<$scope.productList.length;i++){
        if($scope.productList[i].checked){
          proList.push({
            'proId':$scope.productList[i].id,
            'num':1
          })
        }
      }
      $scope.orderInitParams = {
            "proList": proList,
            "street": $scope.streetId
      }
      CartService.settlement($scope.orderInitParams)
                .success(function (response, status, headers, config) {
                  if(response.success == false){
                    PopupService.showToast(response.message);
                  }else{
                    if (response.success == true && response.data != null) {
                    var expireDate = new Date();
                    expireDate.setDate(expireDate.getDate() + 1);
                    $cookies.put('is_book', '', {expires: expireDate, path: '/'});
                    $state.go('orderConfirm',{orderInitParams: JSON.stringify($scope.orderInitParams)});
                  } else {
                    PopupService.showToast('结算失败');
                  }
                }
              });
    }
		$scope.predesgin = function(){
			confirmPopup = $ionicPopup.show({
    					  cssClass:'xvv-predesgin',
                          template: '<div class="preexdes"><div>预约免费设计<img src="{{imgBaseURL}}img/linshi/xxx@2x.png" ng-click="colsepop()"/></div><div>您的姓名<input type="text" maxlength="10" placeholder="请输入您的姓名" ng-model="usermes.name"/></div><div>手机号码<input type="text" placeholder="请输入手机号码" maxlength="11" ng-model="usermes.mobl"/></div><div ng-click="addressTop()"><img src="{{imgBaseURL}}img/linshi/position@2x.png"/><span>{{getarr}}</span><img src="{{imgBaseURL}}img/linshi/morez@2x.png"/></div><div ng-click="yuyue()">立即预约</div></div>',
                          scope: $scope

                        })

		}
		$scope.colsepop = function(){
			confirmPopup.close();
		}
		$scope.yuyue = function(){
      if ($scope.usermes.name.length == 0) {
          PopupService.showToast('请输入您的姓名');
        }else if(/[@#\$%\^&\*]+/g.test($scope.usermes.name)){
          PopupService.showToast('姓名不能包含非法字符');
        }else if($scope.usermes.mobl.length == 0){
          PopupService.showToast('请输入手机号');
        }else if(!($scope.globalConstant.mobileNumberRegExp.test($scope.usermes.mobl))){
          PopupService.showToast('请输入正确的手机号格式');
        }else{
          switch($scope.pid)
            {
              case 2:
                $scope.cityname='北京市';
              break;
              case 3:
              $scope.cityname='天津市';
              break;
              case 10:
              $scope.cityname='上海市';
              break;
              case 23:
              $scope.cityname='重庆市';
              break;
            }
          itSoluteDetailService.yuyue($scope.cid,$scope.solutionId,1,$scope.usermes.mobl,$scope.usermes.name,$scope.pid,$scope.aid,$scope.cityname).success(function(res){
              console.log(res);
              if(res.data){
                PopupService.showToast('<div style="height:40px;line-height:40px;">恭喜，预约成功</div>');
                confirmPopup.close();
              }else{
                PopupService.showToast(res.message);
              }
          }).error(function(err){
            PopupService.showToast('网络错误，检查网络后再试');
          });
        }
		}
    //分享
  $scope.goshare = function() {
    if (!UserService.getUser().mid) {
      $state.go('login');
      return;
    }
    $scope.showShare = !$scope.showShare;
  };
  //复制
  $scope.copeText = function(text) {
    if (window.cordova) {
      cordova.plugins.clipboard.copy(text);
      PopupService.showToastShort('复制成功');
    } else {
      PopupService.showToast('请下载APP执行此操作');
    }
  };
  //关闭分享
  $scope.hideblackCover = function() {
    $scope.showShare = false;
  };
  //分享方法
  $scope.shareToPlatform = function(index) {
    var title = $scope.sharedesp; //分享标题
    var content = $scope.soluDetail.introduction; //分享内容
    var pic = $scope.shareimg ? $scope.shareimg : 'http://cdn09.ehaier.com/shunguang/H5/www/img/share_default.png'; //分享图片，写绝对路径
    var url = UrlService.getShareLinkHeader() + 'itSoluteDetail/' + $scope.solutionId;

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
		//地址选择框高度
    var screenHeight = window.innerHeight;
    var topHeight = 250 + 123;
    var topDis = 87;
    var contentHeight = screenHeight - topHeight + 'px';
  var hig = screenHeight - 313  + 'px';
    var topDisHeight = topDis + 'px';
    $scope.contentHeight = {
      'height': contentHeight
      //      'top':topDisHeight
    }
  $scope.hig = {
    'height': hig
    //      'top':topDisHeight
  }
    /** 地址变量声明 **/
    $scope.addressTitle = '选择地区';
    $scope.dataAdd = null;
    $scope.flag = 'PRODUCT_DETAIL_LOCATION';
    $scope.defaultValue = null;
    $scope.level = 0;
    var addressMessage = {}; //自动定位地址信息
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
      confirmPopup.close();
      $scope.addressInit($scope.dataAdd, $scope.defaultValue, 'PRODUCT_DETAIL_LOCATION', 0);
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
        $scope.dataAdd="";
        //第一次取全国的省直辖市信息
        $http.get("data/region.json")
          .success(function (response) {
            $scope.dataAdd = response.data;
            $scope.finish = true;
            $scope.nowLevel = $scope.level;
            $scope.nowLevel = $scope.nowLevel * (-1);
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
      $scope.addressInit(null, null, 'PRODUCT_DETAIL_LOCATION', 0);
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
        $http.get("data/region.json")
          .success(function (response) {
            if ($scope.level == -1) {
              $scope.selectProvince = item.text;
              $scope.provinceIndex = index;
              $scope.dataAdd = response.data[index].children;
              $scope.provinceFlag = false;
              $scope.selectFlag = true;
              $scope.provinceDis = true;
              $scope.provinceTop = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
              $scope.nowLevel = $scope.level;
              $scope.nowLevel = $scope.nowLevel * (-1);
              //重选市
              $scope.citySel = function () {
                $scope.dataAdd="";
                $scope.addressInit(defaultValueFy, dataAddFy, $scope.flag, -1);
                $scope.dataAdd = response.data[index].children;
                $scope.selectArea = '';
                $scope.cityFlag = true;
                $scope.selectFlag = false;
                $scope.provinceDis = true;
                $scope.cityDis = true;
                $scope.areaDis = false;
                $ionicScrollDelegate.$getByHandle('mainScroll').scrollTo(0, $scope.cityTop);
              }
            } else {
              $scope.dataAdd = $scope.dataAdd[index].children;
            }
            var defaultValueFy = JSON.stringify($scope.defaultValue);
            var dataAddFy = JSON.stringify($scope.dataAdd);

            $scope.addressInit(defaultValueFy, dataAddFy, $scope.flag, $scope.level);
          })
          .error(function (err) {
            PopupService.showToast('获取地址信息失败！');
          });
      } else if ($scope.level > -4) { //xyz添加远端获取
        $scope.selectCity = $scope.defaultValue['text-2'];
        $scope.provinceFlag = false;
        $scope.cityFlag = false;
        $scope.selectFlag = true;
        $scope.provinceDis = true;
        $scope.cityDis = true;
        $scope.areaDis = false;
        if ($scope.level == -3) {
          $scope.selectArea = item.text;
          $scope.cityFlag = false;
          $scope.areaFlag = false;
          $scope.selectFlag = true;
          $scope.provinceDis = true;
          $scope.cityDis = true;
          $scope.areaDis = true;
          $scope.areaTop = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top
        } else {
          $scope.cityTop = $ionicScrollDelegate.$getByHandle('mainScroll').getScrollPosition().top;
        }
        ah = $scope.level * -1;
        $scope.addressTip='正在获取地址信息...';
        $scope.addressTipFlag=true;
        ProductDetailService.getLocationList(item.value, ah).success(function (response) {
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
          $scope.addressTip='正在获取地址信息...';
          $scope.addressTipFlag=true;
          $scope.dataAdd="";
          $scope.level = $scope.levelArea;
          ProductDetailService.getLocationList(areaValue, 2).success(function (response) {
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
      $scope.getarr = addressMessage.provinceName+addressMessage.cityName+addressMessage.regionName+addressMessage.streetName;
      $scope.pid = addressMessage.provinceId;
      $scope.cid = addressMessage.cityId;
      $scope.aid = addressMessage.areaId;
      $scope.cityname = addressMessage.cityName;
      $scope.addressModal.hide();
      $scope.predesgin();
    };
    //窗口modal
    $ionicModal.fromTemplateUrl('templates/common/CommonLocation.html', {
      scope: $scope,
      animation: 'slide-in-up',
      backdropClickToClose:false,
    }).then(function (modal) {
      $scope.addressModal = modal;
    });
    $scope.closeAddressModal = function () {
      $scope.addressModal.hide();
      if($scope.defaultValue['text-1']&&$scope.defaultValue['text-2']&&$scope.defaultValue['text-3']&&$scope.defaultValue['text-4']){
        $scope.getarr = $scope.defaultValue['text-1']+$scope.defaultValue['text-2']+$scope.defaultValue['text-3']+$scope.defaultValue['text-4'];
        $scope.pid = $scope.defaultValue['value-1'];
        $scope.cid = $scope.defaultValue['value-2'];
        $scope.aid = $scope.defaultValue['value-3'];
        $scope.cityname = $scope.defaultValue['text-2'];
      }else{

      }
       $scope.predesgin();
    };
    function getAddress() {
      var deferred = $q.defer();
      GoodsService.getAddress()
        .success(function (res) {
          if (res.data == null) {
            var addressMessage = CommonAddressService.getAddressInfo();
            if (addressMessage) {
              $scope.region = addressMessage.regionName;
              deferred.resolve(addressMessage);
            } else {
              $scope.region = '崂山区';
              var obj = {
                provinceId: '16',
                cityId: '173',
                regionId: '2450',
                streetId: '12036596'
              }
              deferred.resolve(obj);
            }
          } else {
            var obj = eval(res.data);
            var regionIndex = obj[0].regionName.indexOf('/');
            $scope.region = obj[0].regionName.substr(0, regionIndex);
            deferred.resolve(obj[0]);
          }
        })
      return deferred.promise;
    }
  //   //
  // $scope.$on('$ionicView.beforeLeave', function (e,v){
  //
  // });
    $scope.goProductDetail =function () {
      $scope.StoreMsgModal.hide();
    }
    $scope.$on('$ionicView.beforeEnter', function (e,v){
      if(v.direction == 'back'){

      }else {

        $scope.detailList = []; //商品
        $scope.obj = {};
        $scope.num = -1; // 记录商品
        $scope.arr = [];
        $scope.productListMore = []; //更多

        $scope.nowLevel = 0;
        $scope.nowLevelIndex = [-1, -1, -1, -1];
        $scope.provinceTop = 0;
        $scope.cityTop = 0;
        $scope.areaTop = 0;
        $scope.defaultValue = null;
        $scope.dataAdd = null;
        $scope.productTotalprice = 0;
        $scope.selectnumber = 0;//已选数量
        $scope.selectprice = 0;//已选商品总价
        $scope.selectcommsion = 0;//已选商品总佣金
        var shushiaddress = CommonAddressService.getAddressInfo();
        $scope.getarr = shushiaddress.provinceName + shushiaddress.cityName + shushiaddress.regionName + shushiaddress.streetName;
        getAddress()
          .then(function (res) {
            console.log(res);
            $scope.pid = res.provinceId;
            $scope.cid = res.cityId;
            $scope.aid = res.areaId;
            $scope.streetId = res.streetId;
          })
        $scope.cityname = shushiaddress.cityName;
        $scope.addressInit($scope.dataAdd, $scope.defaultValue, 'PRODUCT_DETAIL_LOCATION', 0);
        $scope.init();
      }
    })
}]);


APP.service('itSoluteDetailService', ['$http', 'UrlService', function($http, UrlService) {
  this.soluteDetail = function (id) {
    var params = {
      id:id
    }
    return $http.get(UrlService.getNewUrl('ITSOLU_DETAIL'), params);
  }
  this.productList = function (ids,streetId,memberId,cityId,provinceId,regionId) {
    var  params = {
      productsIds:ids,
      streetId:streetId,
      storeId:memberId,
      cityId:cityId,
      provinceId:provinceId,
      regionId:regionId
    }
    return $http.get(UrlService.getNewUrl('ITSOLU_PRODUCTLIST'),params);
  }
  this.yuyue = function(cityId,detailsId,itemsId,mobile,name,provinceId,regionId,cityName){
    var params = {
      "channel":1,
      "cityId":cityId,
      "cityName":cityName,
      "detailsId":Number(detailsId),
      "itemsId":itemsId,
      "mobile":mobile,
      "name":name,
      "provinceId":provinceId,
      "regionId":regionId
    };
    return $http({
      method:'POST',
      url:UrlService.getNewUrl('HOUSE_YUYUE'),
      params:params
    });
  }


}]);
