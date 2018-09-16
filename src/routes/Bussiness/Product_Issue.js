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
  Modal,
  message,
  Divider,
  Icon,
  DatePicker,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './table.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

//  创建回答问题的Form
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleUpdate, handleModalVisible, updateData } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleUpdate(fieldsValue, updateData._id);
    });
  };
  return (
    <Modal
      title="回答提问"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="回答内容">
        {form.getFieldDecorator('answer', {
          rules: [{ required: true, message: '请输入回答内容...' }],
          initialValue: updateData.answer,
        })(<TextArea rows={4} placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ product_issue, loading }) => ({
  product_issue,
  loading: loading.models.product_issue,
}))
@Form.create()
export default class Product_Issue extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    updateData: {},
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'product_issue/fetch',
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
      type: 'product_issue/fetch',
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
      type: 'product_issue/fetch',
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
      if (values.issueDate) {
        // 出版时间查询
        Object.assign(values, {
          issueDate_s: values.issueDate[0].format('YYYY-MM-DD'),
        });
        Object.assign(values, {
          issueDate_e: values.issueDate[1].format('YYYY-MM-DD'),
        });
        Object.assign(values, { issueDate: undefined });
      }
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'product_issue/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      updateData: record ? record : {},
    });
  };

  // 展开
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  //  回答提问事件
  handleUpdate = (fields, issueId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product_issue/answer',
      payload: {
        answer: fields.answer,
        issueId: issueId,
      },
    });

    message.success('提问回答成功');
    this.setState({
      modalVisible: false,
    });
  };

  handleDelete = issueId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product_issue/remove',
      payload: {
        issueId: issueId,
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
      type: 'product_issue/batchremove',
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
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="商品名称">
              {getFieldDecorator('productName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="问题">
              {getFieldDecorator('issue')(<Input placeholder="请输入" />)}
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
                  <Button onClick={() => this.handleBatchDelete()} style={{ marginLeft: 8 }}>
                    批量删除
                  </Button>
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
    const { selectedRows } = this.state;
    const rangeConfig = {
      rules: [{ type: 'array' }],
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="商品名称">
              {getFieldDecorator('productName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="问题">
              {getFieldDecorator('issue')(<Input placeholder="请输入" />)}
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
                  <Button onClick={() => this.handleBatchDelete()} style={{ marginLeft: 8 }}>
                    批量删除
                  </Button>
                </span>
              )}
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                收起 <Icon type="up" />
              </a>
            </span>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="提问日期">
              {getFieldDecorator('issueDate', rangeConfig)(
                <RangePicker style={{ width: '100%' }} />
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
      product_issue: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateData } = this.state;

    const columns = [
      {
        title: '商品名称',
        dataIndex: 'productName',
        sorter: true,
      },
      {
        title: '问题',
        dataIndex: 'issue',
      },
      {
        title: '回答',
        dataIndex: 'answer',
      },
      {
        title: '提问时间',
        dataIndex: 'issueDate',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
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
            <a href="javascript:void(0);" onClick={() => this.handleModalVisible(true, record)}>
              回答
            </a>
            <Divider type="vertical" />
            <a href="javascript:void(0);" onClick={() => this.handleDelete(record._id)}>
              删除
            </a>
          </Fragment>
        ),
      },
    ];

    const parentMethods = {
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
    };

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
        <CreateForm {...parentMethods} modalVisible={modalVisible} updateData={updateData} />
      </PageHeaderLayout>
    );
  }
}
