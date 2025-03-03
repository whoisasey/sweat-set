/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";

const AuthProvider = ({ children }: any) => {
	return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;
