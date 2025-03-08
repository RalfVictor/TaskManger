import crypto from "node:crypto";

const hashToken = (Token) => {
  return crypto.createHash("sha256").update(Token.toString()).digest("hex");
};

export default hashToken;
