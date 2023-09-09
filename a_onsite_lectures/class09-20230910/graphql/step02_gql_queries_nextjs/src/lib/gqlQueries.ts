import { gql } from "@apollo/client";

export const launchesQuery = gql`
    query Launches {
      launches {
        id
        details
        mission_name
        rocket {
          rocket_name
          rocket_type
        }
      }
    }
  `;