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
  var n = document.querySelector('#nav');
  var c = document.querySelector('canvas');
  var ctx = c.getContext('2d');
  var zc = document.querySelectorAll('canvas')[1];
  var zcx = zc.getContext('2d');
  var srcimg = document.querySelector('#fonts');
  var save = document.querySelector('#save');
  var input = document.querySelector('#text');
  var swab = document.querySelector('#swab');
  var c64palette = document.querySelector('#c64colours');
  var output = document.querySelector('output');
  // var colour = document.querySelector('#colour');
  var kerning = document.querySelector('#kerning');
  var spacing = document.querySelector('#spacing');
  var opacity = document.querySelector('#opacity');
  var old = document.querySelector('.current');
  var set = fonts[old.id];
  var background = 'rgba(0,0,0,1)';
  var pixels;
  var colourpicked = false;
  var oldpixelcolour;
  var newpixelcolour;
  var pixelbuffer = [];
  var c64cols = {
    transparent: [0,0,0,0],
    black: [0,0,0,255],
    white: [255,255,255,255],
    red: [104,55,43,255],
    cyan: [112,164,178,255],
    purple: [111,61,134,255],
    green: [77,141,67,255],
    blue: [53,40,121,255],
    yellow: [184,199,111,255],
    orange: [111,79,37,255],
    brown: [67,57,0,255],
    lightred: [154,103,89,255],
    darkgrey: [68,68,68,255],
    grey: [108,108,108,255],
    lightgreen: [154,210,132,255],
    lightblue: [108,94,181,255],
    lightgrey: [149,149,149,255]
  };
  zc.width = 80;
  zc.height = 80;
  zcx.imageSmoothingEnabled = false;
  zcx.mozImageSmoothingEnabled = false;
  zcx.webkitImageSmoothingEnabled = false;

/*
  Seed navigation 
*/
nav.innerHTML = '';
var out = '';
for (var i in fonts) {
  out += (fonts[i].w[1] > 80) ? '<li style="width:'+(fonts[i].w[1]*3)+'px;height:'+(fonts[i].height+5)+'px">' : '<li>';
  out += '<img src="img/'+i+'.png" alt="'+i+' '+fonts[i].maker+' - '+fonts[i].product+'" id="'+i+'"></li>';
}
nav.innerHTML = out;



/* 
  only allow characters a-z, space and the dollar sign. I use dollar to
  define a space in the coordinates above
*/
  var valid = /^[a-z|\s|\$|\.|,|!]+$/;
  var rep = /[^a-z|\s|\$]+/g;

/*
  If there is a ?text=moo parameter on the URL, grab the text, remove the 
  space encoding and call sanitise()
*/
  window.addEventListener('load',function(e){
    var url = document.location.search.split('?text=')[1];
    if(url){
      sanitise(url.replace(/%20/g,' '));
    }
    document.querySelector('#orc').click();
  },false);

/*
  Using event delegation, set the font by clicking on the images in the 
  nav list. Call sanitise to immediately show changes and shift the current
  class in the HTML to the clicked element
*/
  n.addEventListener('click',function(e){
    var t = e.target;
    if(t.tagName === 'IMG'){
      set = fonts[t.id];
      givecredit(set);
      spacing.disabled = ('$' in set);
      spacing.parentNode.className = ('$' in set) ? 'disabled' : '';
      old.className = '';
      t.className = 'current';
      old = t;
      sanitise(input.value);
    }
    e.preventDefault();
  },false);

/*
  Every time the key is released inside the input element, sanitise the value
*/
  input.addEventListener('input',function(e){
    sanitise(input.value);
    e.preventDefault();
  },false);


/* 
  Pick C64 colour
*/
  c64palette.addEventListener('click',function(e){
    var t = e.target;
    if (t.tagName === 'LI') {
      if (oldpixelcolour) {
        replacecolour(
          ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height),
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
  },false);
  
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
    storelink();
  }

/*
  Pick colour from canvas
*/
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

  function showzoom(ev) {
    var x = ev.layerX;
    var y = ev.layerY;
    var sx = (x-5) < 0 ? 0 : x-5;
    var sy = (y-5) < 0 ? 0 : y-5;
    zcx.drawImage(c,sx,sy,10,10,0,0,80,80);
  }

  function readcolour(ev) {
    //var x = ev.clientX-c.offsetLeft;
    //var y = ev.clientY-c.offsetTop;
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
    var pixels = ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height);
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


/* 
  Every time the kerning changes, draw a new logo
*/
  kerning.addEventListener('change',function(e){
    sanitise(input.value);
  },false);

/* 
  Every time the spacing changes, draw a new logo
*/
  spacing.addEventListener('change',function(e){
    sanitise(input.value);
  },false);



/*
  Assemble the credit string and show it.
*/
  function givecredit(set) {
    var credits = 'Font by ';
    if (set.makerlink) {
      credits += '<a href="' + set.makerlink + '">' + set.maker + '</a>';
    } else {
      credits += set.maker;
    }
    if (set.product) {
      credits += ' used in <a href="' + set.productlink + '">' +
                  set.product + '</a>';
    } else {
      credits += set.product;
    }
    if (set.year) {
      credits += ' (' + set.year + ')';
    }
    if (set.format) {
      credits += ' format: ' + set.format + '';
    }
    output.innerHTML = credits;
  }

/*
  Replace all invalid characters and call draw 
*/
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
    ctx.canvas.width = w + 10;
    ctx.canvas.height = set.height + 10;
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

/*
  Crop the characters one by one from the image and copy them into the 
  Canvas - add to the destX to copy them in one after the other
*/
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
    storelink();
    pixels = ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height);
  }
/*
  Create a new image link from the Canvas data and add it to the 
  document for saving.
*/
  function storelink() {
    save.innerHTML = '' +
     '<a href="' + ctx.canvas.toDataURL('image/png') + '" download="' +
      input.value + '.png">Click to save the image</a>';
  }

})();