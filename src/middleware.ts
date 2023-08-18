import { authMiddleware } from "@clerk/nextjs";
export default authMiddleware({
  publicRoutes: ["/", "/api/links"],
  //   authorizedParties: ["root", "user1"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

// import { getAuth } from "@clerk/nextjs/server";
// import { authMiddleware } from "@clerk/nextjs";
// export default authMiddleware({
//   publicRoutes: ["/", "/api/links"],
//   async beforeRender() {},
// });

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };
