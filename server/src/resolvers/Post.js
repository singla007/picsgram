function createdBy(parent, args, context) {
  // console.log("post createdBy")
  const abc= context.prisma.post
  .findUnique({where: {id: parent.id}})
  .createdBy();
  // console.log(abc)
  return abc
}

function likes(parent, args, context) {
  //console.log("post likes")
  //console.log(parent)
  return context.prisma.post
    .findUnique({where: {id: parent.id}})
    .likes();
}

module.exports = {
  createdBy,
  likes
};
