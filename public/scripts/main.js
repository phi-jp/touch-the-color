/*
 *
 */

phina.globalize();

var SCREEN_WIDTH  = 640;
var SCREEN_HEIGHT = 960;
var MAX_PER_LINE    = 5;                            // ピースの横に並ぶ最大数
var MAX_NUM         = MAX_PER_LINE*MAX_PER_LINE;    // ピース全体の数

var stats = null;

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
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    });

    this.bg = Shape({
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      backgroundColor: '#fec',
    }).addChildTo(this).origin.set(0, 0);

    // 定数
    var gridX = Grid(SCREEN_WIDTH, 6);
    var gridY = Grid(SCREEN_WIDTH, 6);
    var self = this;
    var numbers = Array.range(1, MAX_NUM+1).shuffle();
    // ボードを作成
    this.board = RectangleShape({
      width: SCREEN_WIDTH - 64,
      height: SCREEN_WIDTH - 64,
      stroke: false,
      color: 'white',
      cornerRadius: 8,
    }).addChildTo(this);
    this.board.x = SCREEN_WIDTH/2;
    this.board.y = SCREEN_WIDTH/2 + 190;
    // グループを生成
    this.group = CanvasElement().addChildTo(this);
    // ピースを生成
    numbers.each(function(index, i) {
      // グリッド上でのインデックス
      var xIndex = i%MAX_PER_LINE;
      var yIndex = Math.floor(i/MAX_PER_LINE);
      var color = 'hsl({0}, 80%, 60%)'.format(360/MAX_NUM*(index-1));
      var p = Piece(index, color).addChildTo(self.group);

      p.x = gridX.span(xIndex+1);
      p.y = gridY.span(yIndex+1)+190;

      p.onpointstart = function() {
        self.check(this);
      };
    });

    // 
    this.currentPiece = Piece(1).addChildTo(this);
    this.currentPiece.position.set(SCREEN_WIDTH/2, 120);
    this.setIndex(1);
  },

  setIndex: function(index) {
    this.currentIndex = index;
    var target = this.group.children.find(function(p) {
      return p.index === index;
    });
    this.currentPiece.style.color = target.style.color;
  },

  update: function() {
    stats.end();
    stats.begin();
  },

  check: function(piece) {
    if (this.currentIndex === piece.index) {
      piece.alpha = 0.5;
      piece.style.color = 'gray';

      if (this.currentIndex >= MAX_NUM) {
        var tweener = Tweener(this.currentPiece).addChildTo(this);
        tweener
          .to({ x: SCREEN_WIDTH/2, y: SCREEN_HEIGHT/2, rotation: 1080}, 500)
          .wait(500)
          .to({
            scaleX: 10,
            scaleY: 10,
          }, 500)
          .call(function() {
            alert('clear');
          });
      }
      else {
        this.setIndex(this.currentIndex+1);
      }
    }

  },
});

phina.define('Piece', {
  superClass: 'RectangleShape',

  init: function(index, color) {
    this.superInit({
      width: 100,
      height: 100,
      cornerRadius: 8,
      color: color,
      stroke: false,
    });

    this.width = 100;
    this.height = 100;

    this.index = index;
    this.setInteractive(true);
  },
});

/*
 * main
 */
window.onload = function() {
  // Stats
  stats = new Stats();
  document.body.appendChild(stats.domElement);
  init();
};
