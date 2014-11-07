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
  var srcimg = document.querySelector('#fonts');
  var save = document.querySelector('#save');
  var input = document.querySelector('#text');
  var output = document.querySelector('output');
  var colour = document.querySelector('#colour');
  var opacity = document.querySelector('#opacity');
  var old = document.querySelector('.current');
  var set = fonts[old.id];
  var currentcolour = 'rgba(0,0,0,1)';

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
    givecredit(fonts['qpd']);
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
  Every time a new background colour is chosen, draw a new logo 
*/
  colour.addEventListener('change',function(e){
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
  Replace all invalid characters, set $ instead of space (to get a valid
  label in the charmap) and call the draw function() when things went well
*/
  function sanitise(s){
    s = s.toLowerCase();
    if(!valid.test(s)){
      s = s.replace(rep,'');
    }
    input.value = s;
    s = s.replace(/\s/g,'$');
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
      if (str[i] in set) {
        w += set[str[i]][1];
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
      if (str[i] in set) {
        ctx.drawImage(
          srcimg, set[str[i]][0], set.offset, set[str[i]][1],
          set.height, destX, destY, set[str[i]][1], set.height
        );
        destX += set[str[i]][1];
      }
    }

/*
  Create a new image from the Canvas data and add it to the document for 
  saving.
*/
  save.innerHTML = '' +
   '<a href="' + ctx.canvas.toDataURL('image/png') + '" download="' +
    input.value + '.png"><img src="' + ctx.canvas.toDataURL('image/png') +
    '"></a><br><small>Click to download</small>';
  }

})();