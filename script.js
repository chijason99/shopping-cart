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
  storeList.replaceChildren("");
  storeItems.forEach((item) => {
    const itemContainer = document.createElement("div");
    itemContainer.classList.add("lg:w-1/4", "md:w-1/2", "p-4", "w-full");
    itemContainer.dataset.itemContainer = "";
    const imageContainer = document.createElement("div");
    imageContainer.classList.add(
      "block",
      "relative",
      "h-48",
      "rounded",
      "overflow-hidden"
    );
    const image = document.createElement("img");
    image.classList.add(
      "object-cover",
      "object-center",
      "w-full",
      "h-full",
      "block"
    );
    image.setAttribute("alt", "ecommerce");
    image.setAttribute(
      "src",
      `https://dummyimage.com/420x260/${item.imageColor}/${item.imageColor}`
    );
    imageContainer.appendChild(image);
    itemContainer.appendChild(imageContainer);
    const detailsContainer = document.createElement("div");
    detailsContainer.classList.add(
      "mt-4",
      "flex",
      "items-end",
      "justify-between"
    );
    detailsContainer.dataset.detailsContainer = "";
    detailsContainer.dataset.color = item.imageColor;
    const details = document.createElement("div");
    const category = document.createElement("h3");
    category.classList.add(
      "text-gray-500",
      "text-xs",
      "tracking-widest",
      "title-font",
      "uppercase",
      "mb-1"
    );
    category.innerText = item.category;
    category.dataset.category = "";
    const name = document.createElement("h2");
    name.classList.add("text-gray-900", "title-font", "text-lg", "font-medium");
    name.innerText = item.name;
    name.dataset.name = "";
    const price = document.createElement("p");
    price.classList.add("mt-1");
    price.innerText = `$${parseFloat((item.priceCents / 100).toFixed(2))}`;
    price.dataset.price = parseFloat((item.priceCents / 100).toFixed(2));
    const addToCartBtn = document.createElement("button");
    addToCartBtn.classList.add(
      "text-white",
      "py-2",
      "px-4",
      "text-xl",
      "bg-blue-500",
      "rounded",
      "hover:bg-blue-700"
    );
    addToCartBtn.innerText = "Add to Cart";
    addToCartBtn.dataset.add = "";
    details.appendChild(category);
    details.appendChild(name);
    details.appendChild(price);
    detailsContainer.appendChild(details);
    detailsContainer.appendChild(addToCartBtn);
    itemContainer.appendChild(detailsContainer);
    storeList.appendChild(itemContainer);
  });
}

// clicking add to cart in store would add item to the cart

document.addEventListener("click", (e) => {
  if (!e.target.matches("[data-add]")) return;
  const detailsContainer = e.target.closest("[data-details-container]");
  const itemName = detailsContainer.querySelector("[data-name]").innerText;
  const itemPrice =
    detailsContainer.querySelector("[data-price]").dataset.price;
  const itemColor = detailsContainer.dataset.color;
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
  console.log(shoppingCart);
  // thinking about the structure of the shopping cart
  //array, use filter method?
});

//creating a dynamic shopping cart
function renderCart() {
  cartListItem.replaceChildren("");
  shoppingCart.forEach((item) => {
    const num = (shoppingCart.filter((i) => i.itemColor === item.itemColor)).length;
    const firstId = shoppingCart.find(i => i.itemColor === item.itemColor).itemId
    if(num > 1 && item.itemId !== firstId) return
    const newCartListItemContainer = document.createElement("div");
    newCartListItemContainer.classList.add("mb-6");
    newCartListItemContainer.dataset.id = item.itemId;
    const newCartListItemImageContainer = document.createElement("div");
    newCartListItemImageContainer.classList.add(
      "block",
      "relative",
      "h-24",
      "rounded",
      "overflow-hidden"
    );
    const newCartListImage = document.createElement("img");
    newCartListImage.setAttribute("alt", "ecommerce");
    newCartListImage.classList.add(
      "object-cover",
      "object-center",
      "w-full",
      "h-full",
      "block",
      "rounded"
    );
    newCartListImage.setAttribute(
      "src",
      `https://dummyimage.com/210x130/${item.itemColor}/${item.itemColor}`
    );
    const newRemoveBtn = document.createElement("button");
    newRemoveBtn.dataset.removeFromCartButton = "";
    newRemoveBtn.classList.add(
      "absolute",
      "top-0",
      "right-0",
      "bg-black",
      "rounded-tr",
      "text-white",
      "w-6",
      "h-6",
      "text-lg",
      "flex",
      "justify-center",
      "items-center"
    );
    newRemoveBtn.innerText = " \xD7 ";
    newCartListItemImageContainer.appendChild(newCartListImage);
    newCartListItemImageContainer.appendChild(newRemoveBtn);
    const newCartListItemDetailsContainer = document.createElement("div");
    newCartListItemDetailsContainer.classList.add(
      "mt-2",
      "flex",
      "justify-between"
    );
    const newCartListItemTextContainer = document.createElement("div");
    newCartListItemTextContainer.classList.add(
      "flex",
      "items-center",
      "title-font"
    );
    const newItemName = document.createElement("h2");
    newItemName.classList.add("text-gray-900", "text-lg", "font-medium");
    newItemName.innerText = item.itemName;
    const newItemPrice = document.createElement("div");
    newItemPrice.innerText = `$${parseInt(item.itemPrice).toFixed(2)}`;
    newCartListItemTextContainer.appendChild(newItemName);
    if (num > 1) {
      const newItemNumber = document.createElement("span");
      newItemNumber.classList.add(
        "text-gray-600",
        "text-sm",
        "font-bold",
        "ml-1"
      );
      newItemNumber.innerText = `x${num}`;
      newCartListItemTextContainer.appendChild(newItemNumber)
    }
    newCartListItemDetailsContainer.appendChild(newCartListItemTextContainer);
    newCartListItemDetailsContainer.appendChild(newItemPrice);
    newCartListItemContainer.appendChild(newCartListItemImageContainer);
    newCartListItemContainer.appendChild(newCartListItemDetailsContainer);
    cartListItem.append(newCartListItemContainer);
    const sum = shoppingCart.reduce(
      (accumulator, i) => accumulator + parseInt(i.itemPrice),
      0
    );
    cartTotal.innerText = `$${sum.toFixed(2)}`;
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
