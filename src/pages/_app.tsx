import { type AppType } from "next/app";
import Head from "next/head";
import { ClerkProvider } from "@clerk/nextjs";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>宝子链接</title>
        <meta charSet="UTF-8" />
        <meta name="description" content="Generated by create-t3-app" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
          crossOrigin="anonymous"
        />
        {/* <link rel="stylesheet" type="text/css" href="custom.css" /> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ClerkProvider {...pageProps}>
        <Container
          fluid
          data-bs-theme="dark"
          className="bg-primary-subtle text-light py-5"
        >
          <Row className="justify-content-md-center">
            <Col xs={10} lg={8}>
              <Component {...pageProps} />
            </Col>
          </Row>
        </Container>
      </ClerkProvider>
    </>
  );
};

export default MyApp;
