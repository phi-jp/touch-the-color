/*
 *
 */

phina.globalize();
var stats = null;

window.onload = function() {
  // Stats
  stats = new Stats();
  document.body.appendChild(stats.domElement);
  init();
};

var init = function() {
  var app = CanvasApp({
    query:'#world',
  });
  var scene = MainScene();
  app.replaceScene(scene);
  app.run();
};

phina.define('MainScene', {
  superClass: 'phina.display.CanvasScene',
  init: function() {
    this.superInit({
      width: 640,
      height: 960,
    });

    Shape().addChildTo(this).position.set(100, 100);
  },

  update: function() {
    stats.end();
    stats.begin();
  },
});
