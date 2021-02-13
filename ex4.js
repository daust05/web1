const customName = document.getElementById('customname');
const randomize = document.querySelector('.randomize');
const story = document.querySelector('.story');

let storyText = "It was 94 fahrenheit outside, so :insertx: went for a walk. When they got to :inserty:, they stared in horror for a few moments, then :insertz:. Bob saw the whole thing, but was not surprised — :insertx: weighs 300 pounds, and it was a hot day.";
let insertX = ["Willy the Goblin",
    "Big Daddy",
    "Father Christmas"
];
let insertY = [
    "the soup kitchen",
    "Disneyland",
    "the White House"
];
let insertZ = [
    "spontaneously combusted",
    "melted into a puddle on the sidewalk",
    "turned into a slug and crawled away",
];

function randomValueFromArray(array){
    const random = Math.floor(Math.random()*array.length);
    return array[random];
  }

function result() {
    var newstory  = storyText;
    var xItem = randomValueFromArray(insertX);
    var yItem = randomValueFromArray(insertY);
    var zItem = randomValueFromArray(insertZ);
    newstory = newstory.replaceAll(':insertx:', xItem);
    newstory = newstory.replaceAll(':inserty:', yItem);
    newstory = newstory.replaceAll(':insertz:', zItem);

    if(customName.value !== '') {
      let name = customName.value;
      newstory = newstory.replaceAll('Bob', name);
    }
  
    if(document.getElementById("uk").checked) {
      let weight = Math.round(300) + ' stone';
      let temperature =  Math.round(94) + ' centigrade';
      newstory = newstory.replace("94 fahrenheit",temperature);
      newstory = newstory.replace('300 pounds', weight)
    }
  
    story.textContent = newstory;
    story.style.visibility = 'visible';
  }

randomize.addEventListener('click', result);

