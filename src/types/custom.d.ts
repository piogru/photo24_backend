// declare global {
//   namespace Express {
//     interface Request {
//       user?: UserInfo | null;
//     }
//   }
// }

declare namespace Express {
  interface Request {
    user?: UserInfo | null;
  }
}
