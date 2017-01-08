export class Utils {

    public static timeHuman(ms: number): string {
        let x = ms / 1000;
        let seconds = x % 60;
        x /= 60;
        let minutes = x % 60;

        if (minutes >= 1) {
            return `${Math.round(minutes)}min ${parseFloat(<any>seconds).toFixed(2)}s`;
        } else {
            return `${parseFloat(<any>seconds).toFixed(2)}s`;
        }
    }


}