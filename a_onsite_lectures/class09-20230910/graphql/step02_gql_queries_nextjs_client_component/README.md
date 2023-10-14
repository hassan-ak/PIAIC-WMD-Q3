# GraphQL queries in Next.js 13 (Client Components)

1. Create a next app.

   ```
   npx create-next-app@latest
   ```

2. We are going to use graphql api created by space x. The said api is assessable at `https://main--spacex-l4uc6p.apollographos.net/graphql`

3. Install qraphql and apollo client in the app

   ```
   npm install graphql
   npm install @apollo/client
   ```

4. Create `src/lib/gqlProvider.tsx` to define apollo client and gql provider

   ```tsx
   "use client";
   import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
   const client = new ApolloClient({
     uri: "https://main--spacex-l4uc6p.apollographos.net/graphql",
     cache: new InMemoryCache(),
   });
   interface IGraphQlProviderProps {
     children: React.ReactNode;
   }
   const GraphQlProvider: React.FC<IGraphQlProviderProps> = ({ children }) => {
     return <ApolloProvider client={client}>{children}</ApolloProvider>;
   };
   export default GraphQlProvider;
   ```

5. Update `src/app/layout.tsx` to wrap the app with apollo provider

   ```tsx
   import "./globals.css";
   import type { Metadata } from "next";
   import { Inter } from "next/font/google";
   import GraphQLProvider from "../lib/gqlProvider";
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
           <GraphQLProvider>{children}</GraphQLProvider>
         </body>
       </html>
     );
   }
   ```

6. Create `src/lib/gqlQueries.ts` to define query

   ```ts
   import { gql } from "@apollo/client";
   export const companyQuery = gql`
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
   `;
   ```

7. Create `src/components/ComapnyInfo.tsx`

   ```tsx
   "use client";
   import { companyQuery } from "@/lib/gqlQueries";
   import { useQuery } from "@apollo/client";
   import Link from "next/link";
   import React from "react";
   export const CompanyInfo = () => {
     const { loading, error, data } = useQuery(companyQuery);
     if (loading) return <p>Loading...</p>;
     if (error) return <p>Error :</p>;
     return (
       <div className="p-4 max-w-xl mx-auto bg-white rounded-lg shadow-lg text-gray-700">
         <h1 className="text-2xl font-semibold mb-4">SpaceX Information</h1>
         <p>
           <strong>Name:</strong> {data.company.name}
         </p>
         <p>
           <strong>CEO:</strong> {data.company.ceo}
         </p>
         <p>
           <strong>COO:</strong> {data.company.coo}
         </p>
         <p>
           <strong>Founded:</strong> {data.company.founded}
         </p>
         <p>
           <strong>Employees:</strong> {data.company.employees}
         </p>
         <p>
           <strong>Headquarters:</strong> {data.company.headquarters.address},{" "}
           {data.company.headquarters.city}, {data.company.headquarters.state}
         </p>
         <p>
           <strong>Summary:</strong> {data.company.summary}
         </p>
         <p>
           <strong>Valuation:</strong> ${data.company.valuation}
         </p>
         <p>
           <strong>Number of Launch Sites:</strong> {data.company.launch_sites}
         </p>
         <p>
           <strong>Number of Test Sites:</strong> {data.company.test_sites}
         </p>
         <p>
           <strong>Number of Vehicles:</strong> {data.company.vehicles}
         </p>
         <p>
           <strong>Links:</strong>
         </p>
         <ul>
           <li>
             <Link
               href={data.company.links.elon_twitter}
               className="text-blue-500 hover:underline"
               target="_blank"
               rel="noopener noreferrer"
             >
               Elon Musk&#39;s Twitter
             </Link>
           </li>
           <li>
             <Link
               href={data.company.links.flickr}
               className="text-blue-500 hover:underline"
               target="_blank"
               rel="noopener noreferrer"
             >
               SpaceX Flickr
             </Link>
           </li>
           <li>
             <Link
               href={data.company.links.twitter}
               className="text-blue-500 hover:underline"
               target="_blank"
               rel="noopener noreferrer"
             >
               SpaceX Twitter
             </Link>
           </li>
           <li>
             <Link
               href={data.company.links.website}
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

8. Update `src/app/page.tsx`

   ```tsx
   import { CompanyInfo } from "@/components/ComapnyInfo";
   export default function LaunchesPage() {
     return (
       <div>
         <CompanyInfo />
       </div>
     );
   }
   ```

9. Run the app locally and visit the page at `http://localhost:3000`
   ```
   npm run dev
   ```