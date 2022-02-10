/**
 * creator:feng.jiang@dhc.com.cn
 * create time:2016/3/14
 * describe：MicroSchoolController 微学堂控制器
 **/
APP.controller('MicroSchoolController', ['$scope', 'MicroSchoolService','HomePageService', function ($scope, MicroSchoolService,HomePageService) {

  /** 变量声明 **/
  $scope.microSchoolInfo = [];//微学堂数据
  $scope.flagNum = false;
  $scope.messageImgUrl = "http://cdn09.ehaier.com/shunguang/H5/www/img/message_gray@2x.png";
  /** 方法 **/
  $scope.init = function () {
    $scope.tabChange(0,8);
    HomePageService.getUnReadMsg()
      .success(function (res) {
        if (res.data > 0) {
          $scope.flagNum = true;
        } else {
          $scope.flagNum = false;
        }
      })
  };
  //微学堂切换
  $scope.tabChange=function(index,id){
    var buttons = document.getElementsByClassName('sg-ws-button');
    for(var i= 0,len=buttons.length;i<len;i++){
      if(i == index){
        buttons[i].style.color = '#32BEFF';
        buttons[i].style.borderBottom = '2px solid #32BEFF';
      }else{
        buttons[i].style.color = 'black';
        buttons[i].style.borderBottom = 'none';
      }
    }
    $scope.loadData(id);
  };
  $scope.loadData=function(id){
    MicroSchoolService.getMicroSchoolInfo(id)
      .success(function (response, status, headers, config) {
        $scope.microSchoolInfo=response.data;
        console.log($scope.microSchoolInfo);
      })
      .error(function (err) {
        console.log(err);
      })
  };
  $scope.$on('$ionicView.beforeEnter', function (e,v) {
    if(v.direction == 'back'){
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
    $scope.init();
  })
}]);


/**
 * creator:feng.jiang@dhc.com.cn
 * create time:16/3/24
 * describe：微学堂服务
 **/
APP.service('MicroSchoolService', ['$http', 'UrlService', function ($http, UrlService) {
  this.getMicroSchoolInfo = function (childId) {
    var params = {
      childId: childId
    };
    return $http.get(UrlService.getUrl('MICRO_SCHOOL'), params);
  };
  this.getMicroSchoolDetail = function (childId,id) {
    var params = {
      childId: childId,
      id:id
    };
    return $http.get(UrlService.getUrl(''), params);
  };
}]);
