

/**
 * MainScene
 */
phina.define('MainScene', {
  superClass: 'phina.display.CanvasScene',

  init: function(params) {
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
      var colorAngle = params.colorAngle + (360/MAX_NUM*(index-1));
      var color = 'hsl({0}, 80%, 60%)'.format(colorAngle);
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
    var tweener = Tweener().attachTo(this.currentPiece);
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
            color: this.currentPiece.style.color,
          })
        }.bind(this));
      }
      else {
        this.setIndex(this.currentIndex+1);
      }
    }
  },
});
