/********************************

 creator:dhc-jiangfeng
 create time:2016/3/24
 describe：ChooseShopTemplateController  选择店铺模板控制器

 ********************************/
APP.controller('ChooseShopTemplateController', ['$rootScope', '$scope', '$ionicModal', 'ChooseShopTemplateService','UserService',
  function ($rootScope, $scope, $ionicModal, ChooseShopTemplateService,UserService) {

    /***变量声明***/
    $scope.titleTemplateArray = [];  //顶部标题模板数组
    $scope.listTemplateArray = [];   //列表模板数组
    $scope.titleId = ''; //标题模板Id
    $scope.listId = '';  //列表模板Id
    $scope.previewImgIndex = '';  //模板预览图索引
    $scope.storeId = UserService.getUser().mid;//用户Id


    /***方法***/
    $scope.init = function () {
      $scope.storeId = UserService.getUser().mid;
      $scope.getTemplate($scope.storeId);
    };

    $scope.getTemplate = function (storeId) {
      ChooseShopTemplateService.getShopTemplates(storeId)
        .success(function (response, status, headers, config) {
          $scope.titleTemplateArray = response.data.titleTemplate;
          $scope.listTemplateArray = response.data.listTemplate;
          angular.forEach($scope.titleTemplateArray, function (data) {
            if (data.selected == true) {
              $scope.titleId = data.tit;
            }
          });
          angular.forEach($scope.listTemplateArray, function (data) {
            if (data.selected == true) {
              $scope.listId = data.layout;
            }
          });
        })
        .error(function (err) {
          console.log(err)
        })
    };
    $scope.setTemplate = function (templateId) {
      ChooseShopTemplateService.setShopTemplate(templateId)
        .success(function (response, status, header, config) {
          $scope.getTemplate($scope.storeId);
        })
    };
    //顶部标题模板选择方法
    $scope.chooseTitleTemplate = function (index) {
      $scope.titleId = $scope.titleTemplateArray[index].tit;
      var templateId = $scope.titleId + '-' + $scope.listId;
      $scope.setTemplate(templateId);
    };
    //商品列表模板选择方法
    $scope.chooseListTemplate = function (index) {
      $scope.listId = $scope.listTemplateArray[index].layout;
      var templateId = $scope.titleId + '-' + $scope.listId;
      var templates = {
        titleId: $scope.titleId,
        listId: $scope.listId
      };
      $scope.setTemplate(templateId);
    };


    $ionicModal.fromTemplateUrl('my-preview-modal.html', {
      scope: $scope,
      animation: 'slide-in-up',
      backdropClickToClose: true
    }).then(function (modal) {
      $scope.modal = modal;
    });
    $scope.preview = function () {
      switch ($scope.listId + $scope.titleId) {
        case 'layout-dftit-df':
          $scope.previewImgIndex = '01';
          break;
        case 'layout-dftit-bp':
          $scope.previewImgIndex = '02';
          break;
        case 'layout-dftit-colum2':
          $scope.previewImgIndex = '03';
          break;
        case 'layout-bptit-df':
          $scope.previewImgIndex = '04';
          break;
        case 'layout-bptit-bp':
          $scope.previewImgIndex = '05';
          break;
        case 'layout-bptit-colum2':
          $scope.previewImgIndex = '06';
          break;
        case 'layout-colum2tit-df':
          $scope.previewImgIndex = '07';
          break;
        case 'layout-colum2tit-bp':
          $scope.previewImgIndex = '08';
          break;
        case 'layout-colum2tit-colum2':
          $scope.previewImgIndex = '09';
          break;
      }
      $scope.modal.show();
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });


    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    })
  }]);


/**
 * creator:feng.jiang@dhc.com.cn
 * create time:16/4/12
 * describe：店铺模板服务
 **/
APP.service('ChooseShopTemplateService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getShopTemplates = function (storeId) {
    var params = {
      storeId:storeId,
      noLoading:true
    };
    return $http.get(UrlService.getUrl('GET_SHOP_TEMPLATES'), params);
  };
  this.setShopTemplate = function (templateId) {
    var params = {
      templateId: templateId,
      noLoading: true
    };
    return $http({
      method: 'POST',
      url: UrlService.getUrl('SET_SHOP_TEMPLATES'),
      params: params
    });
  }
}]);
