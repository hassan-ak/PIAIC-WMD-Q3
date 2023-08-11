# JWT Authentication in Next.js 13 API Route Handlers

- If you haven't yet finished tasks like creating a Next.js app, linking it with Vercel's PostgreSQL, configuring the database layout, executing migration queries, or using Drizzle Studio, please complete those [steps](./getting-started/README.md) first.

## Create API Route Handler to Handle User Registration

- As we are creating an application where a user can register.
- For user registration name, email and password is required, we also need to confirm the password.
- User will register through a form which will interact with the db through and api
- We have to validate user inputs on the form as well in the api so first define a validation schema using zod

1. Install `zod` for validation
   ```cmd
   npm i zod
   ```
2. Create `/src/lib/validations/user.schema.ts` to define validation schema for validating registration data and also define types
   ```ts
   import { z } from "zod";
   export const RegisterUserSchema = z
     .object({
       name: z
         .string({
           required_error: "Name is required",
         })
         .min(1, "Full name is required"),
       email: z
         .string({
           required_error: "Email is required",
         })
         .min(1, "Email is required")
         .email("Email is invalid"),
       photo: z.string().optional(),
       password: z
         .string({
           required_error: "Password is required",
         })
         .min(1, "Password is required")
         .min(8, "Password must be more than 8 characters")
         .max(32, "Password must be less than 32 characters"),
       passwordConfirm: z
         .string({
           required_error: "Confirm your password",
         })
         .min(1, "Confirm your password"),
     })
     .refine((data) => data.password === data.passwordConfirm, {
       path: ["passwordConfirm"],
       message: "Passwords do not match",
     });
   export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;
   ```
3. Create `/src/lib/helpers.ts` to define a function to return a Next.js API error response.
   ```ts
   import { ZodError } from "zod";
   import { NextResponse } from "next/server";
   export function getErrorResponse(
     status: number = 500,
     message: string,
     errors: ZodError | null = null
   ) {
     return new NextResponse(
       JSON.stringify({
         status: status < 500 ? "fail" : "error",
         message,
         errors: errors ? errors.flatten() : null,
       }),
       {
         status: status,
         headers: { "Content-Type": "application/json" },
       }
     );
   }
   ```
4. Install `bcryptjs` and its `types` for hashing user password
   ```cmd
   npm i bcryptjs
   npm i -D @types/bcryptjs
   ```
5. Create `src/app/api/auth/register/route.ts` to define an api endpoint for account registration
   ```ts
   import { ZodError } from "zod";
   import { hash } from "bcryptjs";
   import { db } from "@/lib/db/drizzle";
   import {
     RegisterUserInput,
     RegisterUserSchema,
   } from "@/lib/validations/user.schema";
   import { getErrorResponse } from "@/lib/helper";
   import { jwt_users } from "@/lib/db/schema/script";
   import { NextRequest, NextResponse } from "next/server";
   export async function POST(request: NextRequest) {
     try {
       const body = (await request.json()) as RegisterUserInput;
       const data = RegisterUserSchema.parse(body);
       const hashedPassword = await hash(data.password, 12);
       const user = await db
         .insert(jwt_users)
         .values({
           name: data.name,
           email: data.email,
           password: hashedPassword,
         })
         .returning();
       return new NextResponse(
         JSON.stringify({
           status: "success",
           data: { user: { ...user[0], password: undefined } },
         }),
         {
           status: 201,
           headers: { "Content-Type": "application/json" },
         }
       );
     } catch (error: any) {
       if (error instanceof ZodError) {
         return getErrorResponse(400, "failed validations", error);
       }
       if (error.code === "23505") {
         return getErrorResponse(409, "user with that email already exists");
       }
       return getErrorResponse(500, error.message);
     }
   }
   ```

### Create Function to Sign the JWTs

6. Update `.env` to include JWT secret key and expiration time
   ```.env
   JWT_SECRET_KEY="SECRET_KEY"
   JWT_EXPIRES_IN="JWT_EXPIRATION_TIME"
   ```
