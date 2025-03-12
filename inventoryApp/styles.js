//Variables Globales
const sbProductButton = document.getElementById('productButton');
const sbCategoriesButton = document.getElementById('categoriesButton');
const sbHomeButton = document.getElementById('homeButton');

const newProductButton = document.getElementById('newProductButton');//Boton principal
const newCategoryButton = document.getElementById('newCategoryButton');//Boton principal

const acceptProductButton = document.getElementById('acceptProductButton');//Boton Secundario
const acceptCategoryButton = document.getElementById('acceptCategoryButton');//Boton Secundario

const cancelNewProductButton = document.getElementById('cancelAddProduct');//Boton Secundario
const cancelNewCategoryButton = document.getElementById('cancelAddCategory');//Boton Secundario

const deleteProductButtonMain = document.getElementById('deleteProductButtonMain');

const newProductMenu = document.querySelector('.addProducts');
const prueba = document.querySelector('.prueba');
const categoryMenu = document.querySelector('.addCategories');

let editMenuId;
let cancelEditProductButtonId;
let acceptEditProductButtonId;
let editProductButtonId;
let deleteProductButtonId;

let editMenu = document.querySelector('.editMenu');
let cancelEditProductButton = document.querySelector('.cancelEditProductButton');
let acceptEditProductButton = document.querySelector('.acceptEditProduct');
let editProductButton = document.querySelector('.editProductButton');
let deleteProductButton = document.querySelector('.deleteProductButton');

let inputValues = {};//Tiene almacenado el objeto listo para SourceOfTruth

let currentErrorCount = 0;
const errorHeightIncrement = 10;

let eventListenerAdded = false;//Para sideBarProductButton()

document.addEventListener('DOMContentLoaded', function() {
    createProductPage();
    showProductPage();
    createCategoryPage();
});

//Source of Truth
let sourceOfTruthProduct = [];
function saveToLocalStorage(key, data) {
    try {
        const storedProducts = localStorage.getItem('sourceOfTruthProduct');// Intenta obtener productos de LocalStorage
        if (storedProducts) {
            console.log('Si encontro en LocalStorage', sourceOfTruthProduct);
          sourceOfTruthProduct = JSON.parse(storedProducts);// Si existe productos en LocalStorage, usarlos
        } else {// Si no hay productos, usar la base en el codigo
            console.log('No hay nada en LocalStorage');
          sourceOfTruthProduct = [
            {   
              name: "LapTop Gamer",
              stock: 10,
              price: '8000',
              id: "sku-1",
              status: true, // true = Active, false = Inactive
              category: "Electronics",
              image: "assets/laptopGamer.webp" // Ruta de la imagen
            }
          ];
          localStorage.setItem('sourceOfTruthProduct', JSON.stringify(sourceOfTruthProduct));// Guarda los datos en el SoT del codigo
        }
        console.log('Products loaded from localStorage:', sourceOfTruthProduct);
    
      } catch (error) {
        console.error('Error loading products from localStorage:', error);// Si hay algun error, usar el SoT del codigo
        sourceOfTruthProduct = [
          {   
            name: "LapTop Gamer",
            stock: 10,
            price: '8000',
            id: "sku-1",
            status: true,
            category: "Electronics",
            image: "assets/laptopGamer.webp"
          }
        ];
      }
}

let currentID = parseInt(localStorage.getItem("currentID")) || sourceOfTruthProduct.length; // Recuperar ID o usar el length
localStorage.setItem("currentID", currentID + 1); // Incrementar el ID en localStorage

