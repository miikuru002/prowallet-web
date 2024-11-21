import { classNames } from 'primereact/utils';
import { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef, LayoutConfig } from '../types';
import { LayoutContext } from './context/layoutcontext';
import { PrimeReactContext } from 'primereact/api';
import { Menu } from 'primereact/menu';
import { useAuth } from 'react-oidc-context';

const AppTopbar = forwardRef<AppTopbarRef>((_props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar, setLayoutConfig } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const menu = useRef<Menu>(null);
    const { changeTheme } = useContext(PrimeReactContext);
    const auth = useAuth();

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const toggleDarkMode = () => {
        const theme = layoutConfig.theme === 'lara-light-blue' ? 'lara-dark-blue' : 'lara-light-blue';
        const colorScheme = layoutConfig.colorScheme === 'light' ? 'dark' : 'light';

        console.log('current theme', layoutConfig.theme);
        console.log('new theme', theme);
        console.log('current colorScheme', layoutConfig.colorScheme);
        console.log('colorScheme', colorScheme);
        changeTheme?.(layoutConfig.theme, theme, 'theme-css', () => {
            setLayoutConfig((prevState: LayoutConfig) => ({ ...prevState, theme, colorScheme }));
        });
    };

    const items = [
      {
        label: 'Mi Perfil',
        icon: 'pi pi-user',
        command: () => window.location.href = 'https://auth.hannami.xyz/realms/ProWallet/account/'
      },
      {
        label: 'Cerrar Sesión',
        icon: 'pi pi-sign-out',
        command: () => auth.signoutRedirect(),
      }
    ];



    return (
        <div className="layout-topbar">
            <a href="/" className="layout-topbar-logo">
                <img src={`/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} alt="logo" />
                <span>ProWallet</span>
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
                <button type="button" className="p-link layout-topbar-button" onClick={(event) => menu.current?.toggle(event)}>
                    <i className="pi pi-user"></i>
                    <span>Profile</span>
                </button>

                <Menu model={items} popup ref={menu} id="popup_menu_right" popupAlignment="right" />
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
