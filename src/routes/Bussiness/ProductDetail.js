import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Divider } from 'antd';
import moment from 'moment';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './BasicProfile.less';

const { Description } = DescriptionList;

@connect(({ product, category }) => ({
  product,
  category,
}))
export default class ProductDetail extends Component {
  //   componentDidMount() {
  //     const { dispatch,product} = this.props;
  //     const item=product.item[0];
  //     dispatch({
  //         type: 'category/fetchOne',
  //         payload:item.categoryId,
  //       });
  //   }

  render() {
    const { product, category } = this.props;
    const item = product.item[0];
    const cat = category.item[0];
    return (
      <PageHeaderLayout title="商品详情">
        <Card bordered={false}>
          <DescriptionList size="large" title="图书信息" style={{ marginBottom: 32 }}>
            <Description term="图书分类">{cat.name}</Description>
            <Description term="图书名称">{item.name}</Description>
            <Description term="ISBN">{item.bookAttribute.ISBN}</Description>
            <Description term="作者">{item.bookAttribute.author}</Description>
            <Description term="出版社">{item.bookAttribute.publisher}</Description>
            <Description term="出版时间">
              {moment(item.bookAttribute.publicationTime).format('YYYY-MM-DD')}
            </Description>
            <Description term="库存">{item.inventory}</Description>
            <Description term="销量">{item.salesCount}</Description>
            <Description term="收藏数">{item.collectCount}</Description>
            <Description term="评论数">{item.commentCount}</Description>
            <Description term="是否上架">{item.isActive ? '是' : '否'}</Description>
            <Description term="更新时间">{moment(item.updated).format('YYYY-MM-DD')}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="图书介绍" style={{ marginBottom: 32 }}>
            <Description>{item.descption}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>图书图片</div>
          {product.imagesList.map(element => (
            <Card
              hoverable
              style={{ width: 240 }}
              key={element.uid}
              bordered={false}
              cover={<img alt="example" src={element.url} />}
            />
          ))}
        </Card>
      </PageHeaderLayout>
    );
  }
}
