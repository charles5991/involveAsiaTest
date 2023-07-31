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
import { Select } from 'antd'
const { Option } = Select

const App = () => {
  const descriptionMaxLength = 200
  const [isHoveringEnter, setIsHoveringEnter] = useState(false)
  const [isSpecialGroup, setIsSpecialGroup] = useState(false)
  const formRef = useRef<FormInstance>() // Use FormInstance type for formRef
  const [selectedParameter, setSelectedParameter] = useState<
    string | undefined
  >(undefined)
  const [selectedOperator, setSelectedOperator] = useState<string | undefined>(
    undefined
  )

  const handleValuesChange = (changedValues: any) => {
    if ('checkbox-group' in changedValues) {
      // Handle the checkbox group change to update the value of SpecialGroup checkbox
      setIsSpecialGroup(
        changedValues['checkbox-group'].includes('SpecialGroup')
      )
    }
    if ('parameter' in changedValues) {
      setSelectedParameter(changedValues['parameter'])
    }
    if ('operator' in changedValues) {
      setSelectedOperator(changedValues['operator'])
    }
  }

  const handleFinish = async (values: any) => {
    const finalValues = {
      ...values,
      parameter: selectedParameter,
      operator: selectedOperator
    }
    console.log('Final form values with selected values:', finalValues)

    setSelectedParameter(undefined)
    setSelectedOperator(undefined)

    formRef.current?.resetFields()
  }

  const dummyDataForSelect1 = [
    { value: 'field1', label: 'Field 1' },
    { value: 'field2', label: 'Field 2' },
    { value: 'field3', label: 'Field 3' }
  ]

  const dummyDataForSelect2 = [
    { value: 'equal', label: 'Equal to' },
    { value: 'notEqual', label: 'Not Equal to' },
    { value: 'greaterThan', label: 'Greater Than' },
    { value: 'lessThan', label: 'Less Than' },
    { value: 'greaterThanOrEqual', label: 'Greater Than or Equal to' },
    { value: 'lessThanOrEqual', label: 'Less Than or Equal to' }
  ]

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
          valuePropName="checked"
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
          creatorRecord={{ name: '', items: [{ name: '' }, { name: '' }] }}
          initialValue={[{ name: '', items: [{ name: '' }] }]}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>If</span>
            <Select
              style={{ width: 120, marginLeft: 8 }}
              options={dummyDataForSelect1}
              placeholder="Select parameter"
              value={selectedParameter}
              onChange={(value) => setSelectedParameter(value)}
            />
            <Select
              style={{ width: 120, marginLeft: 8 }}
              options={dummyDataForSelect2}
              placeholder="Select operator"
              value={selectedOperator}
              onChange={(value) => setSelectedOperator(value)}
            />

            <ProForm.Item
              isListField
              style={{ marginBlockEnd: 0, marginLeft: 8 }}
            >
              <ProFormList
                name="items"
                creatorButtonProps={{
                  creatorButtonText: 'Add',
                  icon: false,
                  type: 'link'
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
                  width="sm"
                  name={['name']}
                  placeholder="Enter parameter"
                />
              </ProFormList>
            </ProForm.Item>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="pr-10">then revenue is</span>
            <ProFormText width="sm" name="name" placeholder="Enter Amount" />
          </div>
        </ProFormList>
      </ProForm>
    </div>
  )
}

export default App
