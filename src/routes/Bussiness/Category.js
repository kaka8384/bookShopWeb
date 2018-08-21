import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Button, Modal, message, Divider } from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Category.less';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

//创建新增分类的Form
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleUpdate,handleModalVisible,modalTitle,updateData } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();

      if(updateData==={})
      {
        console.log("222");
        handleAdd(fieldsValue);
      }
      else
      {
        handleUpdate(fieldsValue,updateData._id);
      }

    });
  };
  return (
    <Modal
      title={modalTitle}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分类名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入分类名称...' }],
          initialValue: updateData.name
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ category, loading }) => ({
  category,
  loading: loading.models.category,
}))
@Form.create()
export default class Category extends PureComponent {
  state = {
    modalVisible: false,
    modalTitle:"",
    updateData:{},
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'category/fetch',
    });
  }

  //更改表排序、页数等
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

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
      type: 'category/fetch',
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
      type: 'category/fetch',
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
        // updated: fieldsValue.updated && fieldsValue.updated.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'category/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag,record) => {
    
    this.setState({
      modalVisible: !!flag,
      modalTitle: record?"修改分类":"新建分类",
      updateData:record?record:{}
    });
  };

  //新增分类事件
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'category/add',
      payload: {
        name: fields.name,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  };

  //修改分类事件
  handleUpdate=(fields,cid) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'category/update',
      payload: {
        name: fields.name,
        cid:cid
      },
    });

    message.success('修改成功');
    this.setState({
      modalVisible: false,
    });
  };

  handleDelete=(categoryId)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'category/remove',
      payload: {
        cid:categoryId
      },
    });
    message.success('删除成功');
  };

  handleBatchDelete=()=>{
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    dispatch({
          type: 'category/batchremove',
          payload: {
            categoryIds: selectedRows.map(row => row._id).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
    message.success('批量删除成功');
  }

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { selectedRows } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="分类名称">
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
              <Button
                style={{ marginLeft: 8 }}
                icon="plus"
                type="primary"
                onClick={() => this.handleModalVisible(true)}
              >
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={()=>this.handleBatchDelete()} style={{ marginLeft: 8 }}>批量删除</Button>
                </span>
              )}
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    // const { expandForm } = this.state;
    // return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    return this.renderSimpleForm();
  }

  render() {
    const {
      category: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible,modalTitle,updateData } = this.state;

    const columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
      },
      {
        title: '更新时间',
        dataIndex: 'updated',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: (text,record) => (
          <Fragment>
            <a href="javascript:void(0);" onClick={() => this.handleModalVisible(true,record)}>修改</a>
            <Divider type="vertical" />
            <a href="javascript:void(0);" onClick={() => this.handleDelete(record._id)}>删除</a>
          </Fragment>
        ),
      },
    ];

    // const menu = (
    //   <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
    //     <Menu.Item key="remove">删除</Menu.Item>
    //     <Menu.Item key="approval">批量审批</Menu.Item>
    //   </Menu>
    // );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleUpdate:this.handleUpdate,
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} modalTitle={modalTitle} updateData={updateData} />
      </PageHeaderLayout>
    );
  }
}
