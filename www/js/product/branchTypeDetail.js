/**
 * Created by lizhi@camelotchina.com on 2017/7/22.
 *
 *
 */
APP.controller('BranchTypeDetailController', ['HomePageService','$ionicHistory', '$scope', 'BranchTypeDetailService', '$ionicPopup', '$timeout',
    '$ionicActionSheet', 'UserService', 'MyStoreService', 'CommonAddressService', '$stateParams', '$localstorage', '$rootScope',
    'PopupService', 'LoginService', '$ionicScrollDelegate', '$ionicModal', 'GoodsService',
    function(HomePageService,$ionicHistory, $scope, BranchTypeDetailService, $ionicPopup, $timeout, $ionicActionSheet, UserService, MyStoreService,
        CommonAddressService, $stateParams, $localstorage, $rootScope, PopupService, LoginService, $ionicScrollDelegate, $ionicModal, GoodsService) {
        $scope.attributeId = ''; //属性id
        $scope.brandId = ''; //品牌id
        $scope.productCateId = ''; //类目id
        $scope.productCateIdType = '0'; //类型默认0【类目0 ， 品牌1 ， 属性2】
        $scope.filterData = ''; //筛选条件 默认销量
        $scope.filterParams = ''; //请求接口筛选条件参数
        $scope.qs = ''; //新添加排序字段  price priceDesc commission commissionDesc saleDesc


        $scope.switch = true; //筛选接口查询开关，防止多次请求筛选；
        $scope.isListNull = false; //判断列表是否为空
        $scope.gsPlaceholder = ""; //关键词
        $scope.storeId = ''; //用户id

        //关键词
        BranchTypeDetailService.defaultSearch().success(function(response) {
            $scope.gsPlaceholder = response.data.hot_word;
        });

        //获取从页面跳转传过来的参数 productCateId-类目    brandId-品牌   attribute↵Id=12&productCateId=2723-属性
        if ($stateParams.productCateId.indexOf('brandId') != -1) {
            //品牌
            $scope.chooseIndex = '2'; //筛选选中
            $scope.filter_index = 1; //筛选数组下标
            var arr = $stateParams.productCateId.split('&');
            $scope.brandId = arr[0].split('=')[1]; //通过url传过来的参数三种情况；
            $scope.productCateIdType = '1';
            $scope.filterData = 'hasStock@' + $scope.brandId + '@0'; //筛选条件 默认销量
            $scope.productCateId = arr[1].split('=')[1];
            $scope.qs = "isHotDesc";

        } else if ($stateParams.productCateId.indexOf('&productCateId') != -1) {
            //属性
            $scope.chooseIndex = '2'; //筛选选中
            $scope.filter_index = 1; //筛选数组下标
            var arr = $stateParams.productCateId.split('&');
            $scope.productCateId = arr[1].split('=')[1]; //通过url传过来的参数三种情况；
            $scope.attributeId = arr[0].split('=')[1]; //通过url传过来的参数三种情况
            $scope.productCateIdType = '2';
            $scope.filterData = 'hasStock@all@0@' + $scope.attributeId; //筛选条件 默认销量
            $scope.qs = "isHotDesc";
        } else {
            //类目
            $scope.chooseIndex = '0'; //筛选选中
            $scope.filter_index = 0; //筛选数组下标
            $scope.productCateId = $stateParams.productCateId.split('=')[1]; //通过url传过来的参数三种情况；
            $scope.productCateIdType = '0';
            // $scope.filterData = "isHotDesc";
            $scope.qs = "isHotDesc";
        };
        $scope.goBack = ionic.Utils.debounce(function () {
          $ionicHistory.goBack();
        },300);
        $scope.contentDataList = []; //内容区域列表数据
        $scope.contentDataListxyz = [];
        $scope.pholder = "1";
        $scope.provinceId = '16'; //省分Id  山东
        $scope.cityId = '173'; //市Id   青岛
        $scope.districtId = '2450'; //区Id   崂山
        $scope.streetId = '12036596'; //街道Id  中韩街道
        $scope.pageIndex = '1'; //分页默认第一页
        $scope.pageSize = '5'; //每页显示几条数据
        //获取地理
        // BranchTypeDetailService.getAddress().success(function(res) {
        //     if (res.data != null) {
        //         var obj = eval(res.data);
        //         $scope.provinceId = obj[0].provinceId;
        //         $scope.cityId = obj[0].cityId;
        //         $scope.streetId = obj[0].streetId;
        //         $scope.districtId = obj[0].areaId;
        //     }
        //     //获取完地理位置在获取列表数据
        //     $scope.getListInit();
        // });

        $scope.memberId = UserService.getUser().mid; //用户id

        $scope.noLoading = 'false';
        // $scope.chooseIndex = '0'; //默认综合
        $scope.lstAttributes = []; //筛选属性列表；
        $scope.hasmore = false; //上拉加载时能标志
        $scope.settingsList = ''; //是否显示佣金本地存储
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
        if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
            $scope.isIosApp = true;
        } else {
            $scope.isIosApp = false;
        }
        $scope.locationImgUrl = $rootScope.imgBaseURL+"img/location_gray@2x.png"; //返回按钮图标
        $scope.locationImgUrltransform90 = {
            "transform": "rotate(90deg)"
        }
        $scope.changeColor = {
                'font-size': '17px'
            }
            // daba STARTA
        $scope.comprehensive = [$rootScope.imgBaseURL+'img/comprehensive_black.png', $rootScope.imgBaseURL+'img/comprehensive_white.png']; //综合 箭头数组
        $scope.comprehensive_index = 1; //综合箭头数组下标
        $scope.arrowState = [$rootScope.imgBaseURL+'img/arrow_state_0.png', $rootScope.imgBaseURL+'img/arrow_state_1.png', $rootScope.imgBaseURL+'img/arrow_state_2.png']; //佣金和价格 箭头数组
        $scope.commission_index = 0; //佣金 箭头数组 下标
        $scope.price_index = 0; //价格 箭头数组 下标
        $scope.filterState = [$rootScope.imgBaseURL+'img/filter_state_0.png', $rootScope.imgBaseURL+'img/filter_state_1.png']; //筛选 图片数组
        //$scope.filter_index = 0; //筛选数组下标
        var tabState = ['isHotDesc', ['commission', 'commissionDesc'], '', 'saleDesc', ['price', 'priceDesc']]; //筛选 接口需要传递的参数 数组
        $scope.comprehensiveSub = ['人气优先']; //综合 子选项数组
        $scope.selectComprehensiveSubIndex = 0; //综合 子选项数组 默认下标
        //daba END
        //变量定义
        $scope.isShowUp = false;
        $scope.isIos = false;
        $scope.screenWidth = window.screen.width;

        $scope.isBuyer = LoginService.getRole(); //判断用户角色信息；0为买家；1为卖家
        $scope.userId = UserService.getUser().mid; //用户Id
        var memberId = ''; //用户Id
        // var provinceId = 16, //省分Id  山东
        //     cityId = 173, //市Id   青岛
        //     districtId = 2450, //区Id   崂山
        //     streetId = 12036596; //街道Id  中韩街道
        //$scope.storeId = $localstorage.get('storeId', $rootScope.globalConstant.storeId); //获取店铺Id，传递到详情页
        /******************筛选功能相关变量定义start****************/
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
        

        /******************筛选功能相关变量定义end****************/
        var u = navigator.userAgent;

        if (u.indexOf('iPhone') != -1) {
            $scope.isIos = true;
        } else {
            $scope.isIos = false;
        }

        if ($scope.screenWidth < 375) {
            $scope.searchInputStyle = {
                position: 'absolute',
                top: '7px',
                right: '55px',
                width: '48%'
            };
        } else if ($scope.screenWidth < 414) {
            $scope.searchInputStyle = {
                position: 'absolute',
                top: '7px',
                right: '55px',
                width: '55%'
            };
        } else {
            $scope.searchInputStyle = {
                position: 'absolute',
                top: '7px',
                right: '55px',
                width: '58%'
            };
        }
        $scope.searchTopRight = {
            position: 'absolute',
            right: '10px',
            top: '5px'
        };

        if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) { //只有ios app 特有的样式
            $scope.searchInputStyle = {
                position: 'absolute',
                top: '24px',
                right: '13%',
                width: '58%'
            };
            $scope.searchTopRight = {
                position: 'absolute',
                right: '-1%',
                top: '24px'

            };
        }
        // xyz添加数组去重方法
        function unique(array) {
            var n = []; //临时数组
            for (var i = 0; i < array.length; i++) {
                if (n.indexOf(array[i]) == -1) n.push(array[i]);
            }
            return n;
        }


        $scope.changePadding = function() {
            if (Focus.value.length > 0) {
                $scope.inputPadding = {
                    "padding-right": "30px"
                }
            } else {
                $scope.inputPadding = {
                    "padding-right": "0px"
                }
            }
        };
        $scope.clearLocal = function() {
            localStorage.removeItem("historys");
            $scope.hShow = false;
            $scope.hShowB = true;
        };


        $scope.$on('$ionicView.beforeEnter', function(e, v) {
            GetSwitchChecked(); //是否显示佣金数据
            //$ionicScrollDelegate.scrollTop();
            $scope.isBuyer = LoginService.getRole(); //判断用户角色信息；0为买家；1为卖家
          HomePageService.isWdHost()
            .success(function (res) {
              console.log(res);
              $rootScope.isWdHost = res.data.isHost;
            })
            if (ionic.Platform.platform().indexOf('ios') != -1 && window.cordova) {
                $scope.topStyle = {
                    "top": "64px"
                };
            } else {
                $scope.topStyle = {
                    "top": "44px"
                };
            }
            //筛选 排序 tab显示的开关
            $scope.showTab = false;
            $scope.filterParams = '';
            $scope.lianXC = false;
            //$scope.storeId = $localstorage.get('storeId', $rootScope.globalConstant.storeId);
            $scope.userId = UserService.getUser().mid; //用户Id
            if (v.direction == 'back') {
                //xyz修改
                $scope.hShow = false;
                $scope.hotWordShow = false;
                $scope.hShowB = false;
            } else {
                var lll = localStorage.getItem("historys");
                if (lll) {
                    $scope.hShow = true;
                    $scope.hShowB = false;
                } else {
                    $scope.hShow = false;
                    $scope.hShowB = true;
                }
                $scope.tabNav = 'selection'; //tableBar选中选品
                $scope.hasmore = false; //上拉加载时能标志
                $scope.typeChoose = '商品'; //搜索分类初始选项
                $scope.page = 2; //上拉加载起始页

                //获取用户信息
                if ($stateParams.shareStoreId) {
                    memberId = $stateParams.shareStoreId;
                } else {
                    memberId = UserService.getUser().mid;
                }
                $scope.searchGoodsName = {
                    name: ''
                };

                //获取地理
                BranchTypeDetailService.getAddress().success(function(res) {
                    if (res.data != null) {
                        var obj = eval(res.data);
                        $scope.provinceId = obj[0].provinceId;
                        $scope.cityId = obj[0].cityId;
                        $scope.streetId = obj[0].streetId;
                        $scope.districtId = obj[0].areaId;
                    }
                    $scope.pageIndex = 1;
                    //获取完地理位置在获取列表数据
                    $scope.ResGetList();
                });
            };
            if ($scope.isBuyer == 0) {
                $scope.storeId = $localstorage.get('storeId', '20219251');
            } else {
                $scope.storeId = $scope.userId;
            };
            //当list有数据
            if ($scope.contentDataList.length > 0) {
                var obj = $scope.contentDataList[0];
                //当商家登录需要刷新页面
                if (LoginService.getRole() == 1 && obj['commission'] == undefined) {
                    //获取列表数据--刷新
                    $scope.ResGetList();
                }
            }
            // //获取地理
            // BranchTypeDetailService.getAddress().success(function(res) {
            //     if (res.data != null) {
            //         var obj = eval(res.data);
            //         $scope.provinceId = obj[0].provinceId;
            //         $scope.cityId = obj[0].cityId;
            //         $scope.streetId = obj[0].streetId;
            //         $scope.districtId = obj[0].areaId;
            //     }
            // });
            $scope.hasmore = true; //加载更多
        });


        //上拉加载
        $scope.loadMore = function() {
            $scope.pageIndex = $scope.pageIndex * 1 + 1;
            $scope.getListInit();
        };

        //页面加载获取列表---刷新数据
        $scope.ResGetList = function() {
            BranchTypeDetailService.loadMoreProducts(
                $scope.pholder,
                $scope.provinceId,
                $scope.cityId,
                $scope.districtId,
                $scope.streetId,
                $scope.pageIndex,
                $scope.pageSize,
                $scope.productCateId,
                $scope.memberId,
                $scope.filterData,
                $scope.qs
            ).success(function(res) {
                if (res.success) {
                    if (res.message == "list获取商品数据为空" && $scope.pageIndex == 1) {
                        $scope.isListNull = true;
                        $scope.contentDataList = [];
                        $scope.contentDataListxyz = [];
                    } else {
                        $scope.isListNull = false;
                    }

                    if (res.data.productList) {
                        var data = res.data.productList;
                        $scope.contentDataList = data;
                        if(res.data.isCanSyncGetPrice){
                          GoodsService.asyncPrice(res.data.traceId).success(function(res){
                            if(res.success){
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
                    if ($scope.pageIndex * 5 <= res.totalCount) {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.hasmore = true;
                    } else {
                        $scope.hasmore = false;
                    }
                } else {
                    $scope.contentDataList = [];
                    $scope.contentDataListxyz = [];
                    $scope.isListNull = true;
                    var message = res.message;
                    PopupService.showToast(message);
                }
            })
        };

        //页面加载获取列表
        $scope.getListInit = function() {
            BranchTypeDetailService.loadMoreProducts(
                $scope.pholder,
                $scope.provinceId,
                $scope.cityId,
                $scope.districtId,
                $scope.streetId,
                $scope.pageIndex,
                $scope.pageSize,
                $scope.productCateId,
                $scope.memberId,
                $scope.filterData,
                $scope.qs
            ).success(function(res) {
                if (res.success) {
                    if (res.message == "list获取商品数据为空" && $scope.pageIndex == 1) {
                        $scope.isListNull = true;
                    } else {
                        $scope.isListNull = false;
                    }

                    if (res.data.productList) {
                        var data = res.data.productList;
                        $scope.contentDataList = $scope.contentDataList.concat(data);
                        if(res.data.isCanSyncGetPrice){
                          GoodsService.asyncPrice(res.data.traceId).success(function(res){
                            if(res.success){
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
                    if ($scope.pageIndex * 5 <= res.totalCount) {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $scope.hasmore = true;
                    } else {
                        $scope.hasmore = false;
                    }
                } else {
                    $scope.contentDataList = [];
                    $scope.contentDataListxyz = [];
                    $scope.isListNull = true;
                    var message = res.message;
                    PopupService.showToast(message);
                }
            })
        };


        //信息提示封装
        $scope.showPopup = function(message) {
            var myPopup = $ionicPopup.show({
                template: message
            });
            $timeout(function() {
                myPopup.close();
            }, 1000);
        };

        //点击 搜索结果筛选类别
        $scope.chooseTab = function(index) {
            $ionicScrollDelegate.scrollTop();
            //综合0  佣金1  销量3  价格4  筛选2
            if ($scope.chooseIndex == index && index == 3) {
                return;
            }
            if (index == 2) {
                $scope.filter_index = 1; //筛选数组下标
                $scope.chooseIndex = index;
                $scope.comprehensive_index = 0; //综合箭头数组下标
                $scope.commission_index = 0; //佣金 箭头数组 下标
                $scope.price_index = 0; //价格 箭头数组 下标
                $scope.filter_index = 1; //筛选数组下标
                $scope.showComprehensiveSub = false;
                $scope.openFilterModal();
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
                    $scope.filterParams = tabState[1][commission_index]; //请求接口的 参数 佣金
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
                    $scope.filterParams = 'saleDesc'; //请求接口的 参数 销量
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
                    $scope.filterParams = tabState[4][price_index]; //请求接口的 参数 价格
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
                $scope.hasmore = false;
                $scope.ResGetList(); //获取列表数据--刷新
            }
        };
        //关闭综合子选项
        $scope.closeComprehensiveSub = function() {
            $scope.showComprehensiveSub = !$scope.showComprehensiveSub;
        };
        //选择综合 子选项
        $scope.selectComprehensiveSub = function(index, $event) {
            $event.stopPropagation();
            if (index == 0) {
                $scope.filterParams = 'isHotDesc'; //请求接口的 参数 人气优先
                // $scope.filterData = 'isHotDesc' //综合
                $scope.qs = 'isHotDesc' //综合
            }
            $scope.lianXC = false;
            $scope.selectComprehensiveSubIndex = index;
            $scope.showComprehensiveSub = !$scope.showComprehensiveSub;
            $scope.chooseIndex = 0;
            $scope.productList = [];
            $scope.comprehensive_index = 1; //综合 数组下标变化 0 1
            $scope.commission_index = 0; //佣金 箭头数组 下标
            $scope.price_index = 0; //价格 箭头数组 下标
            $scope.filter_index = 0; //筛选数组下标
            $scope.pageIndex = 1;
            $scope.hasmore = false;
            $scope.contentDataList = [];
            $scope.contentDataListxyz = [];
            $scope.ResGetList(); //获取列表数据--刷新

        };
        /******************筛选功能相关方法处理start****************/
        //筛选modal
        $ionicModal.fromTemplateUrl('templates/product/branchTypeDetailModal.html', {
            scope: $scope,
            animation: 'slide-in-left',
            backdropClickToClose: false
        }).then(function(modal) {
            $scope.filterModal = modal;
        });

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
        $scope.closeModal = function() {
            $scope.filterModal.hide();
        };
        //打开筛选modal
        $scope.openFilterModal = function() {
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
        $scope.getFilterDataLists = function(params) {
            BranchTypeDetailService.getFilterData(params).success(function(response) {
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
        $scope.ResGetFilterDataLists = function(params) {
            BranchTypeDetailService.getFilterData(params).success(function(response) {
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
        $scope.$on('$destroy', function() {
            $scope.filterModal.remove();
        });
        //收起展开
        $scope.changeDown = function(item) {
            item.down = !item.down;
        };
        //全选 单选
        $scope.ClickAttributes = function(item, itemParent) {
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
        /******************筛选功能相关方法处理end****************/
        //改变搜索商品是否添加至购物车状态
        $scope.changeState = function(productId, sta, index) {
            if (sta == 1) {
                //添加
                BranchTypeDetailService.changeChooseStateJia(productId, '1')
                    .success(function(response, status, headers, config) {
                        if (response.success == true) {
                            $scope.contentDataList[index].onShelf = true;
                            $scope.showPopup('从店铺上架');
                        }
                    });
            } else {
                //删除
                BranchTypeDetailService.changeChooseStateDui(productId)
                    .success(function(response, status, headers, config) {
                        if (response.success == true) {
                            $scope.contentDataList[index].onShelf = false;
                            $scope.showPopup('从店铺下架');
                        }
                    });
            }
        };
    }
]);


APP.service('BranchTypeDetailService', ['$http', 'UrlService', function($http, UrlService) {
    //上拉加载商品 --列表数据
    this.loadMoreProducts = function(pholder, provinceId, cityId, districtId, streetId, pageIndex, pageSize, productCateId, memberId, filterData, qs) {
        if (memberId) {
            var params = {
                'pholder': pholder,
                'provinceId': provinceId,
                'cityId': cityId,
                'districtId': districtId,
                'streetId': streetId,
                'pageIndex': pageIndex,
                'pageSize': pageSize,
                'productCateId': productCateId,
                'memberId': memberId,
                'filterData': filterData,
                'qs': qs,
                'fromType': '1',
                'noLoading': true
            };
        } else {
            var params = {
                'pholder': pholder,
                'provinceId': provinceId,
                'cityId': cityId,
                'districtId': districtId,
                'streetId': streetId,
                'pageIndex': pageIndex,
                'pageSize': pageSize,
                'productCateId': productCateId,
                'filterData': filterData,
                'qs': qs,
                'fromType': '1',
                'noLoading': true,
                'memberId': ''
            };
        }
        return $http.get(UrlService.getUrl('COMMONLOADITEMNEW'), params);
    };
    //获取筛选列表
    this.getFilterData = function(productCateId) {
        var params = {
            'productCateId': productCateId
        }
        return $http.get(UrlService.getUrl('GET_FILTER_DATA'), params);
    };
    //更新 UPDATE_GOODS
    this.changeChooseStateJia = function(productId, onShelf) {
        var params = {
            'productId': productId,
            'onShelf': onShelf,
            'noLoading': true
        };
        return $http.get(UrlService.getUrl('CHANGECHOOSESTATEJIA_INIT'), params);
    };

    //删除DELETE_GOODS
    this.changeChooseStateDui = function(productId) {
        var params = {
            'productId': productId,
            'noLoading': true
        };
        return $http.get(UrlService.getUrl('CHANGECHOOSESTATEDUI_INIT'), params);
    };
    //默认词
    this.defaultSearch = function() {
            var params = {
                'platform': 3
            };
            return $http.get(UrlService.getUrl('DEFAULTSEARCH_WORDS'), params);
        }
        //获取地址信息
    this.getAddress = function() {
        return $http.get(UrlService.getUrl('GET_POSITION_FROM_COOLIE'));
    };

}]);
