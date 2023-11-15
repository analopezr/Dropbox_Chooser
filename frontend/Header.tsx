import React from 'react';
import dropboxLogoBase64 from './dropboxLogoBase64';
import './Header.scss';

function Header() {  // TO-DO: Extract this component to its own file/module.
    return (
        <div>
            <div className="header-container">
                <div className="header-title-container">
                    <h1 className="header-title">
                        <img src={`data:image/png;base64,${dropboxLogoBase64}`} alt="Dropbox Logo" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                        Dropbox File Picker
                    </h1>
                </div>
            </div>
            <div className="header-separator"></div>
        </div>
    );
}

export default Header;