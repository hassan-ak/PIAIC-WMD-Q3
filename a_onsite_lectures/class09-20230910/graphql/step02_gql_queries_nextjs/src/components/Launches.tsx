"use client";
import { launchesQuery } from "@/lib/gqlQueries";
import { useQuery } from "@apollo/client";

import React from "react";

export const Launches = () => {
  const { loading, error, data } = useQuery(launchesQuery);
  console.log(data);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;
  return (
    <ul>
      {data.launches.map((launch: any) => (
        <li key={launch.id}>{launch.mission_name}</li>
      ))}
    </ul>
  );
};
