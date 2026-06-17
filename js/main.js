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
    priceValue: document.getElementById('price-value'),

    btnPrev: document.getElementById('btn-prev'),
    btnNext: document.getElementById('btn-next'),
    paginationPages: document.getElementById('pagination-pages'),

    modal: document.getElementById('product-modal'),
    modalBody: document.getElementById('modal-content'),
    modalCloseBtn: document.getElementById('modal-close')
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

        setupCategoryFilter();

        readURLParams();

        const savedPage = state.currentPage;
        filterProducts();
        state.currentPage = savedPage;

        DOM.loader.style.display = 'none';
        DOM.grid.style.display = 'grid';

        console.log('Dane pobrane z sukcesem', state.allProducts);
    }catch(error){
        DOM.loader.style.display='none';
        DOM.message.style.display='flex';

        DOM.message.querySelector('.message-text').innerText=`Nie udało się pobrać produktów. (${error.message}. Upewnij się, że masz połączenie!)`;
        console.error('Błąd pobierania danych', error);
    }
}


function renderProducts(productsToRender){
    DOM.grid.innerHTML='';

    if(productsToRender.length === 0){
        DOM.grid.style.display='none';
        DOM.message.style.display='flex';
        DOM.message.querySelector('.message-text').innerText=`Brak produktów spełniających wybrane kryteria wyszukiwania. Spróbuj zmienić filtry`;
        DOM.btnPrev.parentElement.style.display= 'none';
        return;
    }

    DOM.grid.style.display='grid';
    DOM.message.style.display='none';

    const startIndex = (state.currentPage - 1) *state.productsPerPage;
    const endIndex = startIndex + state.productsPerPage;
    const paginatedProducts = productsToRender.slice(startIndex,endIndex);

    const productsHTML = paginatedProducts.map(product =>{
        const statusClass = product.stock ? 'badge-available' : 'badge-unavailable';
        const statusText = product.stock ? 'Dostępny' : 'Wyprzedane';
        const tagsHTML = product.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
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
    renderPagination();
}

function initEventListeners(){
    DOM.priceMax.addEventListener('input', (event) => {
        const currentPrice = event.target.value;
        DOM.priceValue.innerText = currentPrice;

        filterProducts();
    });

    DOM.categorySelect.addEventListener('change', () =>{
    filterProducts();
    });

    DOM.btnPrev.addEventListener('click', () =>{
        if(state.currentPage > 1){
            state.currentPage--;
            renderProducts(state.filteredProducts);
            updateURLParams();
        }
    });
    DOM.btnNext.addEventListener('click', () =>{
        const totalPages = Math.ceil(state.filteredProducts.length / state.productsPerPage);
        if(state.currentPage < totalPages){
            state.currentPage++;
            renderProducts(state.filteredProducts);
        }
    });
    DOM.paginationPages.addEventListener('click', (event) =>{
        if(event.target.classList.contains('page-num')){
            const targetPage = parseInt(event.target.getAttribute('data-page'));
            state.currentPage = targetPage;
            renderProducts(state.filteredProducts);
            updateURLParams();
        }
    });

    DOM.grid.addEventListener('click', (event) =>{
        const card = event.target.closest('.product-card');
        if(card){
            const productId = parseInt(card.getAttribute('data-id'));
            openProductModal(productId);
            updateURLParams();
        }
    });

    DOM.modalCloseBtn.addEventListener('click', closeProductModal);
    
    DOM.modal.addEventListener('click', (event) =>{
        if (event.target === DOM.modal){
            closeProductModal();
        }
    })
}



function setupCategoryFilter(){
    const allCategories = state.allProducts.map(product => product.category);
    const uniqueCategories = [...new Set(allCategories)];

    const optionsHTML = uniqueCategories.map(category =>{
        return `<option value="${category}">${category}</option>`;
    }).join('');
    DOM.categorySelect.innerHTML = `<option value="all">Wszystkie sprzęty</option>`+optionsHTML;
}



function renderPagination(){
    const totalProducts = state.filteredProducts.length;
    const totalPages = Math.ceil(totalProducts/state.productsPerPage);
    
    if(totalPages<=1){
        DOM.btnPrev.parentElement.style.display = 'none';
        return;
    }else{
        DOM.btnPrev.parentElement.style.display = 'flex';
    }

    DOM.btnPrev.disabled = state.currentPage === 1;
    DOM.btnNext.disabled = state.currentPage === totalPages;

    let pagesHTML ='';
    for (let i=1; i <= totalPages; i++){
        const activeClass = i === state.currentPage ? 'active' : '';
        pagesHTML += `<button class="page-num ${activeClass}" data-page="${i}">${i}</button>`;
    }
    DOM.paginationPages.innerHTML = pagesHTML;
}

function openProductModal(productId){
    const product = state.allProducts.find(p => p.id === productId);

    if(!product) return;

    const stockStatus = product.stock ? '<span class="text-success">Na magazynie (Dostępny)</span>' :  '<span class="text-danger">Brak w magazynie (Wyprzedane)</span>';

    DOM.modalBody.innerHTML = `
        <div class="modal-header">
            <span class="modal-category">${product.category}</span>
            <h2 class="modal-title">${product.name}</h2>
        </div>
        <div class="modal-body">
            <p class="modal-desc">${product.description}</p>
            <div class="modal-specs">
                <div class="spec-item"><strong>ID produktu:</strong> <span>#${product.id}</span></div>
                <div class="spec-item"><strong>Cena katalogowa:</strong> <span class="text-highlight">${product.price.toFixed(2)} PLN</span></div>
                <div class="spec-item"><strong>Status zapasów:</strong> <span>${stockStatus}</span></div>
                <div class="spec-item"><strong>Powiązane tagi:</strong> <span>${product.tags.join(', ')}</span></div>
            </div>
        </div>
    `;
    
    DOM.modal.style.display='flex';
    document.body.style.overflow = 'hidden';
}

function closeProductModal(){
    DOM.modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function updateURLParams(){
    const params = new URLSearchParams();

    if(state.filters.category !== 'all'){
        params.set('category', state.filters.category);
    }
    if (state.filters.maxPrice !== 2000){
        params.set('price', state.filters.maxPrice);
    }
    if (state.currentPage !== 1){
        params.set('page', state.currentPage);
    }

    const newRelativePathQuery = params.toString() ? `?${params.toString()}` : window.location.pathname;

    window.history.pushState({ path: newRelativePathQuery}, '', newRelativePathQuery);
}

function readURLParams(){
    const params = new URLSearchParams(window.location.search);

    if (params.has('category')){
        state.filters.category = params.get('category');
        DOM.categorySelect.value = state.filters.category;
    }
    
    if(params.has('price')){
        state.filters.maxPrice = parseFloat(params.get('price'));
        DOM.priceMax.value = state.filters.maxPrice;
        DOM.priceValue.innerText = state.filters.maxPrice;
    }

    if(params.has('page')){
        state.currentPage = parseInt(params.get('page'));
    }
}

function filterProducts(){
    state.filters.maxPrice = parseFloat(DOM.priceMax.value);
    state.filters.category = DOM.categorySelect.value;

    state.filteredProducts = state.allProducts.filter(product => {
        const matchesPrice = product.price <= state.filters.maxPrice;
        const matchesCategory = state.filters.category === 'all' || product.category === state.filters.category;
        return matchesPrice && matchesCategory;
    });

    state.currentPage = 1;
    renderProducts(state.filteredProducts);
    updateURLParams();
}


loadCatalogData();
initEventListeners();