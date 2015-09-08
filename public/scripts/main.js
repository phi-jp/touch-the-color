/*
 *
 */

phina.globalize();

var SCREEN_WIDTH  = 640;
var SCREEN_HEIGHT = 960;
var MAX_PER_LINE    = 5;                            // ピースの横に並ぶ最大数
var MAX_NUM         = MAX_PER_LINE*MAX_PER_LINE;    // ピース全体の数

var BACKGROUND_COLOR = '#fec';
var COLOR_BASE_HSL = 'hsl({0}, 80%, 60%)';

window.onload = function() {
  var flow = AssetLoader().load({
    script: {
      titlescene: 'scripts/scenes/title.js',
      mainscene: 'scripts/scenes/main.js',
      resultscene: 'scripts/scenes/result.js',
      piece: 'scripts/elements/piece.js',
    },
  });

  flow.then(function() {
    init();
  });
};

var init = function() {
  var app = CanvasApp({
    query:'#world',
  });

  app.enableStats();

  var scene = ManagerScene({
    startLabel: location.search.substr(1).toObject().scene || 'title',
    // startLabel: 'result',
    scenes: [
      {
        className: 'TitleScene',
        label: 'title',
        nextLabel: 'main',
      },
      {
        className: 'MainScene',
        label: 'main',
        nextLabel: 'result',
      },
      {
        className: 'ResultScene',
        label: 'result',
        arguments: {
          color: 'blue',
          score: 1234,
        },
        nextLabel: 'title',
      },
    ]
  });
  app.replaceScene(scene);

  app.run();
};
