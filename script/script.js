/* 
  api key: 253f12567acf64fb37aa6593a0332a42
  weather api call : 
  https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid= 253f12567acf64fb37aa6593a0332a42

  Geocode api call :
  http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key} 

*/

let animation;
function createSlider(){ 
  const intro = document.createElement('div');
  intro.id = 'intro';
  const slider = document.createElement('div');
  slider.className = 'slider';
  const sliderContainer = document.createElement('div');
  sliderContainer.className = 'content';
  const slides = document.createElement('div');
  slides.className = 'slides';
  let images = ['images/icons8-weather-64 (1).png','images/icons8-weather-64.png','images/icons8-weather-65.png','images/icons8-weather-64 (1).png'];
  for(let i =0;i<images.length;i++) { 
    const image = new Image();
    image.src = images[i];
    slides.appendChild(image);
  }
  const text = document.createElement('div');
  text.className = 'text';
  const p = document.createElement('p');
  p.innerHTML = 'loading <span>...</span>';
  text.appendChild(p);
  sliderContainer.appendChild(slides);
  sliderContainer.appendChild(text);
  slider.appendChild(sliderContainer);
  intro.appendChild(slider);
  document.body.appendChild(intro);
}

function startAnimation() { 
  createSlider();
  document.body.classList.add('hide');
  const slides = document.querySelector('.slider .slides');
  let multiplyer = 0;
  animation = setInterval(()=> { 
    let number = multiplyer * 64;
    if(number >192) { 
      multiplyer = 1;
      slides.classList.add('nontranstion');
      slides.style.transform = `translate(0px)`;
    }
    else { 
  slides.classList.remove('nontranstion');
  slides.style.transform = `translate(-${number}px)`;
  multiplyer++;
}
},2000);
}

function stopAnimation() { 
  clearInterval(animation);
  const intro = document.querySelector('#intro');
  intro.remove();
  document.body.classList.remove('hide');
}

async function getCityLocation(city) { 
  try { 
    const respons = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=253f12567acf64fb37aa6593a0332a42`);
    const result = await respons.json();
    if(result[0]) {  
      return { lat: result[0].lat , lon: result[0].lon };
    }
  }
  catch { 
    displayError('NETWORK ERORR : Please check your conection');
  }
}


async function getCurrentWeatherState(city) { 
  const location = await getCityLocation(city);
  if(location) { 
    try {
      const respons = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=253f12567acf64fb37aa6593a0332a42`);
      const result = await respons.json();
      return result;
    }catch { 
      displayError('NETWORK ERROR : please check your connection and try again');
    }
  }else { 
    displayError('Error: location not Found');
  }
}

async function showWeather(city='الرياض') { 
  startAnimation();
  const result = await getCurrentWeatherState(city);
  if(result) { 
    changeBodyBackground(result.main.temp);
    stopAnimation();
    // display functions 
    emptyColumns();
    createTempColumn(result.main);
    createCityColumn(result);
    createFactorsColumn(result);
  }
  else { 
    stopAnimation();
  }
}
showWeather();
/*
1- clouds: <i class="fa-solid fa-clouds"></i>
2- temp: <i class="fa-solid fa-temperature-low"></i>
3- max temp : <i class="fa-solid fa-gauge-max"></i>
4- min temp: <i class="fa-solid fa-gauge-min"></i>
5- feels like: <i class="fa-solid fa-temperature-full"></i>
*/
// DOM manibulation 
function changeBodyBackground(degree) {
  if(degree > 30) { 
    document.body.style.backgroundImage = 'var(--hot-color)';
  } else if (  degree >= 15 && degree < 30) { 
    document.body.style.backgroundImage = 'var(--warm-color)';
  } else { 
    document.body.style.backgroundImage = 'var(--cold-color)';
  }
}

