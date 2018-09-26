import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Card, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;

@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['user/update'],
}))
@Form.create()
export default class UpdatePassword extends PureComponent {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, user } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        form.resetFields();
        this.handleUpdate(values, user.currentUser.userid); // 修改
      }
    });
  };

  handleReturn = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.goBack());
  };

  // 修改管理员密码
  handleUpdate = (fields, userId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/update',
      payload: {
        user: fields,
        userId,
      },
    });
    message.success('修改成功');
  };

  render() {
    const { submitting, form, user } = this.props;
    const updateData = user.currentUser;
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

    return (
      <PageHeaderLayout title="修改用户密码">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="帐号">
              {form.getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入帐号...' }],
                initialValue: updateData ? updateData.name : '',
              })(<Input style={{ width: '50%' }} disabled={true} placeholder="请输入" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="密码">
              {form.getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码..' }],
                initialValue: '',
              })(<Input style={{ width: '50%' }} type="password" placeholder="请输入" />)}
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
