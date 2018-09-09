import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, Modal, message, Divider } from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './table.less';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

//  创建新增分类的Form
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleUpdate, handleModalVisible, updateData } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (JSON.stringify(updateData) === '{}') {
        //  新增
        handleAdd(fieldsValue);
      } //  修改
      else {
        handleUpdate(fieldsValue, updateData._id);
      }
    });
  };
  return (
    <Modal
      title="回答提问"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分类名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入分类名称...' }],
          initialValue: updateData.name,
        })(<Input placeholder="请输入" />)}
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
    // modalTitle:"",
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
      //   modalTitle: record?"修改分类":"新建分类",
      updateData: record ? record : {},
    });
  };

  //  新增分类事件
  //   handleAdd = fields => {
  //     const { dispatch } = this.props;
  //     dispatch({
  //       type: 'category/add',
  //       payload: {
  //         name: fields.name,
  //       },
  //     });

  //     message.success('添加成功');
  //     this.setState({
  //       modalVisible: false,
  //     });
  //   };

  //  修改分类事件
  handleUpdate = (fields, cid) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'category/update',
      payload: {
        name: fields.name,
        cid: cid,
      },
    });

    message.success('修改成功');
    this.setState({
      modalVisible: false,
    });
  };

  handleDelete = categoryId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product_issue/remove',
      payload: {
        cid: categoryId,
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
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
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
              {/* <Button
                style={{ marginLeft: 8 }}
                icon="plus"
                type="primary"
                onClick={() => this.handleModalVisible(true)}
              >
                新建
              </Button> */}
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={() => this.handleBatchDelete()} style={{ marginLeft: 8 }}>
                    批量删除
                  </Button>
                </span>
              )}
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
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
        dataIndex: 'aswer',
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
      //   handleAdd: this.handleAdd,
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
