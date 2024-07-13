import * as yup from "yup";
import { Enums } from "~/types/supabase";

yup.addMethod(yup.string, "postcode", function (message: string) {
  return this.test("is-postcode", message, (value) => {
    const postcodeRegex = /^[A-Za-z0-9]{3,}$/;
    return postcodeRegex.test(value || "");
  });
});

export const TOOLTIP_SHOW = { show: 500, hide: 0 };
export const TOKEN_KEY = "supabase-token";
export const STATUSES: Enums<"status">[] = ["draft", "pending", "paid"];

export const validString = yup.string().trim();

export const validEmail = validString.email("Invalid email address");

export const constants = {
  validString,
  validEmail,
};
