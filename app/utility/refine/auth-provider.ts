import type { AuthProvider as AuthBindings } from "@refinedev/core";
import * as cookie from "cookie";
import Cookies from "js-cookie";
import { TOKEN_KEY } from "~/constants";

const authRequest = async (operation: string, values: Record<string, unknown> = {}) => {
  const response = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ operation, ...values }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? "Authentication failed");
  return result.data;
};

export const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    const data = await authRequest("login", { email, password });

    if (data?.session) {
      Cookies.set(TOKEN_KEY, data.session.access_token);
      return {
        success: true,
        redirectTo: "/",
      };
    }

    return {
      success: true,
    };
  },
  logout: async () => {
    await authRequest("logout");

    Cookies.remove(TOKEN_KEY);
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  register: async ({ email, password }) => {
    try {
      const data = await authRequest("register", { email, password });

      if (data)
        return {
          success: true,
          redirectTo: "/",
        };
    } catch (error: any) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: false,
      error: {
        message: "Register failed",
        name: "Invalid email or password",
      },
    };
  },
  onError: async (error) => error,
  check: async (request) => {
    let token = undefined;
    if (request) {
      const hasCookie = request.headers.get("Cookie");
      if (hasCookie) {
        const parsedCookie = cookie.parse(request.headers.get("Cookie"));
        token = parsedCookie[TOKEN_KEY];
      }
    } else {
      const parsedCookie = Cookies.get(TOKEN_KEY);
      token = parsedCookie;
    }

    const pathname = request
      ? new URL(request.url).pathname
      : window.location.pathname;

    if (!token) {
      return {
        authenticated: false,
        error: {
          message: "Check failed",
          name: "Unauthenticated",
        },
        logout: true,
        redirectTo: `/login?to=${pathname}`,
      };
    }

    if (request) {
      return { authenticated: true };
    }

    const { user } = await authRequest("check");

    if (user)
      return {
        authenticated: true,
      };

    return {
      authenticated: false,
      error: {
        message: "Check failed",
        name: "Unauthenticated",
      },
      logout: true,
      redirectTo: `/login?to=${pathname}`,
    };
  },
  forgotPassword: async ({ email }) => {
    try {
      const data = await authRequest("reset", { email });

      if (data)
        return {
          success: true,
        };
    } catch (error: any) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: false,
      error: {
        message: "Forgot password failed",
        name: "Invalid email",
      },
    };
  },
  updatePassword: async ({ password }) => {
    try {
      const data = await authRequest("update-password", { password });

      if (data)
        return {
          success: true,
          redirectTo: "/",
        };
    } catch (error: any) {
      return {
        success: false,
        error,
      };
    }
    return {
      success: false,
      error: {
        message: "Update password failed",
        name: "Invalid password",
      },
    };
  },
  getPermissions: async () => {
    const user = await authRequest("identity");
    return user?.role ?? null;
  },
  getIdentity: async () => {
    const data = await authRequest("identity");

    if (data?.user)
      return {
        ...data.user,
        name: data.user.email,
      };

    return null;
  },
};
