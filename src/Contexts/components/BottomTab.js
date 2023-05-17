import React from 'react';
import { ButtonClose } from '../../Components/Buttons';
import "./BottomTab.css"

const BottomTab = ({title,subtitle,image,children,footer,style,onClose,footerCenter,}) => {

    return ( 
    <div className="bottom-tab bcolor-dark-gray-solid" style={{minHeight:"250px",...style}}>
        <div className='head'>
            {image &&  <img src={image} alt=""/>}
            <div style={image?{flexDirection:"column"}:{}}>
                <h3 style={image?{marginBottom:"5px"}:{}} className="color-white">{title}</h3>
                <h4 style={image?{marginTop:"0"}:{}} className={image?"subtitle":'subtitle opacity'} >{subtitle}</h4>
            </div>
        </div>


        {children && <div className='bottom-tab-content'>
            {children}
        </div>}

        {footer && <footer className='light'>
            {footer}
        </footer>}

        {footerCenter && <footer className='light center'>
            {footerCenter}
        </footer>}
        
        <div className="bottom-tab-close">
            <ButtonClose onClick={onClose} />
        </div>
        
    </div> );
}

export default BottomTab;