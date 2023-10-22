import { ErrorInterface } from "./IErrors";
import { ErrorHandler } from "./IErrorHandler";

export class AuthErrorHandler extends ErrorHandler {
  constructor(err: ErrorInterface) {
    super(err);
  }
  public static get InvalidCredentials(): ErrorInterface {
    return {
      status: 401,
      code: "INVALID_CREDENTIALS",
      message: "Invalid credentials",
    };
  }
  public static get InvalidResetToken(): ErrorInterface {
    return {
      status: 401,
      code: "INVALID_RESET_TOKEN",
      message: "Invalid reset token",
    };
  }
  public static get PasswordMismatch(): ErrorInterface {
    return {
      status: 422,
      code: "PASSWORD_MISMATCH",
      message: "Password mismatch",
    };
  }
  public static get InvalidPassword(): ErrorInterface {
    /**
     * Minimum 8 characters
     * At least one small and big letter
     * At least one special character
     */
    return {
      status: 422,
      code: "INVALID_PASSWORD_TYPE",
      message:
        "Incorrect user password type:\n\tMinimum 8 characters.\n\tAt least one small and big letter.\n\tAt least one special character",
    };
  }
  public static get TokenExprired(): ErrorInterface {
    return {
      status: 401,
      code: "TOKEN_EXPIRED",
      message: "Your session has expired please sign-in again",
    };
  }
  public static get RefreshTokenNotFound(): ErrorInterface {
    return {
      status: 401,
      code: "REFRESH_TOKEN_NOT_FOUND",
      message: "No refresh token found in headers",
    };
  }
  public static get SourceNotSpecified(): ErrorInterface {
    return {
      status: 400,
      code: "SOURCE_NOT_SPECIFIED",
      message: "Source not specified.",
    };
  }
  public static get ConfirmPasswordNotMatch(): ErrorInterface {
    return {
      status: 422,
      code: "CONFIRM_PASSWORD_NOT_MATCH",
      message: "Password and confirm password must be the same.",
    };
  }
  public static get SignatureOrAddressNotFound(): ErrorInterface {
    return {
      status: 404,
      code: "SIGNATURE_OR_PUBLIC_ADDRESS_NOT_FOUND",
      message: "Request should have signature and publicAddress.",
    };
  }
  public static get FailedSignatureVerification(): ErrorInterface {
    return {
      status: 400,
      code: "SIGNATURE_VERIFICATION_FAILED",
      message: "Signature verification failed.",
    };
  }
  public static get UnsupportedChain(): ErrorInterface {
    return {
      status: 401,
      code: "UNSUPPORTED_CHAIN",
      message: "Specified blockchain not supported",
    };
  }

  public static get Conflict(): ErrorInterface {
    return {
      status: 409,
      code: "CONFLICT",
      message: "User already exist",
    };
  }

  public static get InternalServerError(): ErrorInterface {
    return {
      status: 409,
      code: "CONFLICT",
      message: "User already exist",
    };
  }
}
