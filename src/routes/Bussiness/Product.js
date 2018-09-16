import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Icon,
  Input,
  InputNumber,
  Button,
  message,
  Divider,
  DatePicker,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './table.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ product, category, loading }) => ({
  product,
  category,
  loading: loading.models.product,
}))
@Form.create()
export default class Product extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    expandForm: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/fetch',
    });
  }

  // 更改表排序、页数等
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {}); // 表格上的筛选查询

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
      type: 'product/fetch',
      payload: params,
    });
  };

  // 展开
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  // 重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'product/fetch',
      payload: {},
    });
  };

  // 选择行
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
      if (values.publicationTime) {
        // 出版时间查询
        Object.assign(values, {
          publicationTime_S: values.publicationTime[0].format('YYYY-MM-DD'),
        });
        Object.assign(values, {
          publicationTime_E: values.publicationTime[1].format('YYYY-MM-DD'),
        });
        Object.assign(values, { publicationTime: undefined });
      }
      if (values.publicationTime) {
        // 出版时间查询
        Object.assign(values, {
          publicationTime_S: values.publicationTime[0].format('YYYY-MM-DD'),
        });
        Object.assign(values, {
          publicationTime_E: values.publicationTime[1].format('YYYY-MM-DD'),
        });
        Object.assign(values, { publicationTime: undefined });
      }
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'product/fetch',
        payload: values,
      });
    });
  };

  //  商品编辑
  handleEdit = id => {
    const { dispatch } = this.props;
    if (id) {
      dispatch({
        type: 'product/fetchOne',
        payload: { id, type: 'edit' },
      });
    } else {
      dispatch({
        type: 'product/clearItem',
      });
    }
  };

  //  商品详情
  handleDetail = (id, cid) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'category/fetchOne',
      payload: cid,
    });
    dispatch({
      type: 'product/fetchOne',
      payload: { id, type: 'detail' },
    });
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/remove',
      payload: {
        pid: id,
      },
    });
    message.success('删除成功');
  };

  handleBatchDelete = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    dispatch({
      type: 'product/batchremove',
      payload: {
        productIds: selectedRows.map(row => row._id).join(','),
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
            <FormItem label="作者">
              {getFieldDecorator('author')(<Input placeholder="请输入" />)}
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
                onClick={() => this.handleEdit()}
              >
                新建
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
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="作者">
              {getFieldDecorator('author')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="出版社">
              {getFieldDecorator('publisher')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="出版日期">
              {getFieldDecorator('publicationTime', rangeConfig)(
                <RangePicker style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="库存量">
              {getFieldDecorator('inventory')(<InputNumber style={{ width: '100%' }} />)}
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
                onClick={() => this.handleEdit()}
              >
                新建
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
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
  // renderSimpleForm() {
  //   const { form } = this.props;
  //   const { getFieldDecorator } = form;
  //   const { selectedRows } = this.state;
  //   return (
  //     <Form onSubmit={this.handleSearch} layout="inline">
  //       <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
  //         <Col md={8} sm={24}>
  //           <FormItem label="商品名称">
  //             {getFieldDecorator('name')(<Input placeholder="请输入" />)}
  //           </FormItem>
  //         </Col>
  //         <Col md={8} sm={24}>
  //           <FormItem label="作者">
  //             {getFieldDecorator('author')(<Input placeholder="请输入" />)}
  //           </FormItem>
  //         </Col>
  //         <Col md={8} sm={24}>
  //           <span className={styles.submitButtons}>
  //             <Button type="primary" htmlType="submit">
  //               查询
  //             </Button>
  //             <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
  //               重置
  //             </Button>
  //             <Button
  //               style={{ marginLeft: 8 }}
  //               icon="plus"
  //               type="primary"
  //               onClick={() => this.handleEdit()}
  //             >
  //               新建
  //             </Button>
  //             {selectedRows.length > 0 && (
  //               <span>
  //                 <Button onClick={() => this.handleBatchDelete()} style={{ marginLeft: 8 }}>
  //                   批量删除
  //                 </Button>
  //               </span>
  //             )}
  //             <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
  //               展开 <Icon type="down" />
  //             </a>
  //           </span>
  //         </Col>
  //       </Row>
  //     </Form>
  //   );
  // }

  // renderAdvancedForm() {
  //   const { form } = this.props;
  //   const { getFieldDecorator } = form;
  //   const { selectedRows } = this.state;
  //   const rangeConfig = {
  //     rules: [{ type: 'array' }],
  //   };
  //   return (
  //     <Form onSubmit={this.handleSearch} layout="inline">
  //       <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
  //         <Col md={8} sm={24}>
  //           <FormItem label="商品名称">
  //             {getFieldDecorator('name')(<Input placeholder="请输入" />)}
  //           </FormItem>
  //         </Col>
  //         <Col md={8} sm={24}>
  //           <FormItem label="作者">
  //             {getFieldDecorator('author')(<Input placeholder="请输入" />)}
  //           </FormItem>
  //         </Col>
  //         <Col md={8} sm={24}>
  //           <FormItem label="出版社">
  //             {getFieldDecorator('publisher')(<Input placeholder="请输入" />)}
  //           </FormItem>
  //         </Col>
  //       </Row>
  //       <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
  //         <Col md={8} sm={24}>
  //           <FormItem label="出版日期">
  //             {getFieldDecorator('publicationTime', rangeConfig)(
  //               <RangePicker style={{ width: '100%' }} />
  //             )}
  //           </FormItem>
  //         </Col>
  //         <Col md={8} sm={24}>
  //           <FormItem label="库存量">
  //             {getFieldDecorator('inventory')(<InputNumber style={{ width: '100%' }} />)}
  //           </FormItem>
  //         </Col>
  //         <Col md={8} sm={24}>
  //           <span className={styles.submitButtons}>
  //             <Button type="primary" htmlType="submit">
  //               查询
  //             </Button>
  //             <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
  //               重置
  //             </Button>
  //             <Button
  //               style={{ marginLeft: 8 }}
  //               icon="plus"
  //               type="primary"
  //               onClick={() => this.handleEdit()}
  //             >
  //               新建
  //             </Button>
  //             {selectedRows.length > 0 && (
  //               <span>
  //                 <Button onClick={() => this.handleBatchDelete()} style={{ marginLeft: 8 }}>
  //                   批量删除
  //                 </Button>
  //               </span>
  //             )}
  //             <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
  //               收起 <Icon type="up" />
  //             </a>
  //           </span>
  //         </Col>
  //       </Row>
  //     </Form>
  //   );
  // }

  // renderForm() {
  //   const { expandForm } = this.state;
  //   return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  // }

  render() {
    const {
      product: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        render: (val, record) => (
          <a
            href="javascript:void(0);"
            onClick={() => this.handleDetail(record._id, record.categoryId)}
          >
            {val}
          </a>
        ),
      },
      {
        title: '价格',
        dataIndex: 'price.$numberDecimal',
        sorter: true,
      },
      {
        title: '作者',
        dataIndex: 'bookAttribute.author',
      },
      {
        title: '出版社',
        dataIndex: 'bookAttribute.publisher',
      },
      {
        title: '出版日期',
        dataIndex: 'bookAttribute.publicationTime',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '库存',
        dataIndex: 'inventory',
      },
      {
        title: '销量',
        dataIndex: 'salesCount',
        sorter: true,
      },
      {
        title: '在售',
        dataIndex: 'isActive',
        render: val => <span>{val ? '是' : '否'}</span>,
        filters: [
          {
            text: '是',
            value: true,
          },
          {
            text: '否',
            value: false,
          },
        ],
        filterMultiple: false,
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
            <a href="javascript:void(0);" onClick={() => this.handleEdit(record._id)}>
              修改
            </a>
            <Divider type="vertical" />
            <a href="javascript:void(0);" onClick={() => this.handleDelete(record._id)}>
              删除
            </a>
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

    // const parentMethods = {
    //   handleAdd: this.handleAdd,
    //   handleUpdate: this.handleUpdate,
    //   handleModalVisible: this.handleModalVisible,
    //   handleChangeImgs: this.handleChangeImgs,
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
        {/* <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          modalTitle={modalTitle}
          updateData={updateData}
          fileList={fileList}
          defaultFileList={defaultFileList}
          category={category}
        /> */}
      </PageHeaderLayout>
    );
  }
}
// function GetImages(files) {
//   const fileArray = [];
//   files.fileList.forEach(item => {
//     if (item.status === 'done' && item.response.success) {
//       fileArray.push(item.response.url);
//     }
//   });
//   return fileArray;
// }
