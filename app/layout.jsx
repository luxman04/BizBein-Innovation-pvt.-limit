import '../styles/globals.css';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import StyledJsxRegistry from './registry';
import { StoreProvider } from '../context/StoreContext';
import StoreLayout from '../components/StoreLayout';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'BizBein Innovations Pvt. Ltd. | Industrial Conveying, Coding & Packaging Equipment',
  description:
    'Official storefront of BizBein Innovations Pvt. Ltd. (BizBein Packaging). Buy Continuous Inkjet (CIJ) printers, thermal inkjet coders, modular conveyor systems, and automatic carton sealers. Factory works in Zirakpur, Punjab. Direct sales helpline: +91 99158-56540.',
  keywords: [
    'BizBein Innovations Pvt. Ltd.',
    'BizBein Packaging',
    'Industrial Conveyor Systems',
    'Continuous Inkjet Printer India',
    'CIJ Batch Coding Machine',
    'Automatic Carton Box Sealer',
    'Thermal Inkjet TIJ Coder',
    'Packaging Machinery Zirakpur Punjab',
    'Conveying Coding Packaging'
  ],
  authors: [{ name: 'BizBein Innovations Pvt. Ltd.' }],
  openGraph: {
    title: 'BizBein Innovations Pvt. Ltd. — Industrial Machinery & Spares',
    description:
      'High-performance CIJ coders, belt conveyors, carton sealers, and packaging systems. Direct factory sales and nationwide commissioning.',
    url: 'https://www.bizbein.com/',
    siteName: 'BizBein Innovations Pvt. Ltd.',
    locale: 'en_IN',
    type: 'website'
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#2B3353'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/bizbein-innovations-logo.png" />
      </head>
      <body suppressHydrationWarning>
        <StyledJsxRegistry>
          <StoreProvider>
            <StoreLayout>{children}</StoreLayout>
          </StoreProvider>
        </StyledJsxRegistry>
      </body>
    </html>
  );
}

