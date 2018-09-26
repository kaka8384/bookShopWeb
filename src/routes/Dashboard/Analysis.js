import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Card, Tabs, Table, Tooltip, Menu, Dropdown } from 'antd';
import numeral from 'numeral';
import { ChartCard, Bar } from 'components/Charts';

import styles from './Analysis.less';

const { TabPane } = Tabs;

@connect(({ analysis, loading }) => ({
  analysis,
  loading: loading.effects['analysis/fetch'],
}))
export default class Analysis extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'analysis/fetchOrderCount',
    });
    dispatch({
      type: 'analysis/fetchProductCount',
    });
    dispatch({
      type: 'analysis/fetchCustomerCount',
    });
    dispatch({
      type: 'analysis/fetchTopSales',
    });
    dispatch({
      type: 'analysis/fetchTopCollect',
    });
    dispatch({
      type: 'analysis/fetchTopComment',
    });
    dispatch({
      type: 'analysis/fetchOrderByDate',
    });
  }

  render() {
    const { analysis, loading } = this.props;

    const {
      orderCount,
      productCount,
      customerCount,
      topSalesdata,
      topCollectdata,
      topCommentdata,
      newOrderGroup,
    } = analysis;
    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );

    const iconGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis" />
        </Dropdown>
      </span>
    );

    const collectColumns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '收藏数',
        dataIndex: 'collectCount',
        key: 'collectCount',
        className: styles.alignRight,
      },
    ];

    const commentColumns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '评论数',
        dataIndex: 'commentCount',
        key: 'commentCount',
        className: styles.alignRight,
      },
    ];

    const topColResponsiveProps = {
      xs: 32,
      sm: 16,
      md: 16,
      lg: 16,
      xl: 8,
      style: { marginBottom: 24 },
    };

    return (
      <Fragment>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="总订单量"
              loading={loading}
              action={
                <Tooltip title="商城总订单数量">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={orderCount}
              contentHeight={46}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="商品总量"
              loading={loading}
              action={
                <Tooltip title="已上架图书总量">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={productCount}
              contentHeight={46}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="用户总量"
              loading={loading}
              action={
                <Tooltip title="网站注册用户总量">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={customerCount}
              contentHeight={46}
            />
          </Col>
        </Row>

        <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.salesCard}>
            <Tabs size="large" tabBarStyle={{ marginBottom: 24 }}>
              <TabPane tab="订单数据" key="order">
                <Row>
                  <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Bar height={295} title="近7日订单数量" data={newOrderGroup} />
                    </div>
                  </Col>
                  <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesRank}>
                      <h4 className={styles.rankingTitle}>商品销售量排名</h4>
                      <ul className={styles.rankingList}>
                        {topSalesdata.list.map((item, i) => (
                          <li key={item._id}>
                            <span className={i < 3 ? styles.active : ''}>{i + 1}</span>
                            <span>{item.name}</span>
                            <span>{numeral(item.salesCount).format('0,0')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </div>
        </Card>

        <Row gutter={24}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              loading={loading}
              bordered={false}
              title="商品收藏量排名"
              extra={iconGroup}
              style={{ marginTop: 24 }}
            >
              <Table
                rowKey={record => record._id}
                size="small"
                pagination={false}
                columns={collectColumns}
                dataSource={topCollectdata.list}
              />
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              loading={loading}
              bordered={false}
              title="商品评论量排名"
              extra={iconGroup}
              style={{ marginTop: 24 }}
            >
              <Table
                rowKey={record => record._id}
                size="small"
                pagination={false}
                columns={commentColumns}
                dataSource={topCommentdata.list}
              />
            </Card>
          </Col>
        </Row>
      </Fragment>
    );
  }
}
