
phina.define('MainPiece', {
  superClass: 'RectangleShape',
  init: function(color) {
    this.superInit({
      width: 100,
      height: 100,
      cornerRadius: 8,
      color: color,
      stroke: false,
    });

    this.width = 100;
    this.height = 100;
  },

  fill: function() {
    this.position.set(SCREEN_WIDTH/2, SCREEN_HEIGHT/2);
    this.scale.set(10, 10);

    return this;
  },

  small: function() {
    // 
    this.fill();
    // 
    var tweener = Tweener(this).addChildTo(this);
    tweener
      .wait(500)
      .to({
        scaleX: 1,
        scaleY: 1,
        rotation: 360,
      }, 1000, 'easeInOutQuad')
      .to({
        y: 120,
      }, 1000, 'easeInOutElastic')
      .set({rotation: 0})
      .call(function() {
        this.remove();
      });
  },

  big: function() {
    var tweener = Tweener(this).addChildTo(this);
    this.rotation = 0;
    tweener
      .to({ x: SCREEN_WIDTH/2, y: SCREEN_HEIGHT/2, rotation: 1080}, 500, 'easeInOutQuad')
      .wait(500)
      .to({
        scaleX: 10,
        scaleY: 10,
      }, 500, 'easeInOutQuad')
      .call(function() {
        this.remove();
        this.target.flare('biged');
      });

    return this;
  },

  appear: function() {
    this.position.set(-100, SCREEN_HEIGHT/2);
    this.rotation = -720;

    var tweener = Tweener(this).addChildTo(this);
    tweener
      .to({ x: 320, rotation: 0}, 1000, 'easeInOutQuad')
      .wait(500)
      .to({
        scaleX: 10,
        scaleY: 10,
      }, 500, 'easeInOutQuad')
      .call(function() {
        this.remove();
        this.target.flare('appeared');
      });
  },

  disappear: function() {
    // 
    this.fill();
    this.rotation = -720;
    // 
    var tweener = Tweener(this).addChildTo(this);
    tweener
      .wait(500)
      .to({
        scaleX: 1,
        scaleY: 1,
      }, 1000, 'easeInOutQuad')
      .to({ x: 640+100, rotation: 0}, 1000, 'easeInOutQuad')
      .call(function() {
        this.remove();
        this.target.flare('disappeared');
      });
    return this;
  },
});
