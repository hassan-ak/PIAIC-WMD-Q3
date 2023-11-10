import { usersList } from "./data";

export const resolvers = {
  Query: {
    users: () => usersList,

    user: (_: any, args: { id: string }) =>
      usersList.find((user) => user.id === args.id),
  },
};
