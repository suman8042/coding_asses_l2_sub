document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889";
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => renderCart(data))
        .catch(error => console.error("Error fetching data:", error));
    
    function renderCart(cartData) {
        const cartItemsContainer = document.getElementById("cart-items");
        let subtotal = 0;

        cartData.items.forEach(item => {
            subtotal += item.final_line_price;

            // Create cart item structure
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");

            cartItem.innerHTML = `
                <div  style="border-bottom: 1px solid #ddd; margin-bottom: 30px; padding: 120px 0;">

                    <!-- First Row: Headings (Image, Price, Quantity, Subtotal, Remove) -->
                    <div class="clr ht2" style="display: flex;  justify-content: space-between; margin-bottom: 15px; font-size: 16px;">
                        <p style="width: 15%; text-align: center; font-weight: bold; margin: 0;"></p>
                        <p style="width: 20%; text-align: center; font-weight: bold; margin: 0;">Price</p>
                        <p style="width: 20%; text-align: center; font-weight: bold; margin: 0;">Quantity</p>
                        <p style="width: 20%; text-align: center; font-weight: bold; margin: 0;">Subtotal</p>
                        <p style="width: 25%; text-align: center; font-weight: bold; margin: 0;"></p>
                    </div>

                    <!-- Second Row: Values Below Headings -->
                    <div style="display: flex;gap: 44px; align-items: center; justify-content: space-between;">
                        <!-- Image -->
                        <div style="width: 15%; text-align: center;">
                            <img src="${item.image}" alt="${item.title}" style="width: 60px; height: auto; border-radius: 5px;">
                        </div>
                        
                        <!-- Price Value -->
                        <div style="width: 20%; text-align: center;">
                            <p style="margin: 10; font-size: 16px;">₹${(item.final_price / 100).toFixed(2)}</p>
                        </div>

                        <!-- Quantity Input -->
                        <div style="width: 20%; text-align: center;">
                            <input type="number" id="quantity-${item.id}" value="${item.quantity}" min="1" style="width: 50px; text-align: center; font-size: 16px; padding: 5px;">
                        </div>

                        <!-- Subtotal Value -->
                        <div style="width: 20%; text-align: center;">
                            <p style="margin: 10; font-size: 16px;">₹${(item.final_line_price / 100).toFixed(2)}</p>
                        </div>

                        <!-- Remove Button -->
                        <div style="width: 25%; text-align: center;">
                            <img src="ant-design_delete-filled.png" class="remove-item" style="color: white; border: none; padding: 8px 15px; font-size: 14px; border-radius: 5px; cursor: pointer;">
                        </div>
                    </div>
                </div>
            `;

            cartItemsContainer.appendChild(cartItem);

            // Add functionality for remove button
            cartItem.querySelector('.remove-item').addEventListener('click', () => {
                removeItem(item, cartItem);
            });

            // Add functionality for quantity change
            cartItem.querySelector(`#quantity-${item.id}`).addEventListener('input', (event) => {
                const newQty = parseInt(event.target.value);
                updateItemQuantity(item, newQty, cartItem);
            });
        });

        // Display subtotal and total
        updateTotal(subtotal);

        // Remove item function
        function removeItem(item, cartItem) {
            cartItemsContainer.removeChild(cartItem); // Remove from DOM
            cartData.items = cartData.items.filter(cartItem => cartItem.id !== item.id); // Remove from data
            updateTotal();
        }

        // Update item quantity and reflect changes
        function updateItemQuantity(item, newQty, cartItem) {
            item.quantity = newQty;
            item.final_line_price = item.final_price * newQty;

            // Update subtotal for this item
            cartItem.querySelector('.item-subtotal').textContent = `₹${(item.final_line_price / 100).toFixed(2)}`;

            // Update total price
            updateTotal();
        }

        // Update subtotal and total values
        function updateTotal() {
            let updatedSubtotal = 0;
            cartData.items.forEach(item => {
                updatedSubtotal += item.final_line_price;
            });
            document.getElementById("subtotal").textContent = `₹${(updatedSubtotal / 100).toFixed(2)}`;
            document.getElementById("total").textContent = `₹${(updatedSubtotal / 100).toFixed(2)}`;
        }
    }
});
