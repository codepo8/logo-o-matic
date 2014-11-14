/*
  Logo-o-Matic Canvas version
  Homepage: http://github.com/codepo8/logo-o-matic
  Copyright (c) 2011 Christian Heilmann
  Code licensed under the BSD License:
  http://wait-till-i.com/license.txt
*/

(function(){

  // sorry, old browsers…
  if (!document.querySelector) {return false;}
/* 
  Grabbing the canvas and all the neccesary elements from the DOM. 
  The image with the .current class defines which font is preset by
  reading out its ID
*/
  var nav =        document.querySelector('#nav ul');
  var srcimg =     document.querySelector('#fonts');
  var save =       document.querySelector('#save');
  var input =      document.querySelector('#text');
  var swab =       document.querySelector('#swab');
  var c64palette = document.querySelector('#c64colours');
  var output =     document.querySelector('output');
  var kerning =    document.querySelector('#kerning');
  var spacing =    document.querySelector('#spacing');
  var old =        document.querySelector('.current');
  var container =  document.querySelector('#container');
  var zoombutton = document.querySelector('#zoombutton');

  var c = document.querySelector('#main');
  var ctx = c.getContext('2d');

  var zc = document.querySelector('#zoom');
  var zcx = zc.getContext('2d');
  zc.width = 80;
  zc.height = 80;
  zcx.imageSmoothingEnabled = false;
  zcx.mozImageSmoothingEnabled = false;
  zcx.webkitImageSmoothingEnabled = false;

  var dc = document.querySelector('#display');
  var dcx = dc.getContext('2d');
  dc.width = 80;
  dc.height = 80;
  dcx.imageSmoothingEnabled = false;
  dcx.mozImageSmoothingEnabled = false;
  dcx.webkitImageSmoothingEnabled = false;

  var zoomfactor = 2;
  var set = fonts[old.id];
  var background = 'rgba(0,0,0,0)';
  var pixels;
  var colourpicked = false;
  var oldpixelcolour;
  var newpixelcolour;
  var pixelbuffer = [];
  var c64cols = {
    transparent: [0, 0, 0, 0],
    black:      [0, 0, 0, 255],
    white:      [255, 255, 255, 255],
    red:        [104, 55, 43, 255],
    cyan:       [112, 164, 178, 255],
    purple:     [111, 61, 134, 255],
    green:      [77, 141, 67, 255],
    blue:       [53, 40, 121, 255],
    yellow:     [184, 199, 111, 255],
    orange:     [111, 79, 37, 255],
    brown:      [67, 57, 0, 255],
    lightred:   [154, 103, 89, 255],
    darkgrey:   [68, 68, 68, 255],
    grey:       [108, 108, 108, 255],
    lightgreen: [154, 210, 132, 255],
    lightblue:  [108, 94, 181, 255],
    lightgrey:  [149, 149, 149, 255]
  };

  var valid = /^[a-z|\s|\$|\.|,|!]+$/;
  var rep = /[^a-z|\s|\$]+/g;

  nav.innerHTML = '';
  var out = '';
  for (var i in fonts) {
    var set = fonts[i];
    out += '<li><img src="img/' + i + '.png" alt="' + i + ' ' +
            set.maker  + ' - ' + set.product + '" id="' +
             i + '">';
    out += '<small>Font by ';
    if (set.makerlink) {
      out += '<a href="' + set.makerlink + '">' + set.maker + '</a>';
    } else {
      out += set.maker;
    }
    if (set.product) {
      out += ' used in <a href="' + set.productlink + '">' +
                  set.product + '</a>';
    } else {
      out += set.product;
    }
    if (set.year) {
      out += ' (' + set.year + ')';
    }
    if (set.format) {
      out += ' format: ' + set.format + '';
    }
    out += '</li></small>';
  }
  nav.innerHTML = out;

  function init() {
    var url = document.location.search.split('?text=')[1];
    if(url){
      sanitise(url.replace(/%20/g,' '));
    }
    document.querySelector('#orc').click();
  }

  function pickfont(e) {
    var t = e.target;
    if(t.tagName === 'IMG'){
      set = fonts[t.id];
      givecredit(set);
      spacing.disabled = ('$' in set);
      spacing.parentNode.className = ('$' in set) ? 'disabled' : '';
      old.className = '';
      t.className = 'current';
      old = t;
      c64palette.classList.add('inactive');
      pixelbuffer = [];
      sanitise(input.value);
    }
    e.preventDefault();
  }

  function getC64colour(e) {
    var t = e.target;
    if (t.tagName === 'LI') {
      if (oldpixelcolour) {
        replacecolour(
          ctx.getImageData(0,0,c.width,c.height),
          [
            oldpixelcolour.r,
            oldpixelcolour.g,
            oldpixelcolour.b,
            oldpixelcolour.a
          ],
          c64cols[t.className]
        );
      }
    }
    colourpicked = false;
    e.preventDefault();
  }

  function replacecolour(moo, oldcolour, newcolour) {
    var all = pixelbuffer.length;
    for(var j = 0; j < all; j++) {
      var i = pixelbuffer[j];
        pixels.data[i] = newcolour[0];
        pixels.data[i+1] = newcolour[1];
        pixels.data[i+2] = newcolour[2];
        pixels.data[i+3] = newcolour[3];
    }
    ctx.putImageData(pixels, 0, 0);
    storelink(c);
  }

  function showzoom(ev) {
    var x = ev.layerX;
    var y = ev.layerY;
    var sx = (x-5) < 0 ? 0 : x-5;
    var sy = (y-5) < 0 ? 0 : y-5;
    zcx.fillStyle = '#000';
    zcx.fillRect(0,0,80,80);
    zcx.drawImage(c,sx,sy,10,10,0,0,80,80);
    zcx.strokeStyle = '1px solid #000';
    zcx.strokeWidth = 0.5;
    zcx.strokeRect(30,35,20,10);
  }

  function readcolour(ev) {
    var x = ev.layerX;
    var y = ev.layerY;
    swab.style.background = 'rgba('+
      pixelcolour(x, y).r + ',' +
      pixelcolour(x, y).g + ',' +
      pixelcolour(x, y).b + ',' +
      pixelcolour(x, y).a + ')';
    if (ev.type === 'click') {
      oldpixelcolour = pixelcolour(x,y);
      getpixelsofcolour(pixelcolour(x,y));
      c64palette.classList.remove('inactive');
    }
  }

  function getpixelsofcolour(col) {
    pixelbuffer = [];
    var pixels = ctx.getImageData(0, 0, c.width, c.height);
    var all = pixels.data.length;
    for(var i = 0; i < all; i+=4) {
      if (pixels.data[i] === col.r &&
          pixels.data[i+1] === col.g &&
          pixels.data[i+2] === col.b &&
          pixels.data[i+3] === col.a) {
        pixelbuffer.push(i);
      }
    }
  }

  function pixelcolour(x, y) {
    var pixeldata = ctx.getImageData(x,y,1,1);
    return {
        r: pixeldata.data[0],
        g: pixeldata.data[1],
        b: pixeldata.data[2],
        a: pixeldata.data[3]
    };
  }

  function givecredit(set) {
  }

  function sanitise(s){
    s = s.toLowerCase();
    if(!valid.test(s)){
      s = s.replace(rep,'');
    }
    input.value = s;
    if(s){
      draw(s);
    }
  }

  function draw(s) {
    var str = s.split('');
    var w = 0;
    var h = 0;
    var i = 0;
    var j = str.length;
    var destX = 5;
    var destY = 5;
    for(i = 0; i < j; i++) {
      if (str[i] === ' ') {
        if ('$' in set) {
          str[i] = '$';
        } else {
          w += +spacing.value;
          continue;
        }
      }
      if (str[i] in set) {
        w += set[str[i]][1] + parseInt(kerning.value, 10);
      }
    }
    c.width = w + 10;
    c.height = set.height + 10;
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, c.width, c.height);

    for(i = 0; i < j; i++) {
      if (str[i] === ' ') {
        if ('$' in set) {
          str[i] = '$';
        } else {
          destX += parseInt(spacing.value, 10);
          continue;
        }
      }
      if (str[i] in set) {
        ctx.drawImage(
          srcimg, set[str[i]][0], set.offset, set[str[i]][1],
          set.height, destX, destY, set[str[i]][1], set.height
        );
        destX += set[str[i]][1] + parseInt(kerning.value, 10);
      }
    }
    storelink(c);
    pixels = ctx.getImageData(0,0,c.width,c.height);
  }

  function dozoom(ev) {
    container.classList.toggle('zoomed');
    if (zoomfactor === 2) {
      var ax = c.width;
      var ay = c.height;
      dc.width = ax * zoomfactor;
      dc.height = ay * zoomfactor;
      for (var y = 0; y < ay; y++) {
        for (var x = 0; x < ax; x++) {
          var col = pixelcolour(x, y);
          dcx.fillStyle = 'rgba(' + col.r + ',' + col.g + ',' +
                           col.b + ' ,' + col.a + ')';
          dcx.fillRect(x * zoomfactor, y * zoomfactor, 2, 2);
        }
      }
      zoombutton.innerHTML = 'edit logo';
      storelink(dc);
      zoomfactor = 1;
    } else {
      zoombutton.innerHTML = '2x';
      zoomfactor = 2;
      storelink(c);
    }
    ev.preventDefault();
  }

  function storelink(srccanvas) {
    save.innerHTML = '' +
     '<a href="' + srccanvas.toDataURL('image/png') + '" download="' +
      input.value + '.png">Click to save your logo</a>';
  }

  c.addEventListener('click', function(ev) {
    readcolour(ev);
    colourpicked = true;
  }, false);

  c.addEventListener('mousemove', function(ev) {
    if (!colourpicked) {
      readcolour(ev);
    }
    showzoom(ev);
  }, false);

  kerning.addEventListener('change',function(e){
    sanitise(input.value);
  },false);

  spacing.addEventListener('change',function(e){
    sanitise(input.value);
  },false);

  window.addEventListener('load', init, false);
  nav.addEventListener('click', pickfont, false);

  input.addEventListener('input',function(e){
    sanitise(input.value);
  },false);

  c64palette.addEventListener('click', getC64colour, false);
  zoombutton.addEventListener('click', dozoom, false);


})();