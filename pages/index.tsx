import * as React from 'react';
import {NextPage} from 'next';
import Layout from '../components/layout';


const Home: NextPage = () => {
  const title = 'NextJS Shopify App';
  return (
    <Layout title={title}>
      <p>Welcome to the shopify app</p>
    </Layout>
  );
}

export default Home;
