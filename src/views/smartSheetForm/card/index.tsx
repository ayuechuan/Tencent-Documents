import React from 'react'
import { createForm } from '@formily/core'
import { createSchemaField, FormProvider } from '@formily/react'
import { ArrayCards, Form, FormItem, Input, FormButtonGroup, Submit } from '@formily/antd-v5'

const form = createForm({
  validateFirst: true,
})

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    ArrayCards
  },
})

export function CardItems() {
  return (
    <FormProvider form={form}>
      <SchemaField>
        <SchemaField.Array
          name={'string_cards'}
          x-decorator={'FormItem'}
          x-component={'ArrayCards'}
          x-component-props={{
            title: '数组类型'
          }}
        >
          <SchemaField.Object>
            <SchemaField.Void x-component={'ArrayCards.Index'}></SchemaField.Void>
            <SchemaField.String
              name={'input'}
              x-decorator={'FormItem'}
              x-component={'Input'}
              x-component-props={{
                placeholder: '测试数据'
              }}
              title={'input'}
            />
            <SchemaField.Void  x-component={'ArrayCards.Remove'}></SchemaField.Void>
            <SchemaField.Void  x-component={'ArrayCards.MoveUp'}></SchemaField.Void>
            <SchemaField.Void  x-component={'ArrayCards.MoveDown'}></SchemaField.Void>
          </SchemaField.Object>
          <SchemaField.Void
              x-component={'ArrayCards.Addition'}
              title={'添加条目'}
            ></SchemaField.Void>
        </SchemaField.Array>
      </SchemaField>
      <FormButtonGroup>
        <Submit onSubmit={console.log}>提交</Submit>
      </FormButtonGroup>
    </FormProvider>
  )
}
