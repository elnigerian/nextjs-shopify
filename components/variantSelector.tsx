import * as React from 'react';

type VariantSelectorProps = {
    options?: any;
    onSelectorChange?: any;
}
const VariantSelector: React.FC<VariantSelectorProps> = ({options, onSelectorChange}: any) => {
    const {name, values} = options;
        return (
            <select
                className="Product__option"
                name={name}
                key={name}
                onChange={onSelectorChange}
            >
                {values.map((value) => {
                    return (
                        <option value={value} key={`${name}-${value}`}>{`${value}`}</option>
                    )
                })}
            </select>
        );

}

export default VariantSelector;
