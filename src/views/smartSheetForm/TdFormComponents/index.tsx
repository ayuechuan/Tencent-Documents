import { FormButtonGroup, FormItem, Submit } from '@formily/antd-v5'
import {
  createForm,
  isForm,
  onFormInit,
  onFormMount,
  onFormReact,
  onFormUnmount,
  onFormValuesChange,
  registerValidateRules,
} from '@formily/core'
import { createSchemaField, FormProvider } from '@formily/react'
import { Input } from 'tdesign-react'

import { FormilySlider } from '../extend/formilySlider'

const form = createForm({
  validateFirst: true,
  initialValues: {
    slider: 50,
  },
  pattern: 'readPretty',
  effects(form) {
    onFormInit(() => {
      console.log('初始化表单')
    })
    onFormMount(() => {
      console.log('挂载表单')
    })
    onFormUnmount(() => {
      console.log('表单卸载')
    })
    onFormReact((form) => {
      // if(form.values){
      console.log('表单改变了', form)
      // }
    })
    onFormValuesChange(() => {
      console.log('表单改变了', isForm(form))
    })
    // form.setInitialValues({ slider: 80 });
  },
})

const SchemaField = createSchemaField({
  components: {
    FormItem,
    FormilySlider,
    Input,
  },
})

registerValidateRules({
  slider(value, rule) {
    if (!value) return ''
    if (value < 30) return '最小值不能小于30'
    if (value > 90) return '最大值不能大于90'
    return ''
  },
})

export const FormilyForm123 = () => {
  return (
    <div
      style={{
        margin: '50px',
      }}
    >
      <FormProvider form={form}>
        <SchemaField>
          <SchemaField.Void x-component={'FormItem'}>
            <SchemaField.Number
              name="slider"
              title="数字"
              x-decorator="FormItem"
              x-component="FormilySlider"
              x-pattern=""
              x-component-props={{
                min: 20,
                max: 100,
              }}
              x-validator={[{ slider: true }, { whitespace: true }]}
              x-reactions={{
                dependencies: [],
                fulfill: {
                  state: {},
                  schema: {
                    'x-pattern': '{{$deps[0]}}',
                  },
                },
              }}
            />
            <SchemaField.Object name={'nams'}></SchemaField.Object>
          </SchemaField.Void>
        </SchemaField>
        <FormButtonGroup>
          <Submit onSubmit={console.log}>提交</Submit>
        </FormButtonGroup>
      </FormProvider>
    </div>
  )
}
