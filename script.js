/*
Contributors:
Serena Edwards 2306227
Deondre Williams 2307492
Joshua Ivey 2305263
Roneil Webster 2306227
Leary White 2403275

Module: Web Programming (CIT2011)
Lecturer: Ms. Christine Anuli
Occurrence: UM2 (Thursday 1pm - 3pm)
Assignment: Group Project
*/
console.log("JavaScript is running..."); //make sure java is connected

// ---------------- Registration Script ----------------
const registerForm = document.getElementById("registerForm");  //gets the form and saves it as a variable, dom 

// Ensure Admin User Exists
document.addEventListener("DOMContentLoaded", () => {
  let users = JSON.parse(localStorage.getItem("RegistrationData")) || [];
  const adminExists = users.some(u => u.username === "111-222-333");

  if (!adminExists) {
    const adminUser = {
      firstName: "Admin",
      lastName: "Admin",
      dob: "2000-01-01",
      gender: "other",
      email: "admin@stitch.com",
      phone: "0000000000",
      username: "111-222-333", // Admin TRN
      password: "123456789",   // Admin Password
      age: 25,
      dateOfRegistration: new Date().toLocaleDateString(),
      cart: [],
      invoices: []
    };
    users.push(adminUser);
    localStorage.setItem("RegistrationData", JSON.stringify(users));
    console.log("Admin account initialized.");
  }
});

if (registerForm) {  //only runs on register page
  registerForm.addEventListener("submit", function (event) { //listens for the user to press 'register'
    event.preventDefault(); //prevents the form from refreshing the page automatically and allows us to do a validation check on the values

    // Get input values - UPDATED: Added firstName, lastName, confirmPassword fields
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const dob = document.getElementById("dob").value;
    const gender = document.getElementById("gender").value;
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    // Validate inputs - UPDATED: Added validation for firstName, lastName, confirmPassword
    if (!firstName || !lastName || !dob || !gender || !email || !phone || !username || !password || !confirmPassword) {  //ensures all fields are populated and displays an error message
      alert("All fields are required!");
      return;
    }

    //  Age validation (must be 18 or older)
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      alert("You must be at least 18 years old to register.");
      return;
    }

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/; //regex expression for email
    if (!email.match(emailPattern)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    //  Password confirmation check
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const usernamePattern = /^\d{3}-\d{3}-\d{3}$/;
    if (!username.match(usernamePattern)) {
      alert("Please use the 000-000-000 pattern to enter your Tax Registration Number");
      return;
    }

    // Load existing users
    let users = JSON.parse(localStorage.getItem("RegistrationData")) || [];  //gets already saved users, turns them from text to JS array, if nothing is saved create an empty file

    // Check if trn exists
    if (users.some(u => u.username === username)) {
      alert("TRN is already taken. Please check and enter your TRN again");
      return;
    }

    // Create new user if they pass all other validation checks - UPDATED: Added firstName, lastName, age, cart[], invoices[]
    const newUser =
    {
      firstName: firstName,
      lastName: lastName,
      dob: dob,
      gender: gender,
      email: email,
      phone: phone,
      username: username, //this is trn
      password: password,
      age: age, // Store calculated age for statistics
      dateOfRegistration: new Date().toLocaleDateString(),
      cart: [],    //empty array for cart items (UPDATED from {} to [])
      invoices: [] //empty array for invoices
    };
    users.push(newUser);   //adds new user to the array users

    // Save users
    localStorage.setItem("RegistrationData", JSON.stringify(users)); //convert array to text(string) before it is stored in local storage

    console.log("User registered successfully!");
    console.log("DEBUG — value of users:", users);
    console.table(users);  //view users

    alert("Registration successful! Please log in.");

    setTimeout(() => {
      window.location.href = "logIn.html";
    }, 3000); // 3 seconds delay

  });

  //  Cancel button functionality
  const cancelBtn = document.getElementById("cancelBtn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", function () {
      registerForm.reset(); // Clears all form fields
    });
  }
}

// ---------------- Login ----------------
let loginAttempts = 3; // user gets 3 log in tries
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const enteredUsername = document.getElementById("loginUsername").value.trim();
    const enteredPassword = document.getElementById("loginPassword").value.trim();

    const users = JSON.parse(localStorage.getItem("RegistrationData")) || [];

    const user = users.find(u => u.username === enteredUsername && u.password === enteredPassword); //search for a user that matches the log in info

    if (user) {
      console.log("Login successful:", user);
      alert("Welcome, " + user.firstName + "! Redirecting to Products Page...");
      localStorage.setItem("loggedInUser", JSON.stringify(user)); //allows other pages to know what user is logged in
      window.location.href = "products.html";
      return;
    }

    // if login failed
    loginAttempts--;

    if (loginAttempts > 0) {
      alert("Invalid TRN or password. You have " + loginAttempts + " attempt(s) remaining.");
    } else {
      alert("Your account is locked. Redirecting...");

      // Store flag to show locked status if needed
      localStorage.setItem("accountLocked", "true");

      window.location.href = "accountLocked.html";   // redirect to locked page
    }
  });
}

//Reset Password on the Log In Page
const resetForm = document.getElementById("resetForm");

