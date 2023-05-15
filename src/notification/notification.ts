export interface INotificationService {
  sendMessage(message: string): Promise<void>;
}
