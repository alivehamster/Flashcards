import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import { pool } from "../libs/db";
import bcrypt from "bcrypt";
import { signupValidate } from "../libs/utils";
import evalidator from "email-validator";

export const server = {
  createDeck: defineAction({
    input: z.object({
      title: z.string(),
      deck: z.array(
        z.object({
          side1: z.string(),
          side2: z.string(),
        })
      ),
    }),
    handler: async (input) => {
      pool.execute("INSERT INTO Decks (UserId, Title) VALUES (?, ?)", [
        1,
        input.title,
      ]);
      return "success";
    },
  }),

  logout: defineAction({
    handler: async (input, context) => {
      try {
        context.session?.destroy();
        return {
          status: "success",
        };
      } catch (error) {
        console.warn(error);
        return {
          status: "error",
          message: "Logout failed",
        };
      }
    },
  }),

  signup: defineAction({
    input: z.object({
      email: z.string(),
      username: z.string().min(1),
      password: z.string().min(1),
    }),
    handler: async (input, context) => {
      try {
        const validate = await signupValidate(
          input.email,
          input.username,
          input.password
        );
        if (validate) {
          return { status: "error", message: validate };
        } else {
          const hash = await bcrypt.hash(
            input.password,
            Number(process.env.SALT_ROUNDS)
          );
          const [result] = await pool.execute(
            "INSERT INTO Accounts (Email, Username, PasswordHash) VALUES (?, ?, ?)",
            [input.email, input.username, hash]
          );
          const insertResult = result as any;
          context.session?.set("userid", insertResult.insertId.toString());
          return {
            status: "successful",
          };
        }
      } catch (error) {
        console.warn(error);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    },
  }),
  login: defineAction({
    input: z.object({
      username: z.string().min(1).max(50),
      password: z.string().min(1).max(1000),
    }),
    handler: async (input, context) => {
      try {
        let acc;
        const isEmail = evalidator.validate(input.username);
        const query = isEmail
          ? "SELECT UserId, Username, PasswordHash FROM Accounts WHERE Email = ?"
          : "SELECT UserId, Username, PasswordHash FROM Accounts WHERE Username = ?";

        const [rows] = await pool.execute(query, [input.username]);
        const accounts = rows as any[];

        acc = accounts.length > 0 ? accounts[0] : "none";

        if (await bcrypt.compare(input.password, acc.password)) {
          context.session?.set("userid", acc._id.toString());
          return {
            status: "successful",
          };
        } else
          return {
            status: "error",
            message: "Invalid Username or Password",
          };
      } catch (error) {
        console.warn(error);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Server Error",
        });
      }
    },
  }),
};
