let well =  document.querySelector('#imagewell');
let fullwidth = 0;
let fullheight = 0;
let x = 0;
let i = 0;
// let xsize = 384;
// let ysize = 272;
// let xoffset = 0;
// let yoffset = 0;
let xsize = 320;
let ysize = 200;
let xoffset = 32;
let yoffset = 36;
let swab = document.querySelector('#swab');
let c64palette = document.querySelector('#c64colours');
let container =  document.querySelector('#container');
let save =  document.querySelector('#savebutton');
let undobutton = document.querySelector('#undobutton');
let swatches = document.querySelector('#swatches');
let replacements = document.querySelector('#replacements');
let url = window.URL || window.webkitURL;
let objURL = url.createObjectURL || false;
let fileinput = document.querySelector('#getfile');
let c = document.querySelector('#main');
let ctx = c.getContext('2d');
let zc = document.querySelector('#zoom');
let zcx = zc.getContext('2d');
zc.width = 80;
zc.height = 80;
zcx.imageSmoothingEnabled = false;
zcx.webkitImageSmoothingEnabled = false;
let pixels;
let store;
let colourpicked = false;
let oldpixelcolour;
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

const stitch = (img) => { 
    ctx.drawImage(img,xoffset,yoffset,xsize,ysize,x,0,xsize,ysize);
    x += xsize;
    pixels = ctx.getImageData(0, 0, c.width, c.height);
    analysecolours(pixels.data);
    tosavestring();
}
const getfile = (e) => {
    x = 0;
    let files = [...e.dataTransfer ? e.dataTransfer.files : e.target.files];
    imagewell.innerHTML = '';
    c.width = xsize * files.length;
    c.height = ysize;
    files.forEach(file => {
        if(objURL) {
            loadImage(url.createObjectURL(file),file.name);
        } else {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (ev) => {
                loadImage(ev.target.result,file.name);
            };
        }
    });
    e.preventDefault();
}

const loadImage = (file, name) => {
    let img = new Image();
    img.src = file;
    img.onload = function() {
        imagewell.appendChild(img);
        stitch(img)
    };
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

const replacecolour = (data, oldcolour, newcolour) => {
    let all = pixelbuffer.length;
    undobutton.classList.remove('inactive');
    store = ctx.getImageData(0, 0, c.width, c.height);
    for(let j = 0; j < all; j++) {
        let i = pixelbuffer[j];
        pixels.data[i] = newcolour[0];
        pixels.data[i+1] = newcolour[1];
        pixels.data[i+2] = newcolour[2];
        pixels.data[i+3] = newcolour[3];
    }
    ctx.putImageData(pixels, 0, 0);
    if(oldswatch) {
        oldswatch?.remove();
    }
    tosavestring();
}

const tosavestring = () => save.href = c.toDataURL('image/png'); 

const showzoom = (ev) => {
    let getpos = getposition(ev);
    let x = getpos.x;
    let y = getpos.y;
    let sx = (x-5) < 0 ? 0 : x-5;
    let sy = (y-5) < 0 ? 0 : y-5;
    zcx.fillStyle = '#000';
    zcx.fillRect(0,0,80,80);
    zcx.drawImage(c,sx,sy,10,10,0,0,80,80);
    zcx.strokeStyle = 'black';
    zcx.lineWidth = 1;
    zcx.lineCap = 'square';
    zcx.strokeRect(30,40,20,10);
}

const getposition = (ev) => {
    let x = ev.clientX;
    let y = ev.clientY;
    let pos = c.getBoundingClientRect();
    return {x: x - pos.x|1, y: y-pos.y|1};
}

const readcolour = (ev) => {
    let getpos = getposition(ev);
    let x = getpos.x;
    let y = getpos.y;
    swab.style.background = 'rgba('+
    pixelcolour(x, y).r + ',' +
    pixelcolour(x, y).g + ',' +
    pixelcolour(x, y).b + ',' +
    pixelcolour(x, y).a + ')';
    if (ev.type === 'click') {
        oldpixelcolour = pixelcolour(x,y);
        getpixelsofcolour(pixelcolour(x,y));
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

const analysecolours = (pixels) => {
    let all = pixels.length;
    let coloursused = {};
    let i = 0;
    let j = 0;
    for (i = 0; i < all; i+=4) {
        coloursused[pixels[i]+'|'+pixels[i+1]+'|'+pixels[i+2]+
        '|'+pixels[i+3]] = pixels[i]+pixels[i+1]+pixels[i+2]+
        pixels[i+3];
    }
    let out = '';
    let out2 = '';
    let replace = null;
    for (i in coloursused) {
        out += `<button class="swatch" style="background:rgba(${i.replace(/\|/g,',')})"data-col="${i}"></button>`;
        for (j in c64cols) {
            let jcol = c64cols[j];
            let c = i.split('|');
            if(Math.abs(c[0] - jcol[0]) < 60 && 
                Math.abs(c[1] - jcol[1]) < 60 && 
                Math.abs(c[2] - jcol[2]) < 60) {
                out2 += `<button class="swatch" style="background:rgba(${i.replace(/\|/g,',')})"data-col="${i}"></button>`;
                replace = jcol.join(',');
                break;
            } 
        }
    }
    swatches.innerHTML = out;
}

const undo = () => {
    if (store.data) { 
        ctx.putImageData(store, 0, 0);
    }
}

const pixelcolour = (x, y) => {
    let pixeldata = ctx.getImageData(x,y,1,1);
    return {
        r: pixeldata.data[0],
        g: pixeldata.data[1],
        b: pixeldata.data[2],
        a: pixeldata.data[3]
    };
}

const imagetocanvas = (img, w, h, name) => {
    c.width = w;
    c.height = h;
    ctx.drawImage(img, 0, 0, w, h);
    pixels = ctx.getImageData(0, 0, c.width, c.height);
    analysecolours(pixels.data);
    tosavestring();
}

c.addEventListener('click', ev => {
    readcolour(ev);
    colourpicked = true;
}, false);

undobutton.addEventListener('click', ev => {
    undo();
}, false);

c.addEventListener('mousemove', ev => {
    if (!colourpicked) {
        readcolour(ev);
    }
    showzoom(ev);
}, false);

let oldswatch = false;
const swatchpicked = (ev) => {
    let t = ev.target;
    oldswatch = t;
    if (t.nodeName === 'BUTTON') {
        let col = t.dataset.col.split('|');
        let colobj = {
            r: +col[0],
            g: +col[1],
            b: +col[2],
            a: +col[3]
        }
        oldpixelcolour = colobj;
        getpixelsofcolour(colobj);
    }
}

swatches.addEventListener('click', swatchpicked, false);
c64palette.addEventListener('click', getC64colour, false);
container.addEventListener('dragover', ev => ev.preventDefault());
container.addEventListener('drop', getfile, false);
fileinput.addEventListener('change', getfile, false);