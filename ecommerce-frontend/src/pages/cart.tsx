import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import { Link } from "react-router-dom";
import CartItemComponent from "../components/CartItem";
import { CartItem } from "../types/types";

const Cart = () => {
  const cartItems: CartItem[] = [
    {
      productId: 'sdge444',
      name:"Macbook",
      price:59999,
      stock:5,
      quantity: 1,
      photo:"https://m.media-amazon.com/images/I/71h-tsPzk5L._SX679_.jpg",
    }
  ]
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  useEffect(() => {
    // const { token: cancelToken, cancel } = axios.CancelToken.source();

    const timeOutID = setTimeout(() => {
      // axios
      //   .get(`${server}/api/v1/payment/discount?coupon=${couponCode}`, {
      //     cancelToken,
      //   })
      //   .then((res) => {
      //     dispatch(discountApplied(res.data.discount));
      //     setIsValidCouponCode(true);
      //     dispatch(calculatePrice());
      //   })
      //   .catch(() => {
      //     dispatch(discountApplied(0));
      //     setIsValidCouponCode(false);
      //     dispatch(calculatePrice());
      //   });
    }, 1000);

    return () => {
      clearTimeout(timeOutID);
      // cancel();
      setIsValidCouponCode(false);
    };
  }, [couponCode]);

  const subtotal = 10;
  const tax = parseInt((subtotal * 0.18).toFixed(2));
  const shippingCharges = 3;
  const discount = 2;
  const total = parseInt((subtotal + tax + shippingCharges - discount).toFixed(2))

  const incrementHandler = (cartItem: CartItem) => {}
  const decrementHandler = (cartItem: CartItem) => {}
  const removeHandler = (id: string) => {}

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
            cartItems.map((i, idx) => (
              <CartItemComponent
                incrementHandler={incrementHandler}
                decrementHandler={decrementHandler}
                removeHandler={removeHandler}
                key={idx}
                cartItem={i}
              />
            ))
          ) : (
            <h1>No Items Added</h1>
          )}
      </main>
      <aside>
        <p>Subtotal: ₹{subtotal}</p>
        <p>Shipping Charges: ₹{shippingCharges}</p>
        <p>Tax: ₹{tax}</p>
        <p>
          Discount: <em className="red"> - ₹{discount}</em>
        </p>
        <p>
          <b>Total: ₹{total}</b>
        </p>

        <input
          type="text"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />

        {couponCode &&
          (isValidCouponCode ? (
            <span className="green">
              ₹{discount} off using the <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon <VscError />
            </span>
          ))}

        {cartItems.length > 0 && <Link to="/shipping">Checkout</Link>}
      </aside>
    </div>
  )
}

export default Cart