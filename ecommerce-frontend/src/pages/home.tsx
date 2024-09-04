import { Link } from "react-router-dom"
import ProductCard from "../components/ProductCard"


const Home = () => {
  const addToCartHandler = () => {}
  return (
    <div className="home">
      <section></section>

      <h1>Latest Products
        <Link to={'/search'} className="findmore">More</Link>
      </h1>

      <main>
        <ProductCard productId="productId" name="Macbook" price={59999} stock={5} handler={addToCartHandler} photo="https://m.media-amazon.com/images/I/71h-tsPzk5L._SX679_.jpg"  />
      </main>
    </div>
  )
}

export default Home