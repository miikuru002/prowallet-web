import { classNames } from 'primereact/utils';
import { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef, LayoutConfig } from '../types';
import { LayoutContext } from './context/layoutcontext';
import { PrimeReactContext } from 'primereact/api';

const AppTopbar = forwardRef<AppTopbarRef>((_props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar, setLayoutConfig } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const { changeTheme } = useContext(PrimeReactContext);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const toggleDarkMode = () => {
        const theme = layoutConfig.theme === 'lara-light-teal' ? 'lara-dark-teal' : 'lara-light-teal';
        const colorScheme = layoutConfig.colorScheme === 'light' ? 'dark' : 'light';

        console.log('current theme', layoutConfig.theme);
        console.log('new theme', theme);
        console.log('current colorScheme', layoutConfig.colorScheme);
        console.log('colorScheme', colorScheme);
        changeTheme?.(layoutConfig.theme, theme, 'theme-css', () => {
            setLayoutConfig((prevState: LayoutConfig) => ({ ...prevState, theme, colorScheme }));
        });
    };

    return (
        <div className="layout-topbar">
            <a href="/" className="layout-topbar-logo">
                <img src={`/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} alt="logo" />
                <span>SAKAI</span>
            </a>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <button type="button" className="p-link layout-topbar-button" onClick={toggleDarkMode}>
                    <i className="pi pi-moon"></i>
                    <span>Dark Mode</span>
                </button>
                <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-user"></i>
                    <span>Profile</span>
                </button>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
