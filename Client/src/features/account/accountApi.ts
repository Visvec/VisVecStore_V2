import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { User } from "../../app/models/user";
import { loginSchema } from "../../lib/schemas/loginSchema";
import { router } from "../../app/routes/Routes";
import { toast } from "react-toastify";
import { ProfileFormData } from "../profile/profileTypes";


export const accountApi = createApi({
  reducerPath: "accountApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["UserInfo", "Profile"],
  endpoints: (builder) => ({
    login: builder.mutation<void, loginSchema>({
      query: (creds) => ({
        url: "login?useCookies=true",
        method: "POST",
        body: creds,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(accountApi.util.invalidateTags(["UserInfo"]));
        } catch (error) {
          console.log(error);
        }
      },
    }),

    register: builder.mutation<void, object>({
      query: (creds) => ({
        url: "account/register",
        method: "POST",
        body: creds,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Registration successful - you can now sign in!");
          router.navigate("/login");
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
    }),

    userInfo: builder.query<User, void>({
      query: () => "account/user-info",
      providesTags: ["UserInfo"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "account/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(accountApi.util.invalidateTags(["UserInfo"]));
        router.navigate("/");
      },
    }),

    // Profile related endpoints

    getProfile: builder.query<ProfileFormData, void>({
      query: () => "account/profile",
      providesTags: ["Profile"],
    }),

    updateProfile: builder.mutation<void, ProfileFormData>({
      query: (data) => ({
        url: "account/profile",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    uploadProfilePhoto: builder.mutation<{ photoUrl: string }, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "account/profile/photo",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useUserInfoQuery,
  useLazyUserInfoQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadProfilePhotoMutation,
} = accountApi;
