import * as React from 'react';
import {useApollo} from '../lib/apolloClient';
import {ApolloProvider} from '@apollo/client';

const StoreFrontApp = ({ Component, pageProps }: any) => {
  // set the context on authentication and order state here
  const apolloClient = useApollo(pageProps.initialApolloState)
  return (
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
  );
};

export default StoreFrontApp;
