export default interface IEntity {
  id?: number;
  setData(data: object): this;
  setDescription?(data: object): this;
  insert(): Promise<this>;
  update(): Promise<this>;
  delete(): Promise<this>;
}
