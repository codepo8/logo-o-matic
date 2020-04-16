/*
  Logo-o-Matic Canvas version
  Homepage: http://github.com/codepo8/logo-o-matic
  Copyright (c) 2011 Christian Heilmann
  Code licensed under the BSD License:
  http://wait-till-i.com/license.txt
*/

(function(){

const imgobj = {
  "tinygold": {
    "start": 0,
    "width": 68,
    "height": 24
  },
  "fullheight": 3648,
  "fullwidth": 266,
  "ollie": {
    "start": 24,
    "width": 139,
    "height": 62
  },
  "arcoss": {
    "start": 86,
    "width": 192,
    "height": 58
  },
  "foldfont": {
    "start": 144,
    "width": 208,
    "height": 90
  },
  "bigcolourhires": {
    "start": 234,
    "width": 208,
    "height": 66
  },
  "twobytwohirescupid": {
    "start": 300,
    "width": 76,
    "height": 24
  },
  "balls": {
    "start": 324,
    "width": 73,
    "height": 25
  },
  "cupidtilt": {
    "start": 349,
    "width": 104,
    "height": 32
  },
  "psychopoetry": {
    "start": 381,
    "width": 104,
    "height": 33
  },
  "ironsky": {
    "start": 414,
    "width": 104,
    "height": 34
  },
  "cupid2014": {
    "start": 448,
    "width": 114,
    "height": 52
  },
  "pseudotechno": {
    "start": 500,
    "width": 104,
    "height": 29
  },
  "censor": {
    "start": 529,
    "width": 142,
    "height": 42
  },
  "legend": {
    "start": 571,
    "width": 142,
    "height": 42
  },
  "qpd": {
    "start": 613,
    "width": 114,
    "height": 41
  },
  "tostretch": {
    "start": 654,
    "width": 160,
    "height": 25
  },
  "cpx4": {
    "start": 679,
    "width": 166,
    "height": 43
  },
  "cpx3": {
    "start": 722,
    "width": 167,
    "height": 51
  },
  "macaroons": {
    "start": 773,
    "width": 110,
    "height": 32
  },
  "artline": {
    "start": 805,
    "width": 166,
    "height": 50
  },
  "deekay": {
    "start": 855,
    "width": 146,
    "height": 42
  },
  "cupidround": {
    "start": 897,
    "width": 88,
    "height": 34
  },
  "orc": {
    "start": 931,
    "width": 154,
    "height": 85
  },
  "compyx": {
    "start": 1016,
    "width": 178,
    "height": 107
  },
  "bd": {
    "start": 1123,
    "width": 210,
    "height": 58
  },
  "artix": {
    "start": 1181,
    "width": 154,
    "height": 50
  },
  "bd2": {
    "start": 1231,
    "width": 202,
    "height": 42
  },
  "bk": {
    "start": 1273,
    "width": 210,
    "height": 66
  },
  "sulaco": {
    "start": 1339,
    "width": 104,
    "height": 34
  },
  "bk2": {
    "start": 1373,
    "width": 178,
    "height": 58
  },
  "cml": {
    "start": 1431,
    "width": 144,
    "height": 42
  },
  "diart2": {
    "start": 1473,
    "width": 144,
    "height": 72
  },
  "deekay4": {
    "start": 1545,
    "width": 144,
    "height": 42
  },
  "dize": {
    "start": 1587,
    "width": 146,
    "height": 42
  },
  "genius": {
    "start": 1629,
    "width": 210,
    "height": 42
  },
  "gp": {
    "start": 1671,
    "width": 178,
    "height": 50
  },
  "htl": {
    "start": 1721,
    "width": 178,
    "height": 50
  },
  "htl2": {
    "start": 1771,
    "width": 186,
    "height": 42
  },
  "manowar": {
    "start": 1813,
    "width": 178,
    "height": 50
  },
  "nec": {
    "start": 1863,
    "width": 146,
    "height": 42
  },
  "ons": {
    "start": 1905,
    "width": 178,
    "height": 50
  },
  "oregon": {
    "start": 1955,
    "width": 210,
    "height": 74
  },
  "skyhigh": {
    "start": 2029,
    "width": 178,
    "height": 32
  },
  "vic": {
    "start": 2061,
    "width": 146,
    "height": 50
  },
  "deliverance": {
    "start": 2111,
    "width": 174,
    "height": 50
  },
  "unibit": {
    "start": 2161,
    "width": 206,
    "height": 58
  },
  "vic3": {
    "start": 2219,
    "width": 146,
    "height": 42
  },
  "wot": {
    "start": 2261,
    "width": 138,
    "height": 44
  },
  "wow": {
    "start": 2305,
    "width": 146,
    "height": 42
  },
  "tempest": {
    "start": 2347,
    "width": 210,
    "height": 74
  },
  "vic2": {
    "start": 2421,
    "width": 266,
    "height": 74
  },
  "cpx6": {
    "start": 2495,
    "width": 151,
    "height": 49
  },
  "tough": {
    "start": 2544,
    "width": 175,
    "height": 34
  },
  "doolittle": {
    "start": 2578,
    "width": 175,
    "height": 42
  },
  "unknown": {
    "start": 2620,
    "width": 234,
    "height": 81
  },
  "cpx5": {
    "start": 2701,
    "width": 174,
    "height": 52
  },
  "deekay3": {
    "start": 2753,
    "width": 198,
    "height": 143
  },
  "cupidbigstone": {
    "start": 2896,
    "width": 118,
    "height": 60
  },
  "deliverance2": {
    "start": 2956,
    "width": 142,
    "height": 74
  },
  "deekay2": {
    "start": 3030,
    "width": 198,
    "height": 140
  },
  "oregon2": {
    "start": 3170,
    "width": 202,
    "height": 106
  },
  "cpx2": {
    "start": 3276,
    "width": 210,
    "height": 170
  },
  "diart": {
    "start": 3446,
    "width": 202,
    "height": 202
  }
}

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
  let newpixelcolour;
  let pixelbuffer = [];
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

  let valid = /^[a-z|0-9|\?|\.|\"|\:|/|%|,|\(|\)|'|!|+|\-|=|\s]+$/;
  let rep = /[^a-z|\s|\$]+/g;
  //  input.setAttribute('pattern',`^[a-z|0-9|\?|\.|\"|\:|/|%|,|\(|\)|'|!|+|-|=|\s]+$`);

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
        style="background:url(img/logos.png);background-position:0 -${imgobj[i].start}px"
        alt="${i} ${set.maker} - ${set.product}" 
        height="${imgobj[i].height}" 
        width="${imgobj[i].width}" id="${i}"></a>`;
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
    if (!document.body.classList.contains('zoomed')) {
      let t = e.target;
      if(t.tagName === 'IMG'){
        set = fonts[t.id];
        let out = 'a-z';
        let available = Object.keys(set).filter(k=>k.length===1&&!/[a-z]/.test(k));
        if (available.indexOf('0') !== -1) { out += ' 0-9' }
        out += ' ' + available.filter(k => !/[0-9]/.test(k)).sort().join('');
        availablecontainer.innerText = out;

        window.location.hash = 'goto-' + t.id;
        spacing.disabled = ('$' in set);
        spacing.parentNode.className = ('$' in set) ? 'disabled' : '';
        old.className = '';
        t.className = 'current';
        old = t;
        c64palette.classList.add('inactive');
        pixelbuffer = [];
        sanitise();
        endcolouring();
        e.preventDefault();
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
    s = s.toLowerCase();
    if(!valid.test(s)){
      s = s.replace(rep,'');
    }
    input.value = s;
    if(s){ draw(s) }
  }

  const draw = (s) => {
    let charoff = true;
    let charoffset = +offsetchar.value;
    let str = s.split('');
    let w = 0;
    let i = 0;
    let j = str.length;
    let destX = 5;
    let destY = 5;
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
        w += set[str[i]][1];
      }
    }
    w += (j - 1) * parseInt(kerning.value, 10) + 10;
    c.width = w;
    c.height = set.height + 10 + charoffset;
    ctx.fillStyle = set.background ?
                    'rgb(' + c64cols[set.background][0] + ',' +
                             c64cols[set.background][1] + ',' +
                             c64cols[set.background][2] + ')' :
                     background;
    ctx.fillRect(0, 0, c.width, c.height);
    let xoff = set.xoffset ? set.xoffset : 0;
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
        charoff = !charoff
        ctx.drawImage(
          srcimg, set[str[i]][0] + xoff, set.offset, set[str[i]][1],
          set.height, destX, destY + (charoff?charoffset:0) , set[str[i]][1], set.height
        );
        destX += set[str[i]][1] + parseInt(kerning.value, 10);
      }
    }
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
      zoombutton.innerHTML = 'edit logo';
      zoomfactor = 1;
      storelink(dc);
    } else {
      zoombutton.innerHTML = 'Show double size logo';
      zoomfactor = 2;
      storelink(c);
    }
    ev.preventDefault();
  }

  const storelink = (srccanvas) => {
    save.innerHTML = `
    <a href="${srccanvas.toDataURL('image/png')}" 
    download="${input.value}.png">Click to save your logo</a>`;
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

  kerning.addEventListener('change', sanitise, false);
  offsetchar.addEventListener('change', sanitise, false);
  spacing.addEventListener('change',sanitise, false);
  nav.addEventListener('click', pickfont, false);
  c64palette.addEventListener('click', getC64colour, false);
  zoombutton.addEventListener('click', dozoom, false);
  colourbutton.addEventListener('click', endcolouring, false);
  window.addEventListener('load', init, false);
  window.addEventListener('DOMContentLoaded', createFontMenu, false);

})();