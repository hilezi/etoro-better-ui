import * as React from 'react'
import HelperContent from '@/components/HelperContent'
import toast from 'cogo-toast'
import { exchange, getMYR, getNTD } from '@/exchange'
import { storage } from '@/storage'
import { emitter, Events } from '@/emitter'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { setExchangeSelected } from '@/actions/setExchangeSelected'
import { setMacroEnabled } from '@/actions/setMacroEnabled'
import { useInterval } from 'react-use'
import { setMacroAmount } from '@/actions/setMacroAmount'
import { i18n } from '@/i18n'

const READY_FLAG = 'etoro-better-ui-sidebar-is-ready'

export const sidebarCheckReady = () => !!$(`.${READY_FLAG}`).length

const Sidebar: React.FunctionComponent = () => {
  const settings = useAppSelector(state => state.settings)
  const dispatch = useAppDispatch()
  const [ping, setPing] = React.useState(0)

  useInterval(() => {
    const start = new Date().getTime()

    fetch('https://www.etoro.com/discover/copyportfolios').finally(() => {
      const end = new Date().getTime()
      setPing(end - start)
    })
  }, 10000)

  /**
   * etoro 左側欄樣式為動態產生名稱，沒有此變量，則無法正確呈現 CSS 樣式
   */
  const dynamicStyleClassName =
    Array.from($('.w-menu').get(0).attributes).find(value =>
      value.name.includes('_ngcontent'),
    )?.name || ''

  const attrsToAppend = { [dynamicStyleClassName]: '' }

  return (
    <span className={READY_FLAG}>
      <div {...attrsToAppend} className='i-menu-sep'>
        {i18n.腳本標題()}
      </div>

      <a
        {...attrsToAppend}
        className='i-menu-link pointer'
        target='_blank'
        href='https://www.notion.so/hilezi/4fe69cd704434ff1b82f0cd48dd219c3'
      >
        <span {...attrsToAppend} className='i-menu-icon sprite news'></span>
        {i18n.腳本官網()}
      </a>

      <a
        {...attrsToAppend}
        className='i-menu-link pointer'
        target='_blank'
        href='https://www.notion.so/hilezi/50a7f39ce9a84325a22b98acf67cffb2'
      >
        <span {...attrsToAppend} className='i-menu-icon sprite help'></span>
        {i18n.聯絡作者()}
      </a>

      <HelperContent.RiskSpecification
        aClassName={'i-menu-link'}
        attrs={attrsToAppend}
      >
        <span {...attrsToAppend} className={'i-menu-icon sprite help'}></span>
      </HelperContent.RiskSpecification>

      <span
        {...attrsToAppend}
        onClick={async () => {
          const loading = toast.loading('設定變更中...', {
            position: 'bottom-left',
          })

          const youSelected: typeof exchange['selected'] =
            settings.exchange.selected === 'NTD' ? 'MYR' : 'NTD'

          if (youSelected === 'NTD') {
            exchange.NTD = await getNTD()
          }

          if (youSelected === 'MYR') {
            exchange.MYR = await getMYR()
          }

          dispatch(setExchangeSelected(youSelected))
          storage.saveConfig({ selectedExchange: youSelected })
          emitter.emit(Events.settingChange)
          toast.success(
            i18n.設定已變更(() => <span>{youSelected}</span>),
            {
              position: 'bottom-left',
            },
          )

          loading.hide?.()
        }}
        className='i-menu-link pointer'
      >
        <span {...attrsToAppend} className='i-menu-icon sprite settings'></span>
        {i18n.設定幣別(settings.exchange.selected)}
      </span>

      <span
        {...attrsToAppend}
        onClick={() => {
          const yourEnabled = !settings.isMacroEnabled
          dispatch(setMacroEnabled(yourEnabled))
          storage.saveConfig({ executionMacroEnabled: yourEnabled })
          emitter.emit(Events.settingChange)
          toast.success(
            i18n.設定已變更(() => <span>{JSON.stringify(yourEnabled)}</span>),
            {
              position: 'bottom-left',
            },
          )
        }}
        className='i-menu-link pointer'
      >
        <span {...attrsToAppend} className='i-menu-icon sprite settings'></span>
        {i18n.下單巨集(settings.isMacroEnabled)}
      </span>

      <span
        {...attrsToAppend}
        className='i-menu-link'
        onClick={() => {
          dispatch(setMacroAmount())
        }}
      >
        <span {...attrsToAppend} className='i-menu-icon sprite settings'></span>
        {i18n.巨集金額設定()}
      </span>

      <span {...attrsToAppend} className='i-menu-link'>
        <span
          {...attrsToAppend}
          className='i-menu-icon sprite clubs-ref'
        ></span>
        {i18n.大概延遲(ping)}
      </span>
    </span>
  )
}

export default Sidebar