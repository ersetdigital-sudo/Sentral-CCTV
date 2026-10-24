import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AppShell } from '@/components/AppShell'
import { DrawerProvider } from '@/components/Drawer'
import { ModalProvider } from '@/components/Modal'
import { PrintProvider } from '@/components/PrintArea'
import { ReceiptProvider } from '@/components/Receipt'
import { ToastProvider } from '@/components/Toast'
import { StoreProvider } from '@/lib/store'
import { getAdmin } from '@/lib/supabase/server'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin()
  if (!admin) redirect('/login')

  return (
    <StoreProvider>
      <ToastProvider>
        <PrintProvider>
          <ModalProvider>
            <ReceiptProvider>
              <DrawerProvider>
                <AppShell fullName={admin.fullName} email={admin.user.email ?? ''}>
                  {children}
                </AppShell>
              </DrawerProvider>
            </ReceiptProvider>
          </ModalProvider>
        </PrintProvider>
      </ToastProvider>
    </StoreProvider>
  )
}
