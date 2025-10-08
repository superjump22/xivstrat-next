import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "username",
    // hidden
    groupBy: true,
    listSearchableFields: ["username", "email"],
  },
  auth: {
    tokenExpiration: 86400 * 7, // How many seconds to keep the user logged in
    maxLoginAttempts: 10, // Automatically lock a user out after X amount of failed logins
    lockTime: 600 * 1000, // Time period to allow the max login attempts
    loginWithUsername: {
      allowEmailLogin: true, // If set to true, users can log in with either their username or email address. If set to false, users can only log in with their username.
      requireEmail: true, // If set to true, an email address is required when creating a new user. If set to false, email is not required upon creation.
    },
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
};