function createTempColumn(object) {
  const tempContainer = document.querySelector('.weather-state .container .temp');
    const box1 = document.createElement('div');
    box1.className = 'box';
    const i1 = document.createElement('i');
    i1.className = 'fa-solid fa-temperature-full';
    box1.appendChild(i1);
    const p1 = document.createElement('p');
    p1.textContent = object.feels_like + ' C';
    box1.appendChild(p1);
  
    const box2 = document.createElement('div');
    box2.className = 'box';
    const i2 = document.createElement('i');
    i2.className = 'fa-solid fa-temperature-low';
    box2.appendChild(i2);
    const p2 = document.createElement('p');
    p2.textContent = object.temp + ' C';
    box2.appendChild(p2);

    const box3 = document.createElement('div');
    box3.className = 'box';
    const i3 = document.createElement('i');
    i3.className = 'fa-solid fa-temperature-arrow-up';
    box3.appendChild(i3);
    const p3 = document.createElement('p');
    p3.textContent = object.temp_max + ' C';
    box3.appendChild(p3);

    const box4 = document.createElement('div');
    box4.className = 'box';
    const i4 = document.createElement('i');
    i4.className = 'fa-solid fa-temperature-arrow-down';
    box4.appendChild(i4);
    const p4 = document.createElement('p');
    p4.textContent = object.temp_min + ' C';
    box4.appendChild(p4);

    tempContainer.appendChild(box1);
    tempContainer.appendChild(box2);
    tempContainer.appendChild(box3);
    tempContainer.appendChild(box4);
}

function createCityColumn(object) {
  const h1 = document.createElement('h1');
  h1.textContent = object.name;
  const box = document.createElement('div');
  box.className = 'box';
  const date = new Date();
  const p1 = document.createElement('p'); 
  p1.textContent = 'last Update: '+
    date.getFullYear() +'/'+ 
    date.getMonth() + '/' + 
    date.getDate() + ' | ' +
    date.getHours() + ':' + date.getMinutes() ;
  box.appendChild(p1);
  const p2 = document.createElement('p');
  p2.textContent = ", " + object.sys.country;
  box.appendChild(p2);
  const country = document.querySelector('.weather-state .country');
  country.appendChild(h1);
  country.appendChild(box);
}

function createFactorsColumn(object) { 

  const box1 = document.createElement('div');
  box1.className = 'box';
  const i1 = document.createElement('i');
  i1.className = 'fa-solid fa-droplet';
  box1.appendChild(i1);
  const p1 = document.createElement('p');
  p1.textContent = object.main.humidity + ' %';
  box1.appendChild(p1);

  const box2 = document.createElement('div');
  box2.className = 'box';
  const i2 = document.createElement('i');
  i2.className = 'fa-solid fa-water';
  box2.appendChild(i2);
  const p2 = document.createElement('p');
  p2.textContent = object.main.sea_level + ' hpa';
  box2.appendChild(p2);

  const box3 = document.createElement('div');
  box3.className = 'box';
  const i3 = document.createElement('i');
  i3.className = 'fa-solid fa-gem';
  box3.appendChild(i3);
  const p3 = document.createElement('p');
  p3.textContent = object.main.pressure + ' hpa';
  box3.appendChild(p3);

  const box4 = document.createElement('div');
  box4.className = 'box';
  const i4 = document.createElement('i');
  i4.className = 'fa-solid fa-cloud-sun';
  box4.appendChild(i4);
  const p4 = document.createElement('p');
  p4.textContent = object.clouds.all + ' %';
  box4.appendChild(p4);

  const factors = document.querySelector('.weather-state .factors');
  factors.appendChild(box1);
  factors.appendChild(box2);
  factors.appendChild(box3);
  factors.appendChild(box4);
}

function displayError(error) { 
  const errContainer  = document.createElement('div');
  errContainer.className = 'error';
  const exit = document.createElement('div');
  exit.id = 'exit';
  const i = document.createElement('i');
  i.className = 'fa-solid fa-xmark';
  exit.appendChild(i);
  errContainer.appendChild(exit);
  const errorText = document.createTextNode(error);
  const p = document.createElement('p');
  p.appendChild(errorText);
  errContainer.appendChild(p);

  document.body.appendChild(errContainer);
  setTimeout(()=> { 
    document.querySelector('.error').remove();
  },5000);
}
function emptyColumns () { 
  const temp = document.querySelector('.weather-state .temp');
  const country = document.querySelector('.weather-state .country');
  const factors = document.querySelector('.weather-state .factors');

  temp.innerHTML = '';
  country.innerHTML = '';
  factors.innerHTML = '';
}
// form submit Event 
document.addEventListener('submit',(e)=> { 
  e.preventDefault();
  document.body.classList.add('hide');
  showWeather(e.target.querySelector('input#city').value || undefined);
});
