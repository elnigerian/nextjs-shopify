import * as React from 'react';
import Head from 'next/head';
import {useMutation, useQuery} from '@apollo/client';
import * as _ from 'lodash';
import {
    checkoutLineItemsAdd,
    checkoutLineItemsRemove,
    checkoutLineItemsUpdate,
    createCheckout
} from '../graphql/mutations/checkoutMutations';
import {useCheckoutEffect} from '../hooks/checkoutHooks';
import {ShopQuery} from '../graphql/queries/shopfiyQueries';
import Product from './product';
import Cart from './cart/cart';


type LayoutProps = {
    children?: any;
    title?: string;
};

const Layout:React.FC<LayoutProps> = ({children, title}) => {
    const [isCartOpen, setCartOpen] = React.useState(false);
    //const [isCustomerAuthOpen, setIsCustomerAuthOpen] = React.useState<boolean>(false);
    //const [isNewCustomer, setIsNewCustomer] = React.useState<boolean>(false);
    const [products, setProducts] = React.useState<any>([]);
    const [checkout, setCheckout] = React.useState<any>({ lineItems: { edges: [] } });

    const [createCheckoutMutation,
        {
            data: createCheckoutData,
            /*loading: createCheckoutLoading,
            error: createCheckoutError*/
        }] = useMutation(createCheckout);

    const [lineItemAddMutation,
        {
            data: lineItemAddData,
            /*loading: lineItemAddLoading,
            error: lineItemAddError*/
        }] = useMutation(checkoutLineItemsAdd);

    const [lineItemUpdateMutation,
        {
            data: lineItemUpdateData,
            /*loading: lineItemUpdateLoading,
            error: lineItemUpdateError*/
        }] = useMutation(checkoutLineItemsUpdate);

    const [lineItemRemoveMutation,
        {
            data: lineItemRemoveData,
            /*loading: lineItemRemoveLoading,
            error: lineItemRemoveError*/
        }] = useMutation(checkoutLineItemsRemove);

    /*
    const [customerAssociateMutation,
        {
            data: customerAssociateData,
            loading: customerAssociateLoading,
            error: customerAssociateError
        }] = useMutation(checkoutCustomerAssociate);
    */

    const { loading:shopLoading, error:shopError, data:shopData } = useQuery(ShopQuery);

    React.useEffect(() => {
        const variables = { input: {} };
        createCheckoutMutation({ variables })
            .then((res: any) => console.log( res ))
            .catch((err: any) => console.log('create checkout error', err ));

        if(shopData && shopData.shop && shopData.shop.products) {
            const {products} = shopData.shop;
            setProducts(products);
        }

    }, [shopData]);

    useCheckoutEffect(createCheckoutData, 'checkoutCreate', setCheckout);
    useCheckoutEffect(lineItemAddData, 'checkoutLineItemsAdd', setCheckout);
    useCheckoutEffect(lineItemUpdateData, 'checkoutLineItemsUpdate', setCheckout);
    useCheckoutEffect(lineItemRemoveData, 'checkoutLineItemsRemove', setCheckout);
    // useCheckoutEffect(customerAssociateData, 'checkoutCustomerAssociate', setCheckout);


    const addVariantToCart = (variantId, quantity) =>{
        const variables = { checkoutId:checkout.id, lineItems:  [{variantId, quantity: parseInt(quantity, 10)}] };
        // TODO replace for each mutation in the checkout thingy. can we export them from there???
        // create your own custom hook???

        lineItemAddMutation({ variables })
            .then((res: any) => {
                //todo remove
                console.log(res);
                setCartOpen(true);
            });
    };

    const updateLineItemInCart = async (lineItemId, quantity) => {
        const variables = { checkoutId:checkout.id, lineItems: [{id: lineItemId, quantity: parseInt(quantity, 10)}] };
        await lineItemUpdateMutation({ variables });
    };

    const removeLineItemInCart = async (lineItemId) => {
        const variables = { checkoutId:checkout.id, lineItemIds: [lineItemId] };
        await lineItemRemoveMutation({ variables });
    };
    /*
        const associateCustomerCheckout = (customerAccessToken) => {
            const variables = { checkoutId:checkout.id, customerAccessToken: customerAccessToken };
            customerAssociateMutation({ variables }).then((res: any) => {
                setCustomerAuthOpen(false);
            });
        };
    */

    const handleCartClose = () => {
        setCartOpen(false);
    }

    if (shopLoading) {
        return <p>Loading ...</p>;
    }

    if (shopError) {
        return <p>{shopError.message}</p>;
    }

    return (
        <React.Fragment>
            <div>
                <Head>
                    <title>{title}</title>
                </Head>
                <header className="App__header">
                    <ul className="App__nav">
                        <li className="button App__customer-actions"  data-customer-type="new-customer">Create an Account</li>
                        <li className="login App__customer-actions" >Log in</li>
                    </ul>
                    {!isCartOpen &&
                    <div className="App__view-cart-wrapper">
                        <button className="App__view-cart" onClick={()=> setCartOpen( true )}>Cart</button>
                    </div>
                    }
                    <div className="App__title">
                        <h1>{shopData.shop.name}: React Example</h1>
                        <h2>{shopData.shop.description}</h2>
                    </div>
                </header>

                <div className="Product-wrapper">
                    { _.map(products.edges, (product: any) =>
                        <Product addVariantToCart={addVariantToCart} key={product.node.id.toString()} product={product.node} />
                    )}
                </div>
                <Cart
                    removeLineItemInCart={removeLineItemInCart}
                    updateLineItemInCart={updateLineItemInCart}
                    checkout={checkout}
                    isCartOpen={isCartOpen}
                    handleCartClose={handleCartClose}
                    /*customerAccessToken={customerAccessToken}*/
                />
                {children}
            </div>
        </React.Fragment>
    );
}

export default Layout;
