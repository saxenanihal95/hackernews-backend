function feed(parent, args, context, info) {
  return context.prisma.links();
}

function link(parent, args, context) {
  const { id } = args;
  return getLink(id, context);
}

const getLink = async (id, context) => {
  return await context.prisma.link({ id });
};

module.exports = {
  feed,
  link
};