//Funcion para agregar productos nuevos al UI
function renderProducts() {
    let fatherContainer = document.getElementById("sourceOfTruthProductContainer");
    fatherContainer.innerHTML = ""; // Limpiar antes de renderizar, osea que siempre estara vacio en el HTML, pero agregara dinamicamente
    sourceOfTruthProduct.forEach(function(product) { //product es cada elemento en el array
        let productMainAncestorDiv = document.createElement('div');
        productMainAncestorDiv.classList.add('productMainAncestorDiv');
        productMainAncestorDiv.id = `productMainAncestor-${product.id}`;
        productMainAncestorDiv.innerHTML = 
        `
            <div class="checkBoxDiv">
                <input type="checkbox" class="checkInput" aria-controls="${product.id}"/>
            </div>
            <div class="productContainer" id="${product.id}">
                <div class="imageContainer">
                    <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null; this.src='assets/defaultImage.webp';"/>
                </div>
                <p class="name">${product.name}</p>
                <div class="status">${product.status ? "Active" : "Inactive"}</div>
                <p class="stock">${product.stock} in Stock</p>
                <p class="category">${product.category}</p>
                <p style="display: none;" class="price">${product.price}</p>
            </div>
        `;
        fatherContainer.appendChild(productMainAncestorDiv);//Introduce productContainer al inicio del fatherContainer que es SourceOfTruthProductContainer
    });
    // Guardar el estado actualizado en localStorage
    localStorage.setItem("sourceOfTruthProduct", JSON.stringify(sourceOfTruthProduct));}
    saveToLocalStorage("sourceOfTruthProduct", sourceOfTruthProduct);
renderProducts();

//Funcion para hacer push a nuevo producto con Accept Button
function pushNewProduct() {
    newProductMenu.addEventListener("input", function(event) {
        let target = event.target;
        let categorySelection = document.getElementById('productCategory');
        let uploadProductImage = document.getElementById('uploadImageInput');
        categorySelection.addEventListener('change', function(event) {
            inputValues["category"] = event.target.value; // se guarda la categoría seleccionada
            console.log('Caegoria seleccionada:', event.target.value);
        });
        uploadProductImage.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader(); // Usamos FileReader para obtener la imagen que subió el usuario
                reader.onload = function(e) {
                    inputValues["image"] = e.target.result; // La imagen se guarda en formato base64
                };
                reader.readAsDataURL(file);
            }
        });
        if (target.tagName === "INPUT") {
            inputValues[target.name] = target.value;
            console.log("Actualizando inputValues:", inputValues);
        }
    });
    acceptProductButton.addEventListener("click", function() {
        let productName = document.getElementById('productName').value; 
        let productQuantity = document.getElementById('productQuantity').value; 
        let productPrice = document.getElementById('productPrice').value; 
        let productCode = document.getElementById('productCode').value; 
        let productCategory = document.getElementById('productCategory').value; 
        let fileInput = document.getElementById('uploadImageInput'); 
        let hasImage = fileInput.files.length > 0; 
        if (!productName 
            || !productQuantity 
            || !productPrice 
            || !productCode 
            || !productCategory 
            || !hasImage) {
            alert("All fields must be filled, including Choose a Category and Upload Product Image"); 
            return; 
        }
        inputValues["name"] = productName;
        inputValues["stock"] = productQuantity; 
        inputValues["id"] = "sku-" + productCode; 
        inputValues["price"] = productPrice;
        inputValues["category"] = productCategory;
        let newProduct = { ...inputValues };
        sourceOfTruthProduct.push(newProduct);
        localStorage.setItem("sourceOfTruthProduct", JSON.stringify(sourceOfTruthProduct));
        saveToLocalStorage("sourceOfTruthProduct", sourceOfTruthProduct);
        console.log("Producto agregado:", newProduct);
        inputValues = {};// Reiniciando el objeto inputValues
        let inputs = newProductMenu.querySelectorAll("input");// Reiniciando los campos del formulario
        inputs.forEach(function(input) {
            input.value = "";
        });
        document.getElementById('productCategory').value   = ""; // Reiniciando el select de categoría
        newProductMenu.style.display = 'none';
        cancelNewProductButton.style.display = 'none';
        acceptProductButton.style.display = 'none';
        newProductButton.style.display = 'block';
        localStorage.setItem("sourceOfTruthProduct", JSON.stringify(sourceOfTruthProduct));// Gurdar en localStorage
        renderProducts();
    });
}
pushNewProduct();

