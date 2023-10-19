export default interface IRoleService {
  seedRole(): Promise<unknown>;
    seedPermission(): Promise<unknown>;

}
