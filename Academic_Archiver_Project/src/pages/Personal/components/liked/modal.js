import React, { useRef, useState } from 'react'
import {
  Upload,
  Button,
  Icon,
  Modal,
  Form,
  Input,
  message
} from 'antd'
import Axios from 'axios';

const { TextArea } = Input;

const ModalForm = ({ visible, onCancel, onSubmit }) => {
  const formRef = useRef('')
  const handleOk = () => {
    formRef.current.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const { title, intro, fileUpaload } = fieldsValue
      const params = {
        title,
        intro,
        url: `http://localhost:3232/${fileUpaload[0].name}`
      }

      Axios.post('http://localhost:3232/api/paper/new', params)
        .then(res => {
          if (res.data.code === 200) {
            onSubmit()
            message.success('paper upload successfully')
          }
        })
    })
  }

  return (
    <Modal
      title="Upload Paper"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <WrappedUploadForm ref={formRef} />
    </Modal>
  )
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const UploadForm = ({ form: { getFieldDecorator } }) => {

  const normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  return (
    <Form {...formItemLayout}>
      <Form.Item label="Paper Title">
        {getFieldDecorator('title', {
          rules: [
            {
              required: true,
              message: 'Please input your paper title!',
            },
          ],
        })(<Input />)}
      </Form.Item>

      <Form.Item label="Paper Intro">
        {getFieldDecorator('intro', {
          rules: [
            {
              required: true,
              message: 'Please input your paper intro!',
            },
          ],
        })(<TextArea rows={8} autoSize />)}
      </Form.Item>

      <Form.Item label="Paper File" extra='only .pdf file is valid'>
        {getFieldDecorator('fileUpaload', {
          valuePropName: 'fileUpaload',
          getValueFromEvent: normFile,
          rules: [{
            required: true,
            message: 'Please upload your paper file!',
          }],
        })(
          <Upload
            name="fileUpaload"
            action="http://localhost:3232/api/paper/upload"
            accept=".pdf"
            withCredentials={true}
          >
            <Button>
              <Icon type="upload" /> Click to upload
              </Button>
          </Upload>,
        )}
      </Form.Item>
    </Form>
  )
}

const WrappedUploadForm = Form.create({ name: 'validate_other' })(UploadForm);

export default ModalForm