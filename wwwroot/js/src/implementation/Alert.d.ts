export interface Alert {
    message: string;
    type: AlertType;
}
declare enum AlertType {
    Success = 0,
    Error = 1
}
export {};
