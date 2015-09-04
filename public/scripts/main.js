/*
 *
 */

phina.globalize();

var SCREEN_WIDTH  = 640;
var SCREEN_HEIGHT = 960;
var MAX_PER_LINE    = 5;                            // ピースの横に並ぶ最大数
var MAX_NUM         = MAX_PER_LINE*MAX_PER_LINE;    // ピース全体の数

var BACKGROUND_COLOR = '#fec';

var init = function() {
  var app = CanvasApp({
    query:'#world',
  });

  app.enableStats();

  var scene = ManagerScene({
    startLabel: 'title',
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
        nextLabel: 'title',
      },
    ]
  });
  app.replaceScene(scene);

  app.run();
};

/**
 * TitleScene
 */
phina.define('TitleScene', {
  superClass: 'phina.display.CanvasScene',
  init: function() {
    this.superInit({
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    });

    this.backgroundColor = BACKGROUND_COLOR;

    var self = this;

    // 
    this.piece = MainPiece('hsl(0, 80%, 60%)').addChildTo(this);

    this.piece.appear();
    this.piece.onappeared = function() {
      var label = Label('Touch the color', {
        color: 'white',
        stroke: false,
        fontSize: 64,
      }).addChildTo(self);
      label.position.set(SCREEN_WIDTH/2, SCREEN_HEIGHT/2);
      label.alpha = 0;
      // 
      Tweener(label).addChildTo(label)
        .to({alpha:1}, 1000, 'swing')
        .to({y:250}, 1000, 'swing')
        .call(function() {
          this.remove();
        })

      self.on('pointend', function() {
        this.exit();
      });
    };

    this.onpointstart = function(e) {
      var p = e.pointer;
      var wave = Wave().addChildTo(this);
      wave.x = p.x;
      wave.y = p.y;
    };
  },
});

/**
 * ResultScene
 */
phina.define('ResultScene', {
  superClass: 'CanvasScene',

  init: function(params) {
    this.superInit({
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    });

    this.backgroundColor = BACKGROUND_COLOR;

    // 
    this.piece = MainPiece('hsl(0, 80%, 60%)').addChildTo(this);
    this.piece.fill();

    this.label = Label('result: ' + params.score).addChildTo(this);
    this.label.position.set(320, 480)

    this.onpointstart = function() {
      this.label.visible = false;
      this.piece.disappear().on('disappeared', function() {
        this.exit();
      }.bind(this));
    };
  },

});

/**
 * MainScene
 */
phina.define('MainScene', {
  superClass: 'phina.display.CanvasScene',
  init: function() {
    this.superInit({
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    });

    this.backgroundColor = BACKGROUND_COLOR;

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
    this.currentPiece = MainPiece().addChildTo(this);
    this.setIndex(1);
    // 
    var tweener = Tweener(this.currentPiece).addChildTo(this);
    this.currentPiece.small();

    this.onpointstart = function(e) {
      var p = e.pointer;
      var wave = Wave().addChildTo(this);
      wave.x = p.x;
      wave.y = p.y;
    };
  },

  setIndex: function(index) {
    this.currentIndex = index;
    var target = this.group.children.find(function(p) {
      return p.index === index;
    });
    this.currentPiece.style.color = target.style.color;
  },

  check: function(piece) {
    if (this.currentIndex === piece.index) {
      piece.alpha = 0.5;
      piece.style.color = 'gray';

      if (this.currentIndex >= MAX_NUM) {
      // if (true) {
        this.currentPiece.big().on('biged', function() {
          this.exit('result', {
            score: 100,
          })
        }.bind(this));
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
  init();
};
