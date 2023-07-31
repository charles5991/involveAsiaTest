import {
  ProCard,
  ProForm,
  ProFormList,
  ProFormText,
  ProFormTextArea,
  ProFormCheckbox
} from '@ant-design/pro-components'
import { Button, FormInstance, Tag, Select } from 'antd'
import React, { useState, useRef } from 'react'
import ProTable, { ProColumns } from '@ant-design/pro-table'

const { Option } = Select

interface Attribute {
  name: string
  parameter: string | undefined
  operator: string | undefined
  attributes: { name: string }[]
}
interface FormData {
  groupName: string
  groupDesc: string
  'checkbox-group': string[]
  attributes: Attribute[]
  parameter: string
  operator: string
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

const App: React.FC = () => {
  const descriptionMaxLength = 200
  const [isHoveringEnter, setIsHoveringEnter] = useState(false)
  const [isSpecialGroup, setIsSpecialGroup] = useState(false)
  const [showTable, setShowTable] = useState(false) // State variable to control table visibility
  const formRef = useRef<FormInstance>()
  const [selectedParameter, setSelectedParameter] = useState<
    string | undefined
  >(undefined)
  const [selectedOperator, setSelectedOperator] = useState<string | undefined>(
    undefined
  )
  const [formData, setFormData] = useState<FormData | null>(null)

  const [dataSource, setDataSource] = useState<Attribute[]>([])

  const handleValuesChange = (changedValues: any) => {
    if ('checkbox-group' in changedValues) {
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

  const handleFinish = async (values: FormData) => {
    setFormData(values)

    const finalValues: Attribute[] = values.attributes.map((attr: any) => ({
      name: attr.name,
      parameter: attr.parameter,
      operator: attr.operator,
      attributes: []
    }))
    console.log('Final form values with selected values:', finalValues)

    setSelectedParameter(undefined)
    setSelectedOperator(undefined)

    formRef.current?.resetFields()

    setShowTable(true)

    setDataSource(finalValues)
  }

  const columns: ProColumns<Attribute>[] = [
    {
      title: 'Rule',
      dataIndex: 'name',
      render: (_, __, index) => `Rule ${index + 1}`
    },
    {
      title: 'Parameter',
      dataIndex: 'parameter'
    },
    {
      title: 'Operator',
      dataIndex: 'operator'
    },
    {
      title: 'Attributes',
      dataIndex: 'attributes',
      render: (_, record) => (
        <ul>
          {record.attributes.map((attr, index) => (
            <li key={index}>{attr.name}</li>
          ))}
        </ul>
      )
    },
    {
      title: 'Action',
      valueType: 'option',
      render: (_, record, index, action) => [
        <a
          key="delete"
          onClick={() => {
            console.log('Delete clicked for record:', record)
          }}
        >
          Delete
        </a>
      ]
    }
  ]

  return (
    <div>
      <h1 className="font-bold py-10">Create Revenue Group</h1>
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}
      >
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
                    <Button htmlType="reset">{resetText}</Button>
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
          />
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
            creatorRecord={{ name: '', attributes: [] }}
            initialValue={[{ name: '', attributes: [] }]}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>If</span>
              <Select
                style={{ width: 120, marginLeft: 8 }}
                options={dummyDataForSelect1}
                placeholder="Select Field"
              />
              <Select
                style={{ width: 120, marginLeft: 8 }}
                options={dummyDataForSelect2}
                placeholder="Select Operator"
              />

              <ProForm.Item
                isListField
                style={{ marginBlockEnd: 0, marginLeft: 8 }}
              >
                <ProFormList
                  name="attribute-items"
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
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ flex: 1 }}>{listDom}</div>
                      {action}
                    </div>
                  )}
                >
                  <ProFormText
                    width="sm"
                    name="name"
                    placeholder="Enter Parameter"
                  />
                </ProFormList>
              </ProForm.Item>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="pr-10">then revenue is</span>
              <ProFormText
                width="sm"
                name="amount"
                placeholder="% Enter Amount"
              />
            </div>
          </ProFormList>
        </ProForm>
        {showTable && (
          <div style={{ flex: 1 }}>
            <div style={{ marginTop: '20px' }}>
              <p className="font-bold">{formData?.groupName}</p>
              <p className="font-bold">{formData?.groupDesc}</p>
              {formData?.['checkbox-group']?.includes('SpecialGroup') && (
                <Tag color="blue">SpecialGroup</Tag>
              )}
            </div>
            <ProTable<Attribute>
              columns={columns}
              dataSource={dataSource}
              search={false}
              rowKey="name"
              pagination={false}
              dateFormatter="string"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
