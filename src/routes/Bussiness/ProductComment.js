import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, Rate, message, Icon, Select } from 'antd';
import StandardTable from 'components/StandardTable';
import Ellipsis from 'components/Ellipsis';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './table.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ product_comment, loading }) => ({
  product_comment,
  loading: loading.models.product_comment,
}))
@Form.create()
export default class Product_Comment extends PureComponent {
  state = {
    expandForm: false,
    // updateData: {},
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'product_comment/fetch',
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
      type: 'product_comment/fetch',
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
      type: 'product_comment/fetch',
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
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'product_comment/fetch',
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

  handleDelete = commentId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product_comment/remove',
      payload: {
        commentId: commentId,
        isAdmin: true,
      },
    });
    message.success('删除成功');
  };

  handleBatchDelete = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    dispatch({
      type: 'product_comment/batchremove',
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
    // const { selectedRows } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="商品名称">
              {getFieldDecorator('productName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="评论内容">
              {getFieldDecorator('commentCotent')(<Input placeholder="请输入" />)}
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
    // const rangeConfig = {
    //   rules: [{ type: 'array' }],
    // };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="商品名称">
              {getFieldDecorator('productName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="评论内容">
              {getFieldDecorator('commentCotent')(<Input placeholder="请输入" />)}
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
            <FormItem label="评论人">
              {getFieldDecorator('customerName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="评分">
              {getFieldDecorator('commentStar')(
                <Select style={{ width: '100%' }}>
                  <Option key="op1" value="1">
                    1
                  </Option>
                  <Option key="op2" value="2">
                    2
                  </Option>
                  <Option key="op3" value="3">
                    3
                  </Option>
                  <Option key="op4" value="4">
                    4
                  </Option>
                  <Option key="op5" value="5">
                    5
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
      product_comment: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '商品名称',
        dataIndex: 'productName',
        sorter: true,
      },
      {
        title: '评论人',
        dataIndex: 'customerName',
      },
      {
        title: '评论内容',
        dataIndex: 'commentCotent',
        render: val => (
          <Ellipsis length={10} tooltip>
            {val}
          </Ellipsis>
        ),
      },
      {
        title: '评论打分',
        dataIndex: 'commentStar',
        render: val => <Rate disabled defaultValue={val} />,
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
            {/* <a href="javascript:void(0);" onClick={() => this.handleModalVisible(true, record)}>
              回答
            </a>
            <Divider type="vertical" /> */}
            <a href="javascript:void(0);" onClick={() => this.handleDelete(record._id)}>
              删除
            </a>
          </Fragment>
        ),
      },
    ];

    // const parentMethods = {
    //   handleUpdate: this.handleUpdate,
    //   handleModalVisible: this.handleModalVisible,
    // };

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
        {/* <CreateForm {...parentMethods} modalVisible={modalVisible} updateData={updateData} /> */}
      </PageHeaderLayout>
    );
  }
}
