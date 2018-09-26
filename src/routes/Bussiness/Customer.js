import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
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
  Dropdown,
  Menu,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './table.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ customer, loading }) => ({
  customer,
  loading: loading.models.customer,
}))
@Form.create()
export default class Customer extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/fetch',
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
      type: 'customer/fetch',
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
      type: 'customer/fetch',
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
      if (values.brithDay) {
        // 生日查询
        Object.assign(values, {
          brithDayStart: values.brithDay[0].format('YYYY-MM-DD'),
        });
        Object.assign(values, {
          brithDayEnd: values.brithDay[1].format('YYYY-MM-DD'),
        });
        Object.assign(values, { brithDay: undefined });
      }
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'customer/fetch',
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

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'batchOpen':
        dispatch({
          type: 'customer/batchopen',
          payload: {
            customerIds: selectedRows.map(row => row._id).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        message.success('批量启用成功');
        break;
      case 'batchCancel':
        dispatch({
          type: 'customer/batchcancel',
          payload: {
            customerIds: selectedRows.map(row => row._id).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        message.success('批量禁用成功');
        break;
      default:
        break;
    }
  };

  handleCancel = customerId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/cancel',
      payload: {
        customerId: customerId,
      },
    });
    message.success('禁用成功');
  };

  handleOpen = customerId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/open',
      payload: {
        customerId: customerId,
      },
    });
    message.success('启用成功');
  };

  handleBatchCancel = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    dispatch({
      type: 'customer/batchcancel',
      payload: {
        issueIds: selectedRows.map(row => row._id).join(','),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
      },
    });
    message.success('批量删除成功');
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { selectedRows } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="batchOpen">批量启用</Menu.Item>
        <Menu.Item key="batchCancel">批量禁用</Menu.Item>
      </Menu>
    );
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('username')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="手机号码">
              {getFieldDecorator('mobile')(<Input placeholder="请输入" />)}
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
              {selectedRows.length > 0 && (
                <span>
                  <Dropdown overlay={menu}>
                    <Button>
                      批量操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
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
            <FormItem label="用户名">
              {getFieldDecorator('username')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="手机号码">
              {getFieldDecorator('mobile')(<Input placeholder="请输入" />)}
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
            <FormItem label="昵称">
              {getFieldDecorator('nickname')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="生日">
              {getFieldDecorator('brithDay', rangeConfig)(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="是否可用">
              {getFieldDecorator('isActive')(
                <Select style={{ width: '100%' }}>
                  <Option key="op1" value="true">
                    是
                  </Option>
                  <Option key="op2" value="false">
                    否
                  </Option>
                </Select>
              )}
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
      customer: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        sorter: true,
      },
      {
        title: '手机号码',
        dataIndex: 'mobile',
      },
      {
        title: '客户昵称',
        dataIndex: 'nickname',
        sorter: true,
      },
      {
        title: '性别',
        dataIndex: 'gender',
        sorter: true,
        render: val => <span>{val === 'M' ? '男' : '女'}</span>,
      },
      {
        title: '生日',
        dataIndex: 'brithDay',
        sorter: true,
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD') : ''}</span>,
      },
      {
        title: '邮箱',
        dataIndex: 'mail',
      },
      {
        title: '是否可用',
        dataIndex: 'isActive',
        render: val => <span>{val ? '是' : '否'}</span>,
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
            {record.isActive ? (
              <a href="javascript:void(0);" onClick={() => this.handleCancel(record._id)}>
                注销
              </a>
            ) : (
              <a href="javascript:void(0);" onClick={() => this.handleOpen(record._id)}>
                启用
              </a>
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
      </PageHeaderLayout>
    );
  }
}
