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
        { label: "Cartera de clientes", icon: "pi pi-fw pi-users", to: "/cartera" },
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
						{ label: "Input", icon: "pi pi-fw pi-check-square", to: "/uikit/input" },
						{ label: "Table", icon: "pi pi-fw pi-table", to: "/uikit/table" },
						{ label: "List", icon: "pi pi-fw pi-list", to: "/uikit/list" },
						{ label: "Panel", icon: "pi pi-fw pi-tablet", to: "/uikit/panel" },
						{ label: "Overlay", icon: "pi pi-fw pi-clone", to: "/uikit/overlay" },
						{ label: "Message", icon: "pi pi-fw pi-comment", to: "/uikit/message" },
						{ label: "Misc", icon: "pi pi-fw pi-circle", to: "/uikit/misc" },
					],
				},
        {
          label: "Login",
          icon: "pi pi-fw pi-sign-in",
          to: "/auth/login",
        },
				{
					label: "Crud",
					icon: "pi pi-fw pi-pencil",
					to: "/pages/crud",
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
