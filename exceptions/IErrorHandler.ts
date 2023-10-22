import { ErrorInterface } from "./IErrors";
export class ErrorHandler extends Error {
  public status: number;
  public code: string;
  public errors: any;
  constructor(err: ErrorInterface) {
    super(err.message);
    this.status = err.status;
    this.name = this.constructor.name;
    this.code = err.code;
    this.errors = err.errors;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
