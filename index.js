const form = document.getElementById('search-form');
const input = document.getElementById('word-input');
const searchButton = document.getElementById('search-btn');
const wordText = document.getElementById('word');
const phoneticText = document.getElementById('phonetic');
const audioEl = document.getElementById('audio');
const typeText = document.getElementById('part-of-speech');
const definitionText = document.getElementById('definition');
const exampleText = document.getElementById('example');
const synonymsText = document.getElementById('synonyms');
const sourceLink = document.getElementById('source');
const resultBox = document.getElementById('result');
const errorBox = document.getElementById('error-msg');
const loadingText = document.getElementById('loading');
const themeButton = document.getElementById('theme-btn');
const saveButton = document.getElementById('save-btn');
const savedList = document.getElementById('saved-list');

let savedWords = [];
let currentWord = "";

form.addEventListener('submit', function(e){
    e.preventDefault();
    let word = input.value.trim().toLowerCase();
    if(word === ""){
        errorBox.textContent = "Please type a word first.";
        errorBox.classList.remove('hide');
        return;
    }
    getWord(word);
});

function getWord(word){
    resultBox.classList.add('hide');
    errorBox.classList.add('hide');
    loadingText.classList.remove('hide');
    searchButton.disabled = true;

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(function(response){
        if(!response.ok){
            throw new Error("not found");
        }
        return response.json();
    })
    .then(function(data){
        displayWord(data[0]);
    })
    .catch(function(){
        errorBox.textContent = "Sorry, we could not find '" + word + "'. Try another word.";
        errorBox.classList.remove('hide');
    })
    .finally(function(){
        loadingText.classList.add('hide');
        searchButton.disabled = false;
    });
}

function displayWord(data){
    currentWord = data.word;
    wordText.textContent = data.word;
    phoneticText.textContent = data.phonetic || "";

    let audio = data.phonetics.find(function(p){
        return p.audio;
    });
    if(audio){
        audioEl.src = audio.audio;
        audioEl.classList.remove('hide');
    } else {
        audioEl.classList.add('hide');
    }

    let meaning = data.meanings[0];
    let definition = meaning.definitions[0];

    typeText.textContent = "Part of speech: " + meaning.partOfSpeech;
    definitionText.textContent = "Definition: " + definition.definition;
    exampleText.textContent = definition.example ? "Example: " + definition.example : "";
    synonymsText.textContent = meaning.synonyms.length > 0 ? "Synonyms: " + meaning.synonyms.join(", ") : "No synonyms";
    resultBox.classList.remove('hide');
}

themeButton.addEventListener('click', function(){
    document.body.classList.toggle('dark-mode');
    if(document.body.classList.contains('dark-mode')){
        themeButton.textContent = "Light Mode";
    } else {
        themeButton.textContent = "Dark Mode";
    }
});

saveButton.addEventListener('click', function(){
    if(currentWord === "" || savedWords.includes(currentWord)){
        return;
    }
    savedWords.push(currentWord);
    let li = document.createElement('li');
    li.textContent = currentWord;
    li.addEventListener('click', function(){
        input.value = currentWord;
        getWord(currentWord);
    });
    savedList.appendChild(li);
});