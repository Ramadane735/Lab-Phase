
document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const ITEMS_PER_PAGE = 6;
    let currentPage = 1;
    let currentCategory = 'all';
    let currentSearch = '';

    // Données des produits
    const products = [
        { id: 1, name: 'Sac à Dos', price: 29.99, category: 'sac', image: 'assets/products/sacs/0D65DEF0-44AC-488C-A04F-3E26AFD70EB4.jpeg' },
        { id: 2, name: 'Pantalon African Wax', price: 49.99, category: 'pantalon', image: 'assets/products/pantalon/69CADACE-B584-4410-8547-813AE30D57F9_1_105_c.jpeg' },
        { id: 3, name: 'Veste Africain', price: 89.99, category: 'vestes', image: 'assets/products/boubou/97175BBF-FD8B-4657-834C-8CE74B06A74C.jpeg' },
        { id: 4, name: 'Sandale', price: 39.99, category: 'sandale', image: 'assets/products/sandale/39D85CA7-85C5-4934-BC95-F91250A77587_1_105_c.jpeg' },
        { id: 5, name: 'Sac à main cuir', price: 59.99, category: 'sacs', image: 'assets/products/sacs/5E627AB0-B856-4A0B-9D2D-D7E597FC806B.jpeg' },
        { id: 6, name: 'Robe Chic', price: 99.99, category: 'robes', image: 'assets/products/boubou/BB1A3814-B80A-46F2-A8EE-27093378E439.jpeg' },
        { id: 7, name: 'Pullover oversized', price: 45.99, category: 'hauts', image: 'assets/products/boubou/C2F188F6-BC77-4F48-BCC6-0F99A3FF4507.jpeg' },
        { id: 8, name: 'Jupe plissée', price: 34.99, category: 'jupes', image: 'assets/products/jupe/C80E13A2-6B94-4DE0-A348-0C98837349E8.jpeg' },
        { id: 9, name: 'Manteau long', price: 129.99, category: 'manteaux', image: 'assets/products/manteau/CD8EBAD6-E1F6-493A-8C0C-B6B7296C9304.jpeg' },
        { id: 10, name: 'Bottes cuir', price: 79.99, category: 'chaussures', image: 'assets/products/sandale/74246EE7-BF37-4164-BB02-AD56F5E8BBDD.jpeg' },
        { id: 11, name: 'Ensemble sport', price: 69.99, category: 'sport', image: 'assets/products/sport/10AF5D02-59A3-41B3-BF8B-3DE055337A28.jpeg' },
        { id: 12, name: 'Chemise homme', price: 44.99, category: 'hommes', image: 'assets/products/boubou/A1E2D186-7956-4C3A-BEC7-F8D2F03F11A4_1_105_c.jpeg' },
        { id: 13, name: 'Short African', price: 29.99, category: 'shorts', image: 'assets/products/short/2805459D-5301-402E-B24F-6C43D1DF2BDF.jpeg' },
        { id: 14, name: 'Bijoux & Accessoires', price: 14.99, category: 'accessoires', image: 'assets/products/bijoux & accessoires/1C26BA36-4048-4131-9B31-134DD3FFD209.jpeg' },
        { id: 15, name: 'Lunettes soleil', price: 19.99, category: 'accessoires', image: 'assets/products/lunette/0127AB0F-177B-4756-83BE-DB05D64E30F3.jpeg' }
    ];

    // Éléments DOM
    const elements = {
        productGrid: document.querySelector('.product-grid'),
        cartCount: document.querySelector('.cart-count'),
        searchInput: document.querySelector('#searchInput'),
        categoryFilter: document.querySelector('#categoryFilter'),
        authModal: document.querySelector('#authModal'),
        paymentModal: document.querySelector('#paymentModal'),
        authForm: document.querySelector('#authForm'),
        paymentForm: document.querySelector('#paymentForm'),
        prevPage: document.querySelector('#prevPage'),
        nextPage: document.querySelector('#nextPage'),
        currentPage: document.querySelector('#currentPage'),
        authButton: document.querySelector('#authButton')
    };

    // État de l'application
    let state = {
        cartItems: JSON.parse(localStorage.getItem('cart')) || [],
        user: JSON.parse(localStorage.getItem('user')) || null,
        isLoginForm: true
    };

    // Initialisation des catégories
    const categories = [...new Set(products.map(p => p.category))];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        elements.categoryFilter.appendChild(option);
    });

    // Système d'authentification
    const authHandler = {
        showModal: () => elements.authModal.style.display = 'block',
        hideModals: () => {
            elements.authModal.style.display = 'none';
            elements.paymentModal.style.display = 'none';
        },
        toggleForm: () => {
            state.isLoginForm = !state.isLoginForm;
            elements.authForm.querySelector('button').textContent = state.isLoginForm ? 
                'Se connecter' : 'Créer un compte';
            document.querySelector('#switchForm').textContent = state.isLoginForm ? 
                'Créer un compte' : 'Déjà un compte?';
        },
        handleAuth: (e) => {
            e.preventDefault();
            const email = document.querySelector('#email').value;
            const password = document.querySelector('#password').value;
            
            if (!email || !password) {
                alert('Veuillez remplir tous les champs');
                return;
            }

            state.user = { email };
            localStorage.setItem('user', JSON.stringify(state.user));
            authHandler.updateAuthUI();
            authHandler.hideModals();
        },
        updateAuthUI: () => {
            elements.authButton.textContent = 
                state.user ? `Bonjour, ${state.user.email.split('@')[0]}` : 'Connexion';
        },
        logout: () => {
            state.user = null;
            localStorage.removeItem('user');
            authHandler.updateAuthUI();
        }
    };

    // Gestion du panier
    const cartHandler = {
        addToCart: (productId) => {
            const product = products.find(p => p.id === productId);
            state.cartItems.push(product);
            localStorage.setItem('cart', JSON.stringify(state.cartItems));
            cartHandler.updateCartCount();
            
            const cartIcon = document.querySelector('.cart-icon');
            cartIcon.classList.add('added');
            setTimeout(() => cartIcon.classList.remove('added'), 500);
        },
        updateCartCount: () => {
            elements.cartCount.textContent = state.cartItems.length;
        },
        showCart: () => {
            if (state.cartItems.length === 0) {
                alert('Votre panier est vide !');
                return;
            }
            elements.paymentModal.style.display = 'block';
        },
        clearCart: () => {
            state.cartItems = [];
            localStorage.removeItem('cart');
            cartHandler.updateCartCount();
        }
    };

    // Gestion des produits
    const productManager = {
        getFilteredProducts: () => {
            return products.filter(p => 
                (currentCategory === 'all' || p.category === currentCategory) &&
                (p.name.toLowerCase().includes(currentSearch) ||
                p.category.toLowerCase().includes(currentSearch)
            ));
        },
        renderProducts: (productsArray) => {
            elements.productGrid.innerHTML = productsArray.map(product => `
                <div class="product-card">
                    <div class="image-container">
                        <img src="${product.image}" alt="${product.name}" class="product-image">
                        <div class="shimmer"></div>
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>€${product.price.toFixed(2)}</p>
                        <button class="add-to-cart" data-id="${product.id}">Ajouter au panier</button>
                    </div>
                </div>
            `).join('');
        },
        updateProducts: () => {
            const filtered = productManager.getFilteredProducts();
            const paginated = filtered.slice(
                (currentPage - 1) * ITEMS_PER_PAGE,
                currentPage * ITEMS_PER_PAGE
            );
            productManager.renderProducts(paginated);
            paginationHandler.updatePaginationControls(filtered.length);
        },
        handleSearch: (e) => {
            currentSearch = e.target.value.toLowerCase();
            currentPage = 1;
            productManager.updateProducts();
        },
        handleCategoryChange: (e) => {
            currentCategory = e.target.value;
            currentPage = 1;
            productManager.updateProducts();
        }
    };

    // Pagination
    const paginationHandler = {
        updatePaginationControls: (filteredLength) => {
            elements.prevPage.disabled = currentPage === 1;
            elements.nextPage.disabled = currentPage * ITEMS_PER_PAGE >= filteredLength;
            elements.currentPage.textContent = currentPage;
        },
        handlePageChange: (direction) => {
            const filteredLength = productManager.getFilteredProducts().length;
            if (direction === 'prev' && currentPage > 1) {
                currentPage--;
            } else if (direction === 'next' && currentPage * ITEMS_PER_PAGE < filteredLength) {
                currentPage++;
            }
            productManager.updateProducts();
        }
    };

    // Validation de paiement
    const paymentHandler = {
        validateCard: (cardNumber) => /^\d{16}$/.test(cardNumber),
        validateExpiry: (expiry) => {
            const [month, year] = expiry.split('/');
            if (!month || !year) return false;
            return month > 0 && month < 13 && year >= 24;
        },
        validateCVV: (cvv) => /^\d{3}$/.test(cvv),
        handlePayment: (e) => {
            e.preventDefault();
            
            const cardNumber = document.querySelector('#cardNumber').value.replace(/\s/g, '');
            const expiryDate = document.querySelector('#expiryDate').value;
            const cvv = document.querySelector('#cvv').value;

            if (!paymentHandler.validateCard(cardNumber)) {
                alert('Numéro de carte invalide (16 chiffres requis)');
                return;
            }

            if (!paymentHandler.validateExpiry(expiryDate)) {
                alert('Date d\'expiration invalide (MM/AA valide requis)');
                return;
            }

            if (!paymentHandler.validateCVV(cvv)) {
                alert('CVV invalide (3 chiffres requis)');
                return;
            }

            const total = state.cartItems.reduce((sum, item) => sum + item.price, 0);
            alert(`Paiement réussi de €${total.toFixed(2)}`);
            cartHandler.clearCart();
            elements.paymentModal.style.display = 'none';
        }
    };

    // Gestion des événements
    const setupEventListeners = () => {
        // Authentification
        elements.authButton.addEventListener('click', authHandler.showModal);
        document.querySelectorAll('.close').forEach(btn => 
            btn.addEventListener('click', authHandler.hideModals));
        document.querySelector('#switchForm').addEventListener('click', authHandler.toggleForm);
        elements.authForm.addEventListener('submit', authHandler.handleAuth);

        // Panier
        document.querySelector('.cart-icon').addEventListener('click', cartHandler.showCart);
        elements.productGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const productId = parseInt(e.target.dataset.id);
                cartHandler.addToCart(productId);
            }
        });

        // Produits
        elements.searchInput.addEventListener('input', productManager.handleSearch);
        elements.categoryFilter.addEventListener('change', productManager.handleCategoryChange);

        // Pagination
        elements.prevPage.addEventListener('click', () => paginationHandler.handlePageChange('prev'));
        elements.nextPage.addEventListener('click', () => paginationHandler.handlePageChange('next'));

        // Paiement
        elements.paymentForm.addEventListener('submit', paymentHandler.handlePayment);
    };

    // Initialisation
    const init = () => {
        authHandler.updateAuthUI();
        cartHandler.updateCartCount();
        productManager.updateProducts();
        setupEventListeners();
    };

    init();
});
