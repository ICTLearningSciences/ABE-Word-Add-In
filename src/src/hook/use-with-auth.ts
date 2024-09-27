import { useWithSpfxLogin } from "abe-client";
import React, { useEffect, useState } from "react";
import { UserRole } from "../types";

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
