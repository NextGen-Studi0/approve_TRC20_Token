import type { AppProps } from 'next/app';
import Head from 'next/head';

import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Approve TRC-20 Token</title>
        <meta
          name="description"
          content="Generate QR codes for TRC-20 approve transactions and run guided demos"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
