/**
 * 即时消息封装
 */
APP.service('IMService', ['$rootScope', '$ionicPopup', '$interval', '$ionicLoading', 'UrlService','UserService',
  function ($rootScope, $ionicPopup, $interval, $ionicLoading, UrlService,UserService) {
    var mqCallback = null;
    var client = null;
    var ws = null;
    var me = this;
    this.destroyWebSocket = function (callback) {
      if (client != null) {
        try {
          //console.log("销毁消息队列客户端...");
          client.disconnect(function () {
            client = null;
            if (ws != null) {
              console.log("销毁webSocket连接...");
              try {
                ws.close();
                ws = null;
              } catch (ex) {
                console.error(ex);
              }
              if (callback) {
                window.setTimeout(callback, 3000);
              }

            }
          });
        } catch (e) {
          console.error(e);
        }
      }

    };

    function uuid() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";
      var uuid = s.join("");
      return uuid;

    }

    /***
     * 验证websocket连接，如果连接断开重连 主要针对IOS后台
     */
    this.validateWebSocket=function(){
      if(ws==null){
        //console.log("websocket未初始化");
        return;
      }
      if(ws.readyState != 1){
        console.log("websocket已经初始化，但非接状态，重新连接...");
        this.initWebSocket();
      }
    };
    this.initWebSocket = function (cb) {
      if(window.navigator.userAgent.indexOf('ShunGuangRN') > -1){
          return;
      }
      if (mqCallback && cb) {
        console.warn("已经注册消息回调，重复注册无效");
      } else if (cb) {
        mqCallback = cb;
      }
      try {
        console.log("初始化webSocket连接...");
        ws = new WebSocket(UrlService.getWSUrl('MESSAGE_WS_URL'));
        /****
         * webSocket连接断开重试
         * @param event
         */
        console.log("初始化消息队列客户端...");
        client = Stomp.over(ws);
        client.debug = function () {
          if (window.console && console.log && console.log.apply) {
            console.log.apply(console, arguments);
          }
        };


        var on_connect = function () {
          $.ajax({
            url:UrlService.getUrl("REGIST_MESSAGE_TOKEN"),
            type:"post",
            dataType:"json",
            success:function(data){
              if (data.success) {
                var token = data.data;
                var routingKey = token;
                $rootScope.token = token;
                console.warn('获得MessageToken成功:' + token);
                var queueName="stomp-subscription-"+uuid();
                console.log("队列名称:"+queueName);
                //个人消息
                console.log("订阅个人消息...");
                var subscribe=client.subscribe('/exchange/message_topic_exchange/' + routingKey, function (d) {
                  console.log("recv:" + d.body);
                  mqCallback(JSON.parse(d.body));
                },{'x-queue-name':queueName});
                //群推消息
                console.log("订阅群发消息...");
                client.subscribe('/exchange/message_fanout_exchange', function (d) {
                  console.log("recv:" + d.body);
                  mqCallback(JSON.parse(d.body));
                },{'x-queue-name':queueName});
              } else {
                console.error("获得MessageToken失败:" + JSON.stringify(data));
                me.destroyWebSocket();
              }
            }
          });
        };

        var on_error = function () {
          me.destroyWebSocket(me.initWebSocket);
        };
        client.connect(UrlService.getMQAuth().username, UrlService.getMQAuth().password, on_connect, on_error, '/');
      } catch (e) {
        console.error(e);
      }
    };
  }]
);
