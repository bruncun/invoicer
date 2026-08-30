import type { AuthProvider as AuthBindings } from "@refinedev/core";
import { getTokenFromRequest, isTokenExpired } from "~/utility/auth/token";

const authRequest = async (
  operation: string,
  values: Record<string, unknown> = {},
  request?: Request
) => {
  const response = await fetch(
    request ? new URL("/api/auth", request.url).toString() : "/api/auth",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(request?.headers.get("Cookie")
          ? { Cookie: request.headers.get("Cookie") as string }
          : {}),
      },
      body: JSON.stringify({ operation, ...values }),
    }
  );
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? "Authentication failed");
  return result.data;
};

export const authProvider: AuthBindings = {
  login: async (params) => {
    const { email, password } = params ?? {};
    const data = await authRequest(
      email === undefined && password === undefined ? "demo-login" : "login",
      email === undefined && password === undefined ? {} : { email, password }
    );

    if (data?.session) {
      return {
        success: true,
        redirectTo: "/invoices",
      };
    }

    return {
      success: true,
    };
  },
  logout: async () => {
    await authRequest("logout");

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
    if (isTokenExpired(getTokenFromRequest(request))) {
      return unauthenticated(request);
    }

    const { user } = await authRequest("check", {}, request);

    if (user)
      return {
        authenticated: true,
      };

    return unauthenticated(request);
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

function unauthenticated(request?: Request) {
  const pathname = request
    ? new URL(request.url).pathname
    : window.location.pathname;

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
