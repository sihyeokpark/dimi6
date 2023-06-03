'use client'

import React from "react"
import { RecoilRoot } from "recoil"

function RecoilRootWrapper({ children }: any) {
  return (
    <RecoilRoot>
      {children}
    </RecoilRoot>
  )
}

export default RecoilRootWrapper
