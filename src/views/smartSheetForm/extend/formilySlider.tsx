import { connect, mapProps, mapReadPretty } from "@formily/react";
import { ComponentProps } from "react";
import { Slider } from "tdesign-react";

export const FormilySlider = connect(
  Slider,
  mapProps({
    value: 'value'
  }),
  mapReadPretty((props: ComponentProps<typeof Slider>) => {
    return `啦啦啦${props.value}`
  })
)