// Run this only on reset page
if (resetForm) {

  resetForm.addEventListener("submit", function (event) {
    event.preventDefault(); // stops the page from refreshing

    // Read what the user typed
    const emailInput = document.getElementById("resetEmail").value.trim();
    const trnInput = document.getElementById("resetTRN").value.trim();

    // Check if fields are empty
    if (emailInput === "" || trnInput === "") {
      alert("Please enter both email and TRN.");
      return;
    }

    // Get registered users from localStorage
    const users = JSON.parse(localStorage.getItem("RegistrationData")) || [];

    // Check if a user exists with that TRN
    const foundUser = users.find(u => u.username === trnInput);

    if (!foundUser) {
      alert("No account found with this TRN.");
      return;
    }

    // Check if the email matches the TRN
    if (foundUser.email !== emailInput) {
      alert("The email does not match this TRN.");
      return;
    }

    // Simulate sending reset link
    alert("A password reset link has been sent to your email.");

    // Redirect back to login page after 2 seconds
    setTimeout(() => {
      window.location.href = "logIn.html";
    }, 2000);
  });
}


// ---------------- Navigation Buttons ----------------
const goToSignupBTN = document.getElementById("goToSignupBTN");
if (goToSignupBTN) {
  goToSignupBTN.addEventListener("click", function () {
    window.location.href = "index.html";
  });
}

const goTologinBTN = document.getElementById("goTologinBTN");
if (goTologinBTN) {
  goTologinBTN.addEventListener("click", function () {
    window.location.href = "logIn.html";
  });
}

// logout button on the side bar
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    alert("You have been logged out.");
    window.location.href = "logIn.html";
  });
}

//  Add items to cart (products.html)
//  Display, remove, and clear items (cart.html)
//  Data stored using localStorage (browser-based)

// ---------------- Admin Check ----------------
function checkAdminStatus() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const adminLinks = document.querySelectorAll(".admin-link");

  // Show dashboard link for everyone now description says "show it for all users"
  adminLinks.forEach(link => {
    link.style.display = "flex";
  });
}

// Run on every page load
document.addEventListener("DOMContentLoaded", checkAdminStatus);

