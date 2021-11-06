import Head from 'next/head';

export default function Home() {
  return (
    <div className="container mx-auto my-12">
      <Head>
        <title>Wave Portal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="space-y-4 text-6xl text-center">
        <h1 className="font-bold text-gray-700">Probably nothing...</h1>
        <h2>🦄</h2>
      </div>
    </div>
  );
}
