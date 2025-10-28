import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import { getConnection } from "../libs/db";
import bcrypt from "bcryptjs";
import { signupValidate } from "../libs/utils";
import evalidator from "email-validator";

export const server = {
  createDeck: defineAction({
    input: z.object({
      title: z.string().min(1),
      deck: z.array(
        z.object({
          side1: z.string(),
          side2: z.string(),
        })
      ),
    }),
    handler: async (input, context) => {
      try {
        if(input.title.length > 100) {
          return { status: "error", message: "Title too long" };
        }
        const userId = await context.session?.get("userid");
        if (!userId) {
          return { status: "error", message: "Not authenticated" };
        }

        const connection = await getConnection(context);

        const [deckResult] = await connection.execute(
          "INSERT INTO Decks (UserId, Title, Length) VALUES (?, ?, ?)",
          [userId, input.title, input.deck.length]
        );
        const deckInsertResult = deckResult as any;
        const deckId = deckInsertResult.insertId;

        for (let i = 0; i < input.deck.length; i++) {
          const card = input.deck[i];
          await connection.execute(
            "INSERT INTO Cards (DeckId, Position, Front, Back) VALUES (?, ?, ?, ?)",
            [deckId, i + 1, card.side1, card.side2]
          );
        }

        await connection.end();

        return { status: "success" };
      } catch (error) {
        console.warn(error);
        return { status: "error", message: "Failed to create deck" };
      }
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
        const connection = await getConnection(context);

        const validate = await signupValidate(
          input.email,
          input.username,
          input.password,
          connection
        );
        if (validate) {
          await connection.end();;
          return { status: "error", message: validate };
        } else {
          const hash = await bcrypt.hash(
            input.password,
            Number(process.env.SALT_ROUNDS)
          );
          const [result] = await connection.execute(
            "INSERT INTO Accounts (Email, Username, PasswordHash) VALUES (?, ?, ?)",
            [input.email, input.username, hash]
          );
          const insertResult = result as any;
          context.session?.set("userid", insertResult.insertId.toString());
          await connection.end();;
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
      username: z.string().min(1).max(1000),
      password: z.string().min(1).max(1000),
    }),
    handler: async (input, context) => {
      try {
        let acc;
        const isEmail = evalidator.validate(input.username);
        const query = isEmail
          ? "SELECT UserId, Username, PasswordHash FROM Accounts WHERE Email = ?"
          : "SELECT UserId, Username, PasswordHash FROM Accounts WHERE Username = ?";

        const connection = await getConnection(context);
        const [rows] = await connection.execute(query, [input.username]);
        const accounts = rows as any[];
        await connection.end();;

        if (accounts.length > 0) {
          acc = accounts[0];
        } else {
          return { status: "error", message: "Invalid Username or Password" };
        }

        if (await bcrypt.compare(input.password, acc.PasswordHash)) {
          context.session?.set("userid", acc.UserId.toString());
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
