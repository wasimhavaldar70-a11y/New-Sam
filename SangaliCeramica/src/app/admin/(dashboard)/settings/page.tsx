import { getSettings } from '@/services/api'
import SettingsClient from './SettingsClient'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const settings = await getSettings()
  return <SettingsClient initialSettings={settings} />
}
