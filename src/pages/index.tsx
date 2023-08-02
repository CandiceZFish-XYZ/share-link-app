import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>宝子链接</title>
        <meta charSet="UTF-8" />
        <meta name="description" content="Generated by create-t3-app" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="d-flex h-100 text-center text-bg-dark">
        <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column m-5">
          <div>
            <h1 className="title">一起视频！</h1>
          </div>
          <div>
            <p className="lead">
              <a href="" className="btn btn-primary btn-lg fw-bold">
                加入
              </a>
            </p>
            <p className="lead">或复制这个网址并粘贴到浏览器： ...</p>
            <p>更新时间： ...</p>
          </div>
        </div>
      </main>
    </>
  );
}

// import { Html } from "next/document";
// import Head from "next/head";
// import Admin from "./admin";
// import Home from "./home";

// class MyDocument extends Document {
//   render() {
//     return (
//       <Html lang="zh-CN">
//         <Head>
//           <meta charSet="UTF-8" />
//           {/* Add any other custom meta tags, stylesheets, or scripts here */}
//         </Head>
//         <body>
//           <Home />
//           <Admin />
//         </body>
//       </Html>
//     );
//   }
// }

// export default MyDocument;
