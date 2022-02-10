/**
 * 版本 跟新服务根据后台配置 是否强制更新
 **/

APP.service('VersionService', ['$rootScope', '$ionicPopup', '$timeout', '$ionicLoading', 'UrlService','$http',
  function ($rootScope, $ionicPopup, $timeout, $ionicLoading, UrlService,$http) {

   var isIOS =  window.cordova && (ionic.Platform.platform().indexOf('ios') != -1);

    this.checkVersion = function(){
      return;

      var param ={
        type:isIOS?1:0
      };
      if(!window.cordova){//只有app 检查版本更新
        return ;
      }

  //addTime
  //    :
  //    1471080113000
  //    appVersion:
  //        "1.0.0.3"
  //    forceUpdate
  //        :
  //        false
  //    id
  //        :
  //        2
  //    osType
  //        :
  //        0
  //    versionContent
  //        :
  //        "ddddddd"
      $http.get(UrlService.getUrl('APP_VERSION'),param).success(function(response){

        if(response.success){
          if(!response.data){
            console.log('version get null');
            return;
          }
          if(response.data.forceUpdate){//todo  强制更新 ,需要判断版本号
            var needUpdate = false;
            if(isIOS ){
              if( $rootScope.globalConstant.versionIOS != response.data.appVersion) {
                console.log('ios' + 'version-server---' + response.data.appVersion);
                needUpdate = true;
              }
            }else{

             if($rootScope.globalConstant.versionANDROID != response.data.appVersion){
                console.log('android'+'version-server---'+response.data.appVersion);
                needUpdate = true;
             }

            }
            if(needUpdate){
              var confirmPopup = $ionicPopup.alert({
                template: '<span >发现新版本，请去应用商店下载最新版本</span>',//to do 需要一个 下载apk 的链接
                cancelText:'退出',
                okText:'退出'
              });
              confirmPopup.then(function(res) {

                ionic.Platform.exitApp();
                if(true){
                  $ionicLoading.show({template:'版本过低，无法使用'})
                }
              });
            }

          }
          else{//不需要更新,但是需要刷新页面 以加载远程 js 代码
            if(isIOS ){
              if( $rootScope.globalConstant.versionIOS != response.data.appVersion) {//ios有新版本了
                console.log('ios' + 'reload-- js------version-server---' + response.data.appVersion);
                window.location.reload(true);
              }
            }else{
              if($rootScope.globalConstant.versionANDROID != response.data.appVersion){//android 有新版了
                console.log('android'+'reload-- js-------'+response.data.appVersion);
                window.location.reload(true);
              }

            }
          }
        }
      });

    }

  }
])
;
