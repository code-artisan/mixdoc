import React, { useContext } from 'react';
import { Row, Breadcrumb } from 'antd';
import { context } from 'dumi/theme';
import MediaQuery from 'react-responsive';
import './index.scss';

type PageHeaderProps = {
  title: string;
  subtitle: string;
  belongs: string | undefined;
};

export default (props: PageHeaderProps) => {
  const { config } = useContext(context);

  return (
    <div className="docs-page-header">
      <div className="docs-page-header--inner">
        <Row align="middle" justify="space-between">
          <h1 className="docs-page-header--title">
            {props.title.replace(/\s[a-zA-Z]+/, '')}
          </h1>
          <MediaQuery minWidth={415}>
            <Breadcrumb separator="/">
              <Breadcrumb.Item>{config.title}</Breadcrumb.Item>
              {typeof props.belongs === 'string' && (
                <Breadcrumb.Item>{props.belongs}</Breadcrumb.Item>
              )}
              <Breadcrumb.Item>{props.title}</Breadcrumb.Item>
            </Breadcrumb>
          </MediaQuery>
        </Row>
        <div className="docs-page-header--subtitle">{props.subtitle}</div>
      </div>
    </div>
  );
};