// WHEN PAGE LOADS
document.addEventListener("DOMContentLoaded", () => {

  // PRODUCTS PAGE: Dynamic Rendering & Add to Cart
  if (window.location.pathname.includes("products.html")) {

    // a. Product List (Array of Objects)
    const initialProducts = [
      // --- Clothes ---
      { name: "Baby Blue Two Piece Shorts Set", price: 3800, image: "babyBlueSet.png", category: "Clothes", description: "A comfortable and stylish baby blue two-piece set, perfect for casual outings." },
      { name: "White Halter Back Top", price: 2700, image: "whiteBlouse.png", category: "Clothes", description: "An elegant white halter back top that pairs well with any bottom." },
      { name: "Pink and Black Ruffle Skirt", price: 2200, image: "ruffleSkirt.png", category: "Clothes", description: "Fun and flirty pink and black ruffle skirt for a bold look." },
      { name: "Beige Mesh Top", price: 6000, image: "beigeMeshTop.png", category: "Clothes", description: "Chic beige mesh top, ideal for layering or making a statement." },
      { name: "Reggae Jamming Shorts Two Piece", price: 4700, image: "reggaeTwoPiece.png", category: "Clothes", description: "Vibrant reggae-themed two-piece shorts set to show your spirit." },
      { name: "Orange Kiwi Shorts Set", price: 4200, image: "orangeKiwiSet.png", category: "Clothes", description: "Bright and fruity orange kiwi shorts set for summer vibes." },
      { name: "Brown and White Sweater Top", price: 4000, image: "brownSweater.png", category: "Clothes", description: "Cozy brown and white sweater top for cooler evenings." },
      { name: "Strawberry Shortcake Swim Set", price: 6100, image: "strawberrySwimSuit.png", category: "Clothes", description: "Adorable strawberry-themed swim set for the beach or pool." },
      { name: "Green Ethereal Maxi Skirt", price: 6500, image: "greenTeaSet.png", category: "Clothes", description: "Flowy green ethereal maxi skirt that adds grace to your movement." },
      { name: "White Date Night Dress", price: 7000, image: "dateNightDress.png", category: "Clothes", description: "Stunning white dress designed for the perfect date night." },

      // --- Bags and Accessories ---
      { name: "Bottle Holder", price: 1000, image: "bottleHolder.png", category: "Bags", description: "Handy crochet bottle holder to keep your hydration close." },
      { name: "Blue Head Tie/Scarf", price: 1800, image: "headscarf.png", category: "Bags", description: "Versatile blue head tie that can also be styled as a scarf." },
      { name: "Cherry Bag Charm", price: 700, image: "cherryBagCharm.png", category: "Bags", description: "Cute cherry bag charm to add personality to your accessories." },
      { name: "Bow Tote Bag", price: 5600, image: "bowTote.png", category: "Bags", description: "Stylish tote bag featuring a prominent bow design." },
      { name: "Sunflower Scrunchie", price: 800, image: "sunflowerScrunchie.png", category: "Bags", description: "Bright sunflower scrunchie to add a pop of color to your hair." },
      { name: "Brown Duffle Bag", price: 5000, image: "brownDuffle.png", category: "Bags", description: "Spacious brown duffle bag for all your travel or gym needs." },
      { name: "Multicoloured Headband", price: 1000, image: "Headband.png", category: "Bags", description: "Fun multicoloured headband to keep your hair back in style." },
      { name: "Ruffle Beanie", price: 3500, image: "ruffleHat.png", category: "Bags", description: "Cozy ruffle beanie to keep you warm and fashionable." },
      { name: "Book Mark", price: 1000, image: "flowerbookMarker.png", category: "Bags", description: "Delicate flower bookmark for the avid reader." },
      { name: "AirPod Case", price: 1500, image: "airPodcase.png", category: "Bags", description: "Protective and stylish case for your AirPods." },

      // --- Jewelry ---
      { name: "(8) Piece Earring Set", price: 5500, image: "earringEight.png", category: "Jewelry", description: "Comprehensive 8-piece earring set for endless mix-and-match options." },
      { name: "Flower Hoop Earring", price: 1200, image: "flowerHoop.png", category: "Jewelry", description: "Large flower hoop earrings that make a bold statement." },
      { name: "(3) Gold Necklace with Flower Pendant", price: 4500, image: "necklaceThree.png", category: "Jewelry", description: "Elegant 3-layer gold necklace featuring a flower pendant." },
      { name: "(4) Gold Bracelets with Flower Charms", price: 4800, image: "braceletFour.png", category: "Jewelry", description: "Set of 4 gold bracelets adorned with charming flower details." },
      { name: "Dangling Sunflower Earring", price: 1800, image: "sunFlowerEarring.png", category: "Jewelry", description: "Cheerful dangling sunflower earrings to brighten your day." },
      { name: "Pink Earring ", price: 1800, image: "pinkFlowerEarring.png", category: "Jewelry", description: "Soft pink earrings that add a touch of femininity." },
      { name: "Silver Necklace with Multicoloured Charms ", price: 2100, image: "silverNecklace.png", category: "Jewelry", description: "Silver necklace featuring playful multicoloured charms." },
      { name: "Blue Dainty Bracelet", price: 1000, image: "blueFlowerBracelet.png", category: "Jewelry", description: "Dainty blue bracelet perfect for subtle accessorizing." },
      { name: "Strawberry Earrings", price: 1300, image: "strawberryEarrings.png", category: "Jewelry", description: "Sweet strawberry earrings for a whimsical touch." },
      { name: "Orange Earrings", price: 1400, image: "orangeEarrings.png", category: "Jewelry", description: "Vibrant orange earrings to stand out from the crowd." }
    ];

    // b. Update localStorage
    if (!localStorage.getItem("AllProducts")) {
      localStorage.setItem("AllProducts", JSON.stringify(initialProducts));
    }

    // Always load from storage to ensure we have the source of truth
    const allProducts = JSON.parse(localStorage.getItem("AllProducts"));

    // c. Display Dynamically
    const clothesContainer = document.querySelector("#Clothes .product-grid");
    const bagsContainer = document.querySelector("#Bags .product-grid");
    const jewelryContainer = document.querySelector("#Jewelry .product-grid");

    // Clear existing hardcoded content
    if (clothesContainer) clothesContainer.innerHTML = "";
    if (bagsContainer) bagsContainer.innerHTML = "";
    if (jewelryContainer) jewelryContainer.innerHTML = "";

    allProducts.forEach(product => {
      const card = document.createElement("div");
      card.classList.add("product-card");

      // Render inner HTML based on product data
      // For clothes, we need size selector. For others, we might not.
      const isClothes = product.category === "Clothes";

      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <p style="font-size:0.8rem; color:#666; font-weight:normal; margin-bottom:10px;">${product.description}</p>
        ${isClothes ? `
        <label for="size">Size:</label>
        <select class="size">
          <option value="S">Small</option>
          <option value="M">Medium</option>
          <option value="L">Large</option>
          <option value="XL">Extra Large</option>
        </select>` : ''}
        <label for="qty">Quantity:</label>
        <input type="number" name="quantity" min="1" max="10" value="1">
        <br> <br> <button>Add to Cart</button>
      `;

      // Determine where to append
      if (product.category === "Clothes" && clothesContainer) {
        clothesContainer.appendChild(card);
      } else if (product.category === "Bags" && bagsContainer) {
        bagsContainer.appendChild(card);
      } else if (product.category === "Jewelry" && jewelryContainer) {
        jewelryContainer.appendChild(card);
      }

      // 1. Add Event Listener Immediately (Logic copied from previous implementation)
      const button = card.querySelector("button");
      button.addEventListener("click", () => {
        const qtyInput = card.querySelector("input[name='quantity']");
        const quantity = parseInt(qtyInput.value);
        let size = null;

        if (isClothes) {
          const sizeSelect = card.querySelector(".size");
          size = sizeSelect.value;
        }

        const productToAdd = {
          name: product.name,
          price: product.price,
          size: size,
          quantity: quantity,
          img: product.image
        };

        saveToCart(productToAdd);
      });
    });
  }

  // CART PAGE: Display Cart + Clear Cart Button
  if (window.location.pathname.includes("cart.html")) {
    displayCart();

    const clearButton = document.getElementById("clear-cart");
    if (clearButton) {
      clearButton.addEventListener("click", clearCart);
    }
  }
});

// -------------------------------------------------------------------
// SAVE TO CART (Shared between both pages)
function saveToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Normalize size to null for non-clothes
  if (product.size === undefined || product.size === "") {
    product.size = null;
  }

  // Check if same name + size combo already exists
  const existingItem = cart.find(
    i => i.name === product.name && (i.size ?? null) === (product.size ?? null)
  );

  if (existingItem) { //if it does increase quantity
    existingItem.quantity += product.quantity;
  } else {
    cart.push(product);  //if it doesnt exits add new product
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  alert(`${product.name}${product.size ? " (" + product.size + ")" : ""} has been added to your cart 🛍️`);
}

// -------------------------------------------------------------------
// Normalize cart (ensure size always has a consistent format) 
// Make sure all products have a size for clothes its s,m etc but for jewelry its null, helps when checking for duplicates
function normalizeCartInStorage() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let changed = false;

  cart = cart.map(it => {  //creates a new array with updated items
    if (it.size === undefined || it.size === "") {
      changed = true;
      return { ...it, size: null }; //replace it with size null, copies all other data and changes size
    }
    return it; //if size is fine return the orginal 
  });

  if (changed) localStorage.setItem("cart", JSON.stringify(cart)); //only save to ls if something was changed

}

// -------------------------------------------------------------------
// DISPLAY CART
function displayCart() {
  normalizeCartInStorage();

  const cartContainer = document.getElementById("cart-container");
  const subtotalElement = document.getElementById("subtotal");
  const discountElement = document.getElementById("discount");
  const taxElement = document.getElementById("tax");
  const totalElement = document.getElementById("total");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty 🛍️</p>";
    subtotalElement.textContent = "Subtotal: $0.00";
    discountElement.textContent = "Discount: -$0.00";
    taxElement.textContent = "Tax (15%): $0.00";
    totalElement.textContent = "Final Total: $0.00";
    return;
  }

  let subtotal = 0;

  cart.forEach(item => {
    const itemSubtotal = item.price * item.quantity;
    subtotal += itemSubtotal;

    const card = document.createElement("div"); //dynamically creates a div, dom
    card.classList.add("cart-item");

    //add product info to the div, dom
    card.innerHTML = `
     <img src="${item.img}" alt="${item.name}">
      <div class="product-info">
        <h3>${item.name}</h3>
        <p>Price: $${item.price.toFixed(2)}</p>
        ${item.size ? `<p>Size: ${item.size}</p>` : ""} <!-- Only shows for clothes -->
        <p>Quantity: ${item.quantity}</p>
        <p><strong>Subtotal: $${itemSubtotal.toFixed(2)}</strong></p>
      </div>
      <div class="product-actions">
        <button class="remove-btn">Remove</button>
      </div>
    `;

    // Normalize size before attaching remove event
    const normalizedSize = (item.size === undefined || item.size === "") ? null : item.size;

    //Deletes the exact item and its size eg Blue Blouse(M) and Blue Blouse(S) are in the cart I can delete just the small and leave the medium
    card.querySelector(".remove-btn")
      .addEventListener("click", () => removeItem(item.name, normalizedSize)); //calls remove item function that is defined below

    cartContainer.appendChild(card);  //after deletion place the new cart into the cart container div
  });

  // Apply discount and tax
  let discount = 0;
  const taxRate = 0.15; // 15%

  if (subtotal >= 6000) {
    discount = subtotal * 0.10; // 10% off orders $6000 or more
  }

  const tax = (subtotal - discount) * taxRate;
  const total = subtotal - discount + tax;

  // Update totals
  subtotalElement.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
  discountElement.textContent = `Discount: -$${discount.toFixed(2)}`;
  taxElement.textContent = `Tax (15%): $${tax.toFixed(2)}`;
  totalElement.textContent = `Final Total: $${total.toFixed(2)}`;
}

// -------------------------------------------------------------------
// REMOVE SINGLE ITEM FROM CART
function removeItem(name, size) {
  const targetSize = (size === undefined || size === "") ? null : size;
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Keep all items except the one being removed
  cart = cart.filter(it => {  //filter creates new array of items you want to keep
    const itemSize = (it.size === undefined || it.size === "") ? null : it.size;
    return !(it.name === name && itemSize === targetSize);
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();  //refreshes and the new cart with deleted items gone
}

// -------------------------------------------------------------------
// CLEAR ENTIRE CART
function clearCart() {
  localStorage.removeItem("cart");

  const cartContainer = document.getElementById("cart-container");
  const subtotalElement = document.getElementById("subtotal");
  const discountElement = document.getElementById("discount");
  const taxElement = document.getElementById("tax");
  const totalElement = document.getElementById("total");

  if (cartContainer) {
    cartContainer.innerHTML = "<p>Your cart is empty 🛍️</p>";
  }

  if (subtotalElement) subtotalElement.textContent = "Subtotal: $0.00";
  if (discountElement) discountElement.textContent = "Discount: -$0.00";
  if (taxElement) taxElement.textContent = "Tax (15%): $0.00";
  if (totalElement) totalElement.textContent = "Final Total: $0.00";

  alert("Your cart has been cleared 🧺");
}

// Redirect to checkout page
if (window.location.pathname.includes("cart.html")) {
  const checkoutBtn = document.getElementById("check-out");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      // Go to checkout page
      window.location.href = "checkout.html";
    });
  }
}

// -------------------------------------------------------------------
// CHECKOUT PAGE FUNCTIONALITY
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("checkout.html")) {

    const checkoutItems = document.getElementById("checkout-items");
    const subtotalElement = document.getElementById("subtotal");
    const discountElement = document.getElementById("discount");
    const taxElement = document.getElementById("tax");
    const totalElement = document.getElementById("total");
    const amountPaidField = document.getElementById("amountPaid");
    const paymentSelect = document.getElementById("payment");
    const cardInfo = document.getElementById("cardInfo");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function displayCheckoutItems() {
      checkoutItems.innerHTML = "";

      if (cart.length === 0) {
        checkoutItems.innerHTML = "<p>Your cart is empty 🛍️</p>";
        subtotalElement.textContent = "$0.00";
        discountElement.textContent = "-$0.00";
        taxElement.textContent = "$0.00";
        totalElement.textContent = "$0.00";
        amountPaidField.value = "";
        return;
      }

      let subtotal = 0;
      cart.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;

        const div = document.createElement("div");
        div.classList.add("checkout-item"); //dynamically creates a div
        div.innerHTML = `
         <img src="${item.img}" alt="${item.name}" class="checkout-img">
          <div class="checkout-info">
            <h4>${item.name}</h4>
            ${item.size ? `<p>Size: ${item.size}</p>` : ""}
            <p>Quantity: ${item.quantity}</p>
            <p>Price: $${item.price.toFixed(2)}</p>
            <p><strong>Subtotal: $${itemSubtotal.toFixed(2)}</strong></p>
          </div>
        `;
        checkoutItems.appendChild(div);
      });

      let discount = 0;
      const taxRate = 0.15;
      if (subtotal >= 6000) discount = subtotal * 0.10;

      const tax = (subtotal - discount) * taxRate;
      const total = subtotal - discount + tax;

      subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
      discountElement.textContent = `- $${discount.toFixed(2)}`;
      taxElement.textContent = `$${tax.toFixed(2)}`;
      totalElement.textContent = `$${total.toFixed(2)}`;

      amountPaidField.value = total.toFixed(2);
    }

    displayCheckoutItems();

    // If user picks Card: show card details, If user picks PayPal or Venmo: hide card fields
    paymentSelect.addEventListener("change", () => {
      cardInfo.style.display = paymentSelect.value === "card" ? "block" : "none";
    });

    document.getElementById("confirm").addEventListener("click", () => {
      const name = document.getElementById("name").value.trim();
      const address = document.getElementById("address").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const email = document.getElementById("email").value.trim();
      const payment = paymentSelect.value;
      const amountPaid = parseFloat(amountPaidField.value);
      const total = parseFloat(totalElement.textContent.replace("$", ""));

      if (!name || !address || !phone || !email || !payment) {
        alert("⚠️ Please fill in all required fields.");
        return;
      }

      if (payment === "paypal") {
        window.open("https://www.paypal.com/paypalme/StitchAndThreadCo", "_blank");
      }
      else if (payment === "venmo") {
        window.open("https://venmo.com/YourVenmoUsername", "_blank");
      }
      else if (payment === "card") {
        const cardNumber = document.getElementById("cardNumber").value.trim();
        if (cardNumber.length < 16) {
          alert("💳 Please enter a valid 16-digit card number.");
          return;
        }
      }

      if (amountPaid < total) {
        alert("💰 The amount paid is less than the total due.");
        return;
      }
      if (amountPaid > total) {
        alert("⚠️ Please pay the exact total amount.");
        return;
      }

      // Get logged in user
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

      if (!loggedInUser) {
        alert("⚠️ Please log in before checking out.");
        window.location.href = "logIn.html";
        return;
      }

      // Save full order details (order object)
      const order = {
        id: Date.now(),
        user: loggedInUser.username,   // identifies which user owns this order
        customerName: name,
        address: address,
        phone: phone,
        email: email,
        paymentMethod: payment,
        date: new Date().toLocaleString(),
        items: cart,
        subtotal: parseFloat(subtotalElement.textContent.replace("$", "")),
        discount: parseFloat(discountElement.textContent.replace("- $", "")),
        tax: parseFloat(taxElement.textContent.replace("$", "")),
        total: total
      };

      const orders = JSON.parse(localStorage.getItem("orders")) || [];
      orders.push(order);
      localStorage.setItem("orders", JSON.stringify(orders));

      // Save to AllInvoices
      const allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
      allInvoices.push(order);
      localStorage.setItem("AllInvoices", JSON.stringify(allInvoices));

      alert(`✅ Order Confirmed!
Thank you, ${name}!
Total: $${total.toFixed(2)}
Shipping to: ${address}`);

      localStorage.removeItem("cart");
      document.getElementById("shippingForm").reset();
      document.getElementById("paymentForm").reset();

      setTimeout(() => {
        window.location.href = "orders.html";
      }, 400);
    });

    // Cancel / Clear / Close Buttons
    document.getElementById("cancel").addEventListener("click", () => {
      if (confirm("Cancel this order?")) {
        document.getElementById("shippingForm").reset();
        document.getElementById("paymentForm").reset();
      }
    });

    document.getElementById("clear").addEventListener("click", () => {
      if (confirm("Clear all checkout information?")) {
        localStorage.removeItem("cart");
        displayCheckoutItems();
        document.getElementById("shippingForm").reset();
        document.getElementById("paymentForm").reset();
      }
    });

    document.getElementById("close").addEventListener("click", () => {
      alert("Thank you for shopping at Stitch & Thread Co!");
      window.location.href = "logIn.html"; //redirects to login page
    });
  }
});

// -------------------------------------------------------------------
// ORDERS PAGE — DISPLAY SAVED ORDERS (User-specific)
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("orders.html")) {

    const orderList = document.getElementById("orderList");
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
      alert("⚠️ Please log in to view your orders.");
      window.location.href = "logIn.html";
      return;
    }

    // Filter only orders that belong to this user
    const userOrders = orders.filter(order => order.user === loggedInUser.username);

    if (userOrders.length === 0) {
      orderList.innerHTML = "<p>No orders found for your account.</p>";
      return;
    }

    userOrders.forEach(order => {
      const div = document.createElement("div");
      div.classList.add("order-card");

      const itemsHTML = order.items.map(item => `
        <li>${item.name} (x${item.quantity}) - $${item.price.toFixed(2)}</li>
      `).join("");

      div.innerHTML = `
        <div class="invoice-header">
           <h3>🧾 INVOICE #${order.id}</h3>
           <p><strong>Stitch & Thread Co.</strong></p>
           <p>Date: ${order.date}</p>
        </div>
        <hr>
        <div class="invoice-details">
            <p><strong>Customer:</strong> ${order.customerName || "N/A"}</p>
            <p><strong>TRN:</strong> ${order.user || "N/A"}</p>
            <p><strong>Shipping Address:</strong> <br> ${order.address || "N/A"}</p>
             <p><strong>Phone:</strong> ${order.phone || "N/A"}</p>
             <p><strong>Payment Method:</strong> ${order.paymentMethod || "N/A"}</p>
        </div>
        <hr>
        <h4>Purchased Items:</h4>
        <ul class="invoice-items">${itemsHTML}</ul>
        <hr>
        <div class="invoice-summary">
            <p>Subtotal: $${(order.subtotal || 0).toFixed(2)}</p>
            <p>Discount: -$${(order.discount || 0).toFixed(2)}</p>
            <p>Tax (15%): $${(order.tax || 0).toFixed(2)}</p>
            <p class="invoice-total"><strong>Total Cost: $${(order.total || 0).toFixed(2)}</strong></p>
        </div>
        <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button class="cancelOrderBtn" data-id="${order.id}">❌ Cancel Order</button>
            <button onclick="printInvoiceById(${order.id})" style="padding: 10px; background-color: var(--main-color); color: white; border: none; border-radius: 5px; cursor: pointer;">Print Invoice 🖨️</button>
        </div>
      `;


      orderList.appendChild(div);
    });

    // === Handle Cancel Order Buttons ===
    orderList.addEventListener("click", e => {
      if (e.target.classList.contains("cancelOrderBtn")) {
        const orderId = parseInt(e.target.dataset.id);
        if (confirm("Are you sure you want to cancel this order?")) {
          // Remove this order from localStorage
          const updatedOrders = orders.filter(o => o.id !== orderId);
          localStorage.setItem("orders", JSON.stringify(updatedOrders));
          alert("🗑️ Order cancelled successfully.");
          location.reload(); // refresh the page to update list
        }
      }
    });
  }
});

// -------------------------------------------------------------------
// CONTACT PAGE
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("contactUs.html")) {
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
      contactForm.addEventListener("submit", function (event) {
        event.preventDefault();
        alert("✅ Message sent! We'll contact you soon.");
        contactForm.reset();
      });
    }
  }
});


// -------------------------------------------------------------------
// PROFILE PAGE
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("profile.html")) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      alert("⚠️ Please log in to view your profile.");
      window.location.href = "logIn.html";
      return;
    }

    document.getElementById("userName").textContent = `${loggedInUser.firstName} ${loggedInUser.lastName} `;
    document.getElementById("userDOB").textContent = loggedInUser.dob;
    document.getElementById("userEmail").textContent = loggedInUser.email;
    document.getElementById("userUsername").textContent = loggedInUser.username;
  }
});

//=== Saving the Confirmed Carts from the Check out page
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("checkout.html")) {
    const confirmButton = document.getElementById("confirm");

    confirmButton.addEventListener("click", () => {
      // Get current cart from localStorage
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      // Create a new order object
      const order = {
        id: Date.now(), // unique order ID
        date: new Date().toLocaleString(),
        items: cart,
      };

      // Get previous orders (if any)
      const orders = JSON.parse(localStorage.getItem("orders")) || [];

      // Add this new order
      orders.push(order);

      // Save back to localStorage
      localStorage.setItem("orders", JSON.stringify(orders));

      // Save to AllInvoices
      const allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
      allInvoices.push(order);
      localStorage.setItem("AllInvoices", JSON.stringify(allInvoices));

      // Clear the cart after confirming
      localStorage.removeItem("cart");

      alert("✅ Order confirmed and saved!");
      window.location.href = "orders.html"; // redirect to orders page
    });
  }
});

// ---------------- User Frequency Dashboard ----------------
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("dashboard.html")) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const isAdmin = loggedInUser && loggedInUser.username === "111-222-333";

    if (!isAdmin) {
      document.querySelectorAll(".admin-only").forEach(el => el.style.display = "none");

      // Update Title for Non-Admin
      const dashboardTitle = document.querySelector(".dashboard-title");
      if (dashboardTitle && loggedInUser) {
        const firstName = loggedInUser.firstName;
        const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
        dashboardTitle.textContent = `${capitalizedFirstName}'s Dashboard`;
      }
    } else {
      // Update Title for Admin
      const dashboardTitle = document.querySelector(".dashboard-title");
      if (dashboardTitle) {
        dashboardTitle.textContent = "Admin Dashboard";
      }
    }

    // Get users from the correct storage key
    let users = JSON.parse(localStorage.getItem("RegistrationData")) || [];

    const genderCount = { male: 0, female: 0, other: 0 };
    const ageGroups = { "18-25": 0, "26-35": 0, "36-50": 0, "50+": 0 };

    users.forEach(user => {

      // If user.gender is undefined, default to "other"
      const gender = user.gender ? user.gender.toLowerCase() : "other";

      if (gender === "male") {
        genderCount.male++;
      } else if (gender === "female") {
        genderCount.female++;
      } else {
        genderCount.other++;
      }

      // Age group count
      const age = parseInt(user.age);
      if (age >= 18 && age <= 25) {
        ageGroups["18-25"]++;
      } else if (age >= 26 && age <= 35) {
        ageGroups["26-35"]++;
      } else if (age >= 36 && age <= 50) {
        ageGroups["36-50"]++;
      } else {
        ageGroups["50+"]++;
      }
    });

    // --- Render Gender Chart ---
    const genderCtx = document.getElementById('genderChart');
    if (genderCtx) {
      new Chart(genderCtx, {
        type: 'line',
        data: {
          labels: ['Male', 'Female', 'Other'],
          datasets: [{
            label: 'Number of Users',
            data: [genderCount.male, genderCount.female, genderCount.other],
            backgroundColor: [
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 99, 132, 0.6)',
              'rgba(75, 192, 192, 0.6)'
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 2,
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1 }
            }
          }
        }
      });
    }

    // --- Render Age Chart ---
    const ageCtx = document.getElementById('ageChart');
    if (ageCtx) {
      new Chart(ageCtx, {
        type: 'line',
        data: {
          labels: ['18-25', '26-35', '36-50', '50+'],
          datasets: [{
            label: 'Age Distribution',
            data: [ageGroups["18-25"], ageGroups["26-35"], ageGroups["36-50"], ageGroups["50+"]],
            backgroundColor: 'rgba(107, 142, 35, 0.6)',
            borderColor: 'rgba(107, 142, 35, 1)',
            borderWidth: 2,
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1 }
            }
          }
        }
      });
    }

    // --- Generate Summary ---
    const summaryDiv = document.getElementById("dashboardSummaryText");
    if (summaryDiv) {
      const totalUsers = users.length;

      // Find most common gender
      let maxGender = "male";
      if (genderCount.female > genderCount[maxGender]) maxGender = "female";
      if (genderCount.other > genderCount[maxGender]) maxGender = "other";

      // Find most common age group
      let maxAgeGroup = "18-25";
      if (ageGroups["26-35"] > ageGroups[maxAgeGroup]) maxAgeGroup = "26-35";
      if (ageGroups["36-50"] > ageGroups[maxAgeGroup]) maxAgeGroup = "36-50";
      if (ageGroups["50+"] > ageGroups[maxAgeGroup]) maxAgeGroup = "50+";

      summaryDiv.innerHTML = `
            <p><strong>Total Registered Users:</strong> ${totalUsers}</p>
            <p><strong>Demographics Overview:</strong></p>
            <ul style="margin-left: 20px;">
                <li>The user base is primarily <strong>${maxGender}</strong> (<span style="color:var(--main-color)">${genderCount[maxGender]}</span> users).</li>
                <li>The most active age demographic is <strong>${maxAgeGroup}</strong> years old, accounting for <span style="color:var(--main-color)"><strong>${ageGroups[maxAgeGroup]}</strong></span> users.</li>
            </ul>
        `;
    }

    // --- Render My Invoices ---
    const myInvoicesDiv = document.getElementById("myInvoiceResults");
    if (myInvoicesDiv) {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

      if (loggedInUser) {
        let allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
        if (allInvoices.length === 0) {
          allInvoices = JSON.parse(localStorage.getItem("orders")) || [];
        }

        const myInvoices = allInvoices.filter(inv => inv.user === loggedInUser.username);

        if (myInvoices.length === 0) {
          myInvoicesDiv.innerHTML = "<p>No invoices found.</p>";
        } else {
          myInvoices.forEach(order => {
            const div = document.createElement("div");
            div.style.border = "1px solid #ddd";
            div.style.padding = "15px";
            div.style.borderRadius = "8px";
            div.style.backgroundColor = "#fff";
            div.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";

            const itemsHTML = (order.items || []).map(item => `
                        <li>${item.name} (x${item.quantity})</li>
                    `).join("");

            div.innerHTML = `
                        <h4 style="margin-top:0;">Invoice #${order.id}</h4>
                        <p><strong>Date:</strong> ${order.date}</p>
                        <p><strong>Total:</strong> $${(order.total || 0).toFixed(2)}</p>
                        <hr style="margin: 10px 0; border:0; border-top:1px solid #eee;">
                        <p><strong>Items:</strong></p>
                        <ul style="padding-left: 20px; font-size: 0.9em; max-height: 100px; overflow-y: auto;">
                            ${itemsHTML}
                        </ul>
                        <div style="margin-top: 15px; text-align: center;">
                            <button onclick="printInvoiceById(${order.id})" style="padding: 8px 15px; background-color: var(--main-color); color: white; border: none; border-radius: 5px; cursor: pointer;">Print Invoice 🖨️</button>
                        </div>
                    `;
            myInvoicesDiv.appendChild(div);
          });
        }
      } else {
        myInvoicesDiv.innerHTML = "<p>Please log in to view your invoices.</p>";
      }
    }
  }
});

