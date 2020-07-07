import React from 'react'
import ReactDOM from 'react-dom'
import { getRandomString } from '@/utils/getRandomString'
import store from '@/store/_store'
import { Provider } from 'react-redux'

export const registeredComponents = new Map<
  string,
  {
    mount: () => void
    unmount: () => Promise<unknown>
    container: HTMLElement
  }
>()

/**
 * Aims to stick React-Components to Angular UIs, automatically
 */
export const registerReactComponent = <
  Component extends React.FC<Parameters<Component>[0]>
>(options: {
  /**
   * required, the component to ReactDOM.render()
   *
   * Do NOT pass <Provider store={store} />, this function will do it.
   *
   * @example
   *  component: (
   *    <ExecutionDialogStatusInfo />
   *  )
   */
  component: JSX.Element
  /** e.g. `'umjisp19neq' or 'SomeComponentUniqueId'` */
  containerId: string
  /** defaults `'span'`, the container element tag that for ReactDOM.render(). */
  containerTag?: string
  /**
   * @example
   *  // ReactDOM.render(component, document.querySelector(`#{containerElement.id}`))
   *
   *  containerConstructor((containerElement) => {
   *    jQuery(containerElement).addClass('colorful').insertAfter('body')
   *  })
   */
  containerConstructor: (
    /** The container is React Root, which is ReactDOM.render were to render */
    containerElement: Element,
    props: {
      componentProps: Parameters<Component>[0]
    },
  ) => void
  disabled?: () => boolean
}) => {
  const containerTag = options.containerTag || 'span'
  const newContainerElement = $(`<${containerTag}>`)

  const checkContainerExists = () =>
    options.containerId ? $(`#${options.containerId}`).length > 0 : false

  const existsContainerElement = $(`#${options.containerId}`)

  const targetContainerElement =
    existsContainerElement?.get(0) || newContainerElement.get(0)

  const containerId = options.containerId || getRandomString()

  const registerComponent = registeredComponents.get(containerId)

  if (registerComponent) {
    return registerComponent
  }

  newContainerElement.attr('id', `${containerId}`)

  const checkDisabled = () => options.disabled?.() ?? false

  const unmount = () => {
    // setTimeout to avoid errors which the polyfills-es5.js on etoro
    return new Promise((resolve, reject) => {
      globalThis.setTimeout(() => {
        if (targetContainerElement) {
          ReactDOM.unmountComponentAtNode(targetContainerElement)
        }

        resolve()
      })
    })
  }

  unmount.displayName = `unmount${containerId}`

  const mount = () => {
    if (checkContainerExists() === false && checkDisabled() === false) {
      options.containerConstructor(targetContainerElement, {
        componentProps: options.component.props,
      })
    }

    if (checkContainerExists() === true && checkDisabled() === false) {
      ReactDOM.render(
        <Provider store={store}>{options.component}</Provider>,
        targetContainerElement,
      )
    }
  }

  mount.displayName = `mount${containerId}`

  registeredComponents.set(containerId, {
    mount,
    unmount,
    container: targetContainerElement,
  })

  return registeredComponents.get(containerId) as NonNullable<
    ReturnType<typeof registeredComponents['get']>
  >
}