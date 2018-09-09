import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Upload,
  Icon,
  message,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import styles from './form.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@connect(({ product, category, loading }) => ({
  product,
  category,
  submitting: loading.effects['product/add'],
}))
@Form.create()
export default class BasicForms extends PureComponent {
  state = {
    editType: 1, // 编辑类型 1.新增 2.修改
    // formValues: {},
    // fileList: [], // 已上传的图片列表
  };

  componentWillMount() {
    const { dispatch, location } = this.props;
    const param = location.query;

    if (param) {
      // 修改状态
      this.setState({
        editType: 2,
      });
    }

    dispatch({
      type: 'category/fetchall',
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, location } = this.props;
    const { editType } = this.state;
    const param = location.query;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        form.resetFields();
        const fileArray = this.getImages();
        Object.assign(values, { images: fileArray });
        if (editType === 1) {
          this.handleAdd(values); // 新增
        } else {
          this.handleUpdate(values, param.pid); // 修改
        }
      }
    });
  };

  handleReturn = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/bussiness/product'));
  };

  // 新增商品事件
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/add',
      payload: fields,
    });

    message.success('添加成功');
    dispatch(routerRedux.push('/bussiness/product'));
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
    dispatch(routerRedux.push('/bussiness/product'));
  };

  // 设置已上传的图片
  handleChangeImgs = files => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/addfile',
      payload: files,
    });
  };

  handleRemoveImgs = files => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/removefile',
      payload: files.uid,
    });
  };

  getImages = () => {
    const { product } = this.props;
    const fileArray = [];
    product.imagesList.forEach(item => {
      fileArray.push(item.url);
    });
    return fileArray;
  };

  render() {
    const { submitting, form, product, category } = this.props;
    const { editType } = this.state;
    const updateData = editType === 2 ? product.item[0] : {};
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const uploadProps = {
      action: '/api/UploadImg',
      listType: 'picture',
      fileList: product.imagesList,
      accept: 'image/jpg,image/jpeg,image/png,image/bmp',
    };

    return (
      <PageHeaderLayout title={editType === 1 ? '添加商品' : '修改商品'}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="商品名称">
              {form.getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入商品名称...' }],
                initialValue: updateData ? updateData.name : '',
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="商品分类">
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
                  {category.categories.map(element => (
                    <Option key={element._id} value={element._id}>
                      {element.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="作者">
              {form.getFieldDecorator('bookAttribute.author', {
                rules: [{ required: true, message: '请输入作者...' }],
                initialValue: updateData.bookAttribute ? updateData.bookAttribute.author : '',
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="出版社">
              {form.getFieldDecorator('bookAttribute.publisher', {
                rules: [{ required: true, message: '请输入出版社...' }],
                initialValue: updateData.bookAttribute ? updateData.bookAttribute.publisher : '',
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="出版日期">
              {form.getFieldDecorator('bookAttribute.publicationTime', {
                rules: [{ required: true, message: '请选择出版日期...' }],
                initialValue: updateData.bookAttribute
                  ? moment(updateData.bookAttribute.publicationTime)
                  : moment(),
              })(<DatePicker placeholder="请选择日期" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="ISBN">
              {form.getFieldDecorator('bookAttribute.ISBN', {
                rules: [{ message: '请输入ISBN...' }],
                initialValue: updateData.bookAttribute ? updateData.bookAttribute.ISBN : '',
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="商品价格">
              {form.getFieldDecorator('price', {
                rules: [{ required: true, message: '请输入商品价格...' }],
                initialValue: updateData.price ? updateData.price.$numberDecimal : '',
              })(<InputNumber min={0} max={100000} step={0.1} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="图片">
              {form.getFieldDecorator('images', {
                rules: [{ required: true, message: '请上传图片...' }],
              })(
                <Upload
                  {...uploadProps}
                  onChange={this.handleChangeImgs}
                  onRemove={this.handleRemoveImgs}
                >
                  <Button>
                    <Icon type="upload" /> 上传
                  </Button>
                </Upload>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="商品描述">
              {form.getFieldDecorator('descption', {
                rules: [{ required: true, message: '请输入商品描述...' }],
                initialValue: updateData.descption,
              })(<TextArea rows={4} placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="是否上架">
              {form.getFieldDecorator('isActive', {
                rules: [{ required: true, message: '请选择是否上架...' }],
                initialValue: updateData.isActive ? updateData.isActive.toString() : 'true',
              })(
                <Select style={{ width: '30%' }}>
                  <Option key="op1" value="true">
                    是
                  </Option>
                  <Option key="op2" value="false">
                    否
                  </Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="库存">
              {form.getFieldDecorator('inventory', {
                rules: [{ required: true, message: '请输入商品库存...' }],
                initialValue: updateData.inventory ? updateData.inventory : 100,
              })(<InputNumber min={0} max={10000} />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReturn}>
                返回
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
