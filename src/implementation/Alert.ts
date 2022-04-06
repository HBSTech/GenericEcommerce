export interface Alert {
    message: string
    type: AlertType
}
enum AlertType {
    Success = 0,
    Error
}