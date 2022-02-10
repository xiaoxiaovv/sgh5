/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016/3/16
 * describe：订单详情控制器
 **/
APP.controller('FeedbackController', ['$scope', '$ionicActionSheet', 'FeedbackService', 'PopupService', '$timeout',
  function ($scope, $ionicActionSheet, FeedbackService, PopupService, $timeout) {

    /** 变量声明 **/
      //提交问题反馈所需信息
    $scope.userInfo = {
      type: 6,
      content: '',
      contact: ''
    };
    /** 方法 **/
    $scope.init = function () {
      $scope.feedbackType = '请选择';
    };
    //打开类型选择
    $scope.openSelect = function () {
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          {text: '功能意见'},
          {text: '界面意见'},
          {text: '您的新需求'},
          {text: '操作意见'},
          {text: '流量问题'},
          {text: '其他'}
        ],
        titleText: '请选择',
        buttonClicked: function (index) {
          switch (index) {
            case 0:
              $scope.feedbackType = '功能意见';
              break;
            case 1:
              $scope.feedbackType = '界面意见';
              break;
            case 2:
              $scope.feedbackType = '您的新需求';
              break;
            case 3:
              $scope.feedbackType = '操作意见';
              break;
            case 4:
              $scope.feedbackType = '流量问题';
              break;
            case 5:
              $scope.feedbackType = '其他';
              break;
            default:
              break;
          }
          hideSheet();
          $scope.userInfo.type = index;
          return true;
        }
      });
      // For example's sake, hide the sheet after two seconds
      $timeout(function () {
        hideSheet();
      }, 10000);
    };

    //提交问题反馈
    $scope.submitFeedback = function () {
      if ($scope.userInfo.type == 6) {
        PopupService.showToast('请选择反馈类型！');
      } else if ($scope.userInfo.content.length == 0) {
        PopupService.showToast('请输入反馈内容！');
      } else if (!($scope.globalConstant.mobileNumberRegExp.test($scope.userInfo.contact))) {
        PopupService.showToast( '请输入正确的联系方式！');
      } else {
        FeedbackService.setFeedback($scope.userInfo.type, $scope.userInfo.content, $scope.userInfo.contact)
          .success(function (response, status, headers, config) {
            if(response.success){
              PopupService.showToast('提交成功');
            }else{
              PopupService.showToast(response.message);
            }
          });
      }
    };

    $scope.$on('$ionicView.beforeEnter', function () {
      $scope.init();
    })
  }]);


/**
 * creater:shuang2.wang@dhc.com.cn
 * create time:2016-03-21
 * describe：问题反馈Service
 **/
APP.service('FeedbackService', ['$http', 'UrlService', function ($http, UrlService) {
  this.setFeedback = function (type, content, contact) {
    var params = {
      type: type,
      content: content,
      contact: contact
    };
    return $http.get(UrlService.getUrl('FEEDBACK'), params);
  };
}]);