// ---------------- Invoice Search ----------------
function ShowInvoices(searchTRN = null) {
  //  Use AllInvoices from localStorage
  // If AllInvoices is empty (e.g. old data), fallback to 'orders'
  let invoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];

  if (invoices.length === 0) {
    invoices = JSON.parse(localStorage.getItem("orders")) || [];
  }

  const resultsDiv = document.getElementById("invoiceResults");
  if (!resultsDiv) return; // Should only happen if not on dashboard page

  resultsDiv.innerHTML = ""; // Clear previous results

  if (searchTRN) {
    // Filter by TRN (username) OR Order ID
    const results = invoices.filter(inv =>
      (inv.user && inv.user.trim() === searchTRN.trim()) ||
      (inv.id && inv.id.toString() === searchTRN.trim())
    );

    if (results.length === 0) {
      resultsDiv.innerHTML = `<p style="grid-column: 1 / -1; text-align: center;">No invoices found for: ${searchTRN}. <br> Tip: Enter a valid TRN or Order ID.</p>`;
    } else {
      results.forEach(order => {
        const div = document.createElement("div");
        div.style.border = "1px solid #ddd";
        div.style.padding = "15px";
        div.style.borderRadius = "8px";
        div.style.backgroundColor = "#fff";
        div.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";

        const itemsHTML = order.items.map(item => `
            <li>${item.name} (x${item.quantity})</li>
          `).join("");

        div.innerHTML = `
            <h4 style="margin-top:0;">Invoice #${order.id}</h4>
            <p><strong>Date:</strong> ${order.date}</p>
            <p><strong>Total:</strong> $${(order.total || 0).toFixed(2)}</p>
            <hr style="margin: 10px 0; border:0; border-top:1px solid #eee;">
            <p><strong>Items:</strong></p>
            <ul style="padding-left: 20px; font-size: 0.9em; max-height: 100px; overflow-y: auto;">
                ${itemsHTML}
            </ul>
            <div style="margin-top: 15px; text-align: center;">
                <button onclick="printInvoiceById(${order.id})" style="padding: 8px 15px; background-color: var(--main-color); color: white; border: none; border-radius: 5px; cursor: pointer;">Print Invoice 🖨️</button>
            </div>
          `;
        resultsDiv.appendChild(div);
      });
    }
  } else {
    resultsDiv.innerHTML = `<p style="grid-column: 1 / -1; text-align: center;">Please enter a TRN to search.</p>`;
  }
}

