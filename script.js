const $body = document.getElementById('main');
const $form = document.getElementById('form');
const $apod = document.getElementById('apod');
const $date = document.getElementById('date');
const $overlay = document.getElementById('overlay');
const $favorites = document.getElementById('favorites');

let data = {};
let favorites = [];

//limiting date pick to today
let today = new Date();
let dd = today.getDate();
let mm = today.getMonth()+1;
let yyyy = today.getFullYear();
if(dd<10){
  dd='0'+dd
} ;
if(mm<10){
  mm='0'+mm
} ;

today = yyyy+'-'+mm+'-'+dd;
$date.setAttribute("max", today);


function nasaRequest(){

    $form.addEventListener('submit', async function(e){
        e.preventDefault()

        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=bNXJ2v8H3rQJ0d4pVgGhK2B993JGGK7cjaeErQNk&date=${$date.value}`)
        const json = await response.json()
        console.log(json)

        if (json.media_type == 'video'){
            $apod.textContent = `This is a video and cannot be display here!`
        } else {
            $apod.innerHTML = `
                <img class="imgbig rounded-3" id="imgbig" data-hd="${json.hdurl}" src="${json.url}">
                <div class="ms-4">
                    <h3>${json.title}</h3>
                    <h5 class="date"><em>${json.date}</em></h5>
                    <p class="description">${json.explanation}</p>
                    <button type="button" class="btn btn-info save" id="save">Save to Favorites</button>
                </div>`
        };
        //high version image
        $body.addEventListener('click', function(e){
            if (e.target.classList.contains('imgbig')){
                const hd = e.target.dataset.hd
                $overlay.innerHTML = `<div class="imgOverlay"><img src=${hd}></div>`
                $overlay.style.display = 'block'
            }
        })

        $overlay.addEventListener('click', function(){
            $overlay.style.display = 'none'
          })

        data = {
            url: json.url,
            title: json.title,
            date: json.date,
            explanation: json.explanation
        }
    })
};

nasaRequest();


function saveFavorites(){
    localStorage.setItem('favorites', JSON.stringify(favorites))
};


function buildFavorites(){
    const html = []

    for (let i = 0; i < favorites.length; i++){
        html.push(`
            <div class="fav-info border-bottom d-flex flex-wrap p-3 mt-3">
                <img class="img-small rounded-3" src="${favorites[i].url}">
                <div class="ms-4">
                    <h4> ${favorites[i].title}</h4>
                    <h5> ${favorites[i].date}</h5>
                    <button type="button" data-index="${i}" class="btn btn-dark delete">Delete</button>
                </div>
            </div>`)
    }
    $favorites.innerHTML = html.join('')
};


$apod.addEventListener('click', function(e){
    if (e.target.classList.contains('save')){
        favorites.push (data)
    }
    saveFavorites()

    buildFavorites()
});


$favorites.addEventListener('click', function(e){
    if(e.target.classList.contains('delete')){
        const index = e.target.dataset.index
        favorites.splice(index, 1)
    }
    saveFavorites()

    buildFavorites()
});

// after refresh the page
const local = localStorage.getItem('favorites')
if(local){
    favorites = JSON.parse(local)
    buildFavorites()
};