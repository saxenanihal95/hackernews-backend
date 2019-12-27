const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client");

let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL"
  }
];

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    link: (parent, args) => links.find(({ id }) => id === args.id),
    feed: (root, args, context, info) => {
      return context.prisma.links();
    }
  },
  Mutation: {
    post: (root, args, context) => {
      return context.prisma.createLink({
        url: args.url,
        description: args.description
      });
    },
    updateLink: (parent, args) => {
      index = links.findIndex(({ id }) => id === args.id);
      if (index !== -1) {
        links[index] = { ...links[index], ...args };
        return links[index] || {};
      } else {
        return new Error("element not found");
      }
    },
    deleteLink: (parent, args) => {
      index = links.findIndex(({ id }) => id === args.id);
      if (index !== -1) {
        const deletedElement = links[index];
        links.splice(index, 1);
        return deletedElement;
      } else {
        return new Error("element not found");
      }
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: { prisma }
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
