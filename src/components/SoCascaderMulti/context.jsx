import React from 'react';

const SoCascaderMulti = React.createContext();

export const Provider = props => {
    return (
        <SoCascaderMulti.Provider value={props.store}>
            {props.children}
        </SoCascaderMulti.Provider>
    );
};

export const Consumer = Component =>
    React.forwardRef((props, ref) => (
        <SoCascaderMulti.Consumer>
            {context => (
                <Component {...props} soCascaderMulti={context} ref={ref} />
            )}
        </SoCascaderMulti.Consumer>
    ));
