import AppMenuitem from "./AppMenuitem";
import { MenuProvider } from "./context/menucontext";
import { AppMenuItem } from "../types";

const AppMenu = () => {
	const model: AppMenuItem[] = [
		{
			label: "Home",
			items: [{ label: "Dashboard", icon: "pi pi-fw pi-home", to: "/" }],
		},
		{
			label: "Principal",
			items: [
        { label: "Cartera de clientes", icon: "pi pi-folder-open", to: "/cartera" },
        { label: "Facturas", icon: "pi pi-fw pi-file", to: "/facturas" },
        { label: "Reportes", icon: "pi pi-fw pi-chart-bar", to: "/reportes" },
      ],
		},
		{
			label: "Components",
      to: "/uikit",
			items: [
				{
					label: "UI Kit",
					icon: "pi pi-fw pi-star",
					items: [
						{ label: "Form Layout", icon: "pi pi-fw pi-id-card", to: "/uikit/formlayout" },
					],
				},
        {
          label: "Login",
          icon: "pi pi-fw pi-sign-in",
          to: "/auth/login",
        },
				{
					label: "Empty",
					icon: "pi pi-fw pi-circle-off",
					to: "/pages/empty",
				},
			],
		},
	];
	return (
		<MenuProvider>
			<ul className="layout-menu">
				{model.map((item, i) => {
					return !item?.seperator ? (
						<AppMenuitem item={item} root={true} index={i} key={item.label} />
					) : (
						<li className="menu-separator"></li>
					);
				})}
			</ul>
		</MenuProvider>
	);
};

export default AppMenu;
