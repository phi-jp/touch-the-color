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

    this.colorAngle = Math.rand(0, 360);
    var color = COLOR_BASE_HSL.format(this.colorAngle);

    // 
    this.piece = MainPiece(color).addChildTo(this);

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
      Tweener().attachTo(label)
        .to({alpha:1}, 1000, 'swing')
        .to({y:250}, 1000, 'swing')
        .call(function() {
          this.remove();
        })

      self.on('pointend', function() {
        this.exit('main', {
          colorAngle: this.colorAngle,
        });
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