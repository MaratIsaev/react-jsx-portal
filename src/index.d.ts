import { FC } from 'react'

type Props = Record<string, unknown>

type Id = string

type ContentNode = {
  Component: FC;
  key: string;
  __meta?: unknown
}

declare const Anchor: FC<Props & { __renderPolicy: (arr: ContentNode[]) => ContentNode[], id: Id }>

declare const Portal: FC<{ __meta?: Record<string, unknown>, id: Id, render: FC}>