importScripts("stomp.js");
var me = this;
var client = null;
var config = null;
this.addEventListener('message', function (e) {
  console.log("Worker Message:" + e.data);
  var obj = JSON.parse(e.data);
  if (obj.action == 'start') {
    config = obj;
    startWorker();
  } else if (obj.action == 'stop') {
    stopWorkder();
  }
}, false);

function startWorker() {
  try {
    console.log("初始化webSocket连接...");
    ws = new WebSocket(config.wsUrl);
    /****
     * webSocket连接断开重试
     * @param event
     */
    console.log("初始化消息队列客户端...");
    client = Stomp.over(ws);
    client.debug = function () {
      if (console && console.log && console.log.apply) {
        console.log.apply(console, arguments);
      }
    };


    var on_connect = function () {
      getToken(config.tokenUrl, function (data) {
        if (data.success) {
          var token = data.data;
          var routingKey = token;
          me.postMessage(JSON.stringify({action: 'getToken', token: token}));
          console.warn('获得MessageToken成功:' + token);
          //个人消息
          console.log("订阅个人消息...");
          client.subscribe('/exchange/message_topic_exchange/' + routingKey, function (msg) {
            me.postMessage(JSON.stringify({action: 'getMsg', msg: JSON.stringify(msg)}));
          });
          //群推消息
        } else {
          console.error("获得MessageToken失败:" + JSON.stringify(data));
          stopWorkder();
        }
      });
    };

    var on_error = function () {
      stopWorkder(startWorker);
    };
    client.connect(config.username, config.password, on_connect, on_error, '/');
  } catch (e) {
    console.error(e);
  }
}

function stopWorkder(callback) {
  if (client != null) {
    try {
      console.log("销毁消息队列客户端...");
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
            setTimeout(callback, 3000);
          }
        }
      });
    } catch (e) {
      console.error(e);
    }
  }
}

function getToken(url, success) {
  var oReq = new XMLHttpRequest();
  oReq.withCredentials = true;
  oReq.addEventListener("load", function () {
    if (this.readyState == 4 && this.status == 200) {
      if (success) {
        success(JSON.parse(this.responseText));
      }
    }
  });
  oReq.open("GET", url);
  oReq.send();
}
