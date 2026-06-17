import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import PreviewBanner from '@/components/shared/PreviewBanner'
import WhatsAppCTA from '@/components/shared/WhatsAppCTA'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PreviewBanner />
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <WhatsAppCTA />
    </>
  )
}
