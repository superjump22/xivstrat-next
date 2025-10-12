import type { CollectionConfig } from "payload";
import { admins, adminsOrEditors, adminsOrSelf, anyone } from "./access";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    tokenExpiration: 86400 * 7, // How many seconds to keep the user logged in
    maxLoginAttempts: 10, // Automatically lock a user out after X amount of failed logins
    lockTime: 600 * 1000, // Time period to allow the max login attempts
    loginWithUsername: {
      requireEmail: true, // If set to true, an email address is required when creating a new user. If set to false, email is not required upon creation.
      allowEmailLogin: true, // If set to true, users can log in with either their username or email address. If set to false, users can only log in with their username.
    },
  },
  access: {
    create: anyone,
    read: adminsOrSelf,
    update: adminsOrSelf,
    delete: admins,
    unlock: admins,
    admin: adminsOrEditors,
  },
  fields: [
    {
      name: "roles",
      type: "select",
      hasMany: true,
      saveToJWT: true,
      required: true,
      defaultValue: ["user"],
      access: {
        create: admins,
        read: admins,
        update: admins,
      },
      options: [
        {
          label: "Admin",
          value: "admin",
        },
        {
          label: "Editor",
          value: "editor",
        },
        {
          label: "User",
          value: "user",
        },
      ],
      hooks: {
        beforeChange: [
          ({ value }) => {
            // 确保至少有一个`user`角色
            const roles = new Set(value || []);
            roles.add("user");
            return [...roles];
          },
        ],
      },
    },
  ],
  admin: {
    useAsTitle: "username",
    listSearchableFields: ["username", "email"],
    hidden: ({ user }) => {
      if (user?.roles?.includes("admin")) return false;
      return true;
    },
  },
};
