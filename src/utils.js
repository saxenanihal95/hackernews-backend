const jwt = require("jsonwebtoken");
const APP_SECRET = "GraphQL-is-aw3some";

async function getUser(context, prisma) {
  const Authorization = context.request.get("Authorization");
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const { userId } = jwt.verify(token, APP_SECRET);
    const user = await prisma.user({ id: userId });
    return user;
  }
  return null;
}

module.exports = {
  APP_SECRET,
  getUser
};
