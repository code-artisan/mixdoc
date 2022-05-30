import React, { useContext } from 'react';
import { context } from 'dumi/theme';
import MediaQuery from 'react-responsive';
import SearchBar from './search-bar';
import './index.scss';

export default () => {
  const { config } = useContext(context);

  return (
    <header className="docs-header">
      <div className="docs-header-inner">
        <div className="docs-header-left">
          <div className="docs-header-brand">
            <h1 className="docs-header-brand--logo">
              <a href="http://nusi.terminus.io/">
                <MediaQuery minWidth={501}>
                  <img
                    src={config.logo as string}
                    width="36px"
                    height="36px"
                    alt="nusi mobile"
                  />
                </MediaQuery>
                <MediaQuery maxWidth={500}>
                  <img
                    src="https://terminus-paas.oss-cn-hangzhou.aliyuncs.com/pmp/attachments/file-b17fd413-ff6e-44a2-a3c6-6e27a31180eb.png"
                    width="24px"
                    height="24px"
                    alt="nusi mobile"
                  />
                </MediaQuery>
              </a>
            </h1>
            <MediaQuery minWidth={375}>
              <h2 className="docs-header-brand--name">mixdoc</h2>
            </MediaQuery>
          </div>
        </div>

        <div className="docs-header-right">
          <SearchBar />
        </div>
      </div>
    </header>
  );
};
