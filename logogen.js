/*
  Logo-o-Matic Canvas version
  Homepage: http://github.com/codepo8/logo-o-matic
  Copyright (c) 2011 Christian Heilmann
  Code licensed under the BSD License:
  http://wait-till-i.com/license.txt
*/
(function(){
  if(document.querySelector){
    var fonts = {
          ollie:{
            height:52,a:[4,40],b:[45,38],c:[86,37],d:[123,40],e:[163,40],
            f:[203,33],g:[246,36],h:[286,36],i:[335,13],j:[365,32],k:[405,39],
            l:[455,15],m:[486,61],n:[550,39],o:[590,39],p:[630,39],q:[670,37],
            r:[708,41],s:[756,30],t:[790,37],u:[833,36],v:[871,37],w:[910,65],
            x:[983,30],y:[1015,40],z:[1063,34],offset:200
          },
          qpd:{
            height:33,a:[3,24],b:[27,24],c:[51,24],d:[75,24],e:[99,24],
            f:[123,24],g:[147,24],h:[171,24],i:[195,24],j:[219,24],k:[243,24],
            l:[267,24],m:[291,24],n:[315,24],o:[339,24],p:[363,24],q:[387,24],
            r:[411,24],s:[435,24],t:[459,24],u:[483,24],v:[507,24],w:[531,24],
            x:[555,24],y:[581,24],z:[605,24],offset:80
          }, 
          rrr1:{
            height:74,a:[3,32],b:[35,32],c:[67,32],d:[99,32],e:[131,32],
            f:[163,32],g:[195,32],h:[227,32],i:[259,16],j:[275,16],k:[291,32],
            l:[323,16],m:[339,48],n:[387,32],o:[419,32],p:[451,32],q:[486,32],
            r:[520,18],s:[539,32],t:[571,32],u:[603,32],v:[635,32],w:[667,48],
            x:[715,32],y:[747,32],z:[779,32],offset:0
          }, 
          rrr2:{
            height:58,a:[3,32],b:[35,32],c:[67,32],d:[99,32],e:[131,32],
            f:[163,32],g:[195,32],h:[227,32],i:[259,16],j:[275,32],k:[307,32],
            l:[339,32],m:[372,48],n:[419,32],o:[451,32],p:[482,32],q:[515,32],
            r:[547,32],s:[579,32],t:[611,32],u:[643,32],v:[676,32],w:[707,48],
            x:[755,32],y:[789,32],z:[820,32],offset:120
          }
        },
        n = document.querySelector('#nav'),
        ctx = document.querySelector('canvas').getContext('2d'),
        srcimg = document.querySelector('#fonts'),
        save = document.querySelector('#save'),
        input = document.querySelector('#text'),
        old = document.querySelector('.current'),
        set = fonts[old.id],
        valid = /^[a-z]+$/,
        rep = /[^a-z]+/g,
        url = document.location.href.split('?text=')[1];

    if(url){
      sanitise(url);
    }; 

    n.addEventListener('click',function(e){
      var t = e.target;
      if(t.tagName==='IMG'){
        set = fonts[t.id];
        old.className = '';
        t.className = 'current';
        old = t;
        sanitise(input.value);
      }
      e.preventDefault();
    },false);

    input.addEventListener('keyup',function(e){
      sanitise(input.value);
      e.preventDefault();
    },false);

    function sanitise(s){
      s = s.toLowerCase();
      if(!valid.test(s)){ s = s.replace(rep,''); }
      input.value = s;
      if(s){
        draw(s);
      }
    };

    function draw(s){
      var str = s.split(''), w = 0, h = 0, i = 0, j = str.length;
      var destX = 5;
      var destY = 5;
      for(i=0;i<j;i++){ 
        w += set[str[i]][1]; 
      }
      ctx.canvas.width = w + 10;
      ctx.canvas.height = set.height + 10;
      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      for(i=0;i<j;i++){
        ctx.drawImage(
          srcimg, set[str[i]][0], set.offset, set[str[i]][1], 
          set.height, destX, destY, set[str[i]][1], set.height
        );
        destX += set[str[i]][1];
      }
      var img = document.createElement('img');
      save.innerHTML = '';
      save.appendChild(img);
      img.src = ctx.canvas.toDataURL('image/png');
    };    
  }
})();