7. Update `/src/lib/helpers.ts` to include function to Get environment variables from the .env file
   ```ts
   type EnvVariableKey = "JWT_SECRET_KEY" | "JWT_EXPIRES_IN";
   export function getEnvVariable(key: EnvVariableKey): string {
     const value = process.env[key];
     if (!value || value.length === 0) {
       console.error(`The environment variable ${key} is not set.`);
       throw new Error(`The environment variable ${key} is not set.`);
     }
     return value;
   }
   ```
8. Install `jose`, it gives us the function to sign and verify jwt
   ```cmd
   npm i jose
   ```
9. Create `src/lib/token.ts` to define a function that sign the jwt
   ```ts
   import { SignJWT } from "jose";
   import { getEnvVariable } from "./helpers";
   export const signJWT = async (
     payload: { sub: string },
     options: { exp: string }
   ) => {
     try {
       const secret = new TextEncoder().encode(
         getEnvVariable("JWT_SECRET_KEY")
       );
       const alg = "HS256";
       return new SignJWT(payload)
         .setProtectedHeader({ alg })
         .setExpirationTime(options.exp)
         .setIssuedAt()
         .setSubject(payload.sub)
         .sign(secret);
     } catch (error) {
       throw error;
     }
   };
   ```

## Create API Route Handler to Handle User login

10. Update `/src/lib/validations/user.schema.ts` to define validation schema for user login data
    ```ts
    export const LoginUserSchema = z.object({
      email: z
        .string({
          required_error: "Email is required",
        })
        .min(1, "Email is required")
        .email("Email is invalid"),
      password: z
        .string({
          required_error: "Password is required",
        })
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters")
        .max(32, "Password must be less than 32 characters"),
    });
    export type LoginUserInput = z.infer<typeof LoginUserSchema>;
    ```
11. Create `src/app/api/auth/login/route.ts` to define an api endpoint to handle login
    ```ts
    import { eq } from "drizzle-orm";
    import { compare } from "bcryptjs";
    import { ZodError } from "zod";
    import { db } from "@/lib/db/drizzle";
    import { signJWT } from "@/lib/token";
    import { jwt_users } from "@/lib/db/schema/script";
    import { NextRequest, NextResponse } from "next/server";
    import { getEnvVariable, getErrorResponse } from "@/lib/helpers";
    import {
      LoginUserInput,
      LoginUserSchema,
    } from "@/lib/validations/user.schema";
    export async function POST(req: NextRequest) {
      try {
        const body = (await req.json()) as LoginUserInput;
        const data = LoginUserSchema.parse(body);
        const user = await db
          .select({
            user_id: jwt_users.user_id,
            password: jwt_users.password,
          })
          .from(jwt_users)
          .where(eq(jwt_users.email, data.email));
        if (!user[0] || !(await compare(data.password, user[0].password))) {
          return getErrorResponse(401, "Invalid email or password");
        }
        const JWT_EXPIRES_IN = getEnvVariable("JWT_EXPIRES_IN");
        const token = await signJWT(
          { sub: `${user[0].user_id}` },
          { exp: `${JWT_EXPIRES_IN}m` }
        );
        const response = new NextResponse(
          JSON.stringify({
            status: "success",
            token: token,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
        const tokenMaxAge = parseInt(JWT_EXPIRES_IN) * 60;
        const cookieOptions = {
          name: "token",
          value: token,
          httpOnly: true,
          path: "/",
          secure: process.env.NODE_ENV !== "development",
          maxAge: tokenMaxAge,
        };
        await Promise.all([
          response.cookies.set(cookieOptions),
          response.cookies.set({
            name: "logged-in",
            value: "true",
            maxAge: tokenMaxAge,
          }),
        ]);
        return response;
      } catch (error: any) {
        if (error instanceof ZodError) {
          return getErrorResponse(400, "failed validations", error);
        }
        return getErrorResponse(500, error.message);
      }
    }
    ```

