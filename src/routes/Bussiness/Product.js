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
  Modal,
  message,
  Divider,
  DatePicker,
  Select,
  Upload,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Product.less';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;
const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

// 创建新增商品的Form
const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleUpdate,
    handleModalVisible,
    modalTitle,
    updateData,
    renderOptions,
    handleChangeImgs,
    defaultFileList,
  } = props;

  // const uploadedFiles=[];

  const uploadProps = {
    action: '/api/UploadImg',
    listType: 'picture',
    // defaultFileList: defaultFileList,
    fileList: defaultFileList,
    accept: 'image/jpg,image/jpeg,image/png,image/bmp',
  };
  // console.log(fileList);
  //  console.log(uploadedFiles);
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const fileArray = GetImages(fieldsValue.images);
      Object.assign(fieldsValue, { images: fileArray });
      if (JSON.stringify(updateData) === '{}') {
        handleAdd(fieldsValue); // 新增
      } else {
        handleUpdate(fieldsValue, updateData._id); // 修改
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入商品名称...' }],
          initialValue: updateData.name,
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品分类">
        {form.getFieldDecorator('categoryId', {
          rules: [{ required: true, message: '请选择商品分类...' }],
          initialValue: updateData.categoryId,
        })(
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder="请选择"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {renderOptions()}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="作者">
        {form.getFieldDecorator('bookAttribute.author', {
          rules: [{ required: true, message: '请输入作者...' }],
          initialValue: updateData.bookAttribute ? updateData.bookAttribute.author : '',
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="出版社">
        {form.getFieldDecorator('bookAttribute.publisher', {
          rules: [{ required: true, message: '请输入出版社...' }],
          initialValue: updateData.bookAttribute ? updateData.bookAttribute.publisher : '',
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="出版日期">
        {form.getFieldDecorator('bookAttribute.publicationTime', {
          rules: [{ required: true, message: '请选择出版日期...' }],
          initialValue: updateData.bookAttribute
            ? moment(updateData.bookAttribute.publicationTime)
            : moment(),
        })(<DatePicker placeholder="请选择日期" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="ISBN">
        {form.getFieldDecorator('bookAttribute.ISBN', {
          rules: [{ message: '请输入ISBN...' }],
          initialValue: updateData.bookAttribute ? updateData.bookAttribute.ISBN : '',
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品价格">
        {form.getFieldDecorator('price', {
          rules: [{ required: true, message: '请输入商品价格...' }],
          initialValue: updateData.price ? updateData.price.$numberDecimal : '',
        })(<InputNumber min={0} max={100000} step={0.1} />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="图片">
        {form.getFieldDecorator('images', {
          rules: [{ required: true, message: '请上传图片...' }],
        })(
          <Upload {...uploadProps} onChange={handleChangeImgs}>
            <Button>
              <Icon type="upload" /> 上传
            </Button>
          </Upload>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品描述">
        {form.getFieldDecorator('descption', {
          rules: [{ required: true, message: '请输入商品描述...' }],
          initialValue: updateData.descption,
        })(<TextArea rows={4} placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="是否上架">
        {form.getFieldDecorator('isActive', {
          rules: [{ required: true, message: '请选择是否上架...' }],
          initialValue: updateData.isActive ? updateData.isActive : 'true',
        })(
          <Select style={{ width: '20%' }}>
            <Option key="op1" value="true">
              是
            </Option>
            <Option key="op2" value="false">
              否
            </Option>
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="库存">
        {form.getFieldDecorator('inventory', {
          rules: [{ required: true, message: '请输入商品库存...' }],
          initialValue: updateData.inventory ? updateData.inventory : 100,
        })(<InputNumber min={0} max={10000} />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ product, category, loading }) => ({
  product,
  category,
  loading: loading.models.product,
}))
@Form.create()
export default class Product extends PureComponent {
  state = {
    modalVisible: false,
    modalTitle: '',
    updateData: {},
    selectedRows: [],
    formValues: {},
    expandForm: false,
    fileList: [], // 已上传的图片列表
    defaultFileList: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/fetch',
    });
    dispatch({
      type: 'category/fetchall',
    });
  }

  // 加载商品分类
  renderOptions = () => {
    const { category } = this.props;
    category.categories.foreach(element => {
      return (
        <Option key={element._id} value={element._id}>
          {element.name}
        </Option>
      );
    });
  };

  // 设置已上传的图片
  handleChangeImgs = files => {
    const fileArray = GetImages(files);
    this.setState({ fileList: fileArray });
  };

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
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'product/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag, record) => {
    const fileobj = [];
    if (record) {
      record.images.map(item => {
        return fileobj.push({
          uid: '-1',
          name: item.substr(item.lastIndexOf('/') + 1),
          status: 'done',
          url: item,
          thumbUrl: item,
        });
      });
    }
    this.setState({
      modalVisible: !!flag,
      modalTitle: record ? '修改商品' : '新建商品',
      updateData: record,
      fileList: [],
      defaultFileList: fileobj,
    });
  };

  // 新增商品事件
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/add',
      payload: fields,
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  };

  // 修改商品事件
  handleUpdate = (fields, pid) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/update',
      payload: {
        product: fields,
        pid,
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
      type: 'product/remove',
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
      type: 'product/batchremove',
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
                onClick={() => this.handleModalVisible(true)}
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
                onClick={() => this.handleModalVisible(true)}
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
        {/* <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div> */}
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      product: { data },
      loading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      modalTitle,
      updateData,
      fileList,
      defaultFileList,
    } = this.state;
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
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
            <a href="javascript:void(0);" onClick={() => this.handleModalVisible(true, record)}>
              修改
            </a>
            <Divider type="vertical" />
            {/* <a href="javascript:void(0);" onClick={() => this.handleDelete(record._id)}>删除</a>
            <Divider type="vertical" /> */}
            <a href="javascript:void(0);">加库存</a>
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
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
      renderOptions: this.renderOptions,
      handleChangeImgs: this.handleChangeImgs,
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
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          modalTitle={modalTitle}
          updateData={updateData}
          fileList={fileList}
          defaultFileList={defaultFileList}
        />
      </PageHeaderLayout>
    );
  }
}
function GetImages(files) {
  const fileArray = [];
  files.fileList.forEach(item => {
    if (item.status === 'done' && item.response.success) {
      fileArray.push(item.response.url);
    }
  });
  return fileArray;
}
