/**
 * 与积分相关的埋点函数
 **/
APP.service('CreditService', ['UrlService', '$http', '$timeout', function (UrlService, $http, $timeout) {
  this.shareSuccessCallback = function (platform) {
    var param={};
    if(arguments.length>1){
      param=arguments[1];
    }
    var shareSuccessUrl = UrlService.getUrl('SHARESUCCESS');
    var paramArray=[];
    for(var key in param){
      paramArray.push(key+"="+param[key]);
    }
    $http.get(shareSuccessUrl+"?"+paramArray.join("&"))
      .success(function (response) {
        if (response.success) {
          console.log('调用微店主金币接口成功');
        } else {
          console.log('调用微店主金币接口失败');
        }
      })
      .error(function (data, header, config, status) {
        console.log('调用微店主金币接口失败');
      });
    console.log(platform + "分享成功");
  };
  /**
   * 分享成功时发送消息给后端系统以计算积分
   */
  this.successShare = function (param) {
    // var shareSuccessUrl = UrlService.getUrl('SHARESUCCESS');
    // $http.get(shareSuccessUrl)
    //   .success(function (response) {
    //     if (response.success) {
    //       console.log('调用微店主金币接口成功');
    //     } else {
    //       console.log('调用微店主金币接口失败');
    //     }
    //   })
    //   .error(function (data, header, config, status) {
    //     console.log('调用微店主金币接口失败');
    //   });
    // console.log("QQ或者QQ空间分享");
  };

  /**
   * qq和qq空间分享无法获得回执，所以单独写一个方法用来增加金币
   */
  this.qqShare = function () {
    // $timeout(function () {
    //   var shareSuccessUrl = UrlService.getUrl('SHARESUCCESS');
    //   $http.get(shareSuccessUrl)
    //     .success(function (response) {
    //       if (response.success) {
    //         console.log('调用微店主金币接口成功');
    //       } else {
    //         console.log('调用微店主金币接口失败');
    //       }
    //     })
    //     .error(function (data, header, config, status) {
    //       console.log('调用微店主金币接口失败');
    //     });
    //   console.log("QQ或者QQ空间分享");
    // }, 3000);
  };

  var gameId = null;
  this.getGameId = function (callback) {
    if (gameId) {
      callback(gameId);
    } else {
      var url = UrlService.getUrl('FIND_GAME_ID');
      $http.get(url)
        .success(function (response) {
          if (response.success) {
            gameId = response.data;
            console.log('游戏ID:' + JSON.stringify(response.data));
            callback(response.data);
          } else {
            console.log('未找到游戏ID');
            callback('f265383f0538834f');
          }
        })
        .error(function (data, header, config, status) {
          console.log('查找游戏ID失败');
          callback('f265383f0538834f');
        });
    }
  };
}]);
