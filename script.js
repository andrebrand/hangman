class Game {
    word;
    charRegEx = /^[a-zA-Z]*$/i;
    maxErrors = 7;
    guessedChars = [];
    uniqueChars = [];
    wrongChars = [];
    wordDivRef;
    imageRef;
    inputRef;
    overlayRef;
    wrongCharsRef;    

    constructor(wordDivRef, inputRef, buttonRef, imageRef, overlayRef, wrongCharsRef){
        this.wordDivRef = wordDivRef;
        this.imageRef = imageRef;
        this.overlayRef = overlayRef;
        this.inputRef = inputRef;
        this.wrongCharsRef = wrongCharsRef

        // Clear and focus input field
        inputRef.value = '';
        inputRef.focus();

        this.fetchWord()
        .then(word => {
            this.word= word;
            this.paintWord();

            // Filter duplicate chars from word
            this.uniqueChars = [...new Set(this.word.split(''))];
        });

        this.addButtonEventListener(buttonRef, inputRef);
    }

    addButtonEventListener(buttonRef, inputRef){
        // Add event listener to input and button
        buttonRef.addEventListener('click', () => {
            const char = inputRef.value.trim().charAt(0);
            // Check if char was filled and is no special character
            if(!!char && char.match(this.charRegEx)){
                this.guessChar(char.toLowerCase());
            }
        });
    }

    fetchWord(){
        // Fetch random word
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

        // Loop over every char in word
        for (const char of this.word.split('')) {
            // Create DIV to represent a char
            const div = document.createElement('div');
            // Add the actual char to the DIVs innerHTML if it was guessed
            if(this.guessedChars.indexOf(char.toLowerCase()) != -1){
                div.innerHTML = char;
            }
            this.wordDivRef.insertBefore(div, null);
        }
    }

    paintWrongChars(){
        this.wrongCharsRef.innerHTML = '';
        // Loop over every wrong guessed char
        for (const char of this.wrongChars) {
            // Create DIV to represent a char
            const div = document.createElement('div');
            div.innerHTML = char;
            this.wrongCharsRef.insertBefore(div, null);
        }
    }

    guessChar(char) {
        // Check for char in word
        if(this.word.toLowerCase().indexOf(char) != -1){
            // Check if char was already guessed
            if(this.guessedChars.indexOf(char) === -1){
                this.guessedChars.push(char);
                this.paintWord();
                // Compare guessed chars with the unique chars
                if(this.guessedChars.length == this.uniqueChars.length){
                    // Show "success" overlay
                    this.endGame(true);
                }
            }
        }else{
            this.wrongChars.push(char);
            this.updateImage();
            this.paintWrongChars();
            // Check if max. error count is reached
            if(this.errorCount == this.maxErrors){
                // Show "game over" overlay
                this.endGame(false);
            }
        }

        // Reset input field after guess
        this.inputRef.value = '';
        this.inputRef.focus();
    }

    endGame(isSuccess){
        // Show overlay with either "game over" or "success"
        if(isSuccess){
            this.overlayRef.className = 'success';
        }else{
            this.overlayRef.className = 'failed';
        }

        this.overlayRef.style.display = 'flex';
    }
    
    updateImage(){
        this.imageRef.src = 'img/hm' + (this.errorCount + 1) + '.png';
    }

    get errorCount() {
        return this.wrongChars.length;
    }

}


document.addEventListener('DOMContentLoaded', function() {
    // Initalize game
    game = new Game(
        document.getElementById('word'),
        document.getElementById('charInput'),
        document.getElementById('inputButton'),
        document.getElementById('image'),
        document.getElementById('backdrop'),
        document.getElementById('wrongChars')
    );
});