import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

export const userManager = new UserManager({
  authority: 'https://auth.hannami.xyz/realms/ProWallet',
  client_id: 'prowallet-client',
  client_secret: 'YXUP1QauuVqMgwznKLwQvlrxIqYkrhPb',
  redirect_uri: `${window.location.origin}`,
  post_logout_redirect_uri: `${window.location.origin}/login`,
  response_type: 'code',
  scope: 'openid profile email',
  userStore: new WebStorageStateStore({ store: window.localStorage }),
});

//ACCOUNT CONSOLE -> https://auth.hannami.xyz/realms/ProWallet/account/
//ADMIN CONSOLE   -> https://auth.hannami.xyz/admin/master/console/
