import { ZodError } from "zod";

export interface ActionResult {
  success: boolean;
  message?: string;
}

export function successResult(message?: string): ActionResult {
  return message ? { success: true, message } : { success: true };
}

export function failureResult(message: string): ActionResult {
  return { success: false, message };
}

export function getErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? fallbackMessage;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}