//Funcion para ver ID y Class de lo que se haga click
function whatsTheIdAndClass() {
    document.addEventListener('click', function(event) {
        let target = event.target;
        console.log('ID:', target.id);
        console.log('Class:', target.className);
    })
} 
whatsTheIdAndClass();

//Funcion para click en SideBar Buttons
function sideBarProductButton() {
    let productMainPage = document.getElementById('productMainPage');
    let categoryMainPage = document.getElementById('categoriesMainPage');
    let productPage = document.getElementById('productPageContainer');
    let homeMainPage = document.getElementById('homeScreen');
    let categoryPages = document.querySelectorAll('.categoryPage');
    let categoryPageContainer = document.getElementById('categoryPageContainer');

    document.addEventListener('click', function(event) {
        let targetProduct = event.target.closest('#productButton'); //Product Button
        if (targetProduct) {
            console.log('Product Button funciona bien');
            productMainPage.style.display = 'flex';
            categoryMainPage.style.display = 'none';
            productPage.style.display = 'none';
            homeMainPage.style.display = 'none';
            
            if (categoryPageContainer) categoryPageContainer.style.display = 'none';
            categoryPages.forEach(function(page) {
                page.style.display = 'none';
            });
        }

        let targetHome = event.target.closest('#homeButton'); //Home Button
        if (targetHome) {
            console.log('Home Button funciona bien');
            productMainPage.style.display = 'none';
            categoryMainPage.style.display = 'none';
            productPage.style.display = 'none';
            homeMainPage.style.display = 'flex';
            
            // Hide category page container and all category pages
            if (categoryPageContainer) categoryPageContainer.style.display = 'none';
            categoryPages.forEach(function(page) {
                page.style.display = 'none';
            });
        }

        let targetCategory = event.target.closest('#categoriesButton'); //Categories Button
        if (targetCategory) {
            console.log('Category Button funciona bien');
            productMainPage.style.display = 'none';
            categoryMainPage.style.display = 'flex';
            productPage.style.display = 'none';
            homeMainPage.style.display = 'none';
            
            // Hide category page container and all category pages
            if (categoryPageContainer) categoryPageContainer.style.display = 'none';
            categoryPages.forEach(function(page) {
                page.style.display = 'none';
            });
        }
    });
}
sideBarProductButton();

//Funcion para mostrar Product Page Selectivo
function showProductPage() {
    let productMainPage = document.getElementById('productMainPage');
    document.addEventListener('click', function(event) {
        let elementClicked = event.target.closest("[id^='sku-']"); //sku-X
        if (elementClicked) {
            let idClickeado = elementClicked.id; // Obtiene el ID, por ejemplo, "sku-1"
            let idPagina = "page-" + idClickeado; // Construye el nuevo ID, ejemplo: "page-sku-1"
            let pagina = document.getElementById(idPagina); //page-sku-X
            let pageContainer = document.getElementById('productPageContainer');
            if (pagina) {
                pagina.style.display = 'block';
                pageContainer.style.display = 'block';
                productMainPage.style.display = 'none';
                console.log('showProductPage Funciona bien');
            }else {
                console.log('Page Doesnt Exist');
            }
        }
    });
}

