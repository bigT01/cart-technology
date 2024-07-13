import {create} from "zustand";
import {devtools} from "zustand/middleware";
import {CheckProducts, product} from "../constants/interfaces";
import axios from "axios";
import axiosInstance from "../api/axiosConfig";

interface IState {
    products: {
        status: "pending" | "in progress" | "fulfilled" | "rejected",
        data: product[]
    },
    cart: {
        data: product[],
        total: number
    },
    productsQuantity: number,
    increment: (id: number, context: 'product' | 'cart') => void,
    decrement: (id: number, context: 'product' | 'cart') => void,
    fetchProductsByCategory: (category: string) => void,
}

export const useStore = create<IState>()(
    devtools(
        (set) => ({
            products: {
                status: 'pending', data: [
                    {
                        id: 67,
                        category: 'чай',
                        image: null,
                        name: "Maxi 1л",
                        quantity: 0,
                        price: 730,
                        category_id: 399
                    }
                ]
            },
            cart: {data: [], total: 0},
            productsQuantity: 0,
            increment: (id: number, context: "product" | "cart") =>
                set((state) => {
                    let updatedProducts: product[] = [];
                    let updatedCart = state.cart.data;
                    let updatedProductsQuantity = state.productsQuantity;
                    // here need 2 different functions for increasing
                    if (context === "product") {
                        updatedProducts = state.products.data.map((product) =>
                            product.id === id ? {...product, quantity: product.quantity + 1} : product
                        );
                        const cartProducts = updatedProducts.filter((product) => product.quantity >= 1);
                        const total = cartProducts.reduce(
                            (sum, product) => sum + product.price * product.quantity,
                            0
                        );
                        updatedProductsQuantity = cartProducts.length;
                        return {
                            products: {
                                ...state.products,
                                data: updatedProducts,
                            },
                            cart: {data: cartProducts, total: total},
                            productsQuantity: updatedProductsQuantity,
                        };
                    } else if (context === "cart") {
                        updatedCart = state.cart.data.map((product) =>
                            product.id === id ? {...product, quantity: product.quantity + 1} : product
                        );
                        const cartProducts = updatedCart.filter((product) => product.quantity >= 1);
                        const total = updatedCart.reduce(
                            (sum, good) => sum + good.price * good.quantity,
                            0
                        );
                        updatedProductsQuantity = cartProducts.length;
                        return {
                            cart: {data: cartProducts, total: total},
                            productsQuantity: updatedProductsQuantity,
                        };
                    }
                    return state;
                }, false, "increment"),
            decrement: (id: number, context: "product" | "cart") =>
                set((state) => {
                    let updatedProducts: product[] = [];
                    let updatedCart = state.cart.data;
                    let updatedProductsQuantity = state.productsQuantity;
                    // here need 2 different functions for decreasing
                    if (context === "product") {
                        updatedProducts = state.products.data.map((product) =>
                            product.id === id
                                ? {...product, quantity: Math.max(0, product.quantity - 1)}
                                : product
                        );
                        const cartProducts = updatedProducts.filter((product) => product.quantity >= 1);
                        const total = cartProducts.reduce(
                            (sum, product) => sum + product.price * product.quantity,
                            0
                        );
                        updatedProductsQuantity = cartProducts.length;
                        return {
                            products: {
                                ...state.products,
                                data: updatedProducts,
                            },
                            cart: {data: cartProducts, total: total},
                            productsQuantity: updatedProductsQuantity,
                        };
                    } else if (context === "cart") {
                        updatedCart = state.cart.data
                            .map((product) =>
                                product.id === id
                                    ? {...product, quantity: Math.max(0, product.quantity - 1)}
                                    : product
                            )
                            .filter((product) => product.quantity > 0);
                        const cartProducts = updatedCart.filter((product) => product.quantity >= 1);
                        const total = updatedCart.reduce(
                            (sum, product) => sum + product.price * product.quantity,
                            0
                        );
                        updatedProductsQuantity = cartProducts.length;
                        return {
                            cart: {data: cartProducts, total: total},
                            productsQuantity: updatedProductsQuantity,
                        };
                    }
                    return state;
                }, false, "decrement"),
            fetchProductsByCategory: async (typeId: string) => {
                axiosInstance.get<CheckProducts>(`/check/?txn_id=1&account=1&typesId=${typeId}`)
                    .then(response => {
                        if (response.data.comment === 'OK') {
                            const fetchedProducts: product[] = response.data.products.map(item => ({
                                id: Number(item.id),
                                image: item.image_url,
                                category: item.type_name,
                                quantity: 0,
                                price: Number(item.sum),
                                name: item.name[0],
                                category_id: Number(item.type_id)
                            }))
                            set((state) => {
                                // filter below gives data which have same category id
                                const existingCartProducts = state.cart.data.filter(product => product.category_id === Number(typeId));
                                // in here I am gonna try if there have any products in cart.
                                // if there have a product it will take a product from cart
                                // if no it will take a product from own data
                                const updatedProducts = fetchedProducts.map((product) => {
                                    const cartProduct = existingCartProducts.find(element => element.id === product.id);
                                    if (cartProduct) {
                                        return {...product, quantity: cartProduct.quantity};
                                    }
                                    return product;
                                });
                                return {
                                    products: {
                                        data: updatedProducts,
                                        status: 'fulfilled'
                                    }
                                };
                            }, false, 'fetchProductsByCategory')
                        } else {
                            set((state) => ({
                                products: {
                                    data: state.products.data,
                                    status: 'rejected'
                                }
                            }), false, 'fetchProductsByCategory')
                        }
                    })
                    .catch((err) => {
                        debugger
                        set((state) => ({
                            products: {
                                data: state.products.data,
                                status: 'rejected'
                            }
                        }), false, 'fetchProductsByCategory')
                    })
            },
        })
    )
)