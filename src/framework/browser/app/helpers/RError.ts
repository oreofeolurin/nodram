import {RResponse} from './RResponse';


export class RError extends RResponse{

  constructor(err: Error);
  constructor(status : number, message :  string);
  constructor(err : RError, message :  string);
  constructor(status : number, code: number, message :  string);
  constructor(status_err : any, code_message?: any, message? : string){

    let status, code;

    if(typeof status_err === "number") {
      status = status_err;

      if(typeof code_message === "number")
        code = code_message;

      else if(typeof code_message === "string")
        message = code_message;
    }

    else if(status_err instanceof RError) {
      let error =  status_err;
      status = error.status;
      code = error.code;
      message = error.message + " - " + code_message;
    }


    else if(status_err instanceof Error) {
      let error =  RError.handleError(status_err);
      status = error.status;
      code = error.code;
      message = error.message;
    }



    super(status,code,message);

  }

  public static handleError(err){
    let code : number;
    let status : number;
    let message : string;

    if (err.code) {
      switch (err.code) {
        case 11000:
        case 11001:
          status = 400;
          code = 1103;
          message = "Email Already Exists";
          break;

        case "ENOENT":
          status = 500;
          code = 5001;
          message = "Connection Error";
          break;
        case "ETIMEDOUT":
          status = 504;
          code = 1401;
          message = "Server Timed Out";
          break;
        case "EPERM":
          status = 500;
          code = 5002;
          message = "File Operation not permitted";
          break;
        case "ETIMEDOUT":
          status = 500;
          code = 5003;
          message = "Connection Timed Out";
          break;
        default:
          status = 500;
          code = 500;
          message = err.message || "Service Unavailable";
      }
    } else {

      if(!err.errors) {
        status = 500;
        code = 500;
        message = err.message || err;
      }

      else {
        for (var errName in err.errors) {
          if (err.errors[errName].message) {
            status = 400;
            code = RResponse.BAD_REQUEST;
            message = err.errors[errName].message;
          }
          else {
            status = 500;
            code = 500;
            message = "Service Unavailable";
          }
        }
      }
    }

    return {status: status, code : code, message : message};
  }


  // ============================== BAD_REQUEST  1300 ==================================== //
  public static get UNKNOWN_USER(){
    return new RError(RResponse.BAD_REQUEST, 1301, "Unknown User");
  }

  public static get INVALID_TOKEN(){
    return new RError(RResponse.BAD_REQUEST, 1303, "Invalid Token");
  }

  public static get EMAIL_EXISTS(){
    return new RError(RResponse.BAD_REQUEST, 1103, "Email Already Exists");
  }

  public static get INVALID_PARAMETERS(){
    return new RError(RResponse.BAD_REQUEST, 1304, "Invalid Parameters");
  }

  public static get EXPIRED() {
    return new RError(RResponse.BAD_REQUEST, 1305, "Resource has expired");
  }
  public static get CARD_EXISTS(){
    return new RError(RResponse.BAD_REQUEST, 1306, "Card Already Exists");
  }

  public static get CARD_NOT_FOUND(){
    return new RError(RResponse.BAD_REQUEST, 1307, "Card Not Found");

  }

  public static get INVALID_AUTH_CODE(){
    return new RError(RResponse.BAD_REQUEST, 1308, "Invalid Authorization Code");
  }

  public static get NO_PHOTO_SPECIFIED(){
    return new RError(RResponse.BAD_REQUEST, 1309, "No photo was specified");

  }

  public static get UNKNOWN_DRIVER(){
    return new RError(RResponse.BAD_REQUEST, 1310, "Unknown Driver");
  }


  public static get UNKNOWN_OWNER(){
    return new RError(RResponse.BAD_REQUEST, 1311, "Unknown Owner");
  }


  public static get ACTION_NOT_ALLOWED(){
    return new RError(RResponse.BAD_REQUEST, 1312, "Action not allowed");
  }

  public static get UNKNOWN_VEHICLE(){
    return new RError(RResponse.BAD_REQUEST, 1313, "Unknown Vehicle");
  }



  // ============================== RESOURCE_NOT_FOUND 1400 ==================================== //
  public static get PHOTO_NOT_FOUND(){
    return new RError(RResponse.RESOURCE_NOT_FOUND, 1401, "Photo Not Found");

  }

  public static get DOCUMENT_NOT_FOUND(){
    return new RError(RResponse.RESOURCE_NOT_FOUND, 1402, "Document Not Found");

  }



  // ============================== UNAUTHORIZED 1000 ==================================== //

  public static get ACCOUNT_UNCONFIRMED(){
    return new RError(RResponse.UNAUTHORIZED, 1001, "Account Unconfirmed");
  }

  public static get ACCOUNT_UNAUTHORIZED(){
    return new RError(RResponse.UNAUTHORIZED, 1002, "Account Unauthorized to perform this action");
  }

  public static get INSUFFICIENT_FUND(){
    return new RError(RResponse.UNAUTHORIZED,1003, "Insufficient Fund");
  }

  public static get UNKNOWN_ACCOUNT(){
    return new RError(RResponse.UNAUTHORIZED, 1004, "Account Not Found");
  }

  public static get INVALID_PASSWORD(){
    return new RError(RResponse.UNAUTHORIZED, 1005, "Invalid Password");
  }


  // ============================== RESOURCE_NOT_FOUND 1500 ==================================== //

  public static get SERVICE_UNAVAILABLE(){
    return new RError(RResponse.SERVER_ERROR, 1501, "Service Unavailable");
  }

  public static get INTERNET_UNAVAILABLE(){
    return new RError(RResponse.SERVER_ERROR, 1502, "Internet Unavailable");
  }

  public static get ERROR_STREAMING_IMAGE(){
    return new RError(RResponse.SERVER_ERROR, 1503, "Error Streaming Image");
  }

  public static get WRITE_OPERATION_FAILED(){
    return new RError(RResponse.SERVER_ERROR, 1503, "Couldn't write file to drive");
  }

  public static get FILE_NOT_FOUND_ON_DRIVE(){
    return new RError(RResponse.SERVER_ERROR, 1504, "No such file or directory on drive");
  }

  public static get CONNECTION_ERROR(){
    return new RError(RResponse.SERVER_ERROR, 1505, "Couldn't Connect to resource");
  }




}




function getErrorMessage(err): RError{
  var error : RError;

  if(err instanceof RError)
    error = err;

  else if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        error = RError.EMAIL_EXISTS;
        break;
      case "ENOENT":
      {
        if(err.syscall == "getaddrinfo")
          error = RError.INTERNET_UNAVAILABLE;
        else if(err.syscall == "unlink")
          error = RError.FILE_NOT_FOUND_ON_DRIVE;
        else
          error = RError.CONNECTION_ERROR;
        break;
      }
      default:
        error = RError.SERVICE_UNAVAILABLE;
        break;
    }
  } else {

    for (var errName in err.errors) {
      if (err.errors[errName].message)
        error = new RError(RResponse.BAD_REQUEST,err.errors[errName].message);
      else
        error = RError.SERVICE_UNAVAILABLE;
    }
  }

  return error;

}


