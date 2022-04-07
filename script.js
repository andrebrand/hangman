class Game {
    word;
    wordDivRef;
    imageRef;
    charRegEx = /^[a-zA-Z]*$/i;
    maxErrors = 7;
    guessedChars = [];
    wrongChars = [];

    constructor(wordDivRef, inputRef, buttonRef, imageRef){

        this.fetchWord()
        .then(word => {
            this.word= word;
            this.paintWord();
        });
        inputRef.value = '';
        inputRef.focus();
        this.wordDivRef = wordDivRef;
        this.imageRef = imageRef;

        this.addButtonEventListener(buttonRef, inputRef);
    }

    addButtonEventListener(buttonRef, inputRef){
        buttonRef.addEventListener('click', () => {
            const char = inputRef.value.trim().charAt(0);
            if(!!char && char.match(this.charRegEx)){
                this.guessChar(char.toLowerCase());
            }
        });
    }

    fetchWord(){
        return fetch('https://random-word-api.herokuapp.com/word?number=1&lang=de')
            .then(result => result.json())
            .then(data => {
                if (data[0].match(this.charRegEx) && data[0].length <= 10) {
                    return data[0];
                }else{
                    return this.fetchWord();
                }
            });
    }

    paintWord(){
        this.wordDivRef.innerHTML = '';
        this.word.split('').forEach(char => {
            const div = document.createElement('div');
            if(this.guessedChars.indexOf(char.toLowerCase()) != -1){
                div.innerHTML = char;
            }
            this.wordDivRef.insertBefore(div, null);
        });
    }

    guessChar(char) {
        if(this.word.toLowerCase().indexOf(char) != -1){
            if(this.guessedChars.indexOf(char) === -1
                && this.errorCount < this.maxErrors){
                this.guessedChars.push(char);
                this.paintWord();
            }
            
        }else if(this.errorCount < this.maxErrors){
            this.wrongChars.push(char);
            this.updateImage();
        }
    }
    
    updateImage(){
        this.imageRef.src = 'img/hm' + (this.errorCount + 1) + '.png';
    }

    get errorCount() {
        return this.wrongChars.length;
    }

}


document.addEventListener('DOMContentLoaded', function() {
    game = new Game(
        document.getElementById('word'),
        document.getElementById('charInput'),
        document.getElementById('inputButton'),
        document.getElementById('image')
    );
});