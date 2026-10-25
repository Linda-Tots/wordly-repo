// get all elements from HTML
const form = document.getElementById('search-form');
const input = document.getElementById('word-input');
const wordText = document.getElementById('word');
const phoneticText = document.getElementById('phonetic');
const typeText = document.getElementById('part-of-speech');
const definitionText = document.getElementById('definition');
const exampleText = document.getElementById('example');
const synonymsText = document.getElementById('synonyms');
const sourceLink = document.getElementById('source');
const resultBox = document.getElementById('result');
const errorBox = document.getElementById('error-msg');
const themeButton = document.getElementById('theme-btn');
const saveButton = document.getElementById('save-btn');
const savedList = document.getElementById('saved-list');

let savedWords = [];
let currentWord = "";

form.addEventListener('submit', function(e){
    e.preventDefault();
    const word = input.value.trim();
    if(word === ""){
        return;
    }
    getWord(word);
});

function getWord(word){
    resultBox.classList.add('hide');
    errorBox.classList.add('hide');
    errorBox.textContent = "";

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(function(response){
        if(!response.ok){
            throw new Error("Word not found");
        }
        return response.json();
    })
    .then(function(data){
        displayWord(data[0]);
    })
    .catch(function(){
        errorBox.textContent = "Sorry, we could not find '" + word + "'. Try another word.";
        errorBox.classList.remove('hide');
    });
}

function displayWord(data){
    currentWord = data.word;
    wordText.textContent = data.word;
    phoneticText.textContent = data.phonetic || "";
    
    const meaning = data.meanings[0];
    typeText.textContent = meaning.partOfSpeech;
    definitionText.textContent = "Definition: " + meaning.definitions[0].definition;
    exampleText.textContent = meaning.definitions[0].example ? "Example: " + meaning.definitions[0].example : "";
    synonymsText.textContent = meaning.synonyms ? meaning.synonyms.join(", ") : "No synonyms";
    sourceLink.href = data.sourceUrls[0];

    resultBox.classList.remove('hide');
}

let darkMode = false;
themeButton.addEventListener('click', function(){
    document.body.classList.toggle('dark-mode');
    darkMode = !darkMode;
    themeButton.textContent = darkMode ? "Light Mode" : "Dark Mode";
});

saveButton.addEventListener('click', function(){
    if(currentWord === "") return;
    
    if(!savedWords.includes(currentWord)){
        savedWords.push(currentWord);
        const li = document.createElement('li');
        li.textContent = currentWord;
        li.classList.add('saved-word');
        li.addEventListener('click', function(){
            input.value = currentWord;
            getWord(currentWord);
        });
        savedList.appendChild(li);
        saveButton.textContent = "Saved!";
    }
});