export class RResponse{

  public static SUCCESS : number  =  200;

  public static EMAIL_INVALID : number  =  4001;

  public static REQUEST_ACCEPTED :   number  = 202;



  public static UNAUTHORIZED : number  = 401;



  public static SERVER_ERROR : number  = 500;

  public static PAYSTACK_ERROR : number  = 505;

  //BAD REQUEST
  public static BAD_REQUEST : number  = 400;


  /// NOT FOUNDS
  public static RESOURCE_NOT_FOUND: number = 404;
  public static SETTINGS_NOT_FOUND: number = 1041;


  public  status : number;

  public code : number;

  public message : string;

  public body : Object;


  constructor(status: number, message : string, body? : Object)
  constructor(status: number, code : number, message :  string, body? : Object)
  constructor(status: number, code_message :  any, body_message : any, body? : Object){

    this.status = status;

    if(typeof code_message  === "number")
      this.code = code_message;
    else
      this.message = code_message;

    if(typeof body_message  === "string")
      this.message = body_message;
    else
      this.body = body_message;

    if(typeof body !== "undefined")
      this.body= body;

    if(typeof this.code == "undefined")
      this.code = this.status;
  }


  /**
   *
   * @returns Object
   * @depreciated use toJson() instead
   */
  public toObject() : Object {
    if(typeof this.body === "undefined")
      return {code : this.code, message : this.message};
    else
      return {code : this.code, message : this.message, body : this.body};
  }


  public toJson() : Object {
    if(typeof this.body === "undefined")
      return {code : this.code, message : this.message};
    else
      return {code : this.code, message : this.message, body : this.body};
  }


  public toString(){
    if(typeof this.body === "undefined")
      return "code = " +  this.code + ", message = " + this.message;
    else
      return "code = " +  this.code + ", message = " + this.message + ", body = " + this.body;

  }


}