//Funcion para crear ProductPage dinamicamente
function createProductPage() {
document.addEventListener('click', function(event) {
    // Obtener el elemento que tenga un id que empiece por "sku-"
    let idElement = event.target.closest("[id^='sku-']");
    if (!idElement) return; // Si no se hace clic en un elemento relevante, salir

    // Extraer datos del elemento clickeado
    let nameElement = idElement.querySelector('.name');
    let stockElement = idElement.querySelector('.stock');
    let priceElement = idElement.querySelector('.price').textContent;
    let priceNumber = parseInt(priceElement);
    let imageElement = idElement.querySelector('.imageContainer img');
    let base64Src = imageElement.src; // data:image/png;base64,iVBOR_0B...
    let idJustNumber = parseInt(idElement.id.replace('sku-', ''), 10);

    if (!nameElement || !stockElement) return;

    let name = nameElement.textContent;
    let stock = stockElement.textContent;
    let skuNumber = parseInt(idElement.id.replace('sku-', ''), 10);

    // Limpiar el contenedor de la página de producto
    let fatherContainer = document.getElementById('productPageContainer');
    fatherContainer.innerHTML = '';

    // Crear el nuevo contenedor de la página de producto
    let productPage = document.createElement('div');
    productPage.classList.add('productPageCategory');
    productPage.id = `page-sku-${skuNumber}`;

    productPage.innerHTML = `
    <div class="productPageHeader">
        <h2>${name}</h2>
        <p class="lastUpdated">
        Last update <span class="date">February 25, 2025 at 7:41pm</span>
        </p>
    </div>
    <div class="productPageMain">
        <div class="productInfo">
        <div class="imageProductPage">
            <img src="${base64Src}" alt="Imagen de ${name}">
        </div>
        <div class="textContainer">
            <p class="productName">${name}</p>
            <p id="productBrand-${idJustNumber}" class="productBrand">EDIT</p>
            <p id="productSpecs-${idJustNumber}" class="productSpecs">EDIT</p>
        </div>
        </div>
        <div class="productDetails">
        <div class="buttonsContainer">
            <button id="deleteProductButton-${idJustNumber}" class="deleteProductButton">Delete</button>
            <button id="editProductButton-${idJustNumber}" class="editProductButton">Edit Product</button>
            <button style="z-index: 1;" type="button" class="cancelEditProductButton" id="cancelEditProduct-${idJustNumber}">
            Cancel
            </button>
            <button type="button" class="acceptEditProduct" id="acceptEditProduct-${idJustNumber}">
            Accept
            </button>
        <div id="editMenu-${idJustNumber}" class="editMenu">
            <label for="editTitle">Tilte</label>
            <input class="editTitle" type="text" id="editTitle-${idJustNumber}">
            <label for="editSubtitle">Brand</label>
            <input class="editSubtitle" type="text" id="editSubtitle-${idJustNumber}">
            <label for="editSpecs">Details</label>
            <input class="editSpecs" type="text" id="editSpecs-${idJustNumber}">
        </div>
        </div>
        <div class="availability">
            <strong>Availability</strong>
            <p>Stock: <span class="stockInfo">${stock}</span></p>
            <p>Product SKU: <span class="productSku">${skuNumber}</span></p>
            <p class="priceProduct">Price: $${priceNumber}</p>
        </div>
        </div>
    </div>
    <div class="relatedProductsContainer">
        <div class="textContainer">Related Products</div>
        <div class="relatedProducts">
        <div class="related"></div>
        <div class="related"></div>
        <div class="related"></div>
        <div class="related"></div>
        <div class="related"></div>
        <div class="related"></div>
        <div class="related"></div>
        </div>
    </div>
    `;
    fatherContainer.appendChild(productPage);
    editMenu = document.getElementById(`editMenu-${idJustNumber}`);
    cancelEditProductButton = document.getElementById(`cancelEditProduct-${idJustNumber}`);
    acceptEditProductButton = document.getElementById(`acceptEditProduct-${idJustNumber}`);
    editProductButton = document.getElementById(`editProductButton-${idJustNumber}`);
    deleteProductButton = document.getElementById(`deleteProductButton-${idJustNumber}`);
});
}

//Funcion para mostrar Category Page
function showCategoryPageMain() {
    document.addEventListener('click', function(event) {
        let target = event.target.closest('.innerCard');
        if (target) {
            let categoryClicked = target.closest('[id]')?.id || null;//categoryClicked tiene el ID correcto
            if (categoryClicked) {
                let idClickeado = categoryClicked; // Obtiene el ID, por ejemplo, "sku-1"
                let idPagina = "page-" + idClickeado; // Construye el nuevo ID, ejemplo: "page-sku-1"
                let pagina = document.getElementById(idPagina);
                if (pagina) {
                    let productCategory = document.querySelector('.productCategory');
                    let categoriesContainer = document.querySelector('.categoriesContainer');
                    productCategory.style.display = 'none';
                    categoriesContainer.style.display = 'none';
                    pagina.style.display = 'block';
                    productCategory.style.display = 'none';
                }
            }
        }
    })
}
showCategoryPageMain();

