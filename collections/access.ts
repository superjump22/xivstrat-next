import type { User } from "@/payload-types";

/**
 * 检查用户是否有指定角色之一
 */
export const checkRoles = (
  user: User | null = null,
  allRoles: User["roles"] = [],
): boolean => {
  if (user) {
    if (
      allRoles.some((role) => {
        return user.roles?.some((individualRole) => {
          return individualRole === role;
        });
      })
    ) {
      return true;
    }
  }
  return false;
};

type SignedInUser =
  | (User & {
      collection: "users";
    })
  | null;

/**
 * 任何人（无论是否登录）
 */
export const anyone = () => true;

/**
 * 任何用户
 */
export const authenticated = ({
  req: { user },
}: {
  req: { user: SignedInUser };
}) => Boolean(user);

/**
 * 任何用户, 同 {@link authenticated}
 */
export const users = authenticated;

/**
 * 任何编辑者
 */
export const editors = ({ req: { user } }: { req: { user: SignedInUser } }) =>
  checkRoles(user, ["editor"]);

/**
 * 任何管理员
 */
export const admins = ({ req: { user } }: { req: { user: SignedInUser } }) =>
  checkRoles(user, ["admin"]);

/**
 * 任何管理员或编辑者
 */
export const staffs = ({ req: { user } }: { req: { user: SignedInUser } }) =>
  checkRoles(user, ["admin", "editor"]);

/**
 * 任何管理员或编辑者，同 {@link staffs}
 */
export const adminsOrEditors = staffs;

/**
 * 仅本人
 */
export const self = ({ req: { user } }: { req: { user: SignedInUser } }) => {
  if (!user) return false;
  return { id: { equals: user.id } };
};

/**
 * 管理员或本人（管理员拥有完全权限，其他用户仅能操作自己的文档）
 */
export const adminsOrSelf = ({
  req: { user },
}: {
  req: { user: SignedInUser };
}) => {
  if (!user) return false;
  if (checkRoles(user, ["admin"])) return true;
  return { id: { equals: user.id } };
};
