"use client"

import React from 'react'
import { CMSCollectionProvider } from '@/lib/contexts/cms-collection-context'
import { useParams } from 'next/navigation'

type Props = {
  children: React.ReactNode
}

export default function CollectionLayout({ children }: Props) {
  const params = useParams()
  const projectId = params.id as string
  const collectionId = params.collectionId as string

  return (
    <CMSCollectionProvider projectId={projectId} collectionId={collectionId}>
      {children}
    </CMSCollectionProvider>
  )
}
