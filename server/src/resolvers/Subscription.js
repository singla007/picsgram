function newPostSubscribe(parent, args, context, info) {
  return context.pubsub.asyncIterator("NEW_POST")
}

const newPost = {
  subscribe: newPostSubscribe,
  resolve: payload => {
    return payload
  },
}

function newLikeSubscribe(parent, args, context, info) {
  return context.pubsub.asyncIterator("NEW_LIKE")
}

const newLike = {
  subscribe: newLikeSubscribe,
  resolve: payload => {
    return payload
  },
}

module.exports = {
  newPost,
  newLike
}