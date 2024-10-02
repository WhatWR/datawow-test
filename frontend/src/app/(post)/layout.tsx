import Navbar from "@/app/components/navbar";
import Sidebar from "@/app/components/sideBar";
import React from "react";

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        <Navbar/>
        <div style={{display: "flex"}}>
            {/* Sidebar */}
            <Sidebar/>

            {/* Main Content */}
            <div style={{flexGrow: 1}}>
                {children}
            </div>
        </div>
        </body>
        </html>
    );
}