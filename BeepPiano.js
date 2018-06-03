/************************
 * 
 * Example
 *  var beepPiano = new Beep_Piano(
 *         {
 *             x: 100,          // Piano position left
 *             y: 100,          // Piano position top
 *             w: 1155,         // Piano size width
 *             h: 500,          // Piano size height
 *             octave: 4,       // Start octave
 *             waveType: 'sine' // Wave type for used
 *         }
 *     );
 *  * 
 * 
 */

var Beep_Piano = (function () {

    // Additional prototype function
    Object.size = function (obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    // Constants
    var ALLOW_WAVE_TYPE = [
        'sine',
        'square',
        'triangle',
        'sawtooth'
    ];

    var OCTAVE_LIMIT = {
        MIN: 0,
        MAX: 6
    }
    /**
     * Key value
     * 
     *  C# Eb    F# G# Bb   -- Max length : (6 - 1)
     * C  D  E  F  G  A  B  -- Max length : 7
     */

    //  Keyboard mapping
    var KEY_CODE_PIANO_ARRAY = {
        BLACK0: 'SD GHJ',
        WHITE0: 'ZXCVBNM', // Start octave,
        BLACK1: '45 789',
        WHITE1: 'ERTYUIO', // Start+1 octave,
    }

    var PIANO_NOTE = {
        WHITE: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
        BLACK: ['C#', 'Eb', '', 'F#', 'G#', 'Bb']
    }

    // Reference : https://gist.github.com/marcgg/94e97def0e8694f906443ed5262e9cbb
    var PIANO_FREQ_VALUE = {
        'C0': 16.35, 'C#0': 17.32, 'Db0': 17.32, 'D0': 18.35, 'D#0': 19.45, 'Eb0': 19.45, 'E0': 20.60, 'F0': 21.83, 'F#0': 23.12,
        'Gb0': 23.12, 'G0': 24.50, 'G#0': 25.96, 'Ab0': 25.96, 'A0': 27.50, 'A#0': 29.14, 'Bb0': 29.14, 'B0': 30.87,
        'C1': 32.70, 'C#1': 34.65, 'Db1': 34.65, 'D1': 36.71, 'D#1': 38.89, 'Eb1': 38.89, 'E1': 41.20, 'F1': 43.65, 'F#1': 46.25,
        'Gb1': 46.25, 'G1': 49.00, 'G#1': 51.91, 'Ab1': 51.91, 'A1': 55.00, 'A#1': 58.27, 'Bb1': 58.27, 'B1': 61.74,
        'C2': 65.41, 'C#2': 69.30, 'Db2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'Eb2': 77.78, 'E2': 82.41, 'F2': 87.31, 'F#2': 92.50,
        'Gb2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'Ab2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'Bb2': 116.54, 'B2': 123.47,
        'C3': 130.81, 'C#3': 138.59, 'Db3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00,
        'Gb3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'Ab3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'Bb3': 233.08, 'B3': 246.94,
        'C4': 261.63, 'C#4': 277.18, 'Db4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99,
        'Gb4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'Ab4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'Bb4': 466.16, 'B4': 493.88,
        'C5': 523.25, 'C#5': 554.37, 'Db5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'Eb5': 622.25, 'E5': 659.26, 'F5': 698.46, 'F#5': 739.99,
        'Gb5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'Ab5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'Bb5': 932.33, 'B5': 987.77,
        'C6': 1046.50, 'C#6': 1108.73, 'Db6': 1108.73, 'D6': 1174.66, 'D#6': 1244.51, 'Eb6': 1244.51, 'E6': 1318.51, 'F6': 1396.91, 'F#6': 1479.98,
        'Gb6': 1479.98, 'G6': 1567.98, 'G#6': 1661.22, 'Ab6': 1661.22, 'A6': 1760.00, 'A#6': 1864.66, 'Bb6': 1864.66, 'B6': 1975.53,
        'C7': 2093.00, 'C#7': 2217.46, 'Db7': 2217.46, 'D7': 2349.32, 'D#7': 2489.02, 'Eb7': 2489.02, 'E7': 2637.02, 'F7': 2793.83, 'F#7': 2959.96,
        'Gb7': 2959.96, 'G7': 3135.96, 'G#7': 3322.44, 'Ab7': 3322.44, 'A7': 3520.00, 'A#7': 3729.31, 'Bb7': 3729.31, 'B7': 3951.07,
        'C8': 4186.01
    }
    /**
     * PIANO_PLAYING_STATUS[some] = {
     *     FREQUENCE : number,
     *     PLAYING: true/false,
     *     AudioContext: new AudioContext(),
     *     Oscillator: AudioContext.createOscillator();
     * }
     * 
     */
    var PIANO_PLAYING_STATUS = {
        'C0': {}, 'C#0': {}, 'Db0': {}, 'D0': {}, 'D#0': {}, 'Eb0': {}, 'E0': {}, 'F0': {}, 'F#0': {},
        'Gb0': {}, 'G0': {}, 'G#0': {}, 'Ab0': {}, 'A0': {}, 'A#0': {}, 'Bb0': {}, 'B0': {},
        'C1': {}, 'C#1': {}, 'Db1': {}, 'D1': {}, 'D#1': {}, 'Eb1': {}, 'E1': {}, 'F1': {}, 'F#1': {},
        'Gb1': {}, 'G1': {}, 'G#1': {}, 'Ab1': {}, 'A1': {}, 'A#1': {}, 'Bb1': {}, 'B1': {},
        'C2': {}, 'C#2': {}, 'Db2': {}, 'D2': {}, 'D#2': {}, 'Eb2': {}, 'E2': {}, 'F2': {}, 'F#2': {},
        'Gb2': {}, 'G2': {}, 'G#2': {}, 'Ab2': {}, 'A2': {}, 'A#2': {}, 'Bb2': {}, 'B2': {},
        'C3': {}, 'C#3': {}, 'Db3': {}, 'D3': {}, 'D#3': {}, 'Eb3': {}, 'E3': {}, 'F3': {}, 'F#3': {},
        'Gb3': {}, 'G3': {}, 'G#3': {}, 'Ab3': {}, 'A3': {}, 'A#3': {}, 'Bb3': {}, 'B3': {},
        'C4': {}, 'C#4': {}, 'Db4': {}, 'D4': {}, 'D#4': {}, 'Eb4': {}, 'E4': {}, 'F4': {}, 'F#4': {},
        'Gb4': {}, 'G4': {}, 'G#4': {}, 'Ab4': {}, 'A4': {}, 'A#4': {}, 'Bb4': {}, 'B4': {},
        'C5': {}, 'C#5': {}, 'Db5': {}, 'D5': {}, 'D#5': {}, 'Eb5': {}, 'E5': {}, 'F5': {}, 'F#5': {},
        'Gb5': {}, 'G5': {}, 'G#5': {}, 'Ab5': {}, 'A5': {}, 'A#5': {}, 'Bb5': {}, 'B5': {},
        'C6': {}, 'C#6': {}, 'Db6': {}, 'D6': {}, 'D#6': {}, 'Eb6': {}, 'E6': {}, 'F6': {}, 'F#6': {},
        'Gb6': {}, 'G6': {}, 'G#6': {}, 'Ab6': {}, 'A6': {}, 'A#6': {}, 'Bb6': {}, 'B6': {},
        'C7': {}, 'C#7': {}, 'Db7': {}, 'D7': {}, 'D#7': {}, 'Eb7': {}, 'E7': {}, 'F7': {}, 'F#7': {},
        'Gb7': {}, 'G7': {}, 'G#7': {}, 'Ab7': {}, 'A7': {}, 'A#7': {}, 'Bb7': {}, 'B7': {},
        'C8': {}
    }


    // Flags

    // Private values
    var octave,
        waveType;

    var AUDIOCONTEXT,
        OSCILLATOR;

    var NUM_OF_PRESSING_KEYS = 0;

    function Beep_Piano(pianoObject) {
        for (var i = 0; i < ALLOW_WAVE_TYPE.length; i++) {
            if (pianoObject.waveType === ALLOW_WAVE_TYPE[i]) {
            }
        }

        octave = pianoObject.octave;
        waveType = pianoObject.waveType;

        pianoAudioInitialize();
        render(
            pianoObject.x,
            pianoObject.y,
            pianoObject.w,
            pianoObject.h,
            pianoObject.startKey
        );
    }
    // var context = new AudioContext()
    // var o = context.createOscillator()
    // o.type = "sine"
    // o.connect(context.destination)
    // o.frequency.value = 1047.0;
    // o.start()
    function pianoAudioInitialize() {
        for (var i in PIANO_PLAYING_STATUS) {
            var status = PIANO_PLAYING_STATUS[i];
            status.Note = i;
            status.FREQUENCE = findFrequenceByKeyNoTeValue(i);
            status.PLAYING = false;
        }
        AUDIOCONTEXT = new AudioContext();
        OSCILLATOR = AUDIOCONTEXT.createOscillator();
        OSCILLATOR.type = waveType;
        OSCILLATOR.start();
    }

    function playBeep(status) {
        if (NUM_OF_PRESSING_KEYS === 0) {
            NUM_OF_PRESSING_KEYS++;
            OSCILLATOR.connect(AUDIOCONTEXT.destination);
            OSCILLATOR.frequency.value = status.FREQUENCE;
            status.PLAYING = true;
        }
    }
    function stopBeep(status) {
        NUM_OF_PRESSING_KEYS--;
        OSCILLATOR.disconnect(AUDIOCONTEXT.destination);
        status.PLAYING = false;

        // OSCILLATOR.stop();

    }

    function findFrequenceByKeyNoTeValue(keynote) {
        for (var i in PIANO_FREQ_VALUE) {
            if (i === keynote) {
                return PIANO_FREQ_VALUE[i];
            }
        }
        return -1;
    }

    function addPianoEventListener(pianoBody) {
        document.body.addEventListener('keyup', function (e) {
            // e.preventDefault();
            var keyboardValue = String.fromCharCode(e.keyCode);
            for (var j in KEY_CODE_PIANO_ARRAY) {
                // console.log(j + ' : ' + KEY_CODE_PIANO_ARRAY[j])
                for (var i = 0; i < KEY_CODE_PIANO_ARRAY[j].length; i++) {
                    // console.log(KEY_CODE_PIANO_ARRAY[j][i])
                    if (keyboardValue === KEY_CODE_PIANO_ARRAY[j][i]) {
                        var noteColor = j.indexOf('BLACK') >= 0 ? 'BLACK' : 'WHITE';
                        var keynote = (PIANO_NOTE[noteColor][i] + octave);
                        if (PIANO_PLAYING_STATUS[keynote].PLAYING === true) {
                            stopBeep(PIANO_PLAYING_STATUS[keynote]);
                        }
                        return;
                    }
                }
            }
        });

        document.body.addEventListener('keydown', function (e) {
            // e.preventDefault();
            var keyboardValue = String.fromCharCode(e.keyCode);
            for (var j in KEY_CODE_PIANO_ARRAY) {
                // console.log(j + ' : ' + KEY_CODE_PIANO_ARRAY[j])
                for (var i = 0; i < KEY_CODE_PIANO_ARRAY[j].length; i++) {
                    // console.log(KEY_CODE_PIANO_ARRAY[j][i])
                    if (keyboardValue === KEY_CODE_PIANO_ARRAY[j][i]) {
                        var noteColor = j.indexOf('BLACK') >= 0 ? 'BLACK' : 'WHITE';

                        // console.log('Press : ' + KEY_CODE_PIANO_ARRAY[j][i])
                        // console.log(noteColor);

                        // console.log(KEY_CODE_PIANO_ARRAY[j][i] + octave)
                        // console.log(PIANO_NOTE)
                        var keynote = (PIANO_NOTE[noteColor][i] + octave);
                        if (PIANO_PLAYING_STATUS[keynote].PLAYING === false) {
                            playBeep(PIANO_PLAYING_STATUS[keynote]);
                        }
                        return;
                    }
                }
            }
        });
    }

    function render(x, y, w, h, startKey) {
        /*******
         *   Render piano keys and set events
         * 
         *   |--------------- 33 ------------|
         *    4   5   5   4 4   5   5   5   4  = 41
         *   +--+---+---+--+--+---+---+---+--+
         *   |  |###|###|  |  |###|###|###|  |
         *   |  |###|###|  |  |###|###|###|  |
         *   |  +---+---+  |  +---+---+---+  |
         *   |    |   |    |    |   |   |    |
         *   |    |   |    |    |   |   |    |
         *   +----+---+----+----+---+---+----+
         *     6    5    6   6    5   5   6    = 39
         */
        var pianoBody = document.createElement('div');

        // Draw white first
        for (var i = 0; i < 7; i++) {
            var whiteKey = document.createElement('div');
            whiteKey.setAttribute('class', 'WhiteKey');
            whiteKey.setAttribute('id', PIANO_NOTE.WHITE[i] + octave);
            whiteKey.style.border = '1px outset #000000';
            whiteKey.style.backgroundColor = '#EEEEEE';
            whiteKey.style.position = 'absolute'
            whiteKey.style.width = (parseInt(w / 7)) + 'px'
            whiteKey.style.height = h + 'px'
            whiteKey.style.left = (x) + parseInt((i / 7) * w) + 'px'
            whiteKey.style.top = y + 'px'

            var text = document.createElement('div');
            text.style.textAlign = 'center';
            text.style.fontSize = '50px';
            text.style.bottom = '10px';
            text.style.position = 'absolute';
            text.innerHTML = KEY_CODE_PIANO_ARRAY['WHITE0'][i];

            whiteKey.appendChild(text);
            pianoBody.appendChild(whiteKey);
        }

        // Draw black second
        for (var i = 0; i < 6; i++) {
            // No black piano note position
            if (PIANO_NOTE.BLACK[i] === '') continue;
            var blackKey = document.createElement('div');
            blackKey.setAttribute('class', 'BlackKey');
            blackKey.setAttribute('id', PIANO_NOTE.BLACK[i] + octave);
            blackKey.style.border = '1px outset #111111';
            blackKey.style.backgroundColor = '#111111';
            blackKey.style.position = 'absolute'
            blackKey.style.width = (parseInt((w / 7)) * 0.6) + 'px'
            blackKey.style.height = h * (3 / 5) + 'px'
            blackKey.style.left = ((w / 10) + x) + parseInt((i / 7) * w) + 'px'
            blackKey.style.top = y + 'px'


            var text = document.createElement('div');
            text.style.textAlign = 'center';
            text.style.color = '#FFFFFF';
            text.style.fontSize = '50px';
            text.style.bottom = '10px';
            text.style.position = 'absolute';
            text.innerHTML = KEY_CODE_PIANO_ARRAY['BLACK0'][i];

            blackKey.appendChild(text);
            pianoBody.appendChild(blackKey);
        }

        document.body.appendChild(pianoBody);
        addPianoEventListener(pianoBody);
        return pianoBody;
    }

    Beep_Piano.prototype.get = function () {
        console.log(octave)
        console.log(waveType)
    }

    return Beep_Piano;

})();

window.onload = function () {
    var beepPiano = new Beep_Piano(
        {
            x: 100, y: 100, w: 1155, h: 500,
            octave: 5, waveType: 'sine'
        }
    );
}
