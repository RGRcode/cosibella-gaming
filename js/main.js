const API_Link = "https://s5.cosibella.pl/api/test/products";

const state = {
    allProducts: [],
    filteredProducts: [],
    currentPage: 1,
    productsPerPage: 6,
    filters:{
        category: 'all',
        maxPrice: 2000
    }
};

const DOM ={
    loader: document.getElementById('app-loader'),
    message: document.getElementById('app-message'),
    grid: document.getElementById('products-grid'),
    categorySelect: document.getElementById('category-select'),
    priceMax: document.getElementById('price-max'),
    priceValue: document.getElementById('price-value')
}

async function loadCatalogData(){
    DOM.loader.style.display='flex';
    DOM.grid.style.display='none';
    DOM.message.style.display='none';

    try{
        const response = await fetch(API_Link);

        if(!response.ok){
            throw new Error(`Problem z serwerem ${response.status}`);
        }
        const data = await response.json();

        state.allProducts = data;
        state.filteredProducts = [...data];

        DOM.loader.style.display = 'none';
        DOM.grid.style.display = 'grid';

        console.log('Dane pobrane z sukcesem', state.allProducts);
    }catch(error){
        DOM.loader.style.display='none';
        DOM.message.style.display='flex';

        DOM.message.querySelector('.message-text').innerText=`Nie udało się pobrać produktów. (${error.message}. Upewnij się, że masz połącznie!)`;
        console.error('Błąd pobierania danych', error);
    }
}
loadCatalogData();