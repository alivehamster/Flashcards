import evalidator from "email-validator";

export async function signupValidate(
  email: string,
  username: string,
  password: string,
  connection: any
) {
  if (email.length > 1000) return "Email too long";
  else if (!evalidator.validate(email)) return "Invalid Email";
  else if (username.length > 50) return "Username too long";
  else if (username.includes("@")) return "@ symbol not allowed in username";
  else if (password.length > 1000) return "Password too long";
  
  const [emailRows] = await connection.query(
    "SELECT UserId FROM Accounts WHERE Email = ? COLLATE utf8mb4_unicode_ci",
    [email]
  );
  if ((emailRows as any[]).length > 0) return "Email Already in Use";
  
  const [usernameRows] = await connection.query(
    "SELECT UserId FROM Accounts WHERE Username = ? COLLATE utf8mb4_unicode_ci",
    [username]
  );
  if ((usernameRows as any[]).length > 0) return "Username Taken";
  
  return false;
}