import { useContext, useRef, useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { LayoutContext } from "../../../../layout/context/layoutcontext";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { useAuth } from "react-oidc-context";
import { Toast } from "primereact/toast";

const LoginPage = () => {
	const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
	const [checked, setChecked] = useState(false);
	const { layoutConfig } = useContext(LayoutContext);
  const toast = useRef<Toast>(null);

	const auth = useAuth();

	const containerClassName = classNames(
		"surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden",
		{ "p-input-filled": false }
	);

	const handleLogin = async () => {
    await auth.signinResourceOwnerCredentials({
      username: email,
      password: password,
    });   
	};

	return (
		<div className={containerClassName}>
      <Toast ref={toast} />
			<div className="flex flex-column align-items-center justify-content-center">
				<img
					src={`/images/logo-${
						layoutConfig.colorScheme === "light" ? "dark" : "white"
					}.svg`}
					alt="ProWallet logo"
					className="mb-5 w-6rem flex-shrink-0"
				/>
				<div
					style={{
						borderRadius: "56px",
						padding: "0.3rem",
						background:
							"linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)",
					}}
				>
					<div
						className="w-full surface-card py-8 px-5 sm:px-8"
						style={{ borderRadius: "53px" }}
					>
						<div className="text-center mb-5">
							<div className="text-900 text-3xl font-medium mb-3">
								Bienvenido a ProWallet
							</div>
							<span className="text-600 font-medium">Inicia sesión para continuar</span>
						</div>

						<div>
							<label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
								Correo
							</label>
							<InputText
								id="email1"
								type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
								placeholder="Email address"
								className="w-full md:w-30rem mb-5"
								style={{ padding: "1rem" }}
							/>

							<label
								htmlFor="password1"
								className="block text-900 font-medium text-xl mb-2"
							>
								Contraseña
							</label>
							<Password
								inputId="password1"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Password"
								toggleMask
								className="w-full mb-5"
								inputClassName="w-full p-3 md:w-30rem"
							></Password>

							<div className="flex align-items-center justify-content-between mb-5 gap-5">
								<div className="flex align-items-center">
									<Checkbox
										inputId="rememberme1"
										checked={checked}
										onChange={(e) => setChecked(e.checked ?? false)}
										className="mr-2"
									></Checkbox>
									<label htmlFor="rememberme1">Recordar</label>
								</div>
							</div>
							<Button
								label="Sign In"
								className="w-full p-3 text-xl"
								onClick={handleLogin}
							></Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
