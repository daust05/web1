let coffeeImg = 
[
    'https://image.istarbucks.co.kr/upload/store/skuimg/2019/09/[9200000002487]_20190919181354811.jpg',
    'https://image.istarbucks.co.kr/upload/store/skuimg/2017/03/[9200000000479]_20170328134443491.jpg',
    'https://image.istarbucks.co.kr/upload/store/skuimg/2019/04/[9200000002081]_20190409153909754.jpg'
];

let coffeeName = 
[
    '나이트로 바닐라 크림',
    '나이트로 콜드 브루',
    '돌체 콜드 브루'
];

async function fetchAndDecode(imgURL, type){
    let response = await fetch(imgURL);
    if(type === 'blob'){
        return await response.blob();
    }
}

function getMenu(){
    let ul = document.createElement('ul');
    let coffeeNum = coffeeImg.length;

    for(let i = 0; i < coffeeNum;i ++){
        let li = document.createElement('li');
        let dl = document.createElement('dl');

        //커피 이미지 dt에 추가
        fetchAndDecode(coffeeImg[i],'blob').then((blob)=>{
            let url = URL.createObjectURL(blob);
            let dt = document.createElement('dt');
            let img = document.createElement('img');
            img.src = url;
            img.className = 'Menu'

            dt.appendChild(img);
            dl.appendChild(dt);
        })
        .catch(e=>{
            console.log('Error :' + e.message);
        });

        //커피 설명 dd에 추가
        let dd = document.createElement('dd');
        dd.textContent = coffeeName[i];

        dl.appendChild(dd);
        li.appendChild(dl);
        ul.appendChild(li);
    }
    document.body.appendChild(ul);
}

getMenu();