async function feed(parent, args, context, info) {
  const where = args.filter
    ? {
      OR: [
        {description: {contains: args.filter}},
        {caption: {contains: args.filter}}
      ]
    }
    : {};

  const posts = await context.prisma.post.findMany({
    where,
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy
  });

  const count = await context.prisma.post.count({where});

  return {
    id: `main-feed:${JSON.stringify(args)}`,
    posts,
    count
  };
  
}

module.exports = {
  feed
};
