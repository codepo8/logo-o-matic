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
  var ctx = document.querySelector('canvas').getContext('2d');
  var ec = document.querySelectorAll('canvas')[1];
  var ecx = ec.getContext('2d');
  var srcimg = document.querySelector('#fonts');
  var save = document.querySelector('#save');
  var input = document.querySelector('#text');
  var editor = document.querySelector('#editor');
  var closeeditor = document.querySelector('#editor button');
  var swab = document.querySelector('#swab');
  var savenewcolour = document.querySelector('#savenewcolour');
  var c64palette = document.querySelector('#c64colours');
  var output = document.querySelector('output');
  var colour = document.querySelector('#colour');
  var kerning = document.querySelector('#kerning');
  var spacing = document.querySelector('#spacing');
  var opacity = document.querySelector('#opacity');
  var old = document.querySelector('.current');
  var set = fonts[old.id];
  var currentcolour = 'rgba(0,0,0,1)';
  var oldpixelcolour;
  var newpixelcolour;
  var c64cols = {
    black: [0,0,0],
    white: [255,255,255],
    red: [104,55,43],
    cyan: [112,164,178],
    purple: [111,61,134],
    green: [77,141,67],
    blue: [53,40,121],
    yellow: [184,199,111],
    orange: [111,79,37],
    brown: [67,57,0],
    lightred: [154,103,89],
    darkgrey: [68,68,68],
    grey: [108,108,108],
    lightgreen: [154,210,132],
    lightblue: [108,94,181],
    lightgrey: [149,149,149]
  };

/*
  Seed navigation 
*/
nav.innerHTML = '';
var out = '';
for (var i in fonts) {
  out += '<li><img src="img/'+i+'.png" alt="'+i+' '+fonts[i].maker+' - '+fonts[i].product+'" id="'+i+'"></li>';
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
  Show editor, copy canvas
*/
  save.addEventListener('click',function(e){
    if (e.target.tagName === "BUTTON") {
      editor.classList.toggle('active');
      var img = document.querySelector('#save img');
      ecx.canvas.width = img.naturalWidth;
      ecx.canvas.height = img.naturalHeight;
      ecx.drawImage(img, 0, 0);
      pixels = ecx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
      e.preventDefault();
    }
  },false);

/*
  Close editor
*/
  closeeditor.addEventListener('click',function(e){
    editor.classList.toggle('active');
    c64palette.classList.add('inactive');
    savenewcolour.innerHTML = '';
    e.preventDefault();
  },false);

/* 
  Pick C64 colour
*/
  c64palette.addEventListener('click',function(e){
    var t = e.target;
    if (t.tagName === 'LI') {
      var col = t.dataset.col;
      if (oldpixelcolour && oldpixelcolour.a) {
        replacecolour(
          ecx.getImageData(0,0,ecx.canvas.width,ecx.canvas.height),
          [
            oldpixelcolour.r,
            oldpixelcolour.g,
            oldpixelcolour.b
          ],
          c64cols[t.className]
        );

      }
    }
    e.preventDefault();
  },false);
  
  function replacecolour(pixels, oldcolour, newcolour) {
    var all = pixels.data.length;
    for(var i = 0; i < all; i+=4) {
      if (pixels.data[i] === oldcolour[0] &&
          pixels.data[i+1] === oldcolour[1] &&
          pixels.data[i+2] === oldcolour[2]) {
        pixels.data[i] = newcolour[0];
        pixels.data[i+1] = newcolour[1];
        pixels.data[i+2] = newcolour[2];
        pixels.data[i+3] = 255;
      }
    }
    ecx.putImageData(pixels, 0, 0);
    savenewcolour.innerHTML = '' +
      '<a href="' + ecx.canvas.toDataURL('image/png') +
      '" download="' + input.value + '.png">Download this image</a>';
  }

/*
  Pick colour from canvas
*/
  ec.addEventListener('click', function(ev) {
    readcolour(ev);
  }, false);
  function readcolour(ev) {
    var x = ev.layerX;
    var y = ev.layerY;
    swab.style.background = 'rgba('+
      pixelcolour(x, y).r + ',' +
      pixelcolour(x, y).g + ',' +
      pixelcolour(x, y).b + ',' +
      pixelcolour(x, y).a + ')';
    oldpixelcolour = pixelcolour(x,y);
    c64palette.classList.remove('inactive');
  }
  function pixelcolour(x, y) {
    var pixels = ecx.getImageData(0,0,ecx.canvas.width,ecx.canvas.height);
    var index = ((y*(pixels.width*4)) + (x*4)),
        red = pixels.data[index],
        green = pixels.data[index + 1],
        blue = pixels.data[index + 2],
        a = pixels.data[index + 3];
    return {r:red, g:green, b:blue, a:a};
  }

/* 
  Every time a new background colour is chosen, draw a new logo 
*/
  colour.addEventListener('change',function(e){
    sanitise(input.value);
  },false);

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
  Every time the transparency changes, recalculate the colour 
*/
  opacity.addEventListener('change',function(e){
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
  Assemble the current colour string
*/
  function getcurrentcolour() {
    var col = colour.value;
    return 'rgba(' + parseInt(col.substr(1,2), 16) + ',' +
                     parseInt(col.substr(3,2), 16) + ',' +
                     parseInt(col.substr(5,2), 16) + ',' +
                     opacity.value + ')';
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
    ctx.fillStyle = getcurrentcolour();
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

/*
  Create a new image from the Canvas data and add it to the document for 
  saving.
*/
  save.innerHTML = '' +
   '<p>Click logo to download or <button>Edit the colours</button></p><a href="' + ctx.canvas.toDataURL('image/png') + '" download="' +
    input.value + '.png"><img src="' + ctx.canvas.toDataURL('image/png') +
    '"></a>';
  }

})();