
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { createURL } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

function TimeZoneDropDownMenuItem({searchParams}:{
    searchParams:Record<string, string>
}) {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return (
    <DropdownMenuItem asChild>
        <Link href={createURL("/dashboard/analytics", searchParams,{
            timezone:userTimeZone,
        })}>{userTimeZone}</Link>
    </DropdownMenuItem>
  )
}

export default TimeZoneDropDownMenuItem
