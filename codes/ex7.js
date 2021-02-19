let start_time;
let elapsed_time = 0;

let isStart = false;


let startButton = document.querySelector('.start');
let stopButton = document.querySelector('.stop');
let resetButton = document.querySelector('.reset');

function displayTime() {
    if(isStart){
        elapsed_time += Date.now() - start_time;
        start_time = Date.now();
    }


    let elapsed_sec = Math.floor(elapsed_time / 1000);
    let hour = Math.floor(elapsed_sec / 3600);
    let min = Math.floor((elapsed_sec - hour * 60) / 60);
    let sec = Math.floor((elapsed_sec - hour * 3600 - min * 60));

    let time_string = 
        hour.toString().padStart(2,'0') + " : " +
        min.toString().padStart(2,'0') + " : " + 
        sec.toString().padStart(2,'0');

    document.querySelector('.clock').textContent = time_string;
}

displayTime();
const createClock = setInterval(displayTime, 1000);
startButton.addEventListener('click', () => {
    isStart = true
    start_time = Date.now();
});
stopButton.addEventListener('click', () => isStart = false);
resetButton.addEventListener('click', () => {
    isStart = false;
    elapsed_time = 0
});


