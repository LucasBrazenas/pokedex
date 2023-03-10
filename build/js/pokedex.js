const cardImg = document.querySelector('#poke-img'); 
const pokeName = document.querySelector('#poke-name');
const poketypes = [document.querySelector('#poke-type1'), document.querySelector('#poke-type2')];

// -> About TAB

const pokeDesc = document.querySelector('#desc');
const pokeWeight = document.querySelector('#weight');
const pokeHeight = document.querySelector('#height');
const pokeAbl = document.querySelector('#abl');

const pokeCprate = document.querySelector('#cprate');
const pokeBhappy = document.querySelector('#bhappy');
const pokeBexp = document.querySelector('#bexp');
const pokeGwrate = document.querySelector('#gwrate');

// -> Battle Info TAB

const pokeHp = document.querySelector('.hp');
const pokeAtk = document.querySelector('.atk');
const pokeDef = document.querySelector('.def');
const pokeSpAtk = document.querySelector('.sp-atk');
const pokeSpDef = document.querySelector('.sp-def');
const pokeSpd = document.querySelector('.spd');
const pokeTls = document.querySelector('.tls');
const pokeWktypes = document.querySelector('#wktypes');
const pokeStrtypes = document.querySelector('#strtypes');


export const renderPokemon = (pokedata, speciedata) => {
    const sprite = pokedata["sprites"]["other"]["official-artwork"]["front_default"];

    cardImg.style.backgroundImage = `url('${sprite}')`;
    pokeName.textContent = `${pokedata.name} #${pokedata.id}`;

    poketypes[0].childNodes[1].style.backgroundImage = `url('../build/img/${getTypes(pokedata.types)[0]}-type.png')`;
    poketypes[0].childNodes[3].textContent = `${getTypes(pokedata.types)[0]}`;

    if (pokedata.types.length > 1) {
        poketypes[1].childNodes[1].style.backgroundImage = `url('../build/img/${getTypes(pokedata.types)[1]}-type.png')`;
        poketypes[1].childNodes[3].textContent = `${getTypes(pokedata.types)[1]}`;
        poketypes[1].style.display = '';
    } else poketypes[1].style.display = 'none';

    renderAboutPoke(pokedata, speciedata);
    renderBattlePoke(pokedata, speciedata);
}

const renderAboutPoke = (pokedata, speciedata) => {
    pokeDesc.textContent = `${getDesciption(speciedata.flavor_text_entries)}`;
    pokeWeight.textContent = `${pokedata.weight/10} KG`;
    pokeHeight.textContent = `${pokedata.height/10} M`;
    pokeAbl.textContent = `${getAbilities(pokedata.abilities)}`;

    getTypesWeakness(getTypes(pokedata.types));
    getTypesStronger(getTypes(pokedata.types));

    pokeCprate.textContent = `${speciedata.capture_rate}`;
    pokeBhappy.textContent = `${speciedata.base_happiness}`;
    pokeBexp.textContent = `${pokedata.base_experience}`;
    pokeGwrate.textContent = `${speciedata.growth_rate.name}`;
}

const renderBattlePoke = (pokedata, speciedata) => {
    getStats(pokedata.stats);
}

// -> Utilities 

function getTypes(typesEntries) {
    let types = [];
    typesEntries.forEach(typeEntry => types.push(typeEntry.type.name));
    return types;
}

function getDesciption(descEntries) {
    let desc = '';
    for (let i = 0; descEntries.length > i; i++) {
        if (descEntries[i].language.name === 'en') {
            desc += descEntries[i].flavor_text;
            break;   
        }
    }
    return desc;
}

function getAbilities(ablEntries) {
    let abl = '';
    for (let i = 0; ablEntries.length > i; i++) {
        if ((i + 2) > ablEntries.length) abl += `${ablEntries[i].ability.name.replace('-', ' ')}`;
        else abl += `${ablEntries[i].ability.name.replace('-', ' ')}, `;
    }
    return abl;
}

