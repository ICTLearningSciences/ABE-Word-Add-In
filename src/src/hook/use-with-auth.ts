import { useWithSpfxLogin } from "abe-client";
import { UserRole } from "abe-client/dist/store/slices/login";
import React, { useEffect, useState } from "react";

export function useWithAuth() {
    const {setUser} = useWithSpfxLogin();
    useEffect(() => {
        setUser({
            accessToken: process.env.REACT_APP_ACCESS_TOKEN,
            expirationDate: new Date().toISOString(),
            user: {
                _id: "66f2156364d82c54c8d33f56",
                googleId: "microsoft-ashiel@ict.usc.edu",
                name: "Aaron Shiel",
                email: "ashiel@ict.usc.edu",
                userRole: UserRole.USER,
                lastLoginAt: new Date()
            }
        })
    }, []);

}