// Event Listener for the Search Bar (Dashboard)
document.addEventListener("DOMContentLoaded", () => {
  const invoiceSearchBtn = document.getElementById("invoiceSearchBtn");

  if (invoiceSearchBtn) {
    invoiceSearchBtn.addEventListener("click", () => {
      const trnInput = document.getElementById("invoiceSearchTRN");
      const trn = trnInput.value.trim();
      ShowInvoices(trn);
    });
  }
});

// ---------------- Get User Invoices  ----------------
function GetUserInvoices() {
  //  Get all registered users
  const users = JSON.parse(localStorage.getItem("RegistrationData")) || [];

  // Get all invoices
  let allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
  if (allInvoices.length === 0) {
    allInvoices = JSON.parse(localStorage.getItem("orders")) || [];
  }

  console.log("--- Generating User Invoices Report ---");

  if (users.length === 0) {
    console.log("No registered users found.");
    return;
  }

  //  Iterate through each user and find their invoices
  users.forEach(user => {
    const userTRN = user.username; // TRN is stored as username
    const fullName = `${user.firstName} ${user.lastName}`;

    // Filter invoices for this specific user
    const userInvoices = allInvoices.filter(inv => inv.user === userTRN);

    if (userInvoices.length > 0) {
      console.log(`\nUser: ${fullName} (TRN: ${userTRN})`);
      console.log(`Total Invoices: ${userInvoices.length}`);
      console.table(userInvoices);
    } else {
      console.log(`\nUser: ${fullName} (TRN: ${userTRN}) has no invoices.`);
    }
  });

  console.log("\n--- End of Report ---");
}