//Funcion para mostrar Menu Agregar Producto, Agregar Categoria, uso de Cancel New Product Button y Cancel New Category Button
function showMenus() {
    document.addEventListener('click', function(event) {
        let target = event.target;
        if (target) {
            if (target.id === 'newProductButton') {
                let prueba = document.getElementById('prueba');
                newProductMenu.style.display = 'flex';
                prueba.style.display = 'flex';
                cancelNewProductButton.style.display = 'block';
                acceptProductButton.style.display = 'block';
                newProductButton.style.display = 'none';
                console.log('Menu New Product Visible');
            }
        }
        if (target.id === 'cancelAddProduct') {
            newProductMenu.style.display = 'none';
            prueba.style.display = 'none';
            cancelNewProductButton.style.display = 'none';
            acceptProductButton.style.display = 'none';
            newProductButton.style.display = 'block';
        }
        if (target.id === 'newCategoryButton') {
            let categoryMenuValue = getComputedStyle(categoryMenu).display;
            if (categoryMenuValue !== 'flex') {
                categoryMenu.style.display = 'flex'
                cancelNewCategoryButton.style.display = 'block';
                acceptCategoryButton.style.display = 'block';
                newCategoryButton.style.display = 'none';
            }
        }
        if (target.id === 'cancelAddCategory') {
            categoryMenu.style.display = 'none';
            cancelNewCategoryButton.style.display = 'none';
            acceptCategoryButton.style.display = 'none';
            newCategoryButton.style.display = 'block';
        }
        let categoryMenuValue = getComputedStyle(categoryMenu).display;
        if (categoryMenuValue !== 'none') {
            if (target.id !== 'addCategories' 
                && target.id !== 'cancelAddCategory' 
                && target.id !== 'newCategoryButton' 
                && target.id !== 'categoryName' 
                && target.id !== 'productCategory' 
                && target.id !== 'acceptCategoryButton' 
                && target.id !== 'fileIcon' 
                && target.tagName !== 'LABEL'
            ) {
                categoryMenu.style.display = 'none';
                cancelNewCategoryButton.style.display = 'none';
                acceptCategoryButton.style.display = 'none';
                newCategoryButton.style.display = 'block';
            }
        }
        let productMenuValue = getComputedStyle(newProductMenu).display;
        if (productMenuValue !== 'none') {
            if (target.id !== 'cancelAddProduct' 
            && target.id !== 'acceptProductButton' 
            && target.id !== 'newProductButton' 
            && target.id !== 'addProducts' 
            && target.tagName !== 'INPUT'
            && target.tagName !== 'LABEL'
            && target.tagName !== 'SELECT' 
            && !target.classList.contains('nameMessageContainer') 
            && !target.classList.contains('quantityMessageContainer') 
            && !target.classList.contains('priceMessageContainer') 
            && !target.classList.contains('codeMessageContainer')
            && !target.classList.contains('addCategories')
         ) {
            newProductMenu.style.display = 'none';
            cancelNewProductButton.style.display = 'none';
            acceptProductButton.style.display = 'none';
            newProductButton.style.display = 'block';
            }
        }
    })
}
showMenus();

