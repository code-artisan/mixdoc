import React, { useContext, useState, useEffect } from 'react';
import { Layout, Carousel } from 'antd';
import { context, useDemoUrl, IPreviewerComponentProps } from 'dumi/theme';
import MediaQuery from 'react-responsive';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css';
import Header from '../components/header';
import SideBar from '../components/side-bar';
import SlugList from '../components/slug-list';
import Device from '../components/device';
import { ACTIVE_MSG_TYPE } from '../builtins/Previewer';

import './index.scss';
import '../styles/markdown.scss';

export default ({ children, location, route, ...props }) => {
  const { routes } = useContext(context);

  const { meta } = routes.find(item => {
    return item.path === children.props.location.pathname;
  });

  const defaultOpenKeys = [`/${location.pathname.replace(/^\//, '').split('/').shift()}`];
  const defaultSelectedKeys = [location.pathname];

  const [demo, setDemo] = useState<IPreviewerComponentProps>(null);
  const builtinDemoUrl = useDemoUrl(demo?.identifier);

  const [drawOpen, setDrawOpen] = useState<boolean>(false);

  useEffect(() => {
    const handler = (event: any) => {
      if (event.data.type === ACTIVE_MSG_TYPE) {
        setDemo(JSON.parse(event.data.value));
      }
    };

    window.addEventListener('message', handler);

    return () => window.removeEventListener('message', handler);
  }, []);

  // clear demoId when route changed
  useEffect(() => setDemo(null), [location.pathname]);

  // 打开抽屉菜单
  const handleOpenDraw = () => {
    setDrawOpen(value => !value);
  };

  const getContentForMiniScreen = () => {
    return (
      <>
        <div className="ant-layout-content--markdown">
          {children}
        </div>
        <div
          className="ant-layout-content--demo"
          style={{
            display: defaultOpenKeys.includes('/components') ? 'block' : 'none',
          }}
        >
          {/* demo 获取有延迟，需要预留 device 空间 */}
          {demo && <Device className="__dumi-default-mobile-content-device" url={demo.demoUrl || builtinDemoUrl} />}
        </div>
      </>
    );
  };

  return meta.layout === 'none' ? (
    <Layout className="docs-layout">{children}</Layout>
  ) : (
    <>
      <Layout className="docs-layout">
        <Header />
        <div className="docs-layout-content-layer">
          <MediaQuery minWidth={1367}>
            <Layout.Sider width='auto'>
              <SideBar defaultSelectedKeys={defaultSelectedKeys} defaultOpenKeys={defaultOpenKeys} />
            </Layout.Sider>
          </MediaQuery>

          <MediaQuery maxWidth={1366}>
            <Drawer
              handler={
                <div className="drawer-handle" style={{ display: `${drawOpen ? 'none' : 'block'}` }} onClick={handleOpenDraw}>
                  <svg className="icon menu-switch" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1015" width="16" height="16">
                    <path d="M793.6 469.333333H136.533333c-29.866667 0-51.2 17.066667-51.2 42.666667s21.333333 42.666667 51.2 42.666667h657.066667l-106.666667 106.666666c-17.066667 17.066667-17.066667 42.666667 0 59.733334 17.066667 17.066667 42.666667 17.066667 59.733334 0l179.2-179.2c8.533333-8.533333 12.8-21.333333 12.8-29.866667s-4.266667-21.333333-12.8-29.866667l-179.2-179.2c-17.066667-17.066667-42.666667-17.066667-59.733334 0-17.066667 17.066667-17.066667 42.666667 0 59.733334l106.666667 106.666666zM896 128H128c-25.6 0-42.666667 17.066667-42.666667 42.666667s17.066667 42.666667 42.666667 42.666666h768c25.6 0 42.666667-17.066667 42.666667-42.666666s-17.066667-42.666667-42.666667-42.666667z m0 682.666667H128c-25.6 0-42.666667 17.066667-42.666667 42.666666s17.066667 42.666667 42.666667 42.666667h768c25.6 0 42.666667-17.066667 42.666667-42.666667s-17.066667-42.666667-42.666667-42.666666z" fill="#7E869E" p-id="1016" />
                  </svg>
                </div>
              }
              open={drawOpen}
              onClose={() => setDrawOpen(false)}
            >
              <SideBar defaultSelectedKeys={defaultSelectedKeys} defaultOpenKeys={defaultOpenKeys} />
            </Drawer>
          </MediaQuery>

          <div className="ant-layout-content">
            <div className={`ant-layout-content-main ${defaultOpenKeys.includes('/components') ? '' : 'ant-layout-content-docs'}`}>
              <MediaQuery minWidth={415}>{getContentForMiniScreen()}</MediaQuery>

              <MediaQuery maxWidth={414}>
                {demo ? (
                  <Carousel effect="fade">
                    <div className="ant-layout-content--markdown">
                      {children}
                    </div>
                    <div
                      className="ant-layout-content--demo"
                      style={{
                        display: defaultOpenKeys.includes('/components') ? 'block' : 'none',
                      }}
                    >
                      <Device className="__dumi-default-mobile-content-device" url={demo.demoUrl || builtinDemoUrl} />
                    </div>
                  </Carousel>
                ) : (
                  getContentForMiniScreen()
                )}
              </MediaQuery>

              <div className="ant-layout-content--slug">
                <SlugList slugs={meta.slugs} />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};
