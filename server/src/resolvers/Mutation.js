const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET } = require('../utils');
const fs = require('fs')
const path = require('path');

async function createPost(parent, args, context, info) {
  const { userId } = context;

  const { createReadStream, filename, encoding, mimetype } = await args?.file;

  let createdBy = undefined
  if (userId) {
    createdBy = { connect: { id: userId } }
  }


  // Handling file to upload 

  console.log("in create post mutation to HANDLE FILE ")
  
  const temppath =  `./${filename}`;

  console.log(filename)
  console.log(mimetype)
  console.log(temppath)
  filestream = createReadStream()
  // fileStream.setEncoding('utf-8');

  // createReadStream().pipe(fs.createWriteStream(temppath));
  //const readStream = fs.createReadStream('hello.txt');
  const writeStream = fs.createWriteStream(temppath);
  
  fileStream.pipe(writeStream);
  // fileStream.on('error', function (err) {
  //   console.log(err);
  // })
  writeStream.on('end', () => {
    console.log('Data written to output.txt');
  });
  

  const newPost = await context.prisma.post.create({
    data: {
      caption: args.caption,
      description: args.description,
      createdBy,
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
