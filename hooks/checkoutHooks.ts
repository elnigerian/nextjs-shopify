import * as React from "react";

export const useCheckoutEffect = (data, key, setDataCallback) => {
    React.useEffect(() => {
        if(data && data[key] && data[key].checkout) {
            setDataCallback(data[key].checkout);
        }
    }, [data])
}
