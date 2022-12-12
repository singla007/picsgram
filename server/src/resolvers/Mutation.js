const dotenv = require('dotenv/config');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET } = require('../utils');
const { createWriteStream } = require('fs')
const { parse, join } = require("path");

async function createPost(parent, args, context, info) {
  const { userId } = context;

  let createdBy = undefined
  if (userId) {
    createdBy = { connect: { id: userId } }
  }
  const { createReadStream, filename } = await args.file;
  const stream = createReadStream();
  var { ext, name } = parse(filename);
  name = `single${Math.floor((Math.random() * 10000) + 1)}`;
  let url = join(__dirname, `../Upload/${name}-${Date.now()}${ext}`);
  const imageStream = await createWriteStream(url)
  await stream.pipe(imageStream);
  const baseUrl = process.env.BASE_URL || 'http:localhost:'
  const port = process.env.PORT || '3001'
  tempurl = `${baseUrl}${port}${url.split('Upload')[1]}`;

  imageUrl = url.split('Upload')[1] || "/default.jpg"

  const newPost = await context.prisma.post.create({
    data: {
      caption: args.caption,
      description: args.description,
      createdBy,
      imageUrl
      // filename: filename,
      // filetype:mimetype,
      // path: temppath,
    }

  });

  context.pubsub.publish('NEW_POST', newPost); //publishing a new post with caption description and id all other fields are set after in feed query data resolve

  return newPost;
}

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);

  if (args?.name === '' || args?.email === '' || args?.password === '') {
    throw new Error('can not create user with these parameters');
  }
  const user = await context.prisma.user.create({
    data: { ...args, password }
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
}

async function login(parent, args, context, info) {

  const user = await context.prisma.user.findUnique({
    where: { email: args.email }
  });
  if (!user) {
    throw new Error('user not found with given email id');
  }

  const valid = await bcrypt.compare(
    args.password,
    user.password
  );
  if (!valid) {
    throw new Error('Invalid password for given user');
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
}

async function like(parent, args, context, info) {
  const { userId } = context;
  const like = await context.prisma.like.findUnique({
    where: {
      postId_userId: {
        postId: args.postId,
        userId: userId
      }
    }
  });

  if (Boolean(like)) {
    throw new Error(
      `Already Liked for Post: ${args.postId}`
    );
  }

  const newLike = context.prisma.like.create({
    data: {
      user: { connect: { id: userId } },
      post: { connect: { id: args.postId } }
    }
  });
  context.pubsub.publish('NEW_LIKE', newLike);

  return newLike;
}

module.exports = {
  createPost,
  signup,
  login,
  like
};
