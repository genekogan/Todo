import { Meteor } from 'meteor/meteor';
import React, { useCallback, useState } from 'react';
import { Modal, Form, Input, Button, Radio, Switch, Space } from 'antd';
import 'antd/dist/antd.css';


export const NoteForm = ({views}) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {setIsModalVisible(true)};

  const onSubmitNote = useCallback((values) => {
    noteTitle = values['noteTitle'];
    delete values['noteTitle']; 
    let noViews = Object.values(values).indexOf(true) == -1;
    if (noViews) {
      console.log("No views selected!")
    } else {
      Meteor.call('notes.insert', noteTitle, '', values);
      form.resetFields();
      setIsModalVisible(false);
    }
  }, [form]);

  const closePopup = useCallback(() => {
    form.resetFields();
    setIsModalVisible(false);
  }, [form]);
  
  return (
    <>
      <Button type="primary" onClick={showModal} style={{margin:"10px", float: "right"}} >
        Add Note
      </Button>
      <Modal
        title="Add new note"
        visible={isModalVisible}
        onOk={form.submit}
        onCancel={closePopup}
        footer={[
          <Button key="submit" type="primary" onClick={form.submit}>
            Add Note
          </Button>
        ]}>
        <Form form={form} onFinish={(values) => onSubmitNote(values)} requiredMark={'optional'}> 
          <Form.Item name="noteTitle" label="Note title" rules={[{required: true}]} >
            <Input />
          </Form.Item>
          <Space wrap={true}>
            {views ? views.map(v => (
              <Form.Item key={v.name} name={v.name} valuePropName="checked" initialValue={false}>
                <Switch checkedChildren={v.name} unCheckedChildren={v.name} />
              </Form.Item>)) : (<></>) }
          </Space>
        </Form>
      </Modal>
    </>
  )
}

export const ViewForm = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {setIsModalVisible(true)};

  const onSubmitNote = useCallback((values) => {
    Meteor.call('views.insert', values.viewName, '');
    form.resetFields();
    setIsModalVisible(false);
  }, [form]);

  const closePopup = useCallback(() => {
    form.resetFields();
    setIsModalVisible(false);
  }, [form]);
  
  return (
    <>
      <Button type="primary" onClick={showModal} style={{margin:"10px", float: "right"}} >
        Add View
      </Button>
      <Modal
        title="Add new view"
        visible={isModalVisible}
        onOk={form.submit}
        onCancel={closePopup}
        footer={[
          <Button key="submit" type="primary" 
            onClick={form.submit}>
            Add View
          </Button>
        ]}
      >
        <Form form={form} onFinish={(values) => onSubmitNote(values)} requiredMark={'optional'}> 
          <Form.Item name="viewName" label="View name" rules={[{required: true}]} >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}


export const ViewSelector = ({views, activeView, onViewSelect}) => {
  const options = views ? views.map(v => ({label: v.name, value: v.name})) : [];
  return (
    <Radio.Group buttonStyle="solid">
      <Space wrap={true} >
        {options ? options.map(o => (
          <Radio.Button 
            key={o.label}
            checked={o.label == activeView}
            buttonStyle="solid"
            value={o.label}
            onClick={(e) => onViewSelect(e.target.value)}
            style={{margin:"0px"}}
          >{o.label}</Radio.Button>  
        )) : (<></>)}
        <Space style={{paddingLeft:"20px"}}>
          <ViewForm />
          <NoteForm views={views} />
        </Space>
      </Space>
    </Radio.Group>
  );
}


export const Toolbar = ({views, activeView, onViewSelect}) => {
  return (
    <div style={{margin:"10px"}}>
      <ViewSelector views={views} activeView={activeView} onViewSelect={onViewSelect} />
    </div>
  )
};