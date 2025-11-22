import React from 'react'

type Props = {
    children: React.ReactNode;
}

export default function CMSLayout({ children }: Props) {
    return (
        <>{children}</>
    )
}