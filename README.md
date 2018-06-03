# 8-Bit BeepPianoJS

BeepPianoJS is simple piano generator using AudioContext.

# How to use
 - Include BeepPiano.js to your HTML application

```javascript
 var beepPiano = new Beep_Piano(
        {
            x: 100,          // Left position of piano
            y: 100,          // Top position of piano
            w: 1155,         // Piano width size
            h: 500,          // Piano height size
            octave: 5,       // Start octave
            waveType: 'sine' // Wave for piano. 'sine', 'square', 'triangle', 'sawtooth' available.
        }
    );
```
 

Reference : http://marcgg.com/blog/2016/11/01/javascript-audio/