//Funcion para Check Input
function deleteSelectedProduct() {
    document.addEventListener('change', function(event) {
        if (event.target.matches('input[type="checkbox"][aria-controls]') && event.target.checked) {
            let targetId = event.target.getAttribute('aria-controls');
            let targetDiv = document.getElementById(`productMainAncestor-${targetId}`);
            if (targetDiv) {
                console.log('Si funciona');
                newProductButton.style.display = 'none';
                cancelNewProductButton.style.display = 'block';
                cancelNewProductButton.onclick = function() {
                    cancelNewProductButton.style.display = 'none';
                    newProductButton.style.display = 'block';
                    deleteProductButtonMain.style.display = 'none';
                    event.target.checked = false;
                }
                deleteProductButtonMain.style.display = 'block';
                deleteProductButtonMain.onclick = function() {
                    let result = confirm('Are you sure you want to delete this? This action cannot be undone');
                    if (result) {
                        targetDiv.remove();
                        event.target.checked = false;
                        sourceOfTruthProduct = sourceOfTruthProduct.filter(product => product.id !== targetId);
                        localStorage.setItem("sourceOfTruthProduct", JSON.stringify(sourceOfTruthProduct));
                        saveToLocalStorage("sourceOfTruthProduct", sourceOfTruthProduct);
                        console.log('Usuario acepto borrar producto');
                    } else {
                        event.target.checked = false;
                        console.log('Usuario cancelo borrar producto');
                    }
                    cancelNewProductButton.style.display = 'none';
                    newProductButton.style.display = 'block';
                    deleteProductButtonMain.style.display = 'none';
                    deleteProductButtonMain.onclick = null; // Limpia el evento después de ejecutarse
                };
            }
        } else {
            cancelNewProductButton.style.display = 'none';
            newProductButton.style.display = 'block';
            deleteProductButtonMain.style.display = 'none';
            console.log('Unchecked');
        }
    });
}

deleteSelectedProduct();

//Funcion para ver Category Page Selectivo
function showCategoryPage() {
    document.addEventListener('click', function(event) {
        let target = event.target;
        let categoryClicked = target.closest("[id^='cat-']");
        if (categoryClicked) {
            let idClickeado = categoryClicked.id;
            let idPagina = 'categoryPage-' + idClickeado;
            let pagina = document.getElementById(idPagina);
            let categoryPageContainer = document.getElementById('categoryPageContainer');
            if (pagina) {
                let productMainPage = document.getElementById('productMainPage');
                let categoryMainPage = document.getElementById('categoriesMainPage');
                let productPage = document.getElementById('productPageContainer');
                let homeMainPage = document.getElementById('homeScreen');
                productMainPage.style.display = 'none';
                categoryMainPage.style.display = 'none';
                productPage.style.display = 'none';
                homeMainPage.style.display = 'none';

                let allCategoryPages = document.querySelectorAll('.categoryPage');
                allCategoryPages.forEach(function(page) {
                    page.style.display = 'none';
                });

                pagina.style.display = 'block';
                categoryPageContainer.style.display = 'block';
            }else {
                console.log('Category Page Doesnt Exist');
            }
        }
    })
}
showCategoryPage(); 


