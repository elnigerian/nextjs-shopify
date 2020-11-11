import * as React from "react";
import VariantSelector from "../variantSelector";

type ProductProps = {
    options?: any;
    product: any;
    addVariantToCart: any;
    checkout?: any;
}

const Product: React.FC<ProductProps> = ({ product, addVariantToCart}) => {
    let defaultOptionValues: any = {};

    product.options.forEach((selector) => {
        defaultOptionValues[selector.name] = selector.values[0];
    });

    const [selectedOptions] = React.useState(defaultOptionValues);

    const [variantImage,setVariantImage] = React.useState(product.images.edges[0].node);
    const [variant,setVariant] = React.useState(product.variants.edges[0].node);
    const [variantQuantity,setVariantQuantity] = React.useState(1);

    /*const findImage = (images, variantId) => {
        const primary = images[0];

        const image = images.filter(function (image) {
            return image.variant_ids.includes(variantId);
        })[0];

        return (image || primary).src;
    }*/

    const handleOptionChange = (event) => {
        const target = event.target
        selectedOptions[target.name] = target.value;

        const selectedVariant = product.variants.edges.find((variant) => {
            return variant.node.selectedOptions.every((selectedOption) => {
                return selectedOptions[selectedOption.name] === selectedOption.value;
            });
        }).node;

        setVariant(selectedVariant);
        setVariantImage(selectedVariant.image);
    }

    const handleQuantityChange = (event) => {
        setVariantQuantity(event.target.value);
    }


    let variantSelectors = product.options.map((option) => {
        return (
            <VariantSelector
                onSelectorChange={handleOptionChange}
                key={option.id.toString()}
                options={option}
            />
        );
    });

    return (
        <div className="Product">
            {product.images.edges.length ? <img src={variantImage.src} alt={`${product.title} product shot`}/> : null}
            <h5 className="Product__title">{product.title}</h5>
            <span className="Product__price">${variant.price}</span>
            {variantSelectors}
            <label className="Product__option">
                Quantity
                <input min="1" type="number" defaultValue={variantQuantity} onChange={handleQuantityChange}/>
            </label>
            <button className="Product__buy button" onClick={() => addVariantToCart(variant.id, variantQuantity)}>Add to Cart</button>
        </div>
    );
}

export default Product;
