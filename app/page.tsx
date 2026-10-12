'use client'

import dynamic from 'next/dynamic'
import { ProgressBar } from '@fluentui/react-components'

const StudyFlow = dynamic(
  () => import('@/components/studyflow').then((mod) => mod.StudyFlow),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <ProgressBar style={{ maxWidth: '300px', width: '100%' }} />
      </div>
    ),
  }
)

export default function Home() {
  return <StudyFlow />
}
