# C64 Logo generator 

Using fonts ripped from lots of Commodore 64 demos of old, you can now add some 8 bit fun and frolics to your products. Simply choose a font, type in your texts, change colours as needed and save a PNG of your logo in either real resolution or double size. 

Under the hood, all we do is take letter images from a massive canvas (`img/canvas.png`) and stitch them together on a new canvas. 

## Font settings

You can see all the settings of the fonts in the `fonts.js` JSON set. If you know any credits we forgot, please add them. You are also very encouraged to fix positioning issues. Each font set contains:

* `product` - the product the font was ripped from
* `year` - the release year
* `productlink` - the CSDB link to the product 
* `format` - the original C64 file format
* `maker` - the handle of the original creator
* `makerlink` - CSDB link of the creator
* `offset` - amount of pixels from top the font starts
* `height` - height of the font
* `a-z` (and special characters): array with start pixel coordinate and width of each character

## Credits

* Idea and code by Chris 'Cupid' Heilmann - ported from the original tool written in  PHP using gd
* Charset ripping and credit research by Dejan 'Nucleus' Petronijevic, Daniel Kottmair and Chris Heilmann
* Charset cleanup and transparency adding by Daniel 'Deekay' Kottmair

## How to rip your own fonts:

1. find a demo with a nice font
2. while running a demo in the vice emulator, enter a monitor (alt+m)
3  search for  a pattern of a scrolltext in that demo (part) using `h 0800
d000 03 0f 04 05` (hexadecimal example for "code")
4. find a memory block where scrolltext is located
5. fill it with `f 4000 4200 01 02 03 04 05 06 07 08 09 0a 0b` --- untill `3f` (`abcdefgh...`)
6. exit the monitor with x
7. take screenshots with alt+c (save media file)
8. snap the alphabet (and extra characters/numbers) in your favorite picture editing program
9. send it to us
