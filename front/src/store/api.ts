import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

const Base_URL=process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api= createApi({
       baseQuery:fetchBaseQuery({
           baseUrl:Base_URL,
           credentials:"include",
        }),
        tagTypes: ["User"],
        endpoints:(builder)=>({

        })
});