//Funcion para crear CategoryPage dinamicamente
function createCategoryPage() {
    let categoriesContainer = document.querySelector('.cardsContainer');
    categoriesContainer.addEventListener('click', function(event) {
        let target = event.target;
        let cardClicked = target.closest("[id^='cat-']");//Obtiene class:"cards" y id:"cat-XXXX"
        if (!cardClicked) return;
        //Obtener informacion relevante de lo que se dio click
        let title = cardClicked.querySelector('.cardText .title').textContent;//Obtiene Title de la Category
        let idClickeado = cardClicked.id;//Obtiene id:"cat-XXXX"
        let idPagina = 'categoryPage-' + idClickeado;//Obtiene categoryPage-cat-XXXX
        // Verificar si la página ya existe
        if (document.getElementById(idPagina)) {
            console.log('La página ya existe:', idPagina);
            showCategoryPage(idPagina);
            return;
        }
        //Contenedor Padre padre
        let fatherContainer = document.getElementById('categoryPageContainer');//Bien
        //Crea el nuevo contenedor con la pagina de la categoria
        let categoryPage = document.createElement('div');
        categoryPage.classList.add('categoryPage');
        categoryPage.id = idPagina;
        categoryPage.innerHTML = 
        `
    <div class="productsHeader">
        <h2 class="lgTxt">Category - ${title}</h2>
        <div class="searchInputContainerProduct">
        <input
            type="search"
            class="inputSearch"
            placeholder="Search product..."
            oninput="buscarProducto()"
            autocomplete="off"
        />
        <img src="assets/icons8-search-50.png" alt="" />
        </div>
        <div class="productButtonsContainer">
            <button style="z-index: 2;" type="button" class="buttonNewProduct" >
            + New Product
            </button>
            <button style="z-index: 1;" type="button" class="buttonCancel" >
            Cancel
            </button>
            <button style="z-index: 2;" type="button" class="buttonDelete" >
                Delete
            </button>
        </div>
    </div>
    <div class="productToolBar">
        <div class="toolContainer">
            <input style="opacity: 0;" type="checkbox" class="checkInput" />
        </div>
        <div class="toolContainer">
            <p class="tool">Image</p>
            <button class="sort">^</button>
        </div>
        <div class="toolContainer">
            <p class="tool">Name of product</p>
            <button class="sort">^</button>
        </div>
        <div class="toolContainer">
            <p class="tool">Status</p>
            <button class="sort">^</button>
        </div>
        <div class="toolContainer">
            <p class="tool">Stock Info</p>
            <button class="sort">^</button>
        </div>
        <div class="toolContainer">
            <p class="tool">Category</p>
            <button class="sort">^</button>
        </div>
        <div class="prueba">
            <div class="addProductsCat">
                <div class="nameMessageContainer">
                    <label for="productName">Product Name</label>
                    <input
                        placeholder="Name"
                        type="text"
                        required
                        minlength="2"
                        maxlength="100"
                        pattern="[A-Za-z0-9\s]+"
                        class="input"
                        name="nameAddCategory"
                    />
                    <p class="errorMessage">
                        This input cannot be empty.
                    </p>
                </div>
                <div class="quantityMessageContainer">
                    <label for="productQuantityCategory">Product Quantity</label>
                    <input
                        placeholder="Quantity"
                        id="productQuantityCategory"
                        type="number"
                        required
                        min="1"
                        step="1"
                        class="input"
                        name="VERIFICAR"
                    />
                    <p class="errorMessage">
                        This input cannot be empty.
                    </p>
                </div>
                <div class="priceMessageContainer">
                    <label for="productPriceCategory">Product Price</label>
                    <input
                        placeholder="Price"
                        id="productPriceCategory"
                        type="number"
                        required
                        min="0.01"
                        step="0.01"
                        class="input"
                        name="VERIFICAR"
                    />
                    <p class="errorMessage">
                        This input cannot be empty.
                    </p>
                </div>
                <div class="codeMessageContainer">
                    <label for="productCodeCategory">Product Code</label>
                    <input
                        placeholder="Code"
                        id="productCodeCategory"
                        type="text"
                        required
                        minlength="3"
                        maxlength="20"
                        pattern="[A-Za-z0-9]+"
                        class="input"
                        name="VERIFICAR"
                    />
                    <p class="errorMessage">
                        This input cannot be empty.
                    </p>
                </div>
                <label for="productCategoryCat">Category</label>
                <select
                    id="productCategoryCat"
                    required
                    class="input"
                    name="categoryCat"
                >
                    <option value="chooseCategory">Choose a Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Jewelry">Jewelry</option>
                    <option value="Perfumes">Perfumes</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Beauty">Beauty</option>
                    <option value="On Sale">On Sale</option>
                </select>
                <div class="uploadImageMessageContainer">
                    <label id="uploadImageCat" for="uploadImageCatInput">Upload Product Image</label>
                    <input id="uploadImageCatInput" class="hidden" type="file" accept="image/png, image/jpeg, image/jpg" required>
                    <p class="errorMessage">
                        This input cannot be empty.
                    </p>
                </div>
                <button type="button" class="button" id="acceptProductButtonCat">
                    Accept
                </button>
            </div>
        </div>
    </div>
    <div id="VERIFICAR"><!--SourceOfTruth?-->
        <!--Aca se rellena con PRODUCTOS DE LA CATEGORIA-->
    </div>
`;
        fatherContainer.appendChild(categoryPage);
        console.log('Página creada:', idPagina);
    });
}
createCategoryPage();
