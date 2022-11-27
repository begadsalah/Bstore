import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);
  const [scriptLoaded, setScriptLoaded] = useState(true);
  let foundProduct;
  let index;

  const { PAYPAL_CLIENT_ID, PAYPAL_SECRET_KEY } = process.env;

  const addPaypalScript = () => {
    if (window.paypal) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.script = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
    script.type = "text/javascript";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
  };

  // const onAdd = (product, quantity) => {
  //   const checkProductInCart = cartItems.find(
  //     (item) => item._id == product._id
  //   );
  //
  //   setTotalPrice(
  //     (prevTotalPrice) => prevTotalPrice + product.price * quantity
  //   );
  //   setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

  //   if (checkProductInCart) {
  //     const updatedCartItems = cartItems.map((cartProduct) => {
  //       if (cartProduct._id === product._id)
  //         return {
  //           ...cartProduct,
  //           quantity: cartProduct.quantity + quantity,
  //         };
  //     });

  //     setCartItems(updatedCartItems);
  //   } else {
  //     console.log("else partition worked");
  //     product.quantity = quantity;
  //     console.log(product.quantity);
  //     setCartItems([...cartItems, { ...product }]);
  //     console.log(cartItems);
  //   }
  //   toast.success(`${qty} ${product.name} added to the cart.`);
  //   console.log(cartItems);
  // };
  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.findIndex(
      (item) => item._id === product._id
    );
    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice + product.price * quantity
    );
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);
    if (checkProductInCart > -1) {
      let _cartItems = cartItems;
      _cartItems[checkProductInCart].quantity += 1;
      setCartItems(_cartItems);
    } else {
      product.quantity = quantity;
      setCartItems([...cartItems, { ...product }]);
    }
    toast.success(`${qty} ${product.name} added to the cart.`);
  };

  const onRemove = (product) => {
    foundProduct = cartItems.find((item) => item._id === product._id);
    const newCartItems = cartItems.filter((item) => item._id !== product._id);
    setTotalPrice(
      (prevTotalPrice) =>
        prevTotalPrice - foundProduct?.price * foundProduct.quantity
    );
    setTotalQuantities(
      (prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
    );
    setCartItems(newCartItems);
  };

  const toggleCartItemQuantity = (id, action) => {
    foundProduct = cartItems.find((item) => item._id === id);
    index = cartItems.findIndex((product) => product._id === id);
    const currCartItem = cartItems.filter((item) => item._id !== id);

    if (action === "inc") {
      currCartItem.splice(index, 0, {
        ...foundProduct,
        quantity: foundProduct.quantity + 1,
      });
      setCartItems(currCartItem);
      setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
    } else if (action === "dec") {
      if (foundProduct.quantity > 1) {
        currCartItem.splice(index, 0, {
          ...foundProduct,
          quantity: foundProduct.quantity - 1,
        });
        setCartItems(currCartItem);
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
      }
    }
  };
  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;

      return prevQty - 1;
    });
  };

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        scriptLoaded,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuantity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities,
        addPaypalScript,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