// ---------------- Print Invoice Logic ----------------
window.printInvoiceById = function (orderId) {
  let allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
  if (allInvoices.length === 0) {
    allInvoices = JSON.parse(localStorage.getItem("orders")) || [];
  }
  const order = allInvoices.find(o => o.id == orderId); // equality match
  if (order) {
    printInvoice(order);
  } else {
    alert("Invoice not found!");
  }
}

function printInvoice(order) {
  const itemsHTML = (order.items || []).map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
    `).join("");

  const content = `
        <html>
        <head>
            <title>Invoice #${order.id} - Stitch & Thread Co.</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
                .invoice-header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
                .invoice-header h1 { margin: 0; color: #444; }
                .invoice-meta { display: flex; justify-content: space-between; margin-bottom: 30px; }
                .invoice-section { margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background-color: #f8f9fa; font-weight: bold; }
                .total-section { margin-top: 30px; text-align: right; }
                .total-section p { margin: 5px 0; }
                .grand-total { font-size: 1.5em; font-weight: bold; color: #000; margin-top: 10px; border-top: 2px solid #eee; pt-2; }
                @media print {
                    button { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="invoice-header">
                <h1>Stitch & Thread Co.</h1>
                <p>Date: ${order.date}</p>
                <h2>INVOICE #${order.id}</h2>
            </div>
            
            <div class="invoice-meta">
                <div class="invoice-section">
                    <h3>Bill To:</h3>
                    <p><strong>Name:</strong> ${order.customerName || "N/A"}</p>
                    <p><strong>TRN:</strong> ${order.user || "N/A"}</p>
                    <p><strong>Address:</strong> ${order.address || "N/A"}</p>
                    <p><strong>Phone:</strong> ${order.phone || "N/A"}</p>
                    <p><strong>Email:</strong> ${order.email || "N/A"}</p>
                </div>
                <div class="invoice-section" style="text-align: right;">
                    <h3>Payment Details:</h3>
                    <p><strong>Method:</strong> ${order.paymentMethod || "N/A"}</p>
                    <p><strong>Order ID:</strong> ${order.id}</p>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
            </table>

            <div class="total-section">
                <p>Subtotal: $${(order.subtotal || 0).toFixed(2)}</p>
                <p>Discount: -$${(order.discount || 0).toFixed(2)}</p>
                <p>Tax (15%): $${(order.tax || 0).toFixed(2)}</p>
                <div class="grand-total">Total: $${(order.total || 0).toFixed(2)}</div>
            </div>
            
            <div style="text-align: center; margin-top: 50px; font-size: 0.9em; color: #777;">
                <p>Thank you for shopping with Stitch & Thread Co.!</p>
                <p>Contact us: support@stitchandthread.com | (555) 123-4567</p>
            </div>

            <script>
                // Auto print when loaded
                window.onload = function() { 
                    setTimeout(() => {
                        window.print();
                    }, 500); 
                }
            </script>
        </body>
        </html>
    `;

  // Create a Blob from the HTML content
  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  // Open the Blob URL in a new window
  const printWindow = window.open(url, '', 'width=800,height=800');

 
  if (printWindow) {
    printWindow.onload = function () {
      URL.revokeObjectURL(url);
    };
  }
}
