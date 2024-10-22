import { Suspense, type ComponentType } from 'react';
import Loader from './loader/Loader';

/**
 * LOADABLE - LAZY LOADING
 */
const Loadable =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) => (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  );

export default Loadable;
