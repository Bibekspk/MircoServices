import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps }) => {
  return (
    <>
      <Header {...pageProps}></Header>
      <Component {...pageProps} />
    </>
  );
};

AppComponent.getInitialProps = async ({ Component, ctx }) => {
  const client = buildClient(ctx);
  const { data } = await client.get("/api/users/currentuser");
  let pageProps;
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  console.log("pageProps", pageProps);
  if (pageProps) {
    return {
      pageProps,
    };
  } else return data;
};

export default AppComponent;
