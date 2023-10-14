# GraphQL queries in Next.js 13 with CodeGen

This guide will walk you through the steps to use graphql in Next.JS 13 using CodeGen

1. Create a next app.

   ```
   npx create-next-app@latest
   ```

2. We are going to use graphql api created by space x. The said api is assessable at `https://main--spacex-l4uc6p.apollographos.net/graphql`

3. Install apollo client in the app. As the stable version of apollo client don't support server components so we are going with the experimental packages

   ```cmd
   npm install @apollo/client@rc
   npm install @apollo/experimental-nextjs-app-support
   ```

4. Install dependencies to use GraphQL Code Generator

   ```cmd
   npm install -D ts-node
   npm install -D @graphql-codegen/cli
   npm install -D @graphql-codegen/client-preset
   npm i -D @parcel/watcher
   ```

5. Create `codegen.ts` to define configurations for GraphQL Code Generator

   ```ts
   import { CodegenConfig } from "@graphql-codegen/cli";
   const config: CodegenConfig = {
     schema: "https://main--spacex-l4uc6p.apollographos.net/graphql",
     documents: ["src/**/*.tsx", "src/**/*.ts"],
     ignoreNoDocuments: true, // for better experience with the watcher
     generates: {
       "./src/lib/gql/": {
         preset: "client",
       },
     },
   };
   export default config;
   ```

6. Update `package.json` and add script to run codegen

   ```json
   "codegen": "graphql-codegen --config codegen.ts"
   ```

7. Run `npm run codegen` to create code from schema

8. Create `src/lib/client.tsx` to define a function that allows to get the Apollo Client every time we need it

   ```tsx
   import { HttpLink } from "@apollo/client";
   import {
     NextSSRInMemoryCache,
     NextSSRApolloClient,
   } from "@apollo/experimental-nextjs-app-support/ssr";
   import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";

   export const { getClient } = registerApolloClient(() => {
     return new NextSSRApolloClient({
       cache: new NextSSRInMemoryCache(),
       link: new HttpLink({
         uri: "https://main--spacex-l4uc6p.apollographos.net/graphql",
       }),
     });
   });
   ```

9. Create `src/lib/queries.ts` to define queries

   ```tsx
   import { graphql } from "./gql";
   export const companyQuery = graphql(/* GraphQL */ `
     query Company {
       company {
         ceo
         coo
         cto
         cto_propulsion
         employees
         founded
         founder
         headquarters {
           address
           city
           state
         }
         launch_sites
         links {
           elon_twitter
           flickr
           twitter
           website
         }
         name
         summary
         test_sites
         valuation
         vehicles
       }
     }
   `);
   ```

10. Run `npm run codegen` to create code from defined query. Need to do this every time any changes to the queries is made.

11. Create `src/components/CompanyInfo.tsx` to define a component to consume data fetched from the api

    ```tsx
    import { CompanyQuery } from "@/lib/gql/graphql";
    import Link from "next/link";
    import React from "react";
    interface Props {
      data: CompanyQuery;
    }
    export const CompanyInfo: React.FC<Props> = ({ data }) => {
      return (
        <div className="p-4 max-w-xl mx-auto bg-white rounded-lg shadow-lg text-gray-700">
          <h1 className="text-2xl font-semibold mb-4">SpaceX Information</h1>
          <p>
            <strong>Name:</strong> {data?.company?.name}
          </p>
          <p>
            <strong>CEO:</strong> {data?.company?.ceo}
          </p>
          <p>
            <strong>COO:</strong> {data?.company?.coo}
          </p>
          <p>
            <strong>Founded:</strong> {data?.company?.founded}
          </p>
          <p>
            <strong>Employees:</strong> {data?.company?.employees}
          </p>
          <p>
            <strong>Headquarters:</strong>{" "}
            {data?.company?.headquarters?.address},{" "}
            {data?.company?.headquarters?.city},{" "}
            {data?.company?.headquarters?.state}
          </p>
          <p>
            <strong>Summary:</strong> {data?.company?.summary}
          </p>
          <p>
            <strong>Valuation:</strong> ${data?.company?.valuation}
          </p>
          <p>
            <strong>Number of Launch Sites:</strong>{" "}
            {data?.company?.launch_sites}
          </p>
          <p>
            <strong>Number of Test Sites:</strong> {data?.company?.test_sites}
          </p>
          <p>
            <strong>Number of Vehicles:</strong> {data?.company?.vehicles}
          </p>
          <p>
            <strong>Links:</strong>
          </p>
          <ul>
            <li>
              <Link
                href={data?.company?.links?.elon_twitter || ""}
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Elon Musk&#39;s Twitter
              </Link>
            </li>
            <li>
              <Link
                href={data?.company?.links?.flickr || ""}
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                SpaceX Flickr
              </Link>
            </li>
            <li>
              <Link
                href={data?.company?.links?.twitter || ""}
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                SpaceX Twitter
              </Link>
            </li>
            <li>
              <Link
                href={data?.company?.links?.website || ""}
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                SpaceX Website
              </Link>
            </li>
          </ul>
        </div>
      );
    };
    ```

