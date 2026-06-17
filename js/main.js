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
        renderProducts(state.filteredProducts);
    }catch(error){
        DOM.loader.style.display='none';
        DOM.message.style.display='flex';

        DOM.message.querySelector('.message-text').innerText=`Nie udało się pobrać produktów. (${error.message}. Upewnij się, że masz połącznie!)`;
        console.error('Błąd pobierania danych', error);
    }
}


function renderProducts(productsToRender){
    DOM.grid.innerHTML='';

    if(productsToRender.length === 0){
        DOM.grid.style.display='none';
        DOM.message.style.display='flex';
        DOM.message.querySelector('.message-text').innerText=`Brak produktów spełnaijących wybrane kryteria wyszukiwania. Spróbuj zmienić filtry`;
        return;
    }

    DOM.grid.style.display='grid';
    DOM.message.style.display='none';

    const productsHTML = productsToRender.map(product =>{
        const statusClass = product.stock ? 'badge-available' : 'badge-unavailable';
        const statusText = product.stock ? 'Dostępny' : 'Wyprzedane';

        const tagsHTML = product.tags.map(tag => `<span class="tag>${tag}</span>`).join('');
        return `
            <article class="product-card" data-id="${product.id}">
                <div class="card-status ${statusClass}">${statusText}</div>
                <div class="card-body">
                    <span class="product-id">#${product.id}</span>
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-tags">
                        ${tagsHTML}
                    </div>
                </div>
                <div class="card-footer">
                    <span class="product-price">${product.price.toFixed(2)} <span class="currency">PLN</span></span>
                    <button class="details-btn">Szczegóły</button>
                </div>
            </article>
        `;
    }).join('');

    DOM.grid.innerHTML = productsHTML;

}


function filterProducts(){
    const maxPrice = parseFloat(DOM.priceMax.value);
    const selectedCategory = DOM.categorySelect.value;

    state.filteredProducts = state.allProducts.filter(product=>{
        const matchesPrice = product.price <= maxPrice;
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

        return matchesPrice && matchesCategory;
    });

    state.currentPage= 1;
    renderProducts(state.filteredProducts);
}

function initEventListeners(){
    DOM.priceMax.addEventListener('input', (event) => {
        const currentPrice = event.target.value;
        DOM.priceValue.innerText = currentPrice;

        filterProducts();
    })
}


loadCatalogData();
initEventListeners();