

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
    this.piece = MainPiece(params.color || 'hsl(0, 80%, 60%)').addChildTo(this);
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