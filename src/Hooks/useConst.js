import { useRef } from 'react';

const useConst = (value) => {
    const getValue = ()=> (typeof value === 'function')?value():value
    const v = useRef(getValue());
    return v.current;
}
 
export default useConst;