### Create API Route Handlers to Handle logout and fetch user details

12. Create `src/app/api/auth/logout/route.ts` to define an api endpoint to handle logout
    ```ts
    import { NextRequest, NextResponse } from "next/server";
    export async function GET(req: NextRequest) {
      const response = new NextResponse(JSON.stringify({ status: "success" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
      await Promise.all([
        response.cookies.set({
          name: "token",
          value: "",
          maxAge: -1,
        }),
        response.cookies.set({
          name: "logged-in",
          value: "",
          maxAge: -1,
        }),
      ]);
      return response;
    }
    ```
13. Create `src/app/api/users/me/route.ts` to define an api endpoint to get user details
    ```ts
    import { eq } from "drizzle-orm";
    import { db } from "@/lib/db/drizzle";
    import { getErrorResponse } from "@/lib/helpers";
    import { jwt_users } from "@/lib/db/schema/script";
    import { NextRequest, NextResponse } from "next/server";
    export async function GET(req: NextRequest) {
      const userId = req.headers.get("X-USER-ID");
      if (!userId) {
        return getErrorResponse(
          401,
          "You are not logged in, please provide token to gain access"
        );
      }
      const user = await db
        .select()
        .from(jwt_users)
        .where(eq(jwt_users.user_id, Number(userId)));
      return NextResponse.json({
        status: "success",
        data: { user: { ...user[0], password: undefined } },
      });
    }
    ```

### Create Functions to Verify the JWTs

14. Update `src/lib/token.ts` and define a function that verify the jwt
    ```ts
    import { jwtVerify } from "jose";
    export const verifyJWT = async <T>(token: string): Promise<T> => {
      try {
        return (
          await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET_KEY)
          )
        ).payload as T;
      } catch (error) {
        console.log(error);
        throw new Error("Your token has expired.");
      }
    };
    ```

### Create a Next.js Middleware to Protect Routes

15. Create `src/middleware.ts` to define middleware for protecting routes
    ```ts
    import { verifyJWT } from "./lib/token";
    import { getErrorResponse } from "./lib/helpers";
    import { NextRequest, NextResponse } from "next/server";
    export async function middleware(request: NextRequest) {
      let token: string | undefined;
      if (request.cookies.has("token")) {
        token = request.cookies.get("token")?.value;
      } else if (request.headers.get("Authorization")?.startsWith("Bearer ")) {
        token = request.headers.get("Authorization")?.substring(7);
      }
      if (
        !token &&
        (request.nextUrl.pathname.startsWith("/api/users") ||
          request.nextUrl.pathname.startsWith("/api/auth/logout"))
      ) {
        return getErrorResponse(
          401,
          "You are not logged in. Please provide a token to gain access."
        );
      }
      const response = NextResponse.next();
      try {
        if (token) {
          const { sub } = await verifyJWT<{ sub: string }>(token);
          response.headers.set("X-USER-ID", sub);
        }
      } catch (error) {
        if (request.nextUrl.pathname.startsWith("/api")) {
          return getErrorResponse(
            401,
            "Token is invalid or user doesn't exists"
          );
        }
      }
      return response;
    }
    export const config = {
      matcher: ["/api/users/:path*", "/api/auth/logout"],
    };
    ```

### Test the JWT Authentication

35. Send a post request to `/api/auth/register` with the following body to register a new user
    ```json
    {
      "email": "admin@admin.com",
      "name": "Admin",
      "password": "password123",
      "passwordConfirm": "password123"
    }
    ```
36. Send a post request to `/api/auth/login` with the following body to login

    ```json
    {
      "email": "admin@admin.com",
      "password": "password123"
    }
    ```

37. Send a get request to `/api/users/me` to get details of the logged-in user, this only works when you are already logged-in
38. Send a get request to `/api/auth/logout` logout, this only works when you are already logged-in
