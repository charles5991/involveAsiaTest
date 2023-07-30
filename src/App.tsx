import {
  ProCard,
  ProForm,
  ProFormList,
  ProFormText,
  ProFormTextArea,
  ProFormCheckbox
} from '@ant-design/pro-components'
import { Button, FormInstance } from 'antd'
import React, { useState, useRef } from 'react'

const App = () => {
  const descriptionMaxLength = 200
  const [isHoveringEnter, setIsHoveringEnter] = useState(false)
  const [isSpecialGroup, setIsSpecialGroup] = useState(false)
  const formRef = useRef<FormInstance>() // Use FormInstance type for formRef

  const handleFinish = async (values: any) => {
    console.log('Form values:', values)
    formRef.current?.resetFields() // Reset the form fields after console log
  }

  const handleValuesChange = (changedValues: any) => {
    if ('checkbox-group' in changedValues) {
      // Handle the checkbox group change to update the value of SpecialGroup checkbox
      setIsSpecialGroup(
        changedValues['checkbox-group'].includes('SpecialGroup')
      )
    }
  }

  return (
    <div>
      <h1 className="font-bold py-10 ">Create Revenue Group</h1>
      <ProForm
        layout="vertical"
        onFinish={handleFinish}
        onValuesChange={handleValuesChange}
        initialValues={{
          'checkbox-group': isSpecialGroup ? ['SpecialGroup'] : []
        }}
        formRef={formRef}
        submitter={{
          render: (props) => {
            const submitText = 'Submit'
            const resetText = 'Reset'

            return (
              <div>
                <div style={{ textAlign: 'right' }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className={isHoveringEnter ? 'hover-effect' : ''}
                    onMouseEnter={() => setIsHoveringEnter(true)}
                    onMouseLeave={() => setIsHoveringEnter(false)}
                    style={{
                      marginRight: 8,
                      backgroundColor: '#1620ff',
                      ...(isHoveringEnter && { backgroundColor: '#1676ff' })
                    }}
                  >
                    {submitText}
                  </Button>
                  <Button htmlType="reset">Reset</Button>
                </div>
              </div>
            )
          }
        }}
      >
        <ProFormText
          style={{ padding: 0 }}
          width="md"
          name="groupName"
          label="Group Name"
          placeholder="Please Enter Group Name"
        />{' '}
        <ProFormTextArea
          style={{ padding: 0 }}
          width="md"
          name="groupDesc"
          label="Group Description"
          placeholder="Please Enter Group Description"
          rules={[
            {
              max: descriptionMaxLength,
              message: `Group Description cannot exceed ${descriptionMaxLength} characters.`
            }
          ]}
        />
        <ProFormCheckbox.Group
          name="checkbox-group"
          options={['SpecialGroup']}
          valuePropName="checked" // Custom prop name for the checkbox value
        />
        <ProFormList
          name="attributes"
          label="Rule"
          creatorButtonProps={{
            creatorButtonText: 'Add Rule'
          }}
          min={1}
          copyIconProps={false}
          itemRender={({ listDom, action }, { index }) => (
            <ProCard
              bordered
              style={{ marginBlockEnd: 8 }}
              title={`Rule ${index + 1}`}
              extra={action}
              bodyStyle={{ paddingBlockEnd: 0 }}
            >
              {listDom}
            </ProCard>
          )}
          creatorRecord={{ name: '', items: [{ name: '' }] }}
          initialValue={[{ name: '', items: [{ name: '' }] }]}
        >
          <ProForm.Item isListField style={{ marginBlockEnd: 0 }}>
            <ProFormList
              name="items"
              creatorButtonProps={{
                creatorButtonText: 'Add',
                icon: false,
                type: 'link',
                style: { width: 'unset' }
              }}
              min={1}
              copyIconProps={false}
              deleteIconProps={{ tooltipText: 'Delete' }}
              itemRender={({ listDom, action }) => (
                <div
                  style={{
                    display: 'flex', // Use 'flex' layout to align the delete icon
                    alignItems: 'center' // Center the delete icon vertically
                  }}
                >
                  <div style={{ flex: 1 }}>{listDom}</div>{' '}
                  {/* Display the list item */}
                  {action} {/* Display the delete icon */}
                </div>
              )}
            >
              <ProFormText
                allowClear={false}
                width="xs"
                name={['name']}
                placeholder="Enter parameter"
              />
            </ProFormList>
          </ProForm.Item>
        </ProFormList>
        <ProFormText
          style={{ padding: 0 }}
          width="md"
          name="name"
          label="then revenue is"
          placeholder="Enter Amount"
        />
      </ProForm>
    </div>
  )
}

export default App
