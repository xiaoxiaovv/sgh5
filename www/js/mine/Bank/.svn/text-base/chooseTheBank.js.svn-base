APP.controller('chooseTheBankController',['$scope','$ionicHistory','$ionicPopup','$state','$rootScope',function($scope,$ionicHistory,$ionicPopup,$state,$rootScope){
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
  }

  $scope.differentStyleHas = -1;

  $scope.differentStyle = {
    background:"#eee"
  }
  $scope.goBack = function() {
    $ionicHistory.goBack();
  };

  $scope.logoImgs=[
    {
      "img":"1CITIC",
      "code":"03020000",
      "name":"中信银行"
    },
    {
      "img":"2ABC",
      "code":"01030000",
      "name":"农业银行"
    },
    {
      "img":"3ICBC",
      "code":"01020000",
      "name":"工商银行"
    },
    {
      "img":"4CCB",
      "code":"01050000",
      "name":"建设银行"
    },
    {
      "img":"5CMB",
      "code":"03080000",
      "name":"招商银行"
    },
    {
      "img":"6SZPAB",
      "code":"03180000",
      "name":"平安银行"
    },
    {
      "img":"7BOC",
      "code":"01040000",
      "name":"中国银行"
    },
    {
      "img":"8CIB",
      "code":"03090000",
      "name":"兴业银行"
    },
    {
      "img":"9SPDB",
      "code":"03100000",
      "name":"浦发银行"
    },
    {
      "img":"10CMBC",
      "code":"03050000",
      "name":"民生银行"
    },
    {
      "img":"11HXB",
      "code":"03040000",
      "name":"华夏银行"
    },
    {
      "img":"12CEB",
      "code":"03030000",
      "name":"光大银行"
    },
    {
      "img":"13PSBC",
      "code":"01000000",
      "name":"邮储银行"
    },
    {
      "img":"14COMM",
      "code":"03010000",
      "name":"交通银行"
    },
    {
      "img":"15BCCB",
      "code":"04031000",
      "name":"北京银行"
    },
    {
      "img":"16GDB",
      "code":"03060000",
      "name":"广发银行"
    },
    {
      "img":"17EGBANK",
      "code":"03110000",
      "name":"恒丰银行"
    },
    {
      "img":"18HCCB",
      "code":"04233310",
      "name":"杭州银行"
    },
    {
      "img":"19NBCB",
      "code":"04083320",
      "name":"宁波银行"
    }
  ]

  $scope.chooseBank = function(index,chooseCode,chooseName){
    $scope.differentStyleHas = index;
    $rootScope.$broadcast('haveChooseBank',index,chooseCode,chooseName);
    $ionicHistory.goBack();
  }
}])
