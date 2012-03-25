/*global Fontomas, _, Handlebars*/

;(function () {
  "use strict";


  window.Fontomas = {};
  Fontomas.models = {};
  Fontomas.views  = {};


  var logger = {}, tpl_cache = {};


  Fontomas.config = {
    // class icon_size_prefix+"-<num>" added when icon size has changed
    icon_size_prefix:   "fm-icon-size-",
    icon_size_classes:  "", // precalculated by initCfg()

    preview_icon_sizes: [32, 24, 16],
    fix_edges:          true,
    scale_precision:    6, // truncate the mantissa when scaling svg paths

    output: {
      filename:     "fontomas.svg",
      font_id:      "FontomasCustom",
      horiz_adv_x:  500,
      units_per_em: 1000,
      ascent:       750,
      descent:      -250,
      metadata:     "This is a custom SVG font generated by Fontomas",
      missing_glyph_horiz_adv_x: 500
    }
  };

  // init icon_size_classes
  Fontomas.config.icon_size_classes = _.map(Fontomas.config.preview_icon_sizes,
    function (item) {
      return Fontomas.config.icon_size_prefix + item;
    }
  ).join(" ");

  // environment
  Fontomas.env = {
    is_file_proto:  (window.location.protocol === "file:"),
    filereader:     null,
    fontface:       null
  };


  Fontomas.debug = {is_on: false};

  // usage: index.html#debug:maxglyphs=10,noembedded,nofilereader,nofontface
  _.each(window.location.hash.substr(1).split("&"), function (str) {
    var vars = str.split(":");

    if ("debug" === vars.shift()) {
      Fontomas.debug.is_on = true;

      if (vars.length) {
        _.each(vars.shift().split(","), function (str) {
          var pair = str.split("=");
          Fontomas.debug[pair[0]] = pair[1] && pair[1] !== "" ? pair[1] : true;
        });
      }
    }
  });


  logger.assert =
  logger.error  =
  logger.debug  = function () {};

  if (Fontomas.debug.is_on) {
    logger.assert = console.assert;
    logger.error  = console.error;
    logger.debug  = console.debug ? console.debug : console.log;
  }

  Fontomas.logger = logger;


  Fontomas.render = function (id, locals) {
    var $tpl;

    if (!tpl_cache[id]) {
      $tpl = $('[data-tpl-id=' + id + ']').remove();
      tpl_cache[id] = Handlebars.compile($tpl.html());
    }

    return tpl_cache[id](locals || {});
  };

}());
