type SubmissionCountArgs = { where?: { id?: string }, cursor?: { id: string } };
type SubmissionDelegate = {
    count(args?: SubmissionCountArgs): Promise<number>;
};
interface PrismaModelDelegate {
    count(args?: never): Promise<number>;
}
const delegate: SubmissionDelegate = { count: async () => 0 };
const wrap: PrismaModelDelegate = delegate;
