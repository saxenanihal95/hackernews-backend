const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client");

const getLink = async (id, context) => {
  return await context.prisma.link({ id });
};

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    link: (parent, args, context) => {
      const { id } = args;
      return getLink(id, context);
    },
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
    updateLink: async (parent, args, context) => {
      const { id, ...rest } = args;
      const updatedLink = await context.prisma.updateLink({
        data: { ...rest },
        where: { id }
      });
      return updatedLink;
    },
    deleteLink: async (parent, args, context) => {
      const { id } = args;
      const deletedElement = await context.prisma.deleteLink({ id });
      return deletedElement;
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: { prisma }
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
