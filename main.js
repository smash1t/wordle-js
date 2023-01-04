

const answer = getAnswer();
const keyCodes = {
    "row1": [{'Q':80},
    {'W':87},
    {'E':69},
    {'R':82},
    {'T':84},
    {'Y':89},
    {'U':85},
    {'I':73},
    {'O':79},
    {'P':80}],
    "row2":[
    {'A':65},
    {'S':83},
    {'D':68},
    {'F':70},
    {'G':71},
    {'H':72},
    {'J':74},
    {'K':75},
    {'L':76}],
    "row3":[
    {'Z':90},
    {'X':88},
    {'C':67},
    {'V':86},
    {'B':66},
    {'N':78},
    {'M':77}]
};

window.onload = function(){
    boardReset();
    keyBoard();
    setActiveRow();
    console.log(answer);
    document.getElementById("active").children[0].focus();
}


document.addEventListener("keydown", function (event) {
    if(event.key == "Enter"){
        validateEntry(getWord());
    }
    if(event.key == "Backspace"){
        if(event.target.previousElementSibling && event.target.value == ""){
            event.target.previousElementSibling.focus();
        }
    }
    else if (event.target.value && event.target.nextElementSibling) {
        event.target.nextElementSibling.focus();
    }
});


function setActiveRow(){
    let l = document.getElementsByClassName("letter");
    for(let i = 0; i < l.length; i++){
        l[i].setAttribute("disabled","true");
    }
    let elts = document.getElementById("active").children;
    Array.from(elts).forEach(function(elt){
        elt.removeAttribute("disabled");
    });
}

function getAnswer(){
    let answers = ["GREAT","WEARY","ABOUT","CHAIR","CURIO","SATYR","FLANK","QUICK","STYLE","MERRY","FUDGE","AVERT","ERROR","SMART"];
    return answers[Math.floor(Math.random() * answers.length)];
}

function keyBoard(){
    const el =  document.getElementById("keyboard");
    for(let i in keyCodes){
        const elm = document.getElementById(`${i}`);
        keyCodes[i].forEach(key => {
            for(let e in key){
                elm.innerHTML += `<button id=${e}>${e}</button>`;
            }
        });
    }
}

function goToNextInput(e){
    var elms = document.getElementById("active").children;
    Array.from(elms).forEach(function(elm){
        elm.removeAttribute("disabled");
    });
    document.getElementById("active").children[0].focus();
}

function getWord(){
    const activeRowNodes = document.getElementById("active").children;
    const inputArr = [];
    for(let i = 0; i < activeRowNodes.length; i++){
        let ltr = activeRowNodes[i].value.toUpperCase();
        inputArr.push(ltr);
    }
    return inputArr.join(""); 
}

function boardReset(){
    const inputRows = document.getElementsByClassName("word-row");
    for(let i = 0; i < inputRows.length; i++){
        for(let e = 0; e < inputRows[i].children.length; e++){
            inputRows[i].children[e].value = "";
        }
    }
}
const validateEntry = async function(word){
    let entry = getWord().split(",");
    if(entry.includes(undefined) || entry.includes("")){
        alert("not enough letters");
    }else{
        
        let response = await fetch( `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if(response.ok){
            let json = await response.json();
            checkWord();
        }else{
            alert("Word not found");
        }
    }
    
}

function checkWord(){
    if(getWord().length >= answer.length){
        const guess = getWord().split("");
        let activeRow = document.getElementById("active");
        const inputLtrs = activeRow.getElementsByClassName("letter");
        const correct = [];
        const ansDupes = answer.split("").filter((item,idx) => answer.split("").indexOf(item) !== idx);
        let dupeCount = 0;
        if(!guess.includes("")){
            if(guess.join("") == answer){
                alert(`CORRECT! The answer was ${answer}!`);
            }else{
                for(let i = 0; i < guess.length; i++){
                    if(i === 0){
                        document.getElementById(guess[i]).className = "";
                    }
                    if(!answer.includes(guess[i])){
                        continue;
                    }
                    else if(answer.includes(guess[i])){
                        if(guess[i] === answer[i]){
                            correct.push(guess[i]);
                            document.getElementById(guess[i]).className = "";
                            document.getElementById(guess[i]).classList.add("correct");
                            inputLtrs[i].classList.add("correct");
                            continue;
                        }else if(ansDupes.length >= 1 && ansDupes.includes(guess[i])){
                            dupeCount++;
                            if(dupeCount <= ansDupes.length){
                                document.getElementById(guess[i]).className = "";
                                document.getElementById(guess[i]).classList.add("change");
                                inputLtrs[i].classList.add("change");
                            }else{
                                continue;
                            }
                        }else if(!ansDupes.includes(guess[i]) && !correct.includes(guess[i])){
                            document.getElementById(guess[i]).className = "";
                            document.getElementById(guess[i]).classList.add("change");
                            inputLtrs[i].classList.add("change");
                        }
                        
                        
                    }
                }
                
                if(activeRow.nextElementSibling){
                    activeRow.id = "";
                    activeRow.nextElementSibling.id="active";
                }else if(activeRow.classList.contains("last")){
                    alert("No more attempts left! Reset board & try again?");
                }
                goToNextInput();
            }
            
            
        }
        
    }
    
    setActiveRow();
}
