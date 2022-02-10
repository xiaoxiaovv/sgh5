/**
 * Created by xy on 2016/3/15.
 */
APP.controller('ImageAndWordController', ['$sce', '$scope', 'imageAndWordService', '$stateParams','$ionicPopup', '$rootScope','$ionicScrollDelegate','$http','$interval', function ($sce, $scope,imageAndWordService,$stateParams,$ionicPopup,$rootScope,$ionicScrollDelegate,$http,$interval) {

  //alert("图文详情");
  $scope.scrollToTop = function() {
    $ionicScrollDelegate.scrollTop([shouldAnimate = true]);
  };
  //$rootScope.$on('PRODUCE_DETAIL_LOCATION', function (event, data) {
  //  console.log('product_location', data);
  //  $scope.productModel.addressInfo=data["text-1"]+data["text-2"]+data["text-3"]
  //});
  //
  //$scope.$on('$ionicView.beforeEnter', function () {
  //  $scope.init();
  //})

// xyz添加视频
$scope.Mp42 = '';
$scope.Png42 = '';
$scope.flagMp4 = false;

  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.productId = $stateParams.productId;
    $scope.tabNav = 'selection';
    $scope.flag = false;
    imageAndWordService.doInit($scope.productId)
      .success(function (response, status, headers, config) {
        if(response.data.mp4FileId2){
          $scope.flagMp4 = true;
          var bb = JSON.parse(response.data.mp4FileId2);
          $scope.Mp42=$sce.trustAsResourceUrl(bb.video);
          $scope.Png42=bb.img;
        }else{
          $scope.flagMp4 = false;
        }

        console.log(response);
        if(response.success){
          if(response.data.detailImgs == null || response.data.detailImgs.length != 0){
            $scope.imagesUrl = $sce.trustAsHtml(response.data.detailImgs);
            console.log($scope.imagesUrl);
            var imgLength = 0;
            var allImgLoad = 0;
            console.log($('div#image-and-word').find('img').length);
            var timer = $interval(function () {
              if($('div#image-and-word').find('img').length){
                // console.log($('div#image-and-word').find('img').length+'个img标签已载入');
                // console.log($('div#image-and-word').find('img'));
                imgLength = $('div#image-and-word').find('img').length;

                if(allImgLoad==imgLength){
                  console.log('图片加载完成');

                  new RTP.PinchZoom($('div#image-and-word'),{tapZoomFactor:1});
                  console.log('contain数量为:'+$('div.pinch-zoom-container').length);
                  // if($('div.pinch-zoom-container:eq(1)')){
                  //   $('div.pinch-zoom-container:eq(1)').unwrap();
                  // }
                  console.log($('div.image-and-word'));
                  // if($('div.image-and-word').length==2){
                  //   $('div.image-and-word:nth-child(1)').remove();
                  // }
                  $interval.cancel(timer);
                }else{
                  allImgLoad=0;
                  for(var i=0;i<imgLength;i++){
                    // console.log($('div#image-and-word').find('img')[i].width);
                    if($('div#image-and-word').find('img')[i].width){
                      allImgLoad++;
                      // console.log(allImgLoad);
                    }
                  }
                  if(allImgLoad==imgLength){

                    new RTP.PinchZoom($('div#image-and-word'),{tapZoomFactor:1});
                    console.log('contain数量为:'+$('div.pinch-zoom-container').length);
                    // if($('div.pinch-zoom-container:eq(1)')){
                    //   $('div.pinch-zoom-container:eq(1)').unwrap();
                    // }
                    console.log($('div.pinch-zoom-container').length);
                    console.log($('div.image-and-word'));
                    // if($('div.image-and-word').length==2){
                    //   $('div.image-and-word:nth-child(1)').remove();
                    // }
                    $interval.cancel(timer);
                    // console.log('图片加载完成2');
                  }
                }
              }
            }, 200);
            $scope.flag = false;
          } else {
            $scope.flag = true;
          }
        } else {
          $scope.flag = true;
        }
    });
  })

  //解决物理返回按钮继续播放问题xyz添加
  $rootScope.$on('$stateChangeStart',
          function(event, toState, toParams, fromState, fromParams){
            if('imageAndWord' == fromState.name){
              var video=document.getElementsByTagName("video");
              for(var i=0;i<video.length;i++){
                video[i].pause();
              }
            }
          });
}]);


APP.service('imageAndWordService', ['$http', 'UrlService', function ($http, UrlService) {
  this.doInit = function (productId) {
    var params = {
      'productId': productId
    };

    return $http.get(UrlService.getUrl('PRODUCTDETAIL_PROMOS'), params);//'http://172.16.63.104:8086/v2/h5/sg/purchase/promos.html'
  };
}]);
