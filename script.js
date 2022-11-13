import storeItems from "./items.json";
import { v4 as uuidv4 } from "uuid";
let shoppingCart = [];
const CART_PREFIX = "SHOPPING-CART";
//saving the shopping cart in session storage
function saveCart() {
  sessionStorage.setItem(
    CART_PREFIX + "-items-list",
    JSON.stringify(shoppingCart)
  );
}

function loadCart() {
  const cartInfo = JSON.parse(
    sessionStorage.getItem(CART_PREFIX + "-items-list")
  );
  if (!cartInfo || cartInfo.length === 0 || shoppingCart.length !== 0) return;
  shoppingCart = [...cartInfo];
  console.log(shoppingCart);
}

// if there is items in the shopping cart, show the shopping cart button
const cart = document.querySelector("[data-cart]");
const cartBtn = document.querySelector("[data-cart-btn]");
const cartLength = document.querySelector("[data-cart-length]");
const cartList = document.querySelector("[data-cart-list");
const cartListItem = document.querySelector("[data-cart-list-item");
const cartTotal = document.querySelector("[data-cart-list-total");
const storeList = document.querySelector("[data-store-list]");

const templateStoreItem = document.querySelector('[data-template-store-item]')
const templateCartItem = document.querySelector('[data-template-cart-item]')
console.log(templateCartItem)

loadCart();
displayCartBtn();
if (shoppingCart.length !== 0) {
  renderCart();
}
if (storeList) {
  renderStoreItems();
}
//showing the cart btn
function displayCartBtn() {
  cartBtn.classList.toggle("invisible", shoppingCart.length === 0);
  if (cart != null) {
    removeOverlay();
  }
  showCartLength();
}
function removeOverlay() {
  cart.style.pointerEvents = cartList.classList.contains("invisible")
    ? "none"
    : "";
}
function showCartLength() {
  cartLength.innerText = shoppingCart.length;
}
// click on the shopping cart button will toggle the list of items in the cart, but the cart btn remains visible
cartBtn.addEventListener("click", () => {
  cartList.classList.toggle("invisible");
  removeOverlay();
  console.log(shoppingCart);
});
// click on the cross would remove the item
// the cart will show on different pages if there is any thing inside

// storing the info of the cart inside of the session storage

//render the store list items with items.json

function renderStoreItems() {
  storeItems.forEach((item) => {
    const template = templateStoreItem.content.cloneNode(true)
    const imageElement = template.querySelector('[data-image]')
    const categoryElement = template.querySelector('[data-category]')
    const nameElement = template.querySelector('[data-name]')
    const priceElement = template.querySelector('[data-price]')
    const addBtn = template.querySelector('[data-add-btn]')
    imageElement.setAttribute(
      "src",
      `https://dummyimage.com/420x260/${item.imageColor}/${item.imageColor}`
    );
    imageElement.dataset.color = item.imageColor;
    categoryElement.innerText = item.category;
    categoryElement.dataset.category = item.category;
    nameElement.innerText = item.name;
    nameElement.dataset.name = item.name;
    priceElement.innerText = `$${parseFloat((item.priceCents / 100).toFixed(2))}`;
    priceElement.dataset.price = parseFloat((item.priceCents / 100).toFixed(2));
    addBtn.innerText = "Add to Cart";
    storeList.appendChild(template);
  });
}

// clicking add to cart in store would add item to the cart

document.addEventListener("click", (e) => {
  if (!e.target.matches("[data-add-btn]")) return;
  const detailsContainer = e.target.closest("[data-details-container]");
  const itemName = detailsContainer.querySelector("[data-name]").dataset.name;
  const itemPrice =
    detailsContainer.querySelector("[data-price]").dataset.price;
  const itemColor = detailsContainer.querySelector("[data-image]").dataset.color;
  const cartItem = {
    itemId: uuidv4(),
    itemName,
    itemPrice,
    itemColor,
  };
  shoppingCart.push(cartItem);
  displayCartBtn();
  showCartLength();
  saveCart();
  renderCart();
  // thinking about the structure of the shopping cart
  //array, use filter method?
});

//creating a dynamic shopping cart
function renderCart() {
  cartListItem.replaceChildren("");
  shoppingCart.forEach((item) => {
    const template = templateCartItem.content.cloneNode(true)
    const cartItemContainer = template.querySelector('[data-cart-item-container]')
    const imageElement = template.querySelector('[data-cart-item-image]')
    const priceElement = template.querySelector('[data-cart-item-price]')
    const nameElement = template.querySelector('[data-cart-item-name]')
    const numberElement = template.querySelector('[data-cart-item-number]')

    const num = (shoppingCart.filter((i) => i.itemColor === item.itemColor)).length;
    const firstId = shoppingCart.find(i => i.itemColor === item.itemColor).itemId
    if(num > 1 && item.itemId !== firstId) return
    cartItemContainer.dataset.id = item.itemId;
    imageElement.setAttribute(
      "src",
      `https://dummyimage.com/210x130/${item.itemColor}/${item.itemColor}`
    );

    nameElement.innerText = item.itemName;
    priceElement.innerText = `$${parseInt(item.itemPrice).toFixed(2)}`;
    if (num > 1) {
      numberElement.innerText = `x${num}`;
    }
    const sum = shoppingCart.reduce(
      (accumulator, i) => accumulator + parseInt(i.itemPrice),
      0
    );
    cartTotal.innerText = `$${sum.toFixed(2)}`;
    cartListItem.appendChild(template)
  });
}
//removing the item from cart
document.addEventListener("click", (e) => {
  if (!e.target.matches("[data-remove-from-cart-button]")) return;
  const removeId = e.target.closest("[data-id]").dataset.id;
  shoppingCart = shoppingCart.filter((i) => i.itemId !== removeId);
  saveCart();
  if (shoppingCart.length === 0) {
    cartList.classList.add("invisible");
    removeOverlay()
    cartBtn.classList.add("invisible");
    return;
  } else {
    renderCart();
    showCartLength()
  }
});

