import { renderPokemon } from "./pokedex.js";

const tabcontent = document.querySelectorAll('.tabcontent');
const tablinks = document.querySelectorAll('.tablink');

const searchForm = document.querySelector('#search');
const notFound = document.querySelector('.not-found');


window.onload = function() {
    searchPokemon('bulbasaur');
}

searchForm.onsubmit = (event) => {
    event.preventDefault();

    searchPokemon(event.target.pokemon.value);
};

const searchPokemon = async pokemon => {
    notFound.style.height = '0';
    notFound.childNodes[0].style.color = 'transparent';

    try {
        const poke = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`);
        const pokedata = await poke.json();
        const specie = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.toLowerCase()}`);
        const speciedata = await specie.json();
        renderPokemon(pokedata, speciedata);
    } catch (error) {
        notFound.style.height = '3.6rem';
        notFound.childNodes[0].style.color = '#fff';
    }
}

tablinks.forEach(tablink => {
    tablink.addEventListener('click', event => {
        if(event.currentTarget.id === 'about') openTab(event, 'poke-about');
        else if(event.currentTarget.id === 'battle') openTab(event, 'poke-battle');
    });
});

const openTab = (event, tabName) => {
    tabcontent.forEach(tab => {
        tab.style.display = 'none';
    });

    tablinks.forEach(tablink => {
        tablink.classList.remove('active');
    });

    document.getElementById(tabName).style.display = 'block';
    event.currentTarget.classList.add('active');
}