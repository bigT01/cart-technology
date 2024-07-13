export interface product {
    id: number,
    name: string,
    category: string,
    image: string | null,
    quantity: number,
    price: number,
    category_id: number
}

interface backendProducts {
    discount: {
        name: string,
        discount_amount: string | null,
        valid_until: string | null,
        product_type: string | null,
    },
    id: string,
    image_url: null | string,
    name: string[],
    original_sum: null | string,
    sum: string | null,
    type_id: string,
    type_name: string,
}

export interface CheckProducts {
    bin: string,
    comment:  string,
    products: backendProducts[],
    result: number,
    txn_id: string
}
