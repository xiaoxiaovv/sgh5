/**
 * Created by ZXT on 2016/3/15.
 */
APP.controller('ProductDetailController', ['GoodsService', 'CirclePageService','$localstorage', 'HomePageService', '$interval', '$scope', '$sce', '$stateParams', '$rootScope', 'ProductDetailService', 'CommonAddressService',
  '$ionicPopup', '$timeout', '$ionicSlideBoxDelegate', '$state', 'UserService', 'UrlService',
  'PopupService', '$cookies', 'LoginService', 'ShopService', '$ionicHistory', 'CreditService', '$ionicModal', '$http', '$ionicScrollDelegate', 'GetCouponsService', 'flashService', 'WhiteShowsService', 'CartService', '$location', 'IMService', 'GetStatisticInfoService',
  function (GoodsService,CirclePageService, $localstorage, HomePageService, $interval, $scope, $sce, $stateParams, $rootScope, ProductDetailService, CommonAddressService, $ionicPopup, $timeout, $ionicSlideBoxDelegate,
    $state, UserService, UrlService, PopupService, $cookies, LoginService, ShopService, $ionicHistory, CreditService, $ionicModal, $http, $ionicScrollDelegate, GetCouponsService, flashService, WhiteShowsService, CartService, $location, IMService, GetStatisticInfoService) {
     stop_browser_behavior: false

    self.touchStart = function(e) {
      self.startCoordinates = getPointerCoordinates(e);

      if ( ionic.tap.ignoreScrollStart(e) ) {
        return;
      }

      if( ionic.tap.containsOrIsTextInput(e.target) ) {
        // do not start if the target is a text input
        // if there is a touchmove on this input, then we can start the scroll
        self.__hasStarted = false;
        return;
      }

      self.__isSelectable = true;
      self.__enableScrollY = true;
      self.__hasStarted = true;
      self.doTouchStart(e.touches, e.timeStamp);
      // e.preventDefault();
    };
    /** 变量声明 **/
    if (window.location.href.indexOf('fromCommunity') != -1) { // 表示是从社群跳转到的H5登录页
      $rootScope.fromCommunity = true;
    }
    $scope.hasProgram = 0;
    //更改地址页面载入不需要刷新
    $scope.noFresh = false;
    $scope.remindSuccess = false;
    $scope.hasMoreCoupons = false; //是否有更多优惠券
    var startIndex = 1;
    var pageSize = 5;
    var myPopupCui;
    $scope.expectTime = ''; //预计送达时间
    $scope.commission = null;
    $scope.finMoreAct = false; //微价大于价格，价格不显示
    $scope.finalPrice = ''; //价格参数
    $scope.actualPrice = '';
    $scope.bigActivity = false; //送达时间开关
    $scope.getcoupons = false; //新优惠券开关
    //选择规格数量
    var sgAttributeNum = 0;//属性的种类数目
    $scope.IsShowAttribute = ''; //判断规格数量是否展示；
    $scope.StoreAttribute = null; //规格数量列表
    $scope.StoreAttributePrice = 0; //规格数量-默认价格
    $scope.StoreAttributNumber = '有货'; //规格数量-默认库存
    $scope.StoreAttributeActiveList = [];// 已选中的
    $scope.attrValueIds = [];//已选中的 商品子属性ids,用逗号分隔
    $scope.attrValueIdsBefore = [];//点击之前已选中的 商品子属性ids,用逗号分隔
    $scope.attrValueNames = [];//已选中的 商品子属性名称,用逗号分隔
    $scope.NoActiveObj = [];//没选中的对象；
    $scope.skku = null; //当全选才能获取到skku；
    $scope.openSpecNumberType = null;/*弹层打开的类型 【1：规格数量 2：添加购物车 3：立即购买 4：立即抢购 5：马上预定 6：货到通知 7:开抢通知 8:立即预约 9:马上抢购】*/
    $scope.isOpenBottom = false;/* 判断是不是规格数量打开的*/
    $scope.BottomCartNum = '0';//购物车默认数量
    $scope.picAttr = '';//单个图片
    $scope.sgStoreAttribute = [];//所有组合,取焦集
    $scope.serviceProm = [];//服务承诺
    $scope.serId = '';//服务id
    $scope.serviceDetail = [];//服务详情介绍
    $scope.AttrswiperImgs = []; //当全部属性选完， 轮播图图片
    $scope.isAllAttr = false; //是否全选属性
    $scope.isAllAttrpic = false;//轮播默认隐藏
    $scope.isShowAttrLeftArrow = false;//轮播返回按钮默认隐藏
    //tableBar选中选品
    $scope.tabNav = 'selection';
    $scope.isBuyer = LoginService.getRole(); //判断是否为买家
    $scope.shareStoreId = $stateParams.shareStoreId; //分享店铺Id
    $scope.O2OStoreName = ''; //O2O店铺名称
    $scope.o2oCode = '';
    $scope.isFromBanner = false;
    var bv = $ionicHistory.viewHistory().backView;
    $scope.userId = UserService.getUser().mid; //用户Id
    /*********************分享标签－whiteBird start*********************/
    $scope.showShare = false;
    /*********************分享标签－whiteBird end*********************/
    $scope.moreShow = false; //右上角更多菜单隐藏
    $scope.isShowBigPic = false; //是否展示 轮播图 大图
    $scope.activeSlide = 0; //大图 轮播图 当前视图的下标
    $scope.nowActiveSlide = 0; //小图 轮播图 当前视图的下标
    $scope.isShowLeftArrow = false; //是否显示大图轮播图的返回按钮
    $scope.isShowService = false; //是否显示服务规则
    $scope.canGetVcode = true;
    $scope.VCodeTips = '获取验证码';
    $scope.VCodeStyle = {
      "color": "#2979FF"
    };
    $scope.Mp41 = ''; //xyz添加
    $scope.Png41 = ''; //xyz添加
    $scope.flagMp4 = false; //xyz添加
    $scope.a = 1; //xyz添加
    $scope.b = 1; //xyz添加
    $scope.isPackage = false; //是否为套装商品
    /*********************立即预订弹窗－start*********************/
    $scope.message = '';
    /*********************立即预订弹窗－end*********************/
    // 倒计时xyz
    $scope.endT = '';
    $scope.endTt = '';
    $scope.endTh = '';
    $scope.endTm = '';
    $scope.endTs = '';
    $scope.startT = '';
    $scope.startTt = '';
    $scope.startTh = '';
    $scope.startTm = '';
    $scope.startTs = '';
    var timer1;
    var timer2;
    //判断是否为微信浏览器
    var userLookAgent;
    var isWeChat;
    //复制按钮 显示与否
    $scope.isShowCopyButton = false;
    $scope.couponList = []; //店铺优惠券列表
    //$scope.storeServiceList = []; //店铺服务信息列表
    $scope.giftInfo = ''; //赠品礼品
    $scope.stockNumber = null; //库存数量
    $scope.o2oStoreId = null;
    $scope.whiteShowsState = 1; //白条状态
    $scope.whiteShowsCount = 0; //白条额度
    $scope.costInfo = []; //白条展示分析信息数据
    $scope.isWhiteShows = false; // 白条分期活动展示
    $scope.whiteShowsMsg = '查看更多';//白条活动展示信息
    $scope.whiteShowsTit = '顺逛白条';

    $scope.stockType = '';	//String	是	库存类型 yl
    $scope.flagMP4IconStyle = { // 去掉iphone播放按钮默认图标 yl
      display: 'inline-block'
    };
    $scope.orderInitParams = null; // 订单填写页面所需参数 yl
    $scope.iosContentCss = {
      "top" : "64px"
    };
    $scope.otherContentCss = {
      "top" : "44px"
    };

    // 硬装选择门店
    $scope.hardLoading = function () {
      $scope.StoreMsgModal.show();

      console.log($scope.o2oCode+'------------')
      console.log($scope.productModel.cityId+'------------')
      ProductDetailService.getHomeDecorationStoreMsg($scope.o2oCode,$scope.productModel.cityId)
        .success(function (res) {
          console.log(res+'------------')
          if(res.success && res.data){
            $scope.homeDecorationData = res.data; //数组
          }else{
            $scope.homeDecorationData= [];
            // PopupService.showToast(res.message);
          }

        }).error(function () {
        $scope.homeDecorationData= [];
      })
    };

    $scope.hasProgarmClick = function () {
      $state.go('houseSoluteDetail', {
        solutionId: $scope.productId
      });
    }


    $scope.showWhiteShows = function () {
      if (!UserService.getUser().accessToken) {
        PopupService.showToast('您的当前帐号暂时无法访问此服务,请使用关联手机号登录');
        return;
      }
      var price = null;
      if ($scope.productModel.isActivityProduct) {
        price = $scope.finalPrice;
      } else {
        price = $scope.actualPrice;
      }
      // 获取白条分期的信息
      WhiteShowsService.cost({
        token: UserService.getUser().accessToken,
        payAmt: price,
        proGroup: $scope.productModel.product.department,
        sku: $scope.productModel.product.sku
      }).success(function (response) {
        console.log(response); if (response.success) {
          $scope.whiteShowsMsg = response.data.feeInfo;
          $scope.whiteShowsTit = response.data.feeInfo;
          $scope.whiteShowsState = response.data.applyStatus;
          $scope.costInfo = response.data.costInfo;
          if ($scope.whiteShowsState == 1) {
            $scope.whiteShowsCount = response.data.crdComAvailAmt
          };
          $scope.isWhiteShows = true;
        }
        // else {
        // PopupService.showToast(response.message);
        // }
        if (response.errorCode == 100) {
          $state.go('login');
        };
      });
    }
    $scope.hideWhiteShows = function () {
      $scope.isWhiteShows = false;
    }
    $scope.clickWhiteShows = function () {

      // 获取白条分期的信息
      if ($scope.whiteShowsState == 2 || $scope.whiteShowsState == 3) {
        $state.go('applyForWhite')
      } else if ($scope.whiteShowsState == 0) {
        // var url = 'http://www.baidu.com';
        // WhiteShowsService.openApplyWhiteShows(url,window.location.href);
        WhiteShowsService.applyForOpen({
          backUrl: window.location.href,
          userId: UserService.getUser().ucId,
          token: UserService.getUser().accessToken
        }).success(function (res) {
          if (res.success) {
            WhiteShowsService.openApplyWhiteShows(res.data.redirectUrl, window.location.href);
          }
          if (res.errorCode == 100) {
            $state.go('login');
          };
        })
      }

    }
    //设置已选择的层级里 按钮的可点击情况
    function setButtonActive1() {
      for (var outIndex = 0; outIndex < $scope.choosedActiveObj.length; outIndex++) {//已点击的每一级
        var compareSttrIdsArr = [];//用来和接口返回的所有可以使用的组合比较的 属性id数组
        for (var k = 0; k < $scope.choosedActiveObj.length; k++) {
          if (outIndex != k) {
            for (var q = 0; q < $scope.choosedActiveObj[k].length; q++) {//已选择的当前循环到的级别里的id
              if ($scope.choosedActiveObj[k][q].active == 1) {//把选中的push进数组
                compareSttrIdsArr.push($scope.choosedActiveObj[k][q].sgAttribute.id);
              }
            }
          }
        }
        var setButtonActiveArr = [];//可以被点击的按钮id数组（未去重）
        for (var i = 0; i < $scope.sgStoreAttribute.length; i++) {//后台返的每一个组合
          var tempAttrArr1 = $scope.sgStoreAttribute[i].attrValueIds.split(',');
          var equalNum = 0;
          for (var x = 0; x < tempAttrArr1.length; x++) {//后台返的组合里的每一个id
            for (var y = 0; y < compareSttrIdsArr.length; y++) {//已选择的每一个id
              if (compareSttrIdsArr[y] == tempAttrArr1[x]) {
                equalNum++;
              }
            }
          }
          if (equalNum == compareSttrIdsArr.length) {
            setButtonActiveArr = setButtonActiveArr.concat(tempAttrArr1);
          }
        }
        //数组去重
        var noRepeatArr = [];
        for (var z = 0; z < setButtonActiveArr.length; z++) {
          var noRepeatFlag = true;
          if (noRepeatArr.length == 0) {
            noRepeatArr.push(setButtonActiveArr[z]);
          } else {
            for (var t = 0; t < noRepeatArr.length; t++) {
              if (noRepeatArr[t] == setButtonActiveArr[z]) {
                noRepeatFlag = false;
              }
            }
            if (noRepeatFlag) {
              noRepeatArr.push(setButtonActiveArr[z]);
            }
          }
        }
        //设置可以点击的按钮样式
        for (name in $scope.StoreAttribute) {
          for (var i = 0; i < $scope.StoreAttribute[name].length; i++) {
            var obj = $scope.StoreAttribute[name];
            if (obj[0].attrName == $scope.choosedActiveObj[outIndex][0].attrName) { //判断是否是这次循环到的 这一级属性
              if (obj[i].active != 1) {
                var beGrayFlag = true;
                for (var o = 0; o < noRepeatArr.length; o++) {
                  if (obj[i].sgAttribute.id == noRepeatArr[o]) {
                    beGrayFlag = false;//不需要置灰
                    break;
                  }
                }
                if (beGrayFlag) {
                  obj[i].active = 2;//如果按钮不在noRepeatArr数组里 则设置为不可点击 active=2
                } else {
                  obj[i].active = 0;//如果按钮在noRepeatArr数组里 则设置为可点击 active=0
                }
              };
            }
          };
        };
      }
    }
    //设置未选择的层级里 按钮的可点击情况
    function setButtonActive2() {
      var setButtonActiveArr = [];//可以被点击的按钮数组（未去重）
      for (var i = 0; i < $scope.sgStoreAttribute.length; i++) {//后台返的每一个组合
        var tempAttrArr1 = $scope.sgStoreAttribute[i].attrValueIds.split(',');
        var equalNum = 0;
        for (var x = 0; x < tempAttrArr1.length; x++) {//后台返的组合里的每一个id
          for (var y = 0; y < $scope.attrValueIds.length; y++) {//已选择的每一个id
            if ($scope.attrValueIds[y] == tempAttrArr1[x]) {
              equalNum++;
            }
          }
        }
        if (equalNum == $scope.attrValueIds.length) {
          setButtonActiveArr = setButtonActiveArr.concat(tempAttrArr1);
        }
      }
      //数组去重
      var noRepeatArr = [];
      for (var z = 0; z < setButtonActiveArr.length; z++) {
        var noRepeatFlag = true;
        if (noRepeatArr.length == 0) {
          noRepeatArr.push(setButtonActiveArr[z]);
        } else {
          for (var t = 0; t < noRepeatArr.length; t++) {
            if (noRepeatArr[t] == setButtonActiveArr[z]) {
              noRepeatFlag = false;
            }
          }
          if (noRepeatFlag) {
            noRepeatArr.push(setButtonActiveArr[z]);
          }
        }
      }
      console.log(noRepeatArr);
      //设置可以点击的按钮样式
      for (name in $scope.StoreAttribute) {
        for (var i = 0; i < $scope.StoreAttribute[name].length; i++) {
          var obj = $scope.StoreAttribute[name];
          var isEqualNoActiveObj = false;
          for (var k = 0; k < $scope.NoActiveObj.length; k++) {
            if (obj[i].attrName == $scope.NoActiveObj[k][0].attrName) {
              isEqualNoActiveObj = true;
            }
          }
          if (isEqualNoActiveObj) {//如果是未选择的属性级别里的属性id
            var beGrayFlag = true;
            for (var o = 0; o < noRepeatArr.length; o++) {
              if (obj[i].sgAttribute.id == noRepeatArr[o]) {
                beGrayFlag = false;//不需要置灰
                break;
              }
            }
            if (beGrayFlag) {
              obj[i].active = 2;//如果按钮不在noRepeatArr数组里 则设置为不可点击 active=2
            } else {
              obj[i].active = 0;//如果按钮在noRepeatArr数组里 则设置为可点击 active=0
            }
          }
        };
      };
    }
    //获取选中层级对象数组和 未选中的层级对象数组
    function getChoosedAndNoChoosedAttr() {
      for (name in $scope.StoreAttribute) {
        var levelChoosed = false;
        for (var i = 0; i < $scope.StoreAttribute[name].length; i++) {
          var obj = $scope.StoreAttribute[name];
          if (obj[i].active == 1) {
            levelChoosed = true;
            $scope.StoreAttributeActiveList.push(obj[i].sgAttribute.attrValueName);
            $scope.attrValueIds.push(obj[i].sgAttribute.id);//已选中的 商品子属性ids,用逗号分隔
            // 已选的属性去重 yl
            if($scope.attrValueNames.join().indexOf(obj[i].sgAttribute.attrValueName)<= -1){ //数组去重
              $scope.attrValueNames.push(obj[i].sgAttribute.attrValueName);//已选中的 商品子属性名称,用逗号分隔
            }
          };
        };
        if (levelChoosed) {
          $scope.choosedActiveObj.push($scope.StoreAttribute[name]);//选中的对象数组
        }
      };
      //获取没有被选中的一级对象
      var temps = true;
      for (name in $scope.StoreAttribute) {
        for (var i = 0; i < $scope.StoreAttribute[name].length; i++) {
          var obj = $scope.StoreAttribute[name];
          if (obj[i].active == 1) {
            temps = false;
            break;
          } else {
            temps = true;
          };
        };
        if (temps) {
          $scope.NoActiveObj.push($scope.StoreAttribute[name]);
        }
      };
    }
    //选择规格数量
    $scope.OpenAndClose = 'modal-Spec-Closes';//弹出层显示隐藏'modal-Spec-Closes关闭 modal-Spec-opens显示';

    //选择规格数量-点击选中属性
    $scope.SpecNumberActive = function (items, item) {
      $scope.StoreAttributeActiveList = []; //将已选的置空
      $scope.attrValueIds = [];//已选中的 商品子属性ids,用逗号分隔
      $scope.attrValueNames = [];//已选中的 商品子属性名称,用逗号分隔
      $scope.NoActiveObj = [];//没选中的对象数组
      $scope.choosedActiveObj = [];//选中的对象数组
      var arr = [], arr1 = [];//获取 选中的attrValueCode
      //active  0：没选中   1:选中  2:禁止选择
      if (items.active == 0) {
        //当前点击没选中
        for (var i = 0; i < item.length; i++) {
          if (item[i].active == 1) {
            item[i].active = 0;
          }
        };
        items.active = 1;//选中
      }
      else if (items.active == 1) {
        //当前点击已选中
        for (var i = 0; i < item.length; i++) {
          if (item[i].active == 1) {
            item[i].active = 0;
          }
        };
        items.active = 0;//选中
      }
      else if (items.active == 2) {
        return;
      }
      //获取选中层级对象数组和 未选中的层级对象数组
      getChoosedAndNoChoosedAttr();
      //设置已选择的层级里 按钮的可点击情况
      setButtonActive1();
      //设置未选择的层级里 按钮的可点击情况
      setButtonActive2();
      //获取选中层级对象数组和 未选中的层级对象数组
      if ($scope.attrValueIds.length > 0) {
        //判断是否全部选中属性
        if (getJsonLength($scope.StoreAttribute) == $scope.attrValueIds.length) {
          //全选
          console.log('全选');

          //全选 设置 价格 库存 skku 图片
          for (var i = 0; i < $scope.sgStoreAttribute.length; i++) {
            // 判断两个数组的内容是否相等 yl
            var choseArrayFlagNum = 0;
            for(var j = 0; j <$scope.attrValueIds.length; j++){
              if($scope.sgStoreAttribute[i].attrValueIds.indexOf($scope.attrValueIds[j]) >-1){
                choseArrayFlagNum++;
              }
            }
            if (choseArrayFlagNum == $scope.attrValueIds.length) {
              console.log($scope.sgStoreAttribute[i]);
              $scope.StoreAttributePrice = $scope.sgStoreAttribute[i].price; //规格数量-价格
              $scope.StoreAttributNumber = '库存' + $scope.sgStoreAttribute[i].num; //规格数量-库存
              $scope.skku = $scope.sgStoreAttribute[i].skku; //当没全选设置为空
              $scope.picAttr = $scope.sgStoreAttribute[i].pic; //图片
              $scope.stockNumber = $scope.sgStoreAttribute[i].num; //  属性切换后 重置库存状态 yl
            }
          }
        } else {
          console.log('没全选');
          //没有全选至少选一个 获取外面的数据
          $scope.StoreAttributePrice = $scope.actualPrice; //规格数量-价格
          $scope.StoreAttributNumber = $scope.hasStock ? '有货' : '无货'; //规格数量-库存
          $scope.skku = null; //当没全选设置为空
          $scope.picAttr = $scope.productModel.swiperImgs ? $scope.productModel.swiperImgs[0] : '';//图片  yl  错误处理
        }
        //console.log(arrNoRepeat);
        console.log($scope.StoreAttribute);
      } else {

        //没有全选获取外面的数据
        $scope.StoreAttributePrice = $scope.actualPrice; //规格数量-价格
        $scope.StoreAttributNumber = $scope.hasStock ? '有货' : '无货'; //规格数量-库存
        $scope.skku = null; //当没全选设置为空
        $scope.picAttr = $scope.productModel.swiperImgs ? $scope.productModel.swiperImgs[0] : '';//图片  yl  错误处理
      }

      //设置是否全部选中属性
      if ($scope.NoActiveObj.length == 0) {
        $scope.isAllAttr = true;
      } else {
        $scope.isAllAttr = false;
      }
      //获取json的length
      function getJsonLength(jsonData) {
        var length = 0;
        for (var ever in jsonData) {
          length++;
        }
        return length;
      }

    };
    //打开规格数量弹层
    $scope.openSpecNumber = function (type) {
      /*【1：规格数量 2：添加购物车 3：立即购买 4：立即抢购 5：马上预定 6：货到通知 7:开抢通知 8:立即预约 9:马上抢购】*/

      //判断是否显示 规格数量
      if ($scope.IsShowAttribute && $scope.NoActiveObj.length == 0 && $scope.StoreAttributeActiveList.length != 0 && $scope.skku != null && type > 1) {
        if (type == 2) {
          //加入购物车-打开
          $scope.openSpecNumberType = 2;
          $scope.addToCart();
        }
        else if (type == 3) {
          //立即购买-打开
          $scope.openSpecNumberType = 3;
          $scope.buyNow();
        } else if (type == 4) {
          //立即抢购-打开
          $scope.openSpecNumberType = 4;
          $scope.buyNow();
        } else if (type == 5) {
          //马上预定 -打开
          $scope.openSpecNumberType = 5;
          $scope.buyNow(1);
        } else if (type == 6) {
          //货到通知-打开
          $scope.openSpecNumberType = 6;
          $scope.toNotice();
        } else if (type == 7) {
          //开抢通知-打开
          $scope.openSpecNumberType = 7;
          $scope.startNotice();
        } else if (type == 8) {
          //立即预约-打开
          $scope.openSpecNumberType = 8;
          $scope.nowOrder();
        } else if (type == 9) {
          //马上抢购-打开
          $scope.openSpecNumberType = 9;
          $scope.buyNow();
        }

      } else if ($scope.IsShowAttribute) {

        //如果是规格数量打开的底部不显示确定，否则显示确定
        if (type == 1) {
          $scope.isOpenBottom = true;/* 判断是不是规格数量打开的*/
        } else {
          $scope.isOpenBottom = false;/* 判断是不是规格数量打开的*/
        };

        if (type == 1) {
          //规格数量-打开
          $scope.openSpecNumberType = 1;
        } else if (type == 2) {
          //添加购物车-打开
          $scope.openSpecNumberType = 2;
        } else if (type == 3) {
          //立即购买-打开
          $scope.openSpecNumberType = 3;
        } else if (type == 4) {
          //立即抢购-打开
          $scope.openSpecNumberType = 4;
        } else if (type == 5) {
          //马上预定 -打开
          $scope.openSpecNumberType = 5;
        } else if (type == 6) {
          //货到通知-打开
          $scope.openSpecNumberType = 6;
        } else if (type == 7) {
          //开抢通知-打开
          $scope.openSpecNumberType = 7;
        } else if (type == 8) {
          //立即预约-打开
          $scope.openSpecNumberType = 8;
        } else if (type == 9) {
          //马上抢购-打开
          $scope.openSpecNumberType = 9;
        }


        //防止多次点击请求
        if ($scope.StoreAttribute == null) {
          ProductDetailService.getSgStoreAttribute($scope.productId, $scope.o2oStoreId, $scope.productModel.product.sku).success(function (res) {
            if (res.success) {
              var data = res.data.sgAttribute;
              var tempSgStoreAttribute = res.data.sgStoreAttribute; //所有组合，取焦集

              //存储所有组合的图片
              for (var i = 0; i < tempSgStoreAttribute.length; i++) {
                $scope.AttrswiperImgs.push(tempSgStoreAttribute[i].pic);
              }
              //格式化数据
              for (name in data) {
                sgAttributeNum++;
                for (var i = 0; i < data[name].length; i++) {
                  var obj = data[name];
                  obj[i].active = 0;
                }
              }
              if (sgAttributeNum == 1) {
                for (key in data) {
                  for (var i = 0; i < data[key].length; i++) {
                    var tempObj = data[key];
                    for (var j = 0; j < tempSgStoreAttribute.length; j++) {
                      if (tempObj[i].sgAttribute.id == tempSgStoreAttribute[j].attrValueIds && tempSgStoreAttribute[j].num == 0) {
                        console.log('库存为0的置灰');
                        tempObj[i].active = 2;
                      }
                    }
                  };
                };
              }
              $scope.StoreAttribute = data;
              //删除库存为0的组合
              for (var i = 0; i < tempSgStoreAttribute.length; i++) {
                if (tempSgStoreAttribute[i].num > 0) {
                  $scope.sgStoreAttribute.push(tempSgStoreAttribute[i])
                }
              }
              console.log('删除库存为0后的所有组合');
              console.log($scope.sgStoreAttribute);
              //获取选中层级对象数组和 未选中的层级对象数组
              getChoosedAndNoChoosedAttr();
              //设置未选择的层级里 按钮的可点击情况
              setButtonActive2();
            }
          })
        };
        $scope.OpenAndClose = 'modal-Spec-opens';
        //获取选中层级对象数组和 未选中的层级对象数组
        getChoosedAndNoChoosedAttr();
        //设置未选择的层级里 按钮的可点击情况
        setButtonActive2();
      } else {
        //不显示规格数量
        if (type == 2) {
          //2：添加购物车（必须把全部属性选完才能添加购物车）
          $scope.addToCart();

        } else if (type == 3) {
          //3：立即购买
          $scope.buyNow();

        } else if (type == 4) {
          //4：立即抢购
          $scope.buyNow();

        } else if (type == 5) {
          //5：马上预定
          $scope.buyNow(1);

        } else if (type == 6) {
          //6：货到通知
          $scope.toNotice();

        } else if (type == 7) {
          //7:开抢通知
          $scope.startNotice();

        } else if (type == 8) {
          //8:立即预约
          $scope.nowOrder();

        } else if (type == 9) {
          //9:马上抢购
          $scope.buyNow();
        }
      }
    };


    //规格数量弹层确定
    $scope.closeConfirmModel = function () {
      if ($scope.openSpecNumberType != 1) {
        if ($scope.skku != null && $scope.NoActiveObj.length == 0 && $scope.StoreAttributeActiveList.length != 0) {

        } else {
          var str = '';
          for (var i = 0; i < $scope.NoActiveObj.length; i++) {
            if(str.indexOf($scope.NoActiveObj[i][0].attrName) <= -1){
              str += '&nbsp;&nbsp;' + $scope.NoActiveObj[i][0].attrName;
            }
          }
          if(str){
            PopupService.showToast('请选择' + str);
            return;
          }
        }
      };

      if ($scope.openSpecNumberType == 2) {
        //2：添加购物车（必须把全部属性选完才能添加购物车）
        $scope.addToCart();

      } else if ($scope.openSpecNumberType == 3) {
        //3：立即购买
        $scope.buyNow();

      } else if ($scope.openSpecNumberType == 4) {
        //4：立即抢购
        $scope.buyNow();

      } else if ($scope.openSpecNumberType == 5) {
        //5：马上预定
        $scope.buyNow(1);

      } else if ($scope.openSpecNumberType == 6) {
        //6：货到通知
        $scope.toNotice();

      } else if ($scope.openSpecNumberType == 7) {
        //7:开抢通知
        $scope.startNotice();

      } else if ($scope.openSpecNumberType == 8) {
        //8:立即预约
        $scope.nowOrder();

      } else if ($scope.openSpecNumberType == 9) {
        //9:马上抢购
        $scope.buyNow();

      }
      //关闭弹层
      $scope.closeSpecNumber();

    };

    //关闭规格数量弹层
    $scope.closeSpecNumber = function () {
      $scope.OpenAndClose = 'modal-Spec-Closes';
    };

    //购物车数量 type = 0初始化获取购物车数量 ； type = 1添加购物车后获取数量
    $scope.getCartNumFn = function (type) {
      ProductDetailService.getCartNum().success(function (res) {
        if (res.success) {
          $scope.BottomCartNum = res.data;
          if (type == 1) {
            $timeout(function () {
              PopupService.showToast('加入购物车成功');
            }, 200);
          }
        };
      });
    }
    //地址选择框高度
    var screenHeight = window.innerHeight;
    var topHeight = 250 + 123;
    var topDis = 87;
    var contentHeight = screenHeight - topHeight + 'px';
    var topDisHeight = topDis + 'px';
    $scope.storeContentHeight = {
      'height': 'auto'
    }
    $scope.contentHeight = {
      'height': contentHeight
      //      'top':topDisHeight
    }

    var storeTop = screenHeight -topHeight +52 +'px' ;
    $scope.storeMsgTop = {
      'top': storeTop
    };
    /** 地址变量声明 **/
    $scope.addressTitle = '配送至';
    $scope.dataAdd = null;
    $scope.flag = 'PRODUCT_DETAIL_LOCATION';
    $scope.defaultValue = null;
    $scope.level = 0;
    var addressMessage = {}; //自动定位地址信息
    var areaValue;
    var areaValueCity;
    /** 方法 **/
    // 排列div
    $scope.divStrl = [];
    $scope.divStrm = [];
    $scope.divStrt = [];

    function conJsl() {
      for (var i = 0; i < 8; i++) {
        $scope.divStrl[i] = 12 * i + 1;
      }
    }

    function conJsm() {
      for (var i = 0; i < 8; i++) {
        $scope.divStrm[i] = 12 * i + 1;
      }
    }

    function conJst() {
      for (var i = 0; i < 2; i++) {
        $scope.divStrt[i] = 90 * i - 8;
      }
    }

    function GetQueryString(name){
      var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if(r!=null)return  unescape(r[2]); return '';
    }
    function loginOK(){
      var a=$location.absUrl();
      // alert(a);
      secritIdIndex = a.indexOf('secritId');
      tokenIndex = a.indexOf('&token');
      _urlToken = decodeURI(a.substring(secritIdIndex+9,tokenIndex));
      // var tokens = GetQueryString('secritId');
      // var _urlToken = decodeURI(tokens);// 截取secritId,用于获取用户信息
      if (_urlToken != "") {//如果传递的token 不等于空
        $http({
          method: 'POST',
          url: UrlService.getUrl('OTHER_LOGIN'),
          params: {token: _urlToken},
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (response) {
          UserService.setUser(response.data); //存储用户登录后的信息到本地缓存
          $localstorage.set('sg_login_token_secret', 'Bearer' + response.data.sessionValue);//替换token存到本地
        });
      }
    }

    //页面初始化
    $scope.init = function () {
      loginOK();
      /*********************分享标签－whiteBird start*********************/
      $scope.showQQ = false;
      $scope.showWeChat = false;
      $scope.isShowCopyButton = false;
      $scope.positiveRate = 0;
      $scope.totalNum = 0;
      /*********************分享标签－whiteBird end*********************/
      $scope.skku = null;
      //获取用户信息
      $scope.user = UserService.getUser();
      //商品未载入标志
      $scope.iscompleteLoad = false;
      //接收前页传入商品Id,以请求商品详细信息
      $scope.productId = $stateParams.productId;
      //
      //商品评论信息
      getValuate()

      if (window.cordova) {//APP
        if ($localstorage.get('storeId', $rootScope.globalConstant.storeId) == $stateParams.storeId) {
          $scope.storeId = $stateParams.storeId;

        } else {
          $scope.storeId = $localstorage.get('storeId', $rootScope.globalConstant.storeId);

        }
      } else {//H5
        if ($stateParams.shareStoreId) {
          $rootScope.shareId = $stateParams.shareStoreId;
          $scope.storeId = $rootScope.shareId;
        } else {
          $scope.storeId = $rootScope.shareId ? $rootScope.shareId : $stateParams.storeId;
        }
      }
      $scope.o2oType = $stateParams.o2oType;
      //$scope.fromUrl = $stateParams.fromUrl;
      $scope.fromType = $stateParams.fromType;
      if ($scope.noFresh == false) {
        ProductDetailService.hasProgram($scope.productId).success(function (response) {
          console.log(response);
          if (response.success) {
            $scope.hasProgram = response.data;
          } else {
            PopupService.showToast(response.message);
          }
        });
        //如需要刷新,载入数据
        ProductDetailService.loadData($scope.productId, $scope.storeId, $scope.o2oType, $scope.fromUrl, $scope.fromType)
          .success(function (response, status, headers, config) {
            $scope.iscompleteLoad = true;
            $scope.productModel = response.data;
            console.log(response);
            $scope.picAttr = $scope.productModel.swiperImgs ? $scope.productModel.swiperImgs[0] : '';//图片  yl  错误处理
            $rootScope.addressDefaultMsg = {
              'provinceId': $scope.productModel.provinceId,
              'cityId': $scope.productModel.cityId,
              'regionId': $scope.productModel.regionId,
              'streetId': $scope.productModel.streetId,
              'provinceName': $scope.productModel.provinceName,
              'cityName': $scope.productModel.cityName,
              'pcrName': $scope.productModel.pcrName,
            };
            $rootScope.addressDefMsg = JSON.stringify($rootScope.addressDefaultMsg);
            if (window.cordova) {
              $rootScope.gio.track('ProdView', {
                productId: $scope.productId,
                productFirstName: '',
                productSecondName: '',
                o2oType: $scope.o2oType,
                storeId: $scope.storeId
              });
            }
            $timeout(function(){
              $('.detailEditor .editor').removeAttr('contenteditable');
              
              $('.detailEditor .editor').addClass('copy');
              $('.detailEditor .editor div').removeAttr('contenteditable');
              
              $('.detailEditor .editor div').addClass('copy');
              
            },30);
            //准备放到剪贴板的文字信息
            $scope.copyText = $scope.productModel.product.productFullName + $scope.productModel.product.productTitle + UrlService.getShareLinkHeader() + 'productDetail/' + $scope.productId + '/' + $scope.o2oType +
              '/' + $scope.fromType + '/' + $scope.productModel.storeId + '/' + $scope.productModel.storeId + '?fs';
            //xyz添加
            if (response.data.mp4FileId1) {
              var aa = JSON.parse(response.data.mp4FileId1);
              $scope.flagMp4 = true;
              $scope.Mp41 = $sce.trustAsResourceUrl(aa.video);
              $scope.Png41 = aa.img;
              $scope.a = 1;
              $scope.b = 1;
            } else {
              $scope.a = 0;
              $scope.b = 1;
              $scope.flagMp4 = false;
            }
            //查询O2O店铺名称
            /* ProductDetailService.getO2OName($scope.productModel.product.sku, $scope.productModel.provinceId, $scope.productModel.cityId, $scope.productModel.regionId, $scope.productModel.streetId)
              .success(function (response) {
                if ($.isEmptyObject(response.data)) {
                  $scope.showO2OMsg = false;
                } else {
                  $scope.showO2OMsg = true;
                  $scope.O2OStoreName = response.data.O2OStoreName;
                  $scope.avatarImageFileId = response.data.avatarImageFileId;
                  $scope.o2oStoreId = response.data.o2oStoreId;
                  $scope.O2Omobile = response.data.mobile;
                  $scope.O2OStoreCode = response.data.storeCode;
                  if ($scope.O2Omobile) {
                    $scope.showPhoneCall = true;
                  } else {
                    $scope.showPhoneCall = false;
                  }
                  $scope.serviceGrade = response.data.serviceGrade;
                  $scope.productGrade = response.data.productGrade;
                  $scope.logisticalGrade = response.data.logisticalGrade;
                }
                //查看是否有能领取优惠券
                ProductDetailService.getProductCouponsHas($scope.productModel.product.sku, $scope.productModel.product.productId, 1, $scope.actualPrice, $scope.productModel.storeId,$scope.o2oStoreId)
                  .success(function (response) {
                    if (response.success) {
                      $scope.couponListNew = response.data.couponList;
                    } else {
                      console.log(response.data.message);
                    }
                  });

                //判断规格数量是否展示
                if($scope.o2oStoreId == null || $scope.o2oStoreId == 'null'){
                  var  o2oStoreIds = '';
                }else{
                  var  o2oStoreIds = $scope.o2oStoreId;
                }
                ProductDetailService.getIsShowAttr($scope.productId,o2oStoreIds).success(function(res){
                  console.log('是否显示规格数量');
                  console.log(res);
                  if(res.result){
                    $scope.IsShowAttribute = true;
                  }else{
                    $scope.IsShowAttribute = false;
                  };
                });
              });*/

            // xyz添加倒计时
            function Format(a) {
              if (a < 10) {
                a = '0' + a;
              } else {
                a = a;
              }
              return a;
            };

            //距离结束的时间
            $scope.endT = $scope.productModel.activityEndTime - $scope.productModel.activityNowTime;

            timer1 = $interval(function () {
              $scope.endTt = Math.floor($scope.endT / 86400);

              $scope.endTh = Format(Math.floor(($scope.endT - $scope.endTt * 86400) / 3600));

              $scope.endTm = Format(Math.floor(($scope.endT - $scope.endTt * 86400 - $scope.endTh * 3600) / 60));

              $scope.endTs = Format($scope.endT - $scope.endTt * 86400 - $scope.endTh * 3600 - $scope.endTm * 60);
              $scope.endT--;
              if ($scope.endT == -1) {
                $state.reload();
                $interval.cancel(timer1);
                $interval.cancel(timer2);
              }
            }, 1000);


            //距离开始的时间
            $scope.startT = $scope.productModel.activityStartTime - $scope.productModel.activityNowTime;
            // alert($scope.startT);

            timer2 = $interval(function () {
              $scope.startTt = Math.floor($scope.startT / 86400);

              $scope.startTh = Format(Math.floor(($scope.startT - $scope.startTt * 86400) / 3600));

              $scope.startTm = Format(Math.floor(($scope.startT - $scope.startTt * 86400 - $scope.startTh * 3600) / 60));

              $scope.startTs = Format($scope.startT - $scope.startTt * 86400 - $scope.startTh * 3600 - $scope.startTm * 60);

              $scope.startT--;
              if ($scope.startT == -1) {
                $state.reload();
                $interval.cancel(timer2);
                $interval.cancel(timer1);
              }
            }, 1000);


            $scope.productCount = 1;
            if (!$scope.productModel.subProductImagesList) {
              $scope.productModel.subProductImagesList = [];
            }
            $scope.actualPrice = $scope.productModel.actualPrice;
            $scope.StoreAttributePrice = $scope.actualPrice; //规格数量-价格

            //判断finalPrice是多少
            if ($scope.productModel.isActivityProduct) {
              $scope.finalPrice = $scope.productModel.finalPrice;
            } else {
              if ($scope.productModel.finalPrice - $scope.productModel.actualPrice > 0) {
                $scope.finMoreAct = true;
              }
              $scope.finalPrice = $scope.productModel.finalPrice;
            }
            console.log($scope.productModel.product.onSale)
            if ($scope.productModel.product.onSale == 1) { // 上架时才调查询库存的接口 yl
              //数据载入成功,查看此地址是否有货
              ProductDetailService.locationChange($scope.productModel.product.sku, $scope.productModel.product.productId, $scope.productModel.regionId, 1, $scope.productModel.provinceId, $scope.productModel.cityId, $scope.productModel.pcrName, $scope.productModel.storeId, $scope.productModel.streetId)
                .success(function (response, status, headers, config) {
                  $scope.staticProm = response.data.l;
                  $scope.hasStock = response.data.hasStock;
                  $scope.isSupportCOD = response.data.isSupportCOD;
                  $scope.expectTime = response.data.expectTime;
                  $scope.commission = response.data.commission;
                  $scope.commissionRate = response.data.commissionRate;
                  $scope.finalPrice = response.data.finalPrice;
                  $scope.actualPrice = response.data.actualPrice;
                  $scope.StoreAttributePrice = $scope.actualPrice; //规格数量-价格
                  $scope.finMoreAct = ($scope.finalPrice - $scope.actualPrice > 0);
                  $scope.bigActivity = response.data.bigActivity;
                  //增加 超时免单和半日达
                  $scope.isB2C = response.data.isB2C;
                  $scope.freeOrder = response.data.freeOrder;
                  $scope.halfDay = response.data.halfDay;
                  $scope.oneDay = response.data.oneDay;
                    if($scope.productModel.product.productAttribute!=2){
                      $scope.serId = '';
                      $scope.serviceProm = Object.assign([],$scope.staticProm,[]); 
                      for(var i=0;i<$scope.serviceProm.length;i++){
                      $scope.serId += $scope.serviceProm[i].i+',';
                    } 
                      if($scope.isB2C || !$scope.isSupportCOD || $scope.productModel.isActivityProduct || !$scope.hasStock || $scope.productCount > 2){
                        
                        $scope.serviceProm.map(function(item,index){
                            if(item.n=='货到付款'){
                              $scope.serId = '';
                             $scope.serviceProm.splice(index,1);
                             for(var i=0;i<$scope.serviceProm.length;i++){
                                  $scope.serId += $scope.serviceProm[i].i+',';
                                } 
                            }
                        })
                      }
                    }else{
                      $scope.serviceProm = [];
                    }
                  $scope.isPackage = response.data.isPackage;
                  //优惠券、服务、赠品
                  $scope.couponList = response.data.sgStoreCouponVoList;
                  //$scope.storeServiceList = response.data.storeServiceInfo;
                  $scope.giftInfo = response.data.giftInfo;
                  //库存数量
                  $scope.stockNumber = response.data.stockNum;
                  $scope.StoreAttributNumber = $scope.hasStock ? '有货' : '无货'; //规格数量-库存
                  //增加限时抢购
                  /*是否限时抢购*/
                  $scope.isFlashsales = response.data.isFlashsales;
                  // $scope.flashsalesEndTime = response.data.flashsalesEndTime; yl
                  if(response.data.flashsalesEndTime){
                    $scope.flashsalesEndTime = new Date(response.data.flashsalesEndTime.replace(/-/g,'/')).getTime();
                  }else{
                    $scope.flashsalesEndTime = 0;
                  }
                  // 库存类型 yl
                  $scope.stockType = response.data.stockType;
                  if ($scope.flashsalesEndTime < new Date().getTime()) {
                    $scope.isFlashsales = false;
                  }
                  // 查询店铺信息 yl
                  if (!response.data.o2OStoreInfo || !response.data.o2OStoreInfo.o2OStoreName) {
                    $scope.showO2OMsg = false;
                  } else {
                    $scope.showO2OMsg = true;
                    $scope.O2OStoreName = response.data.o2OStoreInfo.o2OStoreName;
                    $scope.avatarImageFileId = response.data.o2OStoreInfo.avatarImageFileId;
                    $scope.o2oStoreId = response.data.o2OStoreInfo.o2oStoreId;
                    $scope.O2Omobile = response.data.o2OStoreInfo.mobile;
                    $scope.O2OStoreCode = response.data.o2OStoreInfo.storeCode;
                    $scope.o2oCode = response.data.o2OStoreInfo.storeCode;
                    if ($scope.O2Omobile) {
                      $scope.showPhoneCall = true;
                    } else {
                      $scope.showPhoneCall = false;
                    }
                    $scope.serviceGrade = response.data.o2OStoreInfo.serviceGrade;
                    $scope.productGrade = response.data.o2OStoreInfo.productGrade;
                    $scope.logisticalGrade = response.data.o2OStoreInfo.logisticalGrade;
                  }
                  if($scope.o2oStoreId){

                  }else{
                    $scope.o2oStoreId='';
                  }
                  //shequ
                  CirclePageService.getCircleLink($scope.productId,$scope.o2oStoreId,'2')
                  .success(function(res){
                    if(res.success){
                      $scope.topTeam=true;
                      $scope.teamUrl=res.data;
                    }

                  })
                  //查看是否有能领取优惠券
                  ProductDetailService.getProductCouponsHas($scope.productModel.product.sku, $scope.productModel.product.productId, 1, $scope.actualPrice, $scope.productModel.storeId, $scope.o2oStoreId)
                    .success(function (response) {
                      if (response.success) {
                        $scope.couponListNew = response.data.couponList;
                      } else {
                        console.log(response.data.message);
                      }
                    });

                  //判断规格数量是否展示
                  if ($scope.o2oStoreId == null || $scope.o2oStoreId == 'null') {
                    var o2oStoreIds = '';
                  } else {
                    var o2oStoreIds = $scope.o2oStoreId;
                  }
                  ProductDetailService.getIsShowAttr($scope.productId, o2oStoreIds).success(function (res) {
                    console.log('是否显示规格数量');
                    console.log(res);
                    if (res.result) {
                      $scope.IsShowAttribute = true;
                    } else {
                      $scope.IsShowAttribute = false;
                    };
                  });
                  //进入页面统计库存
                  if (window.cordova) {
                    $rootScope.gio.track('stockInfo', {
                      productId: $scope.productModel.product.productId,
                      productFirstName: '',
                      hasStock: $scope.hasStock,
                      ReceivingProvince: $scope.productModel.provinceName,
                      ReceivingCity: $scope.productModel.cityName,
                      ReceivingDistrict: $scope.productModel.regionName ? $scope.productModel.regionName.substring(0, $scope.productModel.regionName.indexOf('/')) : '',
                      ReceivingStreet: $scope.productModel.regionName ? $scope.productModel.regionName.substring($scope.productModel.regionName.indexOf('/') + 1) : ''
                    });
                  }
                  // 进入单品页也要统计库存 yl
                  if (typeof (gio) != "undefined") {
                    gio('track', 'getAddress', {
                      productId: $scope.productModel.product.productId,
                      productFirstName: '',
                      hasStock: $scope.hasStock ? '有货' : '无货',
                      ReceivingProvince: $scope.productModel.provinceName,
                      ReceivingCity: $scope.productModel.cityName,
                      ReceivingDistrict: $scope.productModel.regionName ? $scope.productModel.regionName.substring(0, $scope.productModel.regionName.indexOf('/')) : '',
                      ReceivingStreet: $scope.productModel.regionName ? $scope.productModel.regionName.substring($scope.productModel.regionName.indexOf('/') + 1) : ''
                    });
                    gio('track', 'ProdView', {
                       productId: $scope.productModel.product.productId,
                       productFirstName: '',
                       productSecondName: '',
                       o2oType: $scope.o2oType,
                       storeId: $scope.storeId
                    });
                  }
                  /*百分点添加商品信息*/
                  if (window.baifend) {
                    ProductDetailService.getProductCateName($scope.productModel.product.productCatePath).success(function (re) {
                      var params = {
                        uid: $scope.userId ? ($scope.userId + '') : '',
                        del: false,
                        name: $scope.productModel.product.productFullName,
                        seller_lnk: "/" + $scope.productId + "/" + $scope.o2oType + "/" + $scope.fromType + "/" + $scope.storeId + "/",
                        cmp: $scope.productModel.product.productActivityInfo ? $scope.productModel.product.productActivityInfo : '',
                        typ: 'shop',
                        img: $scope.productModel.product.defaultImageUrl,
                        memp: $scope.actualPrice,
                        ratecnt: $scope.totalNum,
                        cat: re.data,
                        brd: $scope.productModel.product.brandName,
                        stk: $scope.stockNumber + ''
                      };
                      window.baifend.onAddItem($scope.productModel.product.sku, params);
                    });
                  }
                  if ($scope.isFlashsales == true) {
                    $scope.state = true;
                    var nowdate1 = new Date();
                    var s9 = $scope.flashsalesEndTime,
                      s10 = nowdate1.getTime();
                    if (s9 < s10) {
                      $scope.state = false;
                    } else {
                      var timer3 = $interval(function () {
                        s10 = s10 + 1000;
                        var toendtime = parseInt((s9 - s10) / 1000);
                        var day = parseInt(toendtime / (24 * 60 * 60)); //计算整数天数
                        var afterDay = toendtime - day * 24 * 60 * 60; //取得算出天数后剩余的秒数
                        var hour = parseInt(afterDay / (60 * 60)); //计算整数小时数
                        var afterHour = toendtime - day * 24 * 60 * 60 - hour * 60 * 60; //取得算出小时数后剩余的秒数
                        var min = parseInt(afterHour / 60); //计算整数分
                        var afterMin = toendtime - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60; //取得算出分后剩余的秒数
                        $scope.showtime1 = day + '天' + flashService.PrefixInteger(hour) + ":" + flashService.PrefixInteger(min) + ":" + flashService.PrefixInteger(parseInt(afterMin));
                        if (toendtime <= -1) {
                          $scope.state = false;
                          $interval.cancel(timer3);
                          $state.reload();
                        }
                      }, 1000)
                    }
                  }
                  /*原价*/
                  $scope.originalPrice = response.data.originalPrice;
                  //增加预约抢购
                  /*是否预约抢购*/
                  $scope.isAcReserve = response.data.isAcReserve;
                  /*活动类型*/
                  $scope.acReserveType = response.data.acReserveType;
                  /*预约活动商品ID*/
                  $scope.acReserveId = response.data.acReserveId;
                  /*结束时间*/
                  // $scope.acReserveEndTime = response.data.acReserveEndTime; //yl
                  if(response.data.acReserveEndTime){
                    $scope.acReserveEndTime = new Date(response.data.acReserveEndTime.replace(/-/g,'/')).getTime();
                  }else{
                    $scope.acReserveEndTime = 0;
                  }
                  /*距离结束时间*/
                  $scope.state1 = true;
                  var nowdate = new Date();
                  var s7 = $scope.acReserveEndTime,
                    s8 = nowdate.getTime();
                  var timer = $interval(function () {
                    s8 = s8 + 1000;
                    var toendtime = parseInt((s7 - s8) / 1000);
                    var day = parseInt(toendtime / (24 * 60 * 60)); //计算整数天数
                    var afterDay = toendtime - day * 24 * 60 * 60; //取得算出天数后剩余的秒数
                    var hour = parseInt(afterDay / (60 * 60)); //计算整数小时数
                    var afterHour = toendtime - day * 24 * 60 * 60 - hour * 60 * 60; //取得算出小时数后剩余的秒数
                    var min = parseInt(afterHour / 60); //计算整数分
                    var afterMin = toendtime - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60; //取得算出分后剩余的秒数
                    $scope.showtime = day + '天' + flashService.PrefixInteger(hour) + ":" + flashService.PrefixInteger(min) + ":" + flashService.PrefixInteger(parseInt(afterMin));
                    if (toendtime == -1) {
                      myPopupCui.close();
                      $state.reload();
                      $interval.cancel(timer);
                      $scope.state1 = false;
                    }
                  }, 1000)

                  /*判断是预约还是抢购*/
                  if ($scope.isAcReserve == true) {
                    if ($scope.acReserveType == 1) {
                      $scope.repur = '预约';
                      /*预约人数*/
                      $scope.repurNum = response.data.acReserveNum;
                    }
                    if ($scope.acReserveType == 2) {
                      $scope.repur = '抢购';
                      /*抢购人数*/
                      $scope.repurNum = response.data.acPurchaseNum;
                    }
                  }
                });
            } else { // 下架 yl

            }
            $ionicSlideBoxDelegate.update();
          }).error(function (response, status, headers, config) {
            PopupService.showToast(response.message);
          });
      } else {

      }
    };
    //点击减少商品数量按钮触发事件
    $scope.nus = function () {
      if ($scope.productCount < 2) {
        $scope.productCount = 1;
      } else {
        // if($scope.IsShowAttribute){ // 有子商品  才调取查询库存接口 yl
        //   ProductDetailService.locationChange($scope.productModel.product.sku, $scope.productModel.product.productId, $scope.productModel.regionId, $scope.productCount, $scope.productModel.provinceId, $scope.productModel.cityId, $scope.productModel.pcrName, $scope.productModel.storeId, $scope.productModel.streetId)
        //   .success(function (response, status, headers, config) {
        //     $scope.hasStock = response.data.hasStock;
        //     $scope.isSupportCOD = response.data.isSupportCOD;
        //     $scope.couponList = response.data.sgStoreCouponVoList;
        //   });
        // }
        if (!$scope.isAllAttr && $scope.IsShowAttribute) {
          var str = '';
          for (var i = 0; i < $scope.NoActiveObj.length; i++) {
            str += '&nbsp;&nbsp;' + $scope.NoActiveObj[i][0].attrName;
          }
          PopupService.showToast('请选择' + str);
        } else {
          $scope.productCount -= 1;
          if ($scope.productCount <= $scope.stockNumber) {
            $scope.hasStock = true;
          }
        }
      }
      if($scope.productModel.product.productAttribute!=2){
                      $scope.serId = '';
                      $scope.serviceProm = Object.assign([],$scope.staticProm,[]); 
                      for(var i=0;i<$scope.serviceProm.length;i++){
                      $scope.serId += $scope.serviceProm[i].i+',';
                    } 
                      if($scope.isB2C || !$scope.isSupportCOD || $scope.productModel.isActivityProduct || !$scope.hasStock || $scope.productCount > 2){
                        
                        $scope.serviceProm.map(function(item,index){
                            if(item.n=='货到付款'){
                              $scope.serId = '';
                             $scope.serviceProm.splice(index,1);
                             for(var i=0;i<$scope.serviceProm.length;i++){
                                  $scope.serId += $scope.serviceProm[i].i+',';
                                } 
                            }
                        })
                      }
                    }else{
                      $scope.serviceProm = [];
                    }
    };
    //点击增加商品数量按钮触发事件
    $scope.plus = function () {
      if ($scope.IsShowAttribute) { // 有子商品  才调取查询库存接口 yl
        /* ProductDetailService.locationChange($scope.productModel.product.sku, $scope.productModel.product.productId, $scope.productModel.regionId, $scope.productCount+1, $scope.productModel.provinceId, $scope.productModel.cityId, $scope.productModel.pcrName, $scope.productModel.storeId, $scope.productModel.streetId)
        .success(function (response, status, headers, config) {
          if(response.success==false){
            PopupService.showToast(response.message);
          }else{
            $scope.productCount += 1;
          $scope.hasStock = response.data.hasStock;
          $scope.isSupportCOD = response.data.isSupportCOD;
          $scope.couponList = response.data.sgStoreCouponVoList;
          }
        }); */
        // 是否全部选择属性 yl
        if (!$scope.isAllAttr) {
          var str = '';
          for (var i = 0; i < $scope.NoActiveObj.length; i++) {
            str += '&nbsp;&nbsp;' + $scope.NoActiveObj[i][0].attrName;
          }
          PopupService.showToast('请选择' + str);
        } else {
          $scope.productCount += 1;
          if ($scope.productCount > $scope.stockNumber) {
            $scope.hasStock = false;
          }
        }
      } else {
        $scope.productCount += 1;
        if ($scope.productCount > $scope.stockNumber) {
          $scope.hasStock = false;
        }
      }
      if($scope.productModel.product.productAttribute!=2){
                      $scope.serId = '';
                      $scope.serviceProm = Object.assign([],$scope.staticProm,[]); 
                      for(var i=0;i<$scope.serviceProm.length;i++){
                      $scope.serId += $scope.serviceProm[i].i+',';
                    } 
                      if($scope.isB2C || !$scope.isSupportCOD || $scope.productModel.isActivityProduct || !$scope.hasStock || $scope.productCount > 2){
                       
                        $scope.serviceProm.map(function(item,index){
                            if(item.n=='货到付款'){
                              $scope.serId = '';
                             $scope.serviceProm.splice(index,1);
                             for(var i=0;i<$scope.serviceProm.length;i++){
                                  $scope.serId += $scope.serviceProm[i].i+',';
                                } 
                            }
                        })
                      }
                    }else{
                      $scope.serviceProm = [];
                    }
    };
    //拨打电话
    $scope.makeACall = function () {
      var confirmPopup = $ionicPopup.confirm({
        template: $scope.O2Omobile,
        cancelText: '取消',
        okText: '确定'
      });
      confirmPopup.then(function (res) {
        if (res) {
          if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) { //只有ios app 特有的样式
            window.open('tel:' + $scope.O2Omobile, '_system');
          } else {
            window.open('tel:' + $scope.O2Omobile);
          }
        } else {
          console.log('You are not sure');
        }
      });
    }
    //获取评价
    function getValuate() {
      ProductDetailService.evalute($scope.productId)
        .success(function (response) {
          $scope.positiveRate = response.data.positiveRate;
          $scope.totalNum = response.data.totalNum;
        })
    }
    //解决物理返回按钮继续播放问题xyz添加
    $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {
        if ('productDetail' == fromState.name) {
          var video = document.getElementsByTagName("video");
          for (var i = 0; i < video.length; i++) {
            video[i].pause();
          }
        }
      });

    //轮播图切换关闭视频播放xyz添加
    $scope.slideHasChanged = function ($index) {
      var video = document.getElementsByTagName("video");
      for (var i = 0; i < video.length; i++) {
        video[i].pause();
      }
    };

    //点击轮播图
    $scope.seeBigPic = function (index) {
      //规格参数轮播图
      if (index == "attr") {
        $scope.isShowAttrLeftArrow = true;
        $scope.isAllAttrpic = true;
        $scope.activeSlide = 0;

        setTimeout(function () {
          for (var i = $scope.AttrswiperImgs.length - 1; i >= 0; i--) {
            console.log('div#pinchZoomBigPic' + i);
            new RTP.PinchZoom($('div#pinchZoomBigPic-' + i), {});
          }
        }, 500);

      } else {
        $scope.isShowBigPic = true;
        $scope.isShowLeftArrow = true;
        if ($scope.flagMp4) {
          $scope.activeSlide = index;
        } else {
          $scope.activeSlide = index - 1;
        }

        setTimeout(function () {
          for (var i = $scope.productModel.swiperImgs.length - 1; i >= 0; i--) {
            console.log('div#pinchZoomBigPic' + i);
            new RTP.PinchZoom($('div#pinchZoomBigPic-' + i), {});
          }
        }, 500);
      }
    }
    //点击轮播图 大图
    $scope.showBigPic = function (index) {
      $scope.isShowBigPic = false;
      $scope.isShowLeftArrow = false;
    }

    //点击轮播上的返回
    $scope.showBigPicAttr = function () {
      $scope.isShowAttrLeftArrow = false;
      $scope.isAllAttrpic = false;
    }
    //地址窗口
    $scope.addressTop = function () {
      $scope.addressTipFlag = false;
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
      $scope.addressInit($scope.dataAdd, $scope.defaultValue, 'PRODUCT_DETAIL_LOCATION', 0);
    }
    //地址初始化
    $scope.addressInit = function (defaultValue, data, flag, level) {
      $scope.addressTipFlag = false;
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
        $scope.nowLevel = $scope.level;
        $scope.nowLevel = $scope.nowLevel * (-1);
        for (var i = 0; i < $scope.nowLevelIndex.length; i++) {
          if (i > $scope.nowLevel) {
            $scope.nowLevelIndex[i] = -1;
          }
        }
      } else {
        $scope.finish = false;
        $scope.addressTip = '正在获取地址信息...';
        $scope.addressTipFlag = true;
        $scope.dataAdd = "";
        //第一次取全国的省直辖市信息
        GoodsService.getLocationList('', 0).success(function (response) {
          $scope.dataAdd = response.data;
          $scope.addressTipFlag = false;
          $scope.finish = true;
          $scope.nowLevel = $scope.level;
          $scope.nowLevel = $scope.nowLevel * (-1);
          var defaultValueFy = JSON.stringify($scope.defaultValue);
          var dataAddFy = JSON.stringify($scope.dataAdd);
          // $scope.addressInit(defaultValueFy,dataAddFy,$scope.flag,$scope.level)
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
      $scope.dataAdd = "";
      $scope.nowLevelIndex[$scope.nowLevel] = index;
      var item = arguments[1];
      var index = arguments[0];
      $scope.level = $scope.level - 1; //-1,下一个 为 －2 ，
      $scope.defaultValue['text' + $scope.level] = item.text;
      $scope.defaultValue['value' + $scope.level] = item.value;
      if ($scope.level > -2) { //xyz修改2级本地获取
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
          //          $scope.dataAdd = $scope.dataAdd[index].children;
        }
        ah = $scope.level * -1;
        $scope.addressTip = '正在获取地址信息...';
        $scope.addressTipFlag = true;
        GoodsService.getLocationList(item.value, ah).success(function (response) {
          if (ah == 1) {
            areaValueCity = item.value;
          }
          $scope.dataAdd = response.data;
          $scope.addressTipFlag = false;
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
          $scope.addressTip = '正在获取地址信息...';
          $scope.addressTipFlag = true;
          $scope.dataAdd = "";
          GoodsService.getLocationList(areaValueCity, 1).success(function (response) {
            $scope.dataAdd = response.data;
            $scope.addressTipFlag = false;
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
        $scope.addressTip = '正在获取地址信息...';
        $scope.addressTipFlag = true;
        ProductDetailService.getLocationList(item.value, ah).success(function (response) {
          $scope.dataAdd = response.data;
          $scope.addressTipFlag = false;
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
          $scope.addressTip = '正在获取地址信息...';
          $scope.addressTipFlag = true;
          $scope.dataAdd = "";
          ProductDetailService.getLocationList(areaValue, 2).success(function (response) {
            $scope.dataAdd = response.data;
            $scope.addressTipFlag = false;
            console.log($scope.dataAdd);
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
      var detailAddress = addressMessage.regionName + '/' + addressMessage.streetName;
      ProductDetailService.addAddress(addressMessage.provinceId, addressMessage.cityId, addressMessage.areaId, detailAddress, addressMessage.streetId)
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
          $scope.addressModal.hide();
        })
    };
    //窗口modal
    $ionicModal.fromTemplateUrl('templates/common/CommonLocation.html', {
      scope: $scope,
      animation: 'slide-in-up',
    }).then(function (modal) {
      $scope.addressModal = modal;
    });
    $scope.closeAddressModal = function () {
      $scope.addressModal.hide();
    };
    // 硬装modal
    $ionicModal.fromTemplateUrl('templates/common/CommonStoreInfo.html', {
      scope: $scope,
      animation: 'slide-in-up',
    }).then(function (modal) {
      $scope.StoreMsgModal = modal;
    });
    $scope.closeStoreModal = function () {
      $scope.StoreMsgModal.hide();
    };
    //更改地址
    var listener = $rootScope.$on('PRODUCT_DETAIL_LOCATION', function (event, data) {
      $scope.noFresh = true;
      $scope.productModel.pcrName = data["text-1"] + ' ' + data["text-2"] + ' ' + data["text-3"] + '/' + data['text-4'];
      $scope.productModel.provinceId = data["value-1"];
      $scope.productModel.cityId = data["value-2"];
      $scope.productModel.regionId = data["value-3"];
      $scope.productModel.streetId = data['value-4'];
      $rootScope.addressStr = JSON.stringify(data);
      // ProductDetailService.getO2OName($scope.productModel.product.sku, $scope.productModel.provinceId, $scope.productModel.cityId, $scope.productModel.regionId, $scope.productModel.streetId)
      //   .success(function (response) {
      //     if ($.isEmptyObject(response.data)) {
      //       $scope.showO2OMsg = false;
      //     } else {
      //       $scope.showO2OMsg = true;
      //       $scope.O2OStoreName = response.data.O2OStoreName;
      //       $scope.avatarImageFileId = response.data.avatarImageFileId;
      //       $scope.o2oStoreId = response.data.o2oStoreId;
      //       $scope.O2Omobile = response.data.mobile;
      //       $scope.o2oCode = response.data.storeCode;
      //       if ($scope.O2Omobile) {
      //         $scope.showPhoneCall = true;
      //       } else {
      //         $scope.showPhoneCall = false;
      //       }
      //       $scope.serviceGrade = response.data.serviceGrade;
      //       $scope.productGrade = response.data.productGrade;
      //       $scope.logisticalGrade = response.data.logisticalGrade;
      //     }
      //     var o2oStoreId = $scope.showO2OMsg?$scope.o2oStoreId:'';
      //     ProductDetailService.getIsShowAttr($scope.productId,o2oStoreId).success(function(res){
      //       console.log('是否显示规格数量');
      //       console.log(res);
      //       if(res.result){
      //         $scope.IsShowAttribute = true;
      //       }else{
      //         $scope.IsShowAttribute = false;
      //       };
      //     });
      //   });
      if ($scope.productModel.pcrName && $scope.noFresh) {
        ProductDetailService.locationChange($scope.productModel.product.sku, $scope.productModel.product.productId, $scope.productModel.regionId, $scope.productCount, data["value-1"], data["value-2"], $scope.productModel.pcrName, $scope.productModel.storeId, $scope.productModel.streetId)
          .success(function (response, status, headers, config) {
            $scope.staticProm = response.data.l;
            $scope.o2oCode =  response.data.o2OStoreInfo.storeCode;
            $scope.hasStock = response.data.hasStock;
            $scope.isSupportCOD = response.data.isSupportCOD;
            $scope.expectTime = response.data.expectTime;
            $scope.commission = response.data.commission;
            $scope.commissionRate = response.data.commissionRate;
            $scope.finalPrice = response.data.finalPrice;
            $scope.actualPrice = response.data.actualPrice;
            $scope.StoreAttributePrice = $scope.actualPrice; //规格数量-价格
            $scope.noFresh = false;
            $scope.iscompleteLoad = true;
            $scope.finMoreAct = ($scope.finalPrice - $scope.actualPrice > 0);
            $scope.bigActivity = response.data.bigActivity;
            //增加 超时免单和半日达
            $scope.isB2C = response.data.isB2C;
                  $scope.freeOrder = response.data.freeOrder;
                  $scope.halfDay = response.data.halfDay;
                  $scope.oneDay = response.data.oneDay;
                    if($scope.productModel.product.productAttribute!=2){
                      $scope.serId = '';
                      $scope.serviceProm = Object.assign([],$scope.staticProm,[]); 
                      for(var i=0;i<$scope.serviceProm.length;i++){
                      $scope.serId += $scope.serviceProm[i].i+',';
                    } 
                      if($scope.isB2C || !$scope.isSupportCOD || $scope.productModel.isActivityProduct || !$scope.hasStock || $scope.productCount > 2){
                        
                        $scope.serviceProm.map(function(item,index){
                            if(item.n=='货到付款'){
                              $scope.serId = '';
                             $scope.serviceProm.splice(index,1);
                             for(var i=0;i<$scope.serviceProm.length;i++){
                                  $scope.serId += $scope.serviceProm[i].i+',';
                                } 
                            }
                        })
                      }
                    }else{
                      $scope.serviceProm = [];
                    }
            $scope.isPackage = response.data.isPackage;
            //优惠券、服务、赠品
            $scope.couponList = response.data.sgStoreCouponVoList;
            //$scope.storeServiceList = response.data.storeServiceInfo;
            $scope.giftInfo = response.data.giftInfo;
            //库存数量
            $scope.stockNumber = response.data.stockNum;
            $scope.StoreAttributNumber = $scope.hasStock ? '有货' : '无货'; //规格数量-库存
            //增加限时抢购
            /*是否限时抢购*/
            $scope.isFlashsales = response.data.isFlashsales;
            // $scope.flashsalesEndTime = response.data.flashsalesEndTime; yl
            if(response.data.flashsalesEndTime){
              $scope.flashsalesEndTime = new Date(response.data.flashsalesEndTime.replace(/-/g,'/')).getTime();
            }else{
              $scope.flashsalesEndTime = 0;
            }
            // 库存类型 yl
            $scope.stockType = response.data.stockType;
            if ($scope.flashsalesEndTime < new Date().getTime()) {
              $scope.isFlashsales = false;
            }
            //更改地址统计库存
            if (window.cordova) {
              $rootScope.gio.track('stockInfo', {
                productId: $scope.productModel.product.productId,
                productFirstName: '',
                hasStock: $scope.hasStock,
                ReceivingProvince: data["text-1"],
                ReceivingCity: data["text-2"],
                ReceivingDistrict: data["text-3"],
                ReceivingStreet: data["text-4"]
              });
            }
            if (typeof (gio) != "undefined") {
              gio('track', 'getAddress', {
                productId: $scope.productModel.product.productId,
                productFirstName: '',
                hasStock: $scope.hasStock ? '有货' : '无货',
                ReceivingProvince: data["text-1"],
                ReceivingCity: data["text-2"],
                ReceivingDistrict: data["text-3"],
                ReceivingStreet: data["text-4"]
              });
            }
            if ($scope.isFlashsales == true) {
              $scope.state = true;
              var nowdate1 = new Date();
              var s9 = $scope.flashsalesEndTime,
                s10 = nowdate1.getTime();
              if (s9 < s10) {
                $scope.state = false;
              } else {
                var timer3 = $interval(function () {
                  s10 = s10 + 1000;
                  var toendtime = parseInt((s9 - s10) / 1000);
                  var day = parseInt(toendtime / (24 * 60 * 60)); //计算整数天数
                  var afterDay = toendtime - day * 24 * 60 * 60; //取得算出天数后剩余的秒数
                  var hour = parseInt(afterDay / (60 * 60)); //计算整数小时数
                  var afterHour = toendtime - day * 24 * 60 * 60 - hour * 60 * 60; //取得算出小时数后剩余的秒数
                  var min = parseInt(afterHour / 60); //计算整数分
                  var afterMin = toendtime - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60; //取得算出分后剩余的秒数
                  $scope.showtime1 = day + '天' + flashService.PrefixInteger(hour) + ":" + flashService.PrefixInteger(min) + ":" + flashService.PrefixInteger(parseInt(afterMin));
                  if (toendtime <= -1) {
                    $scope.state = false;
                    $interval.cancel(timer3);
                    $state.reload();
                  }
                }, 1000)
              }

            }
            /*原价*/
            $scope.originalPrice = response.data.originalPrice;
            //增加预约抢购
            /*是否预约抢购*/
            $scope.isAcReserve = response.data.isAcReserve;
            /*活动类型*/
            $scope.acReserveType = response.data.acReserveType;
            /*预约活动商品ID*/
            $scope.acReserveId = response.data.acReserveId;
            /*结束时间*/
            // $scope.acReserveEndTime = response.data.acReserveEndTime; //yl
            if(response.data.acReserveEndTime){
              $scope.acReserveEndTime = new Date(response.data.acReserveEndTime.replace(/-/g,'/')).getTime();
            }else{
              $scope.acReserveEndTime = 0;
            }
            /*距离结束时间*/
            $scope.state1 = true;
            var nowdate = new Date();
            var s7 = $scope.acReserveEndTime,
              s8 = nowdate.getTime();
            var timer = $interval(function () {
              s8 = s8 + 1000;
              var toendtime = parseInt((s7 - s8) / 1000);
              var day = parseInt(toendtime / (24 * 60 * 60)); //计算整数天数
              var afterDay = toendtime - day * 24 * 60 * 60; //取得算出天数后剩余的秒数
              var hour = parseInt(afterDay / (60 * 60)); //计算整数小时数
              var afterHour = toendtime - day * 24 * 60 * 60 - hour * 60 * 60; //取得算出小时数后剩余的秒数
              var min = parseInt(afterHour / 60); //计算整数分
              var afterMin = toendtime - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60; //取得算出分后剩余的秒数
              $scope.showtime = day + '天' + flashService.PrefixInteger(hour) + ":" + flashService.PrefixInteger(min) + ":" + flashService.PrefixInteger(parseInt(afterMin));
              if (toendtime == -1) {
                myPopupCui.close();
                $state.reload();
                $scope.state = false;
                $interval.cancel(timer);
              }
            }, 1000)
            /*判断是预约还是抢购*/
            if ($scope.isAcReserve == true) {
              if ($scope.acReserveType == 1) {
                $scope.repur = '预约';
                /*预约人数*/
                $scope.repurNum = response.data.acReserveNum;
              }
              if ($scope.acReserveType == 2) {
                $scope.repur = '抢购';
                /*抢购人数*/
                $scope.repurNum = response.data.acPurchaseNum;
              }
            }
            // 修改地址后重置o2o店铺信息
            if (!response.data.o2OStoreInfo || !response.data.o2OStoreInfo.o2OStoreName) {
              $scope.showO2OMsg = false;
            } else {
              $scope.showO2OMsg = true;
              $scope.O2OStoreName = response.data.o2OStoreInfo.o2OStoreName;
              $scope.avatarImageFileId = response.data.o2OStoreInfo.avatarImageFileId;
              $scope.o2oStoreId = response.data.o2OStoreInfo.o2oStoreId;
              $scope.O2Omobile = response.data.o2OStoreInfo.mobile;
              if ($scope.O2Omobile) {
                $scope.showPhoneCall = true;
              } else {
                $scope.showPhoneCall = false;
              }
              $scope.serviceGrade = response.data.o2OStoreInfo.serviceGrade;
              $scope.productGrade = response.data.o2OStoreInfo.productGrade;
              $scope.logisticalGrade = response.data.o2OStoreInfo.logisticalGrade;
            }
            //shequ
            CirclePageService.getCircleLink($scope.productId,$scope.o2oStoreId,'2')
            .success(function(res){
              if(res.success){
                $scope.topTeam=true;
                $scope.teamUrl=res.data;
              }

            })
            //查看是否有能领取优惠券
            ProductDetailService.getProductCouponsHas($scope.productModel.product.sku, $scope.productModel.product.productId, 1, $scope.actualPrice, $scope.productModel.storeId, $scope.o2oStoreId||'')
              .success(function (response) {
                if (response.success) {
                  $scope.couponListNew = response.data.couponList;
                } else {
                  console.log(response.data.message);
                }
              });
            //判断规格数量是否展示
            ProductDetailService.getIsShowAttr($scope.productId, $scope.o2oStoreId || '').success(function (res) {
              console.log('是否显示规格数量');
              console.log(res);
              if (res.result) {
                $scope.IsShowAttribute = true;
              } else {
                $scope.IsShowAttribute = false;
              };
            });
          });
      }
    });
    $scope.$on('$destroy', function () {
      listener();
      listener = null;
    })
    //右上角更多按钮点击函数
    $scope.openMore = function () {
      $scope.moreShow = !$scope.moreShow;
    };
    //关闭优惠券按钮点击函数
    $scope.closeCoupons = function () {
      $scope.getcoupons = false;
      startIndex = 1; //初始化优惠券开始页
    };
    //获取优惠券方法
    $scope.logConpous = function () {
      ProductDetailService.getShopCoupons($scope.productModel.product.productId, $scope.productModel.product.brandId, $scope.productModel.product.productCateId, $scope.productModel.actualPrice, startIndex, pageSize, $scope.o2oStoreId)
        .success(function (response, status, headers, config) {
          if (response.success) {
            if (startIndex == 1) {
              startIndex++;
              $scope.shopCoupons = response.data;
              $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
              if ($scope.shopCoupons.length < response.totalCount) {
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.hasMoreCoupons = true;
              } else {
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.hasMoreCoupons = false;
              }
            } else {
              startIndex++;
              $scope.shopCoupons = $scope.shopCoupons.concat(response.data);
              if ($scope.shopCoupons.length < response.totalCount) {
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.hasMoreCoupons = true;
              } else {
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.hasMoreCoupons = false;
              }
            }
          } else {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.hasMoreCoupons = false;
          }
        });
    }
    //打开优惠券按钮点击函数
    $scope.openCoupons = function () {
      $scope.logConpous();
      $scope.getcoupons = true;
    };
    //领取优惠券方法
    $scope.getNewCoupons = function (id) {
      HomePageService.isWdHost()
        .success(function (res) {
          $rootScope.isWdHost = res.data.isHost;
          if ($rootScope.isWdHost == -1) { //如果没有登录 跳转到登录页面
            $state.go('login');
          } else {
            GetCouponsService.doGetNewCoupons(id)
              .success(function (response) {
                if (response.success) {
                  $rootScope.couponXyzType = true;
                  $ionicScrollDelegate.scrollTop();
                  startIndex = 1;
                  $scope.logConpous();
                } else {
                  $scope.remindSuccess = true;
                  $scope.message = response.message;
                  setTimeout(function () {
                    $scope.$apply(function () {
                      $scope.remindSuccess = false;
                    });
                  }, 1500);
                }
              });
          }
        })
    }

    $scope.goMessageCenter = function () {
      $scope.moreShow = false;
      $state.go('messageCenter');
    };

    //回退到指定页面
    $scope.goBack = function () {
      if ($rootScope.fromState == 'advertisement') {
        $state.go('homePage');
      } else if ($ionicHistory.viewHistory().histories.root.cursor == 0 && $rootScope.fromCommunity) { // 如果是从社群页面跳转来的
        var nowLocationPage = window.history.length; // 返回到第一次打开的单品页时 现在的浏览器记录的url长度
        window.history.go(-(nowLocationPage - $rootScope.firstLocationPage + 1));
      } else {
        if ($scope.goBackFlag) {
          $scope.goBackFlag = false;
          $ionicHistory.goBack();
        }
      }
    };
    $scope.showCopyButton = function () {
      if (window.cordova) {
        $scope.isShowCopyButton = true;
      } else {

      }

    }
    $scope.$on('$ionicView.beforeLeave', function (e, v) {
      $scope.watch();
    })

    //页面初始化
    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.showBackBtn = $rootScope.fromCommunity || (!$rootScope.fromCommunity && $ionicHistory.viewHistory().histories.root.cursor != 0);
      $scope.isShowBigPic = false;
      $scope.remindSuccess = false;
      $scope.isWhiteShows = false;
      startIndex = 1;
      $scope.getcoupons = false;
      conjs = document.getElementsByClassName('container');
      conJsl();
      conJsm();
      conJst();
      $scope.goBackFlag = true;
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
      $rootScope.isApp = window.cordova ? true : undefined;
      $scope.shareStoreId = $stateParams.shareStoreId;
      $scope.userId = UserService.getUser().mid; //用户Id
      $scope.isBuyer = LoginService.getRole(); //判断用户角色信息；0为买家；1为卖家
      $scope.init();
      $scope.addressInit($scope.dataAdd, $scope.defaultValue, 'PRODUCT_DETAIL_LOCATION', 0);
      if ($ionicHistory.viewHistory().backView) {
        bv = $ionicHistory.viewHistory().backView;
        if (bv.stateName == 'bannerTheme' || bv.stateName == 'bannerDaily') { //如果 是活动商品不显示佣金bannerDaily
          $scope.isFromBanner = true;
        }
      }
      $scope.$on('$destroy', function () {
        $scope.addressModal.remove();
      });
      $rootScope.addressStr = undefined;
      //判断是否为微信浏览器
      userLookAgent = window.navigator.userAgent.toLowerCase();
      isWeChat = userLookAgent.match(/MicroMessenger/i) == 'micromessenger';



      //购物车数量
      $scope.getCartNumFn(0);
    });

    //xyz添加清除计时器
    $scope.$on('$ionicView.afterLeave', function () {
      $interval.cancel(timer1);
      $interval.cancel(timer2);
    });

    //改变添加到店铺状态
    $scope.changeState = function (sta) {
      if (bv.stateName == 'orderDetail' && ($scope.isBuyer == 0)) {
        return;
      }
      if (sta == 1) {
        ProductDetailService.changeChooseStateJia($scope.productModel.product.productId, '1')
          .success(function (response, status, headers, config) {
            $scope.productModel.onShelf = !$scope.productModel.onShelf;
          });
      } else {
        ProductDetailService.changeChooseStateDui($scope.productModel.product.productId)
          .success(function (response, status, headers, config) {
            $scope.productModel.onShelf = !$scope.productModel.onShelf;
          });
      }
    };
    //添加至购物车触发方法
    $scope.addToCart = function () {
          // if ($scope.isFlashsales == true) {
          //   if (response.data.carts) {
          //     for (var i = 0; i < response.data.carts.length; i++) {
          //       if (response.data.carts[i].productId == $scope.productId) {
          //         PopupService.showToast('限时抢购商品，一次只能购买一个');
          //         return false;
          //       }
          //     }
          //   }
          // }
          //再次校验库存
          ProductDetailService.checkStockForPay(($scope.IsShowAttribute ? $scope.skku : ''), $scope.productModel.product.productId, $scope.productModel.regionId,
            $scope.productCount, $scope.productModel.provinceId, $scope.productModel.cityId, $scope.productModel.pcrName, $scope.productModel.storeId, $scope.productModel.streetId, $scope.stockType, $scope.o2oStoreId, $scope.productModel.storeId)
            .success(function (response, status, headers, config) {
              if (!response.data.hasStock) {
                $scope.showPopup('库存不足！');
                return false;
              }
              ProductDetailService.addToCart($scope.productModel.product.sku, $scope.productModel.product.productId, $scope.productCount, '', $scope.productModel.product.productId, $scope.skku, $scope.attrValueNames, $scope.o2oStoreId, $scope.productModel.streetId)
                .success(function (response, status, headers, config) {
                  if (response.success == true) {

                    if (window.cordova) {
                      $rootScope.gio.track('ScAdd', {
                        productId: $scope.productId,
                        productFirstName: '',
                        productSecondName: '',
                        o2oType: $scope.o2oType,
                        storeId: $scope.storeId,
                        skku: $scope.skku,
                        attrValueNames: $scope.attrValueNames,
                      });
                    }
                    if (typeof (_fxcmd) != 'undefined') {
                      _fxcmd.push(['trackEvent', 'event', 'cvr3', 'addcart', '1']);
                    }
                    //刷新-购物车数量
                    $scope.getCartNumFn(1);
                    if ($scope.IsShowAttribute) {// 多属性加入购物车成功后 重置输入框数值 yl
                      $scope.productCount = 1;
                    }
                  } else {
                    PopupService.showToast('加入购物车失败');
                  }
                });
            });
    };
    //立即购买触发方法
    $scope.buyNow = function (cookValue) {
      // 调转到订单填写页面所需参数  yl
      if ($scope.IsShowAttribute) {
        $scope.orderInitParams = {
          "proList": [{
            "proId": $scope.productModel.product.productId,
            "num": $scope.productCount,
            'sku': $scope.skku,
            'name': $scope.attrValueNames.join()
          }],
          "street": $scope.productModel.streetId
        }
      } else {
        $scope.orderInitParams = {
          "proList": [{
            "proId": $scope.productModel.product.productId,
            "num": $scope.productCount,
          }],
          "street": $scope.productModel.streetId
        }
      }
      // if (isWeChat) {//如果在微信浏览器
      //   CartService.check_login().success(function (response) {
      //     if (response.data) {
      //       UserService.setUser(response.data);////
      //       IMService.initWebSocket();////
      //       window.localStorage.setItem('isLogin', UserService.isUserLogin());////
      //       if (response.data.sessionValue) {
      //         $localstorage.set('sg_login_token_secret', 'Bearer' + response.data.sessionValue);//把token存到本地
      //       } else {
      //         $localstorage.set('sg_login_token_secret', 'Bearer' + GetStatisticInfoService.generateUUID());
      //       }
      //       //再次校验库存
      //       ProductDetailService.checkStockForPay(($scope.IsShowAttribute ? $scope.skku : ''), $scope.productModel.product.productId, $scope.productModel.regionId, $scope.productCount, $scope.productModel.provinceId, $scope.productModel.cityId, $scope.productModel.pcrName, $scope.productModel.storeId, $scope.productModel.streetId, $scope.stockType, $scope.o2oStoreId, $scope.productModel.storeId)
      //         .success(function (response, status, headers, config) {
      //           if (!response.data.hasStock && cookValue != '1') {
      //             ProductDetailService.loadData($scope.productId, $scope.storeId, $scope.o2oType, $scope.fromUrl, $scope.fromType)
      //               .success(function (response) {
      //                 if (response.data.product.bookable) { //如果能预定且库存不足
      //                   var myPopup = $ionicPopup.show({
      //                     template: '<div style="color: black;text-align: center;font-size: 12px;overflow: hidden;white-space:nowrap; text-overflow:ellipsis;"><span>库存不足，是否去预订?</span></div>',
      //                     scope: $scope,
      //                     buttons: [{
      //                       text: '否'
      //                     },
      //                     {
      //                       text: '<b>是</b>',
      //                       type: 'button-positive',
      //                       onTap: function (e) {
      //                         ProductDetailService.buyNow($scope.orderInitParams)
      //                           .success(function (response, status, headers, config) {
      //                             if (response.success && response.data) {
      //                               var expireDate = new Date();
      //                               expireDate.setDate(expireDate.getDate() + 1);
      //                               //判断规格数量是否展示 展示传attrValueNames  skku ， 不展示不传
      //                               if ($scope.IsShowAttribute) {
      //                                 $state.go('orderConfirm', {
      //                                   Book: 1,
      //                                   attrValueNames: $scope.attrValueNames,
      //                                   skku: $scope.skku,
      //                                   o2oAttrId: $scope.o2oStoreId
      //                                 });
      //                               } else {
      //                                 $state.go('orderConfirm', {
      //                                   Book: 1,
      //                                 });
      //                               }
      //                             } else {
      //                               $scope.showPopup('操作失败！');
      //                             }
      //                           }).error(function (response, status, headers, config) {
      //                             $scope.showPopup('操作失败！');
      //                           });
      //                       }
      //                     }
      //                     ]
      //                   })
      //                 } else {
      //                   $scope.showPopup('库存不足！'); //不能预定提示库存不足
      //                 }
      //               })
      //             return false;
      //           } else {
      //             ProductDetailService.buyNow($scope.orderInitParams)
      //               .success(function (response, status, headers, config) {
      //                 if (response.success && response.data) {
      //                   if (window.cordova) {
      //                     $rootScope.gio.track('BuyNow', {
      //                       productId: $scope.productId,
      //                       productFirstName: '',
      //                       productSecondName: '',
      //                       o2oType: $scope.o2oType,
      //                       storeId: $scope.storeId
      //                     });
      //                   }
      //                   var expireDate = new Date();
      //                   expireDate.setDate(expireDate.getDate() + 1);
      //                   //if (cookValue === '1') {
      //                   //  $cookies.put('is_book', '1', {expires: expireDate, path: '/'});
      //                   //} else {
      //                   //  $cookies.put('is_book', '', {expires: expireDate, path: '/'});
      //                   //}
      //                   //              $state.go('orderConfirm');
      //                   // if($scope.IsShowAttribute){
      //                   //   $state.go('orderConfirm', {
      //                   //     Book: 0,
      //                   //     attrValueNames:$scope.attrValueNames,
      //                   //     skku:$scope.skku,
      //                   //     o2oAttrId:$scope.o2oStoreId
      //                   //   });
      //                   // }else{
      //                   //   $state.go('orderConfirm', {
      //                   //     Book: 0
      //                   //   });
      //                   // };
      //                   $state.go('orderConfirm', { orderInitParams: JSON.stringify($scope.orderInitParams) })
      //                 } else if (response.code == '1001' && response.success == false) {
      //                   $scope.showPopup(response.message);
      //                 } else {
      //                   $scope.showPopup(response.message);
      //                 }
      //               }).error(function (response, status, headers, config) {
      //                 $scope.showPopup('操作失败！');
      //               });
      //           }
      //         });///////////////////////////////
      //     } else {
      //       var login_token = $localstorage.get('sg_login_token_secret');
      //       var normalURL = $location.absUrl();
      //       var startPos = normalURL.indexOf("html?");
      //       if (startPos != -1) {
      //         var endPos = normalURL.indexOf("#", startPos);
      //         var startURL = normalURL.substring(0, startPos) + "html";
      //         var endURL = normalURL.substring(endPos);
      //         var currentUrl = encodeURIComponent(startURL + endURL) + encodeURIComponent('/') + login_token;
      //       } else {
      //         var currentUrl = encodeURIComponent(normalURL) + encodeURIComponent('/') + login_token;
      //       }
      //       CartService.state_id(currentUrl)
      //         .success(function (response) {
      //           var state_URL = response.data;
      //           var APPID = UrlService.getCPUrl('WXSQ_ID');
      //           var REDIRECT_URI = encodeURIComponent(UrlService.getCPUrl('WXSQ_URL') + 'platform/web/member/wxWebLogin.json');
      //           var weixinUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + APPID + '&redirect_uri=' + REDIRECT_URI + '&response_type=code&SCOPE=snsapi_userinfo' + '&state=' + state_URL + '#wechat_redirect';
      //           document.location.href = weixinUrl;
      //         })
      //     }
      //   })
      //   return;
      // }
      // PopupService.showToast('不在微信浏览器');
      HomePageService.isWdHost().success(function (res) {
        $rootScope.isWdHost = res.data.isHost;
        if ($rootScope.isWdHost == -1) { //如果没有登录 跳转到登录页面
          $state.go('login');
        } else {
          //再次校验库存
          ProductDetailService.checkStockForPay($scope.skku, $scope.productModel.product.productId, $scope.productModel.regionId, $scope.productCount, $scope.productModel.provinceId, $scope.productModel.cityId, $scope.productModel.pcrName, $scope.productModel.storeId, $scope.productModel.streetId, $scope.stockType, $scope.o2oStoreId, $scope.productModel.storeId)
            .success(function (response, status, headers, config) {
              if (!response.data.hasStock && cookValue != '1') {
                ProductDetailService.loadData($scope.productId, $scope.storeId, $scope.o2oType, $scope.fromUrl, $scope.fromType)
                  .success(function (response) {
                    if (response.data.product.bookable) { //如果能预定且库存不足
                      var myPopup = $ionicPopup.show({
                        template: '<div style="color: black;text-align: center;font-size: 12px;overflow: hidden;white-space:nowrap; text-overflow:ellipsis;"><span>库存不足，是否去预订?</span></div>',
                        scope: $scope,
                        buttons: [{
                          text: '否'
                        },
                        {
                          text: '<b>是</b>',
                          type: 'button-positive',
                          onTap: function (e) {
                            ProductDetailService.buyNow($scope.orderInitParams)
                              .success(function (response, status, headers, config) {
                                if (response.success && response.data) {
                                  var expireDate = new Date();
                                  expireDate.setDate(expireDate.getDate() + 1);
                                  //判断规格数量是否展示 展示传attrValueNames  skku ， 不展示不传
                                  // if($scope.IsShowAttribute){
                                  //   $state.go('orderConfirm', {
                                  //     Book: 1,
                                  //     attrValueNames:$scope.attrValueNames,
                                  //     skku:$scope.skku,
                                  //     o2oAttrId:$scope.o2oStoreId
                                  //   });
                                  // }else{
                                  //   $state.go('orderConfirm', {
                                  //     Book: 1,
                                  //   });
                                  // }
                                  $state.go('orderConfirm', { orderInitParams: JSON.stringify($scope.orderInitParams) })
                                } else {
                                  $scope.showPopup('操作失败');
                                }
                              }).error(function (response, status, headers, config) {
                                $scope.showPopup('操作失败！');
                              });
                          }
                        }
                        ]
                      })
                    } else {
                      $scope.showPopup('库存不足！'); //不能预定提示库存不足
                    }
                  })
                return false;
              } else {

                ProductDetailService.buyNow($scope.orderInitParams)
                  .success(function (response, status, headers, config) {
                    if (response.success && response.data) {
                      if (window.cordova) {
                        $rootScope.gio.track('BuyNow', {
                          productId: $scope.productId,
                          productFirstName: '',
                          productSecondName: '',
                          o2oType: $scope.o2oType,
                          storeId: $scope.storeId
                        });
                      }
                      var expireDate = new Date();
                      expireDate.setDate(expireDate.getDate() + 1);
                      if (cookValue === '1') {
                        $cookies.put('is_book', '1', { expires: expireDate, path: '/' });
                      } else {
                        $cookies.put('is_book', '', { expires: expireDate, path: '/' });
                      }
                      //              $state.go('orderConfirm');
                      //判断规格数量是否展示 展示传attrValueNames  skku ， 不展示不传
                      //yl
                      /* if($scope.IsShowAttribute){
                        $state.go('orderConfirm', {
                          Book: 0,
                          attrValueNames:$scope.attrValueNames,
                          skku:$scope.skku,
                          o2oAttrId:$scope.o2oStoreId
                        });
                      }else{
                        $state.go('orderConfirm', {
                          Book: 0
                        });
                      }; */
                      $state.go('orderConfirm', { orderInitParams: JSON.stringify($scope.orderInitParams) })

                    } else if (response.code == '1001' && response.success == false) {
                      $scope.showPopup(response.message);
                    } else {
                      $scope.showPopup(response.message);
                    }
                  }).error(function (response, status, headers, config) {
                    $scope.showPopup('操作失败！');
                  });
              }
            });

        }
      });
    };
    //到货通知弹窗
    $scope.toNotice = function () {
      var myPopup = $ionicPopup.show({
        template: '<div style="color: black;text-align: left;font-size: 12px;overflow: hidden;white-space:nowrap; text-overflow:ellipsis;"><span>商品名称：</span><span ng-bind="productModel.product.productFullName"></span></div>' +
          '<div style="text-align: left;color: black;font-size: 12px"><span>手机号：</span><input type="tel" ng-model="user.mobile" style="display: inline;width: 70%;border: solid 1px #ddd;"/></div>',
        scope: $scope,
        buttons: [{
          text: '取消'
        },
        {
          text: '<b>确定</b>',
          type: 'button-positive',
          onTap: function (e) {
            if (!($scope.globalConstant.mobileNumberRegExp.test($scope.user.mobile))) {
              PopupService.showToast('请输入正确的手机号码！');
              return;
            }
            ProductDetailService.checkNotice($scope.productId, $scope.user.mobile, $scope.productModel.provinceId, $scope.productModel.cityId, $scope.productModel.regionId, $scope.productModel.streetId).success(function (response) {
              if (response.success) {
                if (response.result === 0) {
                  ProductDetailService.arriveNotice($scope.productId, $scope.user.mobile, $scope.productModel.provinceId, $scope.productModel.cityId, $scope.productModel.regionId, $scope.productModel.streetId,
                    $scope.productModel.product.sku, $scope.productModel.product.productFullName, $scope.productModel.provinceName,
                    $scope.productModel.cityName, $scope.productModel.regionName,
                    $scope.o2oStoreId)
                    .success(function (response) {
                      if (response.success) {
                        var message = '您的资料已经提交，到货后我们会第一时间通知您！';
                        PopupService.showAlert('', message);
                      }
                    });
                } else {
                  var twiceMes = '该手机号在该地区已经申请到货通知，不能重复申请！';
                  PopupService.showAlert('', twiceMes);
                }
              }
            });
          }
        }
        ]
      });
    };
    //开抢通知
    $scope.startNotice = function () {
      var myPopup = $ionicPopup.show({
        template: '<div style="color: black;text-align: left;font-size: 12px;overflow: hidden;white-space:nowrap; text-overflow:ellipsis;"></span></div>' +
          '<div style="text-align: left;color: black;font-size: 12px"><span>手机号：</span><input type="tel" ng-model="user.mobile" style="display: inline;width: 70%;border: solid 1px #ddd;"/></div>',
        scope: $scope,
        buttons: [{
          text: '取消'
        },
        {
          text: '<b>确定</b>',
          type: 'button-positive',
          onTap: function (e) {
            if (!($scope.globalConstant.mobileNumberRegExp.test($scope.user.mobile))) {
              PopupService.showToast('请输入正确的手机号码！');
              return;
            }
            ProductDetailService.startNotice($scope.productId, $scope.user.mobile)
              .success(function (response) {
                PopupService.showToast('提交成功！');
              });
          }
        }
        ]
      });
    }
    //添加收藏
    $scope.tianJiaShouCang = function () {
      HomePageService.isWdHost()
        .success(function (res) {
          $rootScope.isWdHost = res.data.isHost;
          if ($rootScope.isWdHost == -1) { //如果没有登录 跳转到登录页面
            $state.go('login');
          } else {
            ProductDetailService.addShouCang($scope.productId, $scope.productModel.product.productName, $scope.productModel.product.defaultImageUrl, $scope.productModel.product.sku, $scope.productModel.pcrName)
              .success(function (data) {
                $scope.showPopup('收藏成功');
                $scope.productModel.isCollected = !$scope.productModel.isCollected;
              });
          }
        })
    };
    //取消收藏
    $scope.quXiaoShouCang = function () {
      ProductDetailService.cancelShouCang($scope.productId)
        .success(function (data) {
          $scope.showPopup('取消成功');
          $scope.productModel.isCollected = !$scope.productModel.isCollected;
        });
    };
    //PopUp方法封装
    $scope.showPopup = function (message) {
      var myPopup = $ionicPopup.show({
        template: message
      });
      $timeout(function () {
        myPopup.close();
      }, 1000);
    };
    /* 客服--调插件*/
    $scope.customerServe = function () {


      if (!UserService.isUserLogin()) { //如果没有登录 跳转到登录页面
        $state.go('login');
      } else {
        if (window.cordova) {
          var isAndroid = ionic.Platform.isAndroid();
          var iabRef = null;
          if (isAndroid) {
            iabRef = cordova.InAppBrowser.open('http://m.ehaier.com/v2/h5/sg/common/customService.html', '_blank', 'location=no');
          } else {
            iabRef = cordova.InAppBrowser.open('http://m.ehaier.com/v2/h5/sg/common/customService.html', '_blank', 'location=no,toolbar=no');
          }
          iabRef.addEventListener('loadstop', function (event) {
            if (event.url.indexOf('downt.ntalker') > -1) {
              $timeout(function () {
                var d = "var r= document.getElementsByTagName('div');" +
                  "var newDiv  = document.createElement('span');" +
                  "newDiv.style.width = '35px';" +
                  "newDiv.style.height = '35px';" +
                  "newDiv.style.background = 'transparent';" +
                  "newDiv.style.zIndex = '999';" +
                  "r[0].appendChild(newDiv);" +
                  "newDiv.style.position = 'absolute';" +
                  "newDiv.style.top = '10px';" +
                  "newDiv.style.left = '12px';" +
                  "newDiv.style.borderRadius = '17.5px';" +
                  "newDiv.onclick = function(){window.location.href = window.location.href+'&close=true';};";
                iabRef.executeScript({
                  code: d
                }, function () { });
              }, 1000);

            }
          });

          iabRef.addEventListener('loadstart', function (event) {
            if (event.url.indexOf('close=true') > -1) {
              iabRef.close();
            }
          });

        } else {
          $scope.kfTocken = $localstorage.get('sg_login_token_secret').substring(6);
          // window.open('http://mobiletest.ehaier.com:38080/v3/h5/sg/common/customService.html?itemid='+$scope.productId);
          //  window.open('http://mobiletest.ehaier.com:38080/v3/h5/sg/common/customService.html?itemid='+$scope.productId+'&storeId='+ $scope.storeId +'&flag='+$scope.kfTocken);
          window.open('http://m.ehaier.com/v3/h5/sg/common/customService.html?itemid=' + $scope.productId + '&storeId=' + $scope.storeId + '&flag=' + $scope.kfTocken);
        }
      }
    };

    $scope.share = function () {
      if (!UserService.getUser().mid) {
        $state.go('login');
        return;
      }
      $scope.moreShow = false;
      /*********************分享标签－whiteBird start*********************/
      if (window.device && window.device.hasNewShare) {

        if (!$scope.productModel) {
          $scope.showPopup('网络连接失败，请稍后分享');
          return;
        }

        //新分享样式
        $scope.showShare = !$scope.showShare;
        /*********************分享标签－whiteBird end*********************/
      } else {

        //旧分享样式
        if (window.umeng) {
          if (!$scope.productModel) {
            $scope.showPopup('网络连接失败，请稍后分享');
            return;
          }
          var title = $scope.productModel.product.productFullName,
            content = $scope.productModel.product.productTitle || $scope.productModel.product.productFullName,
            pic = $scope.productModel.product.defaultImageUrl, //product 里只有这个img
            url = UrlService.getShareLinkHeader() + 'productDetail/' + $scope.productId + '/' + $scope.o2oType +
              '/' + $scope.fromType + '/' + $scope.productModel.storeId + '/' + $scope.productModel.storeId + '?fs';

          window.umeng.share(title, content, pic, url, 0);
        }

      }
    };

    /*********************分享标签－whiteBird start*********************/
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
    $scope.hideblackCover = function () {
      $scope.showShare = false;
    };
    $scope.shareToPlatform = function (index) {
      if (!UserService.getUser().mid) {
        $state.go('login');
        return;
      }
      var title = $scope.productModel.product.productFullName,
        content = $scope.productModel.product.productTitle || $scope.productModel.product.productFullName,
        pic = $scope.productModel.product.defaultImageUrl, //product 里只有这个img
        url = UrlService.getShareLinkHeader() + 'productDetail/' + $scope.productId + '/' + $scope.o2oType +
          '/' + $scope.fromType + '/' + $scope.userId + '/' + $scope.userId + '?fs';
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
    /*********************分享标签－whiteBird end*********************/
    $scope.closeRule = function () {
      $scope.isShowService = false;
    };
    $scope.openRule = function () {
      $scope.isShowService = true;
      ProductDetailService.getServicePromise($scope.serId).success(function(res){
        if(res.success){
          $scope.serviceDetail = res.data;
        }
      })
    };
    //3D体验
    $scope.open3d = function () {
      var DINGZHI_ZHONGCHUANGHUI = $scope.productModel.product.vrUrl;
      if (window.cordova) {
        if ($rootScope.isIOS) {
          window.emc.presentH5View(DINGZHI_ZHONGCHUANGHUI, "3D体验");
        } else {
          $state.go('c', { vrUrl: $scope.productModel.product.vrUrl });
        }

      } else {
        window.open(DINGZHI_ZHONGCHUANGHUI);
      }
    };
    //预约商品
    $scope.nowOrder = function () {
      HomePageService.isWdHost()
        .success(function (res) {
          $rootScope.isWdHost = res.data.isHost;
          if ($rootScope.isWdHost == -1) { //如果没有登录 跳转到登录页面
            $state.go('login');
          } else {
            ProductDetailService.checkRes($scope.acReserveId, $scope.productId)
              .success(function (response) {
                if (response.success == false) {
                  PopupService.showToast(response.message);
                } else {
                  var myPopupCui = $ionicPopup.show({
                    template: '<div style="text-align: center;color: black;font-size: 16px;border-bottom:1px solid #f2f2f2;height:30px;lineHeight:30px;margin-bottom:8px;">预约信息确认</div>' +
                      '<div style="text-align: left;color: black;font-size: 12px"><span>手机号：</span><input type="tel" ng-model="user.mobile" style="display: inline;width: 70%;border: solid 1px #ddd;"/></div>' +
                      '<div style="text-align: left;color: black;font-size: 12px"><span>验证码：</span><input type="text" ng-model="user.message" style="display: inline;width: 35%;border: solid 1px #ddd;"/><span style="margin-left:8px;padding:4px;background:#d6d7d9" ng-click="getSms()" ng-style="VCodeStyle">{{VCodeTips}}</span></div>' +
                      '<div style="text-align: left;color: #666666;font-size: 12px"><p>温馨提示:</p><p>1.我们会向此手机号发送抢购信息通知,请认真填写;</p><p>2.提交后信息不可修改</p><p>3.预约成功不代表购买成功</p></div>',
                    scope: $scope,
                    buttons: [{
                      text: '取消'
                    },
                    {
                      text: '<b>确定</b>',
                      type: 'button-positive',
                      onTap: function (e) {
                        e.preventDefault();
                        if (!($scope.globalConstant.mobileNumberRegExp.test($scope.user.mobile))) {
                          PopupService.showToast('请输入正确的手机号码！');
                          return;
                        }
                        if ($scope.user.message == undefined || $scope.user.message == '') {
                          PopupService.showToast('请输入验证码!');
                          return;
                        }
                        ProductDetailService.checkRes($scope.acReserveId, $scope.productId)
                          .success(function (response) {
                            if (response.success == false) {
                              PopupService.showToast(response.message);
                            }
                            if (response.success == true && response.data == true) {
                              ProductDetailService.sendRes($scope.acReserveId, $scope.productId, $scope.user.mobile, $scope.user.message, $scope.productModel.provinceId, $scope.productModel.cityId, $scope.productModel.regionId, $scope.productModel.streetId).success(function (response) {
                                if (response.success == false) {
                                  PopupService.showToast(response.message);
                                }
                                if (response.success == true && response.data == true) {
                                  PopupService.showToast('<div style="position:relative;"><img src="img/u93.png"/><span class="myduigou">√</span></div>' + '<p>商品预约成功</p><p>可在<b>个人中心-我的预约</b>中查看预约商品</p>');
                                  myPopupCui.close();
                                } else if (response.success == true && response.data == false) {
                                  PopupService.showToast('预约人数太多,稍后重试');
                                }
                              });
                            } else if (response.success == true && response.data == false) {
                              PopupService.showToast('预约人数太多,稍后重试');
                            }
                            $scope.user.message = '';
                          })
                      }
                    }


                    ]
                  });
                }
              })

          }
        })

    }
    /*获取验证码*/
    $scope.getSms = function () {
      if ($scope.canGetVcode) {
        if (!($scope.globalConstant.mobileNumberRegExp.test($scope.user.mobile))) {
          PopupService.showToast('请输入正确的手机号码！');
          return;
        }
        ProductDetailService.sendSms($scope.user.mobile).success(function (response) {
          if (response.success == false) {
            PopupService.showToast(response.message);
          } else {
            $scope.canGetVcode = !$scope.canGetVcode;
            var timeCount = 60;
            $scope.timersms = $interval(function () {
              if ((timeCount - 1) < 0) {
                $scope.VCodeTips = '获取验证码';
                $scope.VCodeStyle = {
                  "color": "#2979FF"
                }
                $interval.cancel($scope.timersms);
                $scope.canGetVcode = true;
              } else {
                $scope.VCodeStyle = {
                  "color": "#666666"
                }
                timeCount--;
                $scope.VCodeTips = '重发 ' + timeCount + 's';
              }
            }, 1000);
          }

        })

      }
    }
  }]);
APP.service('ProductDetailService', ['$http', 'UrlService', function ($http, UrlService) {
  //是否存在成套家电方案
  this.hasProgram = function (productId) {
    var params = {
      'channel': 1,
      'productId': productId
    };
    return $http.get(UrlService.getNewUrl('HASPROGRAM'), params);
  };
  //更改地址
  this.locationChange = function (sku, prodId, regionId, number, provinceId, cityId, pcrName, memberId, streetId) {
    var params = {
      'sku': sku,
      'prodId': prodId,
      'regionId': regionId,
      'number': number,
      'provinceId': provinceId,
      'cityId': cityId,
      'pcrName': pcrName,
      'memberId': memberId,
      'streetId': streetId
    };
    return $http.get(UrlService.getUrl('LOCATION_CHANGE'), params);
  };
  //地址
  this.getLocationList = function (parentId, regionType) {
    var params = {
      parentId: parentId,
      regionType: regionType
    };
    return $http.get(UrlService.getUrl('GET_REGION_BY_ID_TYPE'), params);
  };
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
  //载入商品数据
  // this.loadData = function (productId, storeId, o2oType, fromUrl, fromType) {
  //   var params = {
  //     'storeId': storeId,
  //     'o2oType': o2oType,
  //     'fromUrl': fromUrl,
  //     'fromType': fromType,
  //     'type':0//0 代表APP 1代表H5
  //   };
  //   return $http.get(UrlService.getUrl('PRODUCTDETAIL_LODEDATA') + productId + '.html', params);
  // };
  //载入商品数据 yl
  this.loadData = function (productId, storeId) {
    var params = {
      'storeId': storeId,
    };
    return $http.get(UrlService.getUrl('PRODUCTDETAIL_LODEDATA') + productId + '.json', params);
  };
  //添加到店铺状态修改(加号图标)
  this.changeChooseStateJia = function (productId, onShelf) {
    var params = {
      'productId': productId,
      'onShelf': onShelf
    };
    return $http.get(UrlService.getUrl('CHANGECHOOSESTATEJIA_INIT'), params);
  };
  //从店铺中移除状态修改(减号图标)
  this.changeChooseStateDui = function (productId) {
    var params = {
      'productId': productId
    };
    return $http.get(UrlService.getUrl('CHANGECHOOSESTATEDUI_INIT'), params);
  };
  //添加至购物车
  this.addToCart = function (sku, productId, number, o2oStoreName, o2omap, skku, attrValueNames, o2oStoreId, streetId) {
    if (attrValueNames.length == 0) {
      var attrValueNames = '';
      var skku = '';
    };
    var params = {
      'sku': sku,
      'productId': productId,
      'number': number,
      'o2oStoreName': o2oStoreName,
      'o2omap': o2omap,
      'skku': skku,
      'attrValueNames': attrValueNames,
      'o2oAttrId': o2oStoreId,
      'streetId': streetId, // 新增加 yl
    };
    return $http.get(UrlService.getUrl('ADDCART_INIT'), params);
    //return $http.get('http://172.16.63.104:8086/v2/h5/sg/cart/add.json', params);
  };
  //立即购买
  this.buyNow = function (orderInitParams) {
    // if(attrValueNames.length == 0){
    //   var attrValueNames = '';
    //   var skku = '';
    // }else{
    //   var attrValueNames = attrValueNames.join();
    // };
    // var params = {
    //   productIds: productIds,
    //   numbers: numbers,
    //   isBooking: isBooking,
    //   version: 1,
    //   skku:skku,
    //   attrValueNames:attrValueNames
    // };
    console.log(orderInitParams)
    //  618优化 yl
    return $http({
      method: 'POST',
      url: UrlService.getUrl('CONFIRM_ORDER'),
      data: orderInitParams,
    });
  };
  //添加收藏
  this.addShouCang = function (productId, productName, imageUrl, sku, PCGName) {
    var params = 'productId=' + productId + '&' + 'productName=' + productName + '&' + 'imageUrl=' + imageUrl + '&' + 'sku=' + sku + '&' + 'PCGName=' + PCGName;
    return $http({
      method: 'POST',
      url: UrlService.getUrl('COLLECTION_INIT'),
      data: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  };
  //取消收藏
  this.cancelShouCang = function (productId) {
    var params = 'productId=' + productId;
    return $http({
      method: 'POST',
      url: UrlService.getUrl('DELETECOLLECTION_INIT'),
      data: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  };
  //检验到货通知是否发送
  this.checkNotice = function (productId, mobile, provinceId, cityId, areaId, streetId) {
    var params = {
      productId: productId,
      mobile: mobile,
      provinceId: provinceId,
      cityId: cityId,
      areaId: areaId,
      streetId: streetId
    };
    return $http.get(UrlService.getUrl('CHECK_NOTICE'), params);
  };
  //开抢通知
  this.startNotice = function (productId, mobile) {
    var params = {
      productId: productId,
      mobile: mobile
    };
    return $http.get(UrlService.getUrl('START_NOTICE'), params);
  };
  //添加到货通知
  this.arriveNotice = function (productId, mobile, provinceId, cityId, areaId, streetId, sku, productName, provinceName, cityName, areaName, storeId) {
    var params = {
      productId: productId,
      mobile: mobile,
      provinceId: provinceId,
      cityId: cityId,
      areaId: areaId,
      streetId: streetId,
      sku: sku,
      productName: productName,
      provinceName: provinceName,
      cityName: cityName,
      areaName: areaName,
      o2oStoreId: storeId
    };
    return $http.get(UrlService.getUrl('ARRIVE_NOTICE'), params);
  };
  this.getO2OName = function (sku, provinceId, cityId, regionId, streetId) {
    var params = {
      sku: sku,
      provinceId: provinceId,
      cityId: cityId,
      regionId: regionId,
      streetId: streetId
    };
    return $http.get(UrlService.getUrl('GET_O2O_NAME'), params)
  };
  this.getMergeImage = function (productId, storeId) {
    var params = {
      productId: productId,
      storeId: storeId
    };
    return $http.get(UrlService.getUrl('GET_MERGE_IMAGE'), params);
  };
  /*返回验证码*/
  this.sendSms = function (mobile) {
    var params = {
      mobile: mobile
    };
    return $http.get(UrlService.getNewUrl('GET_SMSS'), params);
  };
  this.getShopCoupons = function (productId, brandId, cateId, price, startIndex, pageSize, o2oStoreId) {
    var params = {
      productId: productId,
      brandId: brandId,
      cateId: cateId,
      price: price,
      startIndex: startIndex,
      pageSize: pageSize,
      o2oStoreId: o2oStoreId
    };
    return $http.get(UrlService.getUrl('NEW_SHOP_COUPONS_LIST'), params);
  };
  this.getProductCouponsHas = function (sku, prodId, number, actualPrice, memberId, o2oStoreId) {
    var params = {
      'sku': sku,
      'prodId': prodId,
      'number': number,
      'finalPrice': actualPrice,//以前传的finalPrice,现在后端要求传actualPrice
      'memberId': memberId,
      'o2oStoreId': o2oStoreId
    };
    return $http.get(UrlService.getNewUrl('PRODUCT_COUPONS_HAS'), params);
  };
  /*用户提交预约*/
  this.sendRes = function (acReserveId, productId, mobile, mobileCode, provinceId, cityId, districtId, streetId) {
    var params = {
      acReserveId: acReserveId,
      productId: productId,
      mobile: mobile,
      mobileCode: mobileCode,
      provinceId: provinceId,
      cityId: cityId,
      districtId: districtId,
      streetId: streetId
    };
    return $http.get(UrlService.getNewUrl('SUB_PRESS'), params);
  };
  /*预约校验*/
  this.checkRes = function (acReserveId, productId) {
    var params = {
      acReserveId: acReserveId,
      productId: productId
    };
    return $http.get(UrlService.getNewUrl('CHECK_RES'), params);
  };
  /*评价信息*/
  this.evalute = function (productId) {
    return $http.get(UrlService.getUrl('EVALUATE_INFO') + productId + '.json');
  };
  this.checkStockForPay = function (skku, prodId, regionId, number, provinceId, cityId, pcrName, memberId, streetId, stockType, o2oStoreId, storeCode) {
    /**
     * stockType	String	是	库存类型
    productId	Integer	是	商品ID
    memberId	String	是	memberId
    number	Integer	是	购买数量
    streetId	Integer	是	街道id
    regionId	Integer	否	地区id（WA）
    o2oStoreId	String	否	店铺id（O2O）
    storeCode	String	否	店铺88码（O2O）
    'sku': skku 否 有属性切换时
     */
    /* var params = {
      'sku': skku,
      'prodId': prodId,
      'regionId': regionId,
      'number': number,
      'provinceId': provinceId,
      'cityId': cityId,
      'pcrName': pcrName,
      'memberId': memberId,
      'streetId': streetId
    }; */
    // 立即购买接口优化 库存类型判断 yl
    if (stockType == 'WA') {
      var params = {
        'stockType': stockType,
        'productId': prodId,
        'number': number,
        'memberId': memberId,
        'streetId': streetId,
        'regionId': regionId,
      };
    } else if (stockType == 'O2O') {
      var params = {
        'stockType': stockType,
        'productId': prodId,
        'number': number,
        'memberId': memberId,
        'streetId': streetId,
        'o2oStoreId': o2oStoreId,
        'storeCode': storeCode,
      };
    } else {
      var params = {
        'stockType': stockType,
        'productId': prodId,
        'number': number,
        'memberId': memberId,
        'streetId': streetId,
      };
    }
    if (skku) {
      params = $.extend(params, {
        'sku': skku,
      })
    }
    return $http.get(UrlService.getUrl('PAY_CHECK_STOCK'), params);
  };
  /*选择规格数量 GET_GETSGSTOREATTRIBUTE*/
  this.getSgStoreAttribute = function (productId, storeId, sku) {
    //测试数据productId=14785&storeId=138993668
    var params = {
      productId: productId,
      storeId: storeId,
      sku: sku,
    };
    return $http.get(UrlService.getUrl('GET_GETSGSTOREATTRIBUTE'), params);
  };

  /*选择规格数量-详情 GET_GETDETAILATTRIBUTE*/
  this.getDetailAttribute = function (productId, storeId, attrValueIds, attrIds) {
    var params = {
      productId: productId,
      storeId: storeId,
      attrValueIds: attrValueIds,
      attrIds: attrIds,
    };
    return $http.get(UrlService.getUrl('GET_GETDETAILATTRIBUTE'), params);
  };

  /*规格数量是否展示 GET_ISSHOWATTR */
  this.getIsShowAttr = function (productId, storeId) {
    var params = {
      productId: productId,
      storeId: storeId,
    };
    return $http.get(UrlService.getUrl('GET_ISSHOWATTR'), params);
  };

  /*查看购物车的数量 GET_CARTNUM */
  this.getCartNum = function () {
    return $http.get(UrlService.getUrl('GET_CARTNUM'));
  };
  // 获取硬装门店信息
  this.getHomeDecorationStoreMsg = function (storeCode,cityId) {
    var params = {
      s:storeCode,
      c:cityId
    }
    return $http.get(UrlService.getUrl('GET_STORE_MSG'),params)
  }
  //cheng nuo detail
  this.getServicePromise = function (sid) {
     var params = {
       sid:sid
     }
     return $http.get(UrlService.getUrl('GET_SERVICE_PRO'),params)
  }
}]);
