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
  let nav =        document.querySelector('#nav ul');
  let srcimg =     document.querySelector('#fonts');
  let save =       document.querySelector('#save');
  let input =      document.querySelector('#text');
  let swab =       document.querySelector('#swab');
  let c64palette = document.querySelector('#c64colours');
  let kerning =    document.querySelector('#kerning');
  let spacing =    document.querySelector('#spacing');
  let offsetchar = document.querySelector('#charoffset');
  let old =        document.querySelector('.current');
  let container =  document.querySelector('#container');
  let zoombutton = document.querySelector('#zoombutton');
  let radiogroup = document.querySelector('.radios');
  let availablecontainer = document.querySelector('#charsavailable');
  // TODO let colbutton =  document.querySelector('#colourbutton');

  let c = document.querySelector('#main');
  let ctx = c.getContext('2d');
  let zc = document.querySelector('#zoom');
  let zcx = zc.getContext('2d');
  zc.width = 80;
  zc.height = 80;
  zcx.imageSmoothingEnabled = false;
  zcx.webkitImageSmoothingEnabled = false;
  let dc = document.querySelector('#display');
  let dcx = dc.getContext('2d');
  dc.width = 80;
  dc.height = 80;
  dcx.imageSmoothingEnabled = false;
  dcx.webkitImageSmoothingEnabled = false;

  let zoomfactor = 2;
  let set = fonts[old.id];
  let background = 'rgba(2,2,2,1)';
  let pixels;
  let colourpicked = false;
  let oldpixelcolour;
  let pixelbuffer = [];
  let alignment = 'left';

  let c64cols = {
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

  const init = () => {
    let url = document.location.search.split('?text=')[1];
    if (url){ sanitise(url.replace(/%20/g,' ')) }
    let hash = document.location.hash;
    hash = hash.replace('goto-','');
    if (hash !== '' && document.querySelector(hash)) {
      document.querySelector(hash).click();
    } else {
      document.querySelector('#orc').click();
    }
  }

  const createFontMenu = () => {
    var out = '';
    for (var i in window.fonts) {
      let set = fonts[i];
      out += `<li>
        <a href="index.html?font=${i}">
        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
        style="background:url(img/logos.png);background-position:0 -${window.imgobj[i].start}px"
        alt="${i} ${set.maker} - ${set.product}" 
        height="${window.imgobj[i].height}" 
        width="${window.imgobj[i].width}" id="${i}"></a>`;
      out += '<small>Font by ';
      out += (set.makerlink) 
        ? `<a href="${set.makerlink}">${set.maker}</a>`
        : set.maker;
      out += (set.product)
        ? ` used in <a href="${set.productlink}">${set.product}</a>` 
        : set.product;
      if (set.year) {
        out += ` (${set.year})`;
      }
      if (set.format) {
        out += ` format: ${set.format}`;
      }
      out += `</small></li>`;
    }
    nav.innerHTML = out;
  }

  const pickfont = (e) => {
    e.preventDefault();
    if (!document.body.classList.contains('zoomed')) {
      let t = e.target;
      if(t.tagName === 'IMG' || t.tagName === "A"){
        if (t.tagName === 'A') { t = t.querySelector('img');}
        set = fonts[t.id];
        let out = 'a-z';
        let available = Object.keys(set).filter(
          k => k.length === 1 && !/[a-z]/.test(k)
        );
        if (available.indexOf('0') !== -1) { out += ' 0-9' }
        out += ' ' + available.filter(
          k => !/[0-9|\^]/.test(k)
        ).sort().join('');
        availablecontainer.innerText = out;
        window.location.hash = 'goto-' + t.id;
        spacing.disabled = ('^' in set);
        spacing.parentNode.className = ('^' in set) ? 'disabled' : '';
        old.className = '';
        t.className = 'current';
        old = t;
        c64palette.classList.add('inactive');
        pixelbuffer = [];
        sanitise();
        endcolouring();
      }
    }
  }

  const endcolouring = () => {
    c64palette.classList.add('inactive');
    container.classList.remove('colouring');
  }

  const getC64colour = (e) => {
    let t = e.target;
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
          c64cols[t.className.replace(/ row| used/g,'')]
        );
      }
    }
    colourpicked = false;
    e.preventDefault();
  }

  const replacecolour = (moo, oldcolour, newcolour) => {
    let all = pixelbuffer.length;
    for(let j = 0; j < all; j++) {
      let i = pixelbuffer[j];
        pixels.data[i] = newcolour[0];
        pixels.data[i+1] = newcolour[1];
        pixels.data[i+2] = newcolour[2];
        pixels.data[i+3] = newcolour[3];
    }
    ctx.putImageData(pixels, 0, 0);
    analysecolours(pixels.data);
    storelink(c);
  }

  const showzoom = (ev) => {
    let x = ev.layerX;
    let y = ev.layerY;
    let sx = (x-5) < 0 ? 0 : x-5;
    let sy = (y-5) < 0 ? 0 : y-5;
    zcx.fillStyle = '#000';
    zcx.fillRect(0,0,80,80);
    zcx.drawImage(c,sx,sy,10,10,0,0,80,80);
    zcx.strokeStyle = 'black';
    zcx.lineWidth = 1;
    zcx.lineCap = 'square';
    zcx.strokeRect(30,35,20,10);
  }

  const readcolour = (ev) => {
    let x = ev.layerX;
    let y = ev.layerY;
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

  const getpixelsofcolour = (col) => {
    pixelbuffer = [];
    let pixels = ctx.getImageData(0, 0, c.width, c.height);
    let all = pixels.data.length;
    for(let i = 0; i < all; i+=4) {
      if (pixels.data[i] === col.r &&
          pixels.data[i+1] === col.g &&
          pixels.data[i+2] === col.b &&
          pixels.data[i+3] === col.a) {
        pixelbuffer.push(i);
      }
    }
  }

  const pixelcolour = (x,y) => {
    var pixeldata = ctx.getImageData(x,y,1,1);
    return {
        r: pixeldata.data[0],
        g: pixeldata.data[1],
        b: pixeldata.data[2],
        a: pixeldata.data[3]
    };
  }

  const sanitise = (s) => {
    if (typeof s !== 'string') { s = input.value; }
    if (s.includes('~')) {
      radiogroup.classList.remove('inactive');
    } else {
      radiogroup.classList.add('inactive');
    }
    s = s.toLowerCase();
    for (let c of s) {
      if (c !== "~" && c !== ' ') {
        if(!(c in set)){
          s = s.replace(c,'');
        }
      }
    }
    input.value = s;
    if(s){ draw(s) }
  }

  const draw = (s) => {

    let charoff = true;
    let charoffset = +offsetchar.value;
    let w = 0;
    let destX = 5;
    let destY = 5;
    let chunks = s.split('~');
    let lines = chunks.length;
    let longest = Math.max(...(chunks.map(el => el.replace(/\s/g,'').length)));
    let fullwidth = [];

    chunks.forEach(s => {
      let biggest = 0;
      for (let c of s) {
        if (c === ' ') {
          if ('^' in set) {
            c = '^';
          } else {
            biggest += +spacing.value;
            continue;
          }
        }
        if (c in set) { biggest += set[c][1]; }
      }
      fullwidth.push(biggest);
      w = Math.max(w,biggest);
    });

    w += (longest-1) * parseInt(kerning.value, 10) + 10;

    c.width = w;
    c.height = (set.height + 10 + charoffset) * (lines);
    ctx.fillStyle = set.background ?
                    'rgb(' + c64cols[set.background][0] + ',' +
                             c64cols[set.background][1] + ',' +
                             c64cols[set.background][2] + ')' :
                     background;
    ctx.fillRect(0, 0, c.width, c.height);

    let xoff = set.xoffset ? set.xoffset : 0;

    chunks.forEach((s,k) => {
      let centered = (w -  (longest-1) * parseInt(kerning.value, 10) - 10) - fullwidth[k];
      switch (alignment) {
        case 'centre':
          destX += centered / 2;
        break;
        case 'right':
          destX += centered;
        break;        
        case 'left':
          destX = 5;
        break;        
      }
      for (let c of s) {
        if (c === ' ') {
          if ('^' in set) {
            c = '^';
          } else {
            destX += parseInt(spacing.value, 10);
            continue;
          }
        }
        if (c in set) {
          charoff = !charoff
          ctx.drawImage(
            srcimg, 
            set[c][0] + xoff, set.offset, 
            set[c][1], set.height, 
            destX, destY + (charoff?charoffset:0),
            set[c][1], set.height
          );
          destX += set[c][1] + parseInt(kerning.value, 10);
        }
      }
      destY += (set.height + 10 + charoffset);
      destX = 5;
    })
    storelink(c);
    pixels = ctx.getImageData(0,0,c.width,c.height);
    analysecolours(pixels.data);
  }

  const analysecolours = (pixels) => {
    let all = pixels.length;
    let coloursused = {};
    let i = 0;
    let j = 0;
    for (i = 0; i < all; i+=4) {
      coloursused[pixels[i]+'|'+pixels[i+1]+'|'+pixels[i+2]+'|'+pixels[i+3]] = 1;
    }
    var lis = document.querySelectorAll('.palette li');
    for (i = 0; i < lis.length; i++) {
      lis[i].classList.remove('used');
    }
    for (i in coloursused) {
      for (j in c64cols) {
        var parts = i.split('|');
        if (c64cols[j][0] === +parts[0] &&
            c64cols[j][1] === +parts[1] &&
            c64cols[j][2] === +parts[2] &&
            c64cols[j][3] === +parts[3]) {
         document.querySelector('.'+j).classList.add('used');
        }
      }
    }
  }

  const dozoom = (ev) => {
    document.body.classList.toggle('zoomed');
    if (zoomfactor > 1) {
      let ax = c.width;
      let ay = c.height;
      dc.width = ax * zoomfactor;
      dc.height = ay * zoomfactor;
      for (let y = 0; y < ay; y++) {
        for (let x = 0; x < ax; x++) {
          let col = pixelcolour(x, y);
          dcx.fillStyle = `rgba(${col.r},${col.g},${col.b},${col.a})`;
          dcx.fillRect(x * zoomfactor, y * zoomfactor, zoomfactor, zoomfactor);
        }
      }
      zoombutton.innerHTML = `<svg height='2em' width='2em'  fill="#ffffff" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" version="1.1" style="shape-rendering:geometricPrecision;text-rendering:geometricPrecision;image-rendering:optimizeQuality;" viewBox="0 0 333 333" x="0px" y="0px" fill-rule="evenodd" clip-rule="evenodd"><title>Edit</title><defs><style type="text/css">.fil0 {fill:#ffffff;fill-rule:nonzero}</style></defs><g><path class="fil0" d="M72 213l4 -4 26 -3 0 24 24 0c-4,38 5,29 -40,39l-22 -22 8 -34zm12 68l42 -9 152 -153c41,-41 -23,-105 -64,-64l-152 153 -20 84 42 -11zm5 -85l101 -100c28,-25 77,9 45,50l-99 99 3 -26 -25 0 0 -25 -25 2zm121 -120c14,-15 34,-37 59,-12 25,26 3,45 -12,60 2,-27 -21,-50 -47,-48zm6 50c6,-5 -2,-13 -8,-8l-82 82c-5,5 3,13 8,8l82 -82z"></path></g></svg>`;
      zoomfactor = 1;
      storelink(dc);
    } else {
      zoombutton.innerHTML = `
      <svg height='2em' width='2em'  fill="#ffffff" xmlns="http://www.w3.org/2000/svg" data-name="Layer 2" viewBox="0 0 100 100" x="0px" y="0px"><title>Zoom</title><path d="M65.46,58.26c0.4-.54.79-1.1,1.16-1.67a34,34,0,1,0-10,10c0.57-.36,1.13-0.75,1.67-1.16A33.85,33.85,0,0,0,65.46,58.26ZM6.23,38.19A31.92,31.92,0,1,1,38.14,70.1,32,32,0,0,1,6.23,38.19Z"></path><path d="M42.51,58.64a21,21,0,0,1-4.37.46,20.72,20.72,0,0,1-8.37-1.75,1,1,0,0,0-.8,1.83,22.71,22.71,0,0,0,9.18,1.92,23,23,0,0,0,4.78-.5A1,1,0,0,0,42.51,58.64Z"></path><path d="M38.15,11.27A26.89,26.89,0,0,0,13.35,27.71a1,1,0,1,0,1.84.78,24.91,24.91,0,1,1-2,9.69,1,1,0,0,0-2,0A26.91,26.91,0,1,0,38.15,11.27Z"></path><path d="M93.7,83.67L68.06,58c-0.37.57-.76,1.12-1.17,1.66l6.6,6.6-3.6,3.59a1,1,0,1,0,1.41,1.41l3.59-3.59L92.28,85.08a5.07,5.07,0,0,1-7.16,7.17L59.73,66.87c-0.54.41-1.08,0.8-1.65,1.18L83.7,93.67A7.07,7.07,0,0,0,93.7,83.67Z"></path><path d="M37.56,27.12a1,1,0,0,0-1,1v7.5h-7.5a1,1,0,1,0,0,2h7.5v7.5a1,1,0,0,0,2,0v-7.5h7.5a1,1,0,0,0,0-2h-7.5v-7.5A1,1,0,0,0,37.56,27.12Z"></path></svg>`;
      zoomfactor = 2;
      storelink(c);
    }
    ev.preventDefault();
  }

  const storelink = (srccanvas) => {
    save.setAttribute('href',srccanvas.toDataURL('image/png')); 
    save.setAttribute('download',input.value.replace(/~/g,' ')); 
  }


  c.addEventListener('click', (ev) => {
    readcolour(ev);
    colourpicked = true;
    container.classList.add('colouring');
  }, false);

  c.addEventListener('dblclick', (ev) => {
    endcolouring();
  }, false);

  c.addEventListener('mousemove', (ev) => {
    if (!colourpicked) {
      readcolour(ev);
    }
    showzoom(ev);
  }, false);

  input.addEventListener('input', (e) => {
    sanitise();
    endcolouring();
  },false);

  const getalignment = (ev) => {
    let t = ev.target;
    if (t.tagName === 'INPUT') {
      alignment = t.getAttribute('value');
      sanitise();
    }
  };

  // Listeners
  [
    [kerning, 'change', sanitise],
    [offsetchar, 'change', sanitise],
    [spacing, 'change',sanitise],
    [radiogroup, 'click', getalignment],
    [nav, 'click', pickfont],
    [c64palette, 'click', getC64colour],
    [zoombutton, 'click', dozoom],
    [colourbutton, 'click', endcolouring],
    [window, 'load', init],
    [window, 'DOMContentLoaded', createFontMenu]
  ].forEach(_ => {
    _[0].addEventListener(_[1],_[2]);
  })

})();