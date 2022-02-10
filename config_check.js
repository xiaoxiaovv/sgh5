var uglifyjs = require("uglify-js");
var through2 = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

function configCheck() {
  function check(file, encoding, callback) {
    try {
      if (file.isNull()) {
        // return empty file
        return callback(null, file);
      }

      var parsed = uglifyjs.parse(String(file.contents));
      parsed.figure_out_scope();
      for (var i = 0; i < parsed.body[0].body.args.length; i++) {
        var args = parsed.body[0].body.args[i];
        if (args.value && args.value == "UrlService") {
          var next_args = parsed.body[0].body.args[i + 1].elements[0];
          for (var j = 0; j < next_args.body.length; j++) {
            if (next_args.body[j].definitions && next_args.body[j].definitions.length > 0) {
              if (next_args.body[j].definitions[0].name && next_args.body[j].definitions[0].name.name == 'ENVIRONMENT') {
                if (next_args.body[j].definitions[0].value.value != 0) {
                  gutil.log(gutil.colors.yellow("\n***********************************************************************\n" +
                    "*检测到UrlService中环境设置并非生产环境(ENVIRONMENT=" + next_args.body[j].definitions[0].value.value + ")，请检查配置文件*\n" +
                    "***********************************************************************\n"));
                  callback(null, file);
                  return;
                }
              }
            }
          }
        }
      }
    } catch (e) {
      callback(null, file);
      return;
    }
    callback(null, file);
  };
  return through2.obj(check);
}

module.exports = configCheck;
