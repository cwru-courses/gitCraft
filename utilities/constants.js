const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const postStatus = ["public", "private"];
const userStatus = ["active", "pending"];

const requiredAttributes = {
  createUser: ["email", "name", "password"],
  editUser: ["password"],
  login: ["email", "password"],
  otp: ["email", "otp"],
  createPost: ["title", "description", "image", "status"],
  editPost: ["title", "description", "status", "image", "id"],
  getPost: ["status"],
  forgot: ["email"],
};

const optionalAttributes = ["editPost", "getPost"];

module.exports = {
  emailRegex,
  postStatus,
  userStatus,
  requiredAttributes,
  optionalAttributes,
};
