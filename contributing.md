# How to contribute

This is a pretty much rough and ready tool and haven't had time to consider making contribution automated. Given the terrible state some of the fonts were in when I got them, a lot was cleaning up by hand.

Now, as I have a real job, I'm not that keen to do all that over and over again, so here is how you can make it easier for me to add more fonts in the future.

* Fonts should be submitted as PNG and PNG only. I don't want to do any ripping myself.
* If you take screenshots, it'd be good to use the pepto colours. If you can't set this, you can use [The C64 colour changer](https://codepo8.github.io/c64-colour-changer/index.html) in your browser to do so. 
* Each font needs to get added to a main file and I need to convert it to pixel values. For this, I am using the [rip.html](rip.html) file, which for now is pretty terrible. However, you can make it easier for me if you create the font encased in green rectangles, like so: 

* This allows me to easily add and convert.
* If you submit a font it would be super helpful to get the information needed, f.e.:
```
    product:'So-Phisticated III',
    year:'1989',
    productlink:'http://csdb.dk/release/?id=11667',
    format:'Bitmap',
    maker:'Orc of Blackmail',
    makerlink: 'http://csdb.dk/scener/?id=8055',
```

* If you want to run the tool locally, you need to access the HTML documents from a local server as by now file:// is considered unsafe by almost any browser. On a Mac you can use the one PHP comes with: 
```
$php -S localhost:8080
```

* Patience is a virtue, I won't be able to add them all the time, best would be to create an issue here so I know when new stuff comes up.
