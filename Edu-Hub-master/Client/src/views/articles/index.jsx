import { Card, Button, Modal, Form, Input } from 'antd'
import Avatar from 'antd/lib/avatar/avatar'
import Meta from 'antd/lib/card/Meta'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  create_article,
  deleteArticle,
  Timeline,
  getinitialData
} from '../../reducers/articlesReducer'

import { DeleteFilled } from '@ant-design/icons'

import Styles from './index.module.css'

const { TextArea } = Input

const Articles = () => {
  let dispatch = useDispatch()
  const [modalVisible, setModalVisible] = useState(false)
  const [load, loading] = useState(2)
  const [form] = Form.useForm()
  const handleCancel = () => {
    setModalVisible(false)
  }

  const onFinish = (values) => {
    let Article = {
      text: values.articleBody,
      title: values.articleTitle,
      url: values.url
    }
    dispatch(create_article(Article))
    setModalVisible(false)
  }

  useEffect(() => {
    dispatch(getinitialData())
  }, [dispatch])

  const result = useSelector((state) => state.articles)
  const articleData = result?.articles
  const totalPages = result?.totalPages

  function handleClick() {
    setModalVisible(true)
  }
  const onLoadMore = () => {
    if (load <= totalPages) {
      let t = load
      dispatch(Timeline(t, 5))
      t++
      loading(t)
    }
  }
  const history = useHistory()

  return (
    <>
      <div className={Styles['articles-wrapper']}>
        <div className={Styles['article-title-container']}>
          <h2>Articles</h2>
          <div className={Styles['article-title-container']}>
            <Button
              type="secondary"
              shape="round"
              onClick={() => {
                history.push(`/app/myarticle`)
              }}
            >
              My Articles
            </Button>
            <Button
              shape="round"
              type="secondary"
              onClick={() => {
                history.push(`/app/myBookMarks`)
              }}
            >
              My BookMarks
            </Button>
            <Button type="primary" shape="round" onClick={handleClick}>
              New Article
            </Button>

            <Modal
              title="Add New Article"
              visible={modalVisible}
              onOk={form.submit}
              onCancel={handleCancel}
              footer={[
                <Button key="cancel" onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={form.submit}>
                  Submit
                </Button>
              ]}
            >
              <Form
                form={form}
                name="normal_login"
                className="login-form"
                onFinish={onFinish}
              >
                <Form.Item
                  name="articleTitle"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your Article Title!'
                    }
                  ]}
                >
                  <Input type="text" placeholder="ArticleTitle" />
                </Form.Item>
                <Form.Item
                  name="articleBody"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your article body!'
                    }
                  ]}
                >
                  <TextArea
                    type="text"
                    placeholder="article body"
                    autoSize={{ minRows: 5, maxRows: 6 }}
                  />
                </Form.Item>
                <Form.Item name="url">
                  <Input type="text" placeholder="article url" />
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </div>
        {articleData?.map((article, index) => (
          <ArticleCard key={index} article={article} />
        ))}
        {load <= totalPages ? (
          <Button className={Styles['onLoadMore']} onClick={onLoadMore}>
            loading more
          </Button>
        ) : (
          <div className={Styles['onLoadMore']}>End Of Results</div>
        )}
      </div>
    </>
  )
}

const ArticleCard = ({ article }) => {
  const history = useHistory()
  let dispatch = useDispatch()

  const clickDelete = () => {
    return dispatch(deleteArticle(article.id))
  }

  const viewArticle = () => {
    history.push(`/app/articles/${article.id}`)
  }
  const user = useSelector((state) => state.auth.user)

  return (
    <div className={Styles['article-card-container']}>
      <Card hoverable className="article-card" onClick={viewArticle}>
        <Meta
          avatar={<Avatar src={article?.authorPersonId?.photo} />}
          title={article?.authorPersonId?.name || user.name}
          description={article?.title}
        />

        <p>{article?.text}</p>
        {user?._id ===
          (article?.authorPersonId?._id || article?.authorPersonId) && (
          <Button
            type="icon"
            className={Styles['iconButton']}
            onClick={clickDelete}
          >
            <DeleteFilled />
          </Button>
        )}
        {/* <Button
          type="text"
          onClick={viewArticle}
          className={Styles['viewButton']}
        >
          {' '}
          view{' '}
        </Button> */}
      </Card>
    </div>
  )
}

export default Articles
