const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client");

const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const User = require("./resolvers/User");
const Link = require("./resolvers/Link");
const { rule, shield, and, or } = require("graphql-shield");
const { getUser } = require("./utils");
const { ROLES } = require("./constants");

const resolvers = {
  Query,
  Mutation,
  User,
  Link
};

const isAuthenticated = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    return ctx.user !== null;
  }
);

const isAdmin = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    return ctx.user.role === ROLES.ADMIN;
  }
);

const isEditor = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    return ctx.user.role === ROLES.EDITOR;
  }
);

const permissions = shield({
  Mutation: {
    post: isAuthenticated,
    updateLink: and(isAuthenticated, or(isAdmin, isEditor)),
    deleteLink: and(isAuthenticated, isAdmin)
  }
});

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  middlewares: [permissions],
  context: async ctx => {
    return {
      ...ctx,
      user: await getUser(ctx, prisma),
      prisma
    };
  }
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
