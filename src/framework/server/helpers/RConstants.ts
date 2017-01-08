/**
 * Created by EdgeTech on 3/13/2016.
 */

export class RConstants{
    public static PAYSTACK_API_INITIALIZE_ENDPOINT: string = "https://api.paystack.co/transaction/initialize";

    public static PAYSTACK_API_VERIFY_ENDPOINT: string = "https://api.paystack.co/transaction/verify";

    public static PAYSTACK_API_SECRET_KEY: string = "sk_test_c8e7320231e77381042d3626387544ad1282e55c";

    public static TRANSACTION_SUCCESSFUL = "_TY_RI_";

    public static TRANSACTION_FAILED = "_WD_PT_";

    public static EXTRAS_STORE_KEY: string = "_G12__6HU_";

    public static ACCOUNT_FUNDING_TRANSACTION: Object ={
        type : "Credit",
        summary : "Congrats, your account has been successfuly funded."
    };

    public static ACCOUNT_TRANSFER_TRANSACTION: Object ={
        type : "Credit",
        summary : "Congrats, your account has just been credited."
    }

    public static ACCOUNT_DEBIT_TRANSACTION: Object ={
        type : "Debit",
        summary : " Your account has just been debited."
    }
}
