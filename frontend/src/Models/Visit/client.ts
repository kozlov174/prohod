type PublicVisitStatus = 'accept' | 'reject' | 'user_accept';
type PrivateVisitStatus = 'not_processed' | 'reject' | 'user_accept';
export type VisitStatus = PublicVisitStatus | PrivateVisitStatus;
