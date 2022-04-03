import React, { useState, useEffect, useRef, useCallback } from "react";
import { Rnd } from "react-rnd";
import "antd/dist/antd.css";
import { Input, Modal, Button, Form, Switch, Space } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
const { TextArea } = Input;

const noteStyle = {
  border: "solid 1px #0000ff",
  background: "#0000ff",
  padding: "0px" ,
  overflow: "hidden"
};

const titleStyle = {
  width: "100%", 
  background: "#0000ff", 
  color: "#ffffff", 
  border: "0", 
  fontSize: "1.3em", 
  padding: "4px", 
  paddingLeft: "8px"
}

const titleStyleArchived = {
  width: "100%", 
  background: "#aaaaff", 
  color: "#555555", 
  border: "0", 
  fontSize: "1.3em", 
  padding: "4px", 
  paddingLeft: "8px",
  textDecoration: "line-through"
}

const textStyle = {
  width: "100%", 
  height: "100%", 
  fontSize: "1.15em", 
  backgroundColor: "#ffff00", 
  padding: "8px", 
  border: "0"
}

const textStyleArchived = {
  width: "100%", 
  height: "100%", 
  fontSize: "1.15em", 
  backgroundColor: "#ffffdd", 
  color: "#777777",
  padding: "8px", 
  border: "0"
}

const settingsButtonStyle = {
  backgroundColor: "#0000ff", 
  border: "#0000ff"
}

const settingsButtonStyleArchived = {
  backgroundColor: "#aaaaff", 
  border: "#aaaaff"
}

const defaultBox = {
  x: 50,
  y: 50,
  width: 150,
  height: 150
}

export const Note = ({ note, view, allViews }) => {
  const [isEditingText, setIsEditingText] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const showModal = () => {setIsModalVisible(true)};

  const updateTitle = (evt) => {
    if (isEditingTitle) return;
    setIsEditingTitle(true);
    setTimeout(function () {
      setIsEditingTitle(false);
      Meteor.call('notes.setTitle', note._id, evt.target.value);      
    }, 1000);
  };

  const updateText = (evt) => {
    if (isEditingText) return;
    setIsEditingText(true);
    setTimeout(function () {
      setIsEditingText(false);
      Meteor.call('notes.setText', note._id, evt.target.value);      
    }, 1000);
  };

  const toggleChecked = () => {
    Meteor.call('notes.setIsChecked', note._id, !note.isChecked)
  };

  const deleteNote = () => {
    Meteor.call('notes.remove', note._id);
  }

  const updatePosition = (e, d, ref, delta, position) => {
    Meteor.call('notes.setViewPosition', note._id, view, {
      x: d.x, y: d.y, 
      width: parseInt(d.node.style.width), height: parseInt(d.node.style.height)
    });
  }

  const updateSize = (e, direction, ref, delta, position) => {
    Meteor.call('notes.setViewPosition', note._id, view, {
      x: position.x, y: position.y, 
      width: parseInt(ref.style.width), height: parseInt(ref.style.height)
    });
  }

  const onModifyView = (view, value) => {
    Meteor.call('notes.editView', note._id, view, value);
  };

  const onModifyViews = useCallback((values) => {
    Meteor.call('notes.editViews', note._id, values);
    form.resetFields();
    setIsModalVisible(false);
  }, [form]);

  const closePopup = useCallback(() => {
    form.resetFields();
    setIsModalVisible(false);
  }, [form]);

  const box = note.views[view]; //((note.views && note.views[view]) ? note.views[view] : undefined);  
  const deleteButtonStyle = note.isChecked ? {background: 'red'} : {display: 'none', visibility: 'hidden', background: 'red'};

  return (
    <div>
      <Rnd
        style={noteStyle}
        position={{x: box.x, y: box.y}}
        size={{width: box.width, height: box.height}}  
        onDragStop={updatePosition}
        onResizeStop={updateSize}
      >
        <TextArea
          style={note.isChecked ? titleStyleArchived : titleStyle}
          rows={1}
          onChange={updateTitle}
          defaultValue={note.title}
        />
        <div style={{position:"absolute", top:"0", right:"0" }}>
          <Button type="primary" style={note.isChecked ? settingsButtonStyleArchived : settingsButtonStyle} onClick={showModal} icon={<SettingOutlined />} />
          <Modal
            title={note.title}
            visible={isModalVisible}
            onOk={form.submit}
            onCancel={closePopup}
            footer={[
              <Button key="submitTags" type="primary"
                onClick={form.submit}>
                Modify tags
              </Button>,
              <Button key="submitArchive" type="primary"  
                onClick={toggleChecked}>
                {note.isChecked ? <>Unarchive</> : <>Archive</>}
              </Button>,
              <Button key="submitDelete" style={deleteButtonStyle} type="primary" onClick={deleteNote}>
                Delete
              </Button>
            ]}>
              <Form form={form} onFinish={(values) => onModifyViews(values)} requiredMark={'optional'}> 
                <Space wrap={true}>
                  {allViews ? allViews.map(v => (
                    <Form.Item key={v.name} name={v.name} valuePropName="checked" initialValue={((note.views && note.views[v.name]) ? 1 : 0 )}>
                      <Switch checkedChildren={v.name} unCheckedChildren={v.name} />
                    </Form.Item>)) : (<></>) }                      
                    {/* <Switch key={v.name} checkedChildren={v.name} unCheckedChildren={v.name} checked={(note.views && note.views[v.name])} onChange={(value) => { onModifyView(v.name, value)}} /> */}
                  {/* )) : (<></>) } */}
                </Space>
              </Form> 
          </Modal>
        </div>        
        <TextArea
          style={note.isChecked ? textStyleArchived : textStyle}
          onChange={updateText}
          defaultValue={note.text}
        />     
      </Rnd>
    </div> 
  )
};