12. Create `src/components/ServerCache.tsx` to define a server component which fetches data and caches it on the build time

    ```tsx
    import { getClient } from "@/lib/client";
    import { CompanyInfo } from "./CompanyInfo";
    import { companyQuery as query } from "@/lib/queries";
    export default async function ServerCache() {
      const { data, loading, error } = await getClient().query({ query });
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :</p>;
      return <CompanyInfo data={data} />;
    }
    ```

13. We have used gql queries in client components. For using same queries in the client component we need to use a provider to pass the client. Create `src/lib/apollo-provider.tsx`.

    ```tsx
    "use client";
    import { ApolloLink, HttpLink } from "@apollo/client";
    import {
      NextSSRApolloClient,
      ApolloNextAppProvider,
      NextSSRInMemoryCache,
      SSRMultipartLink,
    } from "@apollo/experimental-nextjs-app-support/ssr";
    function makeClient() {
      const httpLink = new HttpLink({
        uri: "https://main--spacex-l4uc6p.apollographos.net/graphql",
      });
      return new NextSSRApolloClient({
        cache: new NextSSRInMemoryCache(),
        link:
          typeof window === "undefined"
            ? ApolloLink.from([
                new SSRMultipartLink({
                  stripDefer: true,
                }),
                httpLink,
              ])
            : httpLink,
      });
    }
    export function ApolloWrapper({ children }: React.PropsWithChildren) {
      return (
        <ApolloNextAppProvider makeClient={makeClient}>
          {children}
        </ApolloNextAppProvider>
      );
    }
    ```

14. Update src/app/layout.tsx to wrap the app with apollo provider

    ```tsx
    import { ApolloWrapper } from "@/lib/apollo-provider";
    import "./globals.css";
    import type { Metadata } from "next";
    import { Inter } from "next/font/google";
    const inter = Inter({ subsets: ["latin"] });
    export const metadata: Metadata = {
      title: "Create Next App",
      description: "Generated by create next app",
    };
    export default function RootLayout({
      children,
    }: {
      children: React.ReactNode;
    }) {
      return (
        <html lang="en">
          <body className={inter.className}>
            <ApolloWrapper>{children}</ApolloWrapper>
          </body>
        </html>
      );
    }
    ```

15. Create `src/components/ClientCache.tsx` to define a client component with cache enabled

    ```tsx
    "use client";
    import { CompanyInfo } from "./CompanyInfo";
    import { companyInfo as query } from "@/lib/queries";
    import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
    import { Suspense } from "react";
    export default function ClientCache() {
      const { data, error } = useSuspenseQuery(query);
      if (error) return <p>Error :</p>;
      return (
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <CompanyInfo data={data} />;
          </Suspense>
        </div>
      );
    }
    ```

16. Update src/app/page.tsx

    ```tsx
    import ClientCache from "@/components/ClientCache";
    import ServerCache from "@/components/ServerCache";
    export default function Home() {
      return (
        <div className="flex flex-col gap-4">
          <ServerCache />
          <ClientCache />
        </div>
      );
    }
    ```

17. Run the app locally and visit the page at `http://localhost:3000`

    ```
    npm run dev
    ```
