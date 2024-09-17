
import { AppProps } from "next/app";
import React from "react";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

export default function App({
  Component,
  pageProps,
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
