import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Timeline,
  Divider,
  Drawer,
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  DatePicker,
  message,
  Icon,
  Select,
} from 'antd';
import StandardTable from 'components/StandardTable';
import Ellipsis from 'components/Ellipsis';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import _ from 'lodash';
import styles from './table.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Meta } = Card;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ order, loading }) => ({
  order,
  loading: loading.models.order,
}))
@Form.create()
export default class Order extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    orderDetailVisable: false,
    orderdetail: {}, //  选择的某个订单的详细信息
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'order/fetch',
    });
  }

  //  更改表排序、页数等
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {}); //  表格上的筛选查询

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'order/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'order/fetch',
      payload: {},
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      if (values.createdate) {
        // 订单创建日期查询
        Object.assign(values, {
          createdate_s: values.createdate[0].format('YYYY-MM-DD'),
        });
        Object.assign(values, {
          createdate_e: values.createdate[1].format('YYYY-MM-DD'),
        });
        Object.assign(values, { createdate: undefined });
      }
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'order/fetch',
        payload: values,
      });
    });
  };

  // 展开
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSend = orderId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'order/update',
      payload: {
        orderId: orderId,
        status: 3,
      },
    });
    message.success('发货成功');
  };

  onDrawerClose = () => {
    this.setState({
      orderdetail: {},
      orderDetailVisable: false,
    });
  };

  handleOpenDetail = record => {
    this.setState({
      orderdetail: {
        products: record.products,
        orderStatus: record.orderStatus,
        shippingAddress: record.shippingAddress,
      },
      orderDetailVisable: true,
    });
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单编号">
              {getFieldDecorator('orderNumber')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('lastStatus')(
                <Select style={{ width: '100%' }}>
                  <Option key="op1" value="-1">
                    已取消
                  </Option>
                  <Option key="op2" value="1">
                    已提交
                  </Option>
                  <Option key="op3" value="2">
                    已付款
                  </Option>
                  <Option key="op4" value="3">
                    已出库
                  </Option>
                  <Option key="op5" value="4">
                    已完成
                  </Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const rangeConfig = {
      rules: [{ type: 'array' }],
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单编号">
              {getFieldDecorator('orderNumber')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('lastStatus')(
                <Select style={{ width: '100%' }}>
                  <Option key="op1" value="-1">
                    已取消
                  </Option>
                  <Option key="op2" value="1">
                    已提交
                  </Option>
                  <Option key="op3" value="2">
                    已付款
                  </Option>
                  <Option key="op4" value="3">
                    已出库
                  </Option>
                  <Option key="op5" value="4">
                    已完成
                  </Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                收起 <Icon type="up" />
              </a>
            </span>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="创建日期">
              {getFieldDecorator('createdate', rangeConfig)(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="支付方式">
              {getFieldDecorator('payType')(
                <Select style={{ width: '100%' }}>
                  <Option key="op1" value="1">
                    在线支付
                  </Option>
                  <Option key="op2" value="2">
                    货到付款
                  </Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="备注">
              {getFieldDecorator('memo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      order: { data },
      loading,
    } = this.props;
    const { selectedRows, orderdetail, orderDetailVisable } = this.state;

    const pStyle = {
      fontSize: 16,
      color: 'rgba(0,0,0,0.85)',
      lineHeight: '24px',
      display: 'block',
      marginBottom: 16,
    };

    const DescriptionItem = ({ title, content }) => (
      <div
        style={{
          fontSize: 14,
          lineHeight: '22px',
          marginBottom: 7,
          color: 'rgba(0,0,0,0.65)',
        }}
      >
        <p
          style={{
            marginRight: 8,
            display: 'inline-block',
            color: 'rgba(0,0,0,0.85)',
          }}
        >
          {title}:
        </p>
        {content}
      </div>
    );

    const columns = [
      {
        title: '订单编号',
        dataIndex: 'orderNumber',
        sorter: true,
        render: (text, record) => (
          <a href="javascript:void(0);" onClick={() => this.handleOpenDetail(record)}>
            {text}
          </a>
        ),
      },
      {
        title: '创建日期',
        dataIndex: 'createdate',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '客户',
        dataIndex: 'customerAccount',
      },
      {
        title: '总金额',
        dataIndex: 'orderPrice.$numberDecimal',
      },

      {
        title: '运费',
        dataIndex: 'freight.$numberDecimal',
      },
      {
        title: '支付方式',
        dataIndex: 'payType',
        render: val => <span>{val === '1' ? '在线支付' : '货到付款'}</span>,
      },
      {
        title: '订单状态',
        dataIndex: 'lastStatus',
        render: text => this.getOrderStatus(text),
      },
      {
        title: '备注',
        dataIndex: 'memo',
        render: val => (
          <Ellipsis length={2} tooltip>
            {val}
          </Ellipsis>
        ),
      },
      {
        title: '更新时间',
        dataIndex: 'updated',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            {record.lastStatus === 2 ? (
              <a href="javascript:void(0);" onClick={() => this.handleSend(record._id)}>
                发货
              </a>
            ) : (
              ''
            )}
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator} />
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey={record => record._id}
            />
          </div>
        </Card>
        <Drawer
          width={640}
          title="订单详情"
          placement="right"
          closable={false}
          onClose={this.onDrawerClose}
          visible={orderDetailVisable}
        >
          <p style={pStyle}>商品信息</p>
          {orderdetail.products
            ? orderdetail.products.map(item => (
                <Card
                  bordered={false}
                  hoverable
                  style={{ width: 160 }}
                  cover={<img alt="example" src={item.img} />}
                >
                  <Meta
                    title={item.name}
                    description={item.price.$numberDecimal + '元 × ' + item.buyCount + '件'}
                  />
                </Card>
              ))
            : ''}
          <Divider />
          <p style={pStyle}>订单状态</p>
          <Timeline>
            {orderdetail.orderStatus
              ? orderdetail.orderStatus.map(item => (
                  <Timeline.Item>
                    {this.getOrderStatus(item.status)}{' '}
                    {moment(item.date).format('YYYY-MM-DD HH:mm:ss')}
                  </Timeline.Item>
                ))
              : ''}
          </Timeline>
          <Divider />
          <p style={pStyle}>收货信息</p>
          {orderdetail.shippingAddress ? (
            <Card bordered={false} key="address">
              <Row>
                <Col span={12}>
                  <DescriptionItem title="收货人" content={orderdetail.shippingAddress.name} />
                </Col>
                <Col span={12}>
                  <DescriptionItem title="手机" content={orderdetail.shippingAddress.mobile} />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <DescriptionItem
                    title="收货地址"
                    content={
                      orderdetail.shippingAddress.province +
                      orderdetail.shippingAddress.city +
                      orderdetail.shippingAddress.district +
                      orderdetail.shippingAddress.address
                    }
                  />
                </Col>
              </Row>
            </Card>
          ) : (
            ''
          )}
        </Drawer>
      </PageHeaderLayout>
    );
  }

  getOrderStatus(status) {
    switch (status) {
      case 1:
        return '已提交';
      case 2:
        return '已付款';
      case 3:
        return '已出库';
      case 4:
        return '已完成';
      case -1:
        return '已取消';
    }
  }
}
