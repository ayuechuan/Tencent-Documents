import { BasePlugin, BasePluginOptions, RuntimeContext } from '@antv/g6'
interface BackgroundOptions extends BasePluginOptions, CSSStyleDeclaration {}

export function createPluginContainer(type: string, cover = true, style?: Partial<CSSStyleDeclaration>): HTMLElement {
  const container = document.createElement('div')

  container.setAttribute('class', `g6-${type}`)

  Object.assign(container.style, {
    position: 'absolute',
    display: 'block',
  })

  if (cover) {
    Object.assign(container.style, {
      inset: '0px',
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      pointerEvents: 'none',
    })
  }

  if (style) Object.assign(container.style, style)

  return container
}

export class Backgrounds extends BasePlugin<BackgroundOptions> {
  static defaultOptions: Partial<BackgroundOptions> = {
    backgroundSize: 'cover',
    transition: 'background 0.5s',
  }
  private $element = createPluginContainer('background')

  constructor(context: RuntimeContext, options: BackgroundOptions) {
    super(context, Object.assign({}, Backgrounds.defaultOptions, options))

    const container = this.context.canvas.getContainer()!
    container.append(this.$element)
    this.update(options)
  }

  override update(options: Partial<BackgroundOptions>) {
    super.update(options)
    Object.assign(this.$element.style, options)
  }

  override destroy(): void {
    super.destroy()
    this.$element.remove()
  }
}
