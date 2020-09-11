import { Button, Grid } from '@material-ui/core'
import React from 'react'
import { angularAPI } from '~/angularAPI'
import { KeyProbe } from '~/components/KeyProbe'
import { PrimaryTrans } from '~/components/PrimaryTrans'

export const ExecutionDialogSLTPButtonsGrid: React.FC<any> = props => {
  return (
    <Grid container direction='column' style={{ marginTop: 4 }}>
      <Grid item style={{ marginBottom: 4 }}>
        <Button
          variant='outlined'
          onClick={() => {
            angularAPI.toggleDialogStopLossInfinite()
          }}
        >
          <PrimaryTrans i18nKey='profits_toggleSL_text'></PrimaryTrans>
          <KeyProbe
            filter='Q'
            command={() => {
              angularAPI.toggleDialogStopLossInfinite()
            }}
          ></KeyProbe>
        </Button>
      </Grid>

      <Grid item style={{ marginBottom: 4 }}>
        <Button
          variant='outlined'
          onClick={() => {
            angularAPI.toggleDialogTakeProfitInfinite()
          }}
        >
          <PrimaryTrans i18nKey='profits_toggleTP_text'></PrimaryTrans>
          <KeyProbe
            filter='E'
            command={() => {
              angularAPI.toggleDialogTakeProfitInfinite()
            }}
          ></KeyProbe>
        </Button>
      </Grid>
    </Grid>
  )
}