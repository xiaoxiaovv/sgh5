/**
 * Created by lenovo on 2017-7-19.
 */


APP.controller('bindingBankControl', ['UrlService','InAppBrowserService','$ionicPopup','trueAuthenticationService','$ionicHistory','$timeout','$scope','$state', 'bindingBankService','$stateParams','$rootScope',function (UrlService,InAppBrowserService,$ionicPopup,trueAuthenticationService,$ionicHistory,$timeout,$scope, $state,bindingBankService,$stateParams,$rootScope) {

  // // 输入银行卡号
  // $(function() {
  //   console.log($('#keyRoom'))
  //   $('#keyRoom').on('keyup',function (e) {
  //     console.log('22222222222222')
  //     if(e.keyCode >= 48 && e.keyCode <= 57 ){
  //       //(e.which >= 48 && e.which <= 57) ||(e.which >= 96 && e.which <= 105 )
  //       //获取当前光标的位置
  //       var caret = this.selectionStart;
  //       //获取当前的value
  //       var value = this.value;
  //       //从左边沿到坐标之间的空格数
  //       var sp =  (value.slice(0, caret).match(/\s/g) || []).length;
  //       //去掉所有空格
  //       var nospace = value.replace(/\s/g, '');
  //       //重新插入空格
  //       var curVal = this.value = nospace.replace(/(\d{4})/g, "$1 ").trim();
  //       //从左边沿到原坐标之间的空格数
  //       var curSp = (curVal.slice(0, caret).match(/\s/g) || []).length;
  //       //修正光标位置
  //       this.selectionEnd = this.selectionStart = caret + curSp - sp;
  //     }else{
  //       // $scope.obj.isMyBank=this.value.replace(/[^0-9]*/g,"");
  //     }
  //   })
  // });



  /*定义变量*/
      $scope.isComplete=false;   //是否下一步
      $scope.isPrompts=false;    //协议
      $scope.isHasKey=false;     //显示清除符号
      $scope.isHasVal=false;
      $scope.isPhoneNum=false;   //输入手机号的框是否显示
      $scope.isType=false;       //选择卡类型是否显示  不能识别
      $scope.isOkType=false;       //选择卡类型是否显示  能识别
      $scope.isEffective=false;  //卡号不正确正确
     // $scope.isEffectiveOK=false;  //卡号正确
      $scope.agreement=false;    //相关协议
      $scope.isOther=false;    //手机号！弹框
      $scope.isAccord=false;    //手机号是否一致
      $scope.isReplaces=false;    //更换信息 弹框
      $scope.isInputs=false;    //更换姓名
      $scope.isIdNumber=false;    //更换身份证号
      $scope.isShows=false;    //更换信息 按钮
      $scope.isOKTel=false;    //手机号是否正确
      $scope.isTrueMsg=false;     //已认证
      $scope.isNotAuthentication=false;     //未认证
      $scope.phoneNumber='';     //手机号
      $scope.IDNumber='';     //身份证号
      $scope.userName='';     //姓名
      $scope.bankNo='';       //银行机构码
      $scope.isBankType=false;     //银行卡类型 只能是储蓄卡
      $scope.isBankNum=true;      //输入银行卡 显示
      $scope.hasChooseBankCode='';
      $scope.hasChooseBank='';
      $scope.slice=window.slice;
      $scope.selectionStart=window.selectionStart;
      $scope.selectionEnd=window.selectionEnd;
      $scope.$on('$ionicView.beforeEnter', function (event,data) {
          $rootScope.$on('haveChooseBank',function(event,index,chooseCode,chooseName){
            $scope.hasChooseBank = chooseName;
            $scope.hasChooseBankCode = chooseCode;
          });
          $scope.obj.bankNames=$scope.hasChooseBank;
        if(data.direction == 'back') return;
          $scope.isOkType=false;
          $scope.isEffective=false;
          $scope.isShows=false;
          $scope.isInputs=false;
          $scope.isIdNumber=false;
          $scope.isReplaces=false;
          $scope.isAccord=false;
          $scope.isOther=false;
          $scope.isBankType=false;
          $scope.isComplete=false;
          $scope.asyncs=false;
          $scope.isType=false;
          $scope.isOKTel=false;
          $scope.isBankNum=true;
          $scope.obj.isMyBank='';
          $scope.obj.isMyName='';
          $scope.obj.isMyIdNumber='';
          $scope.obj.phoneNumber='';
          $scope.hasChooseBank='';
          $scope.obj.bankNames='';
           $scope.init();
      });

    $scope.goBack = function() {
      $ionicHistory.goBack();
    };

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

  $scope.toRules = function(ruleId,content){
    var u = navigator.userAgent;
    if (u.indexOf('iPhone') != -1) {
      var ref = InAppBrowserService.open(UrlService.getHead() + 'mstore/sg/helpDetail.html?id=' + ruleId,content);
    } else {
      $state.go('helpDetail', {'helpId': ruleId, 'content': content});
    }
  };


  // 填写信息
      $scope.obj={
        isMyName:'',      //姓名
        isMyIdNumber:'',  //身份证号
        isMyBank:'',       //银行卡号
        phoneNumber:'',     //手机号
        bankNames:'',       //选择类型
        agreement: false
      };


      // 初始化
      $scope.init=function () {
        trueAuthenticationService.doInit()
          .success(function (response) {
            if(response.success){
              $scope.isNotAuthentication=response.data.isAuth; //认证状态
              if($scope.isNotAuthentication){ // 实名认证过 特殊处理
                $scope.isTrueMsg=false;
                if(!$scope.isInputs){
                  bindingBankService.getUsOrId()  // 获取姓名和身份id
                    .success(function (response) {
                      if(response.success){ // 未绑定银行卡
                        $scope.IDNumber= response.data.identityNo.replace(/(\d{6})(\d+)(\d{2})/,function(x,y,z,p){
                            var i="";
                            while(i.length<z.length){i+="*"}
                            return y+i+p
                        });  // 身份证号
                        // $scope.IDNumber= '132232889409877890'.replace(/(\d{6})\d{9}(\d{3})/, '$1*********$2');  // 身份证号
                        $scope.userName= response.data.realName.replace(/.{1}/,"*");  // 姓名
                        // 校验信息 不做处理
                        $scope.name=response.data.realName;
                        $scope.ids= response.data.identityNo;
                        // $scope.ids= '142637188372637382';
                      }else{
                        $scope.message=response.message;

                        $scope.isAccord=true;
                      }
                    });
                }
              }else{ //未认证
                $scope.isTrueMsg=true;

              }
            }else{
              $scope.message=response.message;
              $scope.isRetry=true;
            }
          });



      };

      $scope.goTrueAutThentication=function () {
        $scope.isTrueMsg=false;
        $state.go('trueAuthentication',{type:5});
      };
      $scope.isNoTrue=function () {
        $ionicHistory.goBack();
        $scope.isTrueMsg=false;
      };
       //协议
      $scope.isAgreement=function () {
        $scope.obj.agreement=!$scope.obj.agreement;
      };

      // 认证未通过按钮
      $scope.retry=function () {
        $scope.isOther=false;
      };
      //清除所有输入
      $scope.isClear=function () {
        $scope.obj.isMyBank='';
        $scope.hasChooseBankCode='';
        $scope.hasChooseBank='';
        $scope.obj.phoneNumber='';
        $scope.isPhoneNum=false;
      };
      $scope.isClearVal=function () {
        $scope.obj.phoneNumber='';
      };
      //点击 手机右侧 ！
      $scope.isMoreInfo=function () {
        $scope.isOther=true;
      };
      //点击 手机验证 确定按钮
      $scope.phoneClose=function () {
        $scope.isAccord=false;

      };
      //点击更换信息
     $scope.isRepl=function () {
       $scope.isReplaces=true;


     };
    // 点击更换信息中的 确定按钮
    $scope.replaceInfoOk=function () {
      $scope.isInputs=true; //输入姓名显示
      $scope.isIdNumber=true;//输入身份证号
      $scope.isReplaces=false; //弹框 取消
      $scope.isType=false;     //选择类型
      $scope.isOkType=false;   //银行卡类型
      $scope.isOKTel=false;
      $scope.isShows=true;   //更换信息按钮 不显示
      $scope.obj.isMyBank=''; //清空银行卡
      $scope.obj.phoneNumber='';//清空手机号
      $scope.hasChooseBankCode='';
      $scope.hasChooseBank='';
      $scope.isPhoneNum=false; //手机号输入隐藏
      $scope.isBankNum=false;
    };
    //点击更换信息中的 取消按钮
    $scope.replaceInfoClose=function () {
      $scope.isReplaces=false; //弹框关闭
      $scope.isInputs=false;   //姓名输入框 不显示
      $scope.isIdNumber=false; //身份输入框 不显示
      $scope.isBankNum=true;
    };
    //手机号监听
    $scope.mobileFun=function () {
      if(!($rootScope.globalConstant.mobileNumberRegExp.test($scope.obj.phoneNumber))){
        $scope.isComplete=false;
        if($scope.obj.phoneNumber.length>=11){
          $scope.isOKTel=true;
        }else{
          $scope.isOKTel=false;
        }
      }
      else{
        $scope.isOKTel=false;
        if(!$scope.obj.agreement && $scope.userName!='' && $scope.IDNumber!=''){
          $scope.isComplete=true;
        }else{
          $scope.isComplete=false;
        }
      }
    };
    //监听函数
     $scope.logicFn=function () {

       if($scope.obj.isMyBank.length==9){
         $scope.bankCodes=$scope.obj.isMyBank.replace(/\s*/g,"")  // 去掉空格
         bindingBankService.getBankName($scope.bankCodes)
           .success(function (response) {
             if(response.data.bankNames==null){  //不能识别
               $scope.isOkType=false;
               $scope.isType=true;
               $scope.bankNo= $scope.hasChooseBankCode;
               $scope.obj.bankNames=$scope.hasChooseBank;
               $scope.bankPhone='';
             }else{ // 能自动识别
               if(response.data.bankNames.cardTypeCode==1 ){  //只能是储蓄卡
                 $scope.bankPhone=response.data.bankPhone; //银行客服
                 $scope.bankNo=response.data.bankNames.bankNo; //机构码
                 $scope.isOkType=true;
                 $scope.isType=false;
                 $scope.isBankType=false;
                 $scope.obj.bankNames=response.data.bankNames.bankName;

               }else{
                 $scope.isPhoneNum=false;
                 $scope.isBankType=true;
                 $scope.isComplete=false;
               }
             }
           })
       }
       else if($scope.obj.isMyBank.length<9){
         $scope.isOkType=false;
         $scope.isType=false;
       }
      //卡号格式验证正确 让输入手机号显示
        if($scope.isOkType && ($scope.obj.isMyBank.length==23  || $scope.obj.isMyBank.length==19) ){
          $scope.isEffective=false;  //都不显示
          $scope.isEffectiveOK=false; //都不显示
          $scope.isPhoneNum=true;
          // 验证手机号
          $scope.mobileFun();
        }
        else{
          $scope.isComplete=false; //下一步
          $scope.isOKTel=false; //显示手机号正确与否
          if($scope.isOkType){
            $scope.isPhoneNum=false;
          }
          if($scope.isType){
            $scope.mobileFun();
          }

        }

    };



  $scope.async=function () {
    if($scope.obj.isMyName!='' && $scope.obj.isMyIdNumber.length<19){
      trueAuthenticationService.getUsNameOrId($scope.obj.isMyName,$scope.obj.isMyIdNumber) //异步校验
        .success(function (response) {
          if(response.data){
            $scope.isBankNum=true;
            $scope.info=response.message;
            $scope.isEffective=true;
          }else{
            $scope.info=response.message;
            $scope.isEffective=true;
            $scope.isBankNum=false;
          }
        });
    }
  };


  // 监听
  var watch=$scope.$watch('obj',function () {
    if($scope.obj.bankNames!='' && ($scope.obj.isMyBank.length==23  || $scope.obj.isMyBank.length==19)){
      $scope.isPhoneNum=true;
    }else{
      $scope.isPhoneNum=false;
    }
    if($scope.isShows){ // 更换信息 姓名 身份证号 验证

      if(!(/^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,15}$/.test($scope.obj.isMyName)) || !(/(^\d{18}$)|(^\d{17}(\d|X|x)$)/).test($scope.obj.isMyIdNumber)){ // (^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)
        $scope.isComplete=false;
      //  $scope.isEffectiveOK=false;
        $scope.isEffective=false;
        $scope.asyncs=false;
        $scope.isBankNum=false;
      }else{

        if(!$scope.asyncs){
          trueAuthenticationService.getUsNameOrId($scope.obj.isMyName,$scope.obj.isMyIdNumber) //异步校验
            .success(function (response) {
              $scope.asyncs = true;
              if(response.data){
                $scope.info=response.message;
                $scope.isEffective=true;
                $scope.isBankNum=true;
              }else{
                $scope.info=response.message;
                $scope.isEffective=true;
                $scope.isBankNum=false;
              }
            });
        }else{
          console.log('是'+$scope.asyncs);
        }

        $scope.logicFn();

      }
    }
    else{
      /*//卡号格式验证正确 让输入手机号显示
      if($scope.obj.isMyBank.length==23){
        //  $scope.obj.isMyBank=$scope.obj.isMyBank.replace(/[^0-9|\s]*!/g,"") // 去除空格
        //能识别银行卡 判断是什么银行的 能识别的$scope.isOkType=true;显示，不能识别的$scope.isType=true;他显示
        $scope.isPhoneNum=true;  //手机号显示
        // 验证手机号
        if(!(/^1[3|4|5|7|8][0-9]{9}$/.test($scope.obj.phoneNumber))){
          $scope.isComplete=false;
          console.log('走if')
        }
        else{

          if(!$scope.obj.agreement){
            $scope.isComplete=true;
          }else{
            $scope.isComplete=false;
          }

        }
        //$scope.isComplete=true; // 下一步显示 判断手机号是不是争取在显示
      }else{
        $scope.isComplete=false; //下一步
        $scope.isPhoneNum=false; //手机号
        $scope.isOkType=false;   //能识别银行卡
        $scope.isType=false;   //不能识别银行卡
      }*/

      $scope.logicFn();
    }

    //显示清除
    if($scope.obj.isMyBank!=''){
      $scope.isHasKey=true;
    }else{
      $scope.isHasKey=false;
    }
    //手机号 显示清除
    if($scope.obj.phoneNumber!=''){
      $scope.isHasVal=true;
    }else{
      $scope.isHasVal=false;
    }

  },true);

   // $scope.keyFun=function (e) {
   //   if(e.keyCode >= 48 && e.keyCode <= 57 ){
   //     //(e.which >= 48 && e.which <= 57) ||(e.which >= 96 && e.which <= 105 )
   //     //获取当前光标的位置
   //     var caret = $scope.selectionStart;
   //     //获取当前的value
   //     var value = $scope.obj.isMyBank;
   //     //从左边沿到坐标之间的空格数
   //     var sp =  (value.slice(0, caret).match(/\s/g) || []).length;
   //     //去掉所有空格
   //     var nospace = value.replace(/\s/g, '');
   //     //重新插入空格
   //     var curVal = $scope.obj.isMyBank = nospace.replace(/(\d{4})/g, "$1 ").trim();
   //     //从左边沿到原坐标之间的空格数
   //     var curSp = (curVal.slice(0, caret).match(/\s/g) || []).length;
   //     //修正光标位置
   //     $scope.selectionEnd = $scope.selectionStart = caret + curSp - sp;
   //   }else{
   //     // $scope.obj.isMyBank=this.value.replace(/[^0-9]*/g,"");
   //   }
   // };
  $scope.join=window.join;
  $scope.keyFun=function(ev)
  {
    var oT=document.getElementById('keyRoom');
      var oW=oT.value;
      var oEvent=ev||event;
      if(oEvent.keyCode==8)
      {
        if(oW)
        {
          for(var i=0;i<oW.length;i++)
          {
            var newStr=oW.replace(/\s$/g,'');
          }
          oT.value=newStr;
        }
      }else{
        for(var i=0;i<oW.length;i++)
        {
          var arr=oW.split('');
          if((i+1)%5==0)
          {
            arr.splice(i,0,' ');
          }
        }
        oT.value=arr.join('');
      }
  }


 // $scope.init();
  $scope.commonFun=function (name,idNumber,bankCode,mobile) {

    bindingBankService.bankCheck(name,idNumber,bankCode,mobile)
      .success(function (response) {
       if(response.success){ // 验证成功
          if(response.data.isThrough) { // 验证成功
          $scope.isAccord = false;
          console.log(response)
          bindingBankService.VerificationCode(mobile)
            .success(function (response) {
              $scope.message = response.message;
              if (response.success) { //成功发送验证码
                $state.go('verificationCode', {
                  ownerName: name,
                  identityNo: idNumber,
                  cardNo: bankCode,
                  mobile: mobile,
                  bankNo: $scope.bankNo,
                  phoneNumber: $scope.bankPhone
                });
                $scope.isAccord = false;
               // watch();
              }
              else {
                $scope.isAccord = true;
              }
            });
        }
        }
        else{
         $scope.message=response.message;
          $scope.isAccord=true;
        }
      });
  }


  //点击下一步
  $scope.goAuthentication=function (name,idNumber,bankCode,mobile,bankNo,phoneNumber) {
    console.log(name)
    console.log(idNumber)
    console.log(bankCode)
    console.log(mobile)
    console.log(bankNo)
    $scope.bankCodes=$scope.obj.isMyBank.replace(/\s*/g,"");
    $scope.obj.phoneNumber=$scope.obj.phoneNumber.replace(/\s*/g,"");
    if($scope.isShows){ // 更换信息
      $scope.commonFun($scope.obj.isMyName,$scope.obj.isMyIdNumber,$scope.bankCodes,$scope.obj.phoneNumber);

      }else{ // 使用本人信息
      $scope.commonFun($scope.name,$scope.ids,$scope.bankCodes,$scope.obj.phoneNumber);
    }
   /* $state.go('verificationCode',{
      ownerName:name,
      identityNo:idNumber,
      cardNo:bankCode,
      mobile:mobile,
      bankNo:$scope.bankNo,
      phoneNumber:phoneNumber
    });
    bindingBankService.VerificationCode($scope.obj.phoneNumber)
      .success(function (response) {
         console.log(response)
         $scope.message=response.message;
          if(response.success){ //成功发送验证码

          }else{
            $scope.isAccord=true;
          }
      });;*/

  }


}]);


APP.service('bindingBankService', ['$http', 'UrlService', function ($http, UrlService) {
      this.doInit = function (username, password) { // 初始化
        var params = {
          userName: username,
          password: password
        };
        return $http.get(UrlService.getUrl('HOME_INIT'), params);
      };
      this.getBankName = function (num) { // 自动识别
        var params = {
          cardNo:num
        };
        return $http.get(UrlService.getUrl('GET_BANKNAME'), params);
      };
      this.getUsOrId = function () { // 获取姓名和身份id
        return $http.get(UrlService.getUrl('GET_USORID'));
      };
      this.bankCheck = function (username,IdNumber,num,phoneNum) { // 银行卡校验
        var params = {
          ownerName: username,
          identityNo: IdNumber,
          cardNo: num,
          mobile: phoneNum
        };
        return $http({
          method: 'POST',
          url: UrlService.getUrl('POST_CHECKS'),
          params: params
        });
       // return $http.post(UrlService.getUrl('POST_CHECKS'), params);
        // return $http.post(UrlService.getUrl('POST_CHECKS')+'?ownerName='+params.ownerName+'&identityNo='+params.identityNo+'&cardNo='+params.cardNo+'&mobile='+params.mobile);

      };
      this.VerificationCode = function (num) { // 获取验证码
        var params = {
          mobile:num
        };
        return $http.get(UrlService.getUrl('GET_CODEID'), params);
      };

}]);
