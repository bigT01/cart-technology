import React, {useEffect} from 'react';
import {useStore} from "./store/useStore";

function App() {
    const fetchProductsByCategory = useStore(state => state.fetchProductsByCategory)

    const products = useStore(state => state.products)
    const cart = useStore(state => state.cart)

    const increment = useStore(state => state.increment)
    const decrement = useStore(state => state.decrement)

    useEffect(() => {
        fetchProductsByCategory('399')
    }, []);
    return (
        <>
            {products.data.map((product) => (
                <div className=' p-5 bg-[#F4F4F4] rounded-2xl'>
                    <p>{product.name}</p>
                    <button onClick={() => increment(product.id, 'product')}>inc</button>
                    <button onClick={() => decrement(product.id, 'product')}>dec</button>
                </div>
            ))}

            {cart.data.map((product) => (
                <div className=' p-5 bg-[#F4F4F4] rounded-2xl'>
                    <p>{product.name}</p>
                    <button onClick={() => increment(product.id, 'cart')}>inc</button>
                    <button onClick={() => decrement(product.id, 'cart')}>dec</button>
                </div>
            ))}
        </>
    );
}

export default App;
