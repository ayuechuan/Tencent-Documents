import {
  ArrayItems,
  DatePicker,
  Editable,
  FormButtonGroup,
  FormItem,
  Input,
  Select,
  Space,
  Submit,
} from '@formily/antd-v5'
import { createForm, GeneralField } from '@formily/core'
import { createSchemaField, FormProvider, SchemaReactions } from '@formily/react'
import dayjs from 'dayjs'
import React from 'react'

const SchemaField = createSchemaField({
  components: {
    FormItem,
    DatePicker,
    Editable,
    Space,
    Input,
    Select,
    ArrayItems,
  },
})

const form = createForm()

export const Items = () => {
  return (
    <FormProvider form={form}>
      <SchemaField>
        {/* <SchemaField.Array
          name="string_array"
          title="字符串数组"
          x-decorator="FormItem"
          x-component="ArrayItems"
        >
          <SchemaField.Void
            x-component="Space"
            x-component-props={{
              direction: 'horizontal',
            }}
          >
            <SchemaField.Void
              x-decorator="FormItem"
              x-component="ArrayItems.SortHandle"
            />
            <SchemaField.String
              x-decorator="FormItem"
              required
              name="input"
              x-component="Input"
            />
            <SchemaField.Void
              x-decorator="FormItem"
              x-component="ArrayItems.Remove"
            />
          </SchemaField.Void>
          <SchemaField.Void
            x-component="ArrayItems.Addition"
            title="添加条目"
          />
        </SchemaField.Array>
        <SchemaField.Array
          name="array"
          title="对象数组"
          x-decorator="FormItem"
          x-component="ArrayItems"
        >
          <SchemaField.Object>
            <SchemaField.Void x-component="Space">
              <SchemaField.Void
                x-decorator="FormItem"
                x-component="ArrayItems.SortHandle"
              />
              <SchemaField.Array
                x-decorator="FormItem"
                required
                title="日期1"
                name="date"
                x-component="DatePicker.RangePicker"
                x-component-props={{
                  style: {
                    width: 160,
                  },
                }}
              />
              <SchemaField.String
                x-decorator="FormItem"
                required
                title="输入框"  
                name="input"
                x-component="Input"
              />
              <SchemaField.String
                x-decorator="FormItem"
                required
                title="选择框"
                name="select"
                enum={[
                  { label: '选项1', value: 1 },
                  { label: '选项2', value: 2 },
                ]}
                x-component="Select"
                x-component-props={{
                  style: {
                    width: 160,
                  },
                }}
              />
              <SchemaField.Void
                x-decorator="FormItem"
                x-component="ArrayItems.Remove"
              />
            </SchemaField.Void>
          </SchemaField.Object>
          <SchemaField.Void
            x-component="ArrayItems.Addition"
            title="添加条目"
          />
        </SchemaField.Array> */}
        <SchemaField.Array
          name="array2"
          title="对象数组"
          x-decorator="FormItem"
          x-component="ArrayItems"
          x-component-props={{ style: { width: 300 } }}
          key={123}
        >
          <SchemaField.Object x-decorator="ArrayItems.Item">
            <SchemaField.Void
              // x-decorator="FormItem"
              x-component="ArrayItems.SortHandle"
              x-component-props={{
                style: {
                  cursor: 'move',
                },
              }}
            />
            <SchemaField.String
              x-decorator="Editable"
              title="输入框"
              name="input"
              x-component="Input"
              x-decorator-props={{}}
              x-component-props={{ bordered: false, defaultValue: '啦啦啦啦' }}
            />
            <SchemaField.Object
              name="config"
              x-component="Editable.Popover"
              required
              title="配置复杂数据"
              x-reactions={{
                dependencies: [],
                fulfill: {
                  state: {
                    title: '{{$self.value?.input || $self.title}}',
                  },
                },
              }}
              // x-reactions={(field: GeneralField & { value: any }) => {
              //   // field.title = field.value?.input || field.title
              //   return {
              //     de
              //   }
              // }}
            >
              {/* <SchemaField.Array
                x-decorator="FormItem"
                required
                title="日期"
                name="date"
                x-component="DatePicker.RangePicker"
                x-component-props={{
                  style: { width: '100%' },
                  picker: 'year',
                  id: {},
                  defaultPickerValue: dayjs('2015-01-01', 'YYYY-MM-DD')
                }}
              /> */}
              <SchemaField.String x-decorator="FormItem" required title="输入框" name="input" x-component="Input" />
            </SchemaField.Object>
            <SchemaField.Void
              // x-decorator="FormItem"
              x-component="ArrayItems.Remove"
            />
          </SchemaField.Object>
          <SchemaField.Void x-component="ArrayItems.Addition" title="添加条目" />
        </SchemaField.Array>
      </SchemaField>
      <FormButtonGroup>
        <Submit onSubmit={console.log}>提交</Submit>
      </FormButtonGroup>
    </FormProvider>
  )
}
