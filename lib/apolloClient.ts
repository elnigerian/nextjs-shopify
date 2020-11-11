import * as React from 'react';
import {ApolloClient, ApolloLink, HttpLink, InMemoryCache} from '@apollo/client';
import {isServer} from './isServer';

// const SHOPIFY_SERVER_URI = 'https://graphql.myshopify.com/api/graphql';
// const SHOPIFY_STOREFRONT_TOKEN = 'dd4d4dc146542ba7763305d71d1b3d38';

let apolloClient: any


function createApolloClient() {
    const httpLink = new HttpLink({
        uri: 'https://graphql.myshopify.com/api/graphql',
        headers: {
            'X-Shopify-Storefront-Access-Token': 'dd4d4dc146542ba7763305d71d1b3d38',
        }
    })
    return new ApolloClient({
        ssrMode: isServer(),
        link: ApolloLink.from([httpLink]),
        cache: new InMemoryCache(),
    })
}

export function initializeApollo(initialState: any = null) {
    const _apolloClient = apolloClient ?? createApolloClient()

    // If your page has Next.js data fetching methods that use Apollo Client, the initial state
    // get hydrated here
    if (initialState) {
        _apolloClient.cache.restore(initialState)
    }
    // For SSG and SSR always create a new Apollo Client
    if (isServer()) return _apolloClient
    // Create the Apollo Client once in the client
    if (!apolloClient) apolloClient = _apolloClient

    return _apolloClient
}

export function useApollo(initialState) {
    return React.useMemo(() => initializeApollo(initialState), [initialState])
}
