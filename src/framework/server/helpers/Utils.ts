import {RResponse} from './RResponse';
import * as crypto from "crypto";

export interface ParamError{
	code : number;
	message? : string;
}
export class Utils {

	public static checkParams(param,paramRequired) : ParamError {

		for(var required in paramRequired){
			var paramKey = paramRequired[required];
			if(!param.hasOwnProperty(paramKey) || param[paramKey].length === 0 )
				return {
					code : 401,
					message : 'param ' + paramRequired[required]  + ' is required'
					}
		}

		return {code: RResponse.SUCCESS};


	}

	


	public static generateRandomID(length) : String {

		return crypto.randomBytes(length/2).toString('hex');
	}




	public static daysBetween(date1,date2){

		//Get 1 day in milliseconds
		var one_day=1000*60*60*24;

		// Convert both dates to milliseconds
		var date1_ms = date1.getTime();
		var date2_ms = date2.getTime();

		// Calculate the difference in milliseconds
		var difference_ms = date1_ms - date2_ms;

		// Convert back to days and return
		return Math.round(difference_ms/one_day);

	}


	public  static stripHTMLTags(text){
		return text.replace(/<(?:.|\n)*?>/gm,"");
	}



	public static noCache(req, res, next) {
		res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
		res.header('Expires', '-1');
		res.header('Pragma', 'no-cache');
		next();
	}

	

	

}