function loadWeakness(weakTypes) {

    while (pokeWktypes.firstChild) {
        pokeWktypes.removeChild(pokeWktypes.lastChild);
      }

    for(let weakType of weakTypes) {
        addTypeImage(weakType, pokeWktypes)
    };
}

function getTypesWeakness(types) {
    const request = new XMLHttpRequest();
    request.open('GET', '../build/data/types.json');
    request.responseType = 'json';
    request.send();
    request.onload = (() => {
        const typesJSON = request.response;
        let weaknessTypes = [];

        types.forEach(type => {
            for(let typeJSON of typesJSON.all_types) {
                if(typeJSON.stronger.includes(type)) {
                    if (!weaknessTypes.includes(typeJSON.name)) weaknessTypes.push(typeJSON.name);
                }
            }
        });
    
        types.forEach(type => {
            for(let typeJSON of typesJSON.all_types) {
                if(typeJSON.half.includes(type)) {
                    if (weaknessTypes.includes(typeJSON.name)) weaknessTypes.splice(weaknessTypes.indexOf(typeJSON.name), 1);
                }
            }
        });
    
        types.forEach(type => {
            for(let typeJSON of typesJSON.all_types) {
                if(typeJSON.no_damage.includes(type)) { 
                    if (weaknessTypes.includes(typeJSON.name)) weaknessTypes.splice(weaknessTypes.indexOf(typeJSON.name), 1);
                }
            }
        });

        loadWeakness(weaknessTypes);
    });
}

function loadStronger(stronerTypes) {
    while (pokeStrtypes.firstChild) {
        pokeStrtypes.removeChild(pokeStrtypes.lastChild);
      }

    for(let stronerType of stronerTypes) {
        addTypeImage(stronerType, pokeStrtypes);
    };

    if(stronerTypes.length === 0) addTypeImage('none', pokeStrtypes);
}

function getTypesStronger(types) {
    const request = new XMLHttpRequest();
    request.open('GET', '../build/data/types.json');
    request.responseType = 'json';
    request.send();
    request.onload = (() => {
        const typesJSON = request.response;
        let strongerTypes = [];

        types.forEach(type => {
            for(let typeJSON of typesJSON.all_types) {
                if(typeJSON.name.includes(type)) {
                    typeJSON.stronger.forEach(strongerType => {
                        if (!strongerTypes.includes(strongerType)) strongerTypes.push(strongerType); 
                    });
                }
            }
        });

        loadStronger(strongerTypes)
    });
}

function addTypeImage(type, element) {
    const typeImage = document.createElement('div');
    typeImage.innerHTML = `
    <div class="img" style="background-image: url('../build/img/${type}-type.png')"></div>
    `
    typeImage.classList.add("type");

    element.appendChild(typeImage);
}

function getStats(statsEntries) {
    let stats = [];
    statsEntries.forEach(stat => {
        stats.push(stat.base_stat);
    });
    loadStats(stats);;
}

function loadStats(stats) {

    let totalStats = 0;

    stats.forEach(stat => {
        totalStats += stat;
    });

    pokeHp.childNodes[0].textContent = `${stats[0]}/255`;
    pokeHp.style.width = `${stats[0]/255*100}%`;

    pokeAtk.childNodes[0].textContent = `${stats[1]}/255`;
    pokeAtk.style.width = `${stats[1]/255*100}%`;
    
    pokeDef.childNodes[0].textContent = `${stats[2]}/255`;
    pokeDef.style.width = `${stats[2]/255*100}%`;

    pokeSpAtk.childNodes[0].textContent = `${stats[3]}/255`;
    pokeSpAtk.style.width = `${stats[3]/255*100}%`;

    pokeSpDef.childNodes[0].textContent = `${stats[4]}/255`;
    pokeSpDef.style.width = `${stats[4]/255*100}%`;

    pokeSpd.childNodes[0].textContent = `${stats[5]}/255`;
    pokeSpd.style.width = `${stats[5]/255*100}%`;

    pokeTls.childNodes[0].textContent = `${totalStats}/1275`;
    pokeTls.style.width = `${totalStats/1275*100}%`;
}
