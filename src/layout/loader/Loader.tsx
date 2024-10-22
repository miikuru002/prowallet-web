import React from 'react';
import { ProgressBar } from 'primereact/progressbar';
import './index.css';

/**
 * LOADER
 */
const Loader = (): React.JSX.Element => (
    <div className="loader-wrapper">
        <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
    </div>
);

export